export function clampDate(y: number, m: number, d: number): Date {
  const month = Math.min(12, Math.max(1, Math.round(m)));
  const year = Math.round(y);
  const maxDay = new Date(year, month, 0).getDate();
  const day = Math.min(maxDay, Math.max(1, Math.round(d)));
  return new Date(year, month - 1, day);
}

export function daysBetween(a: Date, b: Date): number {
  const av = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const bv = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.round((bv - av) / 86_400_000);
}

export function addYears(date: Date, years: number): Date {
  return new Date(date.getFullYear() + years, date.getMonth(), date.getDate());
}

export function ageYears(birth: Date, today = new Date()): number {
  let age = today.getFullYear() - birth.getFullYear();
  const beforeBirthday =
    today.getMonth() < birth.getMonth() ||
    (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate());
  if (beforeBirthday) age -= 1;
  return Math.max(0, age);
}

export function futureValue(
  principal: number,
  monthly: number,
  annualRate: number,
  years: number
): number {
  const r = annualRate / 100 / 12;
  const n = Math.max(0, years) * 12;
  if (n === 0) return Math.max(0, principal);
  if (Math.abs(r) < 1e-12) return principal + monthly * n;
  return (
    principal * Math.pow(1 + r, n) + monthly * ((Math.pow(1 + r, n) - 1) / r)
  );
}

/** Months to grow principal + monthly deposits to a target. */
export function monthsToTarget(
  principal: number,
  monthly: number,
  annualRate: number,
  target: number
): number | null {
  if (target <= principal) return 0;
  const r = annualRate / 100 / 12;
  if (monthly <= 0 && r <= 0) return null;
  if (Math.abs(r) < 1e-12) {
    if (monthly <= 0) return null;
    return Math.ceil((target - principal) / monthly);
  }
  if (monthly <= 0) {
    if (principal <= 0) return null;
    return Math.ceil(Math.log(target / principal) / Math.log(1 + r));
  }
  const num = (target * r + monthly) / (principal * r + monthly);
  if (num <= 0) return null;
  return Math.ceil(Math.log(num) / Math.log(1 + r));
}

export function inflate(amount: number, annualInflation: number, years: number) {
  return amount * Math.pow(1 + annualInflation / 100, Math.max(0, years));
}

export function realValue(
  amount: number,
  annualInflation: number,
  years: number
) {
  const factor = Math.pow(1 + annualInflation / 100, Math.max(0, years));
  return factor <= 0 ? amount : amount / factor;
}

/** 4% rule nest egg. */
export function nestEggForSpend(annualSpend: number, withdrawalPct: number) {
  const pct = Math.max(0.5, withdrawalPct);
  return annualSpend / (pct / 100);
}

export function yearsMoneyLasts(
  savings: number,
  annualSpend: number,
  annualReturn: number,
  annualInflation: number
): number {
  if (annualSpend <= 0) return Infinity;
  let bal = savings;
  let spend = annualSpend;
  const r = annualReturn / 100;
  const i = annualInflation / 100;
  for (let y = 1; y <= 80; y++) {
    bal = bal * (1 + r) - spend;
    if (bal <= 0) return y - 1 + Math.max(0, (bal + spend) / spend);
    spend *= 1 + i;
  }
  return 80;
}

export function weekendsUntil(end: Date, start = new Date()): number {
  const days = Math.max(0, daysBetween(new Date(start), new Date(end)));
  return Math.floor(days / 7);
}
