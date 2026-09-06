"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  PresentationBarChart,
  PresentationLineChart,
  PresentationPieChart,
} from "@/components/presentation/PresentationCharts";
import { PresentationArt } from "@/components/presentation/PresentationArt";
import {
  exportPresentationImagesZip,
  exportPresentationPdf,
} from "@/lib/presentation/exportPresentationPdf";
import {
  buildTemplateDeck,
  getTemplate,
  PRESENTATION_TEMPLATES,
  type PresentationTemplateId,
  type StudioSlide,
} from "@/lib/presentation/templates";
import type { PresentationPayload } from "@/lib/presentation/storage";
import {
  loadPresentationBrand,
  loadPresentationCompare,
  loadPresentationPayload,
  loadSlideEdits,
  presentationHref,
  savePresentationBrand,
  saveSlideEdits,
  type PresentationBrand,
  type SlideEdits,
} from "@/lib/presentation/storage";
import { getCalculatorBySlug } from "@/lib/calculators";
import { runCalculation } from "@/lib/formulas";
import { decodeScenarioValues } from "@/lib/scenarioLinks";
import { getToolHref } from "@/lib/cryptoFormulas";
import { copyText } from "@/lib/scenarioLinks";

function applyEdits(slide: StudioSlide, edits: SlideEdits): StudioSlide {
  const e = edits[slide.id];
  if (!e) return slide;
  const next = { ...slide } as StudioSlide;
  if (e.title && "title" in next) {
    (next as { title: string }).title = e.title;
  }
  if (e.speakerNotes !== undefined) {
    next.speakerNotes = e.speakerNotes;
  }
  return next;
}

/** Art only on airy text slides — never over charts/tables/grids. */
const ART_SLIDE_KINDS = new Set([
  "cover",
  "title",
  "headline",
  "notes",
  "summary",
  "callouts",
  "download",
]);

function StatStrip({
  items,
  accent,
}: {
  items: { label: string; value: string }[];
  accent: string;
}) {
  if (!items.length) return null;
  return (
    <dl className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <div
          key={`${item.label}-${item.value}`}
          className="min-w-0 rounded-xl border border-[#e2e8f0] bg-white/90 px-3 py-2.5 shadow-sm"
        >
          <dt className="text-[10px] font-semibold tracking-wide text-[#64748b] uppercase break-words-safe">
            {item.label}
          </dt>
          <dd
            className="mt-1 text-sm font-bold tabular-nums break-words-safe sm:text-base"
            style={{ color: accent }}
          >
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function InsightBanner({ text, accent }: { text: string; accent: string }) {
  return (
    <p
      className="mt-3 rounded-xl border px-3 py-2.5 text-sm leading-relaxed text-[#334155]"
      style={{
        borderColor: `${accent}40`,
        background: `${accent}12`,
      }}
    >
      <span className="font-semibold" style={{ color: accent }}>
        Insight ·{" "}
      </span>
      {text}
    </p>
  );
}

function SlideView({
  slide,
  accent,
  preparedFor,
  brandName = "CalculioHub",
}: {
  slide: StudioSlide;
  accent: string;
  preparedFor?: string;
  brandName?: string;
}) {
  const showArt = Boolean(slide.art && ART_SLIDE_KINDS.has(slide.kind));
  const strip = slide.statStrip ?? [];
  const insight = slide.insight;

  return (
    <div
      className="relative flex h-full min-h-[420px] flex-col overflow-hidden rounded-2xl border border-[#d7e0ea] text-[#0b1220] shadow-xl sm:min-h-[560px] md:min-h-[620px]"
      style={{
        background:
          "linear-gradient(165deg, #ffffff 0%, #f7fbff 48%, #eef6ff 100%)",
      }}
    >
      <div
        className="absolute inset-x-0 top-0 h-1.5"
        style={{ background: accent }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-16 -top-20 hidden h-56 w-56 rounded-full opacity-40 sm:block"
        style={{
          background: `radial-gradient(circle, ${accent}55, transparent 70%)`,
        }}
        aria-hidden
      />

      <div className="relative z-[1] flex flex-1 flex-col overflow-x-clip p-4 sm:p-8 md:p-10">
        {slide.kicker ? (
          <p
            className="text-[11px] font-semibold tracking-[0.16em] uppercase"
            style={{ color: accent }}
          >
            {slide.kicker}
          </p>
        ) : null}

        <div
          className={`mt-3 flex min-h-0 flex-1 gap-6 ${
            showArt ? "md:items-stretch" : ""
          }`}
        >
          <div className="min-w-0 flex-1">
            {slide.kind === "cover" ? (
              <div className="flex h-full flex-col justify-center gap-4">
                <p className="text-sm font-semibold" style={{ color: accent }}>
                  {brandName}
                </p>
                <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight break-words-safe sm:text-4xl md:text-5xl">
                  {slide.title}
                </h2>
                <p className="max-w-xl text-base text-[#475569] sm:text-lg">
                  {slide.subtitle}
                </p>
                {slide.heroStat ? (
                  <div
                    className="max-w-lg rounded-2xl border px-5 py-4"
                    style={{
                      borderColor: `${accent}55`,
                      background: `linear-gradient(135deg, ${accent}22, #ffffff)`,
                    }}
                  >
                    <p className="text-xs font-semibold tracking-wide text-[#64748b] uppercase">
                      {slide.heroStat.label}
                    </p>
                    <p className="mt-1 font-[family-name:var(--font-display)] text-2xl font-bold tabular-nums break-words-safe sm:text-4xl">
                      {slide.heroStat.value}
                    </p>
                  </div>
                ) : null}
                <StatStrip items={strip.slice(0, 4)} accent={accent} />
                {(preparedFor || slide.preparedFor) && (
                  <p className="text-sm font-medium text-[#0b1220]">
                    Prepared for{" "}
                    <span className="font-bold">
                      {preparedFor || slide.preparedFor}
                    </span>
                  </p>
                )}
                <p className="text-sm text-[#64748b]">{slide.meta}</p>
              </div>
            ) : null}

            {slide.kind === "title" ? (
              <div className="flex h-full flex-col justify-center gap-4">
                <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-5xl">
                  {slide.title}
                </h2>
                <p className="max-w-xl text-base text-[#475569] sm:text-lg">
                  {slide.subtitle}
                </p>
                <p className="text-sm text-[#64748b]">{slide.meta}</p>
              </div>
            ) : null}

            {slide.kind === "inputs" ? (
              <div className="space-y-4">
                <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold sm:text-3xl">
                  {slide.title}
                </h2>
                {insight ? <InsightBanner text={insight} accent={accent} /> : null}
                <StatStrip items={strip} accent={accent} />
                <dl className="grid gap-3 sm:grid-cols-2">
                  {slide.items.map((item) => (
                    <div
                      key={`${item.label}-${item.value}`}
                      className="rounded-xl border border-[#e2e8f0] bg-white px-4 py-3 shadow-sm"
                    >
                      <dt className="text-xs text-[#64748b]">{item.label}</dt>
                      <dd className="mt-1 text-base font-bold tabular-nums">
                        {item.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            ) : null}

            {slide.kind === "headline" ? (
              <div className="space-y-4">
                <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold sm:text-3xl">
                  {slide.title}
                </h2>
                <div
                  className="rounded-2xl border px-5 py-7 sm:px-6 sm:py-8"
                  style={{
                    borderColor: `${accent}40`,
                    background: `linear-gradient(135deg, ${accent}28, #e8f4ff 55%, #ffffff)`,
                  }}
                >
                  <p className="text-sm font-medium text-[#475569]">
                    {slide.primaryLabel}
                  </p>
                  <p className="mt-2 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight tabular-nums break-words-safe sm:text-5xl">
                    {slide.primaryValue}
                  </p>
                </div>
                {insight ? <InsightBanner text={insight} accent={accent} /> : null}
                {slide.highlights.length > 0 ? (
                  <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {slide.highlights.map((h) => (
                      <div
                        key={h.label}
                        className="rounded-xl border border-[#e2e8f0] bg-white px-4 py-3 shadow-sm"
                      >
                        <dt className="text-[11px] font-medium text-[#64748b]">
                          {h.label}
                        </dt>
                        <dd className="mt-1 text-base font-bold tabular-nums">
                          {h.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                ) : null}
              </div>
            ) : null}

            {slide.kind === "table" ? (
              <div className="space-y-4">
                <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold sm:text-3xl">
                  {slide.title}
                </h2>
                {insight ? <InsightBanner text={insight} accent={accent} /> : null}
                <div className="max-h-[400px] overflow-auto rounded-xl border border-[#e2e8f0] bg-white shadow-sm">
                  <table className="w-full text-left text-sm">
                    <thead className="sticky top-0 bg-[#f1f5f9] text-xs tracking-wide text-[#64748b] uppercase">
                      <tr>
                        <th className="px-4 py-3">Metric</th>
                        <th className="px-4 py-3 text-right">Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {slide.rows.map((row, i) => (
                        <tr
                          key={row.label}
                          className={`border-t border-[#e2e8f0] ${
                            i === 0 ? "bg-[#f8fafc]" : ""
                          }`}
                        >
                          <td className="px-4 py-3 font-medium">{row.label}</td>
                          <td className="px-4 py-3 text-right text-base font-bold tabular-nums">
                            {row.value}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : null}

            {slide.kind === "pie" ? (
              <div className="space-y-3">
                <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold sm:text-3xl">
                  {slide.title}
                </h2>
                {insight ? <InsightBanner text={insight} accent={accent} /> : null}
                <PresentationPieChart points={slide.points} />
              </div>
            ) : null}

            {slide.kind === "bars" ? (
              <div className="space-y-3">
                <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold sm:text-3xl">
                  {slide.title}
                </h2>
                {insight ? <InsightBanner text={insight} accent={accent} /> : null}
                <StatStrip items={strip} accent={accent} />
                <PresentationBarChart points={slide.points} />
              </div>
            ) : null}

            {slide.kind === "line" ? (
              <div className="space-y-3">
                <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold sm:text-3xl">
                  {slide.title}
                </h2>
                {slide.heroStat ? (
                  <div className="flex flex-wrap items-end gap-3 rounded-xl border border-[#e2e8f0] bg-white px-4 py-3 shadow-sm">
                    <div>
                      <p className="text-[10px] font-semibold tracking-wide text-[#64748b] uppercase">
                        {slide.heroStat.label}
                      </p>
                      <p
                        className="text-xl font-bold tabular-nums"
                        style={{ color: accent }}
                      >
                        {slide.heroStat.value}
                      </p>
                    </div>
                  </div>
                ) : null}
                {insight ? <InsightBanner text={insight} accent={accent} /> : null}
                <PresentationLineChart
                  points={slide.points}
                  caption={slide.caption}
                />
              </div>
            ) : null}

            {slide.kind === "compare" ? (
              <div className="space-y-5">
                <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold sm:text-3xl">
                  {slide.title}
                </h2>
                {slide.heroStat ? (
                  <p className="text-sm text-[#64748b]">
                    Baseline headline:{" "}
                    <span className="font-semibold text-[#0b1220]">
                      {slide.heroStat.label} {slide.heroStat.value}
                    </span>
                  </p>
                ) : null}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-[#e2e8f0] bg-white p-5 shadow-sm">
                    <p className="text-xs font-semibold tracking-wide text-[#64748b] uppercase">
                      {slide.compare.labelA}
                    </p>
                    <p className="mt-3 font-[family-name:var(--font-display)] text-3xl font-bold tabular-nums sm:text-4xl">
                      {slide.compare.primaryA}
                    </p>
                  </div>
                  <div
                    className="rounded-2xl border p-5 shadow-sm"
                    style={{
                      borderColor: `${accent}55`,
                      background: `${accent}14`,
                    }}
                  >
                    <p className="text-xs font-semibold tracking-wide text-[#64748b] uppercase">
                      {slide.compare.labelB}
                    </p>
                    <p className="mt-3 font-[family-name:var(--font-display)] text-3xl font-bold tabular-nums sm:text-4xl">
                      {slide.compare.primaryB}
                    </p>
                  </div>
                </div>
                <p
                  className="rounded-xl px-4 py-3 text-sm font-bold sm:text-base"
                  style={{ color: accent, background: `${accent}12` }}
                >
                  {slide.compare.deltaLabel}
                </p>
                {insight && insight !== slide.compare.deltaLabel ? (
                  <InsightBanner text={insight} accent={accent} />
                ) : null}
              </div>
            ) : null}

            {slide.kind === "callouts" ? (
              <div className="space-y-4">
                <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold sm:text-3xl">
                  {slide.title}
                </h2>
                <StatStrip items={strip} accent={accent} />
                <ul className="space-y-3">
                  {slide.bullets.map((b) => (
                    <li
                      key={b}
                      className="flex gap-3 rounded-xl border border-[#e2e8f0] bg-white px-4 py-3 text-sm shadow-sm sm:text-base"
                    >
                      <span
                        className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
                        style={{ background: accent }}
                        aria-hidden
                      />
                      <span className="text-[#334155]">{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {slide.kind === "notes" ? (
              <div className="max-w-2xl space-y-4">
                <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold sm:text-3xl">
                  {slide.title}
                </h2>
                <StatStrip items={strip} accent={accent} />
                {slide.paragraphs.map((p) => (
                  <p
                    key={p.slice(0, 48)}
                    className="text-sm leading-relaxed text-[#334155] sm:text-base"
                  >
                    {p}
                  </p>
                ))}
              </div>
            ) : null}

            {slide.kind === "summary" ? (
              <div className="space-y-4">
                <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold sm:text-3xl">
                  {slide.title}
                </h2>
                <StatStrip items={strip} accent={accent} />
                <ul className="space-y-3">
                  {slide.bullets.map((b) => (
                    <li key={b} className="flex gap-3 text-sm sm:text-base">
                      <span
                        className="mt-2 h-2 w-2 shrink-0 rounded-full"
                        style={{ background: accent }}
                        aria-hidden
                      />
                      <span className="font-medium text-[#334155]">{b}</span>
                    </li>
                  ))}
                </ul>
                <p className="pt-4 text-xs text-[#64748b]">{slide.footer}</p>
              </div>
            ) : null}

            {slide.kind === "download" ? (
              <div className="flex h-full flex-col justify-center gap-5">
                <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold sm:text-4xl">
                  {slide.title}
                </h2>
                <p className="max-w-xl text-base text-[#475569]">
                  {slide.subtitle}
                </p>
                {slide.heroStat ? (
                  <div
                    className="max-w-md rounded-2xl border px-5 py-4"
                    style={{
                      borderColor: `${accent}55`,
                      background: `${accent}14`,
                    }}
                  >
                    <p className="text-xs font-semibold tracking-wide text-[#64748b] uppercase">
                      {slide.heroStat.label}
                    </p>
                    <p className="mt-1 text-2xl font-bold tabular-nums sm:text-3xl">
                      {slide.heroStat.value}
                    </p>
                  </div>
                ) : null}
                <StatStrip items={strip} accent={accent} />
                <ul className="space-y-2">
                  {slide.bullets.map((b) => (
                    <li key={b} className="flex gap-3 text-sm text-[#334155]">
                      <span
                        className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
                        style={{ background: accent }}
                        aria-hidden
                      />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

          {showArt && slide.art ? (
            <div
              className="pointer-events-none hidden w-[22%] max-w-[180px] shrink-0 self-center opacity-80 md:block"
              aria-hidden
            >
              <PresentationArt
                variant={slide.art}
                className="h-auto w-full"
              />
            </div>
          ) : null}
        </div>

        {slide.speakerNotes ? (
          <p className="mt-auto pt-4 text-[11px] italic text-[#94a3b8]">
            Speaker notes: {slide.speakerNotes}
          </p>
        ) : null}
      </div>
    </div>
  );
}

function rebuildFromCalculator(
  slug: string,
  scenarioRaw: string | null
): PresentationPayload | null {
  const calculator = getCalculatorBySlug(slug);
  if (!calculator) return null;
  const values =
    (scenarioRaw ? decodeScenarioValues(scenarioRaw) : null) ||
    Object.fromEntries(
      calculator.inputs.map((i) => [i.id, i.defaultValue])
    );
  const result = runCalculation(calculator.formulaType, values);
  return {
    slug,
    toolHref: getToolHref(calculator.slug),
    toolTitle: calculator.title,
    category: calculator.category,
    inputs: calculator.inputs.map((input) => ({
      label: input.label,
      value: String(values[input.id] ?? input.defaultValue),
    })),
    primaryLabel: result.primary.label,
    primaryValue: result.primary.value,
    rows: [...(result.featured ?? []), ...result.secondary].map((item) => ({
      label: item.label,
      value: item.value,
    })),
    insight: result.insight,
    note: "Planning estimates only — not professional advice.",
    savedAt: new Date().toISOString(),
  };
}

export function PresentationStudio({
  slug,
  scenarioRaw,
  initialTemplate,
}: {
  slug: string;
  scenarioRaw: string | null;
  initialTemplate?: string | null;
}) {
  const initialId = (
    ["executive", "visual", "analyst"] as PresentationTemplateId[]
  ).includes(initialTemplate as PresentationTemplateId)
    ? (initialTemplate as PresentationTemplateId)
    : "executive";

  const [payload, setPayload] = useState<PresentationPayload | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [templateId, setTemplateId] =
    useState<PresentationTemplateId>(initialId);
  const [index, setIndex] = useState(0);
  const [busy, setBusy] = useState<"pdf" | "zip" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [presenter, setPresenter] = useState(false);
  const [brand, setBrand] = useState<PresentationBrand>({
    preparedFor: "",
    accentColor: "#00B8D4",
  });
  const [edits, setEdits] = useState<SlideEdits>({});
  const exportRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored =
      loadPresentationPayload(slug) ??
      rebuildFromCalculator(slug, scenarioRaw);
    if (stored && !stored.compare) {
      const compare = loadPresentationCompare(slug);
      if (compare) stored.compare = compare;
    }
    setPayload(stored);
    setBrand(loadPresentationBrand());
    setEdits(loadSlideEdits(slug));
    setHydrated(true);
  }, [slug, scenarioRaw]);

  const deckInput = useMemo(
    () =>
      payload
        ? {
            toolTitle: payload.toolTitle,
            category: payload.category,
            inputs: payload.inputs,
            primaryLabel: payload.primaryLabel,
            primaryValue: payload.primaryValue,
            rows: payload.rows,
            note: payload.note,
            insight: payload.insight,
            compare: payload.compare,
          }
        : null,
    [payload]
  );

  const slides = useMemo(() => {
    if (!deckInput) return [];
    return buildTemplateDeck(deckInput, templateId).map((s) =>
      applyEdits(s, edits)
    );
  }, [deckInput, templateId, edits]);

  const template = getTemplate(templateId);
  const accent = brand.accentColor || template.accent;
  const current = slides[index];
  const isLast = index >= slides.length - 1 && slides.length > 0;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        setIndex((i) => Math.min(slides.length - 1, i + 1));
      }
      if (e.key === "ArrowLeft") {
        setIndex((i) => Math.max(0, i - 1));
      }
      if (e.key === "f" || e.key === "F") {
        void togglePresenter();
      }
      if (e.key === "Escape" && presenter) {
        exitPresenter();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slides.length, presenter]);

  const selectTemplate = (id: PresentationTemplateId) => {
    setTemplateId(id);
    setIndex(0);
  };

  const persistBrand = (next: PresentationBrand) => {
    setBrand(next);
    savePresentationBrand(next);
  };

  const updateCurrentEdit = (patch: {
    title?: string;
    speakerNotes?: string;
  }) => {
    if (!current) return;
    const next = {
      ...edits,
      [current.id]: { ...edits[current.id], ...patch },
    };
    setEdits(next);
    saveSlideEdits(slug, next);
  };

  const runExport = async (kind: "pdf" | "zip") => {
    if (!exportRef.current || !payload) return;
    setBusy(kind);
    setError(null);
    try {
      if (kind === "pdf") {
        await exportPresentationPdf(
          exportRef.current,
          `${payload.toolTitle}-${templateId}`
        );
        setStatus("PDF downloaded");
      } else {
        await exportPresentationImagesZip(
          exportRef.current,
          `${payload.toolTitle}-${templateId}`
        );
        setStatus("Slide images ZIP downloaded");
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Export failed. Try Chrome/Edge and retry."
      );
    } finally {
      setBusy(null);
    }
  };

  const shareLink = async () => {
    const url = `${window.location.origin}${presentationHref(
      slug,
      scenarioRaw || undefined,
      templateId
    )}`;
    const ok = await copyText(url);
    setStatus(ok ? "Share link copied" : "Could not copy link");
  };

  const printDeck = () => {
    window.print();
  };

  const togglePresenter = async () => {
    if (!presenter) {
      setPresenter(true);
      try {
        await stageRef.current?.requestFullscreen?.();
      } catch {
        // fullscreen may be blocked; still use presenter chrome-less UI
      }
    } else {
      exitPresenter();
    }
  };

  const exitPresenter = () => {
    setPresenter(false);
    if (document.fullscreenElement) {
      void document.exitFullscreen();
    }
  };

  useEffect(() => {
    const onFs = () => {
      if (!document.fullscreenElement) setPresenter(false);
    };
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  const backHref =
    payload?.toolHref ||
    (getCalculatorBySlug(slug) ? getToolHref(slug) : `/tools/${slug}`);

  if (!hydrated) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <p className="text-sm text-[var(--muted)]">Loading presentation…</p>
      </main>
    );
  }

  if (!payload || !deckInput) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold">
          Presentation not ready
        </h1>
        <p className="mt-3 text-[var(--muted)]">
          Open a calculator, set your inputs, then click{" "}
          <span className="font-semibold text-[var(--foreground)]">
            Presentation preview
          </span>
          .
        </p>
        <Link
          href="/tools"
          className="mt-6 inline-flex rounded-xl bg-[var(--accent)] px-4 py-3 text-sm font-bold text-[#041018]"
        >
          Browse tools
        </Link>
      </main>
    );
  }

  const exportButtons = (
    <>
      <button
        type="button"
        onClick={() => void runExport("pdf")}
        disabled={!!busy}
        className="rounded-xl bg-[var(--accent)] px-3 py-2.5 text-sm font-bold text-[#041018] disabled:opacity-60 sm:px-4"
      >
        {busy === "pdf" ? "Building PDF…" : "Download PDF"}
      </button>
      <button
        type="button"
        onClick={() => void runExport("zip")}
        disabled={!!busy}
        className="rounded-xl border border-[var(--border)] px-3 py-2.5 text-sm font-semibold disabled:opacity-60 sm:px-4"
      >
        {busy === "zip" ? "Building ZIP…" : "Slide images"}
      </button>
    </>
  );

  return (
    <main
      className={`relative min-h-[calc(100vh-4rem)] ${
        presenter ? "presenter-mode bg-[#05080f]" : ""
      }`}
    >
      {!presenter ? (
        <div className="border-b border-[var(--glass-border)] bg-[color-mix(in_srgb,var(--glass)_80%,transparent)] backdrop-blur-xl print:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:px-6">
            <div className="min-w-0">
              <p className="text-[10px] font-semibold tracking-[0.16em] text-[var(--accent)] uppercase">
                Presentation studio
              </p>
              <h1 className="font-[family-name:var(--font-display)] text-lg font-bold break-words-safe sm:text-xl">
                {payload.toolTitle}
              </h1>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href={backHref}
                className="rounded-xl border border-[var(--border)] px-3 py-2 text-sm font-semibold"
              >
                ← Back
              </Link>
              <button
                type="button"
                onClick={() => void togglePresenter()}
                className="rounded-xl border border-[var(--border)] px-3 py-2 text-sm font-semibold"
              >
                Present
              </button>
              <button
                type="button"
                onClick={() => void shareLink()}
                className="rounded-xl border border-[var(--border)] px-3 py-2 text-sm font-semibold"
              >
                Share
              </button>
              <button
                type="button"
                onClick={printDeck}
                className="hidden rounded-xl border border-[var(--border)] px-3 py-2 text-sm font-semibold sm:inline-flex"
              >
                Print
              </button>
              {exportButtons}
            </div>
          </div>
        </div>
      ) : null}

      <div
        className={`mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 ${
          presenter ? "flex min-h-screen max-w-none items-center px-3 py-3" : ""
        }`}
      >
        {!presenter ? (
          <>
            <div className="mb-6 grid gap-3 print:hidden sm:grid-cols-3">
              {PRESENTATION_TEMPLATES.map((t) => {
                const active = t.id === templateId;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => selectTemplate(t.id)}
                    className={`calc-panel rounded-2xl p-4 text-left transition ${
                      active ? "ring-2 ring-[var(--accent)]" : ""
                    }`}
                  >
                    <p
                      className="text-[10px] font-semibold tracking-[0.14em] uppercase"
                      style={{ color: t.accent }}
                    >
                      {t.tagline}
                    </p>
                    <p className="mt-1 font-semibold">{t.name}</p>
                    <p className="mt-2 text-xs text-[var(--muted)]">
                      {t.description}
                    </p>
                  </button>
                );
              })}
            </div>

            <div className="calc-panel mb-6 grid gap-3 rounded-2xl p-4 print:hidden sm:grid-cols-3">
              <label className="text-xs">
                <span className="font-semibold text-[var(--muted)]">
                  Prepared for
                </span>
                <input
                  value={brand.preparedFor}
                  onChange={(e) =>
                    persistBrand({ ...brand, preparedFor: e.target.value })
                  }
                  placeholder="Client / partner name"
                  className="calc-inset mt-1 w-full rounded-lg px-3 py-2 text-sm"
                />
              </label>
              <label className="text-xs">
                <span className="font-semibold text-[var(--muted)]">
                  Accent color
                </span>
                <input
                  type="color"
                  value={brand.accentColor}
                  onChange={(e) =>
                    persistBrand({ ...brand, accentColor: e.target.value })
                  }
                  className="mt-1 h-10 w-full cursor-pointer rounded-lg border border-[var(--border)] bg-transparent"
                />
              </label>
              <div className="text-xs">
                <span className="font-semibold text-[var(--muted)]">
                  Edit this slide
                </span>
                {current && "title" in current ? (
                  <input
                    value={
                      edits[current.id]?.title ??
                      (current as { title: string }).title
                    }
                    onChange={(e) =>
                      updateCurrentEdit({ title: e.target.value })
                    }
                    className="calc-inset mt-1 w-full rounded-lg px-3 py-2 text-sm"
                  />
                ) : (
                  <p className="mt-2 text-[var(--muted)]">—</p>
                )}
              </div>
              {current ? (
                <label className="text-xs sm:col-span-3">
                  <span className="font-semibold text-[var(--muted)]">
                    Speaker notes
                  </span>
                  <textarea
                    value={
                      edits[current.id]?.speakerNotes ??
                      current.speakerNotes ??
                      ""
                    }
                    onChange={(e) =>
                      updateCurrentEdit({ speakerNotes: e.target.value })
                    }
                    rows={2}
                    className="calc-inset mt-1 w-full rounded-lg px-3 py-2 text-sm"
                    placeholder="Optional notes for presenting…"
                  />
                </label>
              ) : null}
            </div>
          </>
        ) : null}

        <p
          className={`mb-3 text-sm text-[var(--muted)] print:hidden ${
            presenter ? "sr-only" : ""
          }`}
        >
          Slide {index + 1} of {slides.length} · Arrows / Space · F present · Esc
          exit
        </p>

        <div
          ref={stageRef}
          className={`presentation-stage ${
            presenter ? "w-full max-w-6xl mx-auto" : ""
          }`}
        >
          <div
            key={`${templateId}-${current?.id}-${index}`}
            className="presentation-slide-enter"
          >
            {current ? (
              <SlideView
                slide={current}
                accent={accent}
                preparedFor={brand.preparedFor}
              />
            ) : null}
          </div>
        </div>

        {error ? (
          <p className="mt-3 text-sm text-red-600 print:hidden">{error}</p>
        ) : null}
        {status ? (
          <p className="mt-2 text-sm text-[var(--accent)] print:hidden">
            {status}
          </p>
        ) : null}

        <div
          className={`mt-5 flex flex-col gap-3 print:hidden sm:flex-row sm:items-center sm:justify-between ${
            presenter ? "text-white" : ""
          }`}
        >
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              disabled={index === 0}
              onClick={() => setIndex((i) => Math.max(0, i - 1))}
              className="rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm font-semibold disabled:opacity-40"
            >
              Previous
            </button>
            <p className="text-xs text-[var(--muted)] sm:hidden">
              {index + 1} / {slides.length}
            </p>
            <button
              type="button"
              disabled={isLast}
              onClick={() =>
                setIndex((i) => Math.min(slides.length - 1, i + 1))
              }
              className="rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm font-semibold disabled:opacity-40"
            >
              Next
            </button>
          </div>
          <div className="mx-auto hidden max-w-full flex-wrap justify-center gap-1.5 sm:flex">
            {slides.map((s, i) => (
              <button
                key={s.id}
                type="button"
                aria-label={`Slide ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-2.5 w-2.5 rounded-full ${
                  i === index ? "bg-[var(--accent)]" : "bg-[var(--border)]"
                }`}
              />
            ))}
          </div>
        </div>

        {isLast || current?.kind === "download" ? (
          <div className="calc-panel mt-6 rounded-2xl p-5 print:hidden">
            <h2 className="font-[family-name:var(--font-display)] text-xl font-bold">
              Download your presentation
            </h2>
            <p className="mt-2 text-sm text-[var(--muted)]">
              You&apos;re on the final slide. Export the full deck now.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">{exportButtons}</div>
          </div>
        ) : null}
      </div>

      {/* Export + print source */}
      <div
        ref={exportRef}
        className="pointer-events-none fixed top-0 left-[-14000px] w-[1100px] space-y-6 bg-white p-4 print:static print:left-auto print:w-full print:space-y-8"
        aria-hidden
      >
        {slides.map((slide) => (
          <div
            key={`export-${templateId}-${slide.id}`}
            data-presentation-slide
            className="box-border min-h-[620px] w-[1100px] break-after-page print:w-full print:min-h-0"
          >
            <SlideView
              slide={slide}
              accent={accent}
              preparedFor={brand.preparedFor}
            />
          </div>
        ))}
      </div>
    </main>
  );
}
