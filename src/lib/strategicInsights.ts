/** Client-side strategic insight math — resilient to NaN / zero inputs. */

export const DEFAULT_INFLATION_PCT = 2.5;

export type LifeShockId = "sabbatical" | "rateShock" | "emergency";

export type LifeShockState = Record<LifeShockId, boolean>;

export function safeNum(n: number | undefined, fallback = 0): number {
  return typeof n === "number" && Number.isFinite(n) ? n : fallback;
}

/** Nominal future value → today's purchasing power. */
export function realPurchasingPower(
  nominal: number,
  years: number,
  inflationPct = DEFAULT_INFLATION_PCT
): number {
  const n = safeNum(nominal);
  const y = Math.max(0, safeNum(years));
  const r = Math.max(0, safeNum(inflationPct)) / 100;
  if (y === 0 || r === 0) return n;
  return n / Math.pow(1 + r, y);
}

export function formatInflationNote(
  nominal: number,
  years: number,
  inflationPct = DEFAULT_INFLATION_PCT
): string {
  const real = realPurchasingPower(nominal, years, inflationPct);
  if (!Number.isFinite(real) || nominal <= 0) return "";
  const pct = ((1 - real / nominal) * 100).toFixed(0);
  return `In today's dollars (~${inflationPct}% inflation over ${years} yr): worth about ${formatMoney(real)} (${pct}% less purchasing power).`;
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

export function estimateRateShockPaymentIncrease(options: {
  principal: number;
  annualRate: number;
  termMonths: number;
  rateBumpPct?: number;
}): number {
  const principal = Math.max(0, safeNum(options.principal));
  const termMonths = Math.max(1, Math.round(safeNum(options.termMonths)));
  const rate = Math.max(0, safeNum(options.annualRate));
  const bump = safeNum(options.rateBumpPct, 1.5);
  if (principal <= 0) return 0;

  const pmt = (p: number, apr: number, n: number) => {
    const r = apr / 100 / 12;
    if (Math.abs(r) < 1e-12) return p / n;
    return (p * r) / (1 - Math.pow(1 + r, -n));
  };

  const current = pmt(principal, rate, termMonths);
  const shocked = pmt(principal, rate + bump, termMonths);
  return Math.max(0, shocked - current);
}

export type ResilienceResult = {
  score: number;
  label: string;
  tone: "strong" | "moderate" | "fragile";
  details: string[];
};

export function computeResilienceScore(options: {
  monthlyObligation: number;
  liquidReserve?: number;
  shocks: LifeShockState;
  rateShockPaymentIncrease?: number;
  emergencyHit?: number;
}): ResilienceResult {
  const monthly = Math.max(0, safeNum(options.monthlyObligation));
  const reserve = Math.max(
    0,
    safeNum(options.liquidReserve, monthly > 0 ? monthly * 3 : 0)
  );
  const rateDelta = Math.max(0, safeNum(options.rateShockPaymentIncrease));
  const emergency = Math.max(0, safeNum(options.emergencyHit, 5000));

  let score = 88;
  const details: string[] = [];

  const runwayMonths = monthly > 0 ? reserve / monthly : 12;
  details.push(
    `Estimated cash runway: ${runwayMonths.toFixed(1)} months at your current monthly obligation.`
  );

  if (options.shocks.sabbatical) {
    if (runwayMonths < 6) {
      score -= 28;
      details.push(
        "6-month income pause: runway under 6 months — plan raises risk without a larger buffer."
      );
    } else {
      score -= 10;
      details.push(
        "6-month income pause: your buffer covers the gap, but cash will be tight."
      );
    }
  }

  if (options.shocks.rateShock) {
    const stressPayment = monthly + rateDelta;
    const increasePct = monthly > 0 ? (rateDelta / monthly) * 100 : 0;
    if (increasePct > 12 || rateDelta > monthly * 0.12) {
      score -= 22;
      details.push(
        `Rate renewal (+1.5%): payment could rise ~${formatMoney(rateDelta)}/mo to ${formatMoney(stressPayment)}.`
      );
    } else {
      score -= 8;
      details.push(
        `Rate renewal (+1.5%): modest payment bump (~${formatMoney(rateDelta)}/mo).`
      );
    }
  }

  if (options.shocks.emergency) {
    const after = Math.max(0, reserve - emergency);
    const afterRunway = monthly > 0 ? after / monthly : 0;
    if (afterRunway < 2) {
      score -= 20;
      details.push(
        `Emergency ${formatMoney(emergency)}: buffer falls to ~${afterRunway.toFixed(1)} months — rebuild savings first.`
      );
    } else {
      score -= 8;
      details.push(
        `Emergency ${formatMoney(emergency)}: absorbable — ~${afterRunway.toFixed(1)} months runway remains.`
      );
    }
  }

  if (!options.shocks.sabbatical && !options.shocks.rateShock && !options.shocks.emergency) {
    details.push("Toggle a life shock above to stress-test this plan.");
  }

  score = Math.max(0, Math.min(100, Math.round(score)));

  let label = "Moderate resilience";
  let tone: ResilienceResult["tone"] = "moderate";
  if (score >= 75) {
    label = "Strong resilience";
    tone = "strong";
  } else if (score < 50) {
    label = "Fragile — high shock risk";
    tone = "fragile";
  }

  return { score, label, tone, details };
}

export function lifestyleTradeOffLines(monthlyAmount: number): string[] {
  const m = Math.max(0, safeNum(monthlyAmount));
  if (m < 25) return [];

  const lines: string[] = [];
  const vacationBudget = 4500;
  const vacations = m / (vacationBudget / 12);
  if (vacations >= 0.4) {
    lines.push(
      `${formatMoney(m)}/mo ≈ ${vacations.toFixed(1)} family vacation${vacations >= 1.8 ? "s" : ""} per year (at ~${formatMoney(vacationBudget)} each).`
    );
  }

  const dailyCoffee = 5 * 22;
  if (m >= dailyCoffee * 0.5) {
    lines.push(
      `${formatMoney(m)}/mo ≈ ${(m / dailyCoffee).toFixed(1)}× a daily $5 weekday coffee habit.`
    );
  }

  // Rough "retire earlier" heuristic: $100/mo extra principal ≈ ~1 year on typical 30yr mortgage
  const yearsEarlier = (m / 100) * 0.6;
  if (yearsEarlier >= 0.3) {
    lines.push(
      `Applied to your mortgage/debt, ${formatMoney(m)}/mo often equals ~${yearsEarlier.toFixed(1)} years sooner debt-free (rule-of-thumb).`
    );
  }

  const streaming = 15;
  lines.push(
    `${formatMoney(m)}/mo ≈ ${Math.round(m / streaming)} premium streaming subscriptions at $${streaming}/mo.`
  );

  return lines.slice(0, 4);
}

export type PartnerCompromiseResult = {
  sweetSpotMin: number;
  sweetSpotMax: number;
  compromiseScore: number;
  verdict: string;
  bothComfortable: boolean;
};

export function computePartnerCompromise(options: {
  ceilingA: number;
  ceilingB: number;
  targetPayment: number;
}): PartnerCompromiseResult {
  const a = Math.max(0, safeNum(options.ceilingA));
  const b = Math.max(0, safeNum(options.ceilingB));
  const target = Math.max(0, safeNum(options.targetPayment));

  if (a <= 0 && b <= 0) {
    return {
      sweetSpotMin: 0,
      sweetSpotMax: 0,
      compromiseScore: 0,
      verdict: "Enter both partners' comfort ceilings to find overlap.",
      bothComfortable: false,
    };
  }

  const maxJoint = Math.min(a || Infinity, b || Infinity);
  const minJoint = Math.min(a, b) * 0.85;
  const sweetSpotMin = Math.max(0, Math.min(minJoint, maxJoint));
  const sweetSpotMax = maxJoint;

  let compromiseScore = 100;
  if (target > maxJoint) {
    compromiseScore = Math.max(
      0,
      100 - ((target - maxJoint) / Math.max(maxJoint, 1)) * 120
    );
  } else if (target < sweetSpotMin) {
    compromiseScore = 92;
  } else {
    const span = Math.max(sweetSpotMax - sweetSpotMin, 1);
    const position = (target - sweetSpotMin) / span;
    compromiseScore = Math.round(78 + (1 - Math.abs(position - 0.5) * 2) * 22);
  }

  const bothComfortable = target <= maxJoint && target >= sweetSpotMin * 0.95;

  let verdict: string;
  if (bothComfortable) {
    verdict = `Your ${formatMoney(target)}/mo target sits in the compromise zone (${formatMoney(sweetSpotMin)}–${formatMoney(sweetSpotMax)}).`;
  } else if (target > maxJoint) {
    verdict = `At ${formatMoney(target)}/mo, you exceed the lower partner ceiling (${formatMoney(maxJoint)}). Negotiate trade-offs or reduce the target.`;
  } else {
    verdict = `Comfort zone: ${formatMoney(sweetSpotMin)}–${formatMoney(sweetSpotMax)}/mo based on both ceilings.`;
  }

  return {
    sweetSpotMin,
    sweetSpotMax,
    compromiseScore: Math.round(Math.max(0, Math.min(100, compromiseScore))),
    verdict,
    bothComfortable,
  };
}

export { formatMoney as formatStrategicMoney };

function parseCurrencyString(raw: string): number {
  const n = parseFloat(String(raw).replace(/[^0-9.-]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

/** Derive strategic panel config from Affordability Engine inputs + live result. */
export function buildAffordabilityInsightsConfig(
  engineMode: string,
  values: Record<string, number>,
  primaryValue: string,
  secondary: { label: string; value: string }[]
): {
  monthlyPayment: number;
  comparePayment?: number;
  principal?: number;
  annualRate?: number;
  termMonths?: number;
  inflationNominal?: number;
  inflationYears?: number;
  inflationLabel?: string;
  defaultLiquidReserve?: number;
  showPartner?: boolean;
} | null {
  let monthlyPayment = parseCurrencyString(primaryValue);

  for (const item of secondary) {
    if (/monthly|payment|piti|rent/i.test(item.label)) {
      const n = parseCurrencyString(item.value);
      if (n > monthlyPayment) monthlyPayment = n;
    }
  }

  const monthlyKeys = [
    "monthlyPayment",
    "monthlyRent",
    "monthlyCost",
    "monthlyExpenses",
  ] as const;
  for (const key of monthlyKeys) {
    const v = safeNum(values[key]);
    if (v > 0) monthlyPayment = v;
  }

  if (engineMode === "housing") {
    const targetPrice = Math.max(0, safeNum(values.targetPrice));
    const downPct = Math.min(100, Math.max(0, safeNum(values.downPaymentPercent, 20)));
    const termYears = Math.max(1, safeNum(values.loanTermYears, 30));
    const annualRate = Math.max(0, safeNum(values.annualRate, 6.75));
    const loan = Math.max(0, targetPrice * (1 - downPct / 100));
    const grossMonthly = Math.max(0, safeNum(values.annualIncome)) / 12;
    const housingCap = grossMonthly * 0.28;

    return {
      monthlyPayment: monthlyPayment > 0 ? monthlyPayment : housingCap,
      comparePayment: housingCap > 0 ? housingCap : undefined,
      principal: loan,
      annualRate,
      termMonths: Math.round(termYears * 12),
      inflationNominal: targetPrice,
      inflationYears: termYears,
      inflationLabel: "Target home price (nominal)",
      defaultLiquidReserve: monthlyPayment * 3,
      showPartner: true,
    };
  }

  if (engineMode === "rent") {
    const rent = Math.max(0, safeNum(values.monthlyRent, monthlyPayment));
    return {
      monthlyPayment: rent,
      inflationNominal: rent * 12 * 5,
      inflationYears: 5,
      inflationLabel: "Five-year rent total (nominal)",
      defaultLiquidReserve: rent * 3,
      showPartner: true,
    };
  }

  if (engineMode === "vehicle") {
    const payment = Math.max(0, safeNum(values.monthlyPayment, monthlyPayment));
    const loan = Math.max(0, safeNum(values.loanAmount));
    const termMonths = Math.max(1, Math.round(safeNum(values.loanTermMonths, 48)));
    const annualRate = Math.max(0, safeNum(values.annualRate, 7));
    return {
      monthlyPayment: payment,
      principal: loan,
      annualRate,
      termMonths,
      inflationNominal: Math.max(0, safeNum(values.vehiclePrice)),
      inflationYears: termMonths / 12,
      inflationLabel: "Vehicle price (nominal)",
      showPartner: true,
    };
  }

  if (monthlyPayment <= 0) {
    const target = Math.max(0, safeNum(values.targetPrice));
    if (target <= 0) return null;
    return {
      monthlyPayment: 0,
      inflationNominal: target,
      inflationYears: 10,
      inflationLabel: "Goal amount (nominal)",
      showPartner: engineMode === "purchase" || engineMode === "master",
    };
  }

  return {
    monthlyPayment,
    inflationNominal: Math.max(0, safeNum(values.targetPrice)),
    inflationYears: 10,
    inflationLabel: "Goal amount (nominal)",
    defaultLiquidReserve: monthlyPayment * 3,
    showPartner:
      engineMode === "purchase" ||
      engineMode === "master" ||
      engineMode === "debt",
  };
}
