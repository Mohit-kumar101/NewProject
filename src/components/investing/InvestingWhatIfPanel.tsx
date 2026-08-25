"use client";

import { useEffect, useMemo, useState } from "react";
import type { Calculator } from "@/lib/types";
import { runCalculation } from "@/lib/formulas";
import {
  getInvestingWhatIfSliders,
  type WhatIfSliderDef,
} from "@/lib/investingEnhancements";

/**
 * Secondary what-if panel — local state only.
 * Does not alter the base calculator form unless the user clicks Apply.
 */
export function InvestingWhatIfPanel({
  calculator,
  baseValues,
  onApply,
}: {
  calculator: Calculator;
  baseValues: Record<string, number>;
  onApply?: (next: Record<string, number>) => void;
}) {
  const sliders = useMemo(
    () => getInvestingWhatIfSliders(calculator),
    [calculator]
  );

  const [whatIf, setWhatIf] = useState<Record<string, number>>(() => ({
    ...baseValues,
  }));

  useEffect(() => {
    setWhatIf({ ...baseValues });
  }, [calculator.slug, calculator.formulaType]); // eslint-disable-line react-hooks/exhaustive-deps -- resync when tool changes only

  if (sliders.length === 0) return null;

  const result = runCalculation(calculator.formulaType, whatIf);
  const baseResult = runCalculation(calculator.formulaType, baseValues);

  const update = (id: string, raw: number) => {
    setWhatIf((prev) => ({
      ...prev,
      [id]: Number.isFinite(raw) ? raw : prev[id],
    }));
  };

  return (
    <section
      className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6"
      aria-labelledby="investing-what-if-heading"
    >
      <p className="text-xs font-semibold tracking-[0.16em] text-[var(--accent)] uppercase">
        Scenario lab
      </p>
      <h2
        id="investing-what-if-heading"
        className="mt-1 font-[family-name:var(--font-display)] text-lg font-bold tracking-tight sm:text-xl"
      >
        What-if workspace
      </h2>
      <p className="mt-2 text-sm text-[var(--muted)]">
        Tweak contributions, returns, or fees here without breaking the base
        inputs above. Compare the live scenario against your current result.
      </p>

      <div className="mt-6 space-y-5">
        {sliders.map((slider: WhatIfSliderDef) => {
          const value = whatIf[slider.id] ?? slider.min;
          return (
            <div key={slider.id}>
              <div className="mb-2 flex items-center justify-between gap-3">
                <label
                  htmlFor={`whatif-${slider.id}`}
                  className="text-sm font-medium text-[var(--foreground)]"
                >
                  {slider.label}
                </label>
                <input
                  id={`whatif-${slider.id}-number`}
                  type="number"
                  inputMode="decimal"
                  min={slider.min}
                  max={slider.max}
                  step={slider.step}
                  value={value}
                  onChange={(e) => update(slider.id, Number(e.target.value))}
                  className="w-28 rounded-lg border border-[var(--border)] bg-[var(--background)] px-2.5 py-1.5 text-right text-sm outline-none focus:border-[var(--accent)]"
                />
              </div>
              <input
                id={`whatif-${slider.id}`}
                type="range"
                min={slider.min}
                max={slider.max}
                step={slider.step}
                value={value}
                onChange={(e) => update(slider.id, Number(e.target.value))}
                className="range-input w-full"
              />
              <div className="mt-1 flex justify-between text-[11px] text-[var(--muted)]">
                <span>{slider.min}</span>
                <span>{slider.max}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-4">
          <p className="text-[11px] font-semibold tracking-[0.14em] text-[var(--muted)] uppercase">
            Base result
          </p>
          <p className="mt-1 text-sm text-[var(--muted)]">
            {baseResult.primary.label}
          </p>
          <p className="mt-0.5 font-[family-name:var(--font-display)] text-xl font-bold tracking-tight">
            {baseResult.primary.value}
          </p>
        </div>
        <div className="rounded-xl border border-[color-mix(in_srgb,var(--accent)_40%,var(--border))] bg-[color-mix(in_srgb,var(--accent)_8%,var(--background))] p-4">
          <p className="text-[11px] font-semibold tracking-[0.14em] text-[var(--accent)] uppercase">
            What-if result
          </p>
          <p className="mt-1 text-sm text-[var(--muted)]">
            {result.primary.label}
          </p>
          <p className="mt-0.5 font-[family-name:var(--font-display)] text-xl font-bold tracking-tight">
            {result.primary.value}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setWhatIf({ ...baseValues })}
          className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3.5 py-2 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent)]"
        >
          Reset to base
        </button>
        {onApply ? (
          <button
            type="button"
            onClick={() => onApply({ ...whatIf })}
            className="rounded-xl bg-[var(--accent)] px-3.5 py-2 text-sm font-semibold text-[#041018] transition hover:opacity-90"
          >
            Apply scenario to calculator
          </button>
        ) : null}
      </div>
    </section>
  );
}
