/**
 * Niche hub pack — six ready tools (FBA storage, fridge cost, dog food,
 * WFH electricity, house-cleaning price, coffee cost per cup).
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

/** ——— 1. Amazon FBA Storage Fee by Box Size — E-Commerce, Logistics & Storage ——— */
const amazonFbaStorageByBox: Calculator = {
  slug: "amazon-fba-storage-fee-by-box-size-calculator",
  title: "Amazon FBA Storage Fee Calculator by Box Size",
  category: "E-Commerce, Logistics & Storage",
  description:
    "Estimate monthly FBA-style storage fees from box dimensions, quantity, and a cubic-foot rate.",
  formulaType: "amazonFbaStorageFeeByBox",
  useCategoryPath: true,
  ready: true,
  inputs: [
    input("lengthIn", "Box Length (in)", 18, 1, 60, 0.5),
    input("widthIn", "Box Width (in)", 14, 1, 60, 0.5),
    input("heightIn", "Box Height (in)", 12, 1, 60, 0.5),
    input("boxCount", "Number of Boxes", 10, 1, 500, 1),
    input("ratePerCuFt", "Storage Rate ($/cu ft/mo)", 0.87, 0.1, 5, 0.01),
  ],
  formulaSummary:
    "Cubic feet/box = (L × W × H) ÷ 1728; monthly fee = cu ft × boxes × $/cu ft.",
  realWorldExample:
    "An 18×14×12 in box is ~1.75 cu ft. Ten boxes at $0.87/cu ft ≈ $15.23/month.",
  seoContextTemplate:
    "{{formulaSummary}} Worked numbers: {{example}}",
  explanationTemplate:
    "{{variantExplanation}} Free {{title}} for “{{focusKeyword}}” ({{year}}).",
  longTailModifiers: [
    modifier(
      "monthly-estimate",
      "Amazon FBA storage fee by box size monthly calculator",
      "FBA storage is typically billed on cubic feet occupied. Measure outer carton size, convert to cubic feet, then apply your seasonal $/cu ft rate for a planning estimate—not Amazon’s live invoice.",
      {
        benefit: "Estimate monthly cubic storage",
        faqs: [
          {
            question:
              "How do I calculate Amazon FBA storage fees by box size in {{year}}?",
            answer:
              "Multiply length × width × height (inches), divide by 1728 for cubic feet, multiply by box count and your storage rate per cubic foot per month.",
          },
        ],
      }
    ),
  ],
  seoContent: {
    intro:
      "Storage fees add up with bulky cartons. Convert box size to cubic feet and estimate monthly FBA-style charges before you ship inventory in.",
    howToUse: [
      "Enter outer box length, width, and height in inches.",
      "Set how many identical boxes you store.",
      "Enter your planning rate per cubic foot per month.",
      "Read cubic feet and estimated monthly storage fee.",
    ],
    faqs: [
      {
        question: "How do I calculate Amazon FBA storage fee by box size?",
        answer:
          "Convert each box to cubic feet ((L×W×H)/1728), multiply by quantity and the $/cu ft monthly rate. Confirm live Amazon rate cards for peak vs off-peak months.",
      },
      {
        question: "Is this FBA storage calculator free?",
        answer:
          "Yes. Instant browser results with no sign up. Figures are planning estimates—not Amazon’s official bill.",
      },
    ],
  },
};

/** ——— 2. Refrigerator Cost Per Year — Home Utilities, Appliances & Specialty Amenities ——— */
const refrigeratorCostPerYear: Calculator = {
  slug: "refrigerator-cost-per-year-calculator",
  title: "Refrigerator Cost Per Year Calculator",
  category: "Home Utilities, Appliances & Specialty Amenities",
  description:
    "Estimate annual electricity cost to run a refrigerator from yearly kWh and your utility rate.",
  formulaType: "refrigeratorCostPerYear",
  useCategoryPath: true,
  ready: true,
  inputs: [
    input("kwhPerYear", "Rated kWh / Year", 500, 100, 2000, 10),
    input("ratePerKwh", "Electricity Rate ($/kWh)", 0.14, 0.05, 0.8, 0.01),
  ],
  formulaSummary: "Annual cost = rated kWh/year × $/kWh.",
  realWorldExample:
    "A 500 kWh/year fridge at $0.14/kWh costs about $70 per year (~$5.83/month).",
  seoContextTemplate:
    "{{title}} for “{{focusKeyword}}”: {{formulaSummary}} Example: {{example}} Updated {{year}}.",
  explanationTemplate:
    "{{variantExplanation}} Free {{title}} — “{{focusKeyword}}” ({{year}}).",
  longTailModifiers: [
    modifier(
      "energy-guide",
      "refrigerator cost per year Energy Guide calculator",
      "Use the yellow Energy Guide kWh/year figure on the appliance, then multiply by your local blended electricity rate for a realistic operating cost.",
      {
        benefit: "From Energy Guide to yearly $",
        faqs: [
          {
            question:
              "How do I calculate refrigerator cost per year from the Energy Guide?",
            answer:
              "Read the estimated yearly kWh on the Energy Guide label and multiply by your electricity rate in dollars per kWh.",
          },
        ],
      }
    ),
  ],
  seoContent: {
    intro:
      "Fridge power is a quiet line item on every bill. Turn the Energy Guide kWh into a yearly dollar cost with your local rate.",
    howToUse: [
      "Enter the refrigerator’s rated kWh per year.",
      "Set your electricity rate ($/kWh).",
      "Read annual and monthly operating cost.",
    ],
    faqs: [
      {
        question: "How do I calculate refrigerator electricity cost per year?",
        answer:
          "Multiply the appliance’s yearly kWh estimate by your utility rate. Actual use varies with ambient temperature and door openings.",
      },
    ],
  },
};

/** ——— 3. Dog Food Cost Per Month — Pet Care & Household Expenses ——— */
const dogFoodCostPerMonth: Calculator = {
  slug: "dog-food-cost-per-month-calculator",
  title: "Dog Food Cost Per Month Calculator",
  category: "Pet Care & Household Expenses",
  description:
    "Estimate monthly dog food spend from bag price, bag size, and daily feeding amount.",
  formulaType: "dogFoodCostPerMonth",
  useCategoryPath: true,
  ready: true,
  inputs: [
    input("bagPrice", "Bag Price ($)", 54, 5, 200, 1),
    input("bagLbs", "Bag Size (lbs)", 30, 1, 100, 0.5),
    input("cupsPerDay", "Cups Fed / Day", 3, 0.25, 12, 0.25),
    input("cupsPerLb", "Cups Per Pound", 4, 2, 8, 0.25),
  ],
  formulaSummary:
    "Cost/lb = bag price ÷ lbs; lbs/day = cups/day ÷ cups/lb; monthly = cost/lb × lbs/day × 30.",
  realWorldExample:
    "A $54 / 30 lb bag is $1.80/lb. Feeding 3 cups/day at 4 cups/lb ≈ 0.75 lb/day → about $40.50/month.",
  seoContextTemplate:
    "{{formulaSummary}} Worked numbers: {{example}}",
  explanationTemplate:
    "{{variantExplanation}} {{title}} — “{{focusKeyword}}” ({{year}}).",
  longTailModifiers: [
    modifier(
      "dry-food",
      "dog food cost per month dry kibble calculator",
      "Dry kibble budgets are easiest when you convert cups to pounds using the bag’s feeding guide density, then annualize a 30-day month.",
      {
        benefit: "Monthly kibble budget",
        faqs: [
          {
            question:
              "How do I calculate dog food cost per month for dry kibble?",
            answer:
              "Find cost per pound from the bag, convert daily cups to pounds, then multiply by 30 days.",
          },
        ],
      }
    ),
  ],
  seoContent: {
    intro:
      "Food is usually the largest recurring pet cost. Turn bag price and daily cups into a clear monthly budget.",
    howToUse: [
      "Enter bag price and weight in pounds.",
      "Set cups fed per day and cups per pound of food.",
      "Read cost per pound and monthly food spend.",
    ],
    faqs: [
      {
        question: "How do I calculate dog food cost per month?",
        answer:
          "Divide bag price by pounds for $/lb, convert daily cups to pounds, then multiply by about 30 days.",
      },
    ],
  },
};

/** ——— 4. Work From Home Electricity Cost — Remote Work & Home Office ——— */
const wfhElectricityCost: Calculator = {
  slug: "work-from-home-electricity-cost-calculator",
  title: "Work From Home Electricity Cost Calculator",
  category: "Remote Work & Home Office",
  description:
    "Estimate electricity cost for a remote workday from device wattage, hours, and utility rate.",
  formulaType: "wfhElectricityCost",
  useCategoryPath: true,
  ready: true,
  inputs: [
    input("deviceWatts", "Device Load (W)", 120, 10, 1000, 5),
    input("hoursPerDay", "Hours Powered / Day", 8, 1, 16, 0.5),
    input("workdaysPerMonth", "Workdays / Month", 20, 1, 31, 1),
    input("ratePerKwh", "Electricity Rate ($/kWh)", 0.14, 0.05, 0.8, 0.01),
  ],
  formulaSummary:
    "kWh/day = (watts × hours) ÷ 1000; monthly cost = kWh/day × workdays × $/kWh.",
  realWorldExample:
    "120 W for 8 hours = 0.96 kWh/day. Twenty days at $0.14/kWh ≈ $2.69/month for that load.",
  seoContextTemplate:
    "{{title}} for “{{focusKeyword}}”: {{formulaSummary}} Example: {{example}} Planning figures for {{year}}.",
  explanationTemplate:
    "{{variantExplanation}} Free {{title}} — “{{focusKeyword}}” ({{year}}).",
  longTailModifiers: [
    modifier(
      "laptop-monitor",
      "work from home electricity cost laptop and monitor calculator",
      "Add laptop + monitor wattage (or measure with a kill-a-watt) so your WFH electricity estimate matches the gear you actually leave on.",
      {
        benefit: "Desk gear electricity budget",
        faqs: [
          {
            question:
              "How do I calculate work from home electricity cost for a laptop and monitor?",
            answer:
              "Sum device watts, multiply by hours powered, convert to kWh, then multiply by your rate and workdays per month.",
          },
        ],
      }
    ),
  ],
  seoContent: {
    intro:
      "Remote work adds a small but real power bill. Estimate the electricity cost of your home-office load per day and month.",
    howToUse: [
      "Enter combined wattage of devices left on while working.",
      "Set hours powered per workday and workdays per month.",
      "Enter your electricity rate.",
      "Read daily kWh and monthly cost.",
    ],
    faqs: [
      {
        question: "How do I calculate work from home electricity cost?",
        answer:
          "kWh = watts × hours ÷ 1000. Multiply by your $/kWh rate and the number of workdays you want to cover.",
      },
    ],
  },
};

/** ——— 5. House Cleaning Job Price — Local Services & Trade Pricing ——— */
const houseCleaningJobPrice: Calculator = {
  slug: "house-cleaning-job-price-calculator",
  title: "House Cleaning Job Price Calculator",
  category: "Local Services & Trade Pricing",
  description:
    "Price a house cleaning job from hours, hourly rate, supplies, travel, and target margin.",
  formulaType: "houseCleaningJobPrice",
  useCategoryPath: true,
  ready: true,
  inputs: [
    input("hours", "Job Hours", 3, 0.5, 12, 0.25),
    input("hourlyRate", "Labor Rate ($/hr)", 45, 15, 150, 1),
    input("supplies", "Supplies ($)", 12, 0, 100, 1),
    input("travel", "Travel / Parking ($)", 8, 0, 80, 1),
    input("marginPercent", "Target Margin (%)", 25, 0, 80, 1),
  ],
  formulaSummary:
    "Cost = labor + supplies + travel; price = cost ÷ (1 − margin%/100).",
  realWorldExample:
    "3 hrs × $45 ($135) + $12 supplies + $8 travel = $155 cost. At 25% margin, quote ≈ $206.67.",
  seoContextTemplate:
    "{{formulaSummary}} Worked numbers: {{example}}",
  explanationTemplate:
    "{{variantExplanation}} {{title}} — “{{focusKeyword}}” ({{year}}).",
  longTailModifiers: [
    modifier(
      "per-visit",
      "house cleaning job price calculator per visit",
      "Build each visit quote from labor hours plus consumables and travel so recurring cleans stay profitable after gas and supplies.",
      {
        benefit: "Profitable per-visit quotes",
        faqs: [
          {
            question:
              "How do I calculate house cleaning job price per visit in {{year}}?",
            answer:
              "Add labor, supplies, and travel for the visit, then mark up by your target margin to get the client price.",
          },
        ],
      }
    ),
  ],
  seoContent: {
    intro:
      "Underpricing cleans burns time and gas. Build a visit price from labor, supplies, travel, and the margin you actually need.",
    howToUse: [
      "Enter estimated hours and your labor rate.",
      "Add supplies and travel costs.",
      "Set a target profit margin percentage.",
      "Read job cost and recommended quote.",
    ],
    faqs: [
      {
        question: "How do I calculate a house cleaning job price?",
        answer:
          "Sum labor, supplies, and travel for total cost, then divide by (1 − margin%) to set a price that hits your target margin.",
      },
    ],
  },
};

/** ——— 6. Coffee Shop Cost Per Cup — Events, Hospitality & Micro-Business ——— */
const coffeeShopCostPerCup: Calculator = {
  slug: "coffee-shop-cost-per-cup-calculator",
  title: "Coffee Shop Cost Per Cup Calculator",
  category: "Events, Hospitality & Micro-Business",
  description:
    "Estimate beverage cost per cup from beans, milk, cup, and lid costs.",
  formulaType: "coffeeShopCostPerCup",
  useCategoryPath: true,
  ready: true,
  inputs: [
    input("beanCostPerCup", "Beans / Shot Cost ($)", 0.35, 0.05, 2, 0.01),
    input("milkCost", "Milk / Alt-Milk ($)", 0.4, 0, 2, 0.01),
    input("cupLid", "Cup + Lid ($)", 0.18, 0, 1, 0.01),
    input("other", "Syrup / Other ($)", 0.1, 0, 1, 0.01),
  ],
  formulaSummary:
    "Cost/cup = beans + milk + cup/lid + other add-ins.",
  realWorldExample:
    "$0.35 beans + $0.40 milk + $0.18 cup/lid + $0.10 syrup = $1.03 food cost per cup.",
  seoContextTemplate:
    "{{title}} for “{{focusKeyword}}”: {{formulaSummary}} Example: {{example}} Updated {{year}}.",
  explanationTemplate:
    "{{variantExplanation}} Free {{title}} — “{{focusKeyword}}” ({{year}}).",
  longTailModifiers: [
    modifier(
      "latte",
      "coffee shop latte cost per cup calculator",
      "Lattes carry more milk cost than drip. Separate bean/shot cost from milk and cupware so menu prices protect food-cost targets.",
      {
        benefit: "True latte food cost",
        faqs: [
          {
            question:
              "How do I calculate coffee shop latte cost per cup?",
            answer:
              "Add the shot/bean cost, milk or alt-milk, cup and lid, and any syrups. That sum is your beverage food cost before labor and overhead.",
          },
        ],
      }
    ),
  ],
  seoContent: {
    intro:
      "Menu prices only work if you know cup-level food cost. Break down beans, milk, and packaging for each drink.",
    howToUse: [
      "Enter bean or espresso-shot cost allocated per cup.",
      "Add milk, cup/lid, and syrup costs.",
      "Read total cost per cup instantly.",
    ],
    faqs: [
      {
        question: "How do I calculate coffee shop cost per cup?",
        answer:
          "Sum ingredient and disposable packaging costs for one serving. Divide by your target food-cost % separately when setting the menu price.",
      },
    ],
  },
};

export const NICHE65_TOOLS: Calculator[] = [
  amazonFbaStorageByBox,
  refrigeratorCostPerYear,
  dogFoodCostPerMonth,
  wfhElectricityCost,
  houseCleaningJobPrice,
  coffeeShopCostPerCup,
];

export const NICHE65_READY_TOOLS = NICHE65_TOOLS.filter(
  (tool) => tool.ready !== false
);

export const NICHE65_SLUGS = new Set(NICHE65_READY_TOOLS.map((t) => t.slug));

export const NICHE65_CATEGORIES = [
  "E-Commerce, Logistics & Storage",
  "Home Utilities, Appliances & Specialty Amenities",
  "Pet Care & Household Expenses",
  "Remote Work & Home Office",
  "Local Services & Trade Pricing",
  "Events, Hospitality & Micro-Business",
] as const;

export function getNiche65ToolBySlug(slug: string): Calculator | undefined {
  return NICHE65_TOOLS.find((tool) => tool.slug === slug);
}
