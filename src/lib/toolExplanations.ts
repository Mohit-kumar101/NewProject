import explanationsData from "../../data/tool-explanations.json";
import type { Calculator, ToolExplanationContent } from "./types";

const explanations = explanationsData as Record<string, ToolExplanationContent>;

const FALLBACK: ToolExplanationContent = {
  formula: "Result = f(inputs)",
  summary:
    "This tool maps your inputs through a domain-specific model and updates results live in your browser—nothing is uploaded.",
  variables: [
    {
      symbol: "inputs",
      name: "Your inputs",
      description: "Values you adjust in the workspace. Change any field to recalculate instantly.",
    },
  ],
  notes: ["Estimates are for planning guidance only—not professional advice."],
};

/** Plain-English definitions for common input ids / label keywords. */
const TERM_BY_ID: Record<string, string> = {
  principal:
    "The amount you borrowed (or still owe). Interest is charged on this balance.",
  balance:
    "What you currently owe. Paying it down reduces future interest.",
  annualRate:
    "APR — the yearly interest rate. We convert it to a monthly rate (APR ÷ 12) inside the math.",
  currentRate:
    "The interest rate on your existing loan before any refinance.",
  newRate: "The interest rate offered on the new/refinanced loan.",
  termMonths:
    "How many months the loan is scheduled to run. Longer terms usually mean smaller payments but more total interest.",
  termYears:
    "Loan length in years (we convert to months for the schedule).",
  currentTerm: "Months left on your current loan if you keep it as-is.",
  newTerm: "Length of the new loan after refinancing.",
  extraPayment:
    "Optional dollars paid above the required payment. This hits principal early and shortens payoff.",
  extraMonthly:
    "Extra money added to a normal monthly payment (useful to compare against bi-weekly).",
  minPaymentPercent:
    "Credit-card style minimum as a percent of the balance (e.g. 2%).",
  minPaymentFloor:
    "The smallest dollar minimum your card allows (e.g. $25), even if the percent would be lower.",
  fixedPayment:
    "A payment amount you choose to pay every month instead of only the minimum.",
  fees: "Upfront costs (origination, closing, refinance fees) added to total cost.",
  homeValue: "What your home is worth today — used to estimate equity.",
  mortgageBalance: "What you still owe on the primary mortgage.",
  ltvLimit:
    "Loan-to-value cap (e.g. 80%). Lenders usually won’t let total loans exceed this share of home value.",
  loanAmount: "How much you want to borrow against your equity.",
  amortYears:
    "The “fake” full amortization period used to set the payment (balloon loans often amortize like 30 years).",
  balloonYears:
    "When the large lump-sum (balloon) balance is due, even if amortization is longer.",
  downPayment: "Cash paid upfront; reduces the amount financed.",
  homePrice: "Purchase price of the home.",
  monthlyBudget: "Total cash you can put toward debts each month.",
  debt1: "First debt balance in the plan.",
  debt2: "Second debt balance in the plan.",
  annualPropertyTax:
    "Estimated yearly property tax — divided by 12 for the monthly escrow line in PITI.",
  homeownersInsurance:
    "Estimated annual homeowners insurance premium — divided by 12 for PITI.",
  pitiEnabled: "When on, adds tax and insurance to the monthly payment total.",
  avgRate: "Approximate average APR across the debts you’re modeling.",
  rate1: "APR on the first debt.",
  rate2: "APR on the second debt.",
  rate3: "APR on the third debt.",
};

const TERM_BY_LABEL_HINT: { test: RegExp; description: string }[] = [
  {
    test: /\bapr\b|interest rate|annual rate/i,
    description:
      "Yearly interest rate. Monthly interest ≈ balance × (APR ÷ 12 ÷ 100).",
  },
  {
    test: /principal|loan amount|balance/i,
    description: "Starting amount owed before this period’s payments.",
  },
  {
    test: /term|months|years/i,
    description: "Length of the repayment schedule.",
  },
  {
    test: /extra|additional/i,
    description: "Optional amount above the required payment to speed payoff.",
  },
  {
    test: /fee|cost/i,
    description: "One-time or recurring costs that affect total money paid.",
  },
  {
    test: /payment/i,
    description: "Cash you send each period toward interest and principal.",
  },
  {
    test: /ltv|loan.to.value/i,
    description:
      "How large loans are relative to property value — a risk limit used by lenders.",
  },
];

export type ToolGuideTerm = {
  name: string;
  description: string;
  symbol?: string;
};

export type ToolTermsGuideData = {
  summary: string;
  formula: string;
  howItWorks: string[];
  inputTerms: ToolGuideTerm[];
  formulaTerms: ToolGuideTerm[];
  notes: string[];
};

/**
 * Educational formula + variable definitions for a calculator.
 * Content is keyed by formulaType with curated coverage for most tools.
 */
export function getToolExplanation(
  calculator: Calculator
): ToolExplanationContent {
  return explanations[calculator.formulaType] ?? FALLBACK;
}

function describeInput(id: string, label: string): string {
  if (TERM_BY_ID[id]) return TERM_BY_ID[id];
  for (const rule of TERM_BY_LABEL_HINT) {
    if (rule.test.test(label) || rule.test.test(id)) return rule.description;
  }
  return `The “${label}” value used in this tool’s formula. Adjust it to see results update live.`;
}

function buildHowItWorks(explanation: ToolExplanationContent): string[] {
  const steps = [
    "Enter the values that match your loan, debt, or file scenario.",
    `The tool applies: ${explanation.formula}`,
    explanation.summary,
    "Results update instantly in your browser — nothing is sent to a server for the calculation itself.",
  ];
  return steps;
}

/** Sidebar-ready glossary + methodology for any calculator / converter. */
export function buildToolTermsGuide(
  calculator: Calculator
): ToolTermsGuideData {
  const explanation = getToolExplanation(calculator);

  const inputTerms: ToolGuideTerm[] = calculator.inputs.map((input) => ({
    name: input.label.replace(/\s*\(\$?\)$/i, "").trim() || input.label,
    description: describeInput(input.id, input.label),
  }));

  // Dedupe by name against formula variables when labels overlap
  const formulaTerms: ToolGuideTerm[] = explanation.variables.map((v) => ({
    symbol: v.symbol,
    name: v.name,
    description: v.description,
  }));

  return {
    summary: explanation.summary,
    formula: explanation.formula,
    howItWorks: buildHowItWorks(explanation),
    inputTerms,
    formulaTerms,
    notes: explanation.notes ?? FALLBACK.notes ?? [],
  };
}
