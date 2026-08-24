"use client";

import { useMemo, useState } from "react";
import {
  runAffordabilityCalculation,
} from "@/lib/formulas_affordability";
import type { AffordabilityPageConfig } from "@/lib/affordability/types";
import { StrategicInsightsPanel } from "@/components/strategic/StrategicInsightsPanel";
import { buildAffordabilityInsightsConfig } from "@/lib/strategicInsights";

function initialValues(page: AffordabilityPageConfig): Record<string, number> {
  const values: Record<string, number> = { ...page.presets };
  for (const input of page.inputs) {
    if (values[input.id] === undefined) {
      values[input.id] = input.defaultValue ?? 0;
    }
  }
  return values;
}

/**
 * Single configurable Affordability Engine UI.
 * Presets from `data/affordability.config.json` pre-populate inputs so
 * visitors see a live calculation on first paint.
 */
export function AffordabilityEngine({
  page,
}: {
  page: AffordabilityPageConfig;
}) {
  const [values, setValues] = useState<Record<string, number>>(() =>
    initialValues(page)
  );

  const result = useMemo(
    () => runAffordabilityCalculation(page.engineMode, values),
    [page.engineMode, values]
  );

  const strategicConfig = useMemo(
    () =>
      buildAffordabilityInsightsConfig(
        page.engineMode,
        values,
        result.primary.value,
        result.secondary
      ),
    [page.engineMode, values, result.primary.value, result.secondary]
  );

  const update = (id: string, raw: string) => {
    const next = Number(raw);
    setValues((prev) => ({
      ...prev,
      [id]: Number.isFinite(next) ? next : prev[id],
    }));
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-2">
            <h2 className="text-lg font-semibold">Inputs</h2>
            <p className="text-[11px] font-medium tracking-[0.12em] text-[var(--accent)] uppercase">
              Pre-filled · editable
            </p>
          </div>
          <div className="space-y-6">
            {page.inputs.map((input) => {
              const value = values[input.id] ?? 0;
              if (input.inputType === "checkbox") {
                const checked = value >= 0.5;
                return (
                  <div key={input.id}>
                    <label
                      htmlFor={input.id}
                      className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3"
                    >
                      <span className="text-sm font-medium text-[var(--foreground)]">
                        {input.label}
                      </span>
                      <input
                        id={input.id}
                        type="checkbox"
                        checked={checked}
                        onChange={(e) =>
                          setValues((prev) => ({
                            ...prev,
                            [input.id]: e.target.checked ? 1 : 0,
                          }))
                        }
                        className="h-5 w-5 accent-[var(--accent)]"
                      />
                    </label>
                  </div>
                );
              }
              return (
                <div key={input.id}>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <label
                      htmlFor={input.id}
                      className="text-sm font-medium text-[var(--foreground)]"
                    >
                      {input.label}
                    </label>
                    <input
                      id={`${input.id}-number`}
                      type="number"
                      inputMode="decimal"
                      min={input.min}
                      max={input.max}
                      step={input.step}
                      value={value}
                      onChange={(e) => update(input.id, e.target.value)}
                      className="w-28 rounded-lg border border-[var(--border)] bg-[var(--background)] px-2.5 py-1.5 text-right text-sm outline-none focus:border-[var(--accent)]"
                    />
                  </div>
                  <input
                    id={input.id}
                    type="range"
                    min={input.min}
                    max={input.max}
                    step={input.step}
                    value={Math.min(input.max, Math.max(input.min, value))}
                    onChange={(e) => update(input.id, e.target.value)}
                    className="range-input w-full"
                  />
                  <div className="mt-1 flex justify-between text-[11px] text-[var(--muted)]">
                    <span>{input.min}</span>
                    <span>{input.max}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <aside className="lg:sticky lg:top-24">
          <div className="results-card rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
            <p className="text-xs font-semibold tracking-[0.16em] text-[var(--accent)] uppercase">
              Live results
            </p>
            <p className="mt-3 text-sm text-[var(--muted)]">
              {result.primary.label}
            </p>
            <p className="result-glow mt-1 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl">
              {result.primary.value}
            </p>

            {result.featured && result.featured.length > 0 ? (
              <div className="mt-6 space-y-4 border-t border-[var(--border)] pt-5">
                {result.featured.map((item) => (
                  <div key={item.label}>
                    <p className="text-sm text-[var(--muted)]">{item.label}</p>
                    <p className="result-glow mt-1 font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight sm:text-3xl">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            ) : null}

            <dl className="mt-8 space-y-4">
              {result.secondary.map((item) => (
                <div
                  key={item.label}
                  className="flex items-start justify-between gap-4 border-t border-[var(--border)] pt-4"
                >
                  <dt className="text-sm text-[var(--muted)]">{item.label}</dt>
                  <dd className="text-right text-sm font-semibold text-[var(--foreground)]">
                    {item.value}
                  </dd>
                </div>
              ))}
            </dl>

            {result.insight ? (
              <div className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--background)] p-4">
                <p className="text-[11px] font-semibold tracking-[0.14em] text-[var(--accent)] uppercase">
                  Planning insight
                </p>
                <p className="mt-2 text-sm leading-relaxed text-[color-mix(in_srgb,var(--foreground)_78%,var(--muted))]">
                  {result.insight}
                </p>
              </div>
            ) : null}
          </div>
        </aside>
      </div>

      {strategicConfig ? (
        <StrategicInsightsPanel config={strategicConfig} />
      ) : null}
    </div>
  );
}
