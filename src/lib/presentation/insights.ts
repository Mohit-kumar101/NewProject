import { parseMoneyish, parseNumberish } from "@/lib/investingEnhancements";
import type {
  ChartPoint,
  PresentationDeckInput,
  PresentationInput,
  PresentationMetric,
} from "@/lib/presentation/buildDeck";

export type ToolPackId =
  | "mortgage"
  | "debt"
  | "investing"
  | "tax"
  | "runway"
  | "general";

export function detectToolPack(input: PresentationDeckInput): ToolPackId {
  const hay = `${input.toolTitle} ${input.category}`.toLowerCase();
  if (
    /mortgage|home|rent|housing|afford|property|closing|down.?payment/.test(hay)
  ) {
    return "mortgage";
  }
  if (/debt|loan|credit|payoff|avalanche|snowball|refinance/.test(hay)) {
    return "debt";
  }
  if (/fire|invest|compound|retire|dividend|wealth|savings|401|rrsp/.test(hay)) {
    return "investing";
  }
  if (/tax|pst|ptt|payroll|salary|ctc|withholding/.test(hay)) {
    return "tax";
  }
  if (/runway|burn|emergency|cashflow|freelance|saas/.test(hay)) {
    return "runway";
  }
  return "general";
}

export function packLabels(pack: ToolPackId): {
  coverSubtitle: string;
  headlineTitle: string;
  chartPieTitle: string;
  chartBarTitle: string;
  chartLineTitle: string;
  calloutTitle: string;
} {
  switch (pack) {
    case "mortgage":
      return {
        coverSubtitle: "Housing affordability scenario",
        headlineTitle: "Payment & affordability outcome",
        chartPieTitle: "Cost stack breakdown",
        chartBarTitle: "Payment components",
        chartLineTitle: "Stress path (illustrative)",
        calloutTitle: "Rate & payment sensitivity",
      };
    case "debt":
      return {
        coverSubtitle: "Debt payoff scenario",
        headlineTitle: "Payoff outcome",
        chartPieTitle: "Balance mix",
        chartBarTitle: "Interest vs principal signals",
        chartLineTitle: "Paydown trajectory (illustrative)",
        calloutTitle: "What if extra payments change",
      };
    case "investing":
      return {
        coverSubtitle: "Wealth & growth scenario",
        headlineTitle: "Portfolio / goal outcome",
        chartPieTitle: "Contributions vs interest earned",
        chartBarTitle: "Key dollar results",
        chartLineTitle: "Growth path (illustrative)",
        calloutTitle: "Return & contribution sensitivity",
      };
    case "tax":
      return {
        coverSubtitle: "Tax estimate scenario",
        headlineTitle: "Tax / remittance outcome",
        chartPieTitle: "Liability composition",
        chartBarTitle: "Tax components",
        chartLineTitle: "Bracket sensitivity (illustrative)",
        calloutTitle: "Income shock callouts",
      };
    case "runway":
      return {
        coverSubtitle: "Cash runway scenario",
        headlineTitle: "Runway & burn outcome",
        chartPieTitle: "Cash uses",
        chartBarTitle: "Burn vs buffers",
        chartLineTitle: "Months remaining path (illustrative)",
        calloutTitle: "Burn-rate sensitivity",
      };
    default:
      return {
        coverSubtitle: "Planning scenario brief",
        headlineTitle: "Headline result",
        chartPieTitle: "Share of key amounts",
        chartBarTitle: "Metric comparison",
        chartLineTitle: "Trend view (illustrative)",
        calloutTitle: "Sensitivity callouts",
      };
  }
}

export function toMetric(label: string, value: string): PresentationMetric {
  const money = parseMoneyish(value);
  const num = Number.isFinite(money) ? money : parseNumberish(value);
  return {
    label,
    value,
    numeric: Number.isFinite(num) ? Math.abs(num) : null,
  };
}

/** Years, rates, multipliers, frequencies — never pie/bar “share” slices. */
function isNonAmountMetric(m: PresentationMetric): boolean {
  const label = m.label.toLowerCase();
  const value = m.value.toLowerCase();
  if (
    /phase|year|yrs?\b|month|week|day|multiplier|frequency|rate|apr|apy|percent|ratio|score|rank|term\b/.test(
      label
    )
  ) {
    return true;
  }
  if (/\$|£|€|₹|cad|usd|inr|eur|gbp/.test(value)) return false;
  if (/yr|yrs|year|month|weeks?|×|x\b|%|\/\s*year|per year/.test(value)) {
    return true;
  }
  return false;
}

function isMoneyMetric(m: PresentationMetric): boolean {
  if (m.numeric == null || m.numeric <= 0) return false;
  if (isNonAmountMetric(m)) return false;
  const value = m.value;
  if (/\$|£|€|₹/.test(value)) return true;
  // Currency-formatted without symbol (e.g. "12,450.00") when label looks financial
  if (
    /balance|contribution|interest|principal|payment|tax|insurance|fee|cost|equity|savings|income|burn|expense|premium|down|escrow|hoa|debt|loan|amount|growth|gain|piti|p&i/i.test(
      m.label
    ) &&
    /[0-9]/.test(value)
  ) {
    return true;
  }
  return /\$|£|€|₹/.test(value);
}

function isAggregateAmountLabel(label: string): boolean {
  return /final|ending|total balance|future value|overall|grand total|balance when|net worth|portfolio value|payoff total/i.test(
    label
  );
}

function toChartPoint(m: PresentationMetric): ChartPoint {
  return {
    name: m.label,
    value: m.numeric as number,
    display: m.value,
  };
}

/**
 * Prefer complementary money parts (e.g. contributions + interest) that
 * compose a whole — never mix years/rates into the pie.
 */
export function chartPoints(
  metrics: PresentationMetric[],
  limit = 8
): ChartPoint[] {
  return metrics
    .filter((m) => m.numeric != null && m.numeric > 0 && !isNonAmountMetric(m))
    .slice(0, limit)
    .map(toChartPoint);
}

function pickCompositionParts(
  money: PresentationMetric[],
  whole: PresentationMetric | null
): PresentationMetric[] | null {
  if (money.length < 2) return null;

  const parts = money.filter((m) => !isAggregateAmountLabel(m.label));
  const pool = parts.length >= 2 ? parts : money;

  // Named composition: contributions + interest (compound / investing)
  const contrib = pool.find(
    (m) =>
      /out-of-pocket|total contribution|contributions\b|amount contributed|invested\b|principal paid/i.test(
        m.label
      ) && !/balance|stopped|phase|when contribution/i.test(m.label)
  );
  const interest = pool.find(
    (m) =>
      /total interest|interest earned|interest gained|earnings from|investment gain/i.test(
        m.label
      ) && !/rate|apr|phase/i.test(m.label)
  );
  if (
    contrib &&
    interest &&
    contrib.label !== interest.label &&
    (contrib.numeric as number) > 0 &&
    (interest.numeric as number) > 0
  ) {
    return [contrib, interest];
  }

  // Mortgage / payment stack: pick tax, insurance, principal, interest, hoa, pmi
  const paymentParts = pool.filter((m) =>
    /principal|interest|tax|insurance|hoa|pmi|escrow|p&i|piti|fees?/i.test(
      m.label
    )
  );
  if (paymentParts.length >= 2) {
    return paymentParts.slice(0, 8);
  }

  // If a whole exists, pick a subset of parts that sum ≈ whole (within 3%)
  if (whole?.numeric != null && whole.numeric > 0) {
    const target = whole.numeric;
    const candidates = pool
      .filter((m) => m.label !== whole.label)
      .sort((a, b) => (b.numeric as number) - (a.numeric as number))
      .slice(0, 8);

    // Greedy: take largest parts until we reach ~target without overshooting badly
    const chosen: PresentationMetric[] = [];
    let sum = 0;
    for (const m of candidates) {
      const v = m.numeric as number;
      if (sum + v > target * 1.05 && chosen.length >= 2) continue;
      chosen.push(m);
      sum += v;
      if (sum >= target * 0.97 && chosen.length >= 2) break;
    }
    if (chosen.length >= 2 && Math.abs(sum - target) / target <= 0.08) {
      return chosen;
    }
  }

  // Drop aggregates that approximately equal the sum of other money rows
  const cleaned = [...pool];
  for (const agg of money.filter((m) => isAggregateAmountLabel(m.label))) {
    const others = cleaned.filter((m) => m.label !== agg.label);
    const sumOthers = others.reduce((s, m) => s + (m.numeric as number), 0);
    if (
      others.length >= 2 &&
      agg.numeric != null &&
      sumOthers > 0 &&
      Math.abs(sumOthers - agg.numeric) / agg.numeric < 0.05
    ) {
      const idx = cleaned.findIndex((m) => m.label === agg.label);
      if (idx >= 0) cleaned.splice(idx, 1);
    }
  }

  if (cleaned.length >= 2) return cleaned.slice(0, 8);
  return null;
}

/** Pie only from real money composition slices — correct values, no unit mix. */
export function usablePiePoints(
  metrics: PresentationMetric[],
  primary?: PresentationMetric
): ChartPoint[] {
  const money = metrics.filter(isMoneyMetric);
  const whole =
    primary && isMoneyMetric(primary)
      ? primary
      : money.find((m) => isAggregateAmountLabel(m.label)) ?? null;

  const parts = pickCompositionParts(money, whole);
  if (!parts || parts.length < 2) return [];

  // Dedupe by label; keep first
  const seen = new Set<string>();
  const unique = parts.filter((m) => {
    if (seen.has(m.label)) return false;
    seen.add(m.label);
    return true;
  });

  if (unique.length < 2) return [];
  const points = unique.map(toChartPoint);
  const total = points.reduce((s, p) => s + p.value, 0);
  if (total <= 0) return [];
  return points;
}

export function usableBarPoints(
  primary: PresentationMetric,
  metrics: PresentationMetric[]
): ChartPoint[] {
  const money = [primary, ...metrics].filter(isMoneyMetric);
  // Prefer distinct money metrics; skip pure duplicates of primary
  const seen = new Set<string>();
  const deduped: PresentationMetric[] = [];
  for (const m of money) {
    const key = `${m.label}:${m.numeric}`;
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(m);
  }
  return deduped.slice(0, 8).map(toChartPoint);
}

/** Percents that always sum to 100 (largest-remainder method). */
export function allocationPercents(values: number[]): number[] {
  const total = values.reduce((s, v) => s + v, 0);
  if (total <= 0) return values.map(() => 0);
  const exact = values.map((v) => (v / total) * 100);
  const floored = exact.map((v) => Math.floor(v));
  let remain = 100 - floored.reduce((s, v) => s + v, 0);
  const order = exact
    .map((v, i) => ({ i, frac: v - Math.floor(v) }))
    .sort((a, b) => b.frac - a.frac);
  const out = [...floored];
  for (let k = 0; k < order.length && remain > 0; k += 1) {
    out[order[k].i] += 1;
    remain -= 1;
  }
  return out;
}

/**
 * Build an illustrative trend series from the primary metric for line charts.
 * Not a forecast — a visual sensitivity ribbon for presentation.
 */
export function buildTrendPoints(primary: PresentationMetric): ChartPoint[] {
  if (primary.numeric == null || primary.numeric <= 0) return [];
  const base = primary.numeric;
  const factors = [0.7, 0.85, 1, 1.12, 1.25, 1.4];
  return factors.map((f, i) => {
    const value = Math.round(base * f * 100) / 100;
    return {
      name: `P${i + 1}`,
      value,
      display: primary.value.includes("$")
        ? `$${value.toLocaleString()}`
        : value.toLocaleString(),
    };
  });
}

export function buildSensitivityCallouts(
  input: PresentationDeckInput
): string[] {
  const primary = toMetric(input.primaryLabel, input.primaryValue);
  const callouts: string[] = [];

  if (primary.numeric != null && primary.numeric > 0) {
    const up = primary.numeric * 1.1;
    const down = primary.numeric * 0.9;
    const fmt = (n: number) =>
      input.primaryValue.includes("$")
        ? `$${Math.round(n).toLocaleString()}`
        : n.toLocaleString(undefined, { maximumFractionDigits: 2 });
    callouts.push(
      `If the headline outcome were ~10% higher → about ${fmt(up)}.`
    );
    callouts.push(
      `If the headline outcome were ~10% lower → about ${fmt(down)}.`
    );
  }

  const rateLike = input.inputs.find((i) =>
    /rate|apr|interest|%|tax|burn/i.test(i.label)
  );
  if (rateLike) {
    callouts.push(
      `Key driver watched: ${rateLike.label} is set to ${rateLike.value} — small moves here often swing the result.`
    );
  }

  const moneyInputs = input.inputs.filter((i) => {
    const n = parseMoneyish(i.value);
    return Number.isFinite(n) && Math.abs(n) >= 100;
  });
  if (moneyInputs[0]) {
    callouts.push(
      `Largest money input on this run: ${moneyInputs[0].label} (${moneyInputs[0].value}).`
    );
  }

  if (input.insight) callouts.push(input.insight);
  if (callouts.length === 0) {
    callouts.push(
      "Re-run the calculator with a stress case before treating this as a final plan."
    );
  }
  return callouts.slice(0, 5);
}

export function buildCompareFromStress(input: PresentationDeckInput): {
  labelA: string;
  labelB: string;
  primaryA: string;
  primaryB: string;
  deltaLabel: string;
} | null {
  const primary = toMetric(input.primaryLabel, input.primaryValue);
  if (primary.numeric == null || primary.numeric <= 0) return null;
  const a = primary.numeric;
  const b = primary.numeric * 1.1;
  const fmt = (n: number) =>
    input.primaryValue.includes("$")
      ? `$${Math.round(n).toLocaleString()}`
      : n.toLocaleString(undefined, { maximumFractionDigits: 2 });
  const delta = b - a;
  return {
    labelA: "Current scenario",
    labelB: "Illustrative +10% outcome",
    primaryA: input.primaryValue,
    primaryB: fmt(b),
    deltaLabel: input.primaryValue.includes("$")
      ? `Δ ${delta >= 0 ? "+" : ""}$${Math.round(delta).toLocaleString()}`
      : `Δ ${delta >= 0 ? "+" : ""}${delta.toLocaleString(undefined, { maximumFractionDigits: 2 })}`,
  };
}

export function formatInputs(
  items: PresentationInput[]
): PresentationInput[] {
  return items.length
    ? items
    : [{ label: "Scenario", value: "Current on-page values" }];
}
