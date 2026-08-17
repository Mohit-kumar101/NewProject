/**
 * Affordability Engine — shared math for the “Can I Afford…?” pSEO matrix.
 * Wired from `data/affordability.config.json` presets via formulaType → mode.
 */

import type { CalcResult } from "./types";

export type AffordabilityMode =
  | "vehicle"
  | "housing"
  | "rent"
  | "purchase"
  | "lifestyle"
  | "debt"
  | "wealth"
  | "master";

export type AffordabilityRuleSet =
  | "auto-20-4-10"
  | "housing-28-36"
  | "rent-30"
  | "fifty-30-20"
  | "cash-cushion"
  | "debt-payoff"
  | "custom";

type Inputs = Record<string, number>;

const currency = (n: number, digits = 0): string => {
  if (!Number.isFinite(n)) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(n);
};

const pct = (n: number, digits = 1): string => {
  if (!Number.isFinite(n)) return "—";
  return `${n.toFixed(digits)}%`;
};

const monthsLabel = (months: number): string => {
  if (!Number.isFinite(months) || months < 0) return "—";
  if (!Number.isFinite(months) || months === Infinity) return "Never (payment too low)";
  const m = Math.ceil(months);
  const y = Math.floor(m / 12);
  const rem = m % 12;
  if (y === 0) return `${m} mo`;
  if (rem === 0) return `${y} yr`;
  return `${y} yr ${rem} mo`;
};

function result(
  primaryLabel: string,
  primaryValue: string,
  secondary: CalcResult["secondary"],
  extras?: Pick<CalcResult, "featured" | "insight">
): CalcResult {
  return {
    primary: { label: primaryLabel, value: primaryValue, highlight: true },
    secondary,
    ...extras,
  };
}

/** Standard amortizing loan payment (monthly). */
export function pmt(
  principal: number,
  annualRate: number,
  termMonths: number
): number {
  if (termMonths <= 0 || principal <= 0) return 0;
  const r = annualRate / 100 / 12;
  if (Math.abs(r) < 1e-12) return principal / termMonths;
  return (principal * r) / (1 - Math.pow(1 + r, -termMonths));
}

function num(inputs: Inputs, key: string, fallback = 0): number {
  const v = inputs[key];
  return Number.isFinite(v) ? v : fallback;
}

function verdictFromRatio(
  ratio: number,
  softCap: number,
  hardCap: number
): { label: string; insight: string } {
  if (ratio <= softCap) {
    return {
      label: "Likely affordable",
      insight: `At ${pct(ratio * 100)} of the guideline budget, this looks comfortable for most households.`,
    };
  }
  if (ratio <= hardCap) {
    return {
      label: "Stretch — proceed carefully",
      insight: `You're using ${pct(ratio * 100)} of the rule-of-thumb budget. Trim other debt or raise the down payment before committing.`,
    };
  }
  return {
    label: "Likely unaffordable",
    insight: `This sits at ${pct(ratio * 100)} of the guideline budget. Lower the target, extend savings time, or grow income first.`,
  };
}

/** 20/4/10: 20% down, ≤4-year loan, transport ≤10% of gross income. */
function vehicleAffordability(inputs: Inputs): CalcResult {
  const targetPrice = Math.max(0, num(inputs, "targetPrice"));
  const annualIncome = Math.max(0, num(inputs, "annualIncome"));
  const downPct = Math.min(100, Math.max(0, num(inputs, "downPaymentPercent", 20)));
  const termMonths = Math.max(1, Math.round(num(inputs, "loanTermMonths", 48)));
  const annualRate = Math.max(0, num(inputs, "annualRate", 6.5));
  const otherDebt = Math.max(0, num(inputs, "monthlyDebts"));

  const downPayment = (targetPrice * downPct) / 100;
  const loan = Math.max(0, targetPrice - downPayment);
  const payment = pmt(loan, annualRate, termMonths);
  const grossMonthly = annualIncome / 12;
  const transportCap = grossMonthly * 0.1;
  const used = transportCap > 0 ? payment / transportCap : Infinity;
  const { label, insight } = verdictFromRatio(used, 0.85, 1.05);

  return result(label, currency(payment, 2), [
    { label: "Est. Monthly Car Payment", value: currency(payment, 2) },
    { label: "Down Payment (20/4/10)", value: currency(downPayment) },
    { label: "Loan Amount", value: currency(loan) },
    { label: "10% Income Transport Cap", value: currency(transportCap, 2) },
    { label: "Payment vs Cap", value: pct(used * 100) },
    { label: "Other Monthly Debts", value: currency(otherDebt, 2) },
    { label: "Gross Monthly Income", value: currency(grossMonthly, 2) },
  ], {
    featured: [
      { label: "Target Price", value: currency(targetPrice) },
      { label: "Max Comfortable Payment", value: currency(transportCap, 2) },
    ],
    insight: `${insight} Classic 20/4/10: ${downPct}% down, ${termMonths}-month term (aim ≤48), transport ≤10% of gross.`,
  });
}

/** 28/36 DTI: housing ≤28% gross, total debt ≤36%. */
function housingAffordability(inputs: Inputs): CalcResult {
  const targetPrice = Math.max(0, num(inputs, "targetPrice"));
  const annualIncome = Math.max(0, num(inputs, "annualIncome"));
  const downPct = Math.min(100, Math.max(0, num(inputs, "downPaymentPercent", 20)));
  const termYears = Math.max(1, num(inputs, "loanTermYears", 30));
  const termMonths = Math.round(termYears * 12);
  const annualRate = Math.max(0, num(inputs, "annualRate", 6.75));
  const monthlyDebts = Math.max(0, num(inputs, "monthlyDebts"));
  const taxesInsurance = Math.max(0, num(inputs, "monthlyTaxesInsurance", 0));

  const downPayment = (targetPrice * downPct) / 100;
  const loan = Math.max(0, targetPrice - downPayment);
  const pi = pmt(loan, annualRate, termMonths);
  const housingPayment = pi + taxesInsurance;
  const grossMonthly = annualIncome / 12;
  const housingCap = grossMonthly * 0.28;
  const totalDebtCap = grossMonthly * 0.36;
  const housingRatio = housingCap > 0 ? housingPayment / housingCap : Infinity;
  const dti = totalDebtCap > 0 ? (housingPayment + monthlyDebts) / totalDebtCap : Infinity;
  const worst = Math.max(housingRatio, dti);
  const { label, insight } = verdictFromRatio(worst, 0.9, 1.05);

  return result(label, currency(housingPayment, 2), [
    { label: "Monthly P&I", value: currency(pi, 2) },
    { label: "PITI (w/ taxes & insurance)", value: currency(housingPayment, 2) },
    { label: "28% Housing Cap", value: currency(housingCap, 2) },
    { label: "36% Total Debt Cap", value: currency(totalDebtCap, 2) },
    { label: "Housing Ratio vs Cap", value: pct(housingRatio * 100) },
    { label: "Total DTI vs Cap", value: pct(dti * 100) },
    { label: "Down Payment", value: currency(downPayment) },
  ], {
    featured: [
      { label: "Target Home Price", value: currency(targetPrice) },
      { label: "Max Housing Budget", value: currency(housingCap, 2) },
    ],
    insight: `${insight} 28/36 rule: keep housing near 28% of gross and all debts under 36%.`,
  });
}

/** Rent: classic ≤30% of gross (with 28% “strict” callout). */
function rentAffordability(inputs: Inputs): CalcResult {
  const monthlyRent = Math.max(0, num(inputs, "monthlyRent", num(inputs, "targetPrice")));
  const annualIncome = Math.max(0, num(inputs, "annualIncome"));
  const monthlyDebts = Math.max(0, num(inputs, "monthlyDebts"));
  const utilities = Math.max(0, num(inputs, "monthlyUtilities"));

  const grossMonthly = annualIncome / 12;
  const allInRent = monthlyRent + utilities;
  const softCap = grossMonthly * 0.3;
  const strictCap = grossMonthly * 0.28;
  const used = softCap > 0 ? allInRent / softCap : Infinity;
  const leftover = grossMonthly - allInRent - monthlyDebts;
  const { label, insight } = verdictFromRatio(used, 0.9, 1.05);

  return result(label, currency(allInRent, 2), [
    { label: "Base Rent", value: currency(monthlyRent, 2) },
    { label: "Rent + Utilities", value: currency(allInRent, 2) },
    { label: "30% Income Cap", value: currency(softCap, 2) },
    { label: "28% Strict Cap", value: currency(strictCap, 2) },
    { label: "Rent vs 30% Cap", value: pct(used * 100) },
    { label: "Left After Rent & Debts", value: currency(leftover, 2) },
  ], {
    featured: [
      { label: "Recommended Max Rent", value: currency(softCap, 2) },
    ],
    insight: `${insight} Aim for rent (or rent + utilities) at or below 30% of gross income.`,
  });
}

/** One-time purchase / life event: cash cushion + 50/30/20 wants. */
function purchaseAffordability(inputs: Inputs): CalcResult {
  const targetPrice = Math.max(0, num(inputs, "targetPrice"));
  const annualIncome = Math.max(0, num(inputs, "annualIncome"));
  const cashOnHand = Math.max(0, num(inputs, "cashOnHand"));
  const monthlyExpenses = Math.max(0, num(inputs, "monthlyExpenses", annualIncome / 12 * 0.5));
  const monthlySavings = Math.max(0, num(inputs, "monthlySavings", 500));

  const grossMonthly = annualIncome / 12;
  const wantsBudget = grossMonthly * 0.3;
  const emergencyTarget = monthlyExpenses * 3;
  const cashAfterPurchase = cashOnHand - targetPrice;
  const cushionOk = cashAfterPurchase >= emergencyTarget;
  const monthsToSave =
    monthlySavings > 0 && targetPrice > cashOnHand
      ? (targetPrice - cashOnHand) / monthlySavings
      : targetPrice <= cashOnHand
        ? 0
        : Infinity;

  const fundedNow = cashOnHand >= targetPrice;
  let label: string;
  let insight: string;
  if (fundedNow && cushionOk) {
    label = "Likely affordable (cash)";
    insight =
      "You can pay cash and still keep a ~3-month expense cushion — a strong 50/30/20 outcome.";
  } else if (fundedNow && !cushionOk) {
    label = "Stretch — protect your cushion";
    insight =
      "Cash covers the purchase, but your emergency fund would fall below 3 months of expenses.";
  } else if (monthsToSave <= 12 && monthlySavings <= wantsBudget) {
    label = "Affordable with a savings plan";
    insight = `Save about ${currency(monthlySavings, 0)}/mo (~${pct((monthlySavings / Math.max(grossMonthly, 1)) * 100)} of income) for ${monthsLabel(monthsToSave)}.`;
  } else {
    label = "Not yet — keep saving";
    insight =
      "The target exceeds a healthy wants allocation or would wipe your cushion. Lower the goal or extend the timeline.";
  }

  return result(label, currency(targetPrice), [
    { label: "Cash on Hand", value: currency(cashOnHand) },
    { label: "Cash After Purchase", value: currency(cashAfterPurchase) },
    { label: "3-Month Expense Cushion", value: currency(emergencyTarget) },
    { label: "30% Wants Budget / Mo", value: currency(wantsBudget, 2) },
    { label: "Months to Save Gap", value: monthsLabel(monthsToSave) },
    { label: "Planned Monthly Savings", value: currency(monthlySavings, 2) },
  ], {
    featured: [
      { label: "Target Cost", value: currency(targetPrice) },
    ],
    insight,
  });
}

/** Recurring lifestyle spend vs 50/30/20 wants bucket. */
function lifestyleAffordability(inputs: Inputs): CalcResult {
  const monthlyCost = Math.max(0, num(inputs, "monthlyCost", num(inputs, "targetPrice")));
  const annualIncome = Math.max(0, num(inputs, "annualIncome"));
  const otherWants = Math.max(0, num(inputs, "otherMonthlyWants"));

  const grossMonthly = annualIncome / 12;
  const wantsCap = grossMonthly * 0.3;
  const used = wantsCap > 0 ? (monthlyCost + otherWants) / wantsCap : Infinity;
  const annualCost = monthlyCost * 12;
  const { label, insight } = verdictFromRatio(used, 0.85, 1.0);

  return result(label, currency(monthlyCost, 2), [
    { label: "This Habit / Mo", value: currency(monthlyCost, 2) },
    { label: "Other Wants / Mo", value: currency(otherWants, 2) },
    { label: "30% Wants Cap", value: currency(wantsCap, 2) },
    { label: "Wants Used", value: pct(used * 100) },
    { label: "Annual Cost of Habit", value: currency(annualCost) },
  ], {
    featured: [
      { label: "Remaining Wants Room", value: currency(Math.max(0, wantsCap - monthlyCost - otherWants), 2) },
    ],
    insight: `${insight} 50/30/20: needs / wants / savings — keep discretionary adds inside the 30% wants slice.`,
  });
}

/** Debt payoff / loan affordability. */
function debtAffordability(inputs: Inputs): CalcResult {
  const balance = Math.max(0, num(inputs, "targetPrice", num(inputs, "principal")));
  const annualRate = Math.max(0, num(inputs, "annualRate", 18));
  const monthlyPayment = Math.max(0, num(inputs, "monthlyPayment", num(inputs, "monthlyCost")));
  const annualIncome = Math.max(0, num(inputs, "annualIncome"));

  const grossMonthly = annualIncome / 12;
  const paymentShare = grossMonthly > 0 ? monthlyPayment / grossMonthly : Infinity;

  let months = 0;
  let interest = 0;
  let remaining = balance;
  const r = annualRate / 100 / 12;
  if (monthlyPayment <= 0) {
    months = Infinity;
  } else {
    while (remaining > 0.01 && months < 1200) {
      const interestPortion = remaining * r;
      interest += interestPortion;
      remaining += interestPortion;
      const pay = Math.min(monthlyPayment, remaining);
      if (pay <= interestPortion && remaining > monthlyPayment) {
        months = Infinity;
        break;
      }
      remaining -= pay;
      months += 1;
    }
  }

  const okPayment = paymentShare <= 0.15;
  const label =
    months === Infinity
      ? "Payment too low"
      : okPayment
        ? "Payoff plan looks workable"
        : "Heavy payment burden";

  return result(label, monthsLabel(months), [
    { label: "Balance", value: currency(balance) },
    { label: "Monthly Payment", value: currency(monthlyPayment, 2) },
    { label: "Total Interest", value: currency(interest) },
    { label: "Payment % of Gross", value: pct(paymentShare * 100) },
    { label: "APR", value: pct(annualRate) },
  ], {
    insight:
      months === Infinity
        ? "Increase the payment above monthly interest or refinance to a lower APR."
        : `At this payment you clear the balance in ${monthsLabel(months)}. Keep debt service well under ~15% of gross when stacking other obligations.`,
  });
}

/** Savings / invest rate check. */
function wealthAffordability(inputs: Inputs): CalcResult {
  const monthlySavings = Math.max(0, num(inputs, "monthlySavings", num(inputs, "monthlyCost", 500)));
  const annualIncome = Math.max(0, num(inputs, "annualIncome"));
  const grossMonthly = annualIncome / 12;
  const saveRate = grossMonthly > 0 ? monthlySavings / grossMonthly : 0;
  const annualSave = monthlySavings * 12;

  let label: string;
  if (saveRate >= 0.2) label = "Strong savings rate";
  else if (saveRate >= 0.1) label = "Solid — room to grow";
  else label = "Below 10% — tighten wants";

  return result(label, pct(saveRate * 100), [
    { label: "Monthly Savings / Invest", value: currency(monthlySavings, 2) },
    { label: "Annual Savings", value: currency(annualSave) },
    { label: "50/30/20 Savings Target (20%)", value: currency(grossMonthly * 0.2, 2) },
    { label: "Gross Monthly Income", value: currency(grossMonthly, 2) },
  ], {
    insight:
      "50/30/20 suggests ~20% of take-home toward savings and debt acceleration. Automate transfers on payday.",
  });
}

/** Master “Can I Afford This?” — custom target vs income rules. */
function masterAffordability(inputs: Inputs): CalcResult {
  const targetPrice = Math.max(0, num(inputs, "targetPrice"));
  const isRecurring = num(inputs, "isRecurring") >= 0.5;
  if (isRecurring) {
    return lifestyleAffordability({
      ...inputs,
      monthlyCost: targetPrice,
    });
  }
  return purchaseAffordability(inputs);
}

export const AFFORDABILITY_FORMULA_TYPES = [
  "affordabilityVehicle",
  "affordabilityHousing",
  "affordabilityRent",
  "affordabilityPurchase",
  "affordabilityLifestyle",
  "affordabilityDebt",
  "affordabilityWealth",
  "affordabilityMaster",
] as const;

export type AffordabilityFormulaType =
  (typeof AFFORDABILITY_FORMULA_TYPES)[number];

export function modeFromFormulaType(
  formulaType: string
): AffordabilityMode | null {
  switch (formulaType) {
    case "affordabilityVehicle":
      return "vehicle";
    case "affordabilityHousing":
      return "housing";
    case "affordabilityRent":
      return "rent";
    case "affordabilityPurchase":
      return "purchase";
    case "affordabilityLifestyle":
      return "lifestyle";
    case "affordabilityDebt":
      return "debt";
    case "affordabilityWealth":
      return "wealth";
    case "affordabilityMaster":
      return "master";
    default:
      return null;
  }
}

export function formulaTypeFromMode(mode: AffordabilityMode): AffordabilityFormulaType {
  switch (mode) {
    case "vehicle":
      return "affordabilityVehicle";
    case "housing":
      return "affordabilityHousing";
    case "rent":
      return "affordabilityRent";
    case "purchase":
      return "affordabilityPurchase";
    case "lifestyle":
      return "affordabilityLifestyle";
    case "debt":
      return "affordabilityDebt";
    case "wealth":
      return "affordabilityWealth";
    case "master":
      return "affordabilityMaster";
  }
}

export function runAffordabilityCalculation(
  modeOrFormula: AffordabilityMode | string,
  inputs: Inputs
): CalcResult {
  const mode =
    modeFromFormulaType(modeOrFormula) ??
    (modeOrFormula as AffordabilityMode);

  switch (mode) {
    case "vehicle":
      return vehicleAffordability(inputs);
    case "housing":
      return housingAffordability(inputs);
    case "rent":
      return rentAffordability(inputs);
    case "purchase":
      return purchaseAffordability(inputs);
    case "lifestyle":
      return lifestyleAffordability(inputs);
    case "debt":
      return debtAffordability(inputs);
    case "wealth":
      return wealthAffordability(inputs);
    case "master":
      return masterAffordability(inputs);
    default:
      return result("Result", "—", [
        { label: "Status", value: "Unknown affordability mode" },
      ]);
  }
}

export type RuleExplainer = {
  id: AffordabilityRuleSet;
  title: string;
  summary: string;
  bullets: string[];
};

export function getRuleExplainer(ruleSet: AffordabilityRuleSet): RuleExplainer {
  switch (ruleSet) {
    case "auto-20-4-10":
      return {
        id: ruleSet,
        title: "The 20/4/10 Auto Rule",
        summary:
          "A simple stress test before you sign a car contract: put 20% down, keep the loan to 4 years or less, and spend no more than 10% of gross income on transportation.",
        bullets: [
          "20% down payment reduces interest and avoids being upside-down early.",
          "4-year (48-month) max term keeps total interest in check.",
          "10% of gross monthly income caps payment + typical transport costs.",
        ],
      };
    case "housing-28-36":
      return {
        id: ruleSet,
        title: "The 28/36 Housing DTI Rule",
        summary:
          "Lenders and planners often use debt-to-income (DTI) caps: housing costs near 28% of gross income, and all debts under 36%.",
        bullets: [
          "28% front-end: principal, interest, taxes, and insurance (PITI).",
          "36% back-end: PITI plus car loans, cards, student debt, etc.",
          "Staying under both leaves room for savings and surprises.",
        ],
      };
    case "rent-30":
      return {
        id: ruleSet,
        title: "The 30% Rent Guideline",
        summary:
          "A widely cited benchmark: keep rent (or rent + utilities) at or below 30% of gross monthly income.",
        bullets: [
          "Use 28% if you want a stricter housing-only buffer.",
          "High-cost cities may force trade-offs — track the leftover, not just the %.",
          "Roommate splits and parking fees count toward the all-in rent number.",
        ],
      };
    case "fifty-30-20":
      return {
        id: ruleSet,
        title: "The 50/30/20 Budget Rule",
        summary:
          "Split after-tax (or gross planning) dollars into ~50% needs, 30% wants, and 20% savings/debt payoff.",
        bullets: [
          "Needs: housing, utilities, groceries, minimum debt payments, insurance.",
          "Wants: dining out, gyms, subscriptions, upgrades, travel.",
          "Savings: emergency fund, investing, extra principal payments.",
        ],
      };
    case "cash-cushion":
      return {
        id: ruleSet,
        title: "Cash Cushion Check",
        summary:
          "Before a big one-time purchase, confirm you can pay without dropping below 3 months of essential expenses in cash.",
        bullets: [
          "3 months of expenses is a common starter emergency fund.",
          "6 months is stronger if income is variable or household size is larger.",
          "Financing a lifestyle purchase often fails the cushion test.",
        ],
      };
    case "debt-payoff":
      return {
        id: ruleSet,
        title: "Debt Payoff Reality Check",
        summary:
          "A workable plan clears the balance in a finite time while keeping the payment a manageable share of income.",
        bullets: [
          "Payment must exceed monthly interest or the balance never shrinks.",
          "Avalanche (highest APR first) usually minimizes interest.",
          "Keep total debt service comfortable alongside housing and savings.",
        ],
      };
    case "custom":
    default:
      return {
        id: "custom",
        title: "Custom Affordability Check",
        summary:
          "Enter any target price or monthly cost with your income to see cash-cushion and 50/30/20 wants guidance instantly.",
        bullets: [
          "Toggle recurring vs one-time to switch lifestyle vs purchase math.",
          "Pre-filled examples elsewhere on CalculioHub use the same engine.",
          "Treat results as planning estimates — not loan offers.",
        ],
      };
  }
}
