/**
 * Emergency Fund & Runway Planner.
 * Unique: life-shock simulator (job loss, medical bill, rent hike, partner gone).
 */

import { clamp } from "./money";

export type ShockType =
  | "none"
  | "jobLoss"
  | "medicalBill"
  | "rentHike"
  | "partnerIncomeGone";

export interface EmergencyFundInputs {
  liquidSavings: number;
  monthlyExpenses: number;
  monthlyIncome: number;
  targetMonths: number;
  monthlySavingsCapacity: number;
  shock: ShockType;
  medicalBillAmount: number;
  rentHikePct: number;
  partnerIncomeShare: number;
}

export interface RunwayMonth {
  month: number;
  balance: number;
  expenses: number;
  income: number;
  depleted: boolean;
}

export interface EmergencyFundResult {
  currentMonths: number;
  targetAmount: number;
  gap: number;
  monthsToTarget: number | null;
  postShockMonths: number;
  postShockBalance: number;
  timeline: RunwayMonth[];
  shockLabel: string;
  insight: string;
}

const SHOCK_LABELS: Record<ShockType, string> = {
  none: "No shock",
  jobLoss: "Job loss (−100% income)",
  medicalBill: "One-time medical / emergency bill",
  rentHike: "Rent / housing cost hike",
  partnerIncomeGone: "Partner income gone",
};

export function calculateEmergencyFund(
  inputs: EmergencyFundInputs
): EmergencyFundResult {
  const expenses = Math.max(1, inputs.monthlyExpenses);
  const savings = Math.max(0, inputs.liquidSavings);
  const income = Math.max(0, inputs.monthlyIncome);
  const targetMonths = clamp(inputs.targetMonths, 1, 24);
  const capacity = Math.max(0, inputs.monthlySavingsCapacity);

  const currentMonths = savings / expenses;
  const targetAmount = expenses * targetMonths;
  const gap = Math.max(0, targetAmount - savings);

  let shockBalance = savings;
  let shockExpenses = expenses;
  let shockIncome = income;
  let shockLabel = SHOCK_LABELS[inputs.shock];

  switch (inputs.shock) {
    case "jobLoss":
      shockIncome = 0;
      break;
    case "medicalBill":
      shockBalance = Math.max(0, savings - Math.max(0, inputs.medicalBillAmount));
      break;
    case "rentHike": {
      const hike = clamp(inputs.rentHikePct, 0, 100) / 100;
      shockExpenses = expenses * (1 + hike * 0.4); // rent ~40% of expenses assumption
      break;
    }
    case "partnerIncomeGone": {
      const share = clamp(inputs.partnerIncomeShare, 0, 100) / 100;
      shockIncome = income * (1 - share);
      break;
    }
    default:
      break;
  }

  const postShockMonths = shockExpenses > 0 ? shockBalance / shockExpenses : Infinity;
  const monthlyBurn = Math.max(0, shockExpenses - shockIncome);

  const timeline: RunwayMonth[] = [];
  let bal = shockBalance;
  for (let m = 0; m <= 24; m++) {
    timeline.push({
      month: m,
      balance: Math.round(bal),
      expenses: Math.round(shockExpenses),
      income: Math.round(shockIncome),
      depleted: bal <= 0,
    });
    if (bal <= 0) break;
    bal = bal - monthlyBurn;
    if (inputs.shock === "none" && capacity > 0) {
      bal += capacity;
    }
  }

  let monthsToTarget: number | null = null;
  if (gap <= 0) monthsToTarget = 0;
  else if (capacity > 0) monthsToTarget = Math.ceil(gap / capacity);

  const insight =
    inputs.shock === "none"
      ? `You have ~${currentMonths.toFixed(1)} months of expenses. Target ${targetMonths} months needs ${Math.round(targetAmount).toLocaleString()}.`
      : `After “${shockLabel}”, runway drops to ~${Number.isFinite(postShockMonths) ? postShockMonths.toFixed(1) : "∞"} months (${Math.round(shockBalance).toLocaleString()} left).`;

  return {
    currentMonths,
    targetAmount,
    gap,
    monthsToTarget,
    postShockMonths: Number.isFinite(postShockMonths) ? postShockMonths : 999,
    postShockBalance: shockBalance,
    timeline,
    shockLabel,
    insight,
  };
}

export { SHOCK_LABELS };
