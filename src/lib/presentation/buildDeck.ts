export type PresentationMetric = {
  label: string;
  value: string;
  numeric: number | null;
};

export type PresentationInput = {
  label: string;
  value: string;
};

export type PresentationCompare = {
  labelA: string;
  labelB: string;
  primaryA: string;
  primaryB: string;
  deltaLabel: string;
};

export type PresentationDeckInput = {
  toolTitle: string;
  category: string;
  inputs: PresentationInput[];
  primaryLabel: string;
  primaryValue: string;
  rows: { label: string; value: string }[];
  note?: string;
  insight?: string;
  /** Optional captured A/B compare from the tool page. */
  compare?: PresentationCompare;
};

export type ChartPoint = {
  name: string;
  value: number;
  display: string;
};

export type PresentationSlide =
  | {
      id: string;
      kind: "cover";
      title: string;
      subtitle: string;
      meta: string;
      preparedFor?: string;
    }
  | {
      id: string;
      kind: "title";
      title: string;
      subtitle: string;
      meta: string;
    }
  | {
      id: string;
      kind: "inputs";
      title: string;
      items: PresentationInput[];
    }
  | {
      id: string;
      kind: "headline";
      title: string;
      primaryLabel: string;
      primaryValue: string;
      highlights: PresentationMetric[];
    }
  | {
      id: string;
      kind: "table";
      title: string;
      rows: PresentationMetric[];
    }
  | {
      id: string;
      kind: "pie";
      title: string;
      points: ChartPoint[];
    }
  | {
      id: string;
      kind: "bars";
      title: string;
      points: ChartPoint[];
    }
  | {
      id: string;
      kind: "line";
      title: string;
      points: ChartPoint[];
      caption?: string;
    }
  | {
      id: string;
      kind: "compare";
      title: string;
      compare: PresentationCompare;
    }
  | {
      id: string;
      kind: "callouts";
      title: string;
      bullets: string[];
    }
  | {
      id: string;
      kind: "notes";
      title: string;
      paragraphs: string[];
    }
  | {
      id: string;
      kind: "summary";
      title: string;
      bullets: string[];
      footer: string;
    }
  | {
      id: string;
      kind: "download";
      title: string;
      subtitle: string;
      bullets: string[];
    };

/** Fallback deck for legacy callers — prefer `buildTemplateDeck`. */
export function buildPresentationDeck(
  input: PresentationDeckInput
): PresentationSlide[] {
  // Lazy require avoided — callers that need templates import templates.ts.
  // Minimal cover → headline → table → summary → download pack.
  const metrics = input.rows.map((r) => ({
    label: r.label,
    value: r.value,
    numeric: null as number | null,
  }));
  return [
    {
      id: "legacy-cover",
      kind: "cover",
      title: input.toolTitle,
      subtitle: `${input.category} scenario`,
      meta: new Date().toLocaleDateString(),
    },
    {
      id: "legacy-headline",
      kind: "headline",
      title: "Headline result",
      primaryLabel: input.primaryLabel,
      primaryValue: input.primaryValue,
      highlights: metrics.slice(0, 3),
    },
    {
      id: "legacy-inputs",
      kind: "inputs",
      title: "Inputs used",
      items: input.inputs.length
        ? input.inputs
        : [{ label: "Scenario", value: "Current values" }],
    },
    {
      id: "legacy-table",
      kind: "table",
      title: "Supporting metrics",
      rows: metrics.length
        ? metrics
        : [
            {
              label: input.primaryLabel,
              value: input.primaryValue,
              numeric: null,
            },
          ],
    },
    {
      id: "legacy-summary",
      kind: "summary",
      title: "Takeaways",
      bullets: [
        `${input.primaryLabel}: ${input.primaryValue}`,
        ...(input.insight ? [input.insight] : []),
        input.note || "Planning estimates only — not professional advice.",
      ].slice(0, 5),
      footer: "Generated with CalculioHub",
    },
    {
      id: "legacy-download",
      kind: "download",
      title: "Download this presentation",
      subtitle: "Export PDF or slide images from the presentation studio.",
      bullets: [
        `${input.primaryLabel}: ${input.primaryValue}`,
        "Open Presentation preview on the tool page for full templates.",
      ],
    },
  ];
}
