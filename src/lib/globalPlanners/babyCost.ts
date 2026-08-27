/**
 * Baby First-Year Cost Planner.
 * Unique: parental leave income bridge → return to work → childcare start timeline.
 */

import { clamp } from "./money";

export interface BabyCostInputs {
  oneTimeCosts: number;
  monthlyRecurring: number;
  childcareMonthly: number;
  childcareStartMonth: number;
  normalMonthlyIncome: number;
  leaveMonths: number;
  leaveIncomePct: number;
  partnerIncomeMonthly: number;
  currentSavings: number;
}

export interface BabyMonthRow {
  month: number;
  phase: "leave" | "return" | "childcare";
  income: number;
  costs: number;
  net: number;
  cumulative: number;
}

export interface BabyCostResult {
  firstYearTotal: number;
  worstMonth: number;
  worstMonthNet: number;
  months: BabyMonthRow[];
  insight: string;
}

export function calculateBabyCost(inputs: BabyCostInputs): BabyCostResult {
  const leaveMonths = clamp(Math.round(inputs.leaveMonths), 0, 12);
  const leavePct = clamp(inputs.leaveIncomePct, 0, 100) / 100;
  const childcareStart = clamp(Math.round(inputs.childcareStartMonth), 0, 12);
  const oneTime = Math.max(0, inputs.oneTimeCosts);
  const recurring = Math.max(0, inputs.monthlyRecurring);
  const childcare = Math.max(0, inputs.childcareMonthly);
  const normal = Math.max(0, inputs.normalMonthlyIncome);
  const partner = Math.max(0, inputs.partnerIncomeMonthly);

  const months: BabyMonthRow[] = [];
  let cumulative = Math.max(0, inputs.currentSavings) - oneTime;
  let worstMonth = 0;
  let worstNet = Infinity;
  let yearCost = oneTime;

  for (let m = 1; m <= 12; m++) {
    const onLeave = m <= leaveMonths;
    const income =
      (onLeave ? normal * leavePct : normal) + partner;
    const care = m >= childcareStart ? childcare : 0;
    const costs = recurring + care;
    yearCost += costs;
    const net = income - costs;
    cumulative += net;
    if (net < worstNet) {
      worstNet = net;
      worstMonth = m;
    }
    months.push({
      month: m,
      phase: onLeave ? "leave" : m >= childcareStart ? "childcare" : "return",
      income: Math.round(income),
      costs: Math.round(costs),
      net: Math.round(net),
      cumulative: Math.round(cumulative),
    });
  }

  const insight = `First-year cash outlay ~${Math.round(yearCost).toLocaleString()}. Tightest month is month ${worstMonth} (net ${Math.round(worstNet).toLocaleString()}) during the leave→childcare bridge.`;

  return {
    firstYearTotal: Math.round(yearCost),
    worstMonth,
    worstMonthNet: Math.round(worstNet),
    months,
    insight,
  };
}
