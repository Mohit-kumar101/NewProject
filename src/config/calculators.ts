/**
 * Config-driven calculator registry (niche SEO pack).
 * Phase 1: tools #1–#5. Add remaining IDs here — do not create per-tool page files.
 */

export type ConfigField = {
  id: string;
  label: string;
  defaultValue: number;
  min: number;
  max: number;
  step: number;
  inputType?: "number" | "checkbox";
};

export type ConfigFaq = {
  question: string;
  answer: string;
};

export type ConfigResultRow = {
  label: string;
  value: string;
};

export type ConfigCalcResult = {
  primaryLabel: string;
  primaryValue: string;
  rows: ConfigResultRow[];
  /** Dynamic “How it’s calculated” body for helpful-content SEO */
  howCalculated: string;
  note?: string;
};

export type ConfigCalculator = {
  id: number;
  slug: string;
  topic: string;
  /** Primary title format: Free [Topic] Calculator | [Benefit/Action] */
  seoTitle: string;
  metaDescription: string;
  h1: string;
  category: string;
  intro: string;
  benefit: string;
  keywords: string[];
  /** Unique schema extras — not cloned modifier lists */
  trailingWords: string[];
  fields: ConfigField[];
  faqs: ConfigFaq[];
  formulaSummary: string;
  applicationCategory:
    | "BusinessApplication"
    | "FinanceApplication"
    | "LifestyleApplication"
    | "UtilitiesApplication";
  compute: (values: Record<string, number>) => ConfigCalcResult;
};

function money(n: number, digits = 0): string {
  if (!Number.isFinite(n)) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(n);
}

function pct(n: number, digits = 1): string {
  if (!Number.isFinite(n)) return "—";
  return `${n.toFixed(digits)}%`;
}

function num(n: number, digits = 1): string {
  if (!Number.isFinite(n)) return "—";
  return n.toFixed(digits);
}

/** Tools #1–#5 — Career & work decisions */
export const CONFIG_CALCULATORS: ConfigCalculator[] = [
  {
    id: 1,
    slug: "offer-stack-comparator-calculator",
    topic: "Offer Stack Comparator",
    seoTitle:
      "Offer Stack Comparator | 3-Year Total Comp A vs B vs C",
    metaDescription:
      "Compare job offers A, B, and C on 3-year total compensation: base, bonus, signing, RSU vesting, 401k match, and commute.",
    h1: "Compare Job Offers A vs B vs C on 3-Year Total Compensation",
    category: "Career & Compensation",
    intro:
      "Line up Offer A, Offer B, and optional Offer C on one 3-year scorecard. See which stack wins after RSUs vest, 401k match, signing bonus, and commute, plus the dollar gap between them.",
    benefit: "Side-by-side total compensation across competing offers",
    keywords: [
      "compare job offers side by side",
      "3-year total compensation calculator",
      "RSU vesting offer comparison",
      "signing bonus vs commute cost",
    ],
    trailingWords: [
      "3-year total compensation",
      "RSU vesting",
      "401k match",
      "signing bonus",
    ],
    applicationCategory: "BusinessApplication",
    formulaSummary:
      "Per offer: 3yr_total = 3×(base + bonus + match%×base − commute) + RSU_y1..y3 + signing ; winner = max(Offer A, B, optional C)",
    fields: [
      {
        id: "base",
        label: "Base salary ($/year)",
        defaultValue: 120000,
        min: 30000,
        max: 500000,
        step: 1000,
      },
      {
        id: "bonus",
        label: "Expected annual bonus ($)",
        defaultValue: 15000,
        min: 0,
        max: 200000,
        step: 500,
      },
      {
        id: "signing",
        label: "Signing bonus ($)",
        defaultValue: 10000,
        min: 0,
        max: 150000,
        step: 500,
      },
      {
        id: "rsuYear1",
        label: "RSU / equity value — year 1 ($)",
        defaultValue: 20000,
        min: 0,
        max: 300000,
        step: 1000,
      },
      {
        id: "rsuYear2",
        label: "RSU / equity value — year 2 ($)",
        defaultValue: 20000,
        min: 0,
        max: 300000,
        step: 1000,
      },
      {
        id: "rsuYear3",
        label: "RSU / equity value — year 3 ($)",
        defaultValue: 20000,
        min: 0,
        max: 300000,
        step: 1000,
      },
      {
        id: "matchPct",
        label: "401k / RRSP match (% of base)",
        defaultValue: 4,
        min: 0,
        max: 15,
        step: 0.5,
      },
      {
        id: "commute",
        label: "Annual commute / WFH cost ($)",
        defaultValue: 3600,
        min: 0,
        max: 30000,
        step: 100,
      },
    ],
    faqs: [
      {
        question:
          "How does the offer stack compare RSUs, match, and commute?",
        answer:
          "Enter Offer A and Offer B (and toggle Offer C) with base, bonus, signing, three years of equity, retirement match, and commute. The estimator ranks them on the same 3-year total-comp formula and shows the gap to the leader.",
      },
      {
        question: "Can I compare three offers including RSUs and commute?",
        answer:
          "Yes. Enter base, bonus, signing, three years of RSU value, retirement match, and commute for each offer. The scorecard ranks 3-year totals and shows the gap.",
      },
      {
        question: "Does the 2026 update include RSU taxes?",
        answer:
          "No — RSU and signing values are pre-tax planning estimates. Tax withholding and vesting cliffs vary by employer. Use offer-letter numbers and treat the result as a decision aid, not tax advice.",
      },
      {
        question: "What makes this tool different from a single-offer calculator?",
        answer:
          "The unique feature is true multi-offer comparison: parallel inputs, a winner banner, per-metric table (cash, equity, signing, commute drag), and gap-vs-leader so you see how far apart stacks really are.",
      },
    ],
    compute: (v) => {
      // Fallback if generic engine is ever used; primary UI is OfferStackComparator.
      const base = v.base ?? 0;
      const bonus = v.bonus ?? 0;
      const signing = v.signing ?? 0;
      const rsu =
        (v.rsuYear1 ?? 0) + (v.rsuYear2 ?? 0) + (v.rsuYear3 ?? 0);
      const match = ((v.matchPct ?? 0) / 100) * base;
      const commute = v.commute ?? 0;
      const threeYearCash =
        3 * (base + bonus + match - commute) + rsu + signing;
      const annualized = threeYearCash / 3;
      return {
        primaryLabel: "3-year total compensation (net of commute)",
        primaryValue: money(threeYearCash),
        rows: [
          {
            label: "Cash + match over 3 years",
            value: money(3 * (base + bonus + match)),
          },
          { label: "Equity vesting (3 years)", value: money(rsu) },
          { label: "Signing bonus", value: money(signing) },
          { label: "Commute drag (3 years)", value: money(3 * commute) },
          { label: "Effective annualized stack", value: money(annualized) },
        ],
        howCalculated: `How it's calculated: 3-year total = 3 × (base ${money(base)} + bonus ${money(bonus)} + match ${money(match)} − commute ${money(commute)}) + RSU (${money(rsu)}) + signing ${money(signing)} = ${money(threeYearCash)}. Use the side-by-side Offer A/B/C UI for the full comparator experience.`,
        note: "Planning estimate. Equity value can change; verify vesting schedules on the offer letter.",
      };
    },
  },
  {
    id: 2,
    slug: "remote-stipend-true-value-calculator",
    topic: "Remote Stipend True Value",
    seoTitle:
      "Remote Stipend True Value | Keep After WFH Costs",
    metaDescription:
      "See how much of a remote stipend you keep after electricity, internet, desk gear, coworking, and optional tax.",
    h1: "What Is Your Remote Stipend Worth After Real WFH Costs?",
    category: "Career & Compensation",
    intro:
      "Subtract electricity, internet, amortized desk gear, and coworking from a monthly WFH stipend, then apply an optional tax haircut. The result is the cash you actually keep—not the headline perk.",
    benefit: "Measure net stipend after real WFH costs",
    keywords: [
      "remote stipend true value",
      "WFH stipend after electricity and internet",
      "work from home stipend net of desk costs",
      "coworking vs stipend tradeoff",
    ],
    trailingWords: [
      "after-tax stipend",
      "electricity and internet",
      "desk amortization",
      "coworking cost",
    ],
    applicationCategory: "FinanceApplication",
    formulaSummary:
      "true_monthly = stipend_monthly − (electricity + internet + desk_amortized + coworking) ; optional_tax_haircut = true_monthly × (1 − tax%)",
    fields: [
      {
        id: "stipend",
        label: "Monthly remote stipend ($)",
        defaultValue: 150,
        min: 0,
        max: 2000,
        step: 10,
      },
      {
        id: "electricity",
        label: "Extra WFH electricity ($/mo)",
        defaultValue: 25,
        min: 0,
        max: 300,
        step: 5,
      },
      {
        id: "internet",
        label: "Internet upgrade share ($/mo)",
        defaultValue: 30,
        min: 0,
        max: 200,
        step: 5,
      },
      {
        id: "deskCost",
        label: "Desk / chair / monitor cost ($)",
        defaultValue: 600,
        min: 0,
        max: 5000,
        step: 50,
      },
      {
        id: "deskMonths",
        label: "Amortize gear over (months)",
        defaultValue: 24,
        min: 1,
        max: 60,
        step: 1,
      },
      {
        id: "coworking",
        label: "Coworking / cafe spend ($/mo)",
        defaultValue: 0,
        min: 0,
        max: 800,
        step: 10,
      },
      {
        id: "taxPct",
        label: "Estimated tax on stipend (%)",
        defaultValue: 22,
        min: 0,
        max: 50,
        step: 1,
      },
    ],
    faqs: [
      {
        question: "What does this remote stipend true value calculator estimate?",
        answer:
          "It subtracts electricity, internet share, amortized desk gear, and coworking from your monthly stipend, then applies an optional tax haircut so you see take-home perk value online.",
      },
      {
        question: "Is a WFH stipend always taxable?",
        answer:
          "It depends on your country and employer policy. This 2026 update lets you set a tax percent so the formula stays flexible—confirm with payroll or a tax professional.",
      },
      {
        question: "Can I use this tool instead of an Excel stipend tracker?",
        answer:
          "Yes. Enter the same stipend, utilities, gear, and coworking lines you would put in a spreadsheet. The true-value line updates as you change each cost.",
      },
    ],
    compute: (v) => {
      const stipend = v.stipend ?? 0;
      const electricity = v.electricity ?? 0;
      const internet = v.internet ?? 0;
      const deskMonths = Math.max(1, v.deskMonths ?? 1);
      const deskAmort = (v.deskCost ?? 0) / deskMonths;
      const coworking = v.coworking ?? 0;
      const costs = electricity + internet + deskAmort + coworking;
      const pretaxNet = stipend - costs;
      const tax = (v.taxPct ?? 0) / 100;
      const afterTaxStipend = stipend * (1 - tax);
      const trueNet = afterTaxStipend - costs;
      const annual = trueNet * 12;
      return {
        primaryLabel: "True monthly stipend value (after tax + costs)",
        primaryValue: money(trueNet, 2),
        rows: [
          { label: "Pre-tax stipend − costs", value: money(pretaxNet, 2) },
          { label: "After-tax stipend", value: money(afterTaxStipend, 2) },
          { label: "Monthly WFH cost stack", value: money(costs, 2) },
          { label: "Desk gear amortized / mo", value: money(deskAmort, 2) },
          { label: "True annual value", value: money(annual) },
        ],
        howCalculated: `How it's calculated: Monthly costs = electricity ${money(electricity, 2)} + internet ${money(internet, 2)} + desk amortized ${money(deskAmort, 2)} + coworking ${money(coworking, 2)} = ${money(costs, 2)}. After-tax stipend = ${money(stipend, 2)} × (1 − ${pct(v.taxPct ?? 0, 0)}) = ${money(afterTaxStipend, 2)}. True value = after-tax stipend − costs = ${money(trueNet, 2)}/mo (${money(annual)}/year).`,
        note: "Tax treatment varies. This is a planning estimator, not tax advice.",
      };
    },
  },
  {
    id: 3,
    slug: "non-compete-geographic-radius-value-calculator",
    topic: "Non-Compete Geographic Radius Value",
    seoTitle:
      "Non-Compete Radius Value | Negotiation Floor from Miles and Pay",
    metaDescription:
      "Turn restricted months, pay, and geographic radius into a cash negotiation floor for a non-compete clause.",
    h1: "What Is a Non-Compete Geographic Radius Worth in Cash?",
    category: "Career & Compensation",
    intro:
      "Restricted months × monthly pay, scaled by how far the radius reaches, becomes a negotiation floor. Use it to talk dollars instead of vague “we’ll be reasonable” language—not legal advice.",
    benefit: "Price a non-compete for negotiation",
    keywords: [
      "non-compete geographic radius value",
      "noncompete negotiation floor",
      "restricted months times pay",
      "non-compete radius miles",
    ],
    trailingWords: [
      "restricted months",
      "radius miles",
      "negotiation floor",
      "scarcity boost",
    ],
    applicationCategory: "BusinessApplication",
    formulaSummary:
      "floor = monthly_pay × restricted_months × radius_severity ; radius_severity = 0.7 + (miles/100)×0.15 (clamped 0.7–1.6)",
    fields: [
      {
        id: "monthlyPay",
        label: "Monthly pay at risk ($)",
        defaultValue: 10000,
        min: 2000,
        max: 50000,
        step: 250,
      },
      {
        id: "months",
        label: "Restricted months",
        defaultValue: 12,
        min: 1,
        max: 36,
        step: 1,
      },
      {
        id: "radiusMiles",
        label: "Geographic radius (miles)",
        defaultValue: 50,
        min: 5,
        max: 500,
        step: 5,
      },
      {
        id: "severityBoost",
        label: "Industry scarcity boost (0–50%)",
        defaultValue: 10,
        min: 0,
        max: 50,
        step: 5,
      },
    ],
    faqs: [
      {
        question: "How does this non-compete geographic radius value calculator work?",
        answer:
          "It multiplies monthly pay by restricted months and a radius severity factor (wider radius = higher multiplier), then applies an optional industry scarcity boost. The result is a planning negotiation floor, not a legal valuation.",
      },
      {
        question: "Is a non-compete enforceable in my state or province?",
        answer:
          "Laws changed rapidly into 2026 and vary widely. This online tool does not give legal advice—use the number to frame a conversation with an employment attorney.",
      },
      {
        question: "Why use this instead of an Excel non-compete model?",
        answer:
          "Same formula as a one-off spreadsheet: months × pay × radius factor, then an optional scarcity boost. The difference is you can change miles and months live while you negotiate.",
      },
    ],
    compute: (v) => {
      const monthly = v.monthlyPay ?? 0;
      const months = v.months ?? 0;
      const miles = v.radiusMiles ?? 0;
      const boost = (v.severityBoost ?? 0) / 100;
      const radiusFactor = Math.min(1.6, Math.max(0.7, 0.7 + (miles / 100) * 0.15));
      const baseFloor = monthly * months * radiusFactor;
      const floor = baseFloor * (1 + boost);
      const weekly = monthly / (52 / 12);
      return {
        primaryLabel: "Suggested negotiation floor",
        primaryValue: money(floor),
        rows: [
          { label: "Raw pay × months", value: money(monthly * months) },
          { label: "Radius severity factor", value: num(radiusFactor, 2) + "×" },
          { label: "Scarcity-adjusted floor", value: money(floor) },
          { label: "Implied weekly pay at risk", value: money(weekly) },
          {
            label: "Per restricted month (adjusted)",
            value: money(months > 0 ? floor / months : 0),
          },
        ],
        howCalculated: `How it's calculated: Radius factor = clamp(0.7 + (${num(miles, 0)} miles ÷ 100) × 0.15, 0.7–1.6) = ${num(radiusFactor, 2)}. Base floor = ${money(monthly)} × ${num(months, 0)} months × ${num(radiusFactor, 2)} = ${money(baseFloor)}. With scarcity boost ${pct(v.severityBoost ?? 0, 0)}, negotiation floor = ${money(floor)}. Not legal advice.`,
        note: "Planning aid only. Enforceability and remedies depend on jurisdiction—consult counsel.",
      };
    },
  },
  {
    id: 4,
    slug: "layoff-runway-cobra-shock-calculator",
    topic: "Layoff Runway + COBRA Shock",
    seoTitle:
      "Layoff Runway After COBRA | Weeks Until Cash Hits Zero",
    metaDescription:
      "Model layoff runway from savings, severance weeks, monthly burn, unemployment, and the COBRA premium jump.",
    h1: "How Many Weeks of Cash After a Layoff Once COBRA Hits?",
    category: "Career & Compensation",
    intro:
      "Cash in is savings plus severance weeks × weekly pay. Burn is essentials plus the COBRA jump minus unemployment. Runway weeks are how long that cash lasts—use it before you sign a package or drop coverage.",
    benefit: "Estimate cash runway after job loss",
    keywords: [
      "layoff runway with COBRA",
      "severance weeks until cash zero",
      "COBRA premium shock",
      "unemployment offset runway",
    ],
    trailingWords: [
      "severance weeks",
      "COBRA delta",
      "unemployment offset",
      "weeks of runway",
    ],
    applicationCategory: "FinanceApplication",
    formulaSummary:
      "cash_in = savings + severance_weeks × weekly_pay ; months = cash_in ÷ max(burn + cobra_delta, 1) ; weeks = months × 4.345",
    fields: [
      {
        id: "savings",
        label: "Liquid savings ($)",
        defaultValue: 15000,
        min: 0,
        max: 500000,
        step: 500,
      },
      {
        id: "weeklyPay",
        label: "Weekly pay (pre-tax) ($)",
        defaultValue: 2000,
        min: 400,
        max: 15000,
        step: 50,
      },
      {
        id: "severanceWeeks",
        label: "Severance (weeks of pay)",
        defaultValue: 8,
        min: 0,
        max: 52,
        step: 1,
      },
      {
        id: "burn",
        label: "Monthly essential burn ($)",
        defaultValue: 4500,
        min: 500,
        max: 25000,
        step: 100,
      },
      {
        id: "employerHealth",
        label: "Old employee health premium ($/mo)",
        defaultValue: 150,
        min: 0,
        max: 1500,
        step: 10,
      },
      {
        id: "cobra",
        label: "COBRA / replacement premium ($/mo)",
        defaultValue: 650,
        min: 0,
        max: 3000,
        step: 10,
      },
      {
        id: "uiWeekly",
        label: "Expected unemployment ($/week)",
        defaultValue: 400,
        min: 0,
        max: 1500,
        step: 25,
      },
    ],
    faqs: [
      {
        question: "What is COBRA shock in this layoff runway calculator?",
        answer:
          "COBRA shock is the jump from your employee payroll premium to the full COBRA (or marketplace) premium. The estimator adds that delta to monthly burn so runway is not overstated.",
      },
      {
        question: "Does this online formula include taxes on severance?",
        answer:
          "Severance is entered as weeks × weekly pay at face value. Actual net pay varies. Treat results as a planning estimator tool and refine with your last pay stub.",
      },
      {
        question: "Should I include COBRA before I sign a severance package?",
        answer:
          "Yes if you will lose employer health coverage. Adding the COBRA delta to burn is what usually cuts runway in half versus looking at severance weeks alone.",
      },
    ],
    compute: (v) => {
      const savings = v.savings ?? 0;
      const weeklyPay = v.weeklyPay ?? 0;
      const sevWeeks = v.severanceWeeks ?? 0;
      const burn = v.burn ?? 0;
      const employerHealth = v.employerHealth ?? 0;
      const cobra = v.cobra ?? 0;
      const uiWeekly = v.uiWeekly ?? 0;
      const severanceCash = sevWeeks * weeklyPay;
      const cashIn = savings + severanceCash;
      const cobraDelta = Math.max(0, cobra - employerHealth);
      const uiMonthly = uiWeekly * 4.345;
      const netBurn = Math.max(1, burn + cobraDelta - uiMonthly);
      const months = cashIn / netBurn;
      const weeks = months * 4.345;
      return {
        primaryLabel: "Estimated weeks until cash zero",
        primaryValue: `${num(weeks, 1)} weeks`,
        rows: [
          { label: "Cash in (savings + severance)", value: money(cashIn) },
          { label: "Severance cash", value: money(severanceCash) },
          { label: "COBRA premium shock / mo", value: money(cobraDelta) },
          { label: "UI offset / mo", value: money(uiMonthly) },
          { label: "Net monthly burn", value: money(netBurn) },
          { label: "Months of runway", value: num(months, 1) },
        ],
        howCalculated: `How it's calculated: Cash in = savings ${money(savings)} + (${num(sevWeeks, 0)} × ${money(weeklyPay)}) = ${money(cashIn)}. COBRA shock = ${money(cobra)} − ${money(employerHealth)} = ${money(cobraDelta)}/mo. Net burn = burn ${money(burn)} + COBRA shock − UI ${money(uiMonthly)} = ${money(netBurn)}. Runway weeks = (${money(cashIn)} ÷ ${money(netBurn)}) × 4.345 ≈ ${num(weeks, 1)}.`,
        note: "Unemployment rules and COBRA timing vary. Confirm benefits with HR and your state/province agency.",
      };
    },
  },
  {
    id: 5,
    slug: "shift-swap-fairness-scorer-calculator",
    topic: "Shift Swap Fairness Scorer",
    seoTitle:
      "Shift Swap Fairness | Hours, Weekend, and Night Weight",
    metaDescription:
      "Score whether a shift swap is fair using hours plus weekend and night differentials for both people.",
    h1: "Is This Shift Swap Fair After Weekend and Night Premiums?",
    category: "Career & Compensation",
    intro:
      "Each person gives hours weighted for weekend (+25%) and night (+35%). The delta says who owes whom. Use it for nurse, retail, or warehouse swaps before the schedule locks.",
    benefit: "Score whether a shift swap is equitable",
    keywords: [
      "shift swap fairness score",
      "weekend differential swap",
      "night premium schedule equity",
      "who owes whom after a swap",
    ],
    trailingWords: [
      "weekend differential",
      "night premium",
      "weighted hours",
      "swap delta",
    ],
    applicationCategory: "BusinessApplication",
    formulaSummary:
      "weight(h, weekend, night) = h × (1 + 0.25×weekend + 0.35×night) ; delta = weight_A_gives − weight_B_gives",
    fields: [
      {
        id: "hoursA",
        label: "Person A gives (hours)",
        defaultValue: 8,
        min: 1,
        max: 16,
        step: 0.5,
      },
      {
        id: "weekendA",
        label: "Person A shift is weekend",
        defaultValue: 1,
        min: 0,
        max: 1,
        step: 1,
        inputType: "checkbox",
      },
      {
        id: "nightA",
        label: "Person A shift is night",
        defaultValue: 0,
        min: 0,
        max: 1,
        step: 1,
        inputType: "checkbox",
      },
      {
        id: "hoursB",
        label: "Person B gives (hours)",
        defaultValue: 8,
        min: 1,
        max: 16,
        step: 0.5,
      },
      {
        id: "weekendB",
        label: "Person B shift is weekend",
        defaultValue: 0,
        min: 0,
        max: 1,
        step: 1,
        inputType: "checkbox",
      },
      {
        id: "nightB",
        label: "Person B shift is night",
        defaultValue: 1,
        min: 0,
        max: 1,
        step: 1,
        inputType: "checkbox",
      },
      {
        id: "hourly",
        label: "Base hourly rate for $ view ($)",
        defaultValue: 22,
        min: 10,
        max: 80,
        step: 1,
      },
    ],
    faqs: [
      {
        question: "How does the shift swap fairness scorer calculator work?",
        answer:
          "Each side’s hours are weighted: +25% if weekend, +35% if night. The delta between weighted hours shows who is giving more. A near-zero score means a fair swap.",
      },
      {
        question: "Can I use this online tool for union differential rules?",
        answer:
          "The 2026 update uses simple planning differentials. If your contract uses different premiums, treat this as a starting estimator and adjust the narrative with your CBA rates.",
      },
      {
        question: "Can nurse or retail teams use different weekend premiums?",
        answer:
          "The default is +25% weekend and +35% night. If your CBA uses other rates, treat the delta as a starting score and reweight with your contract percentages.",
      },
    ],
    compute: (v) => {
      const weight = (h: number, weekend: number, night: number) =>
        h * (1 + 0.25 * (weekend >= 0.5 ? 1 : 0) + 0.35 * (night >= 0.5 ? 1 : 0));
      const wA = weight(v.hoursA ?? 0, v.weekendA ?? 0, v.nightA ?? 0);
      const wB = weight(v.hoursB ?? 0, v.weekendB ?? 0, v.nightB ?? 0);
      const delta = wA - wB;
      const fairBand = Math.abs(delta) <= 0.75;
      const hourly = v.hourly ?? 0;
      const dollarDelta = delta * hourly;
      const verdict = fairBand
        ? "Fair swap"
        : delta > 0
          ? "Person B owes Person A"
          : "Person A owes Person B";
      const imbalanceNote = fairBand
        ? ""
        : ` (approx ${money(Math.abs(dollarDelta), 2)} at ${money(hourly)}/hr)`;
      return {
        primaryLabel: "Fairness verdict",
        primaryValue: verdict,
        rows: [
          { label: "Person A weighted hours", value: num(wA, 2) },
          { label: "Person B weighted hours", value: num(wB, 2) },
          { label: "Weighted hour delta (A − B)", value: num(delta, 2) },
          { label: "Approx $ imbalance", value: money(Math.abs(dollarDelta), 2) },
          {
            label: "Within fair band (±0.75h)?",
            value: fairBand ? "Yes" : "No — log an IOU",
          },
        ],
        howCalculated: `How it's calculated: Weighted hours = hours × (1 + 0.25×weekend + 0.35×night). Person A = ${num(v.hoursA ?? 0, 1)}h → ${num(wA, 2)}; Person B = ${num(v.hoursB ?? 0, 1)}h → ${num(wB, 2)}. Delta (A − B) = ${num(delta, 2)}. Verdict: ${verdict}${imbalanceNote}.`,
        note: "Planning scorer only—follow your workplace swap policy and manager approval rules.",
      };
    },
  },
];

export const CONFIG_CALCULATOR_SLUGS = new Set(
  CONFIG_CALCULATORS.map((c) => c.slug)
);

export function getConfigCalculatorBySlug(
  slug: string
): ConfigCalculator | undefined {
  return CONFIG_CALCULATORS.find((c) => c.slug === slug);
}

export function getAllConfigCalculatorSlugs(): string[] {
  return CONFIG_CALCULATORS.map((c) => c.slug);
}
