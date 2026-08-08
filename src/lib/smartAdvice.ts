import type { AdviceItem, AdviceTone, CalcResult } from "./types";

type Inputs = Record<string, number>;

function item(
  tone: AdviceTone,
  badge: string,
  title: string,
  message: string
): AdviceItem {
  return { tone, badge, title, message };
}

function hasInfinite(result: CalcResult): boolean {
  const values = [
    result.primary.value,
    ...result.secondary.map((s) => s.value),
    ...(result.featured?.map((s) => s.value) ?? []),
  ];
  return values.some(
    (v) =>
      /∞|Infinity|never|unreachable|—/i.test(v) ||
      v.trim() === "" ||
      v === "NaN"
  );
}

function pmt(principal: number, annualRate: number, termMonths: number): number {
  if (termMonths <= 0) return 0;
  const r = annualRate / 100 / 12;
  if (Math.abs(r) < 1e-12) return principal / termMonths;
  return (principal * r) / (1 - Math.pow(1 + r, -termMonths));
}

function monthsToPay(
  principal: number,
  annualRate: number,
  payment: number
): number {
  if (payment <= 0) return Infinity;
  const r = annualRate / 100 / 12;
  let balance = principal;
  let months = 0;
  while (balance > 0.01 && months < 1200) {
    const interest = balance * r;
    let principalPortion = payment - interest;
    if (principalPortion <= 0) return Infinity;
    if (principalPortion > balance) principalPortion = balance;
    balance -= principalPortion;
    months += 1;
  }
  return months;
}

function currency(n: number): string {
  if (!Number.isFinite(n)) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

function loanAdvice(inputs: Inputs, result: CalcResult): AdviceItem[] {
  const advice: AdviceItem[] = [];
  const principal = inputs.principal ?? inputs.loanAmount ?? 0;
  const rate = inputs.annualRate ?? inputs.rate ?? 0;
  const term = inputs.termMonths ?? inputs.months ?? 0;
  const extra = inputs.extraPayment ?? 0;

  if (hasInfinite(result)) {
    advice.push(
      item(
        "warning",
        "Unpayable",
        "Payment does not cover interest",
        "At this rate and payment level the balance never shrinks. Raise the payment, lower the rate, or shorten the modeled term."
      )
    );
    return advice;
  }

  if (rate >= 15) {
    advice.push(
      item(
        "warning",
        "High APR",
        "Interest is expensive at this rate",
        `An APR of ${rate}% compounds quickly. Prioritize principal reduction, refinance options, or a shorter term if cash flow allows.`
      )
    );
  } else if (rate >= 9) {
    advice.push(
      item(
        "caution",
        "Elevated rate",
        "Shop for a lower APR if possible",
        "Even a 1% rate cut can save meaningful interest over a multi-year term. Compare refinance or lender offers before locking in."
      )
    );
  } else if (rate > 0 && rate < 6) {
    advice.push(
      item(
        "positive",
        "Solid rate",
        "Your modeled APR looks competitive",
        "With a relatively low rate, focus on consistency and optional extras only if they do not strain your emergency fund."
      )
    );
  }

  if (term >= 72 && principal > 0) {
    advice.push(
      item(
        "caution",
        "Long term",
        "Longer terms raise total interest",
        "A longer schedule lowers the monthly bill but usually increases lifetime interest. Model a shorter term if the payment still fits."
      )
    );
  }

  if (extra > 0 && principal > 0 && term > 0) {
    const basePay = pmt(principal, rate, term);
    const withExtra = monthsToPay(principal, rate, basePay + extra);
    const without = monthsToPay(principal, rate, basePay);
    if (Number.isFinite(withExtra) && Number.isFinite(without) && withExtra < without) {
      const savedMonths = without - withExtra;
      advice.push(
        item(
          "positive",
          "Extra payment",
          `~${savedMonths} month${savedMonths === 1 ? "" : "s"} faster`,
          `Adding ${currency(extra)}/mo on top of the scheduled payment is projected to clear the balance sooner and cut interest along the way.`
        )
      );
    }
  } else if (principal > 0 && term > 0) {
    const bump = Math.max(25, Math.round(principal * 0.002));
    const basePay = pmt(principal, rate, term);
    const faster = monthsToPay(principal, rate, basePay + bump);
    const baseMonths = monthsToPay(principal, rate, basePay);
    if (
      Number.isFinite(faster) &&
      Number.isFinite(baseMonths) &&
      faster < baseMonths
    ) {
      advice.push(
        item(
          "info",
          "Try this",
          `+${currency(bump)}/mo could shorten the loan`,
          `Based on your inputs, adding about ${currency(bump)} extra each month may cut roughly ${baseMonths - faster} months off the schedule.`
        )
      );
    }
  }

  if (advice.length === 0) {
    advice.push(
      item(
        "info",
        "On track",
        "Review payment vs. cash flow",
        "Confirm the monthly payment fits comfortably beside essentials and savings before you commit to the loan."
      )
    );
  }

  return advice.slice(0, 3);
}

function savingsAdvice(inputs: Inputs, result: CalcResult): AdviceItem[] {
  const advice: AdviceItem[] = [];
  if (hasInfinite(result)) {
    return [
      item(
        "warning",
        "Unreachable",
        "Goal cannot be reached with these inputs",
        "Increase monthly contributions, extend the timeline, or lower the target—right now savings progress stalls."
      ),
    ];
  }

  const expenses = inputs.monthlyExpenses ?? 0;
  const months = inputs.monthsCoverage ?? 0;
  const current = inputs.currentSavings ?? inputs.current ?? 0;
  if (expenses > 0 && months > 0) {
    const target = expenses * months;
    const ratio = target > 0 ? current / target : 0;
    if (ratio >= 1) {
      advice.push(
        item(
          "positive",
          "Funded",
          "Emergency fund target met",
          "You have at least your chosen coverage months. Keep the reserve in a liquid, low-risk account and rebuild after any drawdown."
        )
      );
    } else if (ratio >= 0.5) {
      advice.push(
        item(
          "caution",
          "Halfway",
          "Solid progress—keep automating deposits",
          `You are about ${Math.round(ratio * 100)}% of the way to ${currency(target)}. Automating a fixed transfer each payday helps close the gap.`
        )
      );
    } else {
      advice.push(
        item(
          "warning",
          "Build reserve",
          "Emergency coverage looks thin",
          `Target ${currency(target)} (${months}× expenses). Start with a small automatic transfer—even ${currency(Math.max(50, Math.round(expenses * 0.05)))}/mo compounds into real security.`
        )
      );
    }
  }

  const monthly = inputs.monthlyContribution ?? inputs.monthlySave ?? inputs.monthly ?? 0;
  const incomeProxy = inputs.monthlyIncome ?? inputs.income ?? 0;
  if (incomeProxy > 0 && monthly > 0) {
    const rate = (monthly / incomeProxy) * 100;
    if (rate < 10) {
      advice.push(
        item(
          "caution",
          "Savings rate",
          "Under a 10% savings rate",
          `You are setting aside roughly ${rate.toFixed(1)}% of the income figure you entered. Nudging toward 10–20% (if feasible) accelerates goals meaningfully.`
        )
      );
    } else if (rate >= 20) {
      advice.push(
        item(
          "positive",
          "Strong saver",
          "Savings rate looks healthy",
          `About ${rate.toFixed(1)}% of income is going to this goal—an excellent habit if it stays sustainable.`
        )
      );
    }
  }

  if (advice.length === 0) {
    advice.push(
      item(
        "info",
        "Consistency",
        "Automate what you can",
        "Steady contributions beat perfect timing. Revisit the timeline whenever income or expenses change."
      )
    );
  }
  return advice.slice(0, 3);
}

function investAdvice(inputs: Inputs, result: CalcResult): AdviceItem[] {
  const advice: AdviceItem[] = [];
  if (hasInfinite(result)) {
    return [
      item(
        "warning",
        "Check inputs",
        "Projection cannot complete",
        "One or more inputs produce an undefined growth path. Verify rate, years, and contribution amounts."
      ),
    ];
  }

  const rate =
    inputs.annualInterestRate ??
    inputs.annualRate ??
    inputs.expectedReturn ??
    inputs.returnRate ??
    0;
  const fee = inputs.feePercent ?? inputs.expenseRatio ?? inputs.fee ?? 0;
  const years =
    inputs.contributionYears ?? inputs.years ?? inputs.horizonYears ?? 0;

  if (rate >= 12) {
    advice.push(
      item(
        "caution",
        "Optimistic return",
        "Stress-test a lower return assumption",
        `${rate}% annually is aggressive for long-term planning. Re-run at 6–8% to see a more conservative nest egg.`
      )
    );
  } else if (rate > 0 && rate <= 8) {
    advice.push(
      item(
        "positive",
        "Prudent return",
        "Return assumption looks grounded",
        "A moderate expected return keeps the plan realistic. Consistency of contributions usually matters more than chasing yield."
      )
    );
  }

  if (fee >= 1) {
    advice.push(
      item(
        "warning",
        "Fee drag",
        "Fees above ~1% compound against you",
        `At ${fee}% fees, a large share of long-term growth is lost. Prefer low-cost funds when the strategy allows.`
      )
    );
  } else if (fee > 0 && fee < 0.4) {
    advice.push(
      item(
        "positive",
        "Low cost",
        "Expense ratio looks investor-friendly",
        "Keeping costs low is one of the highest-confidence edges available to long-term investors."
      )
    );
  }

  const monthly = inputs.monthlyContribution ?? inputs.contribution ?? 0;
  if (monthly > 0 && years >= 10) {
    const bump = 50;
    advice.push(
      item(
        "info",
        "Contribution lever",
        `+${currency(bump)}/mo compounds for decades`,
        `Based on your horizon, raising monthly contributions by about ${currency(bump)} is often one of the fastest ways to lift ending balance—try it in the inputs.`
      )
    );
  }

  if (advice.length === 0) {
    advice.push(
      item(
        "info",
        "Long game",
        "Stay invested through volatility",
        "Projections assume steady returns; real markets swing. A written contribution plan helps you stay the course."
      )
    );
  }
  return advice.slice(0, 3);
}

function gpaAdvice(inputs: Inputs, result: CalcResult): AdviceItem[] {
  const advice: AdviceItem[] = [];
  const gpa =
    inputs.termGpa ?? inputs.goalGpa ?? inputs.targetGpa ?? inputs.prevGpa;
  const needMatch = result.primary.value.match(/[\d.]+/);
  const need = needMatch ? Number(needMatch[0]) : NaN;

  if (Number.isFinite(need) && need > 100) {
    advice.push(
      item(
        "warning",
        "Unreachable",
        "Target grade needs over 100%",
        "With the current weight and standing, that goal is not mathematically reachable. Adjust expectations or focus on remaining weighted categories."
      )
    );
  } else if (Number.isFinite(need) && need > 90) {
    advice.push(
      item(
        "caution",
        "High bar",
        "You need a strong finish",
        `Aiming near ${need.toFixed(1)}% on the remaining assessment is ambitious—prioritize high-yield study blocks and past exam patterns.`
      )
    );
  } else if (Number.isFinite(need) && need <= 70) {
    advice.push(
      item(
        "positive",
        "Attainable",
        "Required score looks manageable",
        "You have cushion relative to a perfect paper. Still treat the exam seriously—cushion disappears with careless mistakes."
      )
    );
  }

  if (typeof gpa === "number" && gpa >= 3.5) {
    advice.push(
      item(
        "positive",
        "Strong GPA",
        "Academic standing looks solid",
        "Keep the habits that got you here—consistent coursework usually beats last-minute cramming."
      )
    );
  } else if (typeof gpa === "number" && gpa > 0 && gpa < 2.5) {
    advice.push(
      item(
        "caution",
        "GPA risk",
        "Standing may limit options",
        "Consider tutoring, office hours, or adjusting course load next term to rebuild momentum."
      )
    );
  }

  if (advice.length === 0) {
    advice.push(
      item(
        "info",
        "Plan the term",
        "Weight upcoming assessments",
        "Map remaining syllabus weights so study time matches point value, not just due dates."
      )
    );
  }
  return advice.slice(0, 3);
}

function mathAdvice(result: CalcResult): AdviceItem[] {
  if (hasInfinite(result) || /no real|undefined|invalid|error/i.test(result.primary.value)) {
    return [
      item(
        "warning",
        "Undefined",
        "No valid numeric result for these inputs",
        "Check domain restrictions (e.g. division by zero, negative roots, discriminant < 0) and adjust the inputs."
      ),
    ];
  }
  return [
    item(
      "info",
      "Check units",
      "Confirm units and mode",
      "Most calculation mistakes come from mixed units or the wrong mode (degrees vs radians, hyp vs leg). Double-check labels before using the number."
    ),
  ];
}

function nutritionAdvice(inputs: Inputs): AdviceItem[] {
  const advice: AdviceItem[] = [];
  const adj = inputs.goalAdjustment ?? 0;
  const activity = inputs.activityMultiplier ?? 1.2;

  if (adj <= -750) {
    advice.push(
      item(
        "warning",
        "Aggressive cut",
        "Large calorie deficit",
        "Deficits beyond ~500–750 kcal/day are hard to sustain and may hurt training. Consider a milder cut unless coached."
      )
    );
  } else if (adj < 0) {
    advice.push(
      item(
        "caution",
        "Fat-loss mode",
        "Moderate deficit selected",
        "Pair the calorie target with high protein and strength training, and reassess every 2–4 weeks."
      )
    );
  } else if (adj > 250) {
    advice.push(
      item(
        "info",
        "Surplus",
        "Surplus supports muscle gain",
        "Keep protein high and track weekly weight so the surplus stays productive rather than excessive."
      )
    );
  } else {
    advice.push(
      item(
        "positive",
        "Maintenance",
        "Near-maintenance calories",
        "A good place to stabilize habits. Nudge activity or macros if energy or performance drifts."
      )
    );
  }

  if (activity <= 1.2) {
    advice.push(
      item(
        "info",
        "Activity",
        "Sedentary multiplier in use",
        "If you train regularly, raising the activity factor slightly may better match real expenditure—avoid double-counting workouts and NEAT."
      )
    );
  }

  return advice.slice(0, 3);
}

function housingAdvice(inputs: Inputs, result: CalcResult): AdviceItem[] {
  const advice: AdviceItem[] = [];
  if (hasInfinite(result)) {
    return [
      item(
        "warning",
        "Check feasibility",
        "Scenario looks unaffordable or invalid",
        "Income, DTI, or cost inputs produce an empty affordability path. Ease DTI, raise income, or lower price assumptions."
      ),
    ];
  }

  const cap = inputs.capRate ?? 0;
  if (cap > 0 && cap < 4) {
    advice.push(
      item(
        "caution",
        "Low cap",
        "Cap rate is on the low side",
        "Sub-4% cap rates imply thin unlevered yield—underwrite vacancy, repairs, and rate risk carefully."
      )
    );
  } else if (cap >= 7) {
    advice.push(
      item(
        "positive",
        "Yield",
        "Cap rate looks relatively strong",
        "Higher caps can mean better yield—or higher risk. Verify NOI assumptions against local comps."
      )
    );
  }

  if (advice.length === 0) {
    advice.push(
      item(
        "info",
        "Stress test",
        "Model a higher rate and vacancy",
        "Re-run with +1% rates and a vacancy bump to see if cash flow still holds under stress."
      )
    );
  }
  return advice.slice(0, 3);
}

function workPayAdvice(inputs: Inputs): AdviceItem[] {
  const advice: AdviceItem[] = [];
  const util = inputs.utilization ?? inputs.billablePercent ?? 0;
  if (util > 0 && util < 50) {
    advice.push(
      item(
        "caution",
        "Low utilization",
        "Billable capacity looks low",
        "Under ~50% utilization, raise rates or reclaim admin time—or accept that capacity limits income more than demand does."
      )
    );
  } else if (util >= 80) {
    advice.push(
      item(
        "warning",
        "Burnout risk",
        "Utilization is very high",
        "Sustained 80%+ billable weeks leave little room for sales, learning, or rest. Protect non-billable blocks."
      )
    );
  }

  const raise = inputs.raisePercent ?? inputs.raise ?? 0;
  const inflation = inputs.inflation ?? 0;
  if (raise > 0 && inflation > 0 && raise < inflation) {
    advice.push(
      item(
        "caution",
        "Real pay",
        "Raise trails inflation",
        `A ${raise}% raise with ${inflation}% inflation is a real-pay cut. Negotiate total comp or reduce costs elsewhere.`
      )
    );
  }

  if (advice.length === 0) {
    advice.push(
      item(
        "info",
        "Net vs gross",
        "Plan on take-home, not sticker pay",
        "Taxes, benefits, and irregular months change cash flow—budget from net estimates and keep a buffer."
      )
    );
  }
  return advice.slice(0, 3);
}

function travelAdvice(inputs: Inputs): AdviceItem[] {
  const mpg = inputs.mpg ?? inputs.efficiency ?? 0;
  const advice: AdviceItem[] = [];
  if (mpg > 0 && mpg < 15) {
    advice.push(
      item(
        "caution",
        "Thirsty vehicle",
        "Fuel efficiency is low",
        "At under 15 MPG, trip cost is sensitive to gas prices—pad the budget or consider a more efficient option for long miles."
      )
    );
  } else {
    advice.push(
      item(
        "info",
        "Buffer",
        "Add a 10–15% trip buffer",
        "Detours, traffic, and price swings are normal. A small contingency keeps the plan realistic."
      )
    );
  }
  if ((inputs.distance ?? inputs.miles ?? 0) > 500) {
    advice.push(
      item(
        "info",
        "Long haul",
        "Break up driving days",
        "For long distances, plan overnight stops and fatigue breaks—not just fuel arithmetic."
      )
    );
  }
  return advice.slice(0, 3);
}

function lifestyleAdvice(result: CalcResult): AdviceItem[] {
  if (hasInfinite(result)) {
    return [
      item(
        "warning",
        "Invalid",
        "Inputs produce an empty result",
        "Check for zero quantities (e.g. zero coverage rate or servings) and try again."
      ),
    ];
  }
  return [
    item(
      "info",
      "Round up",
      "Buy a little extra for real-world waste",
      "Measurements are ideal—paint, flooring, and food projects usually need a small overage for cuts, mistakes, and touch-ups."
    ),
  ];
}

function genericAdvice(result: CalcResult): AdviceItem[] {
  if (hasInfinite(result)) {
    return [
      item(
        "warning",
        "Undefined",
        "Result is undefined or unbounded",
        "Adjust inputs that drive division by zero, impossible goals, or payments that never cover interest."
      ),
    ];
  }
  return [
    item(
      "info",
      "Interpret",
      "Treat this as a planning estimate",
      `Primary result: ${result.primary.label} = ${result.primary.value}. Re-run with optimistic and pessimistic inputs to understand the range—not just a single point.`
    ),
  ];
}

const LOAN_TYPES = new Set([
  "carLoanPayoff",
  "personalLoan",
  "studentLoanPayoff",
  "monthlyMortgage",
  "homeEquityLoan",
  "biWeeklyMortgage",
  "balloonLoan",
  "loanRefinance",
  "creditCardMinimum",
  "debtSnowball",
  "debtAvalanche",
  "studentLoanAmortization",
  "gradSchoolDebtPayoff",
  "motorcycleLoan",
]);

const SAVE_TYPES = new Set([
  "emergencyFund",
  "savingsGoalDate",
  "latteFactor",
  "downPaymentTimeline",
  "subscriptionAggregator",
  "holidayGiftBudget",
]);

const INVEST_TYPES = new Set([
  "compoundInterest",
  "simpleInterest",
  "fireRetirement",
  "retirementGoal",
  "rrsp401kGrowth",
  "dividendReinvestment",
  "inflationPurchasingPower",
  "netWorthTracker",
  "ruleOf72",
  "dollarCostAveraging",
  "feeImpact",
  "collegeTuitionPlanner",
  "pensionVesting",
]);

const GPA_TYPES = new Set([
  "cumulativeGpa",
  "finalExamNeeded",
  "weightedGrade",
  "satActPercentile",
  "quizScore",
  "gradePercentageConverter",
  "classRank",
  "apExamScore",
  "attendancePercentage",
  "onlineCourseCompletion",
]);

const MATH_TYPES = new Set([
  "stdDevVariance",
  "sampleSize",
  "confidenceInterval",
  "zScorePValue",
  "permutationCombination",
  "pythagorean",
  "quadraticSolver",
  "matrixMultiply2x2",
  "fractionDecimal",
  "lcmGcd",
  "logExponentialGrowth",
  "sequenceProgression",
  "compoundProbability",
  "descriptiveStats",
  "marginOfError",
  "hypothesisTesting",
  "correlationCoefficient",
  "factorialExponent",
  "polygonGeometry",
  "circleGeometry",
  "percentageChange",
]);

const HOUSING_TYPES = new Set([
  "rentVsBuy",
  "homeAffordability",
  "propertyTax",
  "rentalCashFlow",
  "capRate",
  "grossRentMultiplier",
  "homeImprovementRoi",
  "closingCosts",
]);

const WORK_TYPES = new Set([
  "freelanceHourlyRate",
  "takeHomePay",
  "selfEmploymentTax",
  "salaryToHourly",
  "overtimePay",
  "salaryRaise",
  "salesCommission",
  "sideHustleProfit",
  "billableHours",
  "costOfLivingAdjustment",
  "severancePay",
  "ptoAccrual",
  "payrollTax",
  "contractorVsW2",
  "performanceBonus",
  "trainingRoi",
  "costPerHire",
  "employeeTurnover",
]);

const TRAVEL_TYPES = new Set([
  "fuelCostTrip",
  "roadTripGas",
  "evChargingCost",
  "carLeaseVsBuy",
  "vehicleDepreciation",
  "tollCommute",
  "flightCarbon",
  "hotelStayBudget",
  "vacationCurrency",
  "carRentalTotal",
  "transitPassSavings",
  "rideshareEarnings",
]);

/**
 * Reactive advice from formula type, live inputs, and current CalcResult.
 */
export function getSmartAdvice(
  formulaType: string,
  inputs: Inputs,
  result: CalcResult
): AdviceItem[] {
  if (formulaType === "scientificCalculator") {
    return [
      item(
        "info",
        "Mode",
        "Match angle mode to the problem",
        "Degrees vs radians is the #1 trig mistake. Use Inv for inverse trig, and clear errors before chaining new expressions."
      ),
    ];
  }

  if (formulaType === "aiNutrition") return nutritionAdvice(inputs);
  if (LOAN_TYPES.has(formulaType)) return loanAdvice(inputs, result);
  if (SAVE_TYPES.has(formulaType)) return savingsAdvice(inputs, result);
  if (INVEST_TYPES.has(formulaType)) return investAdvice(inputs, result);
  if (GPA_TYPES.has(formulaType)) return gpaAdvice(inputs, result);
  if (MATH_TYPES.has(formulaType)) return mathAdvice(result);
  if (HOUSING_TYPES.has(formulaType)) return housingAdvice(inputs, result);
  if (WORK_TYPES.has(formulaType)) return workPayAdvice(inputs);
  if (TRAVEL_TYPES.has(formulaType)) return travelAdvice(inputs);

  if (
    /paint|floor|wallpaper|recipe|coffee|aquarium|wedding|gift|pet|moving|plant|lighting|video|audio|shutter|timelapse|baking|meat|hyperfocal/i.test(
      formulaType
    )
  ) {
    return lifestyleAdvice(result);
  }

  return genericAdvice(result);
}

export function getScientificAdvice(
  error: string,
  displayValue: string
): AdviceItem[] {
  if (error) {
    const lower = error.toLowerCase();
    if (/div|zero|∞|infinity/i.test(lower)) {
      return [
        item(
          "warning",
          "Domain error",
          "Division by zero or overflow",
          `${error} Clear the expression and avoid dividing by zero or exceeding floating-point range.`
        ),
      ];
    }
    if (/neg|domain|sqrt|log|asin|acos/i.test(lower)) {
      return [
        item(
          "warning",
          "Invalid input",
          "Function domain violation",
          `${error} Check that roots, logs, and inverse trig receive values in range (and that angle mode matches the problem).`
        ),
      ];
    }
    return [
      item(
        "warning",
        "Error",
        "Expression could not be evaluated",
        error || "Fix the expression syntax and try again."
      ),
    ];
  }

  if (displayValue === "Error") {
    return [
      item(
        "warning",
        "Error",
        "Last evaluation failed",
        "Clear with AC, then re-enter the expression. Use parentheses to make order of operations explicit."
      ),
    ];
  }

  return [
    item(
      "positive",
      "Ready",
      "Result looks valid",
      `Current value: ${displayValue}. Toggle Deg/Rad before trig, and store intermediates in memory (M+) for multi-step work.`
    ),
  ];
}
