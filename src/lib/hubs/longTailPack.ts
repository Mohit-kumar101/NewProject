/**
 * Long-tail hub pack — five ready tools (overtime, commute, Airbnb, grocery, EV).
 */

import type { Calculator, CalculatorInput, LongTailModifier } from "@/lib/types";
import { SEO_CONTENT_YEAR } from "@/lib/keywords";

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
    benefit: extras?.benefit,
    faqs: extras?.faqs,
  };
}

/** ——— 1. Warehouse Overtime Pay (Shift Work & Payroll) ——— */
const warehouseOvertimePay: Calculator = {
  slug: "warehouse-overtime-pay-calculator",
  title: "Warehouse Overtime Pay Calculator",
  category: "Shift Work & Payroll",
  description:
    "Estimate warehouse weekly pay from regular hours, overtime hours, and time-and-a-half (or custom) premiums.",
  formulaType: "warehouseOvertimePay",
  useCategoryPath: true,
  ready: true,
  inputs: [
    input("hourlyRate", "Base Hourly Rate ($)", 22, 10, 80, 0.25),
    input("regularHours", "Regular Hours / Week", 40, 0, 60, 0.5),
    input("overtimeHours", "Overtime Hours / Week", 8, 0, 40, 0.5),
    input("otMultiplier", "OT Multiplier", 1.5, 1, 3, 0.1),
  ],
  formulaSummary:
    "Weekly pay = (rate × regular hours) + (rate × OT multiplier × OT hours).",
  realWorldExample:
    "At $22/hr with 40 regular + 8 OT at 1.5×, regular pay is $880, OT is $264, and weekly total is $1,144.",
  seoContextTemplate:
    "Looking up “{{focusKeyword}}”? {{formulaSummary}} Real-world example: {{example}} Updated for {{year}}—free, instant, no sign up.",
  explanationTemplate:
    "{{variantExplanation}} Free {{title}} for “{{focusKeyword}}” ({{year}}).",
  longTailModifiers: [
    modifier(
      "time-and-a-half",
      "warehouse overtime pay calculator time and a half",
      "Most warehouse OT policies use time-and-a-half (1.5×) after 40 hours. Set the multiplier to 1.5 and adjust OT hours to mirror your punch clock.",
      {
        benefit: "Model 1.5× warehouse OT",
        faqs: [
          {
            question:
              "How do I calculate warehouse overtime pay at time and a half in {{year}}?",
            answer:
              "Enter base rate, regular hours, OT hours, and set the multiplier to 1.5. Weekly pay = regular + (rate × 1.5 × OT hours).",
          },
        ],
      }
    ),
    modifier(
      "double-time-weekend",
      "warehouse weekend double time pay calculator",
      "Some warehouses pay double time on Sundays or holidays. Set the OT multiplier to 2.0 for those hours to estimate weekend premiums.",
      { benefit: "Estimate weekend double time" }
    ),
  ],
  seoContent: {
    intro:
      "Warehouse shifts often stack OT after 40 hours. Model regular and premium hours before you accept extra shifts.",
    howToUse: [
      "Enter your base hourly warehouse rate.",
      "Set regular hours and overtime hours for the week.",
      "Confirm the OT multiplier (commonly 1.5).",
      "Read regular pay, OT pay, and weekly total.",
    ],
    faqs: [
      {
        question: "How do I calculate warehouse overtime pay?",
        answer:
          "Multiply regular hours by your base rate, then multiply OT hours by rate × multiplier, and add both. Confirm local labor rules for daily vs weekly OT.",
      },
      {
        question: "Is this warehouse overtime calculator free?",
        answer:
          "Yes. Instant results in your browser with no sign up. Estimates are for planning—not payroll advice.",
      },
    ],
  },
};

/** ——— 2. Car Commute Cost Per Workday (Commute & Vehicle Costs) ——— */
const carCommutePerWorkday: Calculator = {
  slug: "car-commute-cost-per-workday-calculator",
  title: "Car Commute Cost Per Workday Calculator",
  category: "Commute & Vehicle Costs",
  description:
    "Estimate the fuel (and optional wear) cost of a round-trip car commute for a single workday.",
  formulaType: "carCommuteCostPerWorkday",
  useCategoryPath: true,
  ready: true,
  inputs: [
    input("roundTripMiles", "Round-Trip Distance (mi)", 30, 1, 200, 1),
    input("mpg", "Fuel Economy (MPG)", 28, 5, 80, 0.5),
    input("gasPrice", "Gas Price ($/gal)", 3.89, 1, 10, 0.01),
    input("wearPerMile", "Wear & Tear ($/mi)", 0.1, 0, 1, 0.01),
  ],
  formulaSummary:
    "Fuel cost = (miles ÷ MPG) × gas price; total workday cost = fuel + (miles × wear).",
  realWorldExample:
    "A 30-mile round trip at 28 MPG and $3.89/gal costs about $4.17 in fuel, plus $3.00 wear at $0.10/mi → ~$7.17 per workday.",
  seoContextTemplate:
    "Use this {{title}} for “{{focusKeyword}}”. {{formulaSummary}} Example: {{example}} Planning figures for {{year}}.",
  explanationTemplate:
    "{{variantExplanation}} Free {{title}} — “{{focusKeyword}}” ({{year}}).",
  longTailModifiers: [
    modifier(
      "round-trip",
      "car commute cost per workday round trip calculator",
      "Enter the full round-trip distance (to work and back). One-way miles alone understate daily fuel burn.",
      {
        benefit: "True round-trip daily cost",
        faqs: [
          {
            question:
              "How do I calculate car commute cost per workday for a round trip?",
            answer:
              "Use round-trip miles, your MPG, and local gas price. Add optional per-mile wear to approximate total daily driving cost.",
          },
        ],
      }
    ),
  ],
  seoContent: {
    intro:
      "See what one workday of driving really costs in fuel—and optionally wear—before you commit to five days in the office.",
    howToUse: [
      "Enter round-trip commute distance.",
      "Set your vehicle’s MPG and local gas price.",
      "Optionally include a per-mile wear estimate.",
      "Read fuel cost and total workday cost.",
    ],
    faqs: [
      {
        question: "How do I calculate car commute cost per workday?",
        answer:
          "Divide round-trip miles by MPG, multiply by gas price for fuel, then add miles × wear rate if you want a fuller cost.",
      },
    ],
  },
};

/** ——— 3. Airbnb Cleaning Cost (Short-term Rental & Housing) ——— */
const airbnbCleaningCost: Calculator = {
  slug: "airbnb-cleaning-cost-calculator",
  title: "Airbnb Cleaning Cost Calculator",
  category: "Short-term Rental & Housing",
  description:
    "Estimate cleaning fees per turnover from labor hours, hourly rate, supplies, and laundry.",
  formulaType: "airbnbCleaningCost",
  useCategoryPath: true,
  ready: true,
  inputs: [
    input("cleanHours", "Cleaning Hours", 3, 0.5, 12, 0.25),
    input("cleanerRate", "Cleaner Hourly Rate ($)", 35, 10, 100, 1),
    input("supplies", "Supplies / Turnover ($)", 12, 0, 100, 1),
    input("laundry", "Laundry / Linen ($)", 18, 0, 150, 1),
  ],
  formulaSummary:
    "Cleaning cost = (hours × rate) + supplies + laundry.",
  realWorldExample:
    "3 hours at $35/hr ($105) + $12 supplies + $18 laundry = $135 per turnover.",
  seoContextTemplate:
    "{{title}} for “{{focusKeyword}}”: {{formulaSummary}} Example: {{example}} Updated {{year}}.",
  explanationTemplate:
    "{{variantExplanation}} Free {{title}} targeting “{{focusKeyword}}” ({{year}}).",
  longTailModifiers: [
    modifier(
      "per-turnover",
      "Airbnb cleaning cost per turnover calculator",
      "Model each guest turnover separately so your cleaning fee covers labor, supplies, and linen—not just the cleaner’s hourly quote.",
      {
        benefit: "Price each turnover fairly",
        faqs: [
          {
            question:
              "How do I calculate Airbnb cleaning cost per turnover in {{year}}?",
            answer:
              "Multiply cleaning hours by the cleaner rate, then add supplies and laundry. Compare the total to the cleaning fee you charge guests.",
          },
        ],
      }
    ),
  ],
  seoContent: {
    intro:
      "Cleaning fees only work if they cover real turnover costs. Break down labor, supplies, and laundry before you set the guest fee.",
    howToUse: [
      "Enter hours and cleaner hourly rate.",
      "Add supplies and laundry per turnover.",
      "Compare total cost to your listed cleaning fee.",
    ],
    faqs: [
      {
        question: "How do I calculate Airbnb cleaning costs?",
        answer:
          "Sum labor (hours × rate), consumable supplies, and laundry/linen for each turnover. That total is your break-even cleaning fee floor.",
      },
    ],
  },
};

/** ——— 4. Grocery Cost Per Meal (Food & Meal Planning) ——— */
const groceryCostPerMeal: Calculator = {
  slug: "grocery-cost-per-meal-calculator",
  title: "Grocery Cost Per Meal Calculator",
  category: "Food & Meal Planning",
  description:
    "Divide a grocery trip (or weekly food budget) by the number of meals it covers to get cost per meal.",
  formulaType: "groceryCostPerMeal",
  useCategoryPath: true,
  ready: true,
  inputs: [
    input("groceryTotal", "Grocery Spend ($)", 120, 5, 1000, 1),
    input("mealsCovered", "Meals Covered", 21, 1, 100, 1),
    input("people", "People Eating", 2, 1, 12, 1),
  ],
  formulaSummary:
    "Cost per meal = grocery spend ÷ meals covered; cost per person-meal = grocery ÷ (meals × people) when sharing.",
  realWorldExample:
    "$120 covering 21 meals for 2 people → $5.71 per meal batch, or about $2.86 per person-meal.",
  seoContextTemplate:
    "Searching for “{{focusKeyword}}”? {{formulaSummary}} Example: {{example}} Free {{title}} for {{year}}.",
  explanationTemplate:
    "{{variantExplanation}} {{title}} — “{{focusKeyword}}” ({{year}}).",
  longTailModifiers: [
    modifier(
      "weekly-budget",
      "weekly grocery cost per meal calculator",
      "Use your weekly grocery total and count breakfast/lunch/dinner servings the haul actually covers—not aspirational meal counts.",
      {
        benefit: "Weekly meal cost clarity",
        faqs: [
          {
            question:
              "How do I calculate weekly grocery cost per meal?",
            answer:
              "Divide the week’s grocery spend by meals prepared from that haul. Optionally divide again by household size for per-person cost.",
          },
        ],
      }
    ),
  ],
  seoContent: {
    intro:
      "Know whether meal prep is actually cheaper than takeout by measuring true grocery cost per meal.",
    howToUse: [
      "Enter what you spent on groceries.",
      "Count meals that spend will cover.",
      "Set how many people share each meal.",
      "Read cost per meal and per person-meal.",
    ],
    faqs: [
      {
        question: "How do I calculate grocery cost per meal?",
        answer:
          "Divide grocery spend by meals covered. For shared meals, divide by people as well to get cost per person-meal.",
      },
    ],
  },
};

/** ——— 5. EV Winter Charging Cost (Commute & Vehicle Costs) ——— */
const evWinterChargingCost: Calculator = {
  slug: "ev-winter-charging-cost-calculator",
  title: "EV Winter Charging Cost Calculator",
  category: "Commute & Vehicle Costs",
  description:
    "Estimate winter EV charging cost with a cold-weather efficiency penalty on kWh used.",
  formulaType: "evWinterChargingCost",
  useCategoryPath: true,
  ready: true,
  inputs: [
    input("kwhNeeded", "Energy Needed (kWh)", 40, 1, 120, 1),
    input("ratePerKwh", "Electricity Rate ($/kWh)", 0.14, 0.05, 0.8, 0.01),
    input("winterPenaltyPct", "Winter Efficiency Loss (%)", 25, 0, 60, 1),
  ],
  formulaSummary:
    "Winter kWh ≈ needed × (1 + penalty%/100); cost = winter kWh × $/kWh.",
  realWorldExample:
    "40 kWh needed with 25% winter loss → 50 kWh drawn. At $0.14/kWh that charge costs $7.00.",
  seoContextTemplate:
    "{{title}} for “{{focusKeyword}}”. {{formulaSummary}} Example: {{example}} Figures for {{year}} planning.",
  explanationTemplate:
    "{{variantExplanation}} Free {{title}} — “{{focusKeyword}}” ({{year}}).",
  longTailModifiers: [
    modifier(
      "cold-weather",
      "EV winter charging cost cold weather calculator",
      "Cold weather increases cabin heat and battery resistance, so the same trip often needs more grid kWh. Use the penalty % to stress-test winter bills.",
      {
        benefit: "Stress-test cold-weather charging",
        faqs: [
          {
            question:
              "How do I calculate EV winter charging costs in {{year}}?",
            answer:
              "Inflate the kWh you normally need by your winter efficiency loss percentage, then multiply by your electricity rate.",
          },
        ],
      }
    ),
  ],
  seoContent: {
    intro:
      "Winter range loss shows up on your power bill. Estimate charging cost with a realistic cold-weather kWh penalty.",
    howToUse: [
      "Enter the kWh a charge normally needs.",
      "Set your home or workplace electricity rate.",
      "Add an estimated winter efficiency loss %.",
      "Read adjusted kWh and charging cost.",
    ],
    faqs: [
      {
        question: "How do I calculate EV winter charging costs?",
        answer:
          "Increase required kWh by your winter penalty percentage, then multiply by $/kWh. Actual loss varies by temperature, speed, and cabin heat use.",
      },
    ],
  },
};


export const LONGTAIL_HUB_TOOLS: Calculator[] = [
  warehouseOvertimePay,
  carCommutePerWorkday,
  airbnbCleaningCost,
  groceryCostPerMeal,
  evWinterChargingCost,
];

export const LONGTAIL_HUB_READY_TOOLS = LONGTAIL_HUB_TOOLS.filter(
  (tool) => tool.ready !== false
);

export const LONGTAIL_HUB_SLUGS = new Set(
  LONGTAIL_HUB_READY_TOOLS.map((tool) => tool.slug)
);

export function getLongtailHubToolBySlug(slug: string): Calculator | undefined {
  return LONGTAIL_HUB_TOOLS.find((tool) => tool.slug === slug);
}
