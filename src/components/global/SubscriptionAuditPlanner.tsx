"use client";

import { useMemo, useState } from "react";
import type { Calculator } from "@/lib/types";
import { Field, Panel, ResultHero, Row } from "@/components/global/ui";
import {
  calculateSubscriptionAudit,
  createSub,
  type SubItem,
} from "@/lib/globalPlanners/subscriptionAudit";
import { money } from "@/lib/globalPlanners/money";

export function SubscriptionAuditPlanner({
  calculator,
}: {
  calculator: Calculator;
  related: Calculator[];
}) {
  const [liquidSavings, setLiquidSavings] = useState(9000);
  const [monthlyExpensesExSubs, setMonthlyExpensesExSubs] = useState(2800);
  const [monthlyIncome, setMonthlyIncome] = useState(5200);
  const [goalAmount, setGoalAmount] = useState(5000);
  const [goalMonthsLeft, setGoalMonthsLeft] = useState(10);
  const [subscriptions, setSubscriptions] = useState<SubItem[]>([
    createSub("Streaming A", 15),
    createSub("Streaming B", 12),
    createSub("Music", 11),
    createSub("Cloud storage", 10),
    createSub("Gym", 45),
    createSub("Software", 29),
  ]);

  const result = useMemo(
    () =>
      calculateSubscriptionAudit({
        liquidSavings,
        monthlyExpensesExSubs,
        monthlyIncome,
        goalAmount,
        goalMonthsLeft,
        subscriptions,
      }),
    [
      liquidSavings,
      monthlyExpensesExSubs,
      monthlyIncome,
      goalAmount,
      goalMonthsLeft,
      subscriptions,
    ]
  );

  const toggle = (id: string) => {
    setSubscriptions((list) =>
      list.map((s) => (s.id === id ? { ...s, paused: !s.paused } : s))
    );
  };

  return (
    <div className="space-y-6">
      <p className="rounded-xl border border-[var(--accent)]/30 bg-[var(--accent)]/5 px-4 py-3 text-sm text-[var(--muted)]">
        <strong className="text-[var(--foreground)]">Runway extension meter:</strong>{" "}
        pause subscriptions and see +months of emergency runway — no cut of your
        savings like cancellation apps that charge.
      </p>
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Money baseline">
          <Field label="Liquid savings" value={liquidSavings} min={0} max={200000} step={500} onChange={setLiquidSavings} />
          <Field label="Monthly expenses (ex-subs)" value={monthlyExpensesExSubs} min={500} max={30000} step={50} onChange={setMonthlyExpensesExSubs} />
          <Field label="Monthly income" value={monthlyIncome} min={0} max={50000} step={100} onChange={setMonthlyIncome} />
          <Field label="Goal amount" value={goalAmount} min={0} max={100000} step={100} onChange={setGoalAmount} />
          <Field label="Months left for goal" value={goalMonthsLeft} min={1} max={60} step={1} onChange={setGoalMonthsLeft} />
          <div className="flex items-center justify-between border-t border-[var(--border)] pt-4">
            <h3 className="font-semibold">Subscriptions</h3>
            <button
              type="button"
              className="rounded-lg bg-[var(--accent)] px-3 py-1.5 text-xs font-semibold text-[#041018]"
              onClick={() =>
                setSubscriptions((s) => [...s, createSub(`Sub ${s.length + 1}`, 10)])
              }
            >
              + Add
            </button>
          </div>
          <ul className="space-y-2">
            {subscriptions.map((s) => (
              <li
                key={s.id}
                className="flex items-center justify-between gap-2 rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
              >
                <div className="min-w-0 flex-1">
                  <input
                    value={s.name}
                    onChange={(e) =>
                      setSubscriptions((list) =>
                        list.map((x) =>
                          x.id === s.id ? { ...x, name: e.target.value } : x
                        )
                      )
                    }
                    className="w-full bg-transparent font-medium outline-none"
                  />
                  <input
                    type="number"
                    value={s.monthlyCost}
                    onChange={(e) =>
                      setSubscriptions((list) =>
                        list.map((x) =>
                          x.id === s.id
                            ? { ...x, monthlyCost: Number(e.target.value) || 0 }
                            : x
                        )
                      )
                    }
                    className="mt-1 w-24 rounded border border-[var(--border)] bg-[var(--surface)] px-2 py-0.5 text-xs"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => toggle(s.id)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                    s.paused
                      ? "bg-amber-500/20 text-amber-700 dark:text-amber-300"
                      : "bg-[var(--accent)] text-[#041018]"
                  }`}
                >
                  {s.paused ? "Paused" : "Active"}
                </button>
              </li>
            ))}
          </ul>
        </Panel>
        <div className="space-y-5">
          <ResultHero
            eyebrow="Runway gained"
            value={`+${result.runwayGainMonths.toFixed(1)} mo`}
            insight={result.insight}
          >
            <dl className="mt-4 space-y-2 border-t border-[var(--border)] pt-4">
              <Row label="Runway before" value={`${result.runwayBefore.toFixed(1)} mo`} />
              <Row label="Runway after" value={`${result.runwayAfter.toFixed(1)} mo`} />
              <Row label="Paused / mo" value={money(result.pausedMonthly)} />
              <Row label="Annual if paused" value={money(result.annualIfPaused)} />
              <Row label="Still active / mo" value={money(result.activeMonthly)} />
            </dl>
          </ResultHero>
        </div>
      </div>
      <p className="text-xs text-[var(--muted)]">{calculator.seoContent.intro}</p>
    </div>
  );
}
