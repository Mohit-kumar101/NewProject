/**
 * Smart Bulk & Cut Macro Planner — Mifflin–St Jeor TDEE, phase calories, macro splits.
 * Estimates only — not medical or dietary advice.
 */

export type TrainingExperience = "beginner" | "intermediate" | "advanced";
export type Phase = "cut" | "maintain" | "bulk";
export type ActivityLevel =
  | "sedentary"
  | "light"
  | "moderate"
  | "active"
  | "veryActive";
export type UnitSystem = "metric" | "imperial";

export interface BulkCutInputs {
  sex: "male" | "female";
  age: number;
  weightKg: number;
  heightCm: number;
  activity: ActivityLevel;
  experience: TrainingExperience;
  phase: Phase;
  weeklyRateLbs: number;
  targetWeightKg?: number;
  trainingDaysPerWeek: number;
}

export interface MacroSplit {
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  proteinPct: number;
  carbsPct: number;
  fatPct: number;
}

export interface WeeklyProjection {
  week: number;
  weightKg: number;
  phase: Phase;
}

export interface BulkCutResult {
  bmr: number;
  tdee: number;
  dailyCalories: number;
  weeklyRateLbs: number;
  requestedWeeklyRateLbs: number;
  rateClamped: boolean;
  macros: MacroSplit;
  trainingDayMacros: MacroSplit;
  restDayMacros: MacroSplit;
  weeksToTarget: number | null;
  projections: WeeklyProjection[];
  warnings: string[];
  insight: string;
}

const LB_TO_KG = 0.453592;
const KCAL_PER_LB = 3500;

const ACTIVITY: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  veryActive: 1.9,
};

const MAX_CUT_LB: Record<TrainingExperience, number> = {
  beginner: 0.75,
  intermediate: 1.0,
  advanced: 1.0,
};

const MAX_BULK_LB: Record<TrainingExperience, number> = {
  beginner: 0.5,
  intermediate: 0.75,
  advanced: 0.5,
};

const PROTEIN_G_KG: Record<Phase, Record<TrainingExperience, number>> = {
  cut: { beginner: 2.2, intermediate: 2.0, advanced: 2.2 },
  maintain: { beginner: 1.8, intermediate: 1.7, advanced: 1.8 },
  bulk: { beginner: 1.8, intermediate: 1.8, advanced: 2.0 },
};

const FAT_PCT: Record<Phase, number> = {
  cut: 0.3,
  maintain: 0.27,
  bulk: 0.25,
};

function clamp(n: number, min: number, max: number): number {
  if (!Number.isFinite(n)) return min;
  return Math.min(max, Math.max(min, n));
}

export function lbsToKg(lbs: number): number {
  return Math.max(0, lbs) * LB_TO_KG;
}

export function kgToLbs(kg: number): number {
  return Math.max(0, kg) / LB_TO_KG;
}

export function imperialToMetric(
  weightLbs: number,
  heightFt: number,
  heightIn: number
): { weightKg: number; heightCm: number } {
  return {
    weightKg: lbsToKg(weightLbs),
    heightCm: (heightFt * 12 + heightIn) * 2.54,
  };
}

function mifflinStJeor(
  sex: "male" | "female",
  weightKg: number,
  heightCm: number,
  age: number
): number {
  const w = Math.max(30, weightKg);
  const h = Math.max(120, heightCm);
  const a = clamp(age, 15, 90);
  return sex === "male"
    ? 10 * w + 6.25 * h - 5 * a + 5
    : 10 * w + 6.25 * h - 5 * a - 161;
}

function minCalories(sex: "male" | "female", bmr: number): number {
  const floor = sex === "male" ? 1500 : 1200;
  return Math.max(floor, bmr * 0.85);
}

function computeMacros(
  calories: number,
  weightKg: number,
  phase: Phase,
  experience: TrainingExperience
): MacroSplit {
  const cal = Math.max(800, calories);
  const proteinG = Math.round(weightKg * PROTEIN_G_KG[phase][experience]);
  const proteinCals = proteinG * 4;
  const fatTarget = cal * FAT_PCT[phase];
  const minFatG = Math.round(weightKg * 0.6);
  const fatG = Math.max(minFatG, Math.round(fatTarget / 9));
  const fatCals = fatG * 9;
  const carbG = Math.max(0, Math.round((cal - proteinCals - fatCals) / 4));

  return {
    calories: cal,
    proteinG,
    carbsG: carbG,
    fatG,
    proteinPct: Math.round((proteinCals / cal) * 100),
    carbsPct: Math.round(((carbG * 4) / cal) * 100),
    fatPct: Math.round((fatCals / cal) * 100),
  };
}

function splitTrainingRest(
  base: MacroSplit,
  trainingDays: number
): { training: MacroSplit; rest: MacroSplit } {
  const days = clamp(trainingDays, 0, 7);
  if (days === 0 || days === 7) {
    return { training: base, rest: base };
  }
  const restDays = 7 - days;
  const carbBoost = 0.15;
  const trainingCarbs = Math.round(base.carbsG * (1 + carbBoost));
  const restCarbs = Math.round(
    (base.carbsG * 7 - trainingCarbs * days) / restDays
  );
  const trainingCals = base.proteinG * 4 + trainingCarbs * 4 + base.fatG * 9;
  const restCals = base.proteinG * 4 + Math.max(0, restCarbs) * 4 + base.fatG * 9;

  const mk = (cals: number, carbs: number): MacroSplit => ({
    ...base,
    calories: cals,
    carbsG: Math.max(0, carbs),
    carbsPct: Math.round(((Math.max(0, carbs) * 4) / cals) * 100),
    proteinPct: Math.round(((base.proteinG * 4) / cals) * 100),
    fatPct: Math.round(((base.fatG * 9) / cals) * 100),
  });

  return {
    training: mk(trainingCals, trainingCarbs),
    rest: mk(restCals, Math.max(0, restCarbs)),
  };
}

function buildProjections(
  startKg: number,
  weeklyLbs: number,
  phase: Phase,
  weeks: number
): WeeklyProjection[] {
  const rows: WeeklyProjection[] = [];
  let w = startKg;
  const dir = phase === "cut" ? -1 : phase === "bulk" ? 1 : 0;
  const deltaKg = weeklyLbs * LB_TO_KG * dir;

  for (let week = 0; week <= weeks; week++) {
    rows.push({ week, weightKg: w, phase });
    w += deltaKg;
  }
  return rows;
}

export function calculateBulkCut(inputs: BulkCutInputs): BulkCutResult {
  const warnings: string[] = [];
  const weightKg = Math.max(30, inputs.weightKg);
  const heightCm = Math.max(120, inputs.heightCm);
  const age = clamp(inputs.age, 15, 90);

  const bmr = mifflinStJeor(inputs.sex, weightKg, heightCm, age);
  const tdee = bmr * ACTIVITY[inputs.activity];

  let weeklyRate = Math.max(0, inputs.weeklyRateLbs);
  const requested = weeklyRate;
  let rateClamped = false;

  if (inputs.phase === "cut") {
    const max = MAX_CUT_LB[inputs.experience];
    if (weeklyRate > max) {
      weeklyRate = max;
      rateClamped = true;
      warnings.push(
        `Cut rate capped at ${max} lb/week for ${inputs.experience} lifters — faster deficits risk muscle loss.`
      );
    }
    if (weeklyRate > 1) {
      warnings.push(
        "Losing more than ~1 lb/week long-term usually requires medical supervision."
      );
    }
  } else if (inputs.phase === "bulk") {
    const max = MAX_BULK_LB[inputs.experience];
    if (weeklyRate > max) {
      weeklyRate = max;
      rateClamped = true;
      warnings.push(
        `Bulk rate capped at ${max} lb/week — lean gains stay closer to 0.25–0.5 lb/week for most people.`
      );
    }
  }

  const dailyAdj = (weeklyRate * KCAL_PER_LB) / 7;
  let dailyCalories =
    inputs.phase === "cut"
      ? tdee - dailyAdj
      : inputs.phase === "bulk"
        ? tdee + dailyAdj
        : tdee;

  const floor = minCalories(inputs.sex, bmr);
  if (inputs.phase === "cut" && dailyCalories < floor) {
    dailyCalories = floor;
    warnings.push(
      `Calories floored at ${Math.round(floor)} kcal (~85% BMR) for safety. Consider a slower cut rate.`
    );
  }

  dailyCalories = Math.round(dailyCalories);
  const macros = computeMacros(
    dailyCalories,
    weightKg,
    inputs.phase,
    inputs.experience
  );
  const { training, rest } = splitTrainingRest(
    macros,
    inputs.trainingDaysPerWeek
  );

  let weeksToTarget: number | null = null;
  if (
    inputs.targetWeightKg != null &&
    inputs.targetWeightKg > 0 &&
    inputs.phase !== "maintain" &&
    weeklyRate > 0
  ) {
    const deltaKg = Math.abs(weightKg - inputs.targetWeightKg);
    const deltaLbs = deltaKg / LB_TO_KG;
    weeksToTarget = Math.ceil(deltaLbs / weeklyRate);
  }

  const projectionWeeks = weeksToTarget != null ? Math.min(weeksToTarget, 52) : 12;
  const projections = buildProjections(
    weightKg,
    weeklyRate,
    inputs.phase,
    projectionWeeks
  );

  const phaseLabel =
    inputs.phase === "cut"
      ? "cutting"
      : inputs.phase === "bulk"
        ? "lean bulking"
        : "maintaining";

  const insight =
    inputs.phase === "maintain"
      ? `Maintenance at ${Math.round(tdee)} kcal keeps weight stable. Protein at ${macros.proteinG} g supports recovery between phases.`
      : `${Math.round(dailyCalories)} kcal/day while ${phaseLabel} targets ~${weeklyRate} lb/week (${Math.round(dailyAdj)} kcal ${inputs.phase === "cut" ? "deficit" : "surplus"}).`;

  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    dailyCalories,
    weeklyRateLbs: weeklyRate,
    requestedWeeklyRateLbs: requested,
    rateClamped,
    macros,
    trainingDayMacros: training,
    restDayMacros: rest,
    weeksToTarget,
    projections,
    warnings,
    insight,
  };
}

export const ACTIVITY_LABELS: Record<ActivityLevel, string> = {
  sedentary: "Sedentary (desk job, little exercise)",
  light: "Light (1–3 days/week)",
  moderate: "Moderate (3–5 days/week)",
  active: "Active (6–7 days/week)",
  veryActive: "Very active (athlete / physical job)",
};

export const EXPERIENCE_LABELS: Record<TrainingExperience, string> = {
  beginner: "Beginner (< 1 year consistent lifting)",
  intermediate: "Intermediate (1–3 years)",
  advanced: "Advanced (3+ years)",
};
