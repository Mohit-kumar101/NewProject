import type {
  PresentationDeckInput,
  PresentationSlide,
} from "@/lib/presentation/buildDeck";
import {
  buildCompareFromStress,
  buildSensitivityCallouts,
  buildTrendPoints,
  detectToolPack,
  formatInputs,
  packLabels,
  toMetric,
  usableBarPoints,
  usablePiePoints,
} from "@/lib/presentation/insights";

export type PresentationTemplateId = "executive" | "visual" | "analyst";

export type PresentationTemplate = {
  id: PresentationTemplateId;
  name: string;
  tagline: string;
  description: string;
  accent: string;
};

export const PRESENTATION_TEMPLATES: PresentationTemplate[] = [
  {
    id: "executive",
    name: "Executive Brief",
    tagline: "Board-ready clarity",
    description:
      "Cover, KPI, charts, sensitivity, and a decision close — built for quick stakeholder reviews.",
    accent: "#00B8D4",
  },
  {
    id: "visual",
    name: "Visual Story",
    tagline: "Illustrated narrative",
    description:
      "Story-led slides with artwork and charts — best for walking someone through the scenario.",
    accent: "#FF8C42",
  },
  {
    id: "analyst",
    name: "Analyst Deck",
    tagline: "Data-dense review",
    description:
      "Inputs, tables, dual charts, compare, and methodology — for deeper diligence.",
    accent: "#2979FF",
  },
];

export type StudioSlide = PresentationSlide & {
  art?: "growth" | "compass" | "shield" | "city" | "spark";
  kicker?: string;
  speakerNotes?: string;
  /** Cover / section hero number */
  heroStat?: { label: string; value: string };
  /** Compact value chips under the title */
  statStrip?: { label: string; value: string }[];
  /** Plain-language takeaway under charts or KPIs */
  insight?: string;
};

function metricStrip(
  primary: { label: string; value: string },
  metrics: { label: string; value: string }[],
  limit = 4
): { label: string; value: string }[] {
  const out = [{ label: primary.label, value: primary.value }];
  for (const m of metrics) {
    if (out.length >= limit) break;
    if (m.label === primary.label) continue;
    out.push({ label: m.label, value: m.value });
  }
  return out;
}

function pieInsight(
  points: { name: string; value: number; display: string }[],
  primaryLabel: string,
  primaryValue: string
): string {
  if (points.length < 2) {
    return `${primaryLabel}: ${primaryValue}`;
  }
  const total = points.reduce((s, p) => s + p.value, 0) || 1;
  const top = [...points].sort((a, b) => b.value - a.value)[0];
  const pct = Math.round((top.value / total) * 100);
  return `${top.name} is the largest share (${pct}% · ${top.display}). Headline: ${primaryLabel} ${primaryValue}.`;
}

function base(input: PresentationDeckInput) {
  const pack = detectToolPack(input);
  const labels = packLabels(pack);
  const metrics = input.rows.map((r) => toMetric(r.label, r.value));
  const primary = toMetric(input.primaryLabel, input.primaryValue);
  const piePoints = usablePiePoints(metrics, primary);
  const barPoints = usableBarPoints(primary, metrics);
  const linePoints = buildTrendPoints(primary);
  const callouts = buildSensitivityCallouts(input);
  const compare = input.compare ?? buildCompareFromStress(input);
  const dateLabel = new Date().toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const strip = metricStrip(
    { label: input.primaryLabel, value: input.primaryValue },
    metrics.map((m) => ({ label: m.label, value: m.value })),
    5
  );
  return {
    pack,
    labels,
    metrics,
    primary,
    piePoints,
    barPoints,
    linePoints,
    callouts,
    compare,
    dateLabel,
    inputs: formatInputs(input.inputs),
    strip,
    insight: input.insight,
  };
}

function endDownload(input: PresentationDeckInput): StudioSlide {
  const topRows = input.rows.slice(0, 4);
  return {
    id: "end-download",
    kind: "download",
    title: "Download this presentation",
    subtitle:
      "Export a PDF of every slide, or a ZIP of slide images for Google Slides / PowerPoint.",
    bullets: [
      `${input.primaryLabel}: ${input.primaryValue}`,
      ...topRows.map((r) => `${r.label}: ${r.value}`),
      "PDF keeps charts and layout in one file",
      "ZIP gives one PNG per slide for editing elsewhere",
    ].slice(0, 6),
    kicker: "Export",
    art: "spark",
    heroStat: {
      label: input.primaryLabel,
      value: input.primaryValue,
    },
    statStrip: metricStrip(
      { label: input.primaryLabel, value: input.primaryValue },
      input.rows,
      4
    ),
    speakerNotes:
      "Offer to email the PDF or walk through one alternate scenario live.",
  };
}

function buildExecutive(input: PresentationDeckInput): StudioSlide[] {
  const b = base(input);
  const slides: StudioSlide[] = [
    {
      id: "ex-cover",
      kind: "cover",
      title: input.toolTitle,
      subtitle: b.labels.coverSubtitle,
      meta: `${input.category} · ${b.dateLabel} · CalculioHub`,
      kicker: "Executive Brief",
      art: "city",
      heroStat: {
        label: input.primaryLabel,
        value: input.primaryValue,
      },
      statStrip: b.strip,
      speakerNotes: "Open with the decision this scenario is meant to support.",
    },
    {
      id: "ex-headline",
      kind: "headline",
      title: b.labels.headlineTitle,
      primaryLabel: input.primaryLabel,
      primaryValue: input.primaryValue,
      highlights: b.metrics.slice(0, 5),
      kicker: "Headline KPI",
      insight:
        b.insight ||
        `Under current assumptions, ${input.primaryLabel} lands at ${input.primaryValue}.`,
      speakerNotes: "Pause on the primary number before diving into charts.",
    },
    {
      id: "ex-inputs",
      kind: "inputs",
      title: "Assumptions used",
      items: b.inputs,
      kicker: "Inputs",
      statStrip: b.strip.slice(0, 3),
      insight: "These inputs drive every number in this deck.",
    },
  ];

  if (b.piePoints.length >= 2) {
    slides.push({
      id: "ex-pie",
      kind: "pie",
      title: b.labels.chartPieTitle,
      points: b.piePoints,
      kicker: "Chart",
      insight: pieInsight(b.piePoints, input.primaryLabel, input.primaryValue),
      statStrip: b.piePoints.map((p) => ({
        label: p.name,
        value: p.display,
      })),
    });
  }
  if (b.barPoints.length >= 2) {
    slides.push({
      id: "ex-bars",
      kind: "bars",
      title: b.labels.chartBarTitle,
      points: b.barPoints,
      kicker: "Comparison",
      insight: `Comparing ${b.barPoints.length} key dollar results from this run.`,
      statStrip: b.barPoints.slice(0, 4).map((p) => ({
        label: p.name,
        value: p.display,
      })),
    });
  }
  if (b.linePoints.length >= 3) {
    const mid = b.linePoints[Math.floor(b.linePoints.length / 2)];
    slides.push({
      id: "ex-line",
      kind: "line",
      title: b.labels.chartLineTitle,
      points: b.linePoints,
      caption: "Illustrative sensitivity ribbon — not a forecast.",
      kicker: "Trend",
      insight: `Base case sits near ${mid.display}. Bands show roughly −30% to +40% for discussion.`,
      heroStat: {
        label: input.primaryLabel,
        value: input.primaryValue,
      },
    });
  }

  slides.push({
    id: "ex-callouts",
    kind: "callouts",
    title: b.labels.calloutTitle,
    bullets: b.callouts,
    kicker: "What changed",
    art: "compass",
    statStrip: b.strip.slice(0, 3),
  });

  if (b.compare) {
    slides.push({
      id: "ex-compare",
      kind: "compare",
      title: "Scenario contrast",
      compare: b.compare,
      kicker: "Compare",
      insight: b.compare.deltaLabel,
      heroStat: {
        label: input.primaryLabel,
        value: input.primaryValue,
      },
    });
  }

  slides.push(
    {
      id: "ex-summary",
      kind: "summary",
      title: "Decision summary",
      bullets: [
        `${input.primaryLabel}: ${input.primaryValue}`,
        ...b.metrics.slice(0, 4).map((m) => `${m.label}: ${m.value}`),
        "Re-run with an alternate stress case before committing.",
        "Estimates only — not professional advice.",
      ],
      footer: "Generated on CalculioHub · calculiohub.com",
      kicker: "Next steps",
      statStrip: b.strip,
      speakerNotes: "Confirm owners for follow-up actions.",
    },
    endDownload(input)
  );

  return slides;
}

function buildVisual(input: PresentationDeckInput): StudioSlide[] {
  const b = base(input);
  const slides: StudioSlide[] = [
    {
      id: "vi-cover",
      kind: "cover",
      title: input.toolTitle,
      subtitle: "A visual walkthrough of your scenario",
      meta: `${input.category} · ${b.dateLabel}`,
      kicker: "Visual Story",
      art: "city",
      heroStat: {
        label: input.primaryLabel,
        value: input.primaryValue,
      },
      statStrip: b.strip,
    },
    {
      id: "vi-story",
      kind: "notes",
      title: "What this scenario is saying",
      paragraphs: [
        `Primary signal: ${input.primaryLabel} comes out to ${input.primaryValue}.`,
        ...b.metrics
          .slice(0, 3)
          .map((m) => `${m.label} is ${m.value}.`),
        input.insight ||
          "Use this narrative to align with a partner before you change inputs again.",
      ],
      kicker: "Narrative",
      art: "compass",
      statStrip: b.strip.slice(0, 4),
      speakerNotes: "Tell the story in plain language before showing tables.",
    },
    {
      id: "vi-headline",
      kind: "headline",
      title: "The number that matters",
      primaryLabel: input.primaryLabel,
      primaryValue: input.primaryValue,
      highlights: b.metrics.slice(0, 5),
      kicker: "Focus",
      art: "growth",
      insight:
        b.insight ||
        `Hold this number in view while you walk the charts: ${input.primaryValue}.`,
    },
  ];

  if (b.piePoints.length >= 2) {
    slides.push({
      id: "vi-pie",
      kind: "pie",
      title: b.labels.chartPieTitle,
      points: b.piePoints,
      kicker: "Share view",
      insight: pieInsight(b.piePoints, input.primaryLabel, input.primaryValue),
      statStrip: b.piePoints.map((p) => ({
        label: p.name,
        value: p.display,
      })),
    });
  }
  if (b.barPoints.length >= 2) {
    slides.push({
      id: "vi-bars",
      kind: "bars",
      title: b.labels.chartBarTitle,
      points: b.barPoints,
      kicker: "Charts",
      insight: `Side-by-side dollar results — ${b.barPoints.length} metrics from this run.`,
      statStrip: b.barPoints.slice(0, 4).map((p) => ({
        label: p.name,
        value: p.display,
      })),
    });
  }
  if (b.linePoints.length >= 3) {
    slides.push({
      id: "vi-line",
      kind: "line",
      title: b.labels.chartLineTitle,
      points: b.linePoints,
      caption: "Illustrative path for discussion — not a prediction.",
      kicker: "Path",
      heroStat: {
        label: input.primaryLabel,
        value: input.primaryValue,
      },
      insight: "Use the ribbon to talk about upside and downside — not as a forecast.",
    });
  }

  slides.push({
    id: "vi-callouts",
    kind: "callouts",
    title: b.labels.calloutTitle,
    bullets: b.callouts,
    kicker: "Watch-outs",
    art: "shield",
    statStrip: b.strip.slice(0, 3),
  });

  if (b.compare) {
    slides.push({
      id: "vi-compare",
      kind: "compare",
      title: "Two ways to read the outcome",
      compare: b.compare,
      kicker: "Compare",
      insight: b.compare.deltaLabel,
    });
  }

  slides.push(
    {
      id: "vi-guard",
      kind: "notes",
      title: "Guardrails",
      paragraphs: [
        input.note ||
          "These figures are planning estimates generated in your browser.",
        "They are not financial, tax, lending, or investment advice.",
        `Headline to remember: ${input.primaryLabel} = ${input.primaryValue}.`,
        "Stress-test alternate inputs before you act on the headline number.",
      ],
      kicker: "Caveats",
      art: "shield",
      statStrip: b.strip.slice(0, 3),
    },
    {
      id: "vi-end",
      kind: "summary",
      title: "Takeaways",
      bullets: [
        `${input.primaryLabel}: ${input.primaryValue}`,
        ...b.metrics.slice(0, 4).map((m) => `${m.label}: ${m.value}`),
        "Download the deck on the next slide to share.",
      ],
      footer: "CalculioHub Visual Story · Free scenario presentation",
      kicker: "Close",
      art: "compass",
      statStrip: b.strip,
    },
    endDownload(input)
  );

  return slides;
}

function buildAnalyst(input: PresentationDeckInput): StudioSlide[] {
  const b = base(input);
  const slides: StudioSlide[] = [
    {
      id: "an-cover",
      kind: "cover",
      title: `${input.toolTitle} — analyst pack`,
      subtitle: b.labels.coverSubtitle,
      meta: `${input.category} · ${b.dateLabel}`,
      kicker: "Analyst Deck",
      art: "compass",
      heroStat: {
        label: input.primaryLabel,
        value: input.primaryValue,
      },
      statStrip: b.strip,
    },
    {
      id: "an-inputs",
      kind: "inputs",
      title: "Input register",
      items: b.inputs,
      kicker: "Source data",
      insight: `${b.inputs.length} inputs captured for this scenario.`,
      statStrip: b.strip.slice(0, 3),
    },
    {
      id: "an-headline",
      kind: "headline",
      title: b.labels.headlineTitle,
      primaryLabel: input.primaryLabel,
      primaryValue: input.primaryValue,
      highlights: b.metrics.slice(0, 6),
      kicker: "KPI",
      insight:
        b.insight ||
        `Primary result ${input.primaryValue} with ${b.metrics.length} supporting metrics.`,
    },
    {
      id: "an-table",
      kind: "table",
      title: "Complete result table",
      rows: b.metrics.length ? [b.primary, ...b.metrics] : [b.primary],
      kicker: "Appendix A",
      insight: "Full numeric register from the live calculator run.",
    },
  ];

  if (b.piePoints.length >= 2) {
    slides.push({
      id: "an-pie",
      kind: "pie",
      title: b.labels.chartPieTitle,
      points: b.piePoints,
      kicker: "Appendix B",
      insight: pieInsight(b.piePoints, input.primaryLabel, input.primaryValue),
      statStrip: b.piePoints.map((p) => ({
        label: p.name,
        value: p.display,
      })),
    });
  }
  if (b.barPoints.length >= 2) {
    slides.push({
      id: "an-bars",
      kind: "bars",
      title: b.labels.chartBarTitle,
      points: b.barPoints,
      kicker: "Appendix C",
      insight: `${b.barPoints.length} comparable dollar metrics.`,
      statStrip: b.barPoints.slice(0, 4).map((p) => ({
        label: p.name,
        value: p.display,
      })),
    });
  }
  if (b.linePoints.length >= 3) {
    slides.push({
      id: "an-line",
      kind: "line",
      title: b.labels.chartLineTitle,
      points: b.linePoints,
      caption: "Illustrative sensitivity series for review meetings.",
      kicker: "Appendix D",
      heroStat: {
        label: input.primaryLabel,
        value: input.primaryValue,
      },
    });
  }

  if (b.compare) {
    slides.push({
      id: "an-compare",
      kind: "compare",
      title: "Baseline vs stress framing",
      compare: b.compare,
      kicker: "Compare",
      insight: b.compare.deltaLabel,
    });
  }

  slides.push(
    {
      id: "an-callouts",
      kind: "callouts",
      title: b.labels.calloutTitle,
      bullets: b.callouts,
      kicker: "Sensitivities",
      statStrip: b.strip.slice(0, 3),
    },
    {
      id: "an-notes",
      kind: "notes",
      title: "Methodology notes",
      paragraphs: [
        input.insight ||
          "Results follow the calculator’s published formula with the inputs shown.",
        `Recorded headline: ${input.primaryLabel} = ${input.primaryValue}.`,
        input.note ||
          "Figures update live in-browser and may differ from lender, payroll, or tax software.",
        "Document assumptions when sharing this deck externally.",
        "Not a substitute for professional advice.",
      ],
      kicker: "Notes",
      statStrip: b.strip.slice(0, 4),
    },
    {
      id: "an-summary",
      kind: "summary",
      title: "Analyst checklist",
      bullets: [
        "Confirm inputs match the real-world scenario",
        `Verify headline: ${input.primaryLabel} = ${input.primaryValue}`,
        ...b.metrics.slice(0, 3).map((m) => `Check ${m.label}: ${m.value}`),
        "Review sensitivity callouts with stakeholders",
        "Export PDF or slide images on the next page",
      ],
      footer: "CalculioHub Analyst Deck · calculiohub.com",
      kicker: "Close",
      statStrip: b.strip,
    },
    endDownload(input)
  );

  return slides;
}

export function buildTemplateDeck(
  input: PresentationDeckInput,
  templateId: PresentationTemplateId
): StudioSlide[] {
  switch (templateId) {
    case "visual":
      return buildVisual(input);
    case "analyst":
      return buildAnalyst(input);
    case "executive":
    default:
      return buildExecutive(input);
  }
}

export function getTemplate(id: PresentationTemplateId): PresentationTemplate {
  return (
    PRESENTATION_TEMPLATES.find((t) => t.id === id) ?? PRESENTATION_TEMPLATES[0]
  );
}
