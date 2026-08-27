/**
 * Advanced planner tools — bulk/cut macros, FIRE + property, India CTC salary.
 * SEO: keywords.json packs + long-tail modifiers on category-path tools.
 */

import type {
  Calculator,
  CalculatorInput,
  LongTailModifier,
} from "@/lib/types";
import { HEALTH_DISPLAY_CATEGORY } from "@/lib/categoryPaths";

const input = (
  id: string,
  label: string,
  defaultValue: number,
  min: number,
  max: number,
  step: number
): CalculatorInput => ({ id, label, defaultValue, min, max, step });

function modifier(
  slug: string,
  focusKeyword: string,
  explanation: string,
  extras?: Partial<LongTailModifier>
): LongTailModifier {
  return {
    slug,
    focusKeyword,
    explanation,
    route: true,
    benefit: extras?.benefit ?? "Instant results",
    faqs: extras?.faqs,
  };
}

function buildAdvancedTool(spec: {
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
  longTailModifiers?: LongTailModifier[];
  seoFaqs: { question: string; answer: string }[];
  howToUse: string[];
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
    longTailModifiers: spec.longTailModifiers,
    seoContextTemplate:
      'Searching "{{focusKeyword}}"? {{formulaSummary}} Example: {{example}} Free {{title}} for {{year}}—instant, private, no sign up.',
    explanationTemplate:
      '{{variantExplanation}} Use this free {{title}} for "{{focusKeyword}}" ({{year}}).',
    seoContent: {
      intro: spec.description,
      howToUse: spec.howToUse,
      faqs: spec.seoFaqs,
    },
  };
}

export const ADVANCED_TOOLS: Calculator[] = [
  buildAdvancedTool({
    slug: "bulk-cut-macro-planner",
    title: "Bulk & Cut Macro Planner",
    category: HEALTH_DISPLAY_CATEGORY,
    useCategoryPath: true,
    seoH1: "Bulk and Cut Macro Calculator for Lean Bulk & Cutting",
    seoDescription:
      "Free bulk and cut macro calculator: TDEE, lean bulk calories, cutting macro split, and protein by training experience. Instant planner—no sign up.",
    seoKeywords: [
      "bulk and cut macro calculator",
      "lean bulk macro calculator",
      "cutting macro calculator bodybuilding",
      "macro split calculator for cutting",
      "TDEE bulk cut calculator",
      "bodybuilding macro planner",
      "how to calculate macros for lean bulk",
      "weekly weight loss macro calculator",
      "calorie and macro planner for lifters",
      "free macro calculator no sign up",
    ],
    formulaType: "bulkCutMacroPlanner",
    description:
      "Bulk and cut macro calculator for lifters: set lean bulk or cutting calories from TDEE, weekly rate, and training experience—with protein-forward macros and training-day carb cycling.",
    formulaSummary:
      "Mifflin–St Jeor BMR → TDEE × activity → ±500 kcal per lb/week → protein by experience → fat 25–30% → remainder carbs.",
    realWorldExample:
      "180 lb intermediate lifter, TDEE 2,800, cut 0.75 lb/wk → ~2,425 kcal, 180 g protein, 65 g fat.",
    howToUse: [
      "Enter sex, age, height, weight, and activity level (metric or imperial).",
      "Pick training experience and phase: cut, maintain, or lean bulk.",
      "Set your weekly rate and optional goal weight for a timeline.",
      "Read daily calories, macro split, and training vs rest day carbs.",
    ],
    seoFaqs: [
      {
        question: "How do I calculate macros for a lean bulk?",
        answer:
          "Select bulk phase, enter body stats and lifting experience, and set a weekly gain rate (often 0.25–0.5 lb/week). The calculator adds a calorie surplus to TDEE and prioritizes protein before splitting carbs and fat.",
      },
      {
        question: "What macro split should I use when cutting?",
        answer:
          "Keep protein high (about 1.8–2.2 g/kg by experience), fat near 25–30% for hormones and satiety, and fill remaining calories with carbs. The planner caps weekly loss so deficits stay muscle-friendly.",
      },
      {
        question: "Does training experience change macro targets?",
        answer:
          "Yes. Beginners get tighter weekly rate caps and slightly higher protein on cuts. Advanced lifters may use higher protein on cuts but lower bulk rates to stay lean.",
      },
    ],
    longTailModifiers: [
      modifier(
        "lean-bulk-macros",
        "lean bulk macro calculator",
        "Calculate lean bulk calories and macros from TDEE, training experience, and weekly gain rate.",
        {
          benefit: "Plan bulk macros instantly",
          faqs: [
            {
              question: "How many calories for a lean bulk?",
              answer:
                "Typically TDEE plus 200–350 kcal/day (about 0.25–0.5 lb/week). This tool sets surplus from your chosen weekly rate and experience tier.",
            },
          ],
        }
      ),
      modifier(
        "cutting-macro-split",
        "cutting macro calculator bodybuilding",
        "Set cutting calories and macro splits from TDEE with safe weekly fat-loss caps for bodybuilding cuts.",
        {
          benefit: "Plan cut macros instantly",
          faqs: [
            {
              question: "How much protein when cutting for bodybuilding?",
              answer:
                "Aim for roughly 1.8–2.2 g per kg body weight depending on experience. The calculator sets protein first, then fat and carbs.",
            },
          ],
        }
      ),
      modifier(
        "bodybuilding-phase-planner",
        "bulk cut diet planner online free",
        "Plan bulk and cut phases with weekly rate targets, goal-weight timelines, and experience-based macro splits.",
        {
          benefit: "Phase planning for lifters",
        }
      ),
    ],
  }),
  buildAdvancedTool({
    slug: "financial-freedom-property-planner",
    title: "Financial Freedom & Property Planner",
    category: "Investing & Wealth Building",
    seoH1: "FIRE Calculator with Rental Property & Net Worth Milestones",
    seoDescription:
      "Financial freedom calculator with rental property, side income, and FIRE milestones. Year-by-year net worth projection—free, instant, no sign up.",
    seoKeywords: [
      "financial freedom calculator with rental property",
      "FIRE calculator with real estate",
      "financial independence timeline calculator",
      "net worth milestone planner",
      "multi income stream FIRE calculator",
      "rental property FIRE planner",
      "side income retirement calculator",
      "how to calculate FIRE with rental income",
      "financial freedom timeline calculator",
      "free FIRE planner no sign up",
    ],
    formulaType: "financialFreedomPropertyPlanner",
    description:
      "FIRE calculator with rental property: model salary, side income, expense inflation, investment returns, rental acquisitions, and net worth milestones to your financial independence date.",
    formulaSummary:
      "Year-by-year: income grows, expenses inflate, savings invest at blended return, properties add equity and rent minus debt service.",
    realWorldExample:
      "$95k salary + $12k side income, 4% withdrawal → FIRE ~year 18 with one $350k rental at year 5.",
    howToUse: [
      "Enter age, horizon, current investments, salary, and side income growth.",
      "Set monthly expenses, inflation, stock/bond returns, and withdrawal rate.",
      "Add rental properties with purchase year, price, rent, and mortgage terms.",
      "Review FIRE year, milestone timeline, net worth chart, and yearly table.",
    ],
    seoFaqs: [
      {
        question: "How do I calculate FIRE with rental property income?",
        answer:
          "Add each property’s purchase year, down payment, mortgage, rent, and expenses. Rental cash flow and equity roll into net worth while your portfolio grows from salary and side income savings.",
      },
      {
        question: "What is a good safe withdrawal rate for FIRE?",
        answer:
          "Many planners start at 4% of invested assets. For longer horizons or conservative assumptions, try 3–3.5% in the what-if controls.",
      },
      {
        question: "Can side hustle income shorten my FIRE timeline?",
        answer:
          "Yes—enter side income and an annual growth rate. Extra savings compound each year and can pull your FIRE milestone forward significantly.",
      },
    ],
  }),
  buildAdvancedTool({
    slug: "salary-ctc-in-hand-calculator",
    title: "Salary CTC to In-Hand Calculator",
    category: "Legal, HR & Payroll Management",
    seoH1: "CTC to In Hand Salary Calculator India (HRA, PF & Tax)",
    seoDescription:
      "India CTC to in-hand salary calculator: basic, HRA, PF, new vs old tax regime, and job-offer negotiation. Free monthly take-home estimate—instant, no sign up.",
    seoKeywords: [
      "CTC to in hand salary calculator India",
      "in hand salary calculator India",
      "salary breakdown calculator CTC HRA PF",
      "monthly in hand from CTC calculator",
      "new vs old tax regime salary calculator",
      "job offer CTC calculator India",
      "take home salary calculator after tax India",
      "how to calculate in hand salary from CTC",
      "18 lakh CTC in hand calculator",
      "salary negotiation calculator India",
    ],
    formulaType: "salaryCtcInHand",
    description:
      "India CTC to in-hand salary calculator: break down basic, HRA, special allowance, employee PF, FY 2025-26 tax under new or old regime, and compare negotiation scenarios before you accept an offer.",
    formulaSummary:
      "Gross from CTC minus employer costs → PF and slab tax → monthly in-hand; old regime adds HRA exemption and 80C/80D.",
    realWorldExample:
      "₹18 L CTC, 40% basic, new regime → ~₹1.05 L/mo in-hand after PF and tax.",
    howToUse: [
      "Enter annual CTC, basic % of gross, HRA % of basic, and variable pay.",
      "Toggle metro city; add rent, 80C, and 80D for old regime.",
      "Choose new vs old tax regime and review slab-wise tax.",
      "Use negotiation mode to test raising basic before signing.",
    ],
    seoFaqs: [
      {
        question: "How is in-hand salary calculated from CTC in India?",
        answer:
          "Start from CTC, subtract employer PF/gratuity to get gross, then deduct employee PF, income tax (per regime), and professional tax. Variable pay is included in the annual total.",
      },
      {
        question: "Which tax regime gives higher in-hand salary?",
        answer:
          "It depends on rent and deductions. New regime suits many without HRA/80C claims; old regime can win with metro HRA exemption and full 80C. The tool shows both monthly outcomes.",
      },
      {
        question: "Why does basic salary matter in CTC negotiation?",
        answer:
          "Basic drives HRA and PF. Raising basic can increase deductions (old regime) but also PF outflow—use the negotiation slider to see net monthly impact.",
      },
    ],
  }),
];

export const ADVANCED_TOOL_SLUGS = new Set(ADVANCED_TOOLS.map((t) => t.slug));

export const ADVANCED_CATEGORY_PATH_SLUGS = new Set(
  ADVANCED_TOOLS.filter((t) => t.useCategoryPath).map((t) => t.slug)
);

export const ADVANCED_FORMULA_TYPES = new Set([
  "bulkCutMacroPlanner",
  "financialFreedomPropertyPlanner",
  "salaryCtcInHand",
]);

export function isAdvancedFormulaType(formulaType: string): boolean {
  return ADVANCED_FORMULA_TYPES.has(formulaType);
}

export function getAdvancedToolBySlug(slug: string): Calculator | undefined {
  return ADVANCED_TOOLS.find((t) => t.slug === slug);
}
