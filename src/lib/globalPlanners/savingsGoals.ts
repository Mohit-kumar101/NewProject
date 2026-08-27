/**
 * Multi-goal Savings Timeline Planner.
 * Unique: sequential vs split funding optimizer — picks fastest path to hit all goals.
 */

import { clamp, uid } from "./money";

export interface SavingsGoal {
  id: string;
  name: string;
  amount: number;
  monthsDeadline: number;
  priority: number;
}

export interface SavingsGoalsInputs {
  monthlyBudget: number;
  currentSaved: number;
  goals: SavingsGoal[];
}

export interface GoalPlanRow {
  goalId: string;
  name: string;
  mode: "sequential" | "split";
  monthsToComplete: number;
  monthlyAllocation: number;
  onTime: boolean;
}

export interface SavingsGoalsResult {
  sequential: GoalPlanRow[];
  split: GoalPlanRow[];
  recommended: "sequential" | "split";
  sequentialAllDoneMonth: number;
  splitAllDoneMonth: number;
  insight: string;
}

export function createGoal(
  name: string,
  amount: number,
  monthsDeadline: number,
  priority: number
): SavingsGoal {
  return { id: uid(), name, amount, monthsDeadline, priority };
}

export function calculateSavingsGoals(
  inputs: SavingsGoalsInputs
): SavingsGoalsResult {
  const budget = Math.max(0, inputs.monthlyBudget);
  const goals = [...inputs.goals]
    .filter((g) => g.amount > 0)
    .sort((a, b) => a.priority - b.priority || a.monthsDeadline - b.monthsDeadline);

  if (goals.length === 0 || budget <= 0) {
    return {
      sequential: [],
      split: [],
      recommended: "sequential",
      sequentialAllDoneMonth: 0,
      splitAllDoneMonth: 0,
      insight: "Add goals and a monthly savings budget to compare plans.",
    };
  }

  // Sequential: fund highest priority fully, then next
  let monthCursor = 0;
  let pool = Math.max(0, inputs.currentSaved);
  const sequential: GoalPlanRow[] = [];
  for (const g of goals) {
    let remaining = Math.max(0, g.amount - (sequential.length === 0 ? Math.min(pool, g.amount) : 0));
    if (sequential.length === 0) {
      remaining = Math.max(0, g.amount - Math.min(pool, g.amount));
      pool = Math.max(0, pool - g.amount);
    }
    const monthsNeeded = remaining <= 0 ? 0 : Math.ceil(remaining / budget);
    const doneAt = monthCursor + monthsNeeded;
    sequential.push({
      goalId: g.id,
      name: g.name,
      mode: "sequential",
      monthsToComplete: doneAt,
      monthlyAllocation: remaining <= 0 ? 0 : budget,
      onTime: doneAt <= g.monthsDeadline,
    });
    monthCursor = doneAt;
  }

  // Split: allocate budget by urgency weight (higher priority + tighter deadline)
  const weights = goals.map((g) => {
    const urgency = 1 / Math.max(1, g.monthsDeadline);
    const pri = 1 / Math.max(1, g.priority);
    return urgency * 2 + pri;
  });
  const weightSum = weights.reduce((a, b) => a + b, 0) || 1;
  const split: GoalPlanRow[] = goals.map((g, i) => {
    const share = (weights[i] / weightSum) * budget;
    const monthsNeeded = share > 0 ? Math.ceil(g.amount / share) : 999;
    return {
      goalId: g.id,
      name: g.name,
      mode: "split" as const,
      monthsToComplete: monthsNeeded,
      monthlyAllocation: Math.round(share),
      onTime: monthsNeeded <= g.monthsDeadline,
    };
  });

  const sequentialAllDoneMonth = sequential.reduce(
    (m, r) => Math.max(m, r.monthsToComplete),
    0
  );
  const splitAllDoneMonth = split.reduce(
    (m, r) => Math.max(m, r.monthsToComplete),
    0
  );

  const seqOnTime = sequential.every((r) => r.onTime);
  const splitOnTime = split.every((r) => r.onTime);

  let recommended: "sequential" | "split" = "sequential";
  if (splitOnTime && !seqOnTime) recommended = "split";
  else if (seqOnTime && !splitOnTime) recommended = "sequential";
  else if (splitAllDoneMonth < sequentialAllDoneMonth) recommended = "split";
  else recommended = "sequential";

  const insight =
    recommended === "sequential"
      ? `Sequential funding finishes all goals by month ${sequentialAllDoneMonth} — best when priorities differ a lot.`
      : `Split funding finishes all goals by month ${splitAllDoneMonth} — better when several deadlines are tight.`;

  return {
    sequential,
    split,
    recommended,
    sequentialAllDoneMonth,
    splitAllDoneMonth,
    insight,
  };
}
