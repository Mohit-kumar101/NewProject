"use client";

import { useMemo, useState } from "react";
import type { Calculator } from "@/lib/types";
import { runCalculation } from "@/lib/formulas";
import { projectTokenomicsSeries } from "@/lib/monetization/tokenomicsSeries";
import {
  downloadTextFile,
  inputsToCsv,
} from "@/lib/monetization/tokenomicsSeries";
import Link from "next/link";

function cloneInputs(values: Record<string, number>) {
  return { ...values };
}

export function CryptoProWorkspace({
  calculator,
  values,
}: {
  calculator: Calculator;
  values: Record<string, number>;
}) {
  const result = useMemo(
    () => runCalculation(calculator.formulaType, values),
    [calculator.formulaType, values]
  );

  const [scenarioB, setScenarioB] = useState<Record<string, number>>(() =>
    cloneInputs(values)
  );

  const resultB = useMemo(
    () => runCalculation(calculator.formulaType, scenarioB),
    [calculator.formulaType, scenarioB]
  );

  const isTokenomics = calculator.formulaType === "cryptoTokenomics";
  const series = useMemo(() => {
    if (!isTokenomics) return [];
    return projectTokenomicsSeries({
      totalSupply: values.totalSupply ?? 0,
      tgeCirculating: values.tgeCirculating ?? 0,
      vestedAllocation: values.vestedAllocation ?? 0,
      cliffMonths: values.cliffMonths ?? 0,
      vestingMonths: values.vestingMonths ?? 1,
      monthlyEmission: values.monthlyEmission ?? 0,
      projectionMonths: values.projectionMonths ?? 0,
    });
  }, [isTokenomics, values]);

  const exportCsv = () => {
    const rows = [
      result.primary,
      ...result.secondary,
      ...(result.featured ?? []),
    ];
    const csv = inputsToCsv(calculator.title, values, rows);
    downloadTextFile(
      `${calculator.slug}-export.csv`,
      csv,
      "text/csv;charset=utf-8"
    );
  };

  return (
    <section className="space-y-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-[0.14em] text-[var(--accent)] uppercase">
            Free toolkit
          </p>
          <h2 className="mt-1 font-[family-name:var(--font-display)] text-xl font-bold tracking-tight">
            Scenarios & exports
          </h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Compare scenarios and export CSV — all free, in your browser.
          </p>
        </div>
        <Link
          href="/crypto/reports"
          className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-semibold hover:border-[var(--accent)]"
        >
          PDF reports
        </Link>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-3 text-left text-sm transition hover:border-[var(--accent)]"
          onClick={exportCsv}
        >
          <span className="font-semibold">Export CSV</span>
          <span className="mt-1 block text-xs text-[var(--muted)]">
            Download inputs + results
          </span>
        </button>
        <div className="rounded-xl border border-dashed border-[var(--border)] px-3 py-3 text-sm text-[var(--muted)]">
          <span className="font-semibold text-[var(--foreground)]">Tip</span>
          <span className="mt-1 block text-xs">
            Bookmark this page or export CSV to keep a snapshot.
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-semibold">Scenario comparison</h3>
        <p className="text-xs text-[var(--muted)]">
          Scenario A uses your live inputs. Adjust Scenario B below to compare.
        </p>
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-4">
            <p className="text-xs font-semibold tracking-wide text-[var(--accent)] uppercase">
              Scenario A (live)
            </p>
            <p className="mt-2 text-lg font-bold">{result.primary.value}</p>
            <p className="text-xs text-[var(--muted)]">{result.primary.label}</p>
          </div>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-4">
            <p className="text-xs font-semibold tracking-wide text-[var(--accent)] uppercase">
              Scenario B
            </p>
            <p className="mt-2 text-lg font-bold">{resultB.primary.value}</p>
            <p className="text-xs text-[var(--muted)]">{resultB.primary.label}</p>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {calculator.inputs.map((input) => (
            <label key={`b-${input.id}`} className="text-xs">
              <span className="font-medium text-[var(--muted)]">
                B · {input.label}
              </span>
              <input
                type="number"
                min={input.min}
                max={input.max}
                step={input.step}
                value={scenarioB[input.id] ?? input.defaultValue}
                onChange={(e) => {
                  const n = Number(e.target.value);
                  setScenarioB((prev) => ({
                    ...prev,
                    [input.id]: Number.isFinite(n) ? n : prev[input.id],
                  }));
                }}
                className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1.5 text-sm outline-none focus:border-[var(--accent)]"
              />
            </label>
          ))}
        </div>
        <button
          type="button"
          className="text-xs font-semibold text-[var(--accent)]"
          onClick={() => setScenarioB(cloneInputs(values))}
        >
          Reset B from A
        </button>
      </div>

      {isTokenomics ? (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold">Advanced supply expansion table</h3>
          <div className="max-h-64 overflow-auto rounded-xl border border-[var(--border)]">
            <table className="min-w-full text-left text-xs">
              <thead className="sticky top-0 bg-[var(--background)]">
                <tr className="border-b border-[var(--border)]">
                  <th className="px-3 py-2 font-semibold">Month</th>
                  <th className="px-3 py-2 font-semibold">Circulating</th>
                  <th className="px-3 py-2 font-semibold">Locked</th>
                  <th className="px-3 py-2 font-semibold">Vested</th>
                  <th className="px-3 py-2 font-semibold">Emissions</th>
                </tr>
              </thead>
              <tbody>
                {series.map((row) => (
                  <tr
                    key={row.month}
                    className="border-b border-[var(--border)]/70"
                  >
                    <td className="px-3 py-1.5">{row.month}</td>
                    <td className="px-3 py-1.5">
                      {Math.round(row.circulating).toLocaleString()}
                    </td>
                    <td className="px-3 py-1.5">
                      {Math.round(row.locked).toLocaleString()}
                    </td>
                    <td className="px-3 py-1.5">
                      {Math.round(row.vestedUnlocked).toLocaleString()}
                    </td>
                    <td className="px-3 py-1.5">
                      {Math.round(row.emissions).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Link
            href="/crypto/reports"
            className="inline-flex text-xs font-semibold text-[var(--accent)] hover:underline"
          >
            Open full charts & PDF report →
          </Link>
        </div>
      ) : null}
    </section>
  );
}
