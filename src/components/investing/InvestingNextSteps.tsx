"use client";

import { useState } from "react";
import Link from "next/link";
import type { CalcResult, Calculator } from "@/lib/types";
import {
  buildInvestingSummaryText,
  getInvestingNextStepCtas,
} from "@/lib/investingEnhancements";

export function InvestingNextSteps({
  calculator,
  values,
  result,
}: {
  calculator: Calculator;
  values: Record<string, number>;
  result: CalcResult;
}) {
  const [copied, setCopied] = useState(false);
  const ctas = getInvestingNextStepCtas(calculator);

  const copySummary = async () => {
    const text = buildInvestingSummaryText(calculator, values, result);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section
      className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6"
      aria-labelledby="investing-next-steps-heading"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-[0.16em] text-[var(--accent)] uppercase">
            Next steps
          </p>
          <h2
            id="investing-next-steps-heading"
            className="mt-1 font-[family-name:var(--font-display)] text-lg font-bold tracking-tight sm:text-xl"
          >
            Keep exploring
          </h2>
          <p className="mt-2 text-sm text-[var(--muted)]">
            High-intent follow-ups across investing, housing, and debt tools.
          </p>
        </div>
        <button
          type="button"
          onClick={copySummary}
          className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3.5 py-2 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
        >
          {copied ? "Copied ✓" : "Copy summary"}
        </button>
      </div>

      <ul className="mt-5 grid gap-3 sm:grid-cols-1">
        {ctas.map((cta) => (
          <li key={cta.href}>
            <Link
              href={cta.href}
              className="flex items-center justify-between gap-3 rounded-xl border border-[color-mix(in_srgb,var(--accent)_35%,var(--border))] bg-[color-mix(in_srgb,var(--accent)_12%,var(--background))] px-4 py-3.5 text-sm font-semibold text-[var(--foreground)] transition hover:bg-[color-mix(in_srgb,var(--accent)_20%,var(--background))] hover:text-[var(--accent)]"
            >
              <span>{cta.label}</span>
              {cta.externalCategory ? (
                <span className="shrink-0 text-[11px] font-medium tracking-wide text-[var(--muted)] uppercase">
                  {cta.externalCategory}
                </span>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
