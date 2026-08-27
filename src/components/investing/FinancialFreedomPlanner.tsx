"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Calculator } from "@/lib/types";
import { getToolHref } from "@/lib/cryptoFormulas";
import {
  DEFAULT_PROPERTY,
  calculateFreedomPlan,
  type PropertyInput,
} from "@/lib/financialFreedomPlanner/formulas";

const money = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);

function Field({
  label,
  value,
  min,
  max,
  step,
  onChange,
  prefix,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (n: number) => void;
  prefix?: string;
}) {
  return (
    <div>
      <div className="mb-1.5 flex justify-between gap-2">
        <label className="text-sm font-medium">{label}</label>
        <span className="text-sm tabular-nums text-[var(--muted)]">
          {prefix}
          {step < 1 ? value.toFixed(1) : Math.round(value).toLocaleString()}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="range-input w-full"
      />
    </div>
  );
}

export function FinancialFreedomPlanner({
  calculator,
  related,
}: {
  calculator: Calculator;
  related: Calculator[];
}) {
  const [currentAge, setCurrentAge] = useState(32);
  const [horizonYears, setHorizonYears] = useState(25);
  const [currentInvestments, setCurrentInvestments] = useState(85000);
  const [annualSalary, setAnnualSalary] = useState(95000);
  const [salaryGrowthPct, setSalaryGrowthPct] = useState(3);
  const [sideIncome, setSideIncome] = useState(12000);
  const [sideGrowthPct, setSideGrowthPct] = useState(5);
  const [monthlyExpenses, setMonthlyExpenses] = useState(4200);
  const [expenseInflationPct, setExpenseInflationPct] = useState(3);
  const [stockReturnPct, setStockReturnPct] = useState(7);
  const [bondReturnPct, setBondReturnPct] = useState(3.5);
  const [stockAllocationPct, setStockAllocationPct] = useState(80);
  const [withdrawalRatePct, setWithdrawalRatePct] = useState(4);
  const [properties, setProperties] = useState<PropertyInput[]>([DEFAULT_PROPERTY()]);
  const [extraSavingsPct, setExtraSavingsPct] = useState(0);

  const result = useMemo(() => {
    const base = calculateFreedomPlan({
      currentAge,
      horizonYears,
      currentInvestments,
      annualSalary: annualSalary * (1 + extraSavingsPct / 100 * 0.3),
      salaryGrowthPct,
      sideIncome,
      sideGrowthPct,
      monthlyExpenses: monthlyExpenses * (1 - extraSavingsPct / 100 * 0.5),
      expenseInflationPct,
      stockReturnPct,
      bondReturnPct,
      stockAllocationPct,
      withdrawalRatePct,
      properties,
    });
    return base;
  }, [
    currentAge,
    horizonYears,
    currentInvestments,
    annualSalary,
    salaryGrowthPct,
    sideIncome,
    sideGrowthPct,
    monthlyExpenses,
    expenseInflationPct,
    stockReturnPct,
    bondReturnPct,
    stockAllocationPct,
    withdrawalRatePct,
    properties,
    extraSavingsPct,
  ]);

  const chartMax = Math.max(...result.timeline.map((t) => t.netWorth), 1);

  const updateProperty = (id: string, patch: Partial<PropertyInput>) => {
    setProperties((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...patch } : p))
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6 xl:col-span-2">
          <h2 className="text-lg font-semibold">Income & expenses</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Current age" value={currentAge} min={22} max={65} step={1} onChange={setCurrentAge} />
            <Field label="Plan horizon (years)" value={horizonYears} min={5} max={40} step={1} onChange={setHorizonYears} />
            <Field label="Investments today" value={currentInvestments} min={0} max={2000000} step={5000} onChange={setCurrentInvestments} prefix="$" />
            <Field label="Annual salary" value={annualSalary} min={30000} max={500000} step={5000} onChange={setAnnualSalary} prefix="$" />
            <Field label="Salary growth %/yr" value={salaryGrowthPct} min={0} max={15} step={0.5} onChange={setSalaryGrowthPct} />
            <Field label="Side income / yr" value={sideIncome} min={0} max={200000} step={1000} onChange={setSideIncome} prefix="$" />
            <Field label="Side income growth %" value={sideGrowthPct} min={0} max={20} step={0.5} onChange={setSideGrowthPct} />
            <Field label="Monthly expenses" value={monthlyExpenses} min={1000} max={20000} step={100} onChange={setMonthlyExpenses} prefix="$" />
            <Field label="Expense inflation %" value={expenseInflationPct} min={0} max={10} step={0.5} onChange={setExpenseInflationPct} />
            <Field label="Stock allocation %" value={stockAllocationPct} min={0} max={100} step={5} onChange={setStockAllocationPct} />
            <Field label="Stock return %/yr" value={stockReturnPct} min={0} max={15} step={0.5} onChange={setStockReturnPct} />
            <Field label="Bond return %/yr" value={bondReturnPct} min={0} max={10} step={0.5} onChange={setBondReturnPct} />
            <Field label="Safe withdrawal rate %" value={withdrawalRatePct} min={2.5} max={5} step={0.25} onChange={setWithdrawalRatePct} />
          </div>

          <div className="border-t border-[var(--border)] pt-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold">Rental properties</h3>
              <button
                type="button"
                onClick={() =>
                  setProperties((p) => [
                    ...p,
                    { ...DEFAULT_PROPERTY(), id: crypto.randomUUID(), name: `Property ${p.length + 1}`, purchaseYear: 8 + p.length * 3 },
                  ])
                }
                className="rounded-lg bg-[var(--accent)] px-3 py-1.5 text-xs font-semibold text-[#041018]"
              >
                + Add property
              </button>
            </div>
            <div className="space-y-4">
              {properties.map((prop) => (
                <div
                  key={prop.id}
                  className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-4"
                >
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <input
                      value={prop.name}
                      onChange={(e) => updateProperty(prop.id, { name: e.target.value })}
                      className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2 py-1 text-sm font-medium"
                    />
                    {properties.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setProperties((p) => p.filter((x) => x.id !== prop.id))}
                        className="text-xs text-red-500"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="Purchase year" value={prop.purchaseYear} min={1} max={horizonYears} step={1} onChange={(n) => updateProperty(prop.id, { purchaseYear: n })} />
                    <Field label="Price" value={prop.price} min={50000} max={2000000} step={10000} onChange={(n) => updateProperty(prop.id, { price: n })} prefix="$" />
                    <Field label="Down payment %" value={prop.downPaymentPct} min={5} max={50} step={5} onChange={(n) => updateProperty(prop.id, { downPaymentPct: n })} />
                    <Field label="Mortgage rate %" value={prop.mortgageRatePct} min={2} max={12} step={0.25} onChange={(n) => updateProperty(prop.id, { mortgageRatePct: n })} />
                    <Field label="Rent / mo" value={prop.monthlyRent} min={500} max={15000} step={100} onChange={(n) => updateProperty(prop.id, { monthlyRent: n })} prefix="$" />
                    <Field label="Appreciation %/yr" value={prop.appreciationPct} min={0} max={10} step={0.5} onChange={(n) => updateProperty(prop.id, { appreciationPct: n })} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-24">
          <div className="results-card rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
            <p className="text-xs font-semibold tracking-[0.16em] text-[var(--accent)] uppercase">
              FIRE target
            </p>
            <p className="result-glow mt-2 font-[family-name:var(--font-display)] text-3xl font-bold">
              {money(result.fireNumber)}
            </p>
            <p className="mt-2 text-sm text-[var(--muted)]">{result.insight}</p>
            <dl className="mt-5 space-y-2 border-t border-[var(--border)] pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-[var(--muted)]">FIRE year</dt>
                <dd className="font-semibold">
                  {result.fireYear != null ? `Year ${result.fireYear} (age ${result.fireAge})` : "Not in horizon"}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[var(--muted)]">Net worth at end</dt>
                <dd className="font-semibold">{money(result.finalNetWorth)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[var(--muted)]">Passive / mo at FIRE</dt>
                <dd className="font-semibold">{money(result.monthlyPassiveAtFire)}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <h3 className="text-sm font-semibold">What-if: boost discipline</h3>
            <p className="mt-1 text-xs text-[var(--muted)]">
              Simulates modest income bump + expense trim.
            </p>
            <Field label="Discipline boost %" value={extraSavingsPct} min={0} max={30} step={5} onChange={setExtraSavingsPct} />
          </div>
        </aside>
      </div>

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
        <h2 className="text-lg font-semibold">Net worth trajectory</h2>
        <div className="mt-4 flex h-48 items-end gap-0.5 sm:gap-1">
          {result.timeline.map((snap) => (
            <div
              key={snap.year}
              className="group relative min-w-0 flex-1"
              title={`Year ${snap.year}: ${money(snap.netWorth)}`}
            >
              <div
                className="mx-auto w-full max-w-3 rounded-t bg-[var(--accent)]/80 transition-all hover:bg-[var(--accent)]"
                style={{ height: `${Math.max(4, (snap.netWorth / chartMax) * 100)}%` }}
              />
            </div>
          ))}
        </div>
        <div className="mt-2 flex justify-between text-[10px] text-[var(--muted)]">
          <span>Year 0</span>
          <span>Year {horizonYears}</span>
        </div>
      </section>

      {result.milestones.length > 0 && (
        <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
          <h2 className="text-lg font-semibold">Milestone timeline</h2>
          <ol className="mt-4 space-y-3">
            {result.milestones.map((m, i) => (
              <li
                key={`${m.year}-${m.label}-${i}`}
                className="flex flex-wrap items-baseline gap-x-3 gap-y-1 rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm"
              >
                <span className="font-semibold text-[var(--accent)]">
                  Year {m.year}
                </span>
                <span className="text-[var(--muted)]">Age {m.age}</span>
                <span className="font-medium">{m.label}</span>
                <span className="ml-auto tabular-nums">{money(m.value)}</span>
              </li>
            ))}
          </ol>
        </section>
      )}

      <section className="overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
        <h2 className="text-lg font-semibold">Year-by-year snapshot</h2>
        <table className="mt-4 w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] text-[var(--muted)]">
              <th className="py-2 pr-3">Yr</th>
              <th className="py-2 pr-3">Income</th>
              <th className="py-2 pr-3">Saved</th>
              <th className="py-2 pr-3">Portfolio</th>
              <th className="py-2 pr-3">RE equity</th>
              <th className="py-2">Net worth</th>
            </tr>
          </thead>
          <tbody>
            {result.timeline.filter((_, i) => i % Math.max(1, Math.floor(result.timeline.length / 10)) === 0 || i === result.timeline.length - 1).map((row) => (
              <tr key={row.year} className="border-b border-[var(--border)]/50">
                <td className="py-2 pr-3">{row.year}</td>
                <td className="py-2 pr-3">{money(row.totalIncome)}</td>
                <td className="py-2 pr-3">{money(row.savings)}</td>
                <td className="py-2 pr-3">{money(row.portfolio)}</td>
                <td className="py-2 pr-3">{money(row.propertyEquity)}</td>
                <td className="py-2 font-medium">{money(row.netWorth)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <aside className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-[var(--accent)]">Related</h2>
        <ul className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((tool) => (
            <li key={tool.slug}>
              <Link href={getToolHref(tool.slug)} className="text-sm font-medium hover:text-[var(--accent)]">
                {tool.title}
              </Link>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
