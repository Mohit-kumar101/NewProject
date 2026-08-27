/**
 * Milestone-based financial freedom & property planner.
 * Year-by-year simulation — planning estimates, not financial advice.
 */

export interface PropertyInput {
  id: string;
  name: string;
  purchaseYear: number;
  price: number;
  downPaymentPct: number;
  mortgageRatePct: number;
  termYears: number;
  monthlyRent: number;
  vacancyPct: number;
  expensePct: number;
  appreciationPct: number;
}

export interface FreedomPlannerInputs {
  currentAge: number;
  horizonYears: number;
  currentInvestments: number;
  annualSalary: number;
  salaryGrowthPct: number;
  sideIncome: number;
  sideGrowthPct: number;
  monthlyExpenses: number;
  expenseInflationPct: number;
  stockReturnPct: number;
  bondReturnPct: number;
  stockAllocationPct: number;
  withdrawalRatePct: number;
  properties: PropertyInput[];
}

export interface Milestone {
  year: number;
  age: number;
  type: "fire" | "property" | "net-worth";
  label: string;
  value: number;
}

export interface YearSnapshot {
  year: number;
  age: number;
  salary: number;
  sideIncome: number;
  totalIncome: number;
  expenses: number;
  savings: number;
  portfolio: number;
  propertyEquity: number;
  netWorth: number;
  rentalIncome: number;
}

export interface FreedomPlannerResult {
  fireYear: number | null;
  fireAge: number | null;
  fireNumber: number;
  finalNetWorth: number;
  milestones: Milestone[];
  timeline: YearSnapshot[];
  monthlyPassiveAtFire: number;
  savingsRatePct: number;
  insight: string;
}

type ActiveMortgage = {
  property: PropertyInput;
  balance: number;
  monthlyPayment: number;
  equity: number;
  value: number;
};

function clamp(n: number, min: number, max: number): number {
  if (!Number.isFinite(n)) return min;
  return Math.min(max, Math.max(min, n));
}

function monthlyPayment(principal: number, ratePct: number, years: number): number {
  if (principal <= 0) return 0;
  const r = ratePct / 100 / 12;
  const n = years * 12;
  if (r === 0) return principal / n;
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

function blendedReturn(stockPct: number, stockRet: number, bondRet: number): number {
  const w = clamp(stockPct, 0, 100) / 100;
  return w * stockRet + (1 - w) * bondRet;
}

export function calculateFreedomPlan(
  inputs: FreedomPlannerInputs
): FreedomPlannerResult {
  const horizon = clamp(inputs.horizonYears, 1, 50);
  const age0 = clamp(inputs.currentAge, 18, 80);
  let portfolio = Math.max(0, inputs.currentInvestments);
  let salary = Math.max(0, inputs.annualSalary);
  let side = Math.max(0, inputs.sideIncome);
  let monthlyExp = Math.max(0, inputs.monthlyExpenses);

  const returnPct = blendedReturn(
    inputs.stockAllocationPct,
    inputs.stockReturnPct,
    inputs.bondReturnPct
  );

  const mortgages: ActiveMortgage[] = [];
  const milestones: Milestone[] = [];
  const timeline: YearSnapshot[] = [];

  let fireYear: number | null = null;
  let fireAge: number | null = null;

  const netWorthMarks = [250_000, 500_000, 750_000, 1_000_000, 2_000_000];
  const hitMarks = new Set<number>();

  for (let y = 0; y <= horizon; y++) {
    const age = age0 + y;
    const annualExpenses = monthlyExp * 12;

    if (y > 0) {
      salary *= 1 + inputs.salaryGrowthPct / 100;
      side *= 1 + inputs.sideGrowthPct / 100;
      monthlyExp *= 1 + inputs.expenseInflationPct / 100;
    }

    let propertySpend = 0;
    let rentalIncome = 0;
    let propertyEquity = 0;

    for (const prop of inputs.properties) {
      if (y === prop.purchaseYear && prop.price > 0) {
        const down = prop.price * (prop.downPaymentPct / 100);
        const loan = prop.price - down;
        const pmt = monthlyPayment(loan, prop.mortgageRatePct, prop.termYears);
        portfolio -= down;
        propertySpend += down;
        mortgages.push({
          property: prop,
          balance: loan,
          monthlyPayment: pmt,
          equity: down,
          value: prop.price,
        });
        milestones.push({
          year: y,
          age,
          type: "property",
          label: `Acquire: ${prop.name}`,
          value: prop.price,
        });
      }
    }

    for (const m of mortgages) {
      m.value *= 1 + m.property.appreciationPct / 100;
      const annualDebtService = m.monthlyPayment * 12;
      const grossRent = m.property.monthlyRent * 12;
      const effectiveRent = grossRent * (1 - m.property.vacancyPct / 100);
      const opEx = grossRent * (m.property.expensePct / 100);
      const netRent = effectiveRent - opEx - annualDebtService;

      rentalIncome += Math.max(0, effectiveRent - opEx);
      propertySpend += Math.max(0, annualDebtService - effectiveRent + opEx);

      const r = m.property.mortgageRatePct / 100 / 12;
      for (let mo = 0; mo < 12; mo++) {
        const interest = m.balance * r;
        const principal = m.monthlyPayment - interest;
        m.balance = Math.max(0, m.balance - principal);
      }
      m.equity = m.value - m.balance;
      propertyEquity += m.equity;
    }

    const totalIncome = salary + side + rentalIncome;
    const expenses = monthlyExp * 12 + propertySpend;
    const savings = totalIncome - expenses;

    if (y > 0 && portfolio > 0) {
      portfolio *= 1 + returnPct / 100;
    }
    portfolio += Math.max(0, savings);

    const netWorth = portfolio + propertyEquity;
    const fireNumber =
      inputs.withdrawalRatePct > 0
        ? (monthlyExp * 12) / (inputs.withdrawalRatePct / 100)
        : Infinity;

    timeline.push({
      year: y,
      age,
      salary,
      sideIncome: side,
      totalIncome,
      expenses,
      savings,
      portfolio,
      propertyEquity,
      netWorth,
      rentalIncome,
    });

    for (const mark of netWorthMarks) {
      if (netWorth >= mark && !hitMarks.has(mark)) {
        hitMarks.add(mark);
        milestones.push({
          year: y,
          age,
          type: "net-worth",
          label: `Net worth ≥ $${(mark / 1000).toFixed(0)}k`,
          value: netWorth,
        });
      }
    }

    if (fireYear == null && portfolio >= fireNumber && fireNumber < Infinity) {
      fireYear = y;
      fireAge = age;
      milestones.push({
        year: y,
        age,
        type: "fire",
        label: "Financial independence (FIRE)",
        value: portfolio,
      });
    }
  }

  milestones.sort((a, b) => a.year - b.year || a.label.localeCompare(b.label));

  const last = timeline[timeline.length - 1];
  const fireNumber =
    inputs.withdrawalRatePct > 0
      ? (inputs.monthlyExpenses * 12) / (inputs.withdrawalRatePct / 100)
      : 0;

  const savingsRatePct =
    last && last.totalIncome > 0
      ? (last.savings / last.totalIncome) * 100
      : 0;

  const insight =
    fireYear != null
      ? `Portfolio crosses your FIRE target (~$${Math.round(fireNumber).toLocaleString()}) around year ${fireYear} (age ${fireAge}).`
      : fireNumber > 0
        ? `At current savings, FIRE (~$${Math.round(fireNumber).toLocaleString()}) is not reached within ${horizon} years — try raising income, lowering expenses, or extending the horizon.`
        : "Set a withdrawal rate to compute your FIRE number.";

  return {
    fireYear,
    fireAge,
    fireNumber,
    finalNetWorth: last?.netWorth ?? portfolio,
    milestones,
    timeline,
    monthlyPassiveAtFire:
      fireNumber > 0 ? (fireNumber * inputs.withdrawalRatePct) / 100 / 12 : 0,
    savingsRatePct,
    insight,
  };
}

export const DEFAULT_PROPERTY = (): PropertyInput => ({
  id: crypto.randomUUID(),
  name: "Rental Property 1",
  purchaseYear: 5,
  price: 350_000,
  downPaymentPct: 20,
  mortgageRatePct: 6.5,
  termYears: 30,
  monthlyRent: 2200,
  vacancyPct: 5,
  expensePct: 35,
  appreciationPct: 3,
});
