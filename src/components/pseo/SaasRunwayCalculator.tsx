"use client";

import { useMemo, useState } from "react";

function money(n: number): string {
  if (!Number.isFinite(n)) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

function monthsLabel(months: number): string {
  if (!Number.isFinite(months)) return "Default-alive";
  if (months > 120) return "100+ mo";
  const whole = Math.floor(months);
  const rem = months - whole;
  if (rem < 0.05) return `${whole} mo`;
  return `${months.toFixed(1)} mo`;
}

export function SaasRunwayCalculator() {
  const [cash, setCash] = useState(180000);
  const [revenue, setRevenue] = useState(22000);
  const [opex, setOpex] = useState(31000);

  const result = useMemo(() => {
    const netBurn = opex - revenue;
    const profitable = netBurn <= 0;
    const runwayMonths = profitable ? Infinity : cash / netBurn;
    const zeroDate =
      profitable || !Number.isFinite(runwayMonths)
        ? null
        : new Date(
            Date.now() + runwayMonths * 30.4375 * 24 * 60 * 60 * 1000
          );
    return { netBurn, profitable, runwayMonths, zeroDate };
  }, [cash, revenue, opex]);

  return (
    <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
        <h2 className="mb-5 text-lg font-semibold">Inputs</h2>
        <div className="space-y-6">
          {(
            [
              {
                id: "cash",
                label: "Cash in bank ($)",
                value: cash,
                min: 0,
                max: 5000000,
                step: 1000,
                set: setCash,
              },
              {
                id: "revenue",
                label: "Monthly revenue / MRR ($)",
                value: revenue,
                min: 0,
                max: 2000000,
                step: 500,
                set: setRevenue,
              },
              {
                id: "opex",
                label: "Monthly operating expenses ($)",
                value: opex,
                min: 0,
                max: 2000000,
                step: 500,
                set: setOpex,
              },
            ] as const
          ).map((input) => (
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
                  value={input.value}
                  onChange={(e) => {
                    const n = Number(e.target.value);
                    input.set(Number.isFinite(n) ? n : input.value);
                  }}
                  className="w-28 rounded-lg border border-[var(--border)] bg-[var(--background)] px-2.5 py-1.5 text-right text-sm outline-none focus:border-[var(--accent)]"
                />
              </div>
              <input
                id={input.id}
                type="range"
                min={input.min}
                max={input.max}
                step={input.step}
                value={input.value}
                onChange={(e) => input.set(Number(e.target.value))}
                className="range-input w-full"
              />
            </div>
          ))}
        </div>
      </div>

      <aside className="lg:sticky lg:top-24">
        <div className="results-card rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <p className="text-xs font-semibold tracking-[0.16em] text-[var(--accent)] uppercase">
            Live results
          </p>
          <p className="mt-3 text-sm text-[var(--muted)]">Runway</p>
          <p className="result-glow mt-1 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl">
            {result.profitable ? "Default-alive" : monthsLabel(result.runwayMonths)}
          </p>
          <dl className="mt-6 space-y-3 border-t border-[var(--border)] pt-5 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-[var(--muted)]">Monthly net burn</dt>
              <dd className="font-semibold">
                {result.profitable
                  ? `${money(Math.abs(result.netBurn))} profit`
                  : money(result.netBurn)}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-[var(--muted)]">Gross burn (opex)</dt>
              <dd className="font-semibold">{money(opex)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-[var(--muted)]">Cash</dt>
              <dd className="font-semibold">{money(cash)}</dd>
            </div>
            {result.zeroDate ? (
              <div className="flex justify-between gap-4">
                <dt className="text-[var(--muted)]">Approx. zero-cash date</dt>
                <dd className="font-semibold">
                  {result.zeroDate.toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })}
                </dd>
              </div>
            ) : null}
          </dl>
          <p className="mt-5 text-xs leading-relaxed text-[var(--muted)]">
            {result.profitable
              ? "Revenue covers opex. Runway is not the constraint—watch margin and cash buffer instead."
              : "Runway = cash ÷ monthly net burn. Planning estimate only; it ignores taxes, collections lag, and one-off spend."}
          </p>
        </div>
      </aside>
    </div>
  );
}
