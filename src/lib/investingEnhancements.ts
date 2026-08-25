/**
 * Additive helpers for Investing & Wealth Building UX enhancements.
 * Does not modify core formula implementations in formulas.ts.
 */

import type { CalcResult, Calculator, CalculatorFaq } from "@/lib/types";
import type { StrategicInsightsConfig } from "@/components/strategic/StrategicInsightsPanel";
import { getToolHref } from "@/lib/cryptoFormulas";
import { runCalculation } from "@/lib/formulas";

export const INVESTING_CATEGORY = "Investing & Wealth Building" as const;

const INVESTING_FORMULA_TYPES = new Set([
  "compoundInterest",
  "fireRetirement",
  "retirementGoal",
  "rrsp401kGrowth",
  "dividendReinvestment",
  "inflationPurchasingPower",
  "netWorthTracker",
  "ruleOf72",
  "dollarCostAveraging",
  "feeImpact",
]);

export function isInvestingCategoryFormula(formulaType: string): boolean {
  return INVESTING_FORMULA_TYPES.has(formulaType);
}

export function isInvestingCalculator(calculator: Calculator): boolean {
  return (
    calculator.category === INVESTING_CATEGORY ||
    isInvestingCategoryFormula(calculator.formulaType)
  );
}

export type WhatIfSliderDef = {
  id: string;
  label: string;
  min: number;
  max: number;
  step: number;
};

/** Secondary what-if controls — independent of the base form. */
export function getInvestingWhatIfSliders(
  calculator: Calculator
): WhatIfSliderDef[] {
  const byId = Object.fromEntries(
    calculator.inputs.map((input) => [input.id, input])
  );

  const pick = (
    id: string,
    label?: string,
    overrides?: Partial<WhatIfSliderDef>
  ): WhatIfSliderDef | null => {
    const input = byId[id];
    if (!input) return null;
    return {
      id,
      label: label ?? input.label,
      min: input.min,
      max: input.max,
      step: input.step,
      ...overrides,
    };
  };

  const keysByFormula: Record<string, Array<[string, string?]>> = {
    compoundInterest: [
      ["monthlyContribution", "What-if monthly contribution ($)"],
      ["annualInterestRate", "What-if annual return (%)"],
      ["coastingYears", "What-if coasting years"],
    ],
    fireRetirement: [
      ["annualSavings", "What-if annual savings ($)"],
      ["annualReturn", "What-if annual return (%)"],
      ["withdrawalRate", "What-if withdrawal rate (%)"],
    ],
    retirementGoal: [
      ["yearsToRetire", "What-if years to retire"],
      ["annualReturn", "What-if annual return (%)"],
      ["withdrawalRate", "What-if withdrawal rate (%)"],
    ],
    rrsp401kGrowth: [
      ["employeeContribution", "What-if employee contribution ($)"],
      ["annualReturn", "What-if annual return (%)"],
      ["years", "What-if years invested"],
    ],
    dividendReinvestment: [
      ["dividendYield", "What-if dividend yield (%)"],
      ["priceGrowth", "What-if price growth (%)"],
      ["years", "What-if holding years"],
    ],
    inflationPurchasingPower: [
      ["inflationRate", "What-if inflation rate (%)"],
      ["years", "What-if years ahead"],
    ],
    netWorthTracker: [
      ["investments", "What-if investments ($)"],
      ["mortgage", "What-if mortgage ($)"],
    ],
    ruleOf72: [["annualRate", "What-if annual return (%)"]],
    dollarCostAveraging: [
      ["monthlyInvestment", "What-if monthly investment ($)"],
      ["annualGrowth", "What-if growth rate (%)"],
      ["months", "What-if months"],
    ],
    feeImpact: [
      ["feePercent", "What-if MER / fee (%)"],
      ["grossReturn", "What-if gross return (%)"],
      ["annualContribution", "What-if annual contribution ($)"],
      ["years", "What-if years"],
    ],
  };

  const keys = keysByFormula[calculator.formulaType] ?? [];
  return keys
    .map(([id, label]) => pick(id, label))
    .filter((s): s is WhatIfSliderDef => s != null);
}

export function parseMoneyish(value: string): number {
  if (!value) return NaN;
  const cleaned = value.replace(/[^0-9.\-]/g, "");
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : NaN;
}

export function parseNumberish(value: string): number {
  if (!value) return NaN;
  const cleaned = value.replace(/[^0-9.\-]/g, "");
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : NaN;
}

function yearsFromValues(
  formulaType: string,
  values: Record<string, number>
): number {
  switch (formulaType) {
    case "compoundInterest":
      return Math.max(
        1,
        (values.contributionYears ?? 0) + (values.coastingYears ?? 0)
      );
    case "fireRetirement":
      return Math.max(1, values.years ?? 25);
    case "retirementGoal":
      return Math.max(1, values.yearsToRetire ?? 20);
    case "rrsp401kGrowth":
    case "dividendReinvestment":
    case "inflationPurchasingPower":
    case "feeImpact":
      return Math.max(1, values.years ?? 20);
    case "ruleOf72": {
      const rate = Math.max(0.1, values.annualRate ?? 7);
      return Math.max(1, 72 / rate);
    }
    case "dollarCostAveraging":
      return Math.max(1, Math.round((values.months ?? 12) / 12));
    default:
      return 20;
  }
}

function monthlyContributionProxy(
  formulaType: string,
  values: Record<string, number>
): number {
  switch (formulaType) {
    case "compoundInterest":
      return Math.max(0, values.monthlyContribution ?? 0);
    case "fireRetirement":
      return Math.max(0, (values.annualSavings ?? 0) / 12);
    case "retirementGoal":
      return Math.max(0, values.monthlyContribution ?? 0);
    case "rrsp401kGrowth":
      return Math.max(
        0,
        ((values.employeeContribution ?? 0) + (values.employerMatch ?? 0)) / 12
      );
    case "dollarCostAveraging":
      return Math.max(0, values.monthlyInvestment ?? 0);
    case "feeImpact":
      return Math.max(0, (values.annualContribution ?? 0) / 12);
    default:
      return 0;
  }
}

/** Map live results → StrategicInsightsPanel config (additive). */
export function buildInvestingInsightsConfig(
  formulaType: string,
  values: Record<string, number>,
  result: CalcResult
): StrategicInsightsConfig {
  const primaryMoney = parseMoneyish(result.primary.value);
  const featuredMoney = result.featured?.[0]
    ? parseMoneyish(result.featured[0].value)
    : NaN;
  const years = yearsFromValues(formulaType, values);
  const monthly = monthlyContributionProxy(formulaType, values);

  let inflationNominal =
    Number.isFinite(primaryMoney) && primaryMoney > 0
      ? primaryMoney
      : Number.isFinite(featuredMoney) && featuredMoney > 0
        ? featuredMoney
        : undefined;

  if (formulaType === "feeImpact") {
    const withoutFees = result.secondary.find((s) =>
      /without fees/i.test(s.label)
    );
    inflationNominal = withoutFees
      ? parseMoneyish(withoutFees.value)
      : inflationNominal;
  }

  if (formulaType === "fireRetirement") {
    const fireNumber = result.secondary.find((s) => /fire number/i.test(s.label));
    inflationNominal = fireNumber
      ? parseMoneyish(fireNumber.value)
      : inflationNominal;
  }

  if (formulaType === "ruleOf72") {
    const doubled = result.secondary.find((s) => /doubled/i.test(s.label));
    inflationNominal = doubled ? parseMoneyish(doubled.value) : inflationNominal;
  }

  if (formulaType === "netWorthTracker") {
    inflationNominal = Number.isFinite(primaryMoney) ? primaryMoney : undefined;
  }

  return {
    monthlyPayment: monthly > 0 ? monthly : Math.max(0, (inflationNominal ?? 0) * 0.004),
    inflationNominal,
    inflationYears: years,
    inflationLabel:
      formulaType === "feeImpact"
        ? "Portfolio without fee drag"
        : formulaType === "fireRetirement"
          ? "FIRE number (nominal)"
          : "Projected portfolio value",
    showPartner: false,
    defaultLiquidReserve: Math.max(monthly * 6, 3000),
  };
}

function formatMoney(n: number): string {
  if (!Number.isFinite(n)) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(n);
}

/**
 * Lifestyle / fee-drag translator lines — runs existing formulas only,
 * never mutates calculator state.
 */
export function buildInvestingLifestyleLines(
  formulaType: string,
  values: Record<string, number>,
  result: CalcResult
): string[] {
  const lines: string[] = [];

  if (formulaType === "feeImpact") {
    const drag = parseMoneyish(result.primary.value);
    const years = Math.max(1, values.years ?? 20);
    const fee = values.feePercent ?? 1;
    const annualContrib = values.annualContribution ?? 0;
    const delayYears =
      annualContrib > 0 ? drag / annualContrib : drag / Math.max(1, values.principal ?? 1) * years * 0.15;
    lines.push(
      `A ${fee.toFixed(2)}% fee drag costs about ${formatMoney(drag)} over ${years} years—roughly equivalent to delaying retirement by ~${Math.max(0.1, delayYears).toFixed(1)} years of contributions.`
    );
    const lowFeeValues = { ...values, feePercent: Math.max(0, fee - 0.5) };
    const lowFeeResult = runCalculation("feeImpact", lowFeeValues);
    const lowDrag = parseMoneyish(lowFeeResult.primary.value);
    if (Number.isFinite(drag) && Number.isFinite(lowDrag) && drag > lowDrag) {
      lines.push(
        `Cutting fees by 0.5 pts could reclaim about ${formatMoney(drag - lowDrag)} in ending wealth in this scenario.`
      );
    }
    return lines;
  }

  if (formulaType === "compoundInterest") {
    const finalBal = parseMoneyish(result.primary.value);
    const contributed = result.secondary.find((s) =>
      /out-of-pocket|contributions/i.test(s.label)
    );
    const paid = contributed ? parseMoneyish(contributed.value) : NaN;
    if (Number.isFinite(finalBal) && Number.isFinite(paid) && paid > 0) {
      const gain = finalBal - paid;
      lines.push(
        `Your plan turns ${formatMoney(paid)} contributed into about ${formatMoney(finalBal)}—that’s ${formatMoney(gain)} of compounding working for you.`
      );
    }
    const bump = {
      ...values,
      monthlyContribution: (values.monthlyContribution ?? 0) + 100,
    };
    const bumped = runCalculation("compoundInterest", bump);
    const bumpedBal = parseMoneyish(bumped.primary.value);
    if (Number.isFinite(finalBal) && Number.isFinite(bumpedBal) && bumpedBal > finalBal) {
      lines.push(
        `Adding just $100/mo more could grow the ending balance by about ${formatMoney(bumpedBal - finalBal)} in this scenario.`
      );
    }
    return lines;
  }

  if (formulaType === "fireRetirement") {
    const years = parseNumberish(result.primary.value);
    const fireNumber = result.secondary.find((s) => /fire number/i.test(s.label));
    const target = fireNumber ? parseMoneyish(fireNumber.value) : NaN;
    if (Number.isFinite(years) && Number.isFinite(target)) {
      lines.push(
        `At your savings rate, financial independence lands in about ${years} years with a FIRE number near ${formatMoney(target)}.`
      );
    }
    const faster = runCalculation("fireRetirement", {
      ...values,
      annualSavings: (values.annualSavings ?? 0) * 1.1,
    });
    const fasterYears = parseNumberish(faster.primary.value);
    if (
      Number.isFinite(years) &&
      Number.isFinite(fasterYears) &&
      fasterYears < years
    ) {
      lines.push(
        `Raising annual savings 10% could pull FIRE forward by about ${(years - fasterYears).toFixed(0)} years.`
      );
    }
    return lines;
  }

  if (formulaType === "dollarCostAveraging") {
    const value = parseMoneyish(result.primary.value);
    const invested = result.secondary.find((s) => /invested/i.test(s.label));
    const paid = invested ? parseMoneyish(invested.value) : NaN;
    if (Number.isFinite(value) && Number.isFinite(paid)) {
      lines.push(
        `DCA puts ${formatMoney(paid)} to work; this path ends near ${formatMoney(value)}—${value >= paid ? "ahead of" : "behind"} lump-sum timing luck for this growth assumption.`
      );
    }
    return lines;
  }

  const primaryMoney = parseMoneyish(result.primary.value);
  if (Number.isFinite(primaryMoney) && primaryMoney > 0) {
    lines.push(
      `Headline result: ${result.primary.label} = ${result.primary.value}. Use inflation-realist mode below to see today’s purchasing power.`
    );
  }
  return lines;
}

export function buildInvestingSummaryText(
  calculator: Calculator,
  values: Record<string, number>,
  result: CalcResult
): string {
  const lines = [
    `${calculator.title} — CalculioHub`,
    `${result.primary.label}: ${result.primary.value}`,
    ...result.secondary.slice(0, 4).map((s) => `${s.label}: ${s.value}`),
    "",
    "Key inputs:",
    ...Object.entries(values)
      .slice(0, 8)
      .map(([k, v]) => `  ${k}: ${v}`),
    "",
    "https://calculiohub.com/tools/" + calculator.slug,
    "Estimates only — not financial advice.",
  ];
  return lines.join("\n");
}

export type InvestingCta = {
  href: string;
  label: string;
  externalCategory?: string;
};

export function getInvestingNextStepCtas(
  calculator: Calculator
): InvestingCta[] {
  const slug = calculator.slug;
  const sameCategory: InvestingCta[] = [];

  const byFormula: Record<string, InvestingCta[]> = {
    compoundInterest: [
      {
        href: getToolHref("investment-management-fee-impact-calculator"),
        label: "→ Calculate fee drag on this growth",
      },
      {
        href: getToolHref("fire-early-retirement-calculator"),
        label: "→ Turn growth into a FIRE timeline",
      },
      {
        href: getToolHref("monthly-mortgage-payment-calculator"),
        label: "→ Run mortgage vs. investing comparison",
        externalCategory: "Real Estate & Housing",
      },
    ],
    fireRetirement: [
      {
        href: getToolHref("retirement-savings-goal-calculator"),
        label: "→ Set a retirement savings goal",
      },
      {
        href: getToolHref("compound-interest-calculator"),
        label: "→ Stress-test contribution compounding",
      },
      {
        href: getToolHref("net-worth-tracker-calculator"),
        label: "→ Track net worth toward FIRE",
      },
    ],
    retirementGoal: [
      {
        href: getToolHref("fire-early-retirement-calculator"),
        label: "→ Check years to FIRE",
      },
      {
        href: getToolHref("rrsp-401k-growth-calculator"),
        label: "→ Project RRSP / 401(k) growth",
      },
    ],
    feeImpact: [
      {
        href: getToolHref("compound-interest-calculator"),
        label: "→ Re-run growth with lower fees",
      },
      {
        href: getToolHref("dollar-cost-averaging-calculator"),
        label: "→ Model a DCA investing plan",
      },
      {
        href: getToolHref("car-loan-payoff-calculator"),
        label: "→ Free cash flow by paying down debt",
        externalCategory: "Loans & Debt Management",
      },
    ],
    dollarCostAveraging: [
      {
        href: getToolHref("compound-interest-calculator"),
        label: "→ Compare vs. lump-sum compounding",
      },
      {
        href: getToolHref("investment-management-fee-impact-calculator"),
        label: "→ Calculate fee drag",
      },
    ],
    rrsp401kGrowth: [
      {
        href: getToolHref("retirement-savings-goal-calculator"),
        label: "→ See if this hits your retirement goal",
      },
      {
        href: getToolHref("investment-management-fee-impact-calculator"),
        label: "→ Calculate fee drag",
      },
    ],
    dividendReinvestment: [
      {
        href: getToolHref("compound-interest-calculator"),
        label: "→ Compare total-return compounding",
      },
      {
        href: getToolHref("inflation-purchasing-power-calculator"),
        label: "→ Adjust dividends for inflation",
      },
    ],
    inflationPurchasingPower: [
      {
        href: getToolHref("retirement-savings-goal-calculator"),
        label: "→ Rebuild a retirement target",
      },
      {
        href: getToolHref("compound-interest-calculator"),
        label: "→ Grow savings ahead of inflation",
      },
    ],
    netWorthTracker: [
      {
        href: getToolHref("fire-early-retirement-calculator"),
        label: "→ Map net worth to FIRE",
      },
      {
        href: getToolHref("debt-snowball-strategy-calculator"),
        label: "→ Attack debts with a payoff plan",
        externalCategory: "Loans & Debt Management",
      },
    ],
    ruleOf72: [
      {
        href: getToolHref("compound-interest-calculator"),
        label: "→ Model full contribution growth",
      },
      {
        href: getToolHref("investment-management-fee-impact-calculator"),
        label: "→ See how fees slow doubling",
      },
    ],
  };

  sameCategory.push(
    ...(byFormula[calculator.formulaType] ?? [
      {
        href: getToolHref("compound-interest-calculator"),
        label: "→ Open compound interest workspace",
      },
      {
        href: getToolHref("investment-management-fee-impact-calculator"),
        label: "→ Calculate fee drag",
      },
    ])
  );

  return sameCategory.filter((c) => !c.href.includes(slug)).slice(0, 3);
}

/** High-intent FAQs appended below the page (additive SEO block). */
export function getInvestingExpandedFaqs(
  formulaType: string
): CalculatorFaq[] {
  const shared: CalculatorFaq[] = [
    {
      question: "Is dollar-cost averaging better than investing a lump sum?",
      answer:
        "Lump sum often wins mathematically if markets rise on average, because money is invested sooner. Dollar-cost averaging can reduce timing regret and smooth entry prices when cash arrives over time. Use both the DCA and compound interest tools to compare your own numbers.",
    },
    {
      question: "How do investment fees (MER) affect long-term returns?",
      answer:
        "A 1% annual fee compounds against you the same way returns compound for you. Over 20–30 years, fee drag can erase a large share of ending wealth. Run the fee impact calculator with your MER to see dollars lost, not just basis points.",
    },
    {
      question: "What is a FIRE number and how is it calculated?",
      answer:
        "Your FIRE number is typically annual spending divided by a safe withdrawal rate (often 3–4%). Example: $50,000 of expenses at 4% implies a $1.25M portfolio. The FIRE calculator estimates years to reach that target from your savings rate and return assumption.",
    },
  ];

  const byType: Record<string, CalculatorFaq[]> = {
    compoundInterest: [
      {
        question: "How do I calculate compound interest with monthly contributions?",
        answer:
          "Enter starting balance, monthly deposit, years contributing, annual rate, and compounding frequency. Optionally add coasting years to see growth after deposits stop. Results update instantly in your browser.",
      },
      {
        question: "What return rate should I assume for long-term investing?",
        answer:
          "Many planners stress-test 5–8% nominal for diversified equity/bond mixes. Higher rates shrink timelines but raise shortfall risk. Try a conservative and an optimistic rate in the what-if panel.",
      },
      ...shared,
    ],
    fireRetirement: [
      {
        question: "What withdrawal rate should I use for FIRE planning?",
        answer:
          "The classic “4% rule” is a starting heuristic, not a guarantee. Lower rates (3–3.5%) are more conservative for early retirees with long horizons. Toggle withdrawal rate in the what-if workspace to see timeline sensitivity.",
      },
      {
        question: "How can I reach FIRE faster without extreme frugality?",
        answer:
          "Raising income, increasing savings rate, cutting high-interest debt, and lowering investment fees usually move the needle more than tiny lifestyle cuts. Pair this tool with the fee impact and debt payoff calculators.",
      },
      ...shared,
    ],
    feeImpact: [
      {
        question: "How much does a 1% management fee cost over 20 years?",
        answer:
          "It depends on starting balance, contributions, and gross return—but a 1% MER often costs six figures on large portfolios. Use this calculator’s fee slider to quantify drag for your exact inputs.",
      },
      {
        question: "Are low-cost index funds always better?",
        answer:
          "Lower fees improve the odds of keeping more market return, all else equal. Active funds must outperform after fees to win. Compare your current MER versus a low-cost alternative in the what-if panel.",
      },
      ...shared,
    ],
    dollarCostAveraging: [
      {
        question: "Does dollar-cost averaging beat lump-sum investing?",
        answer:
          "Historically, investing available cash immediately has often outperformed staging entries, but DCA can be the right behavioral fit when you invest from each paycheck. Compare both approaches with matching total capital.",
      },
      ...shared,
    ],
    retirementGoal: shared,
    rrsp401kGrowth: shared,
    dividendReinvestment: shared,
    inflationPurchasingPower: [
      {
        question: "Why does inflation matter for retirement planning?",
        answer:
          "A dollar today buys more than a dollar in 20 years. Inflation-realist mode shows what a future portfolio is worth in today’s purchasing power so you do not overstate lifestyle capacity.",
      },
      ...shared,
    ],
    netWorthTracker: shared,
    ruleOf72: [
      {
        question: "How accurate is the Rule of 72?",
        answer:
          "It is a quick approximation: years to double ≈ 72 ÷ annual return %. It works best for moderate rates and ignores contributions, taxes, and fees—use the compound interest and fee tools for fuller plans.",
      },
      ...shared,
    ],
  };

  return byType[formulaType] ?? shared;
}
