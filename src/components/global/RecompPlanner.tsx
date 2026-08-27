"use client";

import { useMemo, useState } from "react";
import type { Calculator } from "@/lib/types";
import { Field, Panel, ResultHero, Row } from "@/components/global/ui";
import { calculateRecomp } from "@/lib/globalPlanners/recomp";

export function RecompPlanner({
  calculator,
}: {
  calculator: Calculator;
  related: Calculator[];
}) {
  const [sex, setSex] = useState<"male" | "female">("male");
  const [age, setAge] = useState(30);
  const [weightKg, setWeightKg] = useState(78);
  const [heightCm, setHeightCm] = useState(178);
  const [activityMultiplier, setActivityMultiplier] = useState(1.55);
  const [hardSetsPerWeek, setHardSetsPerWeek] = useState(70);
  const [trainingDays, setTrainingDays] = useState(4);

  const result = useMemo(
    () =>
      calculateRecomp({
        sex,
        age,
        weightKg,
        heightCm,
        activityMultiplier,
        hardSetsPerWeek,
        trainingDays,
      }),
    [sex, age, weightKg, heightCm, activityMultiplier, hardSetsPerWeek, trainingDays]
  );

  return (
    <div className="space-y-6">
      <p className="rounded-xl border border-[var(--accent)]/30 bg-[var(--accent)]/5 px-4 py-3 text-sm text-[var(--muted)]">
        <strong className="text-[var(--foreground)]">Volume-aware deficit cap:</strong>{" "}
        more hard sets per week → smaller calorie deficit and higher protein so
        recovery keeps up — coaching-level recomp logic, free.
      </p>
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Profile & training volume">
          <div className="grid grid-cols-2 gap-2">
            {(["male", "female"] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSex(s)}
                className={`rounded-xl border px-3 py-2 text-sm capitalize ${
                  sex === s ? "border-[var(--accent)] bg-[var(--accent)]/10" : "border-[var(--border)]"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <Field label="Age" value={age} min={16} max={70} step={1} onChange={setAge} />
          <Field label="Weight (kg)" value={weightKg} min={40} max={160} step={0.5} onChange={setWeightKg} />
          <Field label="Height (cm)" value={heightCm} min={140} max={220} step={1} onChange={setHeightCm} />
          <Field label="Activity multiplier" value={activityMultiplier} min={1.2} max={1.9} step={0.05} onChange={setActivityMultiplier} />
          <Field label="Hard sets / week" value={hardSetsPerWeek} min={10} max={160} step={5} onChange={setHardSetsPerWeek} />
          <Field label="Training days / week" value={trainingDays} min={2} max={7} step={1} onChange={setTrainingDays} />
        </Panel>
        <div className="space-y-5">
          <ResultHero
            eyebrow="Recomp target"
            value={`${result.targetCalories} kcal`}
            insight={result.insight}
          >
            <dl className="mt-4 space-y-2 border-t border-[var(--border)] pt-4">
              <Row label="BMR" value={`${result.bmr} kcal`} />
              <Row label="TDEE" value={`${result.tdee} kcal`} />
              <Row label="Deficit cap" value={`${result.deficitCapKcal} kcal`} />
              <Row label="Volume tier" value={result.volumeTier} />
              <Row label="Protein" value={`${result.macros.proteinG} g`} />
              <Row label="Carbs" value={`${result.macros.carbsG} g`} />
              <Row label="Fat" value={`${result.macros.fatG} g`} />
            </dl>
          </ResultHero>
          <Panel title="Training vs rest">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl border border-[var(--border)] p-3">
                <p className="text-xs text-[var(--accent)] uppercase font-semibold">Training</p>
                <p className="mt-1 font-bold">{result.trainingMacros.calories} kcal</p>
                <p className="text-[var(--muted)]">C {result.trainingMacros.carbsG}g</p>
              </div>
              <div className="rounded-xl border border-[var(--border)] p-3">
                <p className="text-xs text-[var(--accent)] uppercase font-semibold">Rest</p>
                <p className="mt-1 font-bold">{result.restMacros.calories} kcal</p>
                <p className="text-[var(--muted)]">C {result.restMacros.carbsG}g</p>
              </div>
            </div>
          </Panel>
        </div>
      </div>
      <p className="text-xs text-[var(--muted)]">{calculator.seoContent.intro}</p>
    </div>
  );
}
