/**
 * Shared client-side math + persistence for Loans & Debt Management upgrades
 * (excluding avalanche/snowball, which live in debtPayoff.ts).
 */

export const LOAN_STATE_STORAGE_KEY = "calculiohub-loan-tools-state-v1";
export const MAX_LOAN_MONTHS = 600;
export const SCHEDULE_PREVIEW = 12;
/** Keep enough monthly points for a smooth payoff chart (50 years). */
const BALANCE_SERIES_CAP = 600;

export type AmortRow = {
  month: number;
  payment: number;
  interest: number;
  principal: number;
  balance: number;
};

export type AmortResult = {
  basePayment: number;
  totalPayment: number;
  months: number;
  interest: number;
  totalPaid: number;
  schedule: AmortRow[];
  balanceSeries: number[];
  unreachable: boolean;
};

export function formatLoanMoney(n: number): string {
  if (!Number.isFinite(n)) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(n);
}

export function formatLoanMonths(months: number): string {
  if (!Number.isFinite(months) || months < 0) return "—";
  const m = Math.round(months);
  if (m === 0) return "0 months";
  const years = Math.floor(m / 12);
  const rem = m % 12;
  if (years === 0) return `${m} month${m === 1 ? "" : "s"}`;
  if (rem === 0) return `${years} year${years === 1 ? "" : "s"} (${m} mo)`;
  return `${years}y ${rem}mo (${m} mo)`;
}

export function loanPmt(
  principal: number,
  annualRate: number,
  termMonths: number
): number {
  if (principal <= 0 || termMonths <= 0) return 0;
  const r = annualRate / 100 / 12;
  if (Math.abs(r) < 1e-12) return principal / termMonths;
  return (principal * r) / (1 - Math.pow(1 + r, -termMonths));
}

function remainingBalanceAt(
  principal: number,
  annualRate: number,
  amortMonths: number,
  paidMonths: number
): number {
  const r = annualRate / 100 / 12;
  const payment = loanPmt(principal, annualRate, amortMonths);
  if (Math.abs(r) < 1e-12) {
    return Math.max(0, principal - payment * paidMonths);
  }
  return (
    principal * Math.pow(1 + r, paidMonths) -
    payment * ((Math.pow(1 + r, paidMonths) - 1) / r)
  );
}

/** Fixed payment amortization with optional extra principal each month. */
export function amortizeLoan(options: {
  principal: number;
  annualRate: number;
  termMonths: number;
  extraPayment?: number;
  /** If set, ignore term-based PMT and use this fixed payment (+ extra). */
  fixedPayment?: number;
  /** Max amortization rows stored (default 240). Pass MAX_LOAN_MONTHS for full schedule. */
  maxScheduleRows?: number;
}): AmortResult {
  const principal = Math.max(0, options.principal);
  const termMonths = Math.max(0, Math.round(options.termMonths));
  const extra = Math.max(0, options.extraPayment ?? 0);
  const maxScheduleRows = options.maxScheduleRows ?? 240;
  const basePayment =
    options.fixedPayment != null && options.fixedPayment > 0
      ? options.fixedPayment
      : loanPmt(principal, options.annualRate, termMonths);
  const totalPayment = basePayment + extra;

  const empty: AmortResult = {
    basePayment,
    totalPayment,
    months: 0,
    interest: 0,
    totalPaid: 0,
    schedule: [],
    balanceSeries: [principal],
    unreachable: false,
  };

  if (principal <= 0) return empty;
  if (totalPayment <= 0) {
    return { ...empty, unreachable: true, months: MAX_LOAN_MONTHS };
  }

  const r = options.annualRate / 100 / 12;
  let balance = principal;
  let months = 0;
  let interest = 0;
  let totalPaid = 0;
  const schedule: AmortRow[] = [];
  const balanceSeries: number[] = [balance];

  while (balance > 0.01 && months < MAX_LOAN_MONTHS) {
    months += 1;
    const interestPortion = balance * r;
    if (totalPayment <= interestPortion + 1e-9) {
      return {
        basePayment,
        totalPayment,
        months,
        interest,
        totalPaid,
        schedule,
        balanceSeries,
        unreachable: true,
      };
    }
    let principalPortion = totalPayment - interestPortion;
    let payment = totalPayment;
    if (principalPortion > balance) {
      principalPortion = balance;
      payment = interestPortion + principalPortion;
    }
    interest += interestPortion;
    balance -= principalPortion;
    totalPaid += payment;
    if (balance < 0.01) balance = 0;

    if (schedule.length < maxScheduleRows) {
      schedule.push({
        month: months,
        payment,
        interest: interestPortion,
        principal: principalPortion,
        balance,
      });
    }
    if (balanceSeries.length < BALANCE_SERIES_CAP) balanceSeries.push(balance);
  }

  return {
    basePayment,
    totalPayment,
    months,
    interest,
    totalPaid,
    schedule,
    balanceSeries,
    unreachable: balance > 0.01,
  };
}

export type CreditCardScenario = {
  label: string;
  months: number;
  interest: number;
  totalPaid: number;
  firstPayment: number;
  balanceSeries: number[];
  unreachable: boolean;
};

export function simulateCreditCardPayoff(options: {
  balance: number;
  annualRate: number;
  minPaymentPercent: number;
  minPaymentFloor: number;
  /** Extra dollars on top of the calculated minimum each month. */
  extraPayment?: number;
  /** If set, pay this fixed amount each month instead of the minimum formula. */
  fixedPayment?: number;
}): CreditCardScenario {
  const {
    balance: start,
    annualRate,
    minPaymentPercent,
    minPaymentFloor,
    extraPayment = 0,
    fixedPayment,
  } = options;

  const r = annualRate / 100 / 12;
  let balance = Math.max(0, start);
  let months = 0;
  let interest = 0;
  let totalPaid = 0;
  let firstPayment = 0;
  const balanceSeries: number[] = [balance];

  if (balance <= 0) {
    return {
      label: "Paid off",
      months: 0,
      interest: 0,
      totalPaid: 0,
      firstPayment: 0,
      balanceSeries,
      unreachable: false,
    };
  }

  while (balance > 0.01 && months < MAX_LOAN_MONTHS) {
    months += 1;
    const interestPortion = balance * r;
    interest += interestPortion;
    balance += interestPortion;

    let pay: number;
    if (fixedPayment != null && fixedPayment > 0) {
      pay = fixedPayment;
    } else {
      const minPay = Math.max(
        minPaymentFloor,
        (balance * minPaymentPercent) / 100
      );
      pay = minPay + Math.max(0, extraPayment);
    }
    pay = Math.min(pay, balance);
    if (months === 1) firstPayment = pay;

    if (pay <= interestPortion + 1e-9 && balance > pay) {
      return {
        label: "Minimum / fixed",
        months,
        interest,
        totalPaid,
        firstPayment,
        balanceSeries,
        unreachable: true,
      };
    }

    balance -= pay;
    totalPaid += pay;
    if (balance < 0.01) balance = 0;
    if (balanceSeries.length < BALANCE_SERIES_CAP) balanceSeries.push(balance);
  }

  return {
    label: "Payoff",
    months,
    interest,
    totalPaid,
    firstPayment,
    balanceSeries,
    unreachable: balance > 0.01,
  };
}

export type RefinanceResult = {
  oldPayment: number;
  newPayment: number;
  monthlySavings: number;
  oldTotal: number;
  newTotal: number;
  lifetimeSavings: number;
  breakEvenMonths: number;
  oldAmort: AmortResult;
  newAmort: AmortResult;
};

export function simulateRefinance(options: {
  balance: number;
  currentRate: number;
  currentTerm: number;
  newRate: number;
  newTerm: number;
  fees: number;
}): RefinanceResult {
  const oldAmort = amortizeLoan({
    principal: options.balance,
    annualRate: options.currentRate,
    termMonths: options.currentTerm,
  });
  const newAmort = amortizeLoan({
    principal: options.balance,
    annualRate: options.newRate,
    termMonths: options.newTerm,
  });
  const oldPayment = oldAmort.basePayment;
  const newPayment = newAmort.basePayment;
  const monthlySavings = oldPayment - newPayment;
  const oldTotal = oldAmort.totalPaid;
  const newTotal = newAmort.totalPaid + Math.max(0, options.fees);
  const lifetimeSavings = oldTotal - newTotal;
  const breakEvenMonths =
    monthlySavings > 0.01 ? Math.max(0, options.fees) / monthlySavings : Infinity;

  return {
    oldPayment,
    newPayment,
    monthlySavings,
    oldTotal,
    newTotal,
    lifetimeSavings,
    breakEvenMonths,
    oldAmort,
    newAmort,
  };
}

export type HomeEquityResult = {
  maxLoan: number;
  loanUsed: number;
  payment: number;
  interest: number;
  totalPaid: number;
  equityUsedPct: number;
  amort: AmortResult;
  capped: boolean;
};

export function simulateHomeEquity(options: {
  homeValue: number;
  mortgageBalance: number;
  ltvLimit: number;
  loanAmount: number;
  annualRate: number;
  termMonths: number;
}): HomeEquityResult {
  const maxLoan = Math.max(
    0,
    (options.homeValue * options.ltvLimit) / 100 - options.mortgageBalance
  );
  const loanUsed = Math.min(Math.max(0, options.loanAmount), maxLoan);
  const amort = amortizeLoan({
    principal: loanUsed,
    annualRate: options.annualRate,
    termMonths: options.termMonths,
  });
  return {
    maxLoan,
    loanUsed,
    payment: amort.basePayment,
    interest: amort.interest,
    totalPaid: amort.totalPaid,
    equityUsedPct: maxLoan > 0 ? (loanUsed / maxLoan) * 100 : 0,
    amort,
    capped: options.loanAmount > maxLoan + 0.01,
  };
}

export type BiWeeklyResult = {
  monthlyPayment: number;
  biWeeklyPayment: number;
  monthly: AmortResult;
  biWeeklyApprox: AmortResult;
  extraMonthlyMatch: AmortResult;
  interestSavedVsMonthly: number;
  monthsSavedVsMonthly: number;
};

export function simulateBiWeekly(options: {
  principal: number;
  annualRate: number;
  termYears: number;
  /** Optional extra monthly on top of standard monthly (third scenario). */
  extraMonthly?: number;
}): BiWeeklyResult {
  const termMonths = Math.max(1, Math.round(options.termYears * 12));
  const monthlyPayment = loanPmt(
    options.principal,
    options.annualRate,
    termMonths
  );
  const monthly = amortizeLoan({
    principal: options.principal,
    annualRate: options.annualRate,
    termMonths,
  });
  // 26 half-payments/year ≈ 13/12 of a monthly payment applied monthly.
  const biWeeklyApprox = amortizeLoan({
    principal: options.principal,
    annualRate: options.annualRate,
    termMonths,
    fixedPayment: monthlyPayment * (13 / 12),
  });
  const extraMonthlyMatch = amortizeLoan({
    principal: options.principal,
    annualRate: options.annualRate,
    termMonths,
    extraPayment: options.extraMonthly ?? monthlyPayment / 12,
  });

  return {
    monthlyPayment,
    biWeeklyPayment: monthlyPayment / 2,
    monthly,
    biWeeklyApprox,
    extraMonthlyMatch,
    interestSavedVsMonthly: Math.max(
      0,
      monthly.interest - biWeeklyApprox.interest
    ),
    monthsSavedVsMonthly: Math.max(0, monthly.months - biWeeklyApprox.months),
  };
}

export type BalloonResult = {
  payment: number;
  balloon: number;
  balloonMonths: number;
  interestBeforeBalloon: number;
  totalPaidBeforeBalloon: number;
  schedule: AmortRow[];
  balanceSeries: number[];
};

export function simulateBalloon(options: {
  principal: number;
  annualRate: number;
  amortYears: number;
  balloonYears: number;
}): BalloonResult {
  const amortMonths = Math.max(1, Math.round(options.amortYears * 12));
  const balloonMonths = Math.max(
    1,
    Math.min(amortMonths, Math.round(options.balloonYears * 12))
  );
  const payment = loanPmt(options.principal, options.annualRate, amortMonths);
  const balloon = Math.max(
    0,
    remainingBalanceAt(
      options.principal,
      options.annualRate,
      amortMonths,
      balloonMonths
    )
  );

  // Build schedule up to balloon using the amortizing payment.
  const partial = amortizeLoan({
    principal: options.principal,
    annualRate: options.annualRate,
    termMonths: amortMonths,
    fixedPayment: payment,
  });
  const schedule = partial.schedule.filter((r) => r.month <= balloonMonths);
  const balanceSeries = partial.balanceSeries.slice(0, balloonMonths + 1);
  const totalPaidBeforeBalloon = payment * balloonMonths;
  const interestBeforeBalloon =
    totalPaidBeforeBalloon - (options.principal - balloon);

  return {
    payment,
    balloon,
    balloonMonths,
    interestBeforeBalloon: Math.max(0, interestBeforeBalloon),
    totalPaidBeforeBalloon,
    schedule,
    balanceSeries,
  };
}

export type PersonalOffer = {
  id: string;
  label: string;
  principal: number;
  annualRate: number;
  termMonths: number;
  fees: number;
};

export function comparePersonalOffers(offers: PersonalOffer[]): {
  id: string;
  label: string;
  payment: number;
  interest: number;
  totalCost: number;
  amort: AmortResult;
}[] {
  return offers
    .filter((o) => o.principal > 0 && o.termMonths > 0)
    .map((o) => {
      const amort = amortizeLoan({
        principal: o.principal,
        annualRate: o.annualRate,
        termMonths: o.termMonths,
      });
      const totalCost = amort.totalPaid + Math.max(0, o.fees);
      return {
        id: o.id,
        label: o.label,
        payment: amort.basePayment,
        interest: amort.interest,
        totalCost,
        amort,
      };
    })
    .sort((a, b) => a.totalCost - b.totalCost);
}

/** Persist arbitrary numeric state bags per formula type. */
export function loadLoanToolState(
  formulaType: string
): Record<string, number> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(LOAN_STATE_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Record<string, Record<string, number>>;
    const bag = parsed[formulaType];
    if (!bag || typeof bag !== "object") return null;
    return bag;
  } catch {
    return null;
  }
}

export function saveLoanToolState(
  formulaType: string,
  values: Record<string, number>
): void {
  if (typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(LOAN_STATE_STORAGE_KEY);
    const parsed = raw
      ? (JSON.parse(raw) as Record<string, Record<string, number>>)
      : {};
    parsed[formulaType] = values;
    window.localStorage.setItem(LOAN_STATE_STORAGE_KEY, JSON.stringify(parsed));
  } catch {
    // Ignore quota / privacy-mode failures.
  }
}

export function schedulePreview(rows: AmortRow[], count = SCHEDULE_PREVIEW) {
  if (rows.length <= count * 2) return rows;
  return [...rows.slice(0, count), ...rows.slice(-count)];
}
