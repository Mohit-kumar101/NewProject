"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Calculator } from "@/lib/types";
import { getToolHref } from "@/lib/cryptoFormulas";
import {
  ACTIVITY_LABELS,
  EXPERIENCE_LABELS,
  calculateBulkCut,
  imperialToMetric,
  kgToLbs,
  type ActivityLevel,
  type Phase,
  type TrainingExperience,
  type UnitSystem,
} from "@/lib/bulkCutPlanner/formulas";

function MacroBar({
  label,
  grams,
  pct,
  color,
}: {
  label: string;
  grams: number;
  pct: number;
  color: string;
}) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="text-[var(--muted)]">
          {grams} g · {pct}%
        </span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-[var(--background)]">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

export function BulkCutMacroPlanner({
  calculator,
  related,
}: {
  calculator: Calculator;
  related: Calculator[];
}) {
  const [units, setUnits] = useState<UnitSystem>("metric");
  const [sex, setSex] = useState<"male" | "female">("male");
  const [age, setAge] = useState(28);
  const [weight, setWeight] = useState(75);
  const [heightCm, setHeightCm] = useState(178);
  const [heightFt, setHeightFt] = useState(5);
  const [heightIn, setHeightIn] = useState(10);
  const [activity, setActivity] = useState<ActivityLevel>("moderate");
  const [experience, setExperience] = useState<TrainingExperience>("intermediate");
  const [phase, setPhase] = useState<Phase>("cut");
  const [weeklyRate, setWeeklyRate] = useState(0.75);
  const [targetWeight, setTargetWeight] = useState(70);
  const [useTarget, setUseTarget] = useState(true);
  const [trainingDays, setTrainingDays] = useState(4);

  const result = useMemo(() => {
    const metric =
      units === "metric"
        ? { weightKg: weight, heightCm }
        : imperialToMetric(weight, heightFt, heightIn);

    return calculateBulkCut({
      sex,
      age,
      weightKg: metric.weightKg,
      heightCm: metric.heightCm,
      activity,
      experience,
      phase,
      weeklyRateLbs: weeklyRate,
      targetWeightKg: useTarget
        ? units === "metric"
          ? targetWeight
          : targetWeight * 0.453592
        : undefined,
      trainingDaysPerWeek: trainingDays,
    });
  }, [
    units,
    sex,
    age,
    weight,
    heightCm,
    heightFt,
    heightIn,
    activity,
    experience,
    phase,
    weeklyRate,
    targetWeight,
    useTarget,
    trainingDays,
  ]);

  const displayWeight = (kg: number) =>
    units === "metric"
      ? `${kg.toFixed(1)} kg`
      : `${kgToLbs(kg).toFixed(1)} lb`;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {(["metric", "imperial"] as UnitSystem[]).map((u) => (
          <button
            key={u}
            type="button"
            onClick={() => setUnits(u)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
              units === u
                ? "bg-[var(--accent)] text-[#041018]"
                : "border border-[var(--border)] bg-[var(--surface)]"
            }`}
          >
            {u === "metric" ? "Metric (kg/cm)" : "Imperial (lb/ft)"}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
        <div className="space-y-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
          <h2 className="text-lg font-semibold">Your profile</h2>

          <div className="grid grid-cols-2 gap-3">
            {(["male", "female"] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSex(s)}
                className={`rounded-xl border px-3 py-2.5 text-sm font-medium capitalize ${
                  sex === s
                    ? "border-[var(--accent)] bg-[var(--accent)]/10"
                    : "border-[var(--border)]"
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <Field label="Age" value={age} min={15} max={80} step={1} onChange={setAge} />
          <Field
            label={units === "metric" ? "Weight (kg)" : "Weight (lb)"}
            value={weight}
            min={units === "metric" ? 40 : 90}
            max={units === "metric" ? 200 : 440}
            step={0.5}
            onChange={setWeight}
          />
          {units === "metric" ? (
            <Field label="Height (cm)" value={heightCm} min={140} max={220} step={1} onChange={setHeightCm} />
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <Field label="Height (ft)" value={heightFt} min={4} max={7} step={1} onChange={setHeightFt} />
              <Field label="Height (in)" value={heightIn} min={0} max={11} step={1} onChange={setHeightIn} />
            </div>
          )}

          <label className="block text-sm font-medium">
            Activity level
            <select
              value={activity}
              onChange={(e) => setActivity(e.target.value as ActivityLevel)}
              className="mt-1.5 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm"
            >
              {Object.entries(ACTIVITY_LABELS).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm font-medium">
            Training experience
            <select
              value={experience}
              onChange={(e) => setExperience(e.target.value as TrainingExperience)}
              className="mt-1.5 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm"
            >
              {Object.entries(EXPERIENCE_LABELS).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </label>

          <div>
            <p className="mb-2 text-sm font-medium">Phase</p>
            <div className="grid grid-cols-3 gap-2">
              {(["cut", "maintain", "bulk"] as Phase[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPhase(p)}
                  className={`rounded-xl border px-2 py-2 text-sm font-medium capitalize ${
                    phase === p
                      ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]"
                      : "border-[var(--border)]"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {phase !== "maintain" && (
            <Field
              label={`Target rate (lb/week)${result.rateClamped ? " — capped" : ""}`}
              value={weeklyRate}
              min={0.25}
              max={2}
              step={0.25}
              onChange={setWeeklyRate}
            />
          )}

          <label className="flex items-center gap-3 rounded-xl border border-[var(--border)] px-4 py-3">
            <input
              type="checkbox"
              checked={useTarget}
              onChange={(e) => setUseTarget(e.target.checked)}
              className="h-4 w-4 accent-[var(--accent)]"
            />
            <span className="text-sm">Project timeline to goal weight</span>
          </label>
          {useTarget && (
            <Field
              label={units === "metric" ? "Goal weight (kg)" : "Goal weight (lb)"}
              value={targetWeight}
              min={units === "metric" ? 40 : 90}
              max={units === "metric" ? 200 : 440}
              step={0.5}
              onChange={setTargetWeight}
            />
          )}

          <Field label="Training days / week" value={trainingDays} min={0} max={7} step={1} onChange={setTrainingDays} />
        </div>

        <aside className="space-y-5 lg:sticky lg:top-24">
          <div className="results-card rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
            <p className="text-xs font-semibold tracking-[0.16em] text-[var(--accent)] uppercase">
              Daily target
            </p>
            <p className="result-glow mt-2 font-[family-name:var(--font-display)] text-4xl font-bold">
              {result.dailyCalories} kcal
            </p>
            <p className="mt-2 text-sm text-[var(--muted)]">{result.insight}</p>

            <dl className="mt-6 space-y-3 border-t border-[var(--border)] pt-4 text-sm">
              <Row label="BMR" value={`${result.bmr} kcal`} />
              <Row label="TDEE (maintenance)" value={`${result.tdee} kcal`} />
              {phase !== "maintain" && (
                <Row label="Weekly rate" value={`${result.weeklyRateLbs} lb/week`} />
              )}
              {result.weeksToTarget != null && (
                <Row
                  label="Weeks to goal"
                  value={`~${result.weeksToTarget} weeks (${Math.round(result.weeksToTarget / 4.3)} mo)`}
                />
              )}
            </dl>
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <h3 className="font-semibold">Macro split</h3>
            <div className="mt-4 space-y-4">
              <MacroBar label="Protein" grams={result.macros.proteinG} pct={result.macros.proteinPct} color="#38bdf8" />
              <MacroBar label="Carbs" grams={result.macros.carbsG} pct={result.macros.carbsPct} color="#a78bfa" />
              <MacroBar label="Fat" grams={result.macros.fatG} pct={result.macros.fatPct} color="#fbbf24" />
            </div>
          </div>

          {trainingDays > 0 && trainingDays < 7 && (
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
              <h3 className="font-semibold">Training vs rest days</h3>
              <p className="mt-1 text-xs text-[var(--muted)]">
                Carbs shift +15% on training days ({trainingDays}d/wk).
              </p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <DayCard title="Training" macros={result.trainingDayMacros} />
                <DayCard title="Rest" macros={result.restDayMacros} />
              </div>
            </div>
          )}

          {result.warnings.length > 0 && (
            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-amber-600 dark:text-amber-400">
                Safety notes
              </p>
              <ul className="mt-2 space-y-1 text-sm text-[var(--muted)]">
                {result.warnings.map((w) => (
                  <li key={w}>• {w}</li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>

      {result.projections.length > 1 && phase !== "maintain" && (
        <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
          <h2 className="text-lg font-semibold">Weight projection</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[320px] text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] text-[var(--muted)]">
                  <th className="py-2 pr-4">Week</th>
                  <th className="py-2">Est. weight</th>
                </tr>
              </thead>
              <tbody>
                {result.projections.filter((_, i) => i % Math.max(1, Math.floor(result.projections.length / 8)) === 0 || i === result.projections.length - 1).map((row) => (
                  <tr key={row.week} className="border-b border-[var(--border)]/60">
                    <td className="py-2 pr-4">{row.week}</td>
                    <td className="py-2">{displayWeight(row.weightKg)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <aside className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5">
        <h2 className="text-xs font-semibold tracking-[0.14em] text-[var(--accent)] uppercase">
          Related tools
        </h2>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((tool) => (
            <li key={tool.slug}>
              <Link
                href={getToolHref(tool.slug)}
                className="block rounded-xl px-3 py-2 text-sm font-medium hover:bg-[var(--background)] hover:text-[var(--accent)]"
              >
                {tool.title}
              </Link>
            </li>
          ))}
        </ul>
      </aside>

      <p className="text-xs text-[var(--muted)]">
        {calculator.seoContent.intro} Estimates use Mifflin–St Jeor and the ~3,500 kcal/lb rule — not medical advice.
      </p>
    </div>
  );
}

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
      <div className="mb-2 flex justify-between gap-3">
        <label className="text-sm font-medium">{label}</label>
        <input
          type="number"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(e) => onChange(Number(e.target.value) || min)}
          className="w-24 rounded-lg border border-[var(--border)] bg-[var(--background)] px-2 py-1 text-right text-sm"
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

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-[var(--muted)]">{label}</dt>
      <dd className="font-semibold">{value}</dd>
    </div>
  );
}

function DayCard({
  title,
  macros,
}: {
  title: string;
  macros: { calories: number; proteinG: number; carbsG: number; fatG: number };
}) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-3">
      <p className="text-xs font-semibold uppercase text-[var(--accent)]">{title}</p>
      <p className="mt-1 text-lg font-bold">{macros.calories} kcal</p>
      <p className="mt-1 text-xs text-[var(--muted)]">
        P {macros.proteinG}g · C {macros.carbsG}g · F {macros.fatG}g
      </p>
    </div>
  );
}
