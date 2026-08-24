/** Client-side debt avalanche / snowball simulation + local persistence. */

export type DebtStrategy = "avalanche" | "snowball";

export type DebtEntry = {
  id: string;
  name: string;
  balance: number;
  apr: number;
  minPayment: number;
};

export type DebtPayoffState = {
  debts: DebtEntry[];
  extraPayment: number;
};

export type DebtMilestone = {
  month: number;
  debtId: string;
  debtName: string;
};

export type DebtMonthSnapshot = {
  month: number;
  remainingBalance: number;
  interestThisMonth: number;
  paidThisMonth: number;
  focusDebtName: string | null;
};

export type DebtSimulationResult = {
  strategy: DebtStrategy;
  months: number;
  totalInterest: number;
  totalPaid: number;
  startingBalance: number;
  firstWinMonth: number | null;
  milestones: DebtMilestone[];
  /** Lightweight monthly series for charts / summaries (capped). */
  schedule: DebtMonthSnapshot[];
  /** True when debts cannot be paid off within the safety horizon. */
  unreachable: boolean;
  /** True when at least one debt's min payment cannot cover monthly interest. */
  interestTrap: boolean;
};

export type DebtComparison = {
  avalanche: DebtSimulationResult;
  snowball: DebtSimulationResult;
  /** Avalanche interest − snowball interest (negative ⇒ avalanche cheaper). */
  interestDeltaAvalancheVsSnowball: number;
  /**
   * How many months sooner snowball clears the first debt vs avalanche.
   * Positive ⇒ snowball wins psychologically first.
   */
  snowballFirstWinSoonerMonths: number;
  baseline: DebtSimulationResult;
  monthsSavedVsBaseline: number;
  interestSavedVsBaseline: number;
};

export const DEBT_PAYOFF_STORAGE_KEY = "calculiohub-debt-payoff-v1";
export const MAX_SIMULATION_MONTHS = 600;
export const EXTRA_PAYMENT_MAX = 1000;
const SCHEDULE_CAP = 600;

export const SAMPLE_DEBTS: DebtEntry[] = [
  {
    id: "sample_cc",
    name: "Chase Credit Card",
    balance: 4200,
    apr: 22.9,
    minPayment: 105,
  },
  {
    id: "sample_medical",
    name: "Medical Bill",
    balance: 650,
    apr: 0,
    minPayment: 50,
  },
  {
    id: "sample_car",
    name: "Car Loan",
    balance: 9800,
    apr: 7.4,
    minPayment: 285,
  },
  {
    id: "sample_personal",
    name: "Personal Loan",
    balance: 3100,
    apr: 12.5,
    minPayment: 120,
  },
];

export function createDebtId(): string {
  return `debt_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

/** Stable placeholder for SSR / first paint — never call createDebtId() during render. */
export const INITIAL_EMPTY_DEBT: DebtEntry = {
  id: "debt_placeholder",
  name: "",
  balance: 0,
  apr: 0,
  minPayment: 0,
};

export function createEmptyDebt(): DebtEntry {
  return {
    id: createDebtId(),
    name: "",
    balance: 0,
    apr: 0,
    minPayment: 0,
  };
}

export function formatDebtMoney(n: number): string {
  if (!Number.isFinite(n)) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(n);
}

export function formatDebtMonths(months: number): string {
  if (!Number.isFinite(months) || months < 0) return "—";
  const m = Math.round(months);
  if (m === 0) return "0 months";
  const years = Math.floor(m / 12);
  const rem = m % 12;
  if (years === 0) return `${m} month${m === 1 ? "" : "s"}`;
  if (rem === 0) return `${years} year${years === 1 ? "" : "s"} (${m} mo)`;
  return `${years}y ${rem}mo (${m} mo)`;
}

function sanitizeDebt(raw: unknown): DebtEntry | null {
  if (!raw || typeof raw !== "object") return null;
  const row = raw as Record<string, unknown>;
  const id = typeof row.id === "string" ? row.id : createDebtId();
  const name = typeof row.name === "string" ? row.name : "";
  const balance = Number(row.balance);
  const apr = Number(row.apr);
  const minPayment = Number(row.minPayment);
  if (![balance, apr, minPayment].every((n) => Number.isFinite(n))) return null;
  return {
    id,
    name,
    balance: Math.max(0, balance),
    apr: Math.max(0, apr),
    minPayment: Math.max(0, minPayment),
  };
}

export function loadDebtPayoffState(): DebtPayoffState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(DEBT_PAYOFF_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return null;
    const obj = parsed as Record<string, unknown>;
    const debtsRaw = Array.isArray(obj.debts) ? obj.debts : [];
    const debts = debtsRaw
      .map(sanitizeDebt)
      .filter((d): d is DebtEntry => d !== null);
    const extra = Number(obj.extraPayment);
    return {
      debts,
      extraPayment: Number.isFinite(extra)
        ? Math.min(EXTRA_PAYMENT_MAX, Math.max(0, extra))
        : 0,
    };
  } catch {
    return null;
  }
}

export function saveDebtPayoffState(state: DebtPayoffState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      DEBT_PAYOFF_STORAGE_KEY,
      JSON.stringify({
        debts: state.debts,
        extraPayment: state.extraPayment,
      })
    );
  } catch {
    // Ignore quota / privacy-mode write failures.
  }
}

function sortFocusOrder<T extends { balance: number; apr: number }>(
  items: T[],
  strategy: DebtStrategy
): T[] {
  return [...items].sort((a, b) => {
    if (strategy === "avalanche") {
      if (b.apr !== a.apr) return b.apr - a.apr;
      return a.balance - b.balance;
    }
    if (a.balance !== b.balance) return a.balance - b.balance;
    return b.apr - a.apr;
  });
}

type SimDebt = {
  id: string;
  name: string;
  balance: number;
  apr: number;
  minPayment: number;
  cleared: boolean;
};

/**
 * Month-by-month amortization for avalanche or snowball.
 * Minimums are paid on every open debt; leftover budget (extra + unused mins)
 * attacks the focus debt. Caps at MAX_SIMULATION_MONTHS to avoid infinite loops
 * when payments cannot cover interest.
 */
export function simulateDebtPayoff(
  debts: DebtEntry[],
  extraPayment: number,
  strategy: DebtStrategy
): DebtSimulationResult {
  const starting: SimDebt[] = debts
    .filter((d) => d.balance > 0.005)
    .map((d) => ({
      id: d.id,
      name: d.name.trim() || "Untitled debt",
      balance: d.balance,
      apr: Math.max(0, d.apr),
      minPayment: Math.max(0, d.minPayment),
      cleared: false,
    }));

  const startingBalance = starting.reduce((s, d) => s + d.balance, 0);
  const empty: DebtSimulationResult = {
    strategy,
    months: 0,
    totalInterest: 0,
    totalPaid: 0,
    startingBalance,
    firstWinMonth: null,
    milestones: [],
    schedule: [],
    unreachable: false,
    interestTrap: false,
  };

  if (starting.length === 0) return empty;

  const items = starting.map((d) => ({ ...d }));
  const extra = Math.max(0, extraPayment);
  // Fixed monthly outlay: original mins stay in the plan so paid-off mins
  // roll into the focus debt (classic snowball / avalanche).
  const fixedMonthlyBudget =
    items.reduce((s, d) => s + d.minPayment, 0) + extra;

  let months = 0;
  let totalInterest = 0;
  let totalPaid = 0;
  let firstWinMonth: number | null = null;
  const milestones: DebtMilestone[] = [];
  const schedule: DebtMonthSnapshot[] = [];

  let interestTrap = false;
  for (const d of items) {
    const monthlyInterest = (d.balance * d.apr) / 100 / 12;
    if (d.minPayment + 1e-9 < monthlyInterest) {
      interestTrap = true;
      break;
    }
  }

  if (fixedMonthlyBudget <= 0) {
    return {
      ...empty,
      unreachable: true,
      interestTrap,
    };
  }

  while (items.some((d) => d.balance > 0.01) && months < MAX_SIMULATION_MONTHS) {
    months += 1;
    let interestThisMonth = 0;
    let paidThisMonth = 0;

    for (const d of items) {
      if (d.balance <= 0.01) {
        d.balance = 0;
        continue;
      }
      const interestPortion = (d.balance * d.apr) / 100 / 12;
      d.balance += interestPortion;
      totalInterest += interestPortion;
      interestThisMonth += interestPortion;
    }

    const openBeforePay = items.filter((d) => d.balance > 0.01);
    if (openBeforePay.length === 0) break;

    const focus = sortFocusOrder(openBeforePay, strategy)[0] ?? null;
    let remainingBudget = fixedMonthlyBudget;

    // Phase 1: contractual minimums on every open debt.
    for (const d of openBeforePay) {
      if (remainingBudget <= 0.01) break;
      const pay = Math.min(d.balance, d.minPayment, remainingBudget);
      d.balance -= pay;
      remainingBudget -= pay;
      paidThisMonth += pay;
      totalPaid += pay;
    }

    // Phase 2: dump leftover (extra + freed mins) onto focus order.
    const stillOpen = sortFocusOrder(
      items.filter((d) => d.balance > 0.01),
      strategy
    );
    for (const d of stillOpen) {
      if (remainingBudget <= 0.01) break;
      const pay = Math.min(d.balance, remainingBudget);
      d.balance -= pay;
      remainingBudget -= pay;
      paidThisMonth += pay;
      totalPaid += pay;
    }

    for (const d of items) {
      if (d.balance <= 0.01 && !d.cleared) {
        d.balance = 0;
        d.cleared = true;
        milestones.push({
          month: months,
          debtId: d.id,
          debtName: d.name,
        });
        if (firstWinMonth === null) firstWinMonth = months;
      }
    }

    if (schedule.length < SCHEDULE_CAP) {
      schedule.push({
        month: months,
        remainingBalance: items.reduce((s, d) => s + Math.max(0, d.balance), 0),
        interestThisMonth,
        paidThisMonth,
        focusDebtName: focus?.name ?? null,
      });
    }

    // Bail early if balances are growing under an interest trap.
    if (
      interestTrap &&
      months >= 3 &&
      items.reduce((s, d) => s + d.balance, 0) > startingBalance * 1.02
    ) {
      return {
        strategy,
        months,
        totalInterest,
        totalPaid,
        startingBalance,
        firstWinMonth,
        milestones,
        schedule,
        unreachable: true,
        interestTrap: true,
      };
    }
  }

  const unreachable = items.some((d) => d.balance > 0.01);

  return {
    strategy,
    months: unreachable ? MAX_SIMULATION_MONTHS : months,
    totalInterest,
    totalPaid,
    startingBalance,
    firstWinMonth,
    milestones,
    schedule,
    unreachable,
    interestTrap,
  };
}

/** Compare avalanche vs snowball at a given extra payment, vs $0 extra baseline. */
export function compareDebtStrategies(
  debts: DebtEntry[],
  extraPayment: number,
  preferred: DebtStrategy = "avalanche"
): DebtComparison {
  const avalanche = simulateDebtPayoff(debts, extraPayment, "avalanche");
  const snowball = simulateDebtPayoff(debts, extraPayment, "snowball");
  const baseline = simulateDebtPayoff(debts, 0, preferred);

  const aWin = avalanche.firstWinMonth;
  const sWin = snowball.firstWinMonth;
  let snowballFirstWinSoonerMonths = 0;
  if (aWin != null && sWin != null) {
    snowballFirstWinSoonerMonths = aWin - sWin;
  }

  const preferredResult = preferred === "avalanche" ? avalanche : snowball;

  return {
    avalanche,
    snowball,
    interestDeltaAvalancheVsSnowball:
      avalanche.totalInterest - snowball.totalInterest,
    snowballFirstWinSoonerMonths,
    baseline,
    monthsSavedVsBaseline: Math.max(
      0,
      baseline.months - preferredResult.months
    ),
    interestSavedVsBaseline: Math.max(
      0,
      baseline.totalInterest - preferredResult.totalInterest
    ),
  };
}

export function activeDebts(debts: DebtEntry[]): DebtEntry[] {
  return debts.filter((d) => d.balance > 0);
}

export function totalMinPayments(debts: DebtEntry[]): number {
  return activeDebts(debts).reduce((s, d) => s + Math.max(0, d.minPayment), 0);
}

export function totalBalances(debts: DebtEntry[]): number {
  return activeDebts(debts).reduce((s, d) => s + Math.max(0, d.balance), 0);
}

export type PlaybookStep = {
  id: string;
  kind: "setup" | "attack" | "celebrate" | "finish";
  title: string;
  detail: string;
  monthLabel?: string;
};

export const DEBT_PLAYBOOK_CHECKS_KEY = "calculiohub-debt-playbook-checks-v1";

/** Stable id for a plan so checkbox progress resets when the plan changes. */
export function playbookPlanKey(
  strategy: DebtStrategy,
  extraPayment: number,
  result: DebtSimulationResult
): string {
  const marks = result.milestones
    .map((m) => `${m.debtId}@${m.month}`)
    .join(",");
  return `${strategy}|${Math.round(extraPayment)}|${result.months}|${marks}`;
}

/**
 * Builds a month-by-month action checklist from a finished simulation.
 */
export function buildPlaybookSteps(
  debts: DebtEntry[],
  extraPayment: number,
  result: DebtSimulationResult
): PlaybookStep[] {
  const open = activeDebts(debts);
  if (open.length === 0 || result.unreachable) return [];

  const mins = totalMinPayments(debts);
  const monthlyTotal = mins + Math.max(0, extraPayment);
  const strategyLabel =
    result.strategy === "avalanche" ? "Avalanche (highest APR)" : "Snowball (smallest balance)";

  const steps: PlaybookStep[] = [
    {
      id: "setup",
      kind: "setup",
      title: "Lock in your monthly payment plan",
      detail: `Every month, pay ${formatDebtMoney(monthlyTotal)} total — ${formatDebtMoney(mins)} across minimums plus ${formatDebtMoney(Math.max(0, extraPayment))} extra toward the focus debt (${strategyLabel}).`,
      monthLabel: "Start",
    },
  ];

  let prevMonth = 0;
  result.milestones.forEach((m, index) => {
    const startMonth = prevMonth + 1;
    const range =
      startMonth === m.month
        ? `Month ${m.month}`
        : `Months ${startMonth}–${m.month}`;

    steps.push({
      id: `attack_${m.debtId}`,
      kind: "attack",
      title: `Attack ${m.debtName}`,
      detail: `Keep all minimums current. Pour every extra dollar into ${m.debtName} until the balance hits zero${index === 0 ? " — your first psychological win." : "."}`,
      monthLabel: range,
    });

    steps.push({
      id: `celebrate_${m.debtId}`,
      kind: "celebrate",
      title: `Clear ${m.debtName}`,
      detail: `Target: paid off by month ${m.month}. Celebrate, then roll its former minimum into the next focus debt automatically.`,
      monthLabel: `Month ${m.month}`,
    });

    prevMonth = m.month;
  });

  if (!result.unreachable) {
    steps.push({
      id: "finish",
      kind: "finish",
      title: "Debt-free finish line",
      detail: `Plan complete in ${formatDebtMonths(result.months)}. Estimated interest paid: ${formatDebtMoney(result.totalInterest)}. Total paid: ${formatDebtMoney(result.totalPaid)}.`,
      monthLabel: `Month ${result.months}`,
    });
  }

  return steps;
}

export function loadPlaybookChecks(planKey: string): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(DEBT_PLAYBOOK_CHECKS_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw) as { planKey?: string; checked?: string[] };
    if (parsed.planKey !== planKey || !Array.isArray(parsed.checked)) {
      return new Set();
    }
    return new Set(parsed.checked.filter((id) => typeof id === "string"));
  } catch {
    return new Set();
  }
}

export function savePlaybookChecks(planKey: string, checked: Set<string>): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      DEBT_PLAYBOOK_CHECKS_KEY,
      JSON.stringify({ planKey, checked: [...checked] })
    );
  } catch {
    // Ignore quota / privacy-mode write failures.
  }
}

/** Plain-text playbook for CSV-adjacent download / copy. */
export function playbookToPlainText(
  strategy: DebtStrategy,
  steps: PlaybookStep[],
  checked: Set<string>
): string {
  const label = strategy === "avalanche" ? "Debt Avalanche" : "Debt Snowball";
  const lines = [
    `CalculioHub — ${label} Action Playbook`,
    `Generated ${new Date().toISOString().slice(0, 10)}`,
    "",
  ];
  steps.forEach((step, i) => {
    const mark = checked.has(step.id) ? "[x]" : "[ ]";
    lines.push(`${mark} ${i + 1}. ${step.monthLabel ?? ""} — ${step.title}`);
    lines.push(`    ${step.detail}`);
    lines.push("");
  });
  return lines.join("\n");
}

