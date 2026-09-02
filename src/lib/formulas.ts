import type { CalcResult } from "./types";
import { runCryptoCalculation } from "./cryptoFormulas";
import {
  modeFromFormulaType,
  runAffordabilityCalculation,
} from "./formulas_affordability";
import { isHealthFormulaType, runHealthCalculation } from "./formulas_health";
import { isNiche50FormulaType, runNiche50Calculation } from "./formulas_niche50";
import { isTradesFormulaType, runTradesCalculation } from "./formulas_trades";
import { isTechFormulaType, runTechCalculation } from "./formulas_tech";

type Inputs = Record<string, number>;

const currency = (n: number, digits = 2): string => {
  if (!Number.isFinite(n)) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(n);
};

const number = (n: number, digits = 2): string => {
  if (!Number.isFinite(n)) return "—";
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(n);
};

const monthsLabel = (months: number): string => {
  if (!Number.isFinite(months) || months < 0) return "—";
  const m = Math.ceil(months);
  const y = Math.floor(m / 12);
  const rem = m % 12;
  if (y === 0) return `${m} mo`;
  if (rem === 0) return `${y} yr`;
  return `${y} yr ${rem} mo`;
};

function pmt(principal: number, annualRate: number, termMonths: number): number {
  if (termMonths <= 0) return 0;
  const r = annualRate / 100 / 12;
  if (Math.abs(r) < 1e-12) return principal / termMonths;
  return (principal * r) / (1 - Math.pow(1 + r, -termMonths));
}

function totalInterestPaid(
  principal: number,
  annualRate: number,
  payment: number,
  maxMonths = 1200
): { months: number; interest: number; totalPaid: number } {
  let balance = principal;
  let months = 0;
  let interest = 0;
  const r = annualRate / 100 / 12;

  if (payment <= 0) {
    return { months: Infinity, interest: Infinity, totalPaid: Infinity };
  }

  while (balance > 0.01 && months < maxMonths) {
    const interestPortion = balance * r;
    let principalPortion = payment - interestPortion;
    if (principalPortion <= 0) {
      return { months: Infinity, interest: Infinity, totalPaid: Infinity };
    }
    if (principalPortion > balance) principalPortion = balance;
    interest += interestPortion;
    balance -= principalPortion;
    months += 1;
  }

  return {
    months,
    interest,
    totalPaid: principal + interest,
  };
}

function amortizeWithExtra(
  principal: number,
  annualRate: number,
  termMonths: number,
  extraPayment: number
): { payment: number; months: number; interest: number; totalPaid: number } {
  const base = pmt(principal, annualRate, termMonths);
  const payment = base + Math.max(0, extraPayment);
  const result = totalInterestPaid(principal, annualRate, payment);
  return { payment: base, months: result.months, interest: result.interest, totalPaid: result.totalPaid };
}

function remainingBalance(
  principal: number,
  annualRate: number,
  amortMonths: number,
  paidMonths: number
): number {
  const r = annualRate / 100 / 12;
  const payment = pmt(principal, annualRate, amortMonths);
  if (Math.abs(r) < 1e-12) {
    return Math.max(0, principal - payment * paidMonths);
  }
  return (
    principal * Math.pow(1 + r, paidMonths) -
    payment * ((Math.pow(1 + r, paidMonths) - 1) / r)
  );
}

function fvAnnuity(
  principal: number,
  monthlyContribution: number,
  annualRate: number,
  years: number
): number {
  const r = annualRate / 100 / 12;
  const n = years * 12;
  if (Math.abs(r) < 1e-12) return principal + monthlyContribution * n;
  const fvPrincipal = principal * Math.pow(1 + r, n);
  const fvContrib = monthlyContribution * ((Math.pow(1 + r, n) - 1) / r);
  return fvPrincipal + fvContrib;
}

function monthsToGoal(
  target: number,
  current: number,
  monthly: number,
  annualRate: number
): number {
  const remaining = target - current;
  if (remaining <= 0) return 0;
  if (monthly <= 0 && annualRate <= 0) return Infinity;
  const r = annualRate / 100 / 12;
  let balance = current;
  let months = 0;
  while (balance < target && months < 1200) {
    balance = balance * (1 + r) + monthly;
    months += 1;
  }
  return months;
}

function requiredMonthlyForGoal(
  goal: number,
  current: number,
  months: number,
  annualRate: number
): number {
  const r = annualRate / 100 / 12;
  const futureCurrent = current * Math.pow(1 + r, months);
  const need = goal - futureCurrent;
  if (need <= 0) return 0;
  if (Math.abs(r) < 1e-12) return need / months;
  return need / ((Math.pow(1 + r, months) - 1) / r);
}

function debtPayoffSimulation(
  debts: { balance: number; rate: number }[],
  monthlyBudget: number,
  mode: "snowball" | "avalanche"
): { months: number; interest: number; totalPaid: number } {
  const items = debts
    .filter((d) => d.balance > 0)
    .map((d) => ({ ...d }));

  if (items.length === 0) return { months: 0, interest: 0, totalPaid: 0 };
  if (monthlyBudget <= 0) return { months: Infinity, interest: Infinity, totalPaid: Infinity };

  let months = 0;
  let interest = 0;
  let totalPaid = 0;

  while (items.some((d) => d.balance > 0.01) && months < 1200) {
    months += 1;
    let budget = monthlyBudget;

    for (const d of items) {
      if (d.balance <= 0) continue;
      const interestPortion = (d.balance * d.rate) / 100 / 12;
      d.balance += interestPortion;
      interest += interestPortion;
    }

    const ordered = [...items]
      .filter((d) => d.balance > 0.01)
      .sort((a, b) =>
        mode === "snowball" ? a.balance - b.balance : b.rate - a.rate
      );

    // Minimum-ish allocation: interest + tiny principal, then avalanche/snowball extra
    for (const d of ordered) {
      if (budget <= 0) break;
      const minPay = Math.min(d.balance, Math.max(25, (d.balance * d.rate) / 100 / 12 + 10));
      const pay = Math.min(budget, minPay);
      d.balance -= pay;
      budget -= pay;
      totalPaid += pay;
    }

    if (budget > 0) {
      for (const d of ordered) {
        if (budget <= 0 || d.balance <= 0.01) continue;
        const pay = Math.min(budget, d.balance);
        d.balance -= pay;
        budget -= pay;
        totalPaid += pay;
      }
    }
  }

  return { months, interest, totalPaid };
}

const cad = (n: number): string => {
  if (!Number.isFinite(n)) return "—";
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(n);
};

/** BC 2026 private-sale used-vehicle PST rate on taxable value. */
function bcUsedVehiclePstRate(taxableValue: number, isZev: boolean): number {
  if (isZev) return 0;
  if (taxableValue < 125_000) return 0.12;
  if (taxableValue < 150_000) return 0.15;
  return 0.2;
}

function result(
  primaryLabel: string,
  primaryValue: string,
  secondary: { label: string; value: string }[]
): CalcResult {
  return {
    primary: { label: primaryLabel, value: primaryValue, highlight: true },
    secondary,
  };
}

export function runCalculation(
  formulaType: string,
  inputs: Inputs
): CalcResult {
  switch (formulaType) {
    case "carLoanPayoff":
    case "studentLoanPayoff": {
      const { payment, months, interest, totalPaid } = amortizeWithExtra(
        inputs.principal,
        inputs.annualRate,
        inputs.termMonths,
        inputs.extraPayment
      );
      return result("Monthly Payment", currency(payment), [
        { label: "Payoff Time", value: monthsLabel(months) },
        { label: "Total Interest", value: currency(interest) },
        { label: "Total Amount Paid", value: currency(totalPaid) },
      ]);
    }

    case "personalLoan":
    case "monthlyMortgage": {
      const principal =
        formulaType === "monthlyMortgage"
          ? Math.max(0, inputs.homePrice - inputs.downPayment)
          : inputs.principal;
      const termMonths =
        formulaType === "monthlyMortgage"
          ? inputs.termYears * 12
          : inputs.termMonths;
      const payment = pmt(principal, inputs.annualRate, termMonths);
      const totalPaid = payment * termMonths;
      return result("Monthly Payment", currency(payment), [
        { label: "Loan Principal", value: currency(principal) },
        { label: "Total Interest", value: currency(totalPaid - principal) },
        { label: "Total Paid", value: currency(totalPaid) },
      ]);
    }

    case "creditCardMinimum": {
      let balance = inputs.balance;
      const r = inputs.annualRate / 100 / 12;
      let months = 0;
      let interest = 0;
      let totalPaid = 0;
      while (balance > 0.01 && months < 1200) {
        const interestPortion = balance * r;
        interest += interestPortion;
        balance += interestPortion;
        const minPay = Math.max(
          inputs.minPaymentFloor,
          (balance * inputs.minPaymentPercent) / 100
        );
        const pay = Math.min(minPay, balance);
        balance -= pay;
        totalPaid += pay;
        months += 1;
      }
      return result("Months to Pay Off", monthsLabel(months), [
        { label: "Total Interest", value: currency(interest) },
        { label: "Total Amount Paid", value: currency(totalPaid) },
        {
          label: "First Month Payment",
          value: currency(
            Math.max(
              inputs.minPaymentFloor,
              (inputs.balance * inputs.minPaymentPercent) / 100
            )
          ),
        },
      ]);
    }

    case "debtSnowball": {
      const debts = [
        { balance: inputs.debt1, rate: inputs.avgRate },
        { balance: inputs.debt2, rate: inputs.avgRate },
        { balance: inputs.debt3, rate: inputs.avgRate },
      ];
      const sim = debtPayoffSimulation(debts, inputs.monthlyBudget, "snowball");
      return result("Debt-Free In", monthsLabel(sim.months), [
        { label: "Total Interest", value: currency(sim.interest) },
        { label: "Total Paid", value: currency(sim.totalPaid) },
        {
          label: "Starting Debt",
          value: currency(inputs.debt1 + inputs.debt2 + inputs.debt3),
        },
      ]);
    }

    case "debtAvalanche": {
      const debts = [
        { balance: inputs.debt1, rate: inputs.rate1 },
        { balance: inputs.debt2, rate: inputs.rate2 },
        { balance: inputs.debt3, rate: inputs.rate3 },
      ];
      const sim = debtPayoffSimulation(debts, inputs.monthlyBudget, "avalanche");
      return result("Debt-Free In", monthsLabel(sim.months), [
        { label: "Total Interest", value: currency(sim.interest) },
        { label: "Total Paid", value: currency(sim.totalPaid) },
        {
          label: "Starting Debt",
          value: currency(inputs.debt1 + inputs.debt2 + inputs.debt3),
        },
      ]);
    }

    case "loanRefinance": {
      const oldPay = pmt(inputs.balance, inputs.currentRate, inputs.currentTerm);
      const newPay = pmt(inputs.balance, inputs.newRate, inputs.newTerm);
      const oldTotal = oldPay * inputs.currentTerm;
      const newTotal = newPay * inputs.newTerm + inputs.fees;
      const monthlySavings = oldPay - newPay;
      const breakEven =
        monthlySavings > 0 ? inputs.fees / monthlySavings : Infinity;
      return result("New Monthly Payment", currency(newPay), [
        { label: "Current Payment", value: currency(oldPay) },
        { label: "Monthly Savings", value: currency(monthlySavings) },
        {
          label: "Lifetime Savings (incl. fees)",
          value: currency(oldTotal - newTotal),
        },
        {
          label: "Break-Even",
          value: Number.isFinite(breakEven) ? monthsLabel(breakEven) : "N/A",
        },
      ]);
    }

    case "homeEquityLoan": {
      const maxLoan = Math.max(
        0,
        (inputs.homeValue * inputs.ltvLimit) / 100 - inputs.mortgageBalance
      );
      const loan = Math.min(inputs.loanAmount, maxLoan);
      const payment = pmt(loan, inputs.annualRate, inputs.termMonths);
      return result("Monthly Payment", currency(payment), [
        { label: "Available Equity", value: currency(maxLoan) },
        { label: "Loan Amount Used", value: currency(loan) },
        {
          label: "Total Interest",
          value: currency(payment * inputs.termMonths - loan),
        },
      ]);
    }

    case "biWeeklyMortgage": {
      const termMonths = inputs.termYears * 12;
      const monthly = pmt(inputs.principal, inputs.annualRate, termMonths);
      const biWeekly = monthly / 2;
      const monthlyResult = totalInterestPaid(
        inputs.principal,
        inputs.annualRate,
        monthly
      );
      // Approximate bi-weekly as 26 half-payments / year = monthly * 13/12
      const accelerated = totalInterestPaid(
        inputs.principal,
        inputs.annualRate,
        monthly * (13 / 12)
      );
      return result("Bi-Weekly Payment", currency(biWeekly), [
        { label: "Standard Monthly Payment", value: currency(monthly) },
        { label: "Bi-Weekly Payoff", value: monthsLabel(accelerated.months) },
        { label: "Standard Payoff", value: monthsLabel(monthlyResult.months) },
        {
          label: "Interest Saved",
          value: currency(monthlyResult.interest - accelerated.interest),
        },
      ]);
    }

    case "balloonLoan": {
      const amortMonths = inputs.amortYears * 12;
      const balloonMonths = inputs.balloonYears * 12;
      const payment = pmt(inputs.principal, inputs.annualRate, amortMonths);
      const balloon = remainingBalance(
        inputs.principal,
        inputs.annualRate,
        amortMonths,
        balloonMonths
      );
      return result("Balloon Payment Due", currency(Math.max(0, balloon)), [
        { label: "Monthly Payment", value: currency(payment) },
        { label: "Payments Before Balloon", value: `${balloonMonths}` },
        {
          label: "Interest Before Balloon",
          value: currency(payment * balloonMonths - (inputs.principal - balloon)),
        },
      ]);
    }

    case "rentVsBuy": {
      const down = (inputs.homePrice * inputs.downPaymentPct) / 100;
      const loan = inputs.homePrice - down;
      const payment = pmt(loan, inputs.mortgageRate, 30 * 12);
      const months = inputs.years * 12;
      const futureHome =
        inputs.homePrice * Math.pow(1 + inputs.homeAppreciation / 100, inputs.years);
      const remaining = remainingBalance(loan, inputs.mortgageRate, 30 * 12, months);
      const buyEquity = futureHome - Math.max(0, remaining);
      const buyWealth = buyEquity;
      const monthlyDiff = payment - inputs.monthlyRent;
      const rentInvest = fvAnnuity(
        down,
        monthlyDiff > 0 ? monthlyDiff : 0,
        inputs.investReturn,
        inputs.years
      );
      return result(
        buyWealth >= rentInvest ? "Buying Looks Stronger" : "Renting Looks Stronger",
        buyWealth >= rentInvest ? currency(buyWealth) : currency(rentInvest),
        [
          { label: "Est. Home Equity (Buy)", value: currency(buyWealth) },
          { label: "Est. Invested Wealth (Rent)", value: currency(rentInvest) },
          { label: "Monthly Mortgage P&I", value: currency(payment) },
          { label: "Down Payment", value: currency(down) },
        ]
      );
    }

    case "homeAffordability": {
      const monthlyIncome = inputs.annualIncome / 12;
      const maxHousing = (monthlyIncome * inputs.dtiLimit) / 100 - inputs.monthlyDebts;
      const payment = Math.max(0, maxHousing);
      const termMonths = inputs.termYears * 12;
      const r = inputs.annualRate / 100 / 12;
      let loan = 0;
      if (payment > 0) {
        if (Math.abs(r) < 1e-12) loan = payment * termMonths;
        else loan = payment * ((1 - Math.pow(1 + r, -termMonths)) / r);
      }
      const maxPrice = loan + inputs.downPayment;
      return result("Max Home Price", currency(maxPrice), [
        { label: "Max Loan Amount", value: currency(loan) },
        { label: "Affordable Monthly P&I", value: currency(payment) },
        { label: "Down Payment", value: currency(inputs.downPayment) },
      ]);
    }

    case "propertyTax": {
      const annual = Math.max(0, (inputs.assessedValue * inputs.taxRate) / 100 - inputs.exemptions);
      return result("Annual Property Tax", currency(annual), [
        { label: "Monthly Escrow Estimate", value: currency(annual / 12) },
        { label: "Effective Rate", value: `${number(inputs.taxRate, 2)}%` },
      ]);
    }

    case "rentalCashFlow": {
      const effectiveRent = inputs.monthlyRent * (1 - inputs.vacancyRate / 100);
      const noi = effectiveRent - inputs.operatingExpenses;
      const cashFlow = noi - inputs.mortgagePayment;
      return result("Monthly Cash Flow", currency(cashFlow), [
        { label: "Effective Gross Rent", value: currency(effectiveRent) },
        { label: "Monthly NOI", value: currency(noi) },
        { label: "Annual Cash Flow", value: currency(cashFlow * 12) },
      ]);
    }

    case "capRate": {
      const cap = inputs.propertyValue > 0 ? (inputs.noi / inputs.propertyValue) * 100 : 0;
      return result("Cap Rate", `${number(cap, 2)}%`, [
        { label: "Annual NOI", value: currency(inputs.noi) },
        { label: "Property Value", value: currency(inputs.propertyValue) },
      ]);
    }

    case "grossRentMultiplier": {
      const grm =
        inputs.annualRent > 0 ? inputs.propertyPrice / inputs.annualRent : Infinity;
      return result("Gross Rent Multiplier", number(grm, 2), [
        { label: "Property Price", value: currency(inputs.propertyPrice) },
        { label: "Annual Gross Rent", value: currency(inputs.annualRent) },
        {
          label: "Implied Monthly Rent",
          value: currency(inputs.annualRent / 12),
        },
      ]);
    }

    case "homeImprovementRoi": {
      const roi =
        inputs.projectCost > 0
          ? ((inputs.valueAdded - inputs.projectCost) / inputs.projectCost) * 100
          : 0;
      return result("ROI", `${number(roi, 1)}%`, [
        { label: "Net Value Change", value: currency(inputs.valueAdded - inputs.projectCost) },
        { label: "Cost Recovered", value: `${number(inputs.projectCost > 0 ? (inputs.valueAdded / inputs.projectCost) * 100 : 0, 1)}%` },
        { label: "Hold Period", value: `${inputs.yearsOwned} years` },
      ]);
    }

    case "downPaymentTimeline": {
      const months = monthsToGoal(
        inputs.targetAmount,
        inputs.currentSavings,
        inputs.monthlyContribution,
        inputs.annualReturn
      );
      return result("Time to Goal", monthsLabel(months), [
        {
          label: "Remaining to Save",
          value: currency(Math.max(0, inputs.targetAmount - inputs.currentSavings)),
        },
        { label: "Monthly Contribution", value: currency(inputs.monthlyContribution) },
        { label: "Target Down Payment", value: currency(inputs.targetAmount) },
      ]);
    }

    case "closingCosts": {
      const transfer = (inputs.purchasePrice * inputs.transferTaxRate) / 100;
      const other = (inputs.purchasePrice * inputs.closingCostPct) / 100;
      const total = Math.max(0, transfer + other - inputs.credits);
      return result("Cash Needed at Closing", currency(total), [
        { label: "Transfer Tax", value: currency(transfer) },
        { label: "Other Closing Costs", value: currency(other) },
        { label: "Credits Applied", value: currency(inputs.credits) },
      ]);
    }

    case "compoundInterest": {
      const initialDeposit = inputs.initialDeposit ?? inputs.principal ?? 0;
      const monthlyContribution = inputs.monthlyContribution ?? 0;
      const contributionYears =
        inputs.contributionYears ?? inputs.years ?? 0;
      const annualRate =
        inputs.annualInterestRate ?? inputs.annualRate ?? 0;
      const frequency = Math.max(1, Math.floor(inputs.compoundFrequency ?? 12));
      const coastingYears = Math.max(0, inputs.coastingYears ?? 0);

      const r = annualRate / 100 / frequency;
      const contribPeriods = Math.max(0, contributionYears) * frequency;
      // Spread monthly contributions across each compounding period
      const contribPerPeriod = monthlyContribution * (12 / frequency);

      // Phase 1 — active contributions
      let balanceAfterContributions = initialDeposit;
      if (contribPeriods > 0) {
        if (Math.abs(r) < 1e-12) {
          balanceAfterContributions =
            initialDeposit + contribPerPeriod * contribPeriods;
        } else {
          balanceAfterContributions =
            initialDeposit * Math.pow(1 + r, contribPeriods) +
            contribPerPeriod * ((Math.pow(1 + r, contribPeriods) - 1) / r);
        }
      }

      // Phase 2 — coasting lump sum, $0 contributions
      const coastPeriods = coastingYears * frequency;
      let finalBalance = balanceAfterContributions;
      if (coastPeriods > 0) {
        finalBalance =
          Math.abs(r) < 1e-12
            ? balanceAfterContributions
            : balanceAfterContributions * Math.pow(1 + r, coastPeriods);
      }

      const totalContributed =
        initialDeposit + monthlyContribution * contributionYears * 12;
      const totalInterest = finalBalance - totalContributed;
      const growthMultiplier =
        totalContributed > 0 ? finalBalance / totalContributed : 0;
      const coastingGain = finalBalance - balanceAfterContributions;

      return {
        primary: {
          label: "Final Balance After Coasting",
          value: currency(finalBalance),
          highlight: true,
        },
        featured: [
          {
            label: "Balance When Contributions Stopped",
            value: currency(balanceAfterContributions),
            highlight: true,
          },
        ],
        secondary: [
          {
            label: "Total Out-of-Pocket Contributions",
            value: currency(totalContributed),
          },
          {
            label: "Active Contribution Phase",
            value: `${number(contributionYears, 0)} yr`,
          },
          {
            label: "Coasting Phase",
            value: `${number(coastingYears, 0)} yr`,
          },
          {
            label: "Growth During Coasting",
            value: currency(coastingGain),
          },
          {
            label: "Total Interest Earned",
            value: currency(totalInterest),
          },
          {
            label: "Growth Multiplier",
            value: `${number(growthMultiplier, 2)}×`,
          },
          {
            label: "Compound Frequency",
            value: `${frequency}× / year`,
          },
        ],
        insight:
          coastingYears > 0
            ? `After contributions stop, your money still works. In this scenario, coasting for ${number(coastingYears, 0)} more year${coastingYears === 1 ? "" : "s"} adds ${currency(coastingGain)} with $0 in new deposits—pure compounding on what you already built.`
            : `Set coasting years above 0 to see how much extra growth you can earn by leaving the balance untouched after contributions stop.`,
      };
    }

    case "fireRetirement": {
      const fireNumber =
        inputs.withdrawalRate > 0
          ? inputs.annualExpenses / (inputs.withdrawalRate / 100)
          : Infinity;
      let years = 0;
      let balance = inputs.currentSavings;
      const r = inputs.annualReturn / 100;
      while (balance < fireNumber && years < 100) {
        balance = balance * (1 + r) + inputs.annualSavings;
        years += 1;
      }
      return result("Years to FIRE", number(years, 0), [
        { label: "FIRE Number", value: currency(fireNumber) },
        { label: "Projected Portfolio", value: currency(balance) },
        {
          label: "Annual Withdrawal (at FIRE)",
          value: currency(inputs.annualExpenses),
        },
      ]);
    }

    case "retirementGoal": {
      const gapIncome = Math.max(0, inputs.desiredAnnualIncome - inputs.otherIncome);
      const target =
        inputs.withdrawalRate > 0 ? gapIncome / (inputs.withdrawalRate / 100) : 0;
      const monthly = requiredMonthlyForGoal(
        target,
        inputs.currentSavings,
        inputs.yearsToRetire * 12,
        inputs.annualReturn
      );
      return result("Retirement Target", currency(target), [
        { label: "Income Gap to Fund", value: currency(gapIncome) },
        { label: "Required Monthly Savings", value: currency(monthly) },
        {
          label: "Current Progress",
          value: `${number(target > 0 ? (inputs.currentSavings / target) * 100 : 100, 1)}%`,
        },
      ]);
    }

    case "rrsp401kGrowth": {
      const annual = inputs.employeeContribution + inputs.employerMatch;
      const ending = fvAnnuity(
        inputs.currentBalance,
        annual / 12,
        inputs.annualReturn,
        inputs.years
      );
      const contrib = inputs.currentBalance + annual * inputs.years;
      return result("Projected Balance", currency(ending), [
        { label: "Total Contributions + Match", value: currency(contrib) },
        { label: "Growth", value: currency(ending - contrib) },
        { label: "Annual Additions", value: currency(annual) },
      ]);
    }

    case "dividendReinvestment": {
      let value = inputs.initialInvestment;
      let yieldRate = inputs.dividendYield / 100;
      for (let y = 0; y < inputs.years; y++) {
        const dividends = value * yieldRate;
        value = value * (1 + inputs.priceGrowth / 100) + dividends;
        yieldRate *= 1 + inputs.dividendGrowth / 100;
      }
      return result("Ending Portfolio Value", currency(value), [
        { label: "Starting Investment", value: currency(inputs.initialInvestment) },
        { label: "Total Gain", value: currency(value - inputs.initialInvestment) },
        { label: "Holding Period", value: `${inputs.years} years` },
      ]);
    }

    case "inflationPurchasingPower": {
      const futureValue =
        inputs.amount / Math.pow(1 + inputs.inflationRate / 100, inputs.years);
      const needed =
        inputs.amount * Math.pow(1 + inputs.inflationRate / 100, inputs.years);
      return result("Future Purchasing Power", currency(futureValue), [
        { label: "Today's Amount", value: currency(inputs.amount) },
        {
          label: "Amount Needed for Same Power",
          value: currency(needed),
        },
        {
          label: "Purchasing Power Lost",
          value: currency(inputs.amount - futureValue),
        },
      ]);
    }

    case "netWorthTracker": {
      const assets =
        inputs.cash + inputs.investments + inputs.property + inputs.otherAssets;
      const liabilities = inputs.mortgage + inputs.otherDebts;
      const net = assets - liabilities;
      return result("Net Worth", currency(net), [
        { label: "Total Assets", value: currency(assets) },
        { label: "Total Liabilities", value: currency(liabilities) },
        {
          label: "Asset / Liability Ratio",
          value: liabilities > 0 ? number(assets / liabilities, 2) : "∞",
        },
      ]);
    }

    case "ruleOf72": {
      const years = inputs.annualRate > 0 ? 72 / inputs.annualRate : Infinity;
      return result("Years to Double", number(years, 1), [
        { label: "Doubled Value", value: currency(inputs.principal * 2) },
        { label: "Annual Return", value: `${number(inputs.annualRate, 2)}%` },
      ]);
    }

    case "dollarCostAveraging": {
      const monthlyGrowth = Math.pow(1 + inputs.annualGrowth / 100, 1 / 12) - 1;
      let price = inputs.startingPrice;
      let shares = 0;
      let invested = 0;
      for (let m = 0; m < inputs.months; m++) {
        shares += inputs.monthlyInvestment / price;
        invested += inputs.monthlyInvestment;
        price *= 1 + monthlyGrowth;
      }
      const value = shares * price;
      const avgCost = shares > 0 ? invested / shares : 0;
      return result("Portfolio Value", currency(value), [
        { label: "Total Invested", value: currency(invested) },
        { label: "Shares Accumulated", value: number(shares, 4) },
        { label: "Average Cost / Share", value: currency(avgCost) },
        { label: "Gain / Loss", value: currency(value - invested) },
      ]);
    }

    case "feeImpact": {
      const without = fvAnnuity(
        inputs.principal,
        inputs.annualContribution / 12,
        inputs.grossReturn,
        inputs.years
      );
      const withFees = fvAnnuity(
        inputs.principal,
        inputs.annualContribution / 12,
        inputs.grossReturn - inputs.feePercent,
        inputs.years
      );
      return result("Fee Drag (Lost Growth)", currency(without - withFees), [
        { label: "Value Without Fees", value: currency(without) },
        { label: "Value With Fees", value: currency(withFees) },
        {
          label: "Ending Balance Difference",
          value: `${number(without > 0 ? ((without - withFees) / without) * 100 : 0, 1)}%`,
        },
      ]);
    }

    case "freelanceHourlyRate": {
      const billable = inputs.billableHoursPerWeek * inputs.weeksWorked;
      const pretaxNeed =
        (inputs.targetAnnualIncome + inputs.annualExpenses) /
        Math.max(0.01, 1 - inputs.taxRate / 100);
      const rate = billable > 0 ? pretaxNeed / billable : 0;
      return result("Required Hourly Rate", currency(rate), [
        { label: "Annual Billable Hours", value: number(billable, 0) },
        { label: "Gross Revenue Needed", value: currency(pretaxNeed) },
        { label: "Target Take-Home", value: currency(inputs.targetAnnualIncome) },
      ]);
    }

    case "takeHomePay": {
      const afterTax = inputs.grossSalary * (1 - inputs.taxRate / 100);
      const afterBenefits = afterTax * (1 - inputs.benefitsPercent / 100);
      const net = afterBenefits * (1 - inputs.retirementPercent / 100);
      return result("Annual Take-Home", currency(net), [
        { label: "Monthly Take-Home", value: currency(net / 12) },
        { label: "Gross Salary", value: currency(inputs.grossSalary) },
        {
          label: "Total Withheld %",
          value: `${number(inputs.grossSalary > 0 ? (1 - net / inputs.grossSalary) * 100 : 0, 1)}%`,
        },
      ]);
    }

    case "selfEmploymentTax": {
      const taxable = inputs.netProfit * 0.9235;
      const seTax = taxable * (inputs.seTaxRate / 100);
      return result("Estimated SE Tax", currency(seTax), [
        { label: "Taxable SE Base", value: currency(taxable) },
        { label: "Suggested Quarterly Set-Aside", value: currency(seTax / 4) },
        { label: "Net Profit Input", value: currency(inputs.netProfit) },
      ]);
    }

    case "salaryToHourly": {
      const hours = inputs.hoursPerWeek * inputs.weeksPerYear;
      const hourly = hours > 0 ? inputs.annualSalary / hours : 0;
      return result("Hourly Equivalent", currency(hourly), [
        { label: "Daily (8h) Equivalent", value: currency(hourly * 8) },
        { label: "Weekly Equivalent", value: currency(hourly * inputs.hoursPerWeek) },
        { label: "Annual Hours", value: number(hours, 0) },
      ]);
    }

    case "overtimePay": {
      const regular = inputs.hourlyRate * inputs.regularHours;
      const ot =
        inputs.hourlyRate * inputs.overtimeMultiplier * inputs.overtimeHours;
      return result("Total Weekly Pay", currency(regular + ot), [
        { label: "Regular Pay", value: currency(regular) },
        { label: "Overtime Pay", value: currency(ot) },
        {
          label: "OT Hourly Rate",
          value: currency(inputs.hourlyRate * inputs.overtimeMultiplier),
        },
      ]);
    }

    case "salaryRaise": {
      const raise = inputs.currentSalary * (inputs.raisePercent / 100);
      const next = inputs.currentSalary + raise;
      return result("New Salary", currency(next), [
        { label: "Raise Amount", value: currency(raise) },
        { label: "Monthly Increase", value: currency(raise / 12) },
        { label: "Raise %", value: `${number(inputs.raisePercent, 1)}%` },
      ]);
    }

    case "salesCommission": {
      const commission = inputs.salesVolume * (inputs.commissionRate / 100);
      const total = inputs.baseSalary + commission + inputs.bonus;
      return result("Total Earnings", currency(total), [
        { label: "Commission", value: currency(commission) },
        { label: "Base Salary", value: currency(inputs.baseSalary) },
        { label: "Bonus", value: currency(inputs.bonus) },
      ]);
    }

    case "sideHustleProfit": {
      const pretax = inputs.monthlyRevenue - inputs.monthlyExpenses;
      const net = pretax * (1 - inputs.taxRate / 100);
      const hourly = inputs.hoursPerMonth > 0 ? net / inputs.hoursPerMonth : 0;
      return result("Monthly Net Profit", currency(net), [
        { label: "Pre-Tax Profit", value: currency(pretax) },
        { label: "Effective Hourly Rate", value: currency(hourly) },
        { label: "Annual Net Profit", value: currency(net * 12) },
      ]);
    }

    case "billableHours": {
      const revenue = inputs.hourlyRate * inputs.billableHours;
      const totalHours = inputs.billableHours + inputs.nonBillableHours;
      const utilization =
        totalHours > 0 ? (inputs.billableHours / totalHours) * 100 : 0;
      return result("Billable Revenue", currency(revenue), [
        { label: "Utilization Rate", value: `${number(utilization, 1)}%` },
        { label: "Billable Hours", value: number(inputs.billableHours, 0) },
        { label: "Non-Billable Hours", value: number(inputs.nonBillableHours, 0) },
      ]);
    }

    case "costOfLivingAdjustment": {
      const adjusted =
        inputs.currentIndex > 0
          ? inputs.currentSalary * (inputs.newIndex / inputs.currentIndex)
          : 0;
      return result("Equivalent Salary Needed", currency(adjusted), [
        {
          label: "Adjustment Amount",
          value: currency(adjusted - inputs.currentSalary),
        },
        {
          label: "COL Change",
          value: `${number(inputs.currentIndex > 0 ? ((inputs.newIndex - inputs.currentIndex) / inputs.currentIndex) * 100 : 0, 1)}%`,
        },
        { label: "Current Salary", value: currency(inputs.currentSalary) },
      ]);
    }

    case "emergencyFund": {
      const target = inputs.monthlyExpenses * inputs.monthsCoverage;
      const gap = Math.max(0, target - inputs.currentSavings);
      return result("Emergency Fund Target", currency(target), [
        { label: "Amount Still Needed", value: currency(gap) },
        {
          label: "Progress",
          value: `${number(target > 0 ? (inputs.currentSavings / target) * 100 : 100, 1)}%`,
        },
        {
          label: "Months Covered Now",
          value: number(
            inputs.monthlyExpenses > 0
              ? inputs.currentSavings / inputs.monthlyExpenses
              : 0,
            1
          ),
        },
      ]);
    }

    case "savingsGoalDate": {
      const monthly = requiredMonthlyForGoal(
        inputs.goalAmount,
        inputs.currentSavings,
        inputs.months,
        inputs.annualReturn
      );
      return result("Required Monthly Savings", currency(monthly), [
        {
          label: "Remaining Goal",
          value: currency(Math.max(0, inputs.goalAmount - inputs.currentSavings)),
        },
        { label: "Months Remaining", value: `${inputs.months}` },
        { label: "Target Amount", value: currency(inputs.goalAmount) },
      ]);
    }

    case "latteFactor": {
      const annual = inputs.dailyCost * inputs.daysPerWeek * 52;
      const spent = annual * inputs.years;
      const invested = fvAnnuity(0, annual / 12, inputs.annualReturn, inputs.years);
      return result("Habit Cost Over Period", currency(spent), [
        { label: "Annual Spending", value: currency(annual) },
        { label: "If Invested Instead", value: currency(invested) },
        { label: "Opportunity Gain", value: currency(invested - spent) },
      ]);
    }

    case "tipBillSplit": {
      const tip = inputs.billAmount * (inputs.tipPercent / 100);
      const total = inputs.billAmount + tip;
      const perPerson = inputs.people > 0 ? total / inputs.people : total;
      return result("Per Person", currency(perPerson), [
        { label: "Tip Amount", value: currency(tip) },
        { label: "Grand Total", value: currency(total) },
        { label: "People Splitting", value: `${inputs.people}` },
      ]);
    }

    case "discountSale": {
      const sale = inputs.originalPrice * (1 - inputs.discountPercent / 100);
      const tax = sale * (inputs.taxPercent / 100);
      const savings = inputs.originalPrice - sale;
      return result("Final Price (with tax)", currency(sale + tax), [
        { label: "Sale Price", value: currency(sale) },
        { label: "You Save", value: currency(savings) },
        { label: "Sales Tax", value: currency(tax) },
      ]);
    }

    case "unitPriceComparison": {
      const unit1 = inputs.units1 > 0 ? inputs.price1 / inputs.units1 : Infinity;
      const unit2 = inputs.units2 > 0 ? inputs.price2 / inputs.units2 : Infinity;
      const winner = unit1 <= unit2 ? "Product A" : "Product B";
      return result("Better Value", winner, [
        { label: "Product A Unit Price", value: currency(unit1, 4) },
        { label: "Product B Unit Price", value: currency(unit2, 4) },
        {
          label: "Unit Price Difference",
          value: currency(Math.abs(unit1 - unit2), 4),
        },
      ]);
    }

    case "fuelCostTrip": {
      const gallons = inputs.mpg > 0 ? inputs.distance / inputs.mpg : 0;
      const cost = gallons * inputs.fuelPrice;
      return result("Total Fuel Cost", currency(cost), [
        { label: "Gallons Needed", value: number(gallons, 2) },
        { label: "Cost Per Mile", value: currency(inputs.distance > 0 ? cost / inputs.distance : 0, 3) },
        { label: "Trip Distance", value: `${number(inputs.distance, 0)} miles` },
      ]);
    }

    case "subscriptionAggregator": {
      const monthly =
        inputs.sub1 + inputs.sub2 + inputs.sub3 + inputs.sub4 + inputs.sub5;
      return result("Monthly Subscriptions", currency(monthly), [
        { label: "Annual Cost", value: currency(monthly * 12) },
        { label: "Weekly Equivalent", value: currency((monthly * 12) / 52) },
        { label: "Active Slots Used", value: `${[inputs.sub1, inputs.sub2, inputs.sub3, inputs.sub4, inputs.sub5].filter((v) => v > 0).length}` },
      ]);
    }

    case "simpleInterest": {
      const interest =
        inputs.principal * (inputs.annualRate / 100) * inputs.years;
      return result("Simple Interest", currency(interest), [
        { label: "Total Amount", value: currency(inputs.principal + interest) },
        { label: "Principal", value: currency(inputs.principal) },
        { label: "Time", value: `${number(inputs.years, 2)} years` },
      ]);
    }

    case "percentageChange": {
      const diff = inputs.newValue - inputs.originalValue;
      const pct =
        inputs.originalValue !== 0
          ? (diff / Math.abs(inputs.originalValue)) * 100
          : Infinity;
      return result(
        "Percentage Change",
        Number.isFinite(pct) ? `${number(pct, 2)}%` : "Undefined",
        [
          { label: "Absolute Change", value: number(diff, 2) },
          { label: "Original Value", value: number(inputs.originalValue, 2) },
          { label: "New Value", value: number(inputs.newValue, 2) },
        ]
      );
    }

    // ——— Education ———
    case "cumulativeGpa": {
      const totalCredits = inputs.prevCredits + inputs.termCredits;
      const gpa =
        totalCredits > 0
          ? (inputs.prevGpa * inputs.prevCredits +
              inputs.termGpa * inputs.termCredits) /
            totalCredits
          : 0;
      return result("Cumulative GPA", number(gpa, 3), [
        { label: "Total Credits", value: number(totalCredits, 0) },
        { label: "Term GPA", value: number(inputs.termGpa, 2) },
      ]);
    }
    case "finalExamNeeded": {
      const w = inputs.finalWeight / 100;
      const needed =
        w > 0
          ? (inputs.desiredGrade - inputs.currentGrade * (1 - w)) / w
          : Infinity;
      return result("Required Final Score", `${number(needed, 1)}%`, [
        { label: "Current Grade", value: `${number(inputs.currentGrade, 1)}%` },
        { label: "Final Weight", value: `${number(inputs.finalWeight, 0)}%` },
        {
          label: "Reachable?",
          value: needed <= 100 ? "Yes" : "Likely no (over 100%)",
        },
      ]);
    }
    case "weightedGrade": {
      const tw = inputs.weight1 + inputs.weight2 + inputs.weight3;
      const avg =
        tw > 0
          ? (inputs.score1 * inputs.weight1 +
              inputs.score2 * inputs.weight2 +
              inputs.score3 * inputs.weight3) /
            tw
          : 0;
      return result("Weighted Average", `${number(avg, 2)}%`, [
        { label: "Weight Total Used", value: `${number(tw, 0)}%` },
      ]);
    }
    case "satActPercentile": {
      let percentile = 50;
      if (inputs.testType < 1.5) {
        const s = Math.min(1600, Math.max(400, inputs.score));
        percentile = Math.min(99, Math.max(1, ((s - 400) / 1200) * 98 + 1));
      } else {
        const s = Math.min(36, Math.max(1, inputs.score));
        percentile = Math.min(99, Math.max(1, ((s - 1) / 35) * 98 + 1));
      }
      return result("Est. Percentile", `${number(percentile, 0)}th`, [
        {
          label: "Test",
          value: inputs.testType < 1.5 ? "SAT" : "ACT",
        },
        { label: "Score Entered", value: number(inputs.score, 0) },
      ]);
    }
    case "collegeTuitionPlanner": {
      let total = 0;
      for (let y = 0; y < inputs.years; y++) {
        const cost =
          inputs.annualTuition * Math.pow(1 + inputs.inflation / 100, y);
        total += Math.max(0, cost - inputs.aid);
      }
      return result("Total Net Cost", currency(total), [
        { label: "Years", value: `${inputs.years}` },
        {
          label: "Avg Net / Year",
          value: currency(inputs.years > 0 ? total / inputs.years : 0),
        },
      ]);
    }
    case "studentLoanAmortization": {
      const months = inputs.termYears * 12;
      const payment = pmt(inputs.principal, inputs.annualRate, months);
      return result("Monthly Payment", currency(payment), [
        {
          label: "Total Interest",
          value: currency(payment * months - inputs.principal),
        },
        { label: "Total Paid", value: currency(payment * months) },
      ]);
    }
    case "studyTimeAllocation": {
      const needed = inputs.credits * inputs.hoursPerCredit;
      return result("Recommended Hours / Week", number(needed, 1), [
        {
          label: "Capacity Gap",
          value: number(inputs.availableHours - needed, 1),
        },
        {
          label: "Schedule Fit",
          value: inputs.availableHours >= needed ? "Sufficient" : "Overloaded",
        },
      ]);
    }
    case "readingTime": {
      const minutes = inputs.wpm > 0 ? inputs.wordCount / inputs.wpm : 0;
      return result("Reading Time", `${number(minutes, 0)} min`, [
        { label: "Hours", value: number(minutes / 60, 2) },
        { label: "Word Count", value: number(inputs.wordCount, 0) },
      ]);
    }
    case "pageToWord": {
      const words = inputs.pages * inputs.wordsPerPage;
      return result("Estimated Words", number(words, 0), [
        { label: "Pages", value: `${inputs.pages}` },
        { label: "Words / Page", value: `${inputs.wordsPerPage}` },
      ]);
    }
    case "scholarshipRoi": {
      const expected = inputs.awardAmount * (inputs.winProbability / 100);
      const perHour = inputs.hoursSpent > 0 ? expected / inputs.hoursSpent : 0;
      return result("Expected $/Hour", currency(perHour), [
        { label: "Expected Value", value: currency(expected) },
        { label: "Hours Invested", value: number(inputs.hoursSpent, 1) },
      ]);
    }
    case "apExamScore": {
      const mc =
        inputs.mcTotal > 0 ? inputs.mcCorrect / inputs.mcTotal : 0;
      const frq = inputs.frqPercent / 100;
      const mcW = inputs.mcWeight / 100;
      const composite = (mc * mcW + frq * (1 - mcW)) * 100;
      let ap = 1;
      if (composite >= 85) ap = 5;
      else if (composite >= 70) ap = 4;
      else if (composite >= 55) ap = 3;
      else if (composite >= 40) ap = 2;
      return result("Estimated AP Score", `${ap}`, [
        { label: "Composite %", value: `${number(composite, 1)}%` },
        { label: "MC Accuracy", value: `${number(mc * 100, 1)}%` },
      ]);
    }
    case "classRank": {
      const percentile =
        inputs.classSize > 0
          ? ((inputs.classSize - inputs.rank + 1) / inputs.classSize) * 100
          : 0;
      return result("Percentile", `${number(percentile, 1)}%`, [
        {
          label: "Top Percentage",
          value: `${number((inputs.rank / inputs.classSize) * 100, 2)}%`,
        },
        { label: "Rank", value: `${inputs.rank} / ${inputs.classSize}` },
      ]);
    }
    case "gradePercentageConverter": {
      const p = inputs.percentage;
      let letter = "F";
      let points = 0;
      if (p >= 97) {
        letter = "A+";
        points = 4.0;
      } else if (p >= 93) {
        letter = "A";
        points = 4.0;
      } else if (p >= 90) {
        letter = "A-";
        points = 3.7;
      } else if (p >= 87) {
        letter = "B+";
        points = 3.3;
      } else if (p >= 83) {
        letter = "B";
        points = 3.0;
      } else if (p >= 80) {
        letter = "B-";
        points = 2.7;
      } else if (p >= 77) {
        letter = "C+";
        points = 2.3;
      } else if (p >= 73) {
        letter = "C";
        points = 2.0;
      } else if (p >= 70) {
        letter = "C-";
        points = 1.7;
      } else if (p >= 67) {
        letter = "D+";
        points = 1.3;
      } else if (p >= 63) {
        letter = "D";
        points = 1.0;
      } else if (p >= 60) {
        letter = "D-";
        points = 0.7;
      }
      return result("Letter Grade", letter, [
        { label: "GPA Points", value: number(points, 1) },
        { label: "Percentage", value: `${number(p, 1)}%` },
      ]);
    }
    case "quizScore": {
      const pct = inputs.total > 0 ? (inputs.correct / inputs.total) * 100 : 0;
      return result("Quiz Score", `${number(pct, 1)}%`, [
        { label: "Correct", value: `${inputs.correct} / ${inputs.total}` },
      ]);
    }
    case "homeschoolBudget": {
      const total = inputs.curriculum + inputs.activities + inputs.supplies;
      return result("Annual Budget", currency(total), [
        {
          label: "Per Student",
          value: currency(inputs.students > 0 ? total / inputs.students : total),
        },
      ]);
    }
    case "dormRoomExpense": {
      const total = inputs.setupCost + inputs.monthlyExtras * inputs.months;
      return result("Academic Year Total", currency(total), [
        { label: "Setup Cost", value: currency(inputs.setupCost) },
        {
          label: "Monthly Extras Total",
          value: currency(inputs.monthlyExtras * inputs.months),
        },
      ]);
    }
    case "textbookResale": {
      const net = inputs.purchasePrice - Math.max(0, inputs.resaleValue - inputs.fees);
      return result("Net Ownership Cost", currency(net), [
        {
          label: "Net Resale Proceeds",
          value: currency(Math.max(0, inputs.resaleValue - inputs.fees)),
        },
      ]);
    }
    case "gradSchoolDebtPayoff": {
      const { payment, months, interest } = amortizeWithExtra(
        inputs.principal,
        inputs.annualRate,
        inputs.termYears * 12,
        inputs.extraPayment
      );
      return result("Monthly Payment", currency(payment), [
        { label: "Payoff Time", value: monthsLabel(months) },
        { label: "Total Interest", value: currency(interest) },
      ]);
    }
    case "onlineCourseCompletion": {
      const remaining = Math.max(0, inputs.totalHours - inputs.completedHours);
      const weeks =
        inputs.hoursPerWeek > 0 ? remaining / inputs.hoursPerWeek : Infinity;
      return result("Weeks Remaining", number(weeks, 1), [
        { label: "Hours Left", value: number(remaining, 1) },
        {
          label: "Progress",
          value: `${number(inputs.totalHours > 0 ? (inputs.completedHours / inputs.totalHours) * 100 : 0, 1)}%`,
        },
      ]);
    }
    case "attendancePercentage": {
      const pct =
        inputs.scheduled > 0 ? (inputs.attended / inputs.scheduled) * 100 : 0;
      return result("Attendance", `${number(pct, 1)}%`, [
        {
          label: "Absences",
          value: `${Math.max(0, inputs.scheduled - inputs.attended)}`,
        },
      ]);
    }

    // ——— Statistics ———
    case "stdDevVariance": {
      const mean = inputs.n > 0 ? inputs.sum / inputs.n : 0;
      const ss = inputs.sumSquares - (inputs.sum * inputs.sum) / inputs.n;
      const denom =
        inputs.sampleFlag >= 0.5 ? Math.max(1, inputs.n - 1) : inputs.n;
      const variance = denom > 0 ? ss / denom : 0;
      return result("Std Deviation", number(Math.sqrt(Math.max(0, variance)), 4), [
        { label: "Variance", value: number(Math.max(0, variance), 4) },
        { label: "Mean", value: number(mean, 4) },
      ]);
    }
    case "sampleSize": {
      const z =
        inputs.confidence >= 99 ? 2.576 : inputs.confidence >= 95 ? 1.96 : 1.645;
      const p = inputs.proportion / 100;
      const e = inputs.marginError / 100;
      const n = e > 0 ? (z * z * p * (1 - p)) / (e * e) : Infinity;
      return result("Required Sample Size", number(Math.ceil(n), 0), [
        { label: "Z Used", value: number(z, 3) },
        { label: "Margin of Error", value: `${number(inputs.marginError, 1)}%` },
      ]);
    }
    case "confidenceInterval": {
      const se = inputs.n > 0 ? inputs.sd / Math.sqrt(inputs.n) : 0;
      const moe = inputs.z * se;
      return result("CI Low", number(inputs.mean - moe, 3), [
        { label: "CI High", value: number(inputs.mean + moe, 3) },
        { label: "Margin of Error", value: number(moe, 3) },
      ]);
    }
    case "zScorePValue": {
      const z = inputs.sd > 0 ? (inputs.x - inputs.mean) / inputs.sd : 0;
      const absZ = Math.abs(z);
      const approxP =
        2 *
        (1 -
          1 /
            (1 +
              Math.exp(-0.07056 * Math.pow(absZ, 3) - 1.5976 * absZ)));
      return result("Z-Score", number(z, 3), [
        {
          label: "Approx 2-tail p",
          value: number(Math.min(1, Math.max(0, approxP)), 4),
        },
      ]);
    }
    case "permutationCombination": {
      const fact = (n: number) => {
        let r = 1;
        for (let i = 2; i <= n; i++) r *= i;
        return r;
      };
      const n = Math.floor(inputs.n);
      const r = Math.floor(inputs.r);
      const perm = r <= n ? fact(n) / fact(n - r) : 0;
      const comb = r <= n ? perm / fact(r) : 0;
      return result("Combinations C(n,r)", number(comb, 0), [
        { label: "Permutations P(n,r)", value: number(perm, 0) },
      ]);
    }
    case "pythagorean": {
      if (inputs.mode < 1.5) {
        const c = Math.sqrt(inputs.a * inputs.a + inputs.b * inputs.b);
        return result("Hypotenuse c", number(c, 4), [
          { label: "Side a", value: number(inputs.a, 4) },
          { label: "Side b", value: number(inputs.b, 4) },
        ]);
      }
      const a = Math.sqrt(Math.max(0, inputs.c * inputs.c - inputs.b * inputs.b));
      return result("Leg a", number(a, 4), [
        { label: "Side b", value: number(inputs.b, 4) },
        { label: "Hypotenuse c", value: number(inputs.c, 4) },
      ]);
    }
    case "quadraticSolver": {
      const disc = inputs.b * inputs.b - 4 * inputs.a * inputs.c;
      if (Math.abs(inputs.a) < 1e-12) {
        return result("Roots", "Not quadratic", []);
      }
      if (disc < 0) {
        return result("Roots", "No real roots", [
          { label: "Discriminant", value: number(disc, 4) },
        ]);
      }
      const root1 = (-inputs.b + Math.sqrt(disc)) / (2 * inputs.a);
      const root2 = (-inputs.b - Math.sqrt(disc)) / (2 * inputs.a);
      return result("Root 1", number(root1, 4), [
        { label: "Root 2", value: number(root2, 4) },
        { label: "Discriminant", value: number(disc, 4) },
      ]);
    }
    case "matrixMultiply2x2": {
      const c11 = inputs.a11 * inputs.b11 + inputs.a12 * inputs.b21;
      const c12 = inputs.a11 * inputs.b12 + inputs.a12 * inputs.b22;
      const c21 = inputs.a21 * inputs.b11 + inputs.a22 * inputs.b21;
      const c22 = inputs.a21 * inputs.b12 + inputs.a22 * inputs.b22;
      return result("C[1,1]", number(c11, 4), [
        { label: "C[1,2]", value: number(c12, 4) },
        { label: "C[2,1]", value: number(c21, 4) },
        { label: "C[2,2]", value: number(c22, 4) },
      ]);
    }
    case "fractionDecimal": {
      if (Math.abs(inputs.denominator) < 1e-12) {
        return result("Decimal", "Undefined", []);
      }
      const dec = inputs.numerator / inputs.denominator;
      return result("Decimal", number(dec, 6), [
        { label: "Percent", value: `${number(dec * 100, 4)}%` },
      ]);
    }
    case "lcmGcd": {
      const gcd = (x: number, y: number): number => {
        x = Math.abs(Math.floor(x));
        y = Math.abs(Math.floor(y));
        while (y) {
          const t = y;
          y = x % y;
          x = t;
        }
        return x;
      };
      const g = gcd(inputs.a, inputs.b);
      const l = g === 0 ? 0 : Math.abs(inputs.a * inputs.b) / g;
      return result("GCD", `${g}`, [
        { label: "LCM", value: `${l}` },
      ]);
    }
    case "logExponentialGrowth": {
      const grown =
        inputs.initial * Math.pow(1 + inputs.rate / 100, inputs.periods);
      const factor = 1 + inputs.rate / 100;
      const periodsToTarget =
        factor > 0 && factor !== 1 && inputs.initial > 0
          ? Math.log(inputs.target / inputs.initial) / Math.log(factor)
          : Infinity;
      return result("Future Value", number(grown, 2), [
        {
          label: "Periods to Target",
          value: Number.isFinite(periodsToTarget)
            ? number(periodsToTarget, 2)
            : "—",
        },
      ]);
    }
    case "sequenceProgression": {
      const n = Math.floor(inputs.n);
      if (inputs.type < 1.5) {
        const term = inputs.first + (n - 1) * inputs.common;
        const sum = (n / 2) * (2 * inputs.first + (n - 1) * inputs.common);
        return result("Nth Term", number(term, 4), [
          { label: "Sum of First n", value: number(sum, 4) },
        ]);
      }
      const term = inputs.first * Math.pow(inputs.common, n - 1);
      const sum =
        Math.abs(inputs.common - 1) < 1e-12
          ? n * inputs.first
          : (inputs.first * (1 - Math.pow(inputs.common, n))) /
            (1 - inputs.common);
      return result("Nth Term", number(term, 4), [
        { label: "Sum of First n", value: number(sum, 4) },
      ]);
    }
    case "compoundProbability": {
      const a = inputs.pA / 100;
      const b = inputs.pB / 100;
      let p = 0;
      let label = "P(A and B)";
      if (inputs.mode < 1.5) {
        p = a * b;
      } else if (inputs.mode < 2.5) {
        p = a + b;
        label = "P(A or B exclusive)";
      } else {
        p = a + b - a * b;
        label = "P(A or B independent)";
      }
      return result(label, `${number(p * 100, 2)}%`, [
        { label: "P(A)", value: `${number(inputs.pA, 1)}%` },
        { label: "P(B)", value: `${number(inputs.pB, 1)}%` },
      ]);
    }
    case "descriptiveStats": {
      const mean = inputs.n > 0 ? inputs.sum / inputs.n : 0;
      return result("Mean", number(mean, 4), [
        { label: "Range", value: number(inputs.max - inputs.min, 4) },
        { label: "Count", value: `${inputs.n}` },
      ]);
    }
    case "marginOfError": {
      const p = inputs.proportion / 100;
      const moe =
        inputs.n > 0
          ? inputs.z * Math.sqrt((p * (1 - p)) / inputs.n) * 100
          : 0;
      return result("Margin of Error", `${number(moe, 2)}%`, [
        { label: "Sample Size", value: `${inputs.n}` },
      ]);
    }
    case "hypothesisTesting": {
      const se = inputs.n > 0 ? inputs.sd / Math.sqrt(inputs.n) : 0;
      const z = se > 0 ? (inputs.sampleMean - inputs.nullMean) / se : 0;
      return result("Z Test Statistic", number(z, 3), [
        { label: "Standard Error", value: number(se, 4) },
      ]);
    }
    case "correlationCoefficient": {
      const r =
        inputs.sdX * inputs.sdY !== 0
          ? inputs.covariance / (inputs.sdX * inputs.sdY)
          : NaN;
      const strength =
        Math.abs(r) >= 0.7
          ? "Strong"
          : Math.abs(r) >= 0.4
            ? "Moderate"
            : "Weak";
      return result("Correlation r", number(r, 4), [
        { label: "Association", value: Number.isFinite(r) ? strength : "Undefined" },
      ]);
    }
    case "factorialExponent": {
      let fact = 1;
      const n = Math.floor(inputs.n);
      for (let i = 2; i <= n; i++) fact *= i;
      const pow = Math.pow(inputs.base, inputs.exp);
      return result("n!", number(fact, 0), [
        { label: "Base^Exp", value: number(pow, 6) },
      ]);
    }
    case "polygonGeometry": {
      const n = Math.floor(inputs.sides);
      const angleSum = (n - 2) * 180;
      const area =
        n >= 3
          ? (n * inputs.sideLength * inputs.sideLength) /
            (4 * Math.tan(Math.PI / n))
          : 0;
      return result("Interior Angle Sum", `${angleSum}°`, [
        { label: "Regular Area", value: number(area, 4) },
        {
          label: "Each Interior Angle",
          value: `${number(n > 0 ? angleSum / n : 0, 2)}°`,
        },
      ]);
    }
    case "circleGeometry": {
      const d = inputs.radius * 2;
      const circ = 2 * Math.PI * inputs.radius;
      const area = Math.PI * inputs.radius * inputs.radius;
      return result("Area", number(area, 4), [
        { label: "Circumference", value: number(circ, 4) },
        { label: "Diameter", value: number(d, 4) },
      ]);
    }

    // ——— Legal / HR ———
    case "severancePay": {
      const weekly = inputs.annualSalary / 52;
      const total = weekly * inputs.weeks + inputs.bonus;
      return result("Severance Total", currency(total), [
        { label: "Weekly Pay", value: currency(weekly) },
        { label: "Weeks Value", value: currency(weekly * inputs.weeks) },
      ]);
    }
    case "ptoAccrual": {
      const earned = inputs.hoursWorked * inputs.accrualRate;
      return result("PTO Earned", `${number(earned, 2)} hrs`, [
        {
          label: "New Balance",
          value: `${number(inputs.currentBalance + earned, 2)} hrs`,
        },
      ]);
    }
    case "fmlaLeave": {
      const entitlementDays = inputs.entitlementWeeks * inputs.workweekDays;
      const remaining = Math.max(0, entitlementDays - inputs.usedDays);
      return result("Days Remaining", `${number(remaining, 0)}`, [
        {
          label: "Weeks Remaining",
          value: number(
            inputs.workweekDays > 0 ? remaining / inputs.workweekDays : 0,
            1
          ),
        },
      ]);
    }
    case "workersComp": {
      const weekly = inputs.avgWeeklyWage * (inputs.replacementRate / 100);
      return result("Weekly Benefit", currency(weekly), [
        { label: "Total over Period", value: currency(weekly * inputs.weeks) },
      ]);
    }
    case "employeeTurnover": {
      const rate =
        inputs.avgHeadcount > 0
          ? (inputs.separations / inputs.avgHeadcount) * 100
          : 0;
      return result("Turnover Rate", `${number(rate, 2)}%`, [
        { label: "Separations", value: `${inputs.separations}` },
      ]);
    }
    case "payrollTax": {
      const tax = inputs.grossWages * (inputs.employerTaxRate / 100);
      return result("Employer Tax Cost", currency(tax + inputs.otherTaxes), [
        { label: "Rate-Based Tax", value: currency(tax) },
        { label: "Other Taxes", value: currency(inputs.otherTaxes) },
      ]);
    }
    case "contractorVsW2": {
      const w2 = inputs.w2Salary * (1 + inputs.burdenRate / 100);
      const contractor = inputs.contractorHourly * inputs.hours;
      return result(
        w2 <= contractor ? "W2 Looks Cheaper" : "Contractor Looks Cheaper",
        currency(Math.min(w2, contractor)),
        [
          { label: "Fully Loaded W2", value: currency(w2) },
          { label: "Contractor Annual", value: currency(contractor) },
          { label: "Difference", value: currency(Math.abs(w2 - contractor)) },
        ]
      );
    }
    case "nonCompeteSettlement": {
      const value =
        inputs.monthlyPay * inputs.remainingMonths * inputs.multiplier;
      return result("Settlement Estimate", currency(value), [
        {
          label: "Restricted Pay Value",
          value: currency(inputs.monthlyPay * inputs.remainingMonths),
        },
      ]);
    }
    case "wrongfulTermination": {
      const gross = inputs.weeklyPay * inputs.weeksLost;
      const net = Math.max(0, gross - inputs.mitigation);
      return result("Net Wage Loss", currency(net), [
        { label: "Gross Lost Wages", value: currency(gross) },
        { label: "Mitigation", value: currency(inputs.mitigation) },
      ]);
    }
    case "overtimeExemption": {
      const under = inputs.annualSalary < inputs.threshold;
      const weekly = inputs.annualSalary / 52;
      const hourly = weekly / 40;
      const otHours = Math.max(0, inputs.weeklyHours - 40);
      const otPay = under ? hourly * 1.5 * otHours : 0;
      return result(
        under ? "Below Threshold" : "Meets Salary Threshold",
        currency(inputs.annualSalary),
        [
          { label: "Threshold", value: currency(inputs.threshold) },
          {
            label: "Est. Weekly OT if Nonexempt",
            value: currency(otPay),
          },
        ]
      );
    }
    case "oshaRecordable": {
      const rate =
        inputs.hoursWorked > 0
          ? (inputs.cases * 200000) / inputs.hoursWorked
          : 0;
      return result("Incidence Rate", number(rate, 2), [
        { label: "Recordable Cases", value: `${inputs.cases}` },
      ]);
    }
    case "applicantScorecard": {
      const tw =
        inputs.skillWeight + inputs.cultureWeight + inputs.potentialWeight;
      const score =
        tw > 0
          ? (inputs.skillScore * inputs.skillWeight +
              inputs.cultureScore * inputs.cultureWeight +
              inputs.potentialScore * inputs.potentialWeight) /
            tw
          : 0;
      return result("Weighted Score", number(score, 2), [
        { label: "Scale", value: "1–10" },
      ]);
    }
    case "enps": {
      const total = inputs.promoters + inputs.passives + inputs.detractors;
      const enps =
        total > 0
          ? ((inputs.promoters - inputs.detractors) / total) * 100
          : 0;
      return result("eNPS", number(enps, 1), [
        { label: "Responses", value: `${total}` },
        {
          label: "Promoter %",
          value: `${number(total > 0 ? (inputs.promoters / total) * 100 : 0, 1)}%`,
        },
      ]);
    }
    case "costPerHire": {
      const cph =
        inputs.hires > 0
          ? (inputs.internalCost + inputs.externalCost) / inputs.hires
          : 0;
      return result("Cost per Hire", currency(cph), [
        {
          label: "Total Recruiting Cost",
          value: currency(inputs.internalCost + inputs.externalCost),
        },
      ]);
    }
    case "timeToFill": {
      const avg = inputs.hires > 0 ? inputs.totalDaysOpen / inputs.hires : 0;
      return result("Avg Days to Fill", number(avg, 1), [
        { label: "Roles Filled", value: `${inputs.hires}` },
      ]);
    }
    case "trainingRoi": {
      const roi =
        inputs.trainingCost > 0
          ? ((inputs.benefit - inputs.trainingCost) / inputs.trainingCost) * 100
          : 0;
      return result("Training ROI", `${number(roi, 1)}%`, [
        {
          label: "Net Benefit",
          value: currency(inputs.benefit - inputs.trainingCost),
        },
      ]);
    }
    case "performanceBonus": {
      const target = inputs.baseSalary * (inputs.targetBonusPct / 100);
      const payout = target * (inputs.attainment / 100);
      return result("Bonus Payout", currency(payout), [
        { label: "Target Bonus", value: currency(target) },
        { label: "Attainment", value: `${number(inputs.attainment, 0)}%` },
      ]);
    }
    case "relocationReimbursement": {
      const total =
        inputs.moving + inputs.tempHousing + inputs.travel + inputs.misc;
      return result("Relocation Total", currency(total), [
        { label: "Moving", value: currency(inputs.moving) },
        { label: "Temp Housing", value: currency(inputs.tempHousing) },
      ]);
    }
    case "perDiemAllowance": {
      const travel =
        inputs.travelDays *
        inputs.dailyRate *
        (inputs.travelDayRate / 100);
      const full = inputs.fullDays * inputs.dailyRate;
      return result("Trip Per Diem", currency(full + travel), [
        { label: "Full Days", value: currency(full) },
        { label: "Travel Days", value: currency(travel) },
      ]);
    }
    case "pensionVesting": {
      const vested = inputs.balance * (inputs.vestedPct / 100);
      return result("Vested Value", currency(vested), [
        {
          label: "Unvested",
          value: currency(inputs.balance - vested),
        },
        { label: "Years of Service", value: `${inputs.yearsService}` },
      ]);
    }

    // ——— Auto / Travel ———
    case "roadTripGas": {
      const gallons = inputs.mpg > 0 ? inputs.miles / inputs.mpg : 0;
      return result("Fuel Cost", currency(gallons * inputs.gasPrice), [
        { label: "Gallons", value: number(gallons, 2) },
      ]);
    }
    case "evChargingCost": {
      const kwh = inputs.batteryKwh * (inputs.chargePercent / 100);
      return result("Charge Cost", currency(kwh * inputs.rate), [
        { label: "Energy Added", value: `${number(kwh, 1)} kWh` },
      ]);
    }
    case "carLeaseVsBuy": {
      const lease =
        inputs.leasePayment * inputs.leaseMonths + inputs.dueAtSigning;
      const buy =
        inputs.loanPayment * inputs.loanMonths + inputs.downPayment;
      return result(
        lease <= buy ? "Lease Cash Out" : "Buy Cash Out",
        currency(Math.min(lease, buy)),
        [
          { label: "Total Lease Outlay", value: currency(lease) },
          { label: "Total Buy Payments", value: currency(buy) },
          { label: "Difference", value: currency(Math.abs(lease - buy)) },
        ]
      );
    }
    case "vehicleDepreciation": {
      const value =
        inputs.purchasePrice *
        Math.pow(1 - inputs.annualDepreciation / 100, inputs.years);
      return result("Estimated Value", currency(value), [
        {
          label: "Total Depreciation",
          value: currency(inputs.purchasePrice - value),
        },
      ]);
    }
    case "tollCommute": {
      const annual =
        inputs.tollOneWay * 2 * inputs.daysPerWeek * inputs.weeks;
      return result("Annual Toll Cost", currency(annual), [
        { label: "Monthly Approx", value: currency(annual / 12) },
      ]);
    }
    case "carInsuranceCompare": {
      const expA =
        inputs.premiumA + (inputs.claimChance / 100) * inputs.deductibleA;
      const expB =
        inputs.premiumB + (inputs.claimChance / 100) * inputs.deductibleB;
      return result(
        expA <= expB ? "Quote A Expected Cost" : "Quote B Expected Cost",
        currency(Math.min(expA, expB)),
        [
          { label: "Quote A Expected", value: currency(expA) },
          { label: "Quote B Expected", value: currency(expB) },
        ]
      );
    }
    case "flightCarbon": {
      const total = inputs.miles * inputs.kgPerMile * inputs.passengers;
      return result("CO₂ Estimate", `${number(total, 1)} kg`, [
        {
          label: "Per Passenger",
          value: `${number(inputs.passengers > 0 ? total / inputs.passengers : 0, 1)} kg`,
        },
      ]);
    }
    case "hotelStayBudget": {
      const room = (inputs.nightlyRate + inputs.resortFee) * inputs.nights;
      const total = room * (1 + inputs.taxRate / 100);
      return result("Stay Total", currency(total), [
        { label: "Before Tax", value: currency(room) },
        {
          label: "Per Night All-In",
          value: currency(inputs.nights > 0 ? total / inputs.nights : 0),
        },
      ]);
    }
    case "vacationCurrency": {
      const converted = inputs.homeBudget * inputs.exchangeRate;
      return result("Destination Budget", number(converted, 2), [
        {
          label: "Per Day",
          value: number(inputs.days > 0 ? converted / inputs.days : 0, 2),
        },
      ]);
    }
    case "baggageFee": {
      const bags = inputs.bagsPerTraveler;
      let per = 0;
      if (bags >= 1) per += inputs.feeFirst;
      if (bags >= 2) per += inputs.feeSecond * (bags - 1);
      const total = per * inputs.travelers;
      return result("Total Bag Fees", currency(total), [
        { label: "Per Traveler", value: currency(per) },
      ]);
    }
    case "speedingTicket": {
      const total =
        inputs.baseFine + inputs.overLimit * inputs.perMph + inputs.fees;
      return result("Estimated Fine", currency(total), [
        {
          label: "Overage Portion",
          value: currency(inputs.overLimit * inputs.perMph),
        },
      ]);
    }
    case "drivingDistanceMatrix": {
      const hours = inputs.avgSpeed > 0 ? inputs.distance / inputs.avgSpeed : 0;
      const gallons = inputs.mpg > 0 ? inputs.distance / inputs.mpg : 0;
      return result("Drive Time", `${number(hours, 2)} hrs`, [
        { label: "Fuel Cost", value: currency(gallons * inputs.gasPrice) },
        { label: "Gallons", value: number(gallons, 2) },
      ]);
    }
    case "parkingGarage": {
      const dayCost = Math.min(inputs.hourlyRate * inputs.hours, inputs.dailyCap);
      return result("Parking Total", currency(dayCost * inputs.days), [
        { label: "Per Day", value: currency(dayCost) },
      ]);
    }
    case "rvTowingWeight": {
      const used = inputs.trailerWeight + inputs.cargo;
      const remaining = inputs.towCapacity - used;
      return result("Remaining Capacity", `${number(remaining, 0)} lbs`, [
        {
          label: "Utilization",
          value: `${number(inputs.towCapacity > 0 ? (used / inputs.towCapacity) * 100 : 0, 1)}%`,
        },
        {
          label: "Status",
          value: remaining >= 0 ? "Within rating" : "Over capacity",
        },
      ]);
    }
    case "motorcycleLoan": {
      const principal = Math.max(0, inputs.price - inputs.downPayment);
      const payment = pmt(principal, inputs.annualRate, inputs.termMonths);
      return result("Monthly Payment", currency(payment), [
        { label: "Financed Amount", value: currency(principal) },
        {
          label: "Total Interest",
          value: currency(payment * inputs.termMonths - principal),
        },
      ]);
    }
    case "boatMaintenance": {
      const maint = inputs.boatValue * (inputs.maintPercent / 100);
      const total = maint + inputs.slipFees + inputs.insurance;
      return result("Annual Ownership Cost", currency(total), [
        { label: "Maintenance", value: currency(maint) },
        { label: "Slip + Insurance", value: currency(inputs.slipFees + inputs.insurance) },
      ]);
    }
    case "rideshareEarnings": {
      const afterFee = inputs.grossFares * (1 - inputs.platformFeePct / 100);
      const net = afterFee - inputs.fuelCost - inputs.otherExpenses;
      return result("Net Earnings", currency(net), [
        {
          label: "Hourly Net",
          value: currency(inputs.hours > 0 ? net / inputs.hours : 0),
        },
      ]);
    }
    case "transitPassSavings": {
      const payg = inputs.rideFare * inputs.ridesPerMonth;
      const savings = payg - inputs.passPrice;
      return result(
        savings >= 0 ? "Pass Saves" : "Pay-As-You-Go Better",
        currency(Math.abs(savings)),
        [
          { label: "Pay-As-You-Go Total", value: currency(payg) },
          { label: "Pass Price", value: currency(inputs.passPrice) },
        ]
      );
    }
    case "carRentalTotal": {
      const base = inputs.dailyRate * inputs.days;
      const total = base * (1 + inputs.taxRate / 100) + inputs.extras;
      return result("Rental Total", currency(total), [
        { label: "Base Days Cost", value: currency(base) },
        { label: "Extras", value: currency(inputs.extras) },
      ]);
    }
    case "jetLagPlanner": {
      const eastMultiplier = inputs.direction < 1.5 ? 1.2 : 1;
      const days =
        inputs.timeZones * inputs.recoveryFactor * eastMultiplier;
      return result("Recovery Days", number(days, 1), [
        {
          label: "Direction",
          value: inputs.direction < 1.5 ? "Eastbound" : "Westbound",
        },
      ]);
    }

    // ——— Lifestyle ———
    case "recipeScaler": {
      const factor =
        inputs.originalServings > 0
          ? inputs.desiredServings / inputs.originalServings
          : 0;
      return result("Scaled Amount", number(inputs.ingredientAmount * factor, 2), [
        { label: "Scale Factor", value: number(factor, 3) },
      ]);
    }
    case "bakingPanConverter": {
      const fromArea = inputs.fromLength * inputs.fromWidth;
      const toArea = inputs.toLength * inputs.toWidth;
      const scaled =
        fromArea > 0 ? inputs.batterCups * (toArea / fromArea) : 0;
      return result("Adjusted Batter Cups", number(scaled, 2), [
        { label: "From Area (in²)", value: number(fromArea, 1) },
        { label: "To Area (in²)", value: number(toArea, 1) },
      ]);
    }
    case "coffeeBrewRatio": {
      if (inputs.mode < 1.5) {
        const water = inputs.coffeeGrams * inputs.ratio;
        return result("Water Needed", `${number(water, 0)} g`, [
          { label: "Coffee Dose", value: `${number(inputs.coffeeGrams, 0)} g` },
          { label: "Ratio", value: `1:${number(inputs.ratio, 1)}` },
        ]);
      }
      const coffee =
        inputs.ratio > 0 ? inputs.waterGrams / inputs.ratio : 0;
      return result("Coffee Needed", `${number(coffee, 1)} g`, [
        { label: "Water", value: `${number(inputs.waterGrams, 0)} g` },
      ]);
    }
    case "meatCookingTime": {
      const cook = inputs.weightLbs * inputs.minutesPerLb;
      return result("Total Time", `${number(cook + inputs.restMinutes, 0)} min`, [
        { label: "Cook Time", value: `${number(cook, 0)} min` },
        { label: "Rest Time", value: `${number(inputs.restMinutes, 0)} min` },
      ]);
    }
    case "shutterExposure": {
      // EV ≈ log2(N^2/t) - log2(ISO/100); solve t
      const n2 = inputs.aperture * inputs.aperture;
      const isoTerm = Math.log2(inputs.iso / 100);
      const t = n2 / Math.pow(2, inputs.ev + isoTerm);
      return result("Shutter (sec)", number(t, 4), [
        { label: "Approx 1/x", value: t > 0 ? number(1 / t, 1) : "—" },
      ]);
    }
    case "hyperfocalDistance": {
      const H =
        inputs.aperture * inputs.coc > 0
          ? (inputs.focalLength * inputs.focalLength) /
              (inputs.aperture * inputs.coc) +
            inputs.focalLength
          : 0;
      return result("Hyperfocal (mm)", number(H, 1), [
        { label: "Hyperfocal (m)", value: number(H / 1000, 3) },
      ]);
    }
    case "timelapseInterval": {
      const frames = inputs.clipSeconds * inputs.fps;
      const eventSec = inputs.eventMinutes * 60;
      const interval = frames > 0 ? eventSec / frames : 0;
      return result("Shot Interval", `${number(interval, 2)} sec`, [
        { label: "Total Frames", value: number(frames, 0) },
      ]);
    }
    case "videoBitrateSize": {
      const videoBits = inputs.bitrateMbps * 1e6 * inputs.minutes * 60;
      const audioBits = inputs.audioKbps * 1000 * inputs.minutes * 60;
      const gb = (videoBits + audioBits) / 8 / 1e9;
      return result("Est. File Size", `${number(gb, 2)} GB`, [
        { label: "Megabytes", value: `${number(gb * 1024, 0)} MB` },
      ]);
    }
    case "audioWavelength": {
      const meters =
        inputs.frequency > 0 ? inputs.speedOfSound / inputs.frequency : 0;
      return result("Wavelength", `${number(meters, 3)} m`, [
        { label: "Feet", value: number(meters * 3.28084, 3) },
      ]);
    }
    case "lightingLumens": {
      const lumens = inputs.areaSqFt * inputs.footCandles;
      return result("Lumens Needed", number(lumens, 0), [
        { label: "Area", value: `${inputs.areaSqFt} sq ft` },
      ]);
    }
    case "plantWatering": {
      const days =
        inputs.baseDays / (inputs.climateFactor * inputs.plantFactor);
      return result("Days Between Watering", number(days, 1), [
        { label: "Base Days", value: `${inputs.baseDays}` },
      ]);
    }
    case "aquariumVolume": {
      const gallons =
        (inputs.length * inputs.width * inputs.height) / 231;
      return result("Volume", `${number(gallons, 1)} gal`, [
        { label: "Liters", value: number(gallons * 3.785, 1) },
      ]);
    }
    case "paintCoverage": {
      const gallons =
        inputs.coverage > 0
          ? (inputs.wallArea * inputs.coats) / inputs.coverage
          : 0;
      return result("Gallons Needed", number(gallons, 2), [
        { label: "Rounded Up", value: `${Math.ceil(gallons)}` },
      ]);
    }
    case "wallpaperRolls": {
      const needed =
        inputs.rollCoverage > 0
          ? (inputs.wallArea * (1 + inputs.wastePercent / 100)) /
            inputs.rollCoverage
          : 0;
      return result("Rolls to Buy", `${Math.ceil(needed)}`, [
        { label: "Exact Rolls", value: number(needed, 2) },
      ]);
    }
    case "flooringWaste": {
      const total = inputs.roomArea * (1 + inputs.wastePercent / 100);
      return result("Material Area", `${number(total, 1)} sq ft`, [
        { label: "Room Area", value: `${inputs.roomArea} sq ft` },
        { label: "Waste Added", value: `${number(total - inputs.roomArea, 1)} sq ft` },
      ]);
    }
    case "movingTruckSize": {
      const cuft =
        inputs.rooms * inputs.cuFtPerRoom + inputs.boxes * inputs.cuFtPerBox;
      let suggestion = "Cargo van / 10 ft";
      if (cuft > 800) suggestion = "26 ft truck";
      else if (cuft > 500) suggestion = "20 ft truck";
      else if (cuft > 300) suggestion = "16 ft truck";
      else if (cuft > 150) suggestion = "12 ft truck";
      return result("Est. Volume", `${number(cuft, 0)} cu ft`, [
        { label: "Suggested Class", value: suggestion },
      ]);
    }
    case "holidayGiftBudget": {
      const remaining = Math.max(0, inputs.totalBudget - inputs.reserved);
      const per =
        inputs.recipients > 0 ? remaining / inputs.recipients : remaining;
      return result("Per Recipient", currency(per), [
        { label: "Remaining Budget", value: currency(remaining) },
      ]);
    }
    case "weddingSeating": {
      const remaining = Math.max(0, inputs.guests - inputs.headTableSeats);
      const tables =
        inputs.seatsPerTable > 0
          ? Math.ceil(remaining / inputs.seatsPerTable)
          : 0;
      return result("Tables Needed", `${tables}`, [
        { label: "Guests at Standard Tables", value: `${remaining}` },
        { label: "Head Table Seats", value: `${inputs.headTableSeats}` },
      ]);
    }
    case "petFoodPortion": {
      const calories = inputs.petWeight * inputs.caloriesPerLb;
      const cups =
        inputs.caloriesPerCup > 0 ? calories / inputs.caloriesPerCup : 0;
      return result("Daily Cups", number(cups, 2), [
        { label: "Daily Calories", value: number(calories, 0) },
      ]);
    }
    case "aquariumCo2": {
      const daily = inputs.bubbleRate * 60 * 60 * inputs.hours;
      return result("Bubbles / Day", number(daily, 0), [
        {
          label: "Bubbles / Gal / Day",
          value: number(inputs.gallons > 0 ? daily / inputs.gallons : 0, 1),
        },
      ]);
    }
    case "bcUsedVehiclePst": {
      const purchase = Math.max(0, inputs.purchasePrice ?? 0);
      const blackBook = Math.max(0, inputs.blackBookValue ?? 0);
      const isZev = (inputs.isZeroEmission ?? 0) >= 0.5;
      const taxable = Math.max(purchase, blackBook);
      const rate = bcUsedVehiclePstRate(taxable, isZev);
      const pst = taxable * rate;
      const basis =
        purchase > blackBook
          ? "Purchase price"
          : blackBook > purchase
            ? "Black Book wholesale"
            : "Tied (same value)";
      let tier = "Zero-emission — 0% PST";
      if (!isZev) {
        if (taxable < 125_000) tier = "Under $125,000 — 12% PST";
        else if (taxable < 150_000) tier = "$125,000–$149,999 — 15% PST";
        else tier = "$150,000 and over — 20% PST";
      }
      return result("PST Owed", cad(pst), [
        { label: "Taxable Value", value: cad(taxable) },
        { label: "PST Rate", value: `${(rate * 100).toFixed(0)}%` },
        { label: "Luxury / ZEV Tier", value: tier },
        { label: "Taxed On", value: basis },
        { label: "Purchase Price", value: cad(purchase) },
        { label: "Black Book Wholesale", value: cad(blackBook) },
        {
          label: "Zero-Emission Vehicle",
          value: isZev ? "Yes — PST exempt" : "No",
        },
      ]);
    }

    // ——— Expansion pack (3 ready examples) ———
    case "paypalFee": {
      const sale = Math.max(0, inputs.saleAmount ?? 0);
      const pct = Math.max(0, inputs.percentFee ?? 0);
      const fixed = Math.max(0, inputs.fixedFee ?? 0);
      const fx = Math.max(0, inputs.fxPercent ?? 0);
      const percentTotal = pct + fx;
      const variableFee = (sale * percentTotal) / 100;
      const totalFee = variableFee + fixed;
      const net = sale - totalFee;
      const effective = sale > 0 ? (totalFee / sale) * 100 : 0;
      return result("Net Proceeds", currency(net), [
        { label: "Total Fees", value: currency(totalFee) },
        { label: "Variable Fees", value: currency(variableFee) },
        { label: "Fixed Fee", value: currency(fixed) },
        { label: "Effective Fee Rate", value: `${number(effective, 2)}%` },
        {
          label: "Rate Stack",
          value: `${number(pct, 2)}% + ${number(fx, 2)}% FX + ${currency(fixed)}`,
        },
      ]);
    }

    case "bcStatHolidayPay": {
      const avgDaily = Math.max(0, inputs.avgDailyWage ?? 0);
      const hourly = Math.max(0, inputs.hourlyRate ?? 0);
      const hours = Math.max(0, inputs.hoursWorked ?? 0);
      const premium = Math.max(1, inputs.statPremium ?? 1.5);
      const holidayPay = avgDaily;
      const workedPremium = hourly * hours * premium;
      const total = holidayPay + workedPremium;
      return result("Total Stat Holiday Pay", cad(total), [
        { label: "Holiday Pay (avg day)", value: cad(holidayPay) },
        { label: "Worked Premium", value: cad(workedPremium) },
        {
          label: "Premium Rate",
          value: currency(hourly * premium),
        },
        {
          label: "Hours Worked",
          value: number(hours, 1),
        },
        {
          label: "Note",
          value: "Planning estimate — confirm BC Employment Standards",
        },
      ]);
    }

    case "markup": {
      const cost = Math.max(0, inputs.cost ?? 0);
      const markupPct = Math.max(0, inputs.markupPercent ?? 0);
      const price = cost * (1 + markupPct / 100);
      const profit = price - cost;
      const marginPct = price > 0 ? (profit / price) * 100 : 0;
      return result("Selling Price", currency(price), [
        { label: "Profit / Unit", value: currency(profit) },
        { label: "Markup", value: `${number(markupPct, 1)}%` },
        { label: "Implied Margin", value: `${number(marginPct, 1)}%` },
        { label: "Cost", value: currency(cost) },
      ]);
    }

    // ——— Long-tail hubs (5 ready examples) ———
    case "warehouseOvertimePay": {
      const rate = Math.max(0, inputs.hourlyRate ?? 0);
      const regularH = Math.max(0, inputs.regularHours ?? 0);
      const otH = Math.max(0, inputs.overtimeHours ?? 0);
      const mult = Math.max(1, inputs.otMultiplier ?? 1.5);
      const regular = rate * regularH;
      const ot = rate * mult * otH;
      return result("Total Weekly Pay", currency(regular + ot), [
        { label: "Regular Pay", value: currency(regular) },
        { label: "Overtime Pay", value: currency(ot) },
        { label: "OT Hourly Rate", value: currency(rate * mult) },
      ]);
    }

    case "carCommuteCostPerWorkday": {
      const miles = Math.max(0, inputs.roundTripMiles ?? 0);
      const mpg = Math.max(0.1, inputs.mpg ?? 1);
      const gas = Math.max(0, inputs.gasPrice ?? 0);
      const wear = Math.max(0, inputs.wearPerMile ?? 0);
      const fuel = (miles / mpg) * gas;
      const wearCost = miles * wear;
      return result("Workday Cost", currency(fuel + wearCost), [
        { label: "Fuel Cost", value: currency(fuel) },
        { label: "Wear & Tear", value: currency(wearCost) },
        { label: "Cost / Mile", value: currency(miles > 0 ? (fuel + wearCost) / miles : 0) },
      ]);
    }

    case "airbnbCleaningCost": {
      const hours = Math.max(0, inputs.cleanHours ?? 0);
      const rate = Math.max(0, inputs.cleanerRate ?? 0);
      const supplies = Math.max(0, inputs.supplies ?? 0);
      const laundry = Math.max(0, inputs.laundry ?? 0);
      const labor = hours * rate;
      const total = labor + supplies + laundry;
      return result("Cleaning Cost / Turnover", currency(total), [
        { label: "Labor", value: currency(labor) },
        { label: "Supplies", value: currency(supplies) },
        { label: "Laundry / Linen", value: currency(laundry) },
      ]);
    }

    case "groceryCostPerMeal": {
      const spend = Math.max(0, inputs.groceryTotal ?? 0);
      const meals = Math.max(1, inputs.mealsCovered ?? 1);
      const people = Math.max(1, inputs.people ?? 1);
      const perMeal = spend / meals;
      const perPersonMeal = spend / (meals * people);
      return result("Cost Per Meal", currency(perMeal), [
        { label: "Per Person-Meal", value: currency(perPersonMeal) },
        { label: "Meals Covered", value: number(meals, 0) },
        { label: "Grocery Spend", value: currency(spend) },
      ]);
    }

    case "evWinterChargingCost": {
      const needed = Math.max(0, inputs.kwhNeeded ?? 0);
      const rate = Math.max(0, inputs.ratePerKwh ?? 0);
      const penalty = Math.max(0, inputs.winterPenaltyPct ?? 0);
      const winterKwh = needed * (1 + penalty / 100);
      const cost = winterKwh * rate;
      return result("Winter Charge Cost", currency(cost), [
        { label: "Winter kWh Drawn", value: number(winterKwh, 1) },
        { label: "Base kWh Needed", value: number(needed, 1) },
        { label: "Efficiency Loss", value: `${number(penalty, 0)}%` },
      ]);
    }

    // ——— Intent-80 hubs (6 ready examples — first tool per category) ———
    case "laundryCostPerLoad": {
      const kwh = Math.max(0, inputs.kwhPerLoad ?? 0);
      const rate = Math.max(0, inputs.ratePerKwh ?? 0);
      const gal = Math.max(0, inputs.gallonsWater ?? 0);
      const waterRate = Math.max(0, inputs.waterRatePerGal ?? 0);
      const detergent = Math.max(0, inputs.detergentCost ?? 0);
      const electric = kwh * rate;
      const water = gal * waterRate;
      const total = electric + water + detergent;
      return result("Cost Per Load", currency(total), [
        { label: "Electricity", value: currency(electric) },
        { label: "Water + Sewer", value: currency(water) },
        { label: "Detergent", value: currency(detergent) },
      ]);
    }

    case "idlingFuelCost": {
      const minutes = Math.max(0, inputs.idleMinutes ?? 0);
      const gph = Math.max(0, inputs.gallonsPerHour ?? 0);
      const gas = Math.max(0, inputs.gasPrice ?? 0);
      const gallons = (minutes / 60) * gph;
      const cost = gallons * gas;
      return result("Idling Fuel Cost", currency(cost), [
        { label: "Gallons Burned", value: number(gallons, 3) },
        { label: "Idle Minutes", value: number(minutes, 0) },
        { label: "Idle Rate", value: `${number(gph, 2)} gal/hr` },
      ]);
    }

    case "shiftDifferentialPay": {
      const base = Math.max(0, inputs.baseRate ?? 0);
      const pct = Math.max(0, inputs.diffPercent ?? 0);
      const flat = Math.max(0, inputs.flatAddOn ?? 0);
      const hours = Math.max(0, inputs.hours ?? 0);
      const premiumRate = base * (1 + pct / 100) + flat;
      const pay = premiumRate * hours;
      return result("Shift Pay", currency(pay), [
        { label: "Premium Hourly Rate", value: currency(premiumRate) },
        { label: "Differential %", value: `${number(pct, 1)}%` },
        { label: "Flat Add-On", value: currency(flat) },
        { label: "Hours", value: number(hours, 1) },
      ]);
    }

    case "roommateRentSplitByRoomSize": {
      const rent = Math.max(0, inputs.totalRent ?? 0);
      const yours = Math.max(0, inputs.roomSqFt ?? 0);
      const totalSq = Math.max(0.01, inputs.totalBedroomSqFt ?? 1);
      const sharePct = (yours / totalSq) * 100;
      const share = rent * (yours / totalSq);
      return result("Your Rent Share", currency(share), [
        { label: "Share of Bedrooms", value: `${number(sharePct, 1)}%` },
        { label: "Your Bedroom", value: `${number(yours, 0)} sq ft` },
        { label: "Total Rent", value: currency(rent) },
      ]);
    }

    case "freelanceRateAfterPlatformFees": {
      const gross = Math.max(0, inputs.grossRate ?? 0);
      const fee = Math.max(0, inputs.feePercent ?? 0);
      const hours = Math.max(0, inputs.hours ?? 0);
      const netRate = gross * (1 - fee / 100);
      const netProject = netRate * hours;
      return result("Net Hourly Rate", currency(netRate), [
        { label: "Net Project Proceeds", value: currency(netProject) },
        { label: "Fees on Project", value: currency(gross * hours - netProject) },
        { label: "Platform Fee", value: `${number(fee, 1)}%` },
      ]);
    }

    case "mealPrepCostPerMeal": {
      const grocery = Math.max(0, inputs.groceryCost ?? 0);
      const packaging = Math.max(0, inputs.packagingCost ?? 0);
      const meals = Math.max(1, inputs.meals ?? 1);
      const total = grocery + packaging;
      const perMeal = total / meals;
      return result("Cost Per Meal", currency(perMeal), [
        { label: "Batch Total Cost", value: currency(total) },
        { label: "Meals Prepared", value: number(meals, 0) },
        { label: "Packaging", value: currency(packaging) },
      ]);
    }

    case "dryerCostPerLoad": {
      const kwh = Math.max(0, inputs.kwhPerLoad ?? 0);
      const rate = Math.max(0, inputs.ratePerKwh ?? 0);
      const loads = Math.max(0, inputs.loadsPerWeek ?? 0);
      const perLoad = kwh * rate;
      return result("Cost Per Load", currency(perLoad), [
        { label: "Weekly Cost", value: currency(perLoad * loads) },
        { label: "Energy / Load", value: `${number(kwh, 2)} kWh` },
        { label: "Loads / Week", value: number(loads, 0) },
      ]);
    }

    case "driveThruIdlingCost": {
      const minutes = Math.max(0, inputs.idleMinutes ?? 0);
      const gph = Math.max(0, inputs.gallonsPerHour ?? 0);
      const gas = Math.max(0, inputs.gasPrice ?? 0);
      const trips = Math.max(0, inputs.tripsPerWeek ?? 0);
      const gallons = (minutes / 60) * gph;
      const cost = gallons * gas;
      return result("Cost Per Stop", currency(cost), [
        { label: "Weekly Cost", value: currency(cost * trips) },
        { label: "Gallons / Stop", value: number(gallons, 3) },
        { label: "Trips / Week", value: number(trips, 0) },
      ]);
    }

    case "twelveHourShiftPay": {
      const base = Math.max(0, inputs.baseRate ?? 0);
      const pct = Math.max(0, inputs.diffPercent ?? 0);
      const flat = Math.max(0, inputs.flatAddOn ?? 0);
      const hours = Math.max(0, inputs.hours ?? 12);
      const premiumRate = base * (1 + pct / 100) + flat;
      const pay = premiumRate * hours;
      return result("Shift Pay", currency(pay), [
        { label: "Premium Hourly Rate", value: currency(premiumRate) },
        { label: "Hours", value: number(hours, 1) },
        { label: "Differential %", value: `${number(pct, 1)}%` },
      ]);
    }

    case "masterBedroomFairRent": {
      const rent = Math.max(0, inputs.totalRent ?? 0);
      const yours = Math.max(0, inputs.roomSqFt ?? 0);
      const totalSq = Math.max(0.01, inputs.totalBedroomSqFt ?? 1);
      const premium = Math.max(0, inputs.premiumPercent ?? 0);
      const baseShare = rent * (yours / totalSq);
      const fair = baseShare * (1 + premium / 100);
      return result("Master Fair Rent", currency(fair), [
        { label: "Size-Based Share", value: currency(baseShare) },
        { label: "Premium Added", value: currency(fair - baseShare) },
        { label: "Share of Bedrooms", value: `${number((yours / totalSq) * 100, 1)}%` },
      ]);
    }

    case "mealPrepSellingPrice": {
      const grocery = Math.max(0, inputs.groceryCost ?? 0);
      const packaging = Math.max(0, inputs.packagingCost ?? 0);
      const meals = Math.max(1, inputs.meals ?? 1);
      const margin = Math.min(99, Math.max(0, inputs.marginPercent ?? 0));
      const costPerMeal = (grocery + packaging) / meals;
      const denom = 1 - margin / 100;
      const sell = denom > 0.01 ? costPerMeal / denom : costPerMeal;
      return result("Sell Price / Meal", currency(sell), [
        { label: "Cost Per Meal", value: currency(costPerMeal) },
        { label: "Margin / Meal", value: currency(sell - costPerMeal) },
        { label: "Target Margin", value: `${number(margin, 0)}%` },
      ]);
    }

    case "recipeCostPerServing": {
      const batch = Math.max(0, inputs.batchCost ?? 0);
      const servings = Math.max(1, inputs.servings ?? 1);
      const waste = Math.max(0, inputs.wastePercent ?? 0);
      const adjusted = batch * (1 + waste / 100);
      const perServing = adjusted / servings;
      return result("Cost Per Serving", currency(perServing), [
        { label: "Adjusted Batch Cost", value: currency(adjusted) },
        { label: "Servings", value: number(servings, 0) },
        { label: "Waste / Trim", value: `${number(waste, 0)}%` },
      ]);
    }

    // ——— Niche-65 hubs (6 ready examples — first tool per category) ———
    case "amazonFbaStorageFeeByBox": {
      const l = Math.max(0, inputs.lengthIn ?? 0);
      const w = Math.max(0, inputs.widthIn ?? 0);
      const h = Math.max(0, inputs.heightIn ?? 0);
      const boxes = Math.max(0, inputs.boxCount ?? 0);
      const rate = Math.max(0, inputs.ratePerCuFt ?? 0);
      const cuFtEach = (l * w * h) / 1728;
      const cuFtTotal = cuFtEach * boxes;
      const fee = cuFtTotal * rate;
      return result("Monthly Storage Fee", currency(fee), [
        { label: "Cu Ft / Box", value: number(cuFtEach, 2) },
        { label: "Total Cu Ft", value: number(cuFtTotal, 2) },
        { label: "Boxes", value: number(boxes, 0) },
        { label: "Rate", value: `${currency(rate)}/cu ft` },
      ]);
    }

    case "refrigeratorCostPerYear": {
      const kwh = Math.max(0, inputs.kwhPerYear ?? 0);
      const rate = Math.max(0, inputs.ratePerKwh ?? 0);
      const annual = kwh * rate;
      return result("Annual Cost", currency(annual), [
        { label: "Monthly Avg", value: currency(annual / 12) },
        { label: "kWh / Year", value: number(kwh, 0) },
        { label: "Rate", value: `${currency(rate)}/kWh` },
      ]);
    }

    case "dogFoodCostPerMonth": {
      const bagPrice = Math.max(0, inputs.bagPrice ?? 0);
      const bagLbs = Math.max(0.01, inputs.bagLbs ?? 1);
      const cupsDay = Math.max(0, inputs.cupsPerDay ?? 0);
      const cupsPerLb = Math.max(0.01, inputs.cupsPerLb ?? 1);
      const costPerLb = bagPrice / bagLbs;
      const lbsPerDay = cupsDay / cupsPerLb;
      const monthly = costPerLb * lbsPerDay * 30;
      return result("Monthly Food Cost", currency(monthly), [
        { label: "Cost / lb", value: currency(costPerLb) },
        { label: "lbs / Day", value: number(lbsPerDay, 2) },
        { label: "Annualized", value: currency(monthly * 12) },
      ]);
    }

    case "wfhElectricityCost": {
      const watts = Math.max(0, inputs.deviceWatts ?? 0);
      const hours = Math.max(0, inputs.hoursPerDay ?? 0);
      const days = Math.max(0, inputs.workdaysPerMonth ?? 0);
      const rate = Math.max(0, inputs.ratePerKwh ?? 0);
      const kwhDay = (watts * hours) / 1000;
      const monthly = kwhDay * days * rate;
      return result("Monthly Electricity", currency(monthly), [
        { label: "kWh / Workday", value: number(kwhDay, 3) },
        { label: "Cost / Workday", value: currency(kwhDay * rate) },
        { label: "Workdays", value: number(days, 0) },
      ]);
    }

    case "houseCleaningJobPrice": {
      const hours = Math.max(0, inputs.hours ?? 0);
      const rate = Math.max(0, inputs.hourlyRate ?? 0);
      const supplies = Math.max(0, inputs.supplies ?? 0);
      const travel = Math.max(0, inputs.travel ?? 0);
      const margin = Math.min(95, Math.max(0, inputs.marginPercent ?? 0));
      const cost = hours * rate + supplies + travel;
      const price = margin >= 100 ? cost : cost / (1 - margin / 100);
      return result("Recommended Quote", currency(price), [
        { label: "Job Cost", value: currency(cost) },
        { label: "Labor", value: currency(hours * rate) },
        { label: "Target Margin", value: `${number(margin, 0)}%` },
        { label: "Profit at Quote", value: currency(price - cost) },
      ]);
    }

    case "coffeeShopCostPerCup": {
      const beans = Math.max(0, inputs.beanCostPerCup ?? 0);
      const milk = Math.max(0, inputs.milkCost ?? 0);
      const cup = Math.max(0, inputs.cupLid ?? 0);
      const other = Math.max(0, inputs.other ?? 0);
      const total = beans + milk + cup + other;
      return result("Cost Per Cup", currency(total), [
        { label: "Beans / Shot", value: currency(beans) },
        { label: "Milk", value: currency(milk) },
        { label: "Cup + Lid", value: currency(cup) },
        { label: "Other", value: currency(other) },
      ]);
    }

    /*
     * TODO(expansion): remaining handlers in src/lib/expansion/tools.ts
     * TODO(longtail-hub): remaining handlers in src/lib/hubs/longTailPack.ts
     * TODO(intent-80): remaining 74 formulaTypes in src/lib/hubs/intent80Pack.ts
     *
     * TODO(niche-65): remaining 59 formulaTypes in src/lib/hubs/niche65Pack.ts
     * Logistics: etsyShippingCostPerItem, shopifyPackagingCostPerOrder, boxDimensionalWeight,
     *   shippingBoxCubicVolume, palletSpace, boxesFitOnPallet, palletWeightCapacity,
     *   containerFillPercentage, truckLoadWeight, warehouseStorageCostPerPallet,
     *   warehouseStorageCostPerCuFt, pickAndPackCostPerOrder, movingTruckCostPerRoom,
     *   movingBoxQuantityByApartment, storageUnitCostPerSqFt, closetStorageCapacity
     * Home specialty: freezerElectricityCostPerMonth, gamingPcMonitorElectricityCost,
     *   bathroomExhaustFanCost, heatedBathroomFloorCost, heatedTowelRackCost,
     *   aquariumFilterCost, aquariumHeaterCost, fishTankElectricityCost,
     *   hotTubElectricityCostPerMonth, hotTubHeatingCost, poolPumpElectricityCost,
     *   poolHeaterRunningCost
     * Pets: costToFeedLargeDog, puppyFoodCostPerYear, catLitterCostPerMonth,
     *   costPerCatLitterBoxCleaning, dogTreatCostPerMonth, petMedicationCostPerMonth,
     *   aquariumFishFoodCost, fishTankWaterChangeCost, multiplePetMonthlyCost
     * Remote: homeOfficeElectricityCost, laptopElectricityCostPerWorkday,
     *   externalMonitorElectricityCost, wfhInternetCostPerWorkday,
     *   homeOfficeTaxDeductionBySqFt, workingFromCafeCost, remoteWorkVsOfficeCost,
     *   workFromHomeSavings, secondMonitorCostVsProductivity
     * Trades: windowCleaningJobPrice, lawnMowingJobPrice, snowRemovalJobPrice,
     *   pressureWashingJobPrice, junkRemovalJobPrice, handymanMinimumCharge,
     *   painterJobQuote, mobileCarDetailingPrice, houseCleaningBreakEven
     * Events: bakeryCostPerCupcake, weddingCostPerGuest, airbnbCostPerOccupiedNight,
     *   airbnbCleaningCostPerBooking
     */

    case "expenseTracker":
      return result("Balance", "Use tracker", [
        {
          label: "Note",
          value: "Interactive localStorage ledger — open the Expense Tracker UI",
        },
      ]);

    case "jsonCsvConverter":
    case "xmlJsonConverter":
    case "yamlJsonConverter":
    case "csvTsvConverter":
    case "htmlMarkdownConverter":
    case "base64TextConverter":
    case "propertiesJsonConverter":
    case "pngJpgConverter":
    case "webpPngConverter":
    case "heicJpgConverter":
    case "svgPngConverter":
    case "bmpPngConverter":
    case "icoPngConverter":
    case "tiffJpgConverter":
    case "pdfTextConverter":
    case "imagesPdfConverter":
    case "htmlMarkdownPdfConverter":
    case "pdfMergeSplit":
    case "mp4Mp3Converter":
    case "wavMp3Converter":
    case "movMp4Converter":
    case "webmMp4Converter":
    case "oggFlacMp3Converter":
      return result("Output", "Use converter", [
        {
          label: "Note",
          value: "Interactive client-side file converter — open the tool workspace",
        },
      ]);

    case "aiNutrition": {
      const sex = inputs.sex >= 0.5 ? 1 : 0; // 1 male, 0 female
      const age = Math.max(15, inputs.age);
      const weightKg = Math.max(30, inputs.weightKg);
      const heightCm = Math.max(120, inputs.heightCm);
      const activity = Math.min(1.9, Math.max(1.2, inputs.activityMultiplier));
      const goalAdj = inputs.goalAdjustment ?? 0;

      // Mifflin–St Jeor
      const bmr =
        10 * weightKg +
        6.25 * heightCm -
        5 * age +
        (sex === 1 ? 5 : -161);
      const tdee = bmr * activity;
      const target = Math.max(1200, tdee + goalAdj);

      // Protein-forward macro split
      const proteinGrams = Math.round(weightKg * 1.8);
      const fatGrams = Math.round((target * 0.25) / 9);
      const proteinCals = proteinGrams * 4;
      const fatCals = fatGrams * 9;
      const carbGrams = Math.max(
        0,
        Math.round((target - proteinCals - fatCals) / 4)
      );

      return result("Daily Calorie Target", `${number(target, 0)} kcal`, [
        { label: "BMR (Mifflin–St Jeor)", value: `${number(bmr, 0)} kcal` },
        { label: "TDEE (Maintenance)", value: `${number(tdee, 0)} kcal` },
        { label: "Protein", value: `${proteinGrams} g` },
        { label: "Carbs", value: `${carbGrams} g` },
        { label: "Fat", value: `${fatGrams} g` },
        {
          label: "Profile",
          value: `${sex === 1 ? "Male" : "Female"} · activity ×${number(activity, 2)}`,
        },
      ]);
    }

    default: {
      if (isTechFormulaType(formulaType)) {
        const tech = runTechCalculation(formulaType, inputs);
        if (tech) return tech;
      }
      if (isTradesFormulaType(formulaType)) {
        const trades = runTradesCalculation(formulaType, inputs);
        if (trades) return trades;
      }
      if (isNiche50FormulaType(formulaType)) {
        const niche50 = runNiche50Calculation(formulaType, inputs);
        if (niche50) return niche50;
      }
      if (isHealthFormulaType(formulaType)) {
        const health = runHealthCalculation(formulaType, inputs);
        if (health) return health;
      }
      if (modeFromFormulaType(formulaType)) {
        return runAffordabilityCalculation(formulaType, inputs);
      }
      const crypto = runCryptoCalculation(formulaType, inputs);
      if (crypto) return crypto;
      return result("Result", "—", [
        { label: "Status", value: "Unknown formula type" },
      ]);
    }
  }
}
