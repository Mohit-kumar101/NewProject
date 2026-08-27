/**
 * India salary CTC → in-hand calculator (FY 2025-26 slabs).
 * Planning estimates — verify with payroll / CA for your employer structure.
 */

export type TaxRegime = "new" | "old";

export interface CtcInputs {
  annualCtc: number;
  basicPctOfGross: number;
  hraPctOfBasic: number;
  variablePayAnnual: number;
  metroCity: boolean;
  monthlyRent: number;
  section80C: number;
  section80D: number;
  otherDeductions: number;
  taxRegime: TaxRegime;
  professionalTaxAnnual: number;
  includeGratuityInCtc: boolean;
  includeEmployerPfInCtc: boolean;
}

export interface SalaryComponent {
  label: string;
  annual: number;
  monthly: number;
}

export interface TaxSlabRow {
  from: number;
  to: number | null;
  rate: number;
  tax: number;
}

export interface CtcResult {
  grossAnnual: number;
  grossMonthly: number;
  basic: number;
  hra: number;
  specialAllowance: number;
  employeePf: number;
  employerPf: number;
  gratuity: number;
  taxableIncome: number;
  incomeTax: number;
  cess: number;
  totalTax: number;
  netAnnual: number;
  netMonthly: number;
  inHandWithVariable: number;
  ctcToInHandPct: number;
  hraExemption: number;
  components: SalaryComponent[];
  taxSlabs: TaxSlabRow[];
  regimeComparison: { newRegimeNet: number; oldRegimeNet: number; better: TaxRegime };
  warnings: string[];
  insight: string;
}

const EMP_PF_CAP_MONTHLY = 1800;
const EMP_PF_RATE = 0.12;
const GRATUITY_RATE = 0.0481;
const CESS_RATE = 0.04;
const STD_DED_NEW = 75000;
const STD_DED_OLD = 50000;
const MAX_80C = 150000;

function clamp(n: number, min: number, max: number): number {
  if (!Number.isFinite(n)) return min;
  return Math.min(max, Math.max(min, n));
}

function pfAnnual(basicAnnual: number): number {
  const monthlyBasic = basicAnnual / 12;
  const monthlyPf = Math.min(monthlyBasic * EMP_PF_RATE, EMP_PF_CAP_MONTHLY);
  return monthlyPf * 12;
}

function computeTaxNew(taxable: number): { tax: number; slabs: TaxSlabRow[] } {
  const brackets: [number, number | null, number][] = [
    [0, 300_000, 0],
    [300_000, 700_000, 0.05],
    [700_000, 1_000_000, 0.1],
    [1_000_000, 1_200_000, 0.15],
    [1_200_000, 1_500_000, 0.2],
    [1_500_000, null, 0.3],
  ];
  return applySlabs(taxable, brackets);
}

function computeTaxOld(taxable: number): { tax: number; slabs: TaxSlabRow[] } {
  const brackets: [number, number | null, number][] = [
    [0, 250_000, 0],
    [250_000, 500_000, 0.05],
    [500_000, 1_000_000, 0.2],
    [1_000_000, null, 0.3],
  ];
  return applySlabs(taxable, brackets);
}

function applySlabs(
  taxable: number,
  brackets: [number, number | null, number][]
): { tax: number; slabs: TaxSlabRow[] } {
  const income = Math.max(0, taxable);
  let tax = 0;
  const slabs: TaxSlabRow[] = [];

  for (const [from, to, rate] of brackets) {
    const upper = to ?? Infinity;
    if (income <= from) {
      slabs.push({ from, to, rate: rate * 100, tax: 0 });
      continue;
    }
    const slice = Math.min(income, upper) - from;
    const sliceTax = slice * rate;
    tax += sliceTax;
    slabs.push({ from, to, rate: rate * 100, tax: sliceTax });
  }

  return { tax, slabs };
}

function hraExemption(
  basicAnnual: number,
  hraReceived: number,
  monthlyRent: number,
  metro: boolean
): number {
  const rentAnnual = Math.max(0, monthlyRent) * 12;
  const tenPctBasic = basicAnnual * 0.1;
  const cityFactor = metro ? 0.5 : 0.4;
  const limitBySalary = basicAnnual * cityFactor;
  const rentMinusBasic = Math.max(0, rentAnnual - tenPctBasic);
  return Math.min(hraReceived, rentMinusBasic, limitBySalary);
}

function buildResult(
  inputs: CtcInputs,
  regime: TaxRegime
): Omit<CtcResult, "regimeComparison" | "warnings" | "insight"> & {
  netAnnual: number;
} {
  const ctc = Math.max(0, inputs.annualCtc);
  const variable = Math.max(0, inputs.variablePayAnnual);

  let employerPf = 0;
  let gratuity = 0;

  let gross = ctc;
  if (inputs.includeEmployerPfInCtc || inputs.includeGratuityInCtc) {
    const estBasic = gross * (inputs.basicPctOfGross / 100);
    if (inputs.includeEmployerPfInCtc) employerPf = pfAnnual(estBasic);
    if (inputs.includeGratuityInCtc) gratuity = estBasic * GRATUITY_RATE;
    gross = ctc - employerPf - gratuity;
  }

  const basicPct = clamp(inputs.basicPctOfGross, 20, 70) / 100;
  const basic = gross * basicPct;
  const hra = basic * (clamp(inputs.hraPctOfBasic, 0, 100) / 100);
  const specialAllowance = Math.max(0, gross - basic - hra);

  const employeePf = pfAnnual(basic);
  if (!inputs.includeEmployerPfInCtc) {
    employerPf = pfAnnual(basic);
  } else {
    employerPf = pfAnnual(basic);
  }
  if (!inputs.includeGratuityInCtc) {
    gratuity = basic * GRATUITY_RATE;
  }

  const hraExempt =
    regime === "old"
      ? hraExemption(basic, hra, inputs.monthlyRent, inputs.metroCity)
      : 0;

  const ded80C =
    regime === "old" ? clamp(inputs.section80C, 0, MAX_80C) : 0;
  const ded80D = regime === "old" ? Math.max(0, inputs.section80D) : 0;
  const stdDed = regime === "new" ? STD_DED_NEW : STD_DED_OLD;

  const taxableIncome = Math.max(
    0,
    gross + variable - employeePf - stdDed - hraExempt - ded80C - ded80D - inputs.otherDeductions
  );

  const { tax, slabs } =
    regime === "new"
      ? computeTaxNew(taxableIncome)
      : computeTaxOld(taxableIncome);

  const cess = tax * CESS_RATE;
  const totalTax = tax + cess;
  const netAnnual = gross + variable - employeePf - totalTax - inputs.professionalTaxAnnual;
  const netMonthly = netAnnual / 12;
  const inHandWithVariable = netMonthly;

  const components: SalaryComponent[] = [
    { label: "Basic Salary", annual: basic, monthly: basic / 12 },
    { label: "HRA", annual: hra, monthly: hra / 12 },
    { label: "Special Allowance", annual: specialAllowance, monthly: specialAllowance / 12 },
    { label: "Variable Pay", annual: variable, monthly: variable / 12 },
    { label: "Employee PF (−)", annual: -employeePf, monthly: -employeePf / 12 },
    { label: "Income Tax (−)", annual: -totalTax, monthly: -totalTax / 12 },
    { label: "Professional Tax (−)", annual: -inputs.professionalTaxAnnual, monthly: -inputs.professionalTaxAnnual / 12 },
  ];

  return {
    grossAnnual: gross + variable,
    grossMonthly: (gross + variable) / 12,
    basic,
    hra,
    specialAllowance,
    employeePf,
    employerPf,
    gratuity,
    taxableIncome,
    incomeTax: tax,
    cess,
    totalTax,
    netAnnual,
    netMonthly,
    inHandWithVariable,
    ctcToInHandPct: ctc > 0 ? (netAnnual / ctc) * 100 : 0,
    hraExemption: hraExempt,
    components,
    taxSlabs: slabs,
  };
}

export function calculateCtc(inputs: CtcInputs): CtcResult {
  const warnings: string[] = [];
  const primary = buildResult(inputs, inputs.taxRegime);
  const asNew = buildResult(inputs, "new");
  const asOld = buildResult(inputs, "old");
  const better: TaxRegime =
    asNew.netAnnual >= asOld.netAnnual ? "new" : "old";

  if (inputs.basicPctOfGross < 40) {
    warnings.push(
      "Basic below ~40% of gross may reduce HRA and PF benefits — common in IT offer letters."
    );
  }
  if (inputs.taxRegime === "old" && inputs.monthlyRent <= 0) {
    warnings.push(
      "Old regime: enter rent paid to unlock HRA exemption — otherwise old regime may underperform."
    );
  }

  const insight =
    better === inputs.taxRegime
      ? `Your selected ${inputs.taxRegime} regime looks optimal (~₹${Math.round(primary.netMonthly).toLocaleString("en-IN")}/mo in-hand).`
      : `The ${better} regime may net ~₹${Math.round(Math.abs(asNew.netAnnual - asOld.netAnnual) / 12).toLocaleString("en-IN")}/mo more — compare before signing.`;

  return {
    ...primary,
    regimeComparison: {
      newRegimeNet: asNew.netAnnual,
      oldRegimeNet: asOld.netAnnual,
      better,
    },
    warnings,
    insight,
  };
}

/** Negotiation: increase basic by pct points, reduce special allowance */
export function negotiateBasic(
  inputs: CtcInputs,
  basicIncreasePctPoints: number
): CtcResult {
  const nextBasicPct = clamp(
    inputs.basicPctOfGross + basicIncreasePctPoints,
    20,
    70
  );
  return calculateCtc({ ...inputs, basicPctOfGross: nextBasicPct });
}

export function formatInr(n: number, digits = 0): string {
  if (!Number.isFinite(n)) return "—";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(n);
}
