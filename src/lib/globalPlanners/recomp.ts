/**
 * Body Recomposition Planner.
 * Unique: training-volume deficit cap — more weekly sets → smaller deficit + higher protein.
 */

import { clamp } from "./money";

export interface RecompInputs {
  sex: "male" | "female";
  age: number;
  weightKg: number;
  heightCm: number;
  activityMultiplier: number;
  hardSetsPerWeek: number;
  trainingDays: number;
}

export interface RecompMacros {
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
}

export interface RecompResult {
  bmr: number;
  tdee: number;
  deficitCapKcal: number;
  targetCalories: number;
  macros: RecompMacros;
  trainingMacros: RecompMacros;
  restMacros: RecompMacros;
  volumeTier: "low" | "moderate" | "high" | "veryHigh";
  insight: string;
}

function mifflin(sex: "male" | "female", kg: number, cm: number, age: number): number {
  const a = clamp(age, 15, 80);
  return sex === "male"
    ? 10 * kg + 6.25 * cm - 5 * a + 5
    : 10 * kg + 6.25 * cm - 5 * a - 161;
}

function volumeTier(sets: number): RecompResult["volumeTier"] {
  if (sets < 40) return "low";
  if (sets < 80) return "moderate";
  if (sets < 120) return "high";
  return "veryHigh";
}

/** Higher volume → smaller deficit (protect recovery) */
function deficitCap(sets: number): number {
  if (sets < 40) return 350;
  if (sets < 80) return 250;
  if (sets < 120) return 150;
  return 100;
}

function proteinPerKg(sets: number): number {
  if (sets < 40) return 1.8;
  if (sets < 80) return 2.0;
  if (sets < 120) return 2.2;
  return 2.4;
}

function macrosFromCals(
  cals: number,
  weightKg: number,
  proteinGKg: number
): RecompMacros {
  const proteinG = Math.round(weightKg * proteinGKg);
  const fatG = Math.max(Math.round(weightKg * 0.7), Math.round((cals * 0.25) / 9));
  const carbG = Math.max(0, Math.round((cals - proteinG * 4 - fatG * 9) / 4));
  return { calories: Math.round(cals), proteinG, carbsG: carbG, fatG };
}

export function calculateRecomp(inputs: RecompInputs): RecompResult {
  const kg = Math.max(30, inputs.weightKg);
  const cm = Math.max(120, inputs.heightCm);
  const sets = clamp(inputs.hardSetsPerWeek, 0, 200);
  const days = clamp(inputs.trainingDays, 0, 7);
  const activity = clamp(inputs.activityMultiplier, 1.2, 1.9);

  const bmr = mifflin(inputs.sex, kg, cm, inputs.age);
  const tdee = bmr * activity;
  const cap = deficitCap(sets);
  const target = Math.max(bmr * 0.9, tdee - cap);
  const pKg = proteinPerKg(sets);
  const macros = macrosFromCals(target, kg, pKg);

  let trainingMacros = macros;
  let restMacros = macros;
  if (days > 0 && days < 7) {
    const restDays = 7 - days;
    const trainingCarbs = Math.round(macros.carbsG * 1.12);
    const restCarbs = Math.max(
      0,
      Math.round((macros.carbsG * 7 - trainingCarbs * days) / restDays)
    );
    trainingMacros = {
      ...macros,
      carbsG: trainingCarbs,
      calories: macros.proteinG * 4 + trainingCarbs * 4 + macros.fatG * 9,
    };
    restMacros = {
      ...macros,
      carbsG: restCarbs,
      calories: macros.proteinG * 4 + restCarbs * 4 + macros.fatG * 9,
    };
  }

  const tier = volumeTier(sets);
  const insight = `At ${sets} hard sets/week (${tier} volume), deficit capped at ${cap} kcal so recovery keeps up — target ${Math.round(target)} kcal with ${macros.proteinG} g protein.`;

  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    deficitCapKcal: cap,
    targetCalories: Math.round(target),
    macros,
    trainingMacros,
    restMacros,
    volumeTier: tier,
    insight,
  };
}
