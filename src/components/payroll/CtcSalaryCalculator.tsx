"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Calculator } from "@/lib/types";
import { getToolHref } from "@/lib/cryptoFormulas";
import {
  calculateCtc,
  formatInr,
  negotiateBasic,
  type TaxRegime,
} from "@/lib/ctcSalary/formulas";

function Field({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (n: number) => void;
}) {
  return (
    <div>
      <div className="mb-1.5 flex justify-between gap-2">
        <label className="text-sm font-medium">{label}</label>
        <input
          type="number"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
          className="w-32 rounded-lg border border-[var(--border)] bg-[var(--background)] px-2 py-1 text-right text-sm"
        />
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

export function CtcSalaryCalculator({
  calculator,
  related,
}: {
  calculator: Calculator;
  related: Calculator[];
}) {
  const [annualCtc, setAnnualCtc] = useState(1800000);
  const [basicPct, setBasicPct] = useState(40);
  const [hraPct, setHraPct] = useState(50);
  const [variablePay, setVariablePay] = useState(200000);
  const [metroCity, setMetroCity] = useState(true);
  const [monthlyRent, setMonthlyRent] = useState(25000);
  const [section80C, setSection80C] = useState(150000);
  const [section80D, setSection80D] = useState(25000);
  const [taxRegime, setTaxRegime] = useState<TaxRegime>("new");
  const [professionalTax, setProfessionalTax] = useState(2400);
  const [negotiatePct, setNegotiatePct] = useState(0);

  const baseInputs = useMemo(
    () => ({
      annualCtc,
      basicPctOfGross: basicPct,
      hraPctOfBasic: hraPct,
      variablePayAnnual: variablePay,
      metroCity,
      monthlyRent,
      section80C,
      section80D,
      otherDeductions: 0,
      taxRegime,
      professionalTaxAnnual: professionalTax,
      includeGratuityInCtc: true,
      includeEmployerPfInCtc: true,
    }),
    [
      annualCtc,
      basicPct,
      hraPct,
      variablePay,
      metroCity,
      monthlyRent,
      section80C,
      section80D,
      taxRegime,
      professionalTax,
    ]
  );

  const result = useMemo(() => calculateCtc(baseInputs), [baseInputs]);
  const negotiated = useMemo(
    () => (negotiatePct > 0 ? negotiateBasic(baseInputs, negotiatePct) : null),
    [baseInputs, negotiatePct]
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
        <div className="space-y-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
          <h2 className="text-lg font-semibold">Offer breakdown</h2>
          <Field label="Annual CTC (₹)" value={annualCtc} min={300000} max={10000000} step={50000} onChange={setAnnualCtc} />
          <Field label="Basic (% of gross)" value={basicPct} min={30} max={60} step={1} onChange={setBasicPct} />
          <Field label="HRA (% of basic)" value={hraPct} min={30} max={60} step={5} onChange={setHraPct} />
          <Field label="Variable / bonus (₹/yr)" value={variablePay} min={0} max={3000000} step={25000} onChange={setVariablePay} />
          <Field label="Rent paid (₹/mo)" value={monthlyRent} min={0} max={100000} step={1000} onChange={setMonthlyRent} />
          <Field label="80C investments (₹)" value={section80C} min={0} max={150000} step={5000} onChange={setSection80C} />
          <Field label="80D health ins. (₹)" value={section80D} min={0} max={100000} step={5000} onChange={setSection80D} />

          <label className="flex items-center gap-3 rounded-xl border border-[var(--border)] px-4 py-3">
            <input
              type="checkbox"
              checked={metroCity}
              onChange={(e) => setMetroCity(e.target.checked)}
              className="h-4 w-4 accent-[var(--accent)]"
            />
            <span className="text-sm">Metro city (Mumbai, Delhi, Chennai, Kolkata, Bengaluru)</span>
          </label>

          <div>
            <p className="mb-2 text-sm font-medium">Tax regime</p>
            <div className="grid grid-cols-2 gap-2">
              {(["new", "old"] as TaxRegime[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setTaxRegime(r)}
                  className={`rounded-xl border px-3 py-2.5 text-sm font-medium capitalize ${
                    taxRegime === r
                      ? "border-[var(--accent)] bg-[var(--accent)]/10"
                      : "border-[var(--border)]"
                  }`}
                >
                  {r} regime
                </button>
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-24">
          <div className="results-card rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
            <p className="text-xs font-semibold tracking-[0.16em] text-[var(--accent)] uppercase">
              Monthly in-hand
            </p>
            <p className="result-glow mt-2 font-[family-name:var(--font-display)] text-3xl font-bold">
              {formatInr(result.netMonthly)}
            </p>
            <p className="mt-2 text-sm text-[var(--muted)]">{result.insight}</p>
            <dl className="mt-5 space-y-2 border-t border-[var(--border)] pt-4 text-sm">
              <Row label="Annual in-hand" value={formatInr(result.netAnnual)} />
              <Row label="CTC → in-hand" value={`${result.ctcToInHandPct.toFixed(1)}%`} />
              <Row label="Gross (monthly)" value={formatInr(result.grossMonthly)} />
              <Row label="Taxable income" value={formatInr(result.taxableIncome)} />
              <Row label="Total tax + cess" value={formatInr(result.totalTax)} />
              <Row label="Employee PF" value={formatInr(result.employeePf)} />
              {taxRegime === "old" && result.hraExemption > 0 && (
                <Row label="HRA exemption" value={formatInr(result.hraExemption)} />
              )}
            </dl>
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <h3 className="text-sm font-semibold">Regime comparison</h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div className={`rounded-xl border p-3 ${result.regimeComparison.better === "new" ? "border-[var(--accent)]" : "border-[var(--border)]"}`}>
                <p className="text-xs text-[var(--muted)]">New regime</p>
                <p className="font-bold">{formatInr(result.regimeComparison.newRegimeNet / 12)}/mo</p>
              </div>
              <div className={`rounded-xl border p-3 ${result.regimeComparison.better === "old" ? "border-[var(--accent)]" : "border-[var(--border)]"}`}>
                <p className="text-xs text-[var(--muted)]">Old regime</p>
                <p className="font-bold">{formatInr(result.regimeComparison.oldRegimeNet / 12)}/mo</p>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
        <h2 className="text-lg font-semibold">Salary components</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[400px] text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] text-left text-[var(--muted)]">
                <th className="py-2 pr-4">Component</th>
                <th className="py-2 pr-4 text-right">Annual</th>
                <th className="py-2 text-right">Monthly</th>
              </tr>
            </thead>
            <tbody>
              {result.components.map((c) => (
                <tr key={c.label} className="border-b border-[var(--border)]/50">
                  <td className="py-2.5 pr-4">{c.label}</td>
                  <td className={`py-2.5 pr-4 text-right tabular-nums ${c.annual < 0 ? "text-red-500" : ""}`}>
                    {formatInr(Math.abs(c.annual))}
                    {c.annual < 0 ? " −" : ""}
                  </td>
                  <td className={`py-2.5 text-right tabular-nums ${c.monthly < 0 ? "text-red-500" : ""}`}>
                    {formatInr(Math.abs(c.monthly))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
        <h2 className="text-lg font-semibold">Tax slab breakdown ({taxRegime} regime)</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[480px] text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] text-left text-[var(--muted)]">
                <th className="py-2">Slab (₹)</th>
                <th className="py-2">Rate</th>
                <th className="py-2 text-right">Tax</th>
              </tr>
            </thead>
            <tbody>
              {result.taxSlabs.map((s, i) => (
                <tr key={i} className="border-b border-[var(--border)]/50">
                  <td className="py-2">
                    {formatInr(s.from)} – {s.to != null ? formatInr(s.to) : "above"}
                  </td>
                  <td className="py-2">{s.rate}%</td>
                  <td className="py-2 text-right">{formatInr(s.tax)}</td>
                </tr>
              ))}
              <tr className="font-semibold">
                <td className="py-2" colSpan={2}>
                  Cess (4%)
                </td>
                <td className="py-2 text-right">{formatInr(result.cess)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
        <h2 className="text-lg font-semibold">Negotiation: raise basic salary</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Higher basic increases PF and HRA (old regime) but may change tax — model before you sign.
        </p>
        <Field label="Increase basic by (pp)" value={negotiatePct} min={0} max={15} step={1} onChange={setNegotiatePct} />
        {negotiated && negotiatePct > 0 && (
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <CompareCard label="Current in-hand/mo" value={formatInr(result.netMonthly)} />
            <CompareCard label="After negotiation" value={formatInr(negotiated.netMonthly)} />
            <CompareCard
              label="Difference"
              value={formatInr(negotiated.netMonthly - result.netMonthly)}
              highlight={negotiated.netMonthly >= result.netMonthly}
            />
          </div>
        )}
      </section>

      {result.warnings.length > 0 && (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 text-sm">
          <p className="font-semibold text-amber-600 dark:text-amber-400">Notes</p>
          <ul className="mt-2 space-y-1 text-[var(--muted)]">
            {result.warnings.map((w) => (
              <li key={w}>• {w}</li>
            ))}
          </ul>
        </div>
      )}

      <aside className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
        <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((tool) => (
            <li key={tool.slug}>
              <Link href={getToolHref(tool.slug)} className="text-sm font-medium hover:text-[var(--accent)]">
                {tool.title}
              </Link>
            </li>
          ))}
        </ul>
      </aside>

      <p className="text-xs text-[var(--muted)]">
        FY 2025-26 India tax slabs. Employer structures vary — confirm with HR before negotiating.
      </p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-[var(--muted)]">{label}</dt>
      <dd className="font-semibold tabular-nums">{value}</dd>
    </div>
  );
}

function CompareCard({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-4 ${highlight ? "border-[var(--accent)] bg-[var(--accent)]/5" : "border-[var(--border)]"}`}
    >
      <p className="text-xs text-[var(--muted)]">{label}</p>
      <p className="mt-1 text-lg font-bold">{value}</p>
    </div>
  );
}
