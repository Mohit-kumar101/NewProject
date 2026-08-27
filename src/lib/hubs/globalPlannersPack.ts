/**
 * Global (locale-neutral) advanced planners — no country-specific tax/payroll rules.
 */

import type { Calculator, CalculatorInput } from "@/lib/types";
import { HEALTH_DISPLAY_CATEGORY } from "@/lib/categoryPaths";

const input = (
  id: string,
  label: string,
  defaultValue: number,
  min: number,
  max: number,
  step: number
): CalculatorInput => ({ id, label, defaultValue, min, max, step });

function buildGlobalTool(spec: {
  slug: string;
  title: string;
  category: string;
  seoH1: string;
  seoDescription: string;
  seoKeywords: string[];
  formulaType: string;
  description: string;
  formulaSummary: string;
  realWorldExample: string;
  useCategoryPath?: boolean;
  faqs: { question: string; answer: string }[];
}): Calculator {
  return {
    slug: spec.slug,
    title: spec.title,
    category: spec.category,
    description: spec.description,
    formulaType: spec.formulaType,
    useCategoryPath: spec.useCategoryPath ?? false,
    ready: true,
    seoTitle: spec.seoH1,
    seoH1: spec.seoH1,
    seoDescription: spec.seoDescription,
    seoKeywords: spec.seoKeywords,
    inputs: [input("placeholder", "Use workspace controls", 0, 0, 1, 1)],
    formulaSummary: spec.formulaSummary,
    realWorldExample: spec.realWorldExample,
    seoContextTemplate:
      'Searching "{{focusKeyword}}"? {{formulaSummary}} Example: {{example}} Free {{title}} for {{year}}—instant, private, no sign up.',
    seoContent: {
      intro: spec.description,
      howToUse: [
        "Enter your amounts in any currency — results update instantly.",
        "Use the unique scenario controls (adaptive bumps, shocks, forks, etc.).",
        "Compare outcomes before you commit — estimates only, not professional advice.",
      ],
      faqs: spec.faqs,
    },
  };
}

export const GLOBAL_PLANNER_TOOLS: Calculator[] = [
  buildGlobalTool({
    slug: "reverse-diet-planner",
    title: "Reverse Diet Planner",
    category: HEALTH_DISPLAY_CATEGORY,
    useCategoryPath: true,
    seoH1: "Reverse Diet Calculator with Adaptive Calorie Bumps",
    seoDescription:
      "Free reverse diet planner: weekly calorie increases that shrink automatically if weight is still dropping. Instant, no sign up.",
    seoKeywords: [
      "reverse diet calculator",
      "reverse diet planner",
      "maintenance calories after cut",
      "adaptive calorie increase calculator",
      "metabolic recovery diet planner",
    ],
    formulaType: "reverseDietPlanner",
    description:
      "Reverse diet planner with adaptive weekly calorie bumps — smaller increases when the scale is still dropping too fast.",
    formulaSummary:
      "Start below maintenance; add planned kcal/week; if observed weight change is below the gain band, next bump is halved.",
    realWorldExample:
      "1,800 kcal → 2,500 maintenance, +100 kcal/week, still losing → weeks 2–4 use +50 kcal bumps.",
    faqs: [
      {
        question: "What is a reverse diet?",
        answer:
          "A reverse diet gradually raises calories from a cut toward maintenance to reduce rebound fat gain and restore energy.",
      },
      {
        question: "How do adaptive bumps work?",
        answer:
          "If your observed weekly weight change is still well below your target gain band, the planner halves the next calorie bump automatically.",
      },
    ],
  }),
  buildGlobalTool({
    slug: "emergency-fund-runway-planner",
    title: "Emergency Fund & Runway Planner",
    category: "Investing & Wealth Building",
    seoH1: "Emergency Fund Calculator with Life-Shock Runway Simulator",
    seoDescription:
      "Free emergency fund and runway planner. Stress-test job loss, medical bills, rent hikes, and lost income — instant, no sign up.",
    seoKeywords: [
      "emergency fund calculator",
      "financial runway calculator",
      "months of expenses calculator",
      "job loss emergency fund",
      "how many months expenses saved",
    ],
    formulaType: "emergencyFundRunwayPlanner",
    description:
      "Emergency fund planner with a life-shock simulator: job loss, medical bill, rent hike, or partner income gone.",
    formulaSummary:
      "Runway months = liquid savings ÷ monthly expenses; shocks cut income or raise expenses and recompute runway.",
    realWorldExample:
      "12,000 saved / 3,200 expenses = 3.8 months; job-loss shock drops income to 0 and shows burn timeline.",
    faqs: [
      {
        question: "How many months should an emergency fund cover?",
        answer:
          "Common targets are 3–6 months of essential expenses; longer if income is variable. Use the target slider to plan your gap.",
      },
      {
        question: "What does the life-shock simulator do?",
        answer:
          "It applies scenarios like job loss or a one-time bill and shows how many months of runway remain afterward.",
      },
    ],
  }),
  buildGlobalTool({
    slug: "multi-goal-savings-planner",
    title: "Multi-Goal Savings Planner",
    category: "Investing & Wealth Building",
    seoH1: "Savings Goal Calculator — Sequential vs Split Funding Optimizer",
    seoDescription:
      "Free multi-goal savings planner. Compare sequential vs split funding and hit every deadline faster. Instant, no sign up.",
    seoKeywords: [
      "savings goal calculator",
      "multiple savings goals calculator",
      "how much to save per month for a goal",
      "savings timeline calculator",
      "prioritize savings goals",
    ],
    formulaType: "multiGoalSavingsPlanner",
    description:
      "Multi-goal savings timeline with a sequential vs split funding optimizer that recommends the fastest path to hit all deadlines.",
    formulaSummary:
      "Sequential funds goals by priority; split weights budget by urgency; recommend the mode that finishes all goals soonest on time.",
    realWorldExample:
      "900/mo for trip, emergency top-up, and laptop — optimizer picks sequential or split based on deadlines.",
    faqs: [
      {
        question: "Should I save for goals one at a time or split?",
        answer:
          "Sequential is best when priorities differ a lot. Split helps when several deadlines are tight. This tool compares both.",
      },
    ],
  }),
  buildGlobalTool({
    slug: "body-recomposition-planner",
    title: "Body Recomposition Planner",
    category: HEALTH_DISPLAY_CATEGORY,
    useCategoryPath: true,
    seoH1: "Body Recomposition Calculator with Training Volume Deficit Cap",
    seoDescription:
      "Free recomp macro calculator. Deficit and protein adjust to weekly hard sets so recovery keeps up. Instant, no sign up.",
    seoKeywords: [
      "body recomposition calculator",
      "recomp macros",
      "maintain weight lose fat gain muscle",
      "recomposition calorie calculator",
      "high protein recomp macros",
    ],
    formulaType: "bodyRecompPlanner",
    description:
      "Body recomposition planner with a training-volume deficit cap — more hard sets means a smaller deficit and higher protein.",
    formulaSummary:
      "TDEE from Mifflin–St Jeor; deficit capped by weekly hard sets; protein g/kg rises with volume; optional training/rest carb split.",
    realWorldExample:
      "70 hard sets/week → ~250 kcal deficit, ~2.0 g/kg protein, training-day carbs +12%.",
    faqs: [
      {
        question: "What is body recomposition?",
        answer:
          "Recomp aims to lose fat and gain muscle near maintenance calories with high protein and progressive training.",
      },
      {
        question: "Why cap the deficit by training volume?",
        answer:
          "High weekly set volume needs more recovery. A smaller deficit protects performance while protein stays elevated.",
      },
    ],
  }),
  buildGlobalTool({
    slug: "freelance-true-rate-planner",
    title: "Freelance True-Rate Planner",
    category: "Freelance & Self-Employment",
    seoH1: "Freelance Rate Calculator with Fee Waterfall & Reverse Invoice",
    seoDescription:
      "Free freelance hourly rate calculator. Stack platform, processor, FX, tax, and admin time — then invoice the exact amount to hit your net.",
    seoKeywords: [
      "freelance hourly rate calculator",
      "how much to charge after fees",
      "freelancer take home calculator",
      "platform fee rate calculator",
      "invoice to net calculator",
    ],
    formulaType: "freelanceTrueRatePlanner",
    description:
      "Freelance true-rate planner with a fee waterfall (platform → processor → FX → tax → non-billable) and reverse invoice math.",
    formulaSummary:
      "Work backward from desired net through tax, FX, processor, and platform fees to the invoice amount and hourly bill rate.",
    realWorldExample:
      "Want 4,000 net with 20% platform + 25% tax → invoice ~6,900+ depending on processor and admin time.",
    faqs: [
      {
        question: "How do I calculate a freelance rate after fees?",
        answer:
          "Start from the net you need, then reverse through tax, FX, payment fees, and platform fees to get the invoice price.",
      },
    ],
  }),
  buildGlobalTool({
    slug: "wedding-budget-cashflow-planner",
    title: "Wedding Budget Cashflow Planner",
    category: "Everyday Utilities & Savings",
    seoH1: "Wedding Budget Calculator with Deposit Cashflow Calendar",
    seoDescription:
      "Free wedding budget planner with deposit and final payment timing vs your savings — flags cash crunches. Instant, no sign up.",
    seoKeywords: [
      "wedding budget calculator",
      "wedding cost breakdown",
      "wedding deposit planner",
      "per guest wedding cost calculator",
      "wedding savings timeline",
    ],
    formulaType: "weddingBudgetCashflowPlanner",
    description:
      "Wedding budget line-item planner with a deposit milestone cashflow calendar against your savings balance.",
    formulaSummary:
      "Sum line items; schedule deposit % and finals by month; subtract from savings + monthly contributions; flag shortfall months.",
    realWorldExample:
      "Venue deposit month 2 + catering final month 10 vs 800/mo savings — tool shows if month 10 goes negative.",
    faqs: [
      {
        question: "How do I avoid wedding payment cash crunches?",
        answer:
          "Map every deposit and final to a month, then compare against savings growth. This planner highlights shortfall months early.",
      },
    ],
  }),
  buildGlobalTool({
    slug: "baby-first-year-cost-planner",
    title: "Baby First-Year Cost Planner",
    category: "Everyday Utilities & Savings",
    seoH1: "Baby Cost Calculator — First Year with Parental Leave Bridge",
    seoDescription:
      "Free baby first-year cost planner. Models leave pay, return to work, and childcare start to find your worst cash month.",
    seoKeywords: [
      "cost of baby first year calculator",
      "newborn budget planner",
      "parental leave budget calculator",
      "childcare cost timeline",
      "baby expense calculator",
    ],
    formulaType: "babyFirstYearCostPlanner",
    description:
      "Baby first-year cost planner with a parental leave income bridge into childcare start — finds the tightest cash month.",
    formulaSummary:
      "One-time + monthly costs; income reduced during leave months; childcare from a start month; track monthly net and cumulative.",
    realWorldExample:
      "4 months at 55% pay, childcare from month 7 — worst net often lands when leave ends and care begins.",
    faqs: [
      {
        question: "What is the parental leave bridge?",
        answer:
          "The period when income is reduced and childcare may start. Modeling both shows the real cash crunch month.",
      },
    ],
  }),
  buildGlobalTool({
    slug: "subscription-runway-audit",
    title: "Subscription Runway Audit",
    category: "Everyday Utilities & Savings",
    seoH1: "Subscription Spending Calculator with Emergency Runway Meter",
    seoDescription:
      "Free subscription audit. Pause costs and see how many months of emergency runway you gain — no fee on savings. Instant.",
    seoKeywords: [
      "subscription spending calculator",
      "cancel subscriptions savings calculator",
      "monthly fixed costs calculator",
      "subscription audit tool",
      "emergency fund runway subscriptions",
    ],
    formulaType: "subscriptionRunwayAudit",
    description:
      "Subscription and fixed-cost audit with a runway extension meter — pause items and see months of emergency runway gained.",
    formulaSummary:
      "Runway = savings ÷ (expenses + active subs); pausing subs raises runway and frees monthly cash toward goals.",
    realWorldExample:
      "Pause 80/mo of streaming → runway rises ~0.3–0.5 months depending on burn rate, plus 960/year free cash.",
    faqs: [
      {
        question: "How does pausing subscriptions extend runway?",
        answer:
          "Lower monthly burn means the same savings lasts more months. The meter shows the before/after runway instantly.",
      },
    ],
  }),
  buildGlobalTool({
    slug: "keep-lease-buy-car-tco",
    title: "Keep vs Lease vs Buy Car TCO",
    category: "Automotive, Travel & Transit",
    seoH1: "Keep vs Lease vs Buy Calculator — Car Total Cost Matrix",
    seoDescription:
      "Free car TCO calculator comparing keep, lease, and buy by year. See the cheapest fork each year. Instant, any currency.",
    seoKeywords: [
      "lease vs buy calculator",
      "keep car vs buy new calculator",
      "car total cost of ownership calculator",
      "should I lease or buy",
      "keep old car vs upgrade",
    ],
    formulaType: "keepLeaseBuyCarTco",
    description:
      "Three-way car TCO planner: keep current vs lease vs buy — year-by-year matrix highlighting the cheapest option.",
    formulaSummary:
      "Accumulate fuel, insurance, repairs, payments, and depreciation/fees for keep, lease, and buy; mark cheapest cumulative cost each year.",
    realWorldExample:
      "Over 5 years keep may win early; buy can win later after residual credit — matrix shows the flip year.",
    faqs: [
      {
        question: "Is keeping my old car cheaper than leasing?",
        answer:
          "Often yes early on if repairs stay reasonable. This tool compares keep, lease, and buy with your km and fuel price.",
      },
    ],
  }),
];

export const GLOBAL_PLANNER_SLUGS = new Set(
  GLOBAL_PLANNER_TOOLS.map((t) => t.slug)
);

export const GLOBAL_CATEGORY_PATH_SLUGS = new Set(
  GLOBAL_PLANNER_TOOLS.filter((t) => t.useCategoryPath).map((t) => t.slug)
);

export const GLOBAL_FORMULA_TYPES = new Set([
  "reverseDietPlanner",
  "emergencyFundRunwayPlanner",
  "multiGoalSavingsPlanner",
  "bodyRecompPlanner",
  "freelanceTrueRatePlanner",
  "weddingBudgetCashflowPlanner",
  "babyFirstYearCostPlanner",
  "subscriptionRunwayAudit",
  "keepLeaseBuyCarTco",
]);

export function isGlobalPlannerFormula(formulaType: string): boolean {
  return GLOBAL_FORMULA_TYPES.has(formulaType);
}

export function getGlobalPlannerBySlug(slug: string): Calculator | undefined {
  return GLOBAL_PLANNER_TOOLS.find((t) => t.slug === slug);
}
