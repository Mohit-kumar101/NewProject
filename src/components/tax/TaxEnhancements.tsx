"use client";

import { useState } from "react";
import type { CalcResult, Calculator } from "@/lib/types";
import {
  loadTaxEstimate,
  saveTaxEstimate,
} from "@/lib/toolPersistence";
import { parseMoneyish } from "@/lib/investingEnhancements";

const TAX_YEARS = [2024, 2025, 2026] as const;

export function TaxEnhancements({
  calculator,
  values,
  result,
}: {
  calculator: Calculator;
  values: Record<string, number>;
  result: CalcResult;
}) {
  const previous = loadTaxEstimate(calculator.slug);
  const [year, setYear] = useState<number>(previous?.year ?? 2026);
  const [status, setStatus] = useState<string | null>(null);
  const [saved, setSaved] = useState(previous);

  const saveEstimate = () => {
    const estimate = {
      year,
      values,
      primaryLabel: result.primary.label,
      primaryValue: result.primary.value,
      at: new Date().toISOString(),
    };
    saveTaxEstimate(calculator.slug, estimate);
    setSaved(estimate);
    setStatus(`Saved ${year} estimate on this device`);
  };

  const currentNum = parseMoneyish(result.primary.value);
  const savedNum = saved ? parseMoneyish(saved.primaryValue) : NaN;
  const delta =
    Number.isFinite(currentNum) && Number.isFinite(savedNum)
      ? currentNum - savedNum
      : null;

  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
      <p className="text-xs font-semibold tracking-[0.16em] text-[var(--accent)] uppercase">
        Tax season helper
      </p>
      <h2 className="mt-1 font-[family-name:var(--font-display)] text-lg font-bold">
        Tax year & saved estimate
      </h2>
      <p className="mt-2 text-sm text-[var(--muted)]">
        Label your planning year and compare against the last estimate saved in
        this browser. Figures are educational — confirm with CRA/BC tables or a
        tax professional.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {TAX_YEARS.map((y) => (
          <button
            key={y}
            type="button"
            onClick={() => setYear(y)}
            className={`rounded-xl px-3.5 py-2 text-sm font-semibold transition ${
              year === y
                ? "bg-[var(--accent)] text-[#041018]"
                : "border border-[var(--border)] bg-[var(--background)]"
            }`}
          >
            {y}
          </button>
        ))}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-4">
          <p className="text-[11px] text-[var(--muted)] uppercase">
            Current ({year})
          </p>
          <p className="mt-1 text-sm text-[var(--muted)]">
            {result.primary.label}
          </p>
          <p className="font-[family-name:var(--font-display)] text-xl font-bold">
            {result.primary.value}
          </p>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-4">
          <p className="text-[11px] text-[var(--muted)] uppercase">
            Last saved{saved ? ` (${saved.year})` : ""}
          </p>
          {saved ? (
            <>
              <p className="mt-1 text-sm text-[var(--muted)]">
                {saved.primaryLabel}
              </p>
              <p className="font-[family-name:var(--font-display)] text-xl font-bold">
                {saved.primaryValue}
              </p>
              {delta != null ? (
                <p className="mt-2 text-xs font-medium text-[var(--accent)]">
                  vs saved: {delta >= 0 ? "+" : ""}
                  {delta.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                    maximumFractionDigits: 0,
                  })}
                </p>
              ) : null}
            </>
          ) : (
            <p className="mt-2 text-sm text-[var(--muted)]">
              No estimate saved yet.
            </p>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={saveEstimate}
        className="mt-4 rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-[#041018]"
      >
        Save this estimate
      </button>
      {status ? (
        <p className="mt-2 text-xs text-[var(--accent)]">{status}</p>
      ) : null}

      <p className="mt-4 text-xs leading-relaxed text-[var(--muted)]">
        Seasonal tip: revisit in March–April before filing. Explore the{" "}
        <a href="/taxes/canada" className="font-semibold text-[var(--accent)]">
          Canada tax hub
        </a>{" "}
        for related calculators.
      </p>
    </section>
  );
}
