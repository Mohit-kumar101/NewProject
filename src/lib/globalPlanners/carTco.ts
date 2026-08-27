/**
 * Car TCO: Keep vs Lease vs Buy.
 * Unique: three-way fork matrix — cheapest option by year heatmap.
 */

import { clamp } from "./money";

export interface CarTcoInputs {
  years: number;
  kmPerYear: number;
  fuelPricePerLiter: number;
  /** Keep */
  keepValueNow: number;
  keepFuelLPer100km: number;
  keepInsuranceYear: number;
  keepRepairYear: number;
  keepOtherYear: number;
  /** Lease */
  leaseDown: number;
  leaseMonthly: number;
  leaseMonths: number;
  leaseFuelLPer100km: number;
  leaseInsuranceYear: number;
  leaseFees: number;
  /** Buy */
  buyPrice: number;
  buyDown: number;
  buyLoanRatePct: number;
  buyLoanYears: number;
  buyFuelLPer100km: number;
  buyInsuranceYear: number;
  buyRepairYear: number;
  buyResidualPct: number;
}

export interface YearCostRow {
  year: number;
  keep: number;
  lease: number;
  buy: number;
  cheapest: "keep" | "lease" | "buy";
}

export interface CarTcoResult {
  byYear: YearCostRow[];
  totals: { keep: number; lease: number; buy: number };
  winner: "keep" | "lease" | "buy";
  insight: string;
}

function loanPayment(principal: number, ratePct: number, years: number): number {
  if (principal <= 0 || years <= 0) return 0;
  const r = ratePct / 100 / 12;
  const n = years * 12;
  if (r === 0) return principal / n;
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

export function calculateCarTco(inputs: CarTcoInputs): CarTcoResult {
  const years = clamp(Math.round(inputs.years), 1, 8);
  const km = Math.max(0, inputs.kmPerYear);
  const fuel = Math.max(0, inputs.fuelPricePerLiter);

  const fuelCost = (lPer100: number) => (km / 100) * lPer100 * fuel;

  const loanPrin = Math.max(0, inputs.buyPrice - inputs.buyDown);
  const monthlyLoan = loanPayment(
    loanPrin,
    inputs.buyLoanRatePct,
    inputs.buyLoanYears
  );

  const byYear: YearCostRow[] = [];
  let keepCum = 0;
  let leaseCum = inputs.leaseDown + inputs.leaseFees;
  let buyCum = inputs.buyDown;

  for (let y = 1; y <= years; y++) {
    const keepY =
      fuelCost(inputs.keepFuelLPer100km) +
      inputs.keepInsuranceYear +
      inputs.keepRepairYear * (1 + (y - 1) * 0.08) +
      inputs.keepOtherYear;
    // Opportunity: residual decline of keep car (simple)
    const keepDep = y === 1 ? inputs.keepValueNow * 0.12 : inputs.keepValueNow * 0.08;
    keepCum += keepY + keepDep;

    const leaseActive = (y - 1) * 12 < inputs.leaseMonths;
    const leaseY = leaseActive
      ? inputs.leaseMonthly * 12 +
        fuelCost(inputs.leaseFuelLPer100km) +
        inputs.leaseInsuranceYear
      : fuelCost(inputs.leaseFuelLPer100km) + inputs.leaseInsuranceYear;
    leaseCum += leaseY;

    const loanActive = y <= inputs.buyLoanYears;
    const buyY =
      (loanActive ? monthlyLoan * 12 : 0) +
      fuelCost(inputs.buyFuelLPer100km) +
      inputs.buyInsuranceYear +
      inputs.buyRepairYear * (1 + (y - 1) * 0.05);
    buyCum += buyY;
    // At end of horizon, credit residual
    let buyDisplay = buyCum;
    if (y === years) {
      buyDisplay -= inputs.buyPrice * (clamp(inputs.buyResidualPct, 0, 80) / 100);
    }

    const keep = Math.round(keepCum);
    const lease = Math.round(leaseCum);
    const buy = Math.round(buyDisplay);
    const cheapest =
      keep <= lease && keep <= buy
        ? "keep"
        : lease <= buy
          ? "lease"
          : "buy";

    byYear.push({ year: y, keep, lease, buy, cheapest });
  }

  const last = byYear[byYear.length - 1];
  const totals = { keep: last.keep, lease: last.lease, buy: last.buy };
  const winner = last.cheapest;
  const insight = `Over ${years} years, ${winner} wins at ~${totals[winner].toLocaleString()} total cost. Matrix shows the cheapest fork each year as assumptions compound.`;

  return { byYear, totals, winner, insight };
}
