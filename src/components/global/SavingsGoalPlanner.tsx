"use client";

import { useMemo, useState } from "react";
import type { Calculator } from "@/lib/types";
import { Field, Panel, ResultHero, Row } from "@/components/global/ui";
import {
  calculateSavingsGoals,
  createGoal,
  type SavingsGoal,
} from "@/lib/globalPlanners/savingsGoals";
import { money } from "@/lib/globalPlanners/money";

export function SavingsGoalPlanner({
  calculator,
}: {
  calculator: Calculator;
  related: Calculator[];
}) {
  const [monthlyBudget, setMonthlyBudget] = useState(900);
  const [currentSaved, setCurrentSaved] = useState(1500);
  const [goals, setGoals] = useState<SavingsGoal[]>([
    createGoal("Trip", 3000, 10, 2),
    createGoal("Emergency top-up", 5000, 18, 1),
    createGoal("Laptop", 1200, 6, 3),
  ]);

  const result = useMemo(
    () => calculateSavingsGoals({ monthlyBudget, currentSaved, goals }),
    [monthlyBudget, currentSaved, goals]
  );

  const updateGoal = (id: string, patch: Partial<SavingsGoal>) => {
    setGoals((g) => g.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  };

  return (
    <div className="space-y-6">
      <p className="rounded-xl border border-[var(--accent)]/30 bg-[var(--accent)]/5 px-4 py-3 text-sm text-[var(--muted)]">
        <strong className="text-[var(--foreground)]">Multi-goal optimizer:</strong>{" "}
        compares sequential vs split funding and recommends the fastest path to
        hit every deadline — planner-level math, free.
      </p>
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Savings capacity">
          <Field label="Monthly savings budget" value={monthlyBudget} min={50} max={20000} step={50} onChange={setMonthlyBudget} />
          <Field label="Already saved (pool)" value={currentSaved} min={0} max={100000} step={100} onChange={setCurrentSaved} />
          <div className="space-y-3 border-t border-[var(--border)] pt-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Goals</h3>
              <button
                type="button"
                className="rounded-lg bg-[var(--accent)] px-3 py-1.5 text-xs font-semibold text-[#041018]"
                onClick={() =>
                  setGoals((g) => [
                    ...g,
                    createGoal(`Goal ${g.length + 1}`, 2000, 12, g.length + 1),
                  ])
                }
              >
                + Add goal
              </button>
            </div>
            {goals.map((g) => (
              <div key={g.id} className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-3 space-y-2">
                <div className="flex gap-2">
                  <input
                    value={g.name}
                    onChange={(e) => updateGoal(g.id, { name: e.target.value })}
                    className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2 py-1 text-sm"
                  />
                  {goals.length > 1 && (
                    <button type="button" className="text-xs text-red-500" onClick={() => setGoals((x) => x.filter((y) => y.id !== g.id))}>
                      Remove
                    </button>
                  )}
                </div>
                <Field label="Amount" value={g.amount} min={100} max={200000} step={100} onChange={(n) => updateGoal(g.id, { amount: n })} />
                <Field label="Deadline (months)" value={g.monthsDeadline} min={1} max={60} step={1} onChange={(n) => updateGoal(g.id, { monthsDeadline: n })} />
                <Field label="Priority (1 = highest)" value={g.priority} min={1} max={10} step={1} onChange={(n) => updateGoal(g.id, { priority: n })} />
              </div>
            ))}
          </div>
        </Panel>
        <div className="space-y-5">
          <ResultHero
            eyebrow="Recommended plan"
            value={result.recommended === "sequential" ? "Sequential" : "Split"}
            insight={result.insight}
          >
            <dl className="mt-4 space-y-2 border-t border-[var(--border)] pt-4">
              <Row label="Sequential done by" value={`month ${result.sequentialAllDoneMonth}`} />
              <Row label="Split done by" value={`month ${result.splitAllDoneMonth}`} />
            </dl>
          </ResultHero>
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Sequential plan">
          {result.sequential.map((r) => (
            <div key={r.goalId} className="flex justify-between text-sm border-b border-[var(--border)]/50 py-2">
              <span>
                {r.name}{" "}
                <span className={r.onTime ? "text-emerald-600" : "text-amber-600"}>
                  {r.onTime ? "on time" : "late"}
                </span>
              </span>
              <span className="font-semibold">mo {r.monthsToComplete} · {money(r.monthlyAllocation)}/mo</span>
            </div>
          ))}
        </Panel>
        <Panel title="Split plan">
          {result.split.map((r) => (
            <div key={r.goalId} className="flex justify-between text-sm border-b border-[var(--border)]/50 py-2">
              <span>
                {r.name}{" "}
                <span className={r.onTime ? "text-emerald-600" : "text-amber-600"}>
                  {r.onTime ? "on time" : "late"}
                </span>
              </span>
              <span className="font-semibold">mo {r.monthsToComplete} · {money(r.monthlyAllocation)}/mo</span>
            </div>
          ))}
        </Panel>
      </div>
      <p className="text-xs text-[var(--muted)]">{calculator.seoContent.intro}</p>
    </div>
  );
}
