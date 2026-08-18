/**
 * Health, Fitness & Wellness calculator formulas (48 tools).
 * Estimates only — not medical, legal, or financial advice.
 */

import type { CalcResult } from "./types";

type Inputs = Record<string, number>;

const LB_TO_KG = 0.453592;
const IN_TO_CM = 2.54;
const IN_TO_M = 0.0254;

const number = (n: number, digits = 1): string => {
  if (!Number.isFinite(n)) return "—";
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: digits,
    minimumFractionDigits: Math.min(digits, 2),
  }).format(n);
};

const currency = (n: number, digits = 2): string => {
  if (!Number.isFinite(n)) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(n);
};

function result(
  primaryLabel: string,
  primaryValue: string,
  secondary: { label: string; value: string }[],
  insight?: string
): CalcResult {
  return {
    primary: { label: primaryLabel, value: primaryValue, highlight: true },
    secondary,
    insight,
  };
}

function clamp(n: number, min: number, max: number): number {
  if (!Number.isFinite(n)) return min;
  return Math.min(max, Math.max(min, n));
}

function lbsToKg(lbs: number): number {
  return Math.max(0, lbs) * LB_TO_KG;
}

function inToCm(inches: number): number {
  return Math.max(0, inches) * IN_TO_CM;
}

function inToM(inches: number): number {
  return Math.max(0, inches) * IN_TO_M;
}

function isMale(sex: number): boolean {
  return (sex ?? 0) >= 0.5;
}

function bmiFromImperial(weightLbs: number, heightIn: number): number {
  const h = Math.max(heightIn, 1);
  return (weightLbs / (h * h)) * 703;
}

function bmiCategory(bmi: number): string {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal weight";
  if (bmi < 30) return "Overweight";
  return "Obese";
}

function mifflinStJeor(
  sex: number,
  age: number,
  weightLbs: number,
  heightIn: number
): number {
  const kg = lbsToKg(weightLbs);
  const cm = inToCm(heightIn);
  const a = clamp(age, 15, 90);
  return isMale(sex)
    ? 10 * kg + 6.25 * cm - 5 * a + 5
    : 10 * kg + 6.25 * cm - 5 * a - 161;
}

function navyBodyFat(
  sex: number,
  heightIn: number,
  neckIn: number,
  waistIn: number,
  hipIn: number
): number {
  const h = Math.max(heightIn, 1);
  const neck = Math.max(neckIn, 1);
  const waist = Math.max(waistIn, neck + 0.1);
  if (isMale(sex)) {
    const logVal = Math.log10(waist - neck);
    const logH = Math.log10(h);
    return 495 / (1.0324 - 0.19077 * logVal + 0.15456 * logH) - 450;
  }
  const hip = Math.max(hipIn, 1);
  const logVal = Math.log10(waist + hip - neck);
  const logH = Math.log10(h);
  return 495 / (1.29579 - 0.35004 * logVal + 0.221 * logH) - 450;
}

function bodyFatCategory(pct: number, male: boolean): string {
  if (male) {
    if (pct < 6) return "Essential fat";
    if (pct < 14) return "Athletes";
    if (pct < 18) return "Fitness";
    if (pct < 25) return "Average";
    return "Obese";
  }
  if (pct < 14) return "Essential fat";
  if (pct < 21) return "Athletes";
  if (pct < 25) return "Fitness";
  if (pct < 32) return "Average";
  return "Obese";
}

function idealWeightRange(heightIn: number, male: boolean): {
  hamwi: number;
  devine: number;
  robinson: number;
  miller: number;
} {
  const over60 = Math.max(0, heightIn - 60);
  if (male) {
    return {
      hamwi: 106 + 6 * over60,
      devine: 110 + 5.06 * over60,
      robinson: 114 + 4.18 * over60,
      miller: 124 + 3 * over60,
    };
  }
  return {
    hamwi: 100 + 5 * over60,
    devine: 100 + 5.06 * over60,
    robinson: 107 + 3.75 * over60,
    miller: 117 + 2.7 * over60,
  };
}

function childBmiPercentileEstimate(
  age: number,
  sex: number,
  bmi: number
): { percentile: number; category: string } {
  const a = clamp(age, 2, 17);
  const male = isMale(sex);
  const median = male ? 16.5 + a * 0.15 : 16.2 + a * 0.14;
  const spread = 3.2 + a * 0.08;
  const z = (bmi - median) / spread;
  const percentile = clamp(50 + z * 34, 1, 99);
  let category = "Healthy weight";
  if (percentile < 5) category = "Underweight";
  else if (percentile < 85) category = "Healthy weight";
  else if (percentile < 95) category = "Overweight";
  else category = "Obese";
  return { percentile, category };
}

function oneRepMax(weight: number, reps: number): {
  brzycki: number;
  epley: number;
  lander: number;
} {
  const w = Math.max(0, weight);
  const r = clamp(reps, 1, 12);
  return {
    brzycki: w * (36 / (37 - r)),
    epley: w * (1 + r / 30),
    lander: (100 * w) / (101.3 - 2.67123 * r),
  };
}

function pregnancyGainRange(bmi: number, twins: boolean): {
  totalMin: number;
  totalMax: number;
} {
  if (twins) {
    if (bmi < 18.5) return { totalMin: 37, totalMax: 54 };
    if (bmi < 25) return { totalMin: 37, totalMax: 54 };
    if (bmi < 30) return { totalMin: 31, totalMax: 50 };
    return { totalMin: 25, totalMax: 42 };
  }
  if (bmi < 18.5) return { totalMin: 28, totalMax: 40 };
  if (bmi < 25) return { totalMin: 25, totalMax: 35 };
  if (bmi < 30) return { totalMin: 15, totalMax: 25 };
  return { totalMin: 11, totalMax: 20 };
}

function formatDaysLabel(days: number): string {
  if (!Number.isFinite(days)) return "—";
  const w = Math.floor(days / 7);
  const d = Math.round(days % 7);
  if (w === 0) return `${Math.round(days)} days`;
  if (d === 0) return `${w} wk`;
  return `${w} wk ${d} d`;
}

function formatTimeFromMinutes(totalMin: number): string {
  const m = Math.round(totalMin);
  const h = Math.floor(m / 60);
  const rem = m % 60;
  if (h === 0) return `${rem} min`;
  return `${h}h ${rem.toString().padStart(2, "0")}m`;
}

function formatClock(minutesFromMidnight: number): string {
  const m = ((Math.round(minutesFromMidnight) % 1440) + 1440) % 1440;
  const h24 = Math.floor(m / 60);
  const min = m % 60;
  const period = h24 >= 12 ? "PM" : "AM";
  const h12 = h24 % 12 || 12;
  return `${h12}:${min.toString().padStart(2, "0")} ${period}`;
}

export const HEALTH_FORMULA_TYPES = [
  "healthBmi",
  "healthChildrenBmi",
  "healthBodyFatNavy",
  "healthArmyBodyFat",
  "healthIdealWeight",
  "healthLeanBodyMass",
  "healthWaistHipRatio",
  "healthWaistHeightRatio",
  "healthFfmi",
  "healthBri",
  "healthBmr",
  "healthTdee",
  "healthCalorieDeficit",
  "healthWeightLossTimeline",
  "healthProteinIntake",
  "healthCaloriesBurned",
  "healthStepsToCalories",
  "healthWeightGain",
  "healthHeartRateZones",
  "healthMaxHeartRate",
  "healthOneRepMax",
  "healthRunningPace",
  "healthVo2Max",
  "healthWalkingCalories",
  "healthCyclingCalories",
  "healthWeightLiftingCalories",
  "healthDueDate",
  "healthConceptionDate",
  "healthOvulation",
  "healthPeriod",
  "healthPregnancyWeek",
  "healthPregnancyWeightGain",
  "healthIvfDueDate",
  "healthBreastfeedingCalories",
  "healthWaterIntake",
  "healthSleepCycle",
  "healthCaffeineHalfLife",
  "healthBac",
  "healthIntermittentFasting",
  "healthHydrationActivity",
  "healthCaffeineIntake",
  "healthSleepDebt",
  "healthGymCostPerWorkout",
  "healthProteinPowderCost",
  "healthSupplementCost",
  "healthPtCost",
  "healthGlassesVsContacts",
  "healthHomeVsGym",
] as const;

export type HealthFormulaType = (typeof HEALTH_FORMULA_TYPES)[number];

const HEALTH_FORMULA_SET = new Set<string>(HEALTH_FORMULA_TYPES);

export function isHealthFormulaType(formulaType: string): boolean {
  return HEALTH_FORMULA_SET.has(formulaType);
}

export function runHealthCalculation(
  formulaType: string,
  inputs: Inputs
): CalcResult | null {
  if (!isHealthFormulaType(formulaType)) return null;

  switch (formulaType) {
    case "healthBmi": {
      const bmi = bmiFromImperial(inputs.weightLbs, inputs.heightIn);
      const cat = bmiCategory(bmi);
      const h = inputs.heightIn / 12;
      const healthyLow = (18.5 * inputs.heightIn * inputs.heightIn) / 703;
      const healthyHigh = (24.9 * inputs.heightIn * inputs.heightIn) / 703;
      return result("BMI", number(bmi, 1), [
        { label: "Category", value: cat },
        { label: "Healthy weight range", value: `${number(healthyLow, 0)}–${number(healthyHigh, 0)} lbs` },
        { label: "Height", value: `${number(h, 1)} ft` },
      ], "BMI screens weight status but does not measure body fat or muscle.");
    }

    case "healthChildrenBmi": {
      const bmi = bmiFromImperial(inputs.weightLbs, inputs.heightIn);
      const { percentile, category } = childBmiPercentileEstimate(
        inputs.ageYears,
        inputs.sex,
        bmi
      );
      return result("BMI", number(bmi, 1), [
        { label: "Estimated percentile", value: `${number(percentile, 0)}th` },
        { label: "Category", value: category },
        { label: "Age", value: `${number(inputs.ageYears, 0)} years` },
      ], "Pediatric percentiles require CDC charts; this is a simplified screening estimate.");
    }

    case "healthBodyFatNavy":
    case "healthArmyBodyFat": {
      const bf = clamp(
        navyBodyFat(
          inputs.sex,
          inputs.heightIn,
          inputs.neckIn,
          inputs.waistIn,
          inputs.hipIn ?? 0
        ),
        2,
        60
      );
      const male = isMale(inputs.sex);
      const fatMass = inputs.weightLbs * (bf / 100);
      const lean = inputs.weightLbs - fatMass;
      const maxAllowed =
        formulaType === "healthArmyBodyFat"
          ? male
            ? inputs.ageYears <= 20
              ? 20
              : inputs.ageYears <= 27
                ? 22
                : 24
            : inputs.ageYears <= 30
              ? 30
              : 32
          : null;
      const secondary = [
        { label: "Category", value: bodyFatCategory(bf, male) },
        { label: "Fat mass", value: `${number(fatMass, 1)} lbs` },
        { label: "Lean mass", value: `${number(lean, 1)} lbs` },
      ];
      if (maxAllowed != null) {
        secondary.push({
          label: "Army max (approx.)",
          value: `${number(maxAllowed, 0)}%`,
        });
      }
      return result("Body fat %", `${number(bf, 1)}%`, secondary);
    }

    case "healthIdealWeight": {
      const male = isMale(inputs.sex);
      const w = idealWeightRange(inputs.heightIn, male);
      const avg = (w.hamwi + w.devine + w.robinson + w.miller) / 4;
      return result("Average ideal weight", `${number(avg, 0)} lbs`, [
        { label: "Hamwi", value: `${number(w.hamwi, 0)} lbs` },
        { label: "Devine", value: `${number(w.devine, 0)} lbs` },
        { label: "Robinson", value: `${number(w.robinson, 0)} lbs` },
        { label: "Miller", value: `${number(w.miller, 0)} lbs` },
      ]);
    }

    case "healthLeanBodyMass": {
      const bf = clamp(inputs.bodyFatPct, 3, 60);
      const lbm = inputs.weightLbs * (1 - bf / 100);
      const fat = inputs.weightLbs - lbm;
      return result("Lean body mass", `${number(lbm, 1)} lbs`, [
        { label: "Fat mass", value: `${number(fat, 1)} lbs` },
        { label: "Body fat used", value: `${number(bf, 1)}%` },
        { label: "Total weight", value: `${number(inputs.weightLbs, 0)} lbs` },
      ]);
    }

    case "healthWaistHipRatio": {
      const whr = inputs.waistIn / Math.max(inputs.hipIn, 1);
      const male = isMale(inputs.sex);
      let risk = "Low";
      if (male) {
        if (whr >= 1) risk = "High";
        else if (whr >= 0.9) risk = "Moderate";
      } else {
        if (whr >= 0.85) risk = "High";
        else if (whr >= 0.8) risk = "Moderate";
      }
      return result("Waist-to-hip ratio", number(whr, 2), [
        { label: "Risk band", value: risk },
        { label: "Waist", value: `${number(inputs.waistIn, 1)} in` },
        { label: "Hip", value: `${number(inputs.hipIn, 1)} in` },
      ]);
    }

    case "healthWaistHeightRatio": {
      const whtr = inputs.waistIn / Math.max(inputs.heightIn, 1);
      let risk = "Healthy";
      if (whtr >= 0.6) risk = "High central fat risk";
      else if (whtr >= 0.5) risk = "Increased risk";
      return result("Waist-to-height ratio", number(whtr, 2), [
        { label: "Screening", value: risk },
        { label: "Target", value: "Below 0.50" },
      ]);
    }

    case "healthFfmi": {
      const bf = clamp(inputs.bodyFatPct, 3, 60);
      const leanLbs = inputs.weightLbs * (1 - bf / 100);
      const leanKg = lbsToKg(leanLbs);
      const hm = inToM(inputs.heightIn);
      const ffmi = leanKg / (hm * hm);
      const normalized = ffmi + 6.1 * (1.8 - hm);
      let band = "Average";
      if (normalized >= 25) band = "Enhanced (verify naturally)";
      else if (normalized >= 22) band = "Excellent";
      else if (normalized >= 20) band = "Above average";
      return result("FFMI", number(ffmi, 1), [
        { label: "Normalized FFMI", value: number(normalized, 1) },
        { label: "Lean mass", value: `${number(leanLbs, 0)} lbs` },
        { label: "Typical band", value: band },
      ]);
    }

    case "healthBri": {
      const hm = inToM(inputs.heightIn);
      const wm = inToM(inputs.waistIn);
      const term = 1 - Math.pow(wm / (Math.PI * 0.5 * hm), 2);
      const bri = term > 0 ? 364.2 - 365.5 * Math.sqrt(term) : 0;
      let band = "Normal";
      if (bri >= 6.9) band = "High adiposity signal";
      else if (bri >= 5.5) band = "Moderate";
      return result("Body Roundness Index", number(bri, 2), [
        { label: "Interpretation", value: band },
        { label: "Waist", value: `${number(inputs.waistIn, 1)} in` },
      ]);
    }

    case "healthBmr": {
      const bmr = mifflinStJeor(
        inputs.sex,
        inputs.ageYears,
        inputs.weightLbs,
        inputs.heightIn
      );
      return result("BMR", `${number(bmr, 0)} kcal/day`, [
        { label: "Formula", value: "Mifflin–St Jeor" },
        { label: "Sex", value: isMale(inputs.sex) ? "Male" : "Female" },
        { label: "Age", value: `${number(inputs.ageYears, 0)} years` },
      ]);
    }

    case "healthTdee": {
      const bmr = mifflinStJeor(
        inputs.sex,
        inputs.ageYears,
        inputs.weightLbs,
        inputs.heightIn
      );
      const activity = clamp(inputs.activityMultiplier, 1.2, 1.9);
      const tdee = bmr * activity;
      return result("TDEE (maintenance)", `${number(tdee, 0)} kcal/day`, [
        { label: "BMR", value: `${number(bmr, 0)} kcal` },
        { label: "Activity factor", value: `×${number(activity, 2)}` },
        { label: "Cut target (−500)", value: `${number(tdee - 500, 0)} kcal` },
        { label: "Surplus (+300)", value: `${number(tdee + 300, 0)} kcal` },
      ]);
    }

    case "healthCalorieDeficit": {
      const tdee = Math.max(1200, inputs.tdee);
      const weeklyLoss = clamp(inputs.weeklyLossLbs, 0.25, 3);
      const dailyDeficit = (weeklyLoss * 3500) / 7;
      const target = Math.max(1200, tdee - dailyDeficit);
      return result("Daily calorie target", `${number(target, 0)} kcal`, [
        { label: "TDEE", value: `${number(tdee, 0)} kcal` },
        { label: "Daily deficit", value: `${number(dailyDeficit, 0)} kcal` },
        { label: "Weekly loss goal", value: `${number(weeklyLoss, 2)} lb` },
      ], "Avoid eating below BMR long-term without medical supervision.");
    }

    case "healthWeightLossTimeline": {
      const toLose = Math.max(0, inputs.currentLbs - inputs.targetLbs);
      const weekly = clamp(inputs.weeklyLossLbs, 0.25, 3);
      const weeks = weekly > 0 ? toLose / weekly : Infinity;
      return result("Estimated time", weeks === Infinity ? "—" : `${number(weeks, 1)} weeks`, [
        { label: "Weight to lose", value: `${number(toLose, 1)} lbs` },
        { label: "Weekly rate", value: `${number(weekly, 2)} lb/week` },
        { label: "Daily deficit", value: `${number((weekly * 3500) / 7, 0)} kcal` },
      ]);
    }

    case "healthProteinIntake": {
      const kg = lbsToKg(inputs.weightLbs);
      const mult = clamp(inputs.gramsPerKg, 0.8, 2.5);
      const grams = kg * mult;
      return result("Daily protein", `${number(grams, 0)} g`, [
        { label: "Per kg bodyweight", value: `${number(mult, 2)} g/kg` },
        { label: "Per meal (4 meals)", value: `${number(grams / 4, 0)} g` },
      ]);
    }

    case "healthCaloriesBurned": {
      const met = clamp(inputs.met, 1, 18);
      const hours = Math.max(0, inputs.durationMin) / 60;
      const cals = met * lbsToKg(inputs.weightLbs) * hours;
      return result("Calories burned", `${number(cals, 0)} kcal`, [
        { label: "MET value", value: number(met, 1) },
        { label: "Duration", value: `${number(inputs.durationMin, 0)} min` },
        { label: "Per hour", value: `${number(cals / Math.max(hours, 0.01), 0)} kcal` },
      ]);
    }

    case "healthStepsToCalories": {
      const steps = Math.max(0, inputs.steps);
      const strideIn = clamp(inputs.strideIn, 20, 36);
      const miles = (steps * strideIn) / 63360;
      const met = 3.5;
      const hours = miles / clamp(inputs.walkSpeedMph, 2, 4.5);
      const cals = met * lbsToKg(inputs.weightLbs) * hours;
      return result("Estimated calories", `${number(cals, 0)} kcal`, [
        { label: "Distance", value: `${number(miles, 2)} mi` },
        { label: "Steps", value: number(steps, 0) },
      ]);
    }

    case "healthWeightGain": {
      const tdee = Math.max(1500, inputs.tdee);
      const weekly = clamp(inputs.weeklyGainLbs, 0.25, 2);
      const surplus = (weekly * 3500) / 7;
      return result("Daily surplus target", `${number(tdee + surplus, 0)} kcal`, [
        { label: "Maintenance (TDEE)", value: `${number(tdee, 0)} kcal` },
        { label: "Daily surplus", value: `${number(surplus, 0)} kcal` },
        { label: "Weekly gain goal", value: `${number(weekly, 2)} lb` },
      ]);
    }

    case "healthHeartRateZones": {
      const age = clamp(inputs.ageYears, 15, 90);
      const rest = clamp(inputs.restingHr, 40, 100);
      const maxHr = 220 - age;
      const reserve = maxHr - rest;
      const zones = [
        { name: "Recovery", pct: 0.5 },
        { name: "Fat burn", pct: 0.6 },
        { name: "Aerobic", pct: 0.7 },
        { name: "Anaerobic", pct: 0.85 },
        { name: "Peak", pct: 0.95 },
      ];
      const fatLow = Math.round(rest + reserve * 0.6);
      const fatHigh = Math.round(rest + reserve * 0.7);
      return result("Fat-burn zone", `${fatLow}–${fatHigh} bpm`, [
        { label: "Max HR (220−age)", value: `${maxHr} bpm` },
        { label: "Resting HR", value: `${number(rest, 0)} bpm` },
        { label: "Aerobic zone", value: `${Math.round(rest + reserve * 0.7)}–${Math.round(rest + reserve * 0.8)} bpm` },
        { label: "Peak zone", value: `${Math.round(rest + reserve * 0.9)}+ bpm` },
      ], "Karvonen method: target = resting + (max − resting) × intensity.");
    }

    case "healthMaxHeartRate": {
      const age = clamp(inputs.ageYears, 15, 90);
      const classic = 220 - age;
      const tanaka = 208 - 0.7 * age;
      const gulati = 206 - 0.88 * age;
      return result("Estimated max HR", `${Math.round(classic)} bpm`, [
        { label: "220 − age", value: `${Math.round(classic)} bpm` },
        { label: "Tanaka", value: `${Math.round(tanaka)} bpm` },
        { label: "Gulati (women)", value: `${Math.round(gulati)} bpm` },
      ]);
    }

    case "healthOneRepMax": {
      const orm = oneRepMax(inputs.weightLifted, inputs.reps);
      const avg = (orm.brzycki + orm.epley + orm.lander) / 3;
      return result("Estimated 1RM", `${number(avg, 0)} lbs`, [
        { label: "Brzycki", value: `${number(orm.brzycki, 0)} lbs` },
        { label: "Epley", value: `${number(orm.epley, 0)} lbs` },
        { label: "Lander", value: `${number(orm.lander, 0)} lbs` },
        { label: "90% training weight", value: `${number(avg * 0.9, 0)} lbs` },
      ]);
    }

    case "healthRunningPace": {
      const miles = Math.max(0.1, inputs.distanceMiles);
      const paceMinPerMile = inputs.timeMin / miles;
      const paceMin = Math.floor(paceMinPerMile);
      const paceSec = Math.round((paceMinPerMile - paceMin) * 60);
      const speedMph = miles / (inputs.timeMin / 60);
      return result("Pace", `${paceMin}:${paceSec.toString().padStart(2, "0")} /mi`, [
        { label: "Speed", value: `${number(speedMph, 2)} mph` },
        { label: "5K projection", value: formatTimeFromMinutes(paceMinPerMile * 3.10686) },
        { label: "Distance", value: `${number(miles, 2)} mi` },
      ]);
    }

    case "healthVo2Max": {
      const miles = Math.max(0.5, inputs.distanceMiles12Min);
      const km = miles * 1.60934;
      const vo2 = 22.351 * km - 11.288;
      let fitness = "Fair";
      if (vo2 >= 50) fitness = "Superior";
      else if (vo2 >= 43) fitness = "Excellent";
      else if (vo2 >= 36) fitness = "Good";
      return result("Estimated VO₂ max", `${number(vo2, 1)} ml/kg/min`, [
        { label: "12-min distance", value: `${number(miles, 2)} mi` },
        { label: "Fitness band", value: fitness },
      ], "Cooper 12-minute run field estimate — not a lab VO₂ test.");
    }

    case "healthWalkingCalories": {
      const met = inputs.walkSpeedMph >= 4 ? 5 : inputs.walkSpeedMph >= 3.5 ? 3.8 : 3.5;
      const hours = inputs.distanceMiles / Math.max(inputs.walkSpeedMph, 2);
      const cals = met * lbsToKg(inputs.weightLbs) * hours;
      return result("Calories burned", `${number(cals, 0)} kcal`, [
        { label: "Distance", value: `${number(inputs.distanceMiles, 2)} mi` },
        { label: "Speed", value: `${number(inputs.walkSpeedMph, 1)} mph` },
      ]);
    }

    case "healthCyclingCalories": {
      const met =
        inputs.speedMph >= 16 ? 10 : inputs.speedMph >= 12 ? 8 : 6.8;
      const hours = inputs.distanceMiles / Math.max(inputs.speedMph, 5);
      const cals = met * lbsToKg(inputs.weightLbs) * hours;
      return result("Calories burned", `${number(cals, 0)} kcal`, [
        { label: "Distance", value: `${number(inputs.distanceMiles, 2)} mi` },
        { label: "Speed", value: `${number(inputs.speedMph, 1)} mph` },
      ]);
    }

    case "healthWeightLiftingCalories": {
      const met = inputs.intensity === 3 ? 6 : inputs.intensity === 2 ? 5 : 3.5;
      const hours = Math.max(0, inputs.durationMin) / 60;
      const cals = met * lbsToKg(inputs.weightLbs) * hours;
      return result("Calories burned", `${number(cals, 0)} kcal`, [
        { label: "Intensity", value: inputs.intensity === 3 ? "Heavy" : inputs.intensity === 2 ? "Moderate" : "Light" },
        { label: "Duration", value: `${number(inputs.durationMin, 0)} min` },
      ]);
    }

    case "healthDueDate": {
      const daysSinceLmp = Math.max(0, inputs.daysSinceLmp);
      const daysRemaining = 280 - daysSinceLmp;
      const weeks = daysSinceLmp / 7;
      return result("Days until due date", formatDaysLabel(Math.max(0, daysRemaining)), [
        { label: "Gestational age", value: `${number(weeks, 1)} weeks` },
        { label: "Trimester", value: weeks < 13 ? "1st" : weeks < 27 ? "2nd" : "3rd" },
        { label: "Days since LMP", value: number(daysSinceLmp, 0) },
      ], "Naegele’s rule (LMP + 280 days). Confirm dating with your clinician.");
    }

    case "healthConceptionDate": {
      const daysSinceLmp = Math.max(0, inputs.daysSinceLmp);
      const conceptionDay = 14;
      const windowStart = conceptionDay - 5;
      const windowEnd = conceptionDay + 1;
      return result("Estimated conception", `~Day ${conceptionDay} after LMP`, [
        { label: "Fertile window (approx.)", value: `Days ${windowStart}–${windowEnd} after LMP` },
        { label: "Days since LMP", value: number(daysSinceLmp, 0) },
      ]);
    }

    case "healthOvulation": {
      const cycle = clamp(inputs.cycleLengthDays, 21, 40);
      const lmpDays = Math.max(0, inputs.daysSinceLmp);
      const ovulationDay = cycle - 14;
      const daysToOvulation = ovulationDay - (lmpDays % cycle);
      const fertileStart = ovulationDay - 5;
      const fertileEnd = ovulationDay + 1;
      return result("Next ovulation (approx.)", formatDaysLabel(Math.max(0, daysToOvulation)), [
        { label: "Cycle day of ovulation", value: `Day ${ovulationDay}` },
        { label: "Fertile window (cycle days)", value: `${fertileStart}–${fertileEnd}` },
        { label: "Cycle length", value: `${cycle} days` },
      ]);
    }

    case "healthPeriod": {
      const cycle = clamp(inputs.cycleLengthDays, 21, 40);
      const since = Math.max(0, inputs.daysSinceLastPeriod);
      const daysToNext = cycle - (since % cycle);
      return result("Next period (approx.)", formatDaysLabel(daysToNext), [
        { label: "Cycle length", value: `${cycle} days` },
        { label: "Days since last period", value: number(since, 0) },
      ]);
    }

    case "healthPregnancyWeek": {
      const weeks = Math.max(0, inputs.daysSinceLmp) / 7;
      const trimester = weeks < 13 ? "First" : weeks < 27 ? "Second" : "Third";
      return result("Pregnancy week", `${number(weeks, 1)} weeks`, [
        { label: "Trimester", value: trimester },
        { label: "Days since LMP", value: number(inputs.daysSinceLmp, 0) },
      ]);
    }

    case "healthPregnancyWeightGain": {
      const bmi = bmiFromImperial(inputs.prePregnancyLbs, inputs.heightIn);
      const twins = (inputs.twins ?? 0) >= 0.5;
      const range = pregnancyGainRange(bmi, twins);
      return result("Recommended total gain", `${range.totalMin}–${range.totalMax} lbs`, [
        { label: "Pre-pregnancy BMI", value: number(bmi, 1) },
        { label: "Pregnancy type", value: twins ? "Twins" : "Singleton" },
        { label: "2nd/3rd trimester (approx.)", value: "≈1 lb/week" },
      ], "IOM 2009 guidelines — your OB may personalize the target.");
    }

    case "healthIvfDueDate": {
      const daysSinceTransfer = Math.max(0, inputs.daysSinceTransfer);
      const embryoDay = inputs.embryoDay >= 5 ? 5 : 3;
      const daysToDue = (embryoDay === 5 ? 261 : 263) - daysSinceTransfer;
      return result("Days until due date", formatDaysLabel(Math.max(0, daysToDue)), [
        { label: "Embryo day", value: embryoDay === 5 ? "Day-5 blastocyst" : "Day-3 embryo" },
        { label: "Days since transfer", value: number(daysSinceTransfer, 0) },
      ]);
    }

    case "healthBreastfeedingCalories": {
      const base = mifflinStJeor(
        inputs.sex,
        inputs.ageYears,
        inputs.weightLbs,
        inputs.heightIn
      );
      const activity = clamp(inputs.activityMultiplier, 1.2, 1.55);
      const lactation = inputs.monthsPostpartum <= 6 ? 500 : 400;
      const total = base * activity + lactation;
      return result("Daily calories", `${number(total, 0)} kcal`, [
        { label: "Maintenance (no lactation)", value: `${number(base * activity, 0)} kcal` },
        { label: "Lactation add-on", value: `+${lactation} kcal` },
      ]);
    }

    case "healthWaterIntake": {
      const kg = lbsToKg(inputs.weightLbs);
      let ml = kg * 35;
      ml += Math.max(0, inputs.exerciseMin) * 12;
      if ((inputs.hotClimate ?? 0) >= 0.5) ml *= 1.1;
      const liters = ml / 1000;
      const cups = ml / 236.588;
      return result("Daily water target", `${number(liters, 1)} L`, [
        { label: "Cups (8 oz)", value: number(cups, 0) },
        { label: "Base (35 ml/kg)", value: `${number(kg * 35 / 1000, 1)} L` },
      ]);
    }

    case "healthSleepCycle": {
      const wake = clamp(inputs.wakeTimeMin, 0, 1439);
      const cycles = clamp(inputs.sleepCycles, 3, 6);
      const bedtime = wake - cycles * 90 - 15;
      const altBed = wake - (cycles + 1) * 90 - 15;
      return result("Suggested bedtime", formatClock(bedtime), [
        { label: "Wake time", value: formatClock(wake) },
        { label: "Sleep cycles", value: `${cycles} × 90 min` },
        { label: "Alternate bedtime", value: formatClock(altBed) },
      ], "Includes ~15 min to fall asleep.");
    }

    case "healthCaffeineHalfLife": {
      const mg = Math.max(0, inputs.caffeineMg);
      const hours = Math.max(0, inputs.hoursSince);
      const half = clamp(inputs.halfLifeHours, 3, 8);
      const remaining = mg * Math.pow(0.5, hours / half);
      return result("Caffeine remaining", `${number(remaining, 0)} mg`, [
        { label: "Original dose", value: `${number(mg, 0)} mg` },
        { label: "Hours elapsed", value: number(hours, 1) },
        { label: "Half-life used", value: `${number(half, 1)} hr` },
      ]);
    }

    case "healthBac": {
      const drinks = Math.max(0, inputs.standardDrinks);
      const hours = Math.max(0, inputs.hoursSince);
      const weightLb = Math.max(100, inputs.weightLbs);
      const r = isMale(inputs.sex) ? 0.68 : 0.55;
      const grams = drinks * 14;
      const bac = Math.max(0, grams / (weightLb * r) - 0.015 * hours);
      let status = "Below 0.08% (estimate)";
      if (bac >= 0.08) status = "At/above 0.08% — do not drive";
      return result("Estimated BAC", `${number(bac, 3)}%`, [
        { label: "Standard drinks", value: number(drinks, 1) },
        { label: "Hours since first drink", value: number(hours, 1) },
        { label: "Note", value: status },
      ], "Widmark estimate only — never drink and drive.");
    }

    case "healthIntermittentFasting": {
      const wake = clamp(inputs.wakeTimeMin, 0, 1439);
      const fastHours = clamp(inputs.fastHours, 12, 20);
      const eatHours = 24 - fastHours;
      const eatStart = wake + 60;
      const eatEnd = eatStart + eatHours * 60;
      return result("Eating window", `${formatClock(eatStart)} – ${formatClock(eatEnd)}`, [
        { label: "Fast length", value: `${fastHours} hours` },
        { label: "Feeding window", value: `${eatHours} hours` },
      ]);
    }

    case "healthHydrationActivity": {
      const base = lbsToKg(inputs.weightLbs) * 35;
      const intensity = clamp(inputs.intensity, 1, 3);
      const sweatRate = intensity === 3 ? 24 : intensity === 2 ? 16 : 10;
      const extra = Math.max(0, inputs.exerciseMin) * sweatRate;
      const totalMl = base + extra;
      return result("Fluid target", `${number(totalMl / 1000, 1)} L`, [
        { label: "Exercise add-on", value: `${number(extra / 1000, 1)} L` },
        { label: "During workout", value: `${number((extra * 0.4) / 1000, 1)} L` },
      ]);
    }

    case "healthCaffeineIntake": {
      const coffee = Math.max(0, inputs.coffeeCups) * Math.max(0, inputs.mgPerCoffee);
      const tea = Math.max(0, inputs.teaCups) * Math.max(0, inputs.mgPerTea);
      const energy = Math.max(0, inputs.energyDrinks) * Math.max(0, inputs.mgPerEnergy);
      const total = coffee + tea + energy;
      const limit = 400;
      return result("Total caffeine", `${number(total, 0)} mg`, [
        { label: "Coffee", value: `${number(coffee, 0)} mg` },
        { label: "Tea", value: `${number(tea, 0)} mg` },
        { label: "Energy drinks", value: `${number(energy, 0)} mg` },
        { label: "FDA guidance", value: `~${limit} mg/day (most adults)` },
      ]);
    }

    case "healthSleepDebt": {
      const need = clamp(inputs.sleepNeedHours, 6, 10);
      const slept = clamp(inputs.avgSleepHours, 0, 12);
      const nights = Math.max(1, inputs.nightsTracked);
      const debt = Math.max(0, (need - slept) * nights);
      const recoveryNights = debt > 0 ? Math.ceil(debt / 2) : 0;
      return result("Sleep debt", `${number(debt, 1)} hours`, [
        { label: "Sleep need / night", value: `${number(need, 1)} hr` },
        { label: "Average slept", value: `${number(slept, 1)} hr` },
        { label: "Extra sleep to recover (approx.)", value: `${recoveryNights} nights (+1–2 hr)` },
      ]);
    }

    case "healthGymCostPerWorkout": {
      const monthly =
        inputs.monthlyDues + inputs.annualFee / 12 + inputs.extrasMonthly;
      const perWorkout = monthly / Math.max(1, inputs.workoutsPerMonth);
      return result("Cost per workout", currency(perWorkout), [
        { label: "Monthly all-in", value: currency(monthly) },
        { label: "Workouts / month", value: number(inputs.workoutsPerMonth, 0) },
        { label: "Annual all-in", value: currency(monthly * 12) },
      ]);
    }

    case "healthProteinPowderCost": {
      const perServing = inputs.tubPrice / Math.max(1, inputs.servingsPerTub);
      const per25g =
        inputs.proteinPerServing > 0
          ? (perServing / inputs.proteinPerServing) * 25
          : 0;
      return result("Cost per serving", currency(perServing), [
        { label: "Cost per 25g protein", value: currency(per25g) },
        { label: "Protein per scoop", value: `${number(inputs.proteinPerServing, 0)} g` },
      ]);
    }

    case "healthSupplementCost": {
      const monthly =
        inputs.item1Monthly + inputs.item2Monthly + inputs.item3Monthly;
      const annual = monthly * 12;
      return result("Monthly supplement spend", currency(monthly), [
        { label: "Annual total", value: currency(annual) },
        { label: "Daily average", value: currency(monthly / 30) },
      ]);
    }

    case "healthPtCost": {
      const sessions = inputs.sessionsPerWeek * inputs.weeks;
      const perSession =
        inputs.copay + (inputs.deductibleRemaining / Math.max(1, sessions));
      const total = sessions * perSession;
      return result("Estimated PT total", currency(total), [
        { label: "Sessions", value: number(sessions, 0) },
        { label: "Per session (est.)", value: currency(perSession) },
        { label: "Copay", value: currency(inputs.copay) },
      ]);
    }

    case "healthGlassesVsContacts": {
      const glasses =
        inputs.glassesExam + inputs.glassesFrames + inputs.glassesLenses;
      const contacts =
        inputs.contactsExam +
        inputs.contactsLensesYear +
        inputs.contactsSolutionYear;
      const diff = glasses - contacts;
      const cheaper = diff <= 0 ? "Glasses" : "Contacts";
      return result("Cheaper option (year 1)", cheaper, [
        { label: "Glasses total", value: currency(glasses) },
        { label: "Contacts total", value: currency(contacts) },
        { label: "Difference", value: currency(Math.abs(diff)) },
      ]);
    }

    case "healthHomeVsGym": {
      const gym = inputs.gymMonthly * 12 + inputs.gymInitiation;
      const home =
        inputs.homeEquipment +
        inputs.homeAppMonthly * 12 +
        inputs.homeOtherYearly;
      const diff = gym - home;
      return result("12-month comparison", diff >= 0 ? "Home wins" : "Gym wins", [
        { label: "Gym total", value: currency(gym) },
        { label: "Home total", value: currency(home) },
        { label: "Savings", value: currency(Math.abs(diff)) },
      ]);
    }

    default:
      return null;
  }
}
