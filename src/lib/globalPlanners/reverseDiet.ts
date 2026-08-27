/**
 * Reverse Diet Planner — adaptive weekly calorie bumps.
 * Unique: shrinks next bump when scale weight drops faster than target band.
 */

import { clamp } from "./money";

export interface ReverseDietWeek {
  week: number;
  calories: number;
  plannedBump: number;
  adaptedBump: number;
  expectedWeightKg: number;
  weightChangeKg: number;
  adapted: boolean;
  note: string;
}

export interface ReverseDietInputs {
  currentCalories: number;
  maintenanceCalories: number;
  currentWeightKg: number;
  targetWeeklyGainKg: number;
  plannedBumpKcal: number;
  weeks: number;
  /** Simulated scale feedback: actual weekly change vs expected (kg). Negative = still losing. */
  observedWeeklyChangeKg?: number;
}

export interface ReverseDietResult {
  weeks: ReverseDietWeek[];
  finalCalories: number;
  weeksToMaintenance: number;
  totalAdaptedWeeks: number;
  insight: string;
}

const KCAL_PER_KG = 7700;

export function calculateReverseDiet(inputs: ReverseDietInputs): ReverseDietResult {
  const maint = Math.max(1200, inputs.maintenanceCalories);
  let cals = Math.max(800, inputs.currentCalories);
  let weight = Math.max(30, inputs.currentWeightKg);
  const targetGain = clamp(inputs.targetWeeklyGainKg, 0.05, 0.5);
  const baseBump = clamp(inputs.plannedBumpKcal, 25, 200);
  const horizon = clamp(Math.round(inputs.weeks), 4, 24);
  const observed =
    inputs.observedWeeklyChangeKg != null
      ? inputs.observedWeeklyChangeKg
      : targetGain;

  const weeks: ReverseDietWeek[] = [];
  let adaptedCount = 0;
  let weekHitMaint = horizon;

  for (let w = 1; w <= horizon; w++) {
    if (cals >= maint) {
      weekHitMaint = Math.min(weekHitMaint, w - 1 || 1);
      weeks.push({
        week: w,
        calories: Math.round(maint),
        plannedBump: 0,
        adaptedBump: 0,
        expectedWeightKg: weight,
        weightChangeKg: 0,
        adapted: false,
        note: "At maintenance — hold calories and reassess.",
      });
      continue;
    }

    // Adaptive: if still losing faster than half the target gain band, shrink bump
    const losingTooFast = observed < targetGain * 0.35;
    const adapted = losingTooFast && cals < maint;
    const bump = adapted ? Math.max(25, Math.round(baseBump * 0.5)) : baseBump;
    if (adapted) adaptedCount += 1;

    cals = Math.min(maint, cals + bump);
    const surplusVsMaint = cals - maint;
    // Rough expected change: surplus relative to true maint; early reverse still below maint → slight loss/stable
    const expectedDeltaKg = surplusVsMaint / KCAL_PER_KG;
    // Blend observed feedback into projected weight for realism
    const projectedDelta =
      observed * 0.6 + expectedDeltaKg * 0.4;
    weight = Math.max(30, weight + projectedDelta);

    weeks.push({
      week: w,
      calories: Math.round(cals),
      plannedBump: baseBump,
      adaptedBump: bump,
      expectedWeightKg: Math.round(weight * 10) / 10,
      weightChangeKg: Math.round(projectedDelta * 100) / 100,
      adapted,
      note: adapted
        ? `Scale still dropping — bump cut to ${bump} kcal (was ${baseBump}).`
        : `Standard +${bump} kcal toward maintenance.`,
    });

    if (cals >= maint && weekHitMaint === horizon) {
      weekHitMaint = w;
    }
  }

  const finalCalories = weeks[weeks.length - 1]?.calories ?? Math.round(cals);
  const insight =
    adaptedCount > 0
      ? `${adaptedCount} week(s) used adaptive smaller bumps because weight was still dropping — slower reverse diets protect recovery.`
      : `Steady +${baseBump} kcal/week reaches ~${finalCalories} kcal in ${weekHitMaint} week(s).`;

  return {
    weeks,
    finalCalories,
    weeksToMaintenance: weekHitMaint,
    totalAdaptedWeeks: adaptedCount,
    insight,
  };
}
