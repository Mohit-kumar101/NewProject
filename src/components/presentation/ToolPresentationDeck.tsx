"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  buildPresentationDeck,
  type PresentationDeckInput,
  type PresentationSlide,
} from "@/lib/presentation/buildDeck";
import { exportPresentationPdf } from "@/lib/presentation/exportPresentationPdf";
import {
  PresentationBarChart,
  PresentationPieChart,
} from "@/components/presentation/PresentationCharts";

function SlideBody({ slide }: { slide: PresentationSlide }) {
  switch (slide.kind) {
    case "title":
      return (
        <div className="flex h-full flex-col justify-center gap-4">
          <p className="text-xs font-semibold tracking-[0.18em] text-[#00B8D4] uppercase">
            CalculioHub presentation
          </p>
          <h3 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-[#0b1220] sm:text-4xl">
            {slide.title}
          </h3>
          <p className="text-base text-[#475569]">{slide.subtitle}</p>
          <p className="text-sm text-[#64748b]">{slide.meta}</p>
        </div>
      );
    case "inputs":
      return (
        <div className="space-y-4">
          <h3 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[#0b1220]">
            {slide.title}
          </h3>
          <dl className="grid gap-3 sm:grid-cols-2">
            {slide.items.map((item) => (
              <div
                key={`${item.label}-${item.value}`}
                className="rounded-xl border border-[#d7e0ea] bg-[#f8fafc] px-4 py-3"
              >
                <dt className="text-xs font-medium text-[#64748b]">
                  {item.label}
                </dt>
                <dd className="mt-1 text-sm font-semibold text-[#0b1220]">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      );
    case "headline":
      return (
        <div className="space-y-6">
          <h3 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[#0b1220]">
            {slide.title}
          </h3>
          <div className="rounded-2xl border border-[#d7e0ea] bg-gradient-to-br from-[#e0f7fa] to-[#e3f2fd] px-6 py-8">
            <p className="text-sm text-[#475569]">{slide.primaryLabel}</p>
            <p className="mt-2 font-[family-name:var(--font-display)] text-4xl font-bold tracking-tight text-[#0b1220] sm:text-5xl">
              {slide.primaryValue}
            </p>
          </div>
          {slide.highlights.length > 0 ? (
            <dl className="grid gap-3 sm:grid-cols-3">
              {slide.highlights.map((h) => (
                <div
                  key={h.label}
                  className="rounded-xl border border-[#d7e0ea] px-4 py-3"
                >
                  <dt className="text-xs text-[#64748b]">{h.label}</dt>
                  <dd className="mt-1 text-sm font-semibold text-[#0b1220]">
                    {h.value}
                  </dd>
                </div>
              ))}
            </dl>
          ) : null}
        </div>
      );
    case "table":
      return (
        <div className="space-y-4">
          <h3 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[#0b1220]">
            {slide.title}
          </h3>
          <div className="overflow-hidden rounded-xl border border-[#d7e0ea]">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#f1f5f9] text-xs tracking-wide text-[#64748b] uppercase">
                <tr>
                  <th className="px-4 py-3 font-semibold">Metric</th>
                  <th className="px-4 py-3 font-semibold">Value</th>
                </tr>
              </thead>
              <tbody>
                {slide.rows.map((row) => (
                  <tr
                    key={row.label}
                    className="border-t border-[#e2e8f0] text-[#0b1220]"
                  >
                    <td className="px-4 py-3">{row.label}</td>
                    <td className="px-4 py-3 font-semibold">{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    case "pie":
      return (
        <div className="space-y-4">
          <h3 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[#0b1220]">
            {slide.title}
          </h3>
          <PresentationPieChart points={slide.points} />
        </div>
      );
    case "bars":
      return (
        <div className="space-y-4">
          <h3 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[#0b1220]">
            {slide.title}
          </h3>
          <PresentationBarChart points={slide.points} />
        </div>
      );
    case "notes":
      return (
        <div className="space-y-4">
          <h3 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[#0b1220]">
            {slide.title}
          </h3>
          <div className="space-y-3">
            {slide.paragraphs.map((p) => (
              <p key={p.slice(0, 40)} className="text-sm leading-relaxed text-[#334155]">
                {p}
              </p>
            ))}
          </div>
        </div>
      );
    case "summary":
      return (
        <div className="space-y-4">
          <h3 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[#0b1220]">
            {slide.title}
          </h3>
          <ul className="space-y-2">
            {slide.bullets.map((b) => (
              <li
                key={b}
                className="flex gap-3 text-sm leading-relaxed text-[#334155]"
              >
                <span
                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#00B8D4]"
                  aria-hidden
                />
                <span>{b}</span>
              </li>
            ))}
          </ul>
          <p className="pt-4 text-xs text-[#64748b]">{slide.footer}</p>
        </div>
      );
    default:
      return null;
  }
}

export function ToolPresentationDeck(props: PresentationDeckInput) {
  const {
    toolTitle,
    category,
    inputs,
    primaryLabel,
    primaryValue,
    rows,
    note,
    insight,
  } = props;

  const slides = useMemo(
    () =>
      buildPresentationDeck({
        toolTitle,
        category,
        inputs,
        primaryLabel,
        primaryValue,
        rows,
        note,
        insight,
      }),
    [
      toolTitle,
      category,
      inputs,
      primaryLabel,
      primaryValue,
      rows,
      note,
      insight,
    ]
  );
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const exportRootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowRight") {
        setIndex((i) => Math.min(slides.length - 1, i + 1));
      }
      if (e.key === "ArrowLeft") {
        setIndex((i) => Math.max(0, i - 1));
      }
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, slides.length]);

  const download = async () => {
    if (!exportRootRef.current) return;
    setBusy(true);
    setError(null);
    try {
      // Ensure charts have painted before capture.
      await new Promise((r) => setTimeout(r, 350));
      await exportPresentationPdf(
        exportRootRef.current,
        `${toolTitle}-presentation`
      );
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Could not generate PDF.";
      setError(
        `${message} Try Chrome/Edge, disable extensions, or refresh and retry.`
      );
    } finally {
      setBusy(false);
    }
  };

  const current = slides[index];

  return (
    <div className="mt-4 space-y-2">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => {
            setIndex(0);
            setOpen(true);
            setError(null);
          }}
          className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm font-semibold transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
        >
          View presentation
        </button>
        <button
          type="button"
          onClick={() => void download()}
          disabled={busy}
          className="rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-[#041018] transition hover:opacity-90 disabled:opacity-60"
        >
          {busy ? "Building PDF…" : "Download presentation PDF"}
        </button>
      </div>
      <p className="text-xs text-[var(--muted)]">
        {slides.length}-slide deck with breakdown charts — share or download as
        PDF.
      </p>
      {error && !open ? (
        <p className="text-xs text-red-600">{error}</p>
      ) : null}

      {/* Always mounted for PDF capture (charts need to paint). */}
      <div
        ref={exportRootRef}
        aria-hidden
        className="pointer-events-none fixed top-0 left-[-10000px] w-[1100px] space-y-6 bg-white p-4"
      >
        {slides.map((slide) => (
          <div
            key={`export-${slide.id}`}
            data-presentation-slide
            className="box-border min-h-[620px] w-[1100px] rounded-xl border border-[#d7e0ea] bg-white p-10"
          >
            <SlideBody slide={slide} />
          </div>
        ))}
      </div>

      {open ? (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/55 p-3 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label="Tool presentation"
        >
          <div className="flex max-h-[95vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--background)] shadow-2xl">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] px-4 py-3 sm:px-5">
              <div>
                <p className="text-xs font-semibold tracking-[0.14em] text-[var(--accent)] uppercase">
                  Presentation
                </p>
                <p className="text-sm font-medium text-[var(--foreground)]">
                  Slide {index + 1} of {slides.length}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => void download()}
                  disabled={busy}
                  className="rounded-lg bg-[var(--accent)] px-3 py-2 text-xs font-semibold text-[#041018] disabled:opacity-60"
                >
                  {busy ? "Building PDF…" : "Download PDF"}
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-lg border border-[var(--border)] px-3 py-2 text-xs font-semibold"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto bg-[#eef2f7] p-3 sm:p-5">
              <div className="mx-auto aspect-[16/10] max-h-[70vh] w-full max-w-4xl overflow-y-auto rounded-xl border border-[#d7e0ea] bg-white p-5 shadow-sm sm:p-8">
                {current ? <SlideBody slide={current} /> : null}
              </div>
              {error ? (
                <p className="mx-auto mt-3 max-w-4xl text-xs text-red-600">
                  {error}
                </p>
              ) : null}
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-[var(--border)] px-4 py-3 sm:px-5">
              <button
                type="button"
                disabled={index === 0}
                onClick={() => setIndex((i) => Math.max(0, i - 1))}
                className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-semibold disabled:opacity-40"
              >
                Previous
              </button>
              <div className="flex flex-wrap justify-center gap-1.5">
                {slides.map((s, i) => (
                  <button
                    key={s.id}
                    type="button"
                    aria-label={`Go to slide ${i + 1}`}
                    onClick={() => setIndex(i)}
                    className={`h-2.5 w-2.5 rounded-full ${
                      i === index
                        ? "bg-[var(--accent)]"
                        : "bg-[var(--border)]"
                    }`}
                  />
                ))}
              </div>
              <button
                type="button"
                disabled={index >= slides.length - 1}
                onClick={() =>
                  setIndex((i) => Math.min(slides.length - 1, i + 1))
                }
                className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-semibold disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
