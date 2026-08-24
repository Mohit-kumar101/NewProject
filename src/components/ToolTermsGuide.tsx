"use client";

import { useId, useState } from "react";
import type { ToolTermsGuideData } from "@/lib/toolExplanations";

/**
 * Sticky “Terms & how it works” panel for the tool right rail (and mobile).
 */
export function ToolTermsGuide({
  toolTitle,
  guide,
  compact = false,
}: {
  toolTitle: string;
  guide: ToolTermsGuideData;
  /** Tighter layout for the desktop rail. */
  compact?: boolean;
}) {
  const panelId = useId();
  const [openSection, setOpenSection] = useState<"how" | "terms" | "formula">(
    "terms"
  );

  const terms = [
    ...guide.inputTerms,
    ...guide.formulaTerms.filter(
      (ft) =>
        !guide.inputTerms.some(
          (it) => it.name.toLowerCase() === ft.name.toLowerCase()
        )
    ),
  ];

  return (
    <section
      aria-label={`Terms and how ${toolTitle} works`}
      className={`overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] ${
        compact ? "text-[13px]" : ""
      }`}
    >
      <div className="border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--accent)_8%,var(--surface))] px-3.5 py-3 sm:px-4">
        <p className="text-[10px] font-semibold tracking-[0.16em] text-[var(--accent)] uppercase">
          Plain-English guide
        </p>
        <h2 className="mt-1 font-[family-name:var(--font-display)] text-base font-bold tracking-tight text-[var(--foreground)] sm:text-lg">
          Terms & how it works
        </h2>
        <p className="mt-1 text-xs leading-relaxed text-[var(--muted)]">
          Confused by a field? Read the short definitions here while you use the
          tool.
        </p>
      </div>

      <div className="flex border-b border-[var(--border)]">
        {(
          [
            ["terms", "Terms"],
            ["how", "How it works"],
            ["formula", "Formula"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setOpenSection(id)}
            className={`flex-1 px-2 py-2.5 text-center text-[11px] font-semibold transition ${
              openSection === id
                ? "border-b-2 border-[var(--accent)] text-[var(--accent)]"
                : "text-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div id={panelId} className="max-h-[min(70vh,560px)] overflow-y-auto p-3.5 sm:p-4">
        {openSection === "how" && (
          <ol className="space-y-3">
            {guide.howItWorks.map((step, i) => (
              <li key={step} className="flex gap-2.5">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#00E5FF] to-[#2979FF] text-[10px] font-bold text-white">
                  {i + 1}
                </span>
                <p className="pt-0.5 text-xs leading-relaxed text-[color-mix(in_srgb,var(--foreground)_80%,var(--muted))] sm:text-[13px]">
                  {step}
                </p>
              </li>
            ))}
          </ol>
        )}

        {openSection === "terms" && (
          <ul className="space-y-3">
            {terms.length === 0 ? (
              <li className="text-xs text-[var(--muted)]">
                Adjust the inputs on the left — results update from those
                values.
              </li>
            ) : (
              terms.map((term) => (
                <li
                  key={`${term.symbol ?? ""}-${term.name}`}
                  className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5"
                >
                  <div className="flex items-start gap-2">
                    {term.symbol ? (
                      <span className="mt-0.5 flex h-6 min-w-8 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-[#00E5FF] to-[#2979FF] px-1.5 font-mono text-[10px] font-bold text-white">
                        {term.symbol}
                      </span>
                    ) : null}
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-[var(--foreground)] sm:text-[13px]">
                        {term.name}
                      </p>
                      <p className="mt-0.5 text-[11px] leading-relaxed text-[var(--muted)] sm:text-xs">
                        {term.description}
                      </p>
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>
        )}

        {openSection === "formula" && (
          <div className="space-y-3">
            <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-3">
              <p className="text-[10px] font-semibold tracking-[0.14em] text-[var(--accent)] uppercase">
                Governing formula
              </p>
              <p className="mt-2 overflow-x-auto font-mono text-[11px] leading-relaxed text-[var(--foreground)] sm:text-xs">
                {guide.formula}
              </p>
            </div>
            <p className="text-xs leading-relaxed text-[color-mix(in_srgb,var(--foreground)_78%,var(--muted))]">
              {guide.summary}
            </p>
            {guide.notes.length > 0 && (
              <ul className="space-y-1.5 border-t border-[var(--border)] pt-3">
                {guide.notes.map((note) => (
                  <li
                    key={note}
                    className="text-[11px] leading-relaxed text-[var(--muted)]"
                  >
                    • {note}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
