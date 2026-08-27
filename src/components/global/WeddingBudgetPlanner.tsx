"use client";

import { useMemo, useState } from "react";
import type { Calculator } from "@/lib/types";
import { Field, Panel, ResultHero, Row } from "@/components/global/ui";
import {
  calculateWeddingBudget,
  createWeddingItem,
  type WeddingLineItem,
} from "@/lib/globalPlanners/weddingBudget";
import { money } from "@/lib/globalPlanners/money";

export function WeddingBudgetPlanner({
  calculator,
}: {
  calculator: Calculator;
  related: Calculator[];
}) {
  const [totalBudget, setTotalBudget] = useState(18000);
  const [currentSavings, setCurrentSavings] = useState(6000);
  const [monthlySavings, setMonthlySavings] = useState(800);
  const [guestCount, setGuestCount] = useState(80);
  const [items, setItems] = useState<WeddingLineItem[]>([
    createWeddingItem("Venue", 6000, 30, 2, 10),
    createWeddingItem("Catering", 5000, 20, 4, 10),
    createWeddingItem("Photo / video", 2500, 40, 3, 9),
    createWeddingItem("Attire", 1200, 50, 1, 8),
  ]);

  const result = useMemo(
    () => calculateWeddingBudget({ totalBudget, currentSavings, monthlySavings, items }),
    [totalBudget, currentSavings, monthlySavings, items]
  );

  const perGuest = guestCount > 0 ? result.plannedTotal / guestCount : 0;

  const update = (id: string, patch: Partial<WeddingLineItem>) => {
    setItems((list) => list.map((i) => (i.id === id ? { ...i, ...patch } : i)));
  };

  return (
    <div className="space-y-6">
      <p className="rounded-xl border border-[var(--accent)]/30 bg-[var(--accent)]/5 px-4 py-3 text-sm text-[var(--muted)]">
        <strong className="text-[var(--foreground)]">Deposit cashflow calendar:</strong>{" "}
        see when deposits and finals hit your savings — flags cash crunches before
        they happen.
      </p>
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Budget & savings">
          <Field label="Total budget" value={totalBudget} min={1000} max={200000} step={500} onChange={setTotalBudget} />
          <Field label="Current wedding savings" value={currentSavings} min={0} max={200000} step={250} onChange={setCurrentSavings} />
          <Field label="Monthly savings" value={monthlySavings} min={0} max={20000} step={50} onChange={setMonthlySavings} />
          <Field label="Guest count (per-guest cost)" value={guestCount} min={10} max={400} step={5} onChange={setGuestCount} />
          <div className="flex items-center justify-between border-t border-[var(--border)] pt-4">
            <h3 className="font-semibold">Line items</h3>
            <button
              type="button"
              className="rounded-lg bg-[var(--accent)] px-3 py-1.5 text-xs font-semibold text-[#041018]"
              onClick={() =>
                setItems((x) => [
                  ...x,
                  createWeddingItem(`Item ${x.length + 1}`, 1000, 25, 3, 10),
                ])
              }
            >
              + Add
            </button>
          </div>
          {items.map((item) => (
            <div key={item.id} className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-3 space-y-2">
              <div className="flex gap-2">
                <input
                  value={item.name}
                  onChange={(e) => update(item.id, { name: e.target.value })}
                  className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2 py-1 text-sm"
                />
                {items.length > 1 && (
                  <button type="button" className="text-xs text-red-500" onClick={() => setItems((x) => x.filter((y) => y.id !== item.id))}>
                    Remove
                  </button>
                )}
              </div>
              <Field label="Total" value={item.total} min={0} max={100000} step={100} onChange={(n) => update(item.id, { total: n })} />
              <Field label="Deposit %" value={item.depositPct} min={0} max={100} step={5} onChange={(n) => update(item.id, { depositPct: n })} />
              <Field label="Deposit month" value={item.depositMonth} min={0} max={24} step={1} onChange={(n) => update(item.id, { depositMonth: n })} />
              <Field label="Final month" value={item.finalMonth} min={0} max={24} step={1} onChange={(n) => update(item.id, { finalMonth: n })} />
            </div>
          ))}
        </Panel>
        <div className="space-y-5">
          <ResultHero
            eyebrow="Planned total"
            value={money(result.plannedTotal)}
            insight={result.insight}
          >
            <dl className="mt-4 space-y-2 border-t border-[var(--border)] pt-4">
              <Row label="Over budget" value={money(result.overBudget)} />
              <Row label="Per guest" value={money(perGuest)} />
              <Row label="Crunch months" value={result.crunchMonths.length ? result.crunchMonths.join(", ") : "None"} />
            </dl>
          </ResultHero>
        </div>
      </div>
      <Panel title="Cashflow calendar">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] text-sm text-left">
            <thead>
              <tr className="border-b border-[var(--border)] text-[var(--muted)]">
                <th className="py-2">Month</th>
                <th className="py-2">Outflow</th>
                <th className="py-2">Balance</th>
                <th className="py-2">Events</th>
              </tr>
            </thead>
            <tbody>
              {result.cashflow
                .filter((c) => c.outflow > 0 || c.shortfall > 0 || c.month === 0)
                .map((c) => (
                  <tr
                    key={c.month}
                    className={`border-b border-[var(--border)]/50 ${c.shortfall > 0 ? "bg-red-500/5" : ""}`}
                  >
                    <td className="py-2">{c.month}</td>
                    <td className="py-2">{money(c.outflow)}</td>
                    <td className="py-2 font-semibold">{money(c.savingsBalance)}</td>
                    <td className="py-2 text-[var(--muted)]">{c.events.join("; ") || "—"}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-[var(--muted)]">{calculator.seoContent.intro}</p>
      </Panel>
    </div>
  );
}
