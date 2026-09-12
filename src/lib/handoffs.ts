import type { CalcResult } from "@/lib/types";
import { getToolHref } from "@/lib/cryptoFormulas";
import { buildHandoffHref } from "@/lib/scenarioLinks";

export type HandoffContext = {
  slug: string;
  values: Record<string, number>;
  result?: CalcResult;
  extras?: Record<string, number>;
};

export type HandoffMapped = {
  fields: Record<string, number>;
  carried: string;
  assumed?: string;
};

export type HandoffDef = {
  from: string;
  to: string;
  question: string;
  why: string;
  map: (ctx: HandoffContext) => HandoffMapped | null;
};

export type HandoffCardModel = {
  toSlug: string;
  href: string;
  question: string;
  why: string;
  carried: string;
  assumed?: string;
};

const LAST_KEY = "calculiohub.lastHandoff.v1";

export type LastHandoff = {
  fromSlug: string;
  toSlug: string;
  href: string;
  question: string;
  carried: string;
  at: number;
};

function finite(n: number | undefined, min = 0): number | null {
  if (n == null || !Number.isFinite(n) || n < min) return null;
  return n;
}

function pick(
  bag: Record<string, number>,
  keys: string[],
  min = 0
): number | null {
  for (const key of keys) {
    const n = finite(bag[key], min);
    if (n != null) return n;
  }
  return null;
}

export function parseMoneyText(raw: string | undefined): number | null {
  if (!raw) return null;
  const n = Number(String(raw).replace(/[^0-9.+-eE]/g, ""));
  return Number.isFinite(n) ? n : null;
}

function moneyLabel(result: CalcResult | undefined, label: string): number | null {
  if (!result) return null;
  const needle = label.toLowerCase();
  const items = [
    result.primary,
    ...(result.featured ?? []),
    ...result.secondary,
  ];
  const hit = items.find((item) => item.label.toLowerCase().includes(needle));
  return parseMoneyText(hit?.value);
}

function usd(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

function fieldsOf(
  pairs: [string, number | null][]
): Record<string, number> | null {
  const fields: Record<string, number> = {};
  for (const [key, value] of pairs) {
    if (value == null) continue;
    fields[key] = value;
  }
  return Object.keys(fields).length ? fields : null;
}

const HANDOFFS: HandoffDef[] = [
  {
    from: "home-affordability-calculator",
    to: "monthly-mortgage-payment-calculator",
    question: "What is the monthly payment on that house?",
    why: "Opens the mortgage studio with this price, down payment, rate, and term.",
    map: (ctx) => {
      const price =
        parseMoneyText(ctx.result?.primary.value) ??
        moneyLabel(ctx.result, "max home");
      const down = finite(ctx.values.downPayment);
      const rate = finite(ctx.values.annualRate);
      const term = finite(ctx.values.termYears, 1);
      if (price == null || price < 10000) return null;
      const fields = fieldsOf([
        ["homePrice", price],
        ["downPayment", down],
        ["annualRate", rate],
        ["termYears", term],
      ]);
      if (!fields) return null;
      return {
        fields,
        carried: usd(price),
        assumed: rate == null ? "Rate not set — mortgage page keeps its default." : undefined,
      };
    },
  },
  {
    from: "home-affordability-calculator",
    to: "emergency-fund-runway-planner",
    question: "If this is my housing bill, how many months of cash do I need?",
    why: "Uses the estimated P&I as monthly essentials. Add groceries and other bills on the next page.",
    map: (ctx) => {
      const payment =
        ctx.extras?.monthlyPayment ??
        moneyLabel(ctx.result, "monthly") ??
        moneyLabel(ctx.result, "p&i");
      const income = finite(ctx.values.annualIncome);
      if (payment == null || payment < 100) return null;
      return {
        fields: {
          monthlyExpenses: Math.round(payment),
          ...(income != null ? { monthlyIncome: Math.round(income / 12) } : {}),
        },
        carried: `${usd(payment)}/mo housing`,
        assumed: "Housing only — add food, transport, and insurance on the next page.",
      };
    },
  },
  {
    from: "monthly-mortgage-payment-calculator",
    to: "bi-weekly-mortgage-payment-calculator",
    question: "What if I pay bi-weekly instead?",
    why: "Carries the remaining balance, rate, and term into the bi-weekly comparison.",
    map: (ctx) => {
      const price = finite(ctx.values.homePrice);
      const down = finite(ctx.values.downPayment) ?? 0;
      const principal =
        ctx.extras?.principal ??
        (price != null ? Math.max(0, price - down) : null);
      const rate = finite(ctx.values.annualRate);
      const term = finite(ctx.values.termYears, 1);
      if (principal == null || principal < 1000 || rate == null || term == null) {
        return null;
      }
      return {
        fields: { principal, annualRate: rate, termYears: term },
        carried: usd(principal),
      };
    },
  },
  {
    from: "monthly-mortgage-payment-calculator",
    to: "rent-vs-buy-long-term-calculator",
    question: "Is renting still cheaper over 10 years?",
    why: "Same home price and rate. Down payment becomes a percent.",
    map: (ctx) => {
      const price = finite(ctx.values.homePrice, 10000);
      const down = finite(ctx.values.downPayment) ?? 0;
      const rate =
        finite(ctx.values.annualRate) ?? finite(ctx.values.mortgageRate);
      if (price == null) return null;
      const pct = Math.round((down / price) * 100);
      return {
        fields: {
          homePrice: price,
          downPaymentPct: Math.min(50, Math.max(5, pct || 20)),
          ...(rate != null ? { mortgageRate: rate } : {}),
        },
        carried: usd(price),
      };
    },
  },
  {
    from: "monthly-mortgage-payment-calculator",
    to: "emergency-fund-runway-planner",
    question: "How many months of cash cover this payment?",
    why: "Puts the mortgage P&I into essential monthly spend.",
    map: (ctx) => {
      const payment = ctx.extras?.monthlyPayment;
      if (payment == null || payment < 50) return null;
      return {
        fields: { monthlyExpenses: Math.round(payment) },
        carried: `${usd(payment)}/mo`,
        assumed: "P&I only unless you turned on taxes and insurance.",
      };
    },
  },
  {
    from: "car-loan-payoff-calculator",
    to: "emergency-fund-runway-planner",
    question: "If this car payment is a bill, what’s my runway?",
    why: "Uses the car payment as monthly expenses so you can size cash around it.",
    map: (ctx) => {
      const payment = ctx.extras?.monthlyPayment;
      if (payment == null || payment < 20) return null;
      return {
        fields: { monthlyExpenses: Math.round(payment) },
        carried: `${usd(payment)}/mo`,
        assumed: "Car payment only — add the rest of your bills next.",
      };
    },
  },
  {
    from: "car-loan-payoff-calculator",
    to: "debt-snowball-strategy-calculator",
    question: "Put this loan in a payoff plan with other debts.",
    why: "Drops the balance and rate into snowball as the first debt.",
    map: (ctx) => {
      const bal = finite(ctx.values.principal, 1);
      const rate = finite(ctx.values.annualRate);
      if (bal == null) return null;
      return {
        fields: {
          debt1: bal,
          ...(rate != null ? { avgRate: rate } : {}),
          balance: bal,
          annualRate: rate ?? 6.5,
        },
        carried: usd(bal),
      };
    },
  },
  {
    from: "personal-loan-calculator",
    to: "debt-snowball-strategy-calculator",
    question: "Stack this loan with the rest of your debts.",
    why: "Carries the amount and rate into a snowball plan.",
    map: (ctx) => {
      const bal = finite(ctx.values.principal, 1);
      const rate = finite(ctx.values.annualRate) ?? finite(ctx.values.rate1);
      if (bal == null) return null;
      return {
        fields: {
          debt1: bal,
          avgRate: rate ?? 12,
          balance: bal,
          annualRate: rate ?? 12,
        },
        carried: usd(bal),
      };
    },
  },
  {
    from: "credit-card-minimum-payment-calculator",
    to: "debt-snowball-strategy-calculator",
    question: "Put this card in a payoff plan.",
    why: "Balance and APR become the first debt. Minimums stay on that page.",
    map: (ctx) => {
      const bal = finite(ctx.values.balance, 1);
      const rate = finite(ctx.values.annualRate);
      if (bal == null) return null;
      return {
        fields: {
          debt1: bal,
          avgRate: rate ?? 22,
          balance: bal,
          annualRate: rate ?? 22,
        },
        carried: usd(bal),
      };
    },
  },
  {
    from: "credit-card-minimum-payment-calculator",
    to: "debt-avalanche-strategy-calculator",
    question: "Attack this APR first (avalanche).",
    why: "Same balance and rate, highest-APR-first order.",
    map: (ctx) => {
      const bal = finite(ctx.values.balance, 1);
      const rate = finite(ctx.values.annualRate);
      if (bal == null) return null;
      return {
        fields: {
          debt1: bal,
          avgRate: rate ?? 22,
          balance: bal,
          annualRate: rate ?? 22,
        },
        carried: usd(bal),
      };
    },
  },
  {
    from: "compound-interest-calculator",
    to: "fire-early-retirement-calculator",
    question: "If I keep this up, when am I independent?",
    why: "Deposit becomes current assets; monthly contribution becomes yearly savings.",
    map: (ctx) => {
      const pile = finite(ctx.values.initialDeposit) ?? 0;
      const monthly = finite(ctx.values.monthlyContribution);
      const rate = finite(ctx.values.annualInterestRate);
      if (monthly == null && pile <= 0) return null;
      return {
        fields: {
          currentSavings: pile,
          ...(monthly != null ? { annualSavings: Math.round(monthly * 12) } : {}),
          ...(rate != null ? { annualReturn: rate } : {}),
        },
        carried:
          monthly != null
            ? `${usd(pile)} + ${usd(monthly)}/mo`
            : usd(pile),
      };
    },
  },
  {
    from: "compound-interest-calculator",
    to: "when-can-i-retire",
    question: "What age does this path actually stop work?",
    why: "Same pile and monthly investing, with a spending target you set next.",
    map: (ctx) => {
      const pile = finite(ctx.values.initialDeposit) ?? 0;
      const monthly = finite(ctx.values.monthlyContribution);
      const rate = finite(ctx.values.annualInterestRate);
      if (monthly == null && pile <= 0) return null;
      return {
        fields: {
          savings: pile,
          ...(monthly != null ? { monthly } : {}),
          ...(rate != null ? { rate } : {}),
        },
        carried:
          monthly != null ? `${usd(pile)} + ${usd(monthly)}/mo` : usd(pile),
      };
    },
  },
  {
    from: "fire-early-retirement-calculator",
    to: "when-can-i-retire",
    question: "Translate FIRE into an age.",
    why: "Assets, yearly savings, return, spend, and withdrawal rate come with you.",
    map: (ctx) => {
      const savings = finite(ctx.values.currentSavings) ?? 0;
      const annual = finite(ctx.values.annualSavings);
      const spend = finite(ctx.values.annualExpenses, 1);
      const rate = finite(ctx.values.annualReturn);
      const withdraw = finite(ctx.values.withdrawalRate);
      if (spend == null && savings <= 0) return null;
      return {
        fields: {
          savings,
          ...(annual != null ? { monthly: Math.round(annual / 12) } : {}),
          ...(spend != null ? { spend } : {}),
          ...(rate != null ? { rate } : {}),
          ...(withdraw != null ? { withdraw } : {}),
        },
        carried: spend != null ? `${usd(spend)}/yr spend` : usd(savings),
      };
    },
  },
  {
    from: "fire-early-retirement-calculator",
    to: "how-long-will-my-money-last",
    question: "If I stopped working now, how long does this pile last?",
    why: "Current assets and yearly spend, with the return you assumed.",
    map: (ctx) => {
      const savings = finite(ctx.values.currentSavings, 1);
      const spend = finite(ctx.values.annualExpenses, 1);
      const rate = finite(ctx.values.annualReturn);
      if (savings == null || spend == null) return null;
      return {
        fields: {
          savings,
          spend,
          ...(rate != null ? { rate } : {}),
        },
        carried: usd(savings),
      };
    },
  },
  {
    from: "emergency-fund-runway-planner",
    to: "subscription-runway-audit",
    question: "Pause subscriptions and buy more months.",
    why: "Cash, burn, and income come across. Subscriptions start as a sample list.",
    map: (ctx) => {
      const cash = finite(ctx.values.liquidSavings);
      const burn = finite(ctx.values.monthlyExpenses, 1);
      const income = finite(ctx.values.monthlyIncome);
      if (burn == null && cash == null) return null;
      return {
        fields: {
          ...(cash != null ? { liquidSavings: cash } : {}),
          ...(burn != null ? { monthlyExpensesExSubs: burn } : {}),
          ...(income != null ? { monthlyIncome: income } : {}),
        },
        carried: burn != null ? `${usd(burn)}/mo burn` : usd(cash ?? 0),
      };
    },
  },
  {
    from: "emergency-fund-runway-planner",
    to: "multi-goal-savings-planner",
    question: "Split what’s left across goals.",
    why: "Savings capacity and cash on hand fill the multi-goal planner.",
    map: (ctx) => {
      const cap = finite(ctx.values.monthlySavingsCapacity, 1);
      const cash = finite(ctx.values.liquidSavings);
      if (cap == null && cash == null) return null;
      return {
        fields: {
          ...(cap != null ? { monthlyBudget: cap } : {}),
          ...(cash != null ? { currentSaved: cash } : {}),
        },
        carried: cap != null ? `${usd(cap)}/mo to save` : usd(cash ?? 0),
      };
    },
  },
  {
    from: "when-can-i-retire",
    to: "how-long-will-my-money-last",
    question: "If I retired at that nest egg, how long does it last?",
    why: "Invested pile and yearly spend, plus the return you used.",
    map: (ctx) => {
      const savings =
        ctx.extras?.nestEgg ?? finite(ctx.values.savings);
      const spend = finite(ctx.values.spend, 1);
      const rate = finite(ctx.values.rate);
      if (savings == null || spend == null) return null;
      return {
        fields: {
          savings,
          spend,
          ...(rate != null ? { rate } : {}),
        },
        carried: usd(savings),
      };
    },
  },
  {
    from: "what-age-can-i-stop-working",
    to: "how-long-will-my-money-last",
    question: "How long does that pile last if you stop?",
    why: "Same nest egg and spend as the stop-working page.",
    map: (ctx) => {
      const savings =
        ctx.extras?.nestEgg ?? finite(ctx.values.savings);
      const spend = finite(ctx.values.spend, 1);
      const rate = finite(ctx.values.rate);
      if (savings == null || spend == null) return null;
      return {
        fields: { savings, spend, ...(rate != null ? { rate } : {}) },
        carried: usd(savings),
      };
    },
  },
  {
    from: "if-i-invested-100-every-month",
    to: "how-long-to-save-first-100k",
    question: "How long until this habit hits $100k?",
    why: "Same monthly amount, starting pile, and return.",
    map: (ctx) => {
      const monthly = finite(ctx.values.monthly, 1);
      const savings = finite(ctx.values.savings) ?? 0;
      const rate = finite(ctx.values.rate);
      if (monthly == null) return null;
      return {
        fields: {
          monthly,
          savings,
          ...(rate != null ? { rate } : {}),
        },
        carried: `${usd(monthly)}/mo`,
      };
    },
  },
  {
    from: "how-long-to-save-first-100k",
    to: "when-can-i-retire",
    question: "After $100k, when can I stop working?",
    why: "Keeps the monthly habit and return; you set later spending next.",
    map: (ctx) => {
      const monthly = finite(ctx.values.monthly, 1);
      const savings = finite(ctx.values.savings) ?? 0;
      const rate = finite(ctx.values.rate);
      if (monthly == null) return null;
      return {
        fields: {
          monthly,
          savings,
          ...(rate != null ? { rate } : {}),
        },
        carried: `${usd(monthly)}/mo`,
      };
    },
  },
  {
    from: "bulk-cut-macro-planner",
    to: "reverse-diet-planner",
    question: "How do I reverse out of this cut?",
    why: "Daily target becomes current calories; TDEE becomes maintenance.",
    map: (ctx) => {
      const current = ctx.extras?.dailyCalories;
      const tdee = ctx.extras?.tdee;
      const weightKg = ctx.extras?.weightKg;
      if (current == null || tdee == null) return null;
      return {
        fields: {
          currentCalories: Math.round(current),
          maintenanceCalories: Math.round(tdee),
          ...(weightKg != null ? { currentWeightKg: weightKg } : {}),
        },
        carried: `${Math.round(current)} kcal/day`,
      };
    },
  },
  {
    from: "bulk-cut-macro-planner",
    to: "body-recomposition-planner",
    question: "What if I recomp near maintenance instead?",
    why: "Age, weight, height, and training days carry over.",
    map: (ctx) => {
      const age = finite(ctx.values.age, 16);
      const weightKg = ctx.extras?.weightKg;
      const heightCm = ctx.extras?.heightCm;
      const days = finite(ctx.values.trainingDays, 1);
      if (weightKg == null && age == null) return null;
      return {
        fields: {
          ...(age != null ? { age } : {}),
          ...(weightKg != null ? { weightKg } : {}),
          ...(heightCm != null ? { heightCm } : {}),
          ...(days != null ? { trainingDays: days } : {}),
        },
        carried: weightKg != null ? `${weightKg} kg` : `age ${age}`,
      };
    },
  },
  {
    from: "bulk-cut-macro-planner",
    to: "tdee-calculator-weight-loss",
    question: "Double-check maintenance on the TDEE page.",
    why: "Same body stats in pounds/inches.",
    map: (ctx) => {
      const age = finite(ctx.values.age, 16);
      const weightKg = ctx.extras?.weightKg;
      const heightCm = ctx.extras?.heightCm;
      const sex = ctx.extras?.sexMale;
      const activity = ctx.extras?.activityMultiplier;
      if (weightKg == null || heightCm == null) return null;
      return {
        fields: {
          ...(age != null ? { ageYears: age } : {}),
          weightLbs: Math.round(weightKg * 2.20462),
          heightIn: Math.round((heightCm / 2.54) * 2) / 2,
          ...(sex != null ? { sex } : {}),
          ...(activity != null ? { activityMultiplier: activity } : {}),
        },
        carried: `${Math.round(weightKg * 2.20462)} lb`,
      };
    },
  },
  {
    from: "reverse-diet-planner",
    to: "body-recomposition-planner",
    question: "Hold near maintenance and recomp?",
    why: "Weight comes across. Set volume on the next page.",
    map: (ctx) => {
      const weightKg =
        finite(ctx.values.currentWeightKg, 30) ??
        finite(ctx.values.weightKg, 30);
      if (weightKg == null) return null;
      return { fields: { weightKg }, carried: `${weightKg} kg` };
    },
  },
  {
    from: "tdee-calculator-weight-loss",
    to: "calorie-deficit-calculator",
    question: "Turn that TDEE into a weekly loss target.",
    why: "Maintenance calories fill the deficit tool.",
    map: (ctx) => {
      const tdee =
        parseMoneyText(ctx.result?.primary.value) ?? ctx.extras?.tdee;
      if (tdee == null || tdee < 800) return null;
      return {
        fields: { tdee: Math.round(tdee) },
        carried: `${Math.round(tdee)} kcal`,
      };
    },
  },
  {
    from: "freelance-true-rate-planner",
    to: "freelance-hourly-rate-calculator",
    question: "See the same net as a classic hourly rate.",
    why: "Desired net, tax, and billable hours carry over.",
    map: (ctx) => {
      const net = finite(ctx.values.desiredNetMonthly, 1);
      const hours = finite(ctx.values.billableHoursPerWeek, 1);
      const weeks = finite(ctx.values.weeksPerMonth, 1);
      const tax = finite(ctx.values.taxPct);
      if (net == null) return null;
      return {
        fields: {
          targetAnnualIncome: Math.round(net * 12),
          ...(hours != null ? { billableHoursPerWeek: hours } : {}),
          ...(weeks != null
            ? { weeksWorked: Math.round(weeks * 12) }
            : {}),
          ...(tax != null ? { taxRate: tax } : {}),
        },
        carried: `${usd(net)}/mo net`,
      };
    },
  },
  {
    from: "freelance-true-rate-planner",
    to: "self-employment-tax-estimator",
    question: "What SE tax belongs on that invoice?",
    why: "Uses yearly desired net as a profit stand-in — not a tax return.",
    map: (ctx) => {
      const net = finite(ctx.values.desiredNetMonthly, 1);
      const invoice = ctx.extras?.invoiceGross;
      const profit = invoice ?? (net != null ? net * 12 : null);
      if (profit == null || profit < 1000) return null;
      return {
        fields: { netProfit: Math.round(profit) },
        carried: usd(profit),
        assumed:
          invoice != null
            ? "Using the invoice total as a profit sketch."
            : "Using 12× desired net — replace with real profit if you have it.",
      };
    },
  },
];

export function getHandoffCards(
  ctx: HandoffContext,
  limit = 3
): HandoffCardModel[] {
  const cards: HandoffCardModel[] = [];
  for (const def of HANDOFFS) {
    if (def.from !== ctx.slug) continue;
    const mapped = def.map(ctx);
    if (!mapped || Object.keys(mapped.fields).length === 0) continue;
    cards.push({
      toSlug: def.to,
      href: buildHandoffHref(getToolHref(def.to), mapped.fields, ctx.slug),
      question: def.question,
      why: def.why,
      carried: mapped.carried,
      assumed: mapped.assumed,
    });
    if (cards.length >= limit) break;
  }
  return cards;
}

export function rememberLastHandoff(entry: LastHandoff): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LAST_KEY, JSON.stringify(entry));
  } catch {
    /* ignore */
  }
}

export function readLastHandoff(): LastHandoff | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(LAST_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as LastHandoff;
    if (!parsed?.href || !parsed.question) return null;
    const age = Date.now() - (parsed.at || 0);
    if (age > 14 * 24 * 60 * 60 * 1000) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function clearLastHandoff(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(LAST_KEY);
  } catch {
    /* ignore */
  }
}

export function getHandoffSourceTitle(slug: string): string {
  const hit = HANDOFFS.find((h) => h.from === slug);
  if (hit) {
    return hit.from
      .split("-")
      .filter(Boolean)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  }
  return slug.replace(/-/g, " ");
}
