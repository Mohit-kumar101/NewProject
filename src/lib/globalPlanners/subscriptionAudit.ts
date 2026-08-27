/**
 * Subscription & Fixed-Cost Audit.
 * Unique: runway extension meter — cancel toggles → +months emergency runway + goal acceleration.
 */

import { clamp, uid } from "./money";

export interface SubItem {
  id: string;
  name: string;
  monthlyCost: number;
  paused: boolean;
}

export interface SubscriptionAuditInputs {
  liquidSavings: number;
  monthlyExpensesExSubs: number;
  monthlyIncome: number;
  goalAmount: number;
  goalMonthsLeft: number;
  subscriptions: SubItem[];
}

export interface SubscriptionAuditResult {
  activeMonthly: number;
  pausedMonthly: number;
  annualIfPaused: number;
  runwayBefore: number;
  runwayAfter: number;
  runwayGainMonths: number;
  goalMonthlyNeededBefore: number;
  goalMonthlyNeededAfter: number;
  insight: string;
}

export function createSub(name: string, monthlyCost: number): SubItem {
  return { id: uid(), name, monthlyCost, paused: false };
}

export function calculateSubscriptionAudit(
  inputs: SubscriptionAuditInputs
): SubscriptionAuditResult {
  const subs = inputs.subscriptions;
  const activeMonthly = subs
    .filter((s) => !s.paused)
    .reduce((a, s) => a + Math.max(0, s.monthlyCost), 0);
  const pausedMonthly = subs
    .filter((s) => s.paused)
    .reduce((a, s) => a + Math.max(0, s.monthlyCost), 0);

  const expensesBase = Math.max(0, inputs.monthlyExpensesExSubs);
  const savings = Math.max(0, inputs.liquidSavings);
  const allSubs = activeMonthly + pausedMonthly;

  const burnBefore = expensesBase + allSubs;
  const burnAfter = expensesBase + activeMonthly;
  const runwayBefore = burnBefore > 0 ? savings / burnBefore : 999;
  const runwayAfter = burnAfter > 0 ? savings / burnAfter : 999;
  const runwayGainMonths = Math.max(0, runwayAfter - runwayBefore);

  const goal = Math.max(0, inputs.goalAmount);
  const monthsLeft = clamp(inputs.goalMonthsLeft, 1, 120);
  const income = Math.max(0, inputs.monthlyIncome);

  const freeBefore = Math.max(0, income - burnBefore);
  const freeAfter = Math.max(0, income - burnAfter);
  const goalMonthlyNeededBefore = goal / monthsLeft;
  const goalMonthlyNeededAfter = goal / monthsLeft;

  const insight =
    pausedMonthly > 0
      ? `Pausing ${Math.round(pausedMonthly).toLocaleString()}/mo adds ~${runwayGainMonths.toFixed(1)} months of emergency runway and frees cash toward your goal.`
      : `Toggle subscriptions to pause — see runway months and goal pace update live.`;

  return {
    activeMonthly: Math.round(activeMonthly),
    pausedMonthly: Math.round(pausedMonthly),
    annualIfPaused: Math.round(pausedMonthly * 12),
    runwayBefore,
    runwayAfter,
    runwayGainMonths,
    goalMonthlyNeededBefore: Math.round(goalMonthlyNeededBefore),
    goalMonthlyNeededAfter: Math.round(goalMonthlyNeededAfter),
    insight: `${insight} Free cash ${Math.round(freeBefore).toLocaleString()} → ${Math.round(freeAfter).toLocaleString()}/mo.`,
  };
}
