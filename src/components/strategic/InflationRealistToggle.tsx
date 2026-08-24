"use client";

import { useState } from "react";
import {
  DEFAULT_INFLATION_PCT,
  formatStrategicMoney,
  realPurchasingPower,
} from "@/lib/strategicInsights";

export function InflationRealistToggle({
  nominalValue,
  years,
  label = "Future value",
}: {
  nominalValue: number;
  years: number;
  label?: string;
}) {
  const [enabled, setEnabled] = useState(false);
  const [open, setOpen] = useState(false);

  if (!Number.isFinite(nominalValue) || nominalValue <= 0 || years <= 0) {
    return null;
  }

  const real = realPurchasingPower(nominalValue, years, DEFAULT_INFLATION_PCT);
  const lossPct = ((1 - real / nominalValue) * 100).toFixed(0);

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
            Inflation-realist mode
          </h3>
          <p className="mt-1 text-sm text-[var(--muted)]">
            See what long-range numbers are worth in today&apos;s purchasing
            power.
          </p>
        </div>
        <span
          className={`text-xl text-[var(--muted)] transition ${open ? "rotate-180" : ""}`}
          aria-hidden
        >
          ▾
        </span>
      </button>

      {open && (
        <div className="mt-5 space-y-4 border-t border-[var(--border)] pt-5">
          <label
            htmlFor="inflation-toggle"
            className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3"
          >
            <span className="text-sm font-medium">
              Adjust for real purchasing power ({DEFAULT_INFLATION_PCT}% inflation
              / yr)
            </span>
            <input
              id="inflation-toggle"
              type="checkbox"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
              className="h-5 w-5 accent-[var(--accent)]"
            />
          </label>

          <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm">
            <p className="text-[var(--muted)]">{label} (nominal, {years} yr)</p>
            <p className="mt-1 font-semibold">{formatStrategicMoney(nominalValue)}</p>
            {enabled && (
              <>
                <p className="mt-3 text-[var(--muted)]">
                  In today&apos;s dollars
                </p>
                <p className="mt-1 text-lg font-bold text-[var(--accent)]">
                  {formatStrategicMoney(real)}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-[var(--muted)]">
                  ~{lossPct}% less purchasing power than the headline number
                  suggests — inflation erodes long-term nominal gains.
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
