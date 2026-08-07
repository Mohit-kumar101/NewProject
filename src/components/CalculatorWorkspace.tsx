"use client";

import { useMemo, useState, type Dispatch, type SetStateAction } from "react";
import Link from "next/link";
import type { Calculator } from "@/lib/types";
import { runCalculation } from "@/lib/formulas";
import { ScientificCalculator } from "@/components/ScientificCalculator";

export function CalculatorWorkspace({
  calculator,
  related,
}: {
  calculator: Calculator;
  related: Calculator[];
}) {
  const isScientific = calculator.formulaType === "scientificCalculator";

  const [values, setValues] = useState<Record<string, number>>(() =>
    Object.fromEntries(
      calculator.inputs.map((input) => [input.id, input.defaultValue])
    )
  );

  if (isScientific) {
    return (
      <div className="space-y-5">
        <ScientificCalculator />
        <aside className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5">
          <div className="mb-3 flex items-baseline justify-between gap-3">
            <h2 className="text-xs font-semibold tracking-[0.14em] text-[var(--accent)] uppercase sm:text-sm">
              Related tools
            </h2>
            <p className="text-[11px] text-[var(--muted)]">{calculator.category}</p>
          </div>
          <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((tool) => (
              <li key={tool.slug}>
                <Link
                  href={`/tools/${tool.slug}`}
                  className="block rounded-xl border border-transparent px-3 py-2 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--border)] hover:bg-[var(--background)] hover:text-[var(--accent)]"
                >
                  {tool.title}
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    );
  }

  return (
    <StandardCalculatorWorkspace
      calculator={calculator}
      related={related}
      values={values}
      setValues={setValues}
    />
  );
}

function StandardCalculatorWorkspace({
  calculator,
  related,
  values,
  setValues,
}: {
  calculator: Calculator;
  related: Calculator[];
  values: Record<string, number>;
  setValues: Dispatch<SetStateAction<Record<string, number>>>;
}) {
  const result = useMemo(
    () => runCalculation(calculator.formulaType, values),
    [calculator.formulaType, values]
  );

  const update = (id: string, raw: string) => {
    const next = Number(raw);
    setValues((prev) => ({
      ...prev,
      [id]: Number.isFinite(next) ? next : prev[id],
    }));
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1.05fr_0.9fr_0.75fr] xl:items-start">
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
        <h2 className="mb-5 text-lg font-semibold">Inputs</h2>
        <div className="space-y-6">
          {calculator.inputs.map((input) => {
            const value = values[input.id] ?? input.defaultValue;
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
                  value={value}
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

      <aside className="xl:sticky xl:top-24">
        <div className="results-card rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <p className="text-xs font-semibold tracking-[0.16em] text-[var(--accent)] uppercase">
            Live results
          </p>
          <p className="mt-3 text-sm text-[var(--muted)]">{result.primary.label}</p>
          <p className="result-glow mt-1 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            {result.primary.value}
          </p>

          {result.featured && result.featured.length > 0 && (
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
          )}

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

          {result.insight && (
            <div className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--background)] p-4">
              <p className="text-[11px] font-semibold tracking-[0.14em] text-[var(--accent)] uppercase">
                Coasting insight
              </p>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                {result.insight}
              </p>
            </div>
          )}

          <p className="mt-6 text-xs leading-relaxed text-[var(--muted)]">
            Estimates update instantly in your browser. Figures are for planning
            guidance and are not professional advice.
          </p>
        </div>
      </aside>

      <aside className="xl:sticky xl:top-24">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <h2 className="text-sm font-semibold tracking-[0.14em] text-[var(--accent)] uppercase">
            Related tools
          </h2>
          <p className="mt-2 text-xs text-[var(--muted)]">
            More in {calculator.category}
          </p>
          <ul className="mt-4 space-y-2">
            {related.map((tool) => (
              <li key={tool.slug}>
                <Link
                  href={`/tools/${tool.slug}`}
                  className="block rounded-xl border border-transparent px-3 py-2.5 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--border)] hover:bg-[var(--background)] hover:text-[var(--accent)]"
                >
                  {tool.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}
