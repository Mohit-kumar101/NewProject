"use client";

import { useState } from "react";
import type { LifeShockId, LifeShockState, ResilienceResult } from "@/lib/strategicInsights";

const SHOCK_OPTIONS: {
  id: LifeShockId;
  label: string;
  hint: string;
}[] = [
  {
    id: "sabbatical",
    label: "6-mo sabbatical",
    hint: "Income drop / career break",
  },
  {
    id: "rateShock",
    label: "+1.5% rate renewal",
    hint: "Mortgage / debt rate shock",
  },
  {
    id: "emergency",
    label: "$5k emergency",
    hint: "One-time surprise expense",
  },
];

export function LifeShockInjector({
  result,
  shocks,
  onToggle,
  liquidReserve,
  onLiquidChange,
}: {
  result: ResilienceResult;
  shocks: LifeShockState;
  onToggle: (id: LifeShockId) => void;
  liquidReserve: number;
  onLiquidChange: (n: number) => void;
}) {
  const [open, setOpen] = useState(false);

  const toneColor =
    result.tone === "strong"
      ? "text-[#15803d] dark:text-[#4ade80]"
      : result.tone === "fragile"
        ? "text-[#b91c1c] dark:text-[#f87171]"
        : "text-[var(--foreground)]";

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
            Life shock stress test
          </h3>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Simulate disruptions and see a resilience score for your plan.
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
        <div className="mt-5 space-y-5 border-t border-[var(--border)] pt-5">
          <div>
            <label
              htmlFor="liquid-reserve"
              className="mb-2 block text-sm font-medium"
            >
              Liquid reserve / emergency fund ($)
            </label>
            <input
              id="liquid-reserve"
              type="number"
              min={0}
              step={500}
              value={liquidReserve || ""}
              onChange={(e) =>
                onLiquidChange(Math.max(0, Number(e.target.value) || 0))
              }
              className="w-full max-w-xs rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm outline-none focus:border-[var(--accent)]"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {SHOCK_OPTIONS.map((opt) => {
              const active = shocks[opt.id];
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => onToggle(opt.id)}
                  className={`rounded-full border px-3 py-1.5 text-left text-xs font-semibold transition ${
                    active
                      ? "border-[var(--accent)] bg-[color-mix(in_srgb,var(--accent)_14%,var(--background))] text-[var(--accent)]"
                      : "border-[var(--border)] bg-[var(--background)] text-[var(--muted)] hover:border-[var(--accent)]"
                  }`}
                  title={opt.hint}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>

          <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-4">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold tracking-[0.14em] text-[var(--accent)] uppercase">
                  Resilience score
                </p>
                <p className={`mt-1 text-3xl font-bold ${toneColor}`}>
                  {result.score}
                  <span className="text-base font-medium text-[var(--muted)]">
                    /100
                  </span>
                </p>
                <p className="mt-1 text-sm font-medium">{result.label}</p>
              </div>
              <div className="h-2 w-full max-w-[200px] overflow-hidden rounded-full bg-[var(--surface)] sm:w-48">
                <div
                  className={`h-full rounded-full transition-[width] ${
                    result.tone === "strong"
                      ? "bg-[#22c55e]"
                      : result.tone === "fragile"
                        ? "bg-[#ef4444]"
                        : "bg-[var(--accent)]"
                  }`}
                  style={{ width: `${result.score}%` }}
                />
              </div>
            </div>
            <ul className="mt-4 space-y-2">
              {result.details.map((line) => (
                <li
                  key={line}
                  className="text-xs leading-relaxed text-[var(--muted)] sm:text-sm"
                >
                  • {line}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}
