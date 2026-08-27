"use client";

import { useMemo, useState } from "react";
import type { Calculator } from "@/lib/types";
import { Field, Panel, ResultHero, Row } from "@/components/global/ui";
import { calculateReverseDiet } from "@/lib/globalPlanners/reverseDiet";

export function ReverseDietPlanner({
  calculator,
}: {
  calculator: Calculator;
  related: Calculator[];
}) {
  const [currentCalories, setCurrentCalories] = useState(1800);
  const [maintenanceCalories, setMaintenanceCalories] = useState(2500);
  const [currentWeightKg, setCurrentWeightKg] = useState(72);
  const [targetWeeklyGainKg, setTargetWeeklyGainKg] = useState(0.15);
  const [plannedBumpKcal, setPlannedBumpKcal] = useState(100);
  const [weeks, setWeeks] = useState(12);
  const [observedWeeklyChangeKg, setObservedWeeklyChangeKg] = useState(0.05);

  const result = useMemo(
    () =>
      calculateReverseDiet({
        currentCalories,
        maintenanceCalories,
        currentWeightKg,
        targetWeeklyGainKg,
        plannedBumpKcal,
        weeks,
        observedWeeklyChangeKg,
      }),
    [
      currentCalories,
      maintenanceCalories,
      currentWeightKg,
      targetWeeklyGainKg,
      plannedBumpKcal,
      weeks,
      observedWeeklyChangeKg,
    ]
  );

  return (
    <div className="space-y-6">
      <p className="rounded-xl border border-[var(--accent)]/30 bg-[var(--accent)]/5 px-4 py-3 text-sm text-[var(--muted)]">
        <strong className="text-[var(--foreground)]">Adaptive bumps:</strong>{" "}
        if your scale is still dropping too fast, next week’s calorie increase
        automatically shrinks — like paid adaptive coaching, free here.
      </p>
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Your reverse diet">
          <Field label="Current calories" value={currentCalories} min={1000} max={4000} step={50} onChange={setCurrentCalories} />
          <Field label="True maintenance (kcal)" value={maintenanceCalories} min={1400} max={4500} step={50} onChange={setMaintenanceCalories} />
          <Field label="Current weight (kg)" value={currentWeightKg} min={40} max={160} step={0.5} onChange={setCurrentWeightKg} />
          <Field label="Target weekly gain (kg)" value={targetWeeklyGainKg} min={0.05} max={0.4} step={0.05} onChange={setTargetWeeklyGainKg} />
          <Field label="Planned weekly bump (kcal)" value={plannedBumpKcal} min={25} max={200} step={25} onChange={setPlannedBumpKcal} />
          <Field label="Horizon (weeks)" value={weeks} min={4} max={24} step={1} onChange={setWeeks} />
          <Field
            label="Observed weekly change (kg) — negative = still losing"
            value={observedWeeklyChangeKg}
            min={-0.5}
            max={0.5}
            step={0.05}
            onChange={setObservedWeeklyChangeKg}
          />
        </Panel>
        <div className="space-y-5">
          <ResultHero
            eyebrow="Weeks to maintenance"
            value={`~${result.weeksToMaintenance}`}
            insight={result.insight}
          >
            <dl className="mt-4 space-y-2 border-t border-[var(--border)] pt-4">
              <Row label="Final calories" value={`${result.finalCalories} kcal`} />
              <Row label="Adapted weeks" value={`${result.totalAdaptedWeeks}`} />
            </dl>
          </ResultHero>
        </div>
      </div>
      <Panel title="Week-by-week plan">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] text-[var(--muted)]">
                <th className="py-2">Week</th>
                <th className="py-2">Calories</th>
                <th className="py-2">Bump</th>
                <th className="py-2">Est. kg</th>
                <th className="py-2">Note</th>
              </tr>
            </thead>
            <tbody>
              {result.weeks.map((w) => (
                <tr
                  key={w.week}
                  className={`border-b border-[var(--border)]/50 ${w.adapted ? "bg-amber-500/5" : ""}`}
                >
                  <td className="py-2">{w.week}</td>
                  <td className="py-2 font-semibold">{w.calories}</td>
                  <td className="py-2">
                    +{w.adaptedBump}
                    {w.adapted ? " ★" : ""}
                  </td>
                  <td className="py-2">{w.expectedWeightKg}</td>
                  <td className="py-2 text-[var(--muted)]">{w.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-[var(--muted)]">★ = adaptive smaller bump. {calculator.seoContent.intro}</p>
      </Panel>
    </div>
  );
}
