/**
 * Freelance True-Rate Planner.
 * Unique: fee waterfall — platform → processor → FX → tax → non-billable → reverse invoice.
 */

import { clamp } from "./money";

export interface FreelanceRateInputs {
  desiredNetMonthly: number;
  billableHoursPerWeek: number;
  weeksPerMonth: number;
  platformFeePct: number;
  processorFeePct: number;
  processorFixed: number;
  fxLossPct: number;
  taxPct: number;
  nonBillablePct: number;
}

export interface WaterfallStep {
  label: string;
  pctOrAmount: string;
  amountAfter: number;
  deducted: number;
}

export interface FreelanceRateResult {
  invoiceGross: number;
  hourlyBillRate: number;
  waterfall: WaterfallStep[];
  effectiveTakeHomePct: number;
  insight: string;
}

export function calculateFreelanceRate(
  inputs: FreelanceRateInputs
): FreelanceRateResult {
  const net = Math.max(0, inputs.desiredNetMonthly);
  const hours =
    Math.max(1, inputs.billableHoursPerWeek) *
    clamp(inputs.weeksPerMonth, 2, 5);
  const plat = clamp(inputs.platformFeePct, 0, 40) / 100;
  const proc = clamp(inputs.processorFeePct, 0, 15) / 100;
  const fixed = Math.max(0, inputs.processorFixed);
  const fx = clamp(inputs.fxLossPct, 0, 10) / 100;
  const tax = clamp(inputs.taxPct, 0, 60) / 100;
  const nonBill = clamp(inputs.nonBillablePct, 0, 70) / 100;

  // Work backwards: net is after tax; gross before tax = net / (1-tax)
  // Before FX/platform/processor stacking on invoice amount I:
  // After platform: I*(1-plat)
  // After processor: I*(1-plat)*(1-proc) - fixed
  // After FX: that * (1-fx)
  // After tax: that * (1-tax) = net
  // Also non-billable means billable hours are only (1-nonBill) of total time —
  // but for invoice reverse we solve for I such that take-home = net.

  const afterTaxFactor = 1 - tax;
  const afterFxFactor = 1 - fx;
  const afterPlatProc = (1 - plat) * (1 - proc);

  // net = (I * afterPlatProc - fixed) * afterFxFactor * afterTaxFactor
  // I * afterPlatProc - fixed = net / (afterFx * afterTax)
  const needBeforeFxTax =
    afterTaxFactor > 0 && afterFxFactor > 0
      ? net / (afterFxFactor * afterTaxFactor)
      : net;
  const needAfterPlatform = needBeforeFxTax + fixed;
  const invoiceGross =
    afterPlatProc > 0 ? needAfterPlatform / afterPlatProc : needAfterPlatform;

  const waterfall: WaterfallStep[] = [];
  let cur = invoiceGross;
  waterfall.push({
    label: "Invoice / project price",
    pctOrAmount: "100%",
    amountAfter: cur,
    deducted: 0,
  });

  const platDed = cur * plat;
  cur -= platDed;
  waterfall.push({
    label: "Platform fee",
    pctOrAmount: `${(plat * 100).toFixed(1)}%`,
    amountAfter: cur,
    deducted: platDed,
  });

  const procDed = cur * proc + fixed;
  cur -= procDed;
  waterfall.push({
    label: "Payment processor",
    pctOrAmount: `${(proc * 100).toFixed(1)}% + ${fixed.toFixed(0)} fixed`,
    amountAfter: cur,
    deducted: procDed,
  });

  const fxDed = cur * fx;
  cur -= fxDed;
  waterfall.push({
    label: "FX / currency loss",
    pctOrAmount: `${(fx * 100).toFixed(1)}%`,
    amountAfter: cur,
    deducted: fxDed,
  });

  const taxDed = cur * tax;
  cur -= taxDed;
  waterfall.push({
    label: "Tax reserve",
    pctOrAmount: `${(tax * 100).toFixed(1)}%`,
    amountAfter: cur,
    deducted: taxDed,
  });

  // Effective hourly: billable hours only; non-billable inflates true cost of time
  const productiveHours = hours * (1 - nonBill);
  const hourlyBillRate = productiveHours > 0 ? invoiceGross / hours : 0;
  const trueHourly = productiveHours > 0 ? cur / productiveHours : 0;

  const effectiveTakeHomePct =
    invoiceGross > 0 ? (cur / invoiceGross) * 100 : 0;

  const insight = `Invoice ~${Math.round(invoiceGross).toLocaleString()} to net ~${Math.round(net).toLocaleString()} (${effectiveTakeHomePct.toFixed(0)}% take-home). Bill ~${Math.round(hourlyBillRate)}/hr on ${hours} billable hrs; true productive rate ~${Math.round(trueHourly)}/hr after ${Math.round(nonBill * 100)}% admin time.`;

  return {
    invoiceGross: Math.round(invoiceGross),
    hourlyBillRate: Math.round(hourlyBillRate * 100) / 100,
    waterfall: waterfall.map((s) => ({
      ...s,
      amountAfter: Math.round(s.amountAfter),
      deducted: Math.round(s.deducted),
    })),
    effectiveTakeHomePct,
    insight,
  };
}
