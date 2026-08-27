/**
 * Wedding Budget Planner.
 * Unique: deposit milestone cashflow calendar vs savings balance.
 */

import { clamp, uid } from "./money";

export interface WeddingLineItem {
  id: string;
  name: string;
  total: number;
  depositPct: number;
  depositMonth: number;
  finalMonth: number;
}

export interface WeddingBudgetInputs {
  totalBudget: number;
  currentSavings: number;
  monthlySavings: number;
  items: WeddingLineItem[];
}

export interface CashflowMonth {
  month: number;
  outflow: number;
  savingsBalance: number;
  shortfall: number;
  events: string[];
}

export interface WeddingBudgetResult {
  plannedTotal: number;
  overBudget: number;
  perGuestHint: number;
  cashflow: CashflowMonth[];
  crunchMonths: number[];
  insight: string;
}

export function createWeddingItem(
  name: string,
  total: number,
  depositPct: number,
  depositMonth: number,
  finalMonth: number
): WeddingLineItem {
  return {
    id: uid(),
    name,
    total,
    depositPct,
    depositMonth,
    finalMonth,
  };
}

export function calculateWeddingBudget(
  inputs: WeddingBudgetInputs
): WeddingBudgetResult {
  const budget = Math.max(0, inputs.totalBudget);
  const items = inputs.items.filter((i) => i.total > 0);
  const plannedTotal = items.reduce((s, i) => s + i.total, 0);
  const overBudget = Math.max(0, plannedTotal - budget);

  const maxMonth = Math.max(
    12,
    ...items.map((i) => Math.max(i.depositMonth, i.finalMonth)),
    1
  );

  let balance = Math.max(0, inputs.currentSavings);
  const monthlyAdd = Math.max(0, inputs.monthlySavings);
  const cashflow: CashflowMonth[] = [];
  const crunchMonths: number[] = [];

  for (let m = 0; m <= maxMonth; m++) {
    if (m > 0) balance += monthlyAdd;
    const events: string[] = [];
    let outflow = 0;

    for (const item of items) {
      const depPct = clamp(item.depositPct, 0, 100) / 100;
      if (m === item.depositMonth && depPct > 0) {
        const dep = item.total * depPct;
        outflow += dep;
        events.push(`${item.name} deposit`);
      }
      if (m === item.finalMonth) {
        const final = item.total * (1 - depPct);
        outflow += final;
        events.push(`${item.name} final`);
      }
    }

    balance -= outflow;
    const shortfall = balance < 0 ? Math.abs(balance) : 0;
    if (shortfall > 0) crunchMonths.push(m);
    cashflow.push({
      month: m,
      outflow: Math.round(outflow),
      savingsBalance: Math.round(balance),
      shortfall: Math.round(shortfall),
      events,
    });
    if (balance < 0) balance = 0; // tracked shortfall separately
  }

  const insight =
    crunchMonths.length > 0
      ? `Cash crunch in month(s) ${crunchMonths.join(", ")} — raise monthly savings or push deposit dates.`
      : overBudget > 0
        ? `Line items exceed budget by ${Math.round(overBudget).toLocaleString()} — trim before deposits lock in.`
        : `Deposits and finals fit your savings plan across ${maxMonth} months.`;

  return {
    plannedTotal: Math.round(plannedTotal),
    overBudget: Math.round(overBudget),
    perGuestHint: 0,
    cashflow,
    crunchMonths,
    insight,
  };
}
