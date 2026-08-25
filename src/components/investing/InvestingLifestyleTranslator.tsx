"use client";

import { useMemo, useState } from "react";
import type { CalcResult } from "@/lib/types";
import { buildInvestingLifestyleLines } from "@/lib/investingEnhancements";

/** Investing-specific lifestyle / fee-drag translator (additive). */
export function InvestingLifestyleTranslator({
  formulaType,
  values,
  result,
}: {
  formulaType: string;
  values: Record<string, number>;
  result: CalcResult;
}) {
  const [open, setOpen] = useState(true);
  const lines = useMemo(
    () => buildInvestingLifestyleLines(formulaType, values, result),
    [formulaType, values, result]
  );

  if (lines.length === 0) return null;

  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-start justify-between gap-3 text-left"
        aria-expanded={open}
      >
        <div>
          <p className="text-xs font-semibold tracking-[0.16em] text-[var(--accent)] uppercase">
            Strategic insight
          </p>
          <h3 className="mt-1 font-[family-name:var(--font-display)] text-lg font-bold tracking-tight">
            Lifestyle trade-off translator
          </h3>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Translate fees, gains, and timelines into decisions you can act on.
          </p>
        </div>
        <span
          className={`text-xl text-[var(--muted)] transition ${open ? "rotate-180" : ""}`}
          aria-hidden
        >
          ▾
        </span>
      </button>

      {open ? (
        <ul className="mt-5 space-y-3 border-t border-[var(--border)] pt-5">
          {lines.map((line) => (
            <li
              key={line}
              className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm leading-relaxed text-[color-mix(in_srgb,var(--foreground)_82%,var(--muted))]"
            >
              {line}
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
