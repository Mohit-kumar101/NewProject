/**
 * Intent-80 pSEO hub pack (80 tools across 6 categories).
 *
 * READY (12): first tool per category + six high-intent clones
 *   laundry, dryer, idling, drive-thru, shift differential, 12h shift,
 *   roommate split, master bedroom, freelance fees, meal prep cost,
 *   meal sell price, recipe cost per serving
 *
 * TODO: remaining stubs — expand configs + formulas.ts handlers, then ready: true
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

function stub80(partial: {
  slug: string;
  title: string;
  category: string;
  description: string;
  formulaType: string;
  focusHint: string;
}): Calculator {
  return {
    slug: partial.slug,
    title: partial.title,
    category: partial.category,
    description: partial.description,
    formulaType: partial.formulaType,
    useCategoryPath: true,
    ready: false,
    inputs: [input("placeholder", "Value (TODO)", 100, 0, 1_000_000, 1)],
    seoContextTemplate: `{{title}} targets “{{focusKeyword}}” ({{year}}). {{formulaSummary}} {{example}} TODO: implement “${partial.formulaType}” in src/lib/formulas.ts and set ready: true.`,
    formulaSummary: "Formula wiring is TODO.",
    realWorldExample: "Add a worked example when this tool ships.",
    explanationTemplate: `{{variantExplanation}} {{title}} — “{{focusKeyword}}” (${SEO_CONTENT_YEAR}).`,
    longTailModifiers: [
      modifier("overview", partial.focusHint, partial.description, {
        benefit: "Instant estimate",
        route: false,
      }),
    ],
    seoContent: {
      intro: `${partial.description} (Intent-80 schema stub — engine TODO.)`,
      howToUse: [
        "Implement the formula handler, then set ready: true.",
        "Enter the labeled inputs.",
        "Read the live result and long-tail FAQ.",
      ],
      faqs: [
        {
          question: `How do I use the ${partial.title}?`,
          answer:
            "This calculator is scaffolded in the Intent-80 hub pack. The formula is marked TODO until implemented.",
        },
      ],
    },
  };
}

/** ——— 1. Laundry Cost Per Load — Home & Appliance Utilities ——— */
const laundryCostPerLoad: Calculator = {
  slug: "laundry-cost-per-load-calculator",
  title: "Laundry Cost Per Load Calculator",
  category: "Home & Appliance Utilities",
  description:
    "Estimate the electricity and water cost of a single washer load from kWh, rates, and water use.",
  formulaType: "laundryCostPerLoad",
  useCategoryPath: true,
  ready: true,
  inputs: [
    input("kwhPerLoad", "Washer Energy (kWh/load)", 0.5, 0.05, 5, 0.05),
    input("ratePerKwh", "Electricity Rate ($/kWh)", 0.14, 0.05, 0.8, 0.01),
    input("gallonsWater", "Water Used (gal/load)", 15, 0, 50, 1),
    input("waterRatePerGal", "Water + Sewer ($/gal)", 0.01, 0, 0.1, 0.001),
    input("detergentCost", "Detergent / Softener ($)", 0.35, 0, 5, 0.05),
  ],
  formulaSummary:
    "Cost/load = (kWh × $/kWh) + (gallons × water rate) + detergent.",
  realWorldExample:
    "0.5 kWh at $0.14 ($0.07) + 15 gal at $0.01 ($0.15) + $0.35 detergent ≈ $0.57 per load.",
  seoContextTemplate:
    "Looking for “{{focusKeyword}}”? {{formulaSummary}} Example: {{example}} Free {{title}} for {{year}}—instant, no sign up.",
  explanationTemplate:
    "{{variantExplanation}} Free {{title}} for “{{focusKeyword}}” ({{year}}).",
  longTailModifiers: [
    modifier(
      "electric-washer",
      "laundry cost per load electric washer calculator",
      "Electric washers usually draw a fraction of a kWh per cycle. Pair your utility rate with detergent cost to see whether cold washes and full loads are worth the habit change.",
      {
        benefit: "Price each washer cycle",
        faqs: [
          {
            question:
              "How do I calculate laundry cost per load on an electric washer in {{year}}?",
            answer:
              "Multiply kWh per load by your electricity rate, add water/sewer for gallons used, then add detergent. That sum is your all-in cost per load.",
          },
        ],
      }
    ),
  ],
  seoContent: {
    intro:
      "Know what each laundry load really costs in power, water, and detergent—before you run half-empty cycles.",
    howToUse: [
      "Enter washer kWh per load from the Energy Guide or a meter.",
      "Set your electricity and water/sewer rates.",
      "Add detergent cost per load.",
      "Read the total cost per load instantly.",
    ],
    faqs: [
      {
        question: "How do I calculate laundry cost per load?",
        answer:
          "Add electricity (kWh × rate), water (gallons × rate), and detergent. Dryer heat is separate—use a dryer cost tool for that leg.",
      },
      {
        question: "Is this laundry cost calculator free?",
        answer:
          "Yes. Instant browser results with no sign up. Figures are planning estimates.",
      },
    ],
  },
};

/** ——— 2. Idling Fuel Cost — Commute & Vehicle Costs ——— */
const idlingFuelCost: Calculator = {
  slug: "idling-fuel-cost-calculator",
  title: "Idling Fuel Cost Calculator",
  category: "Commute & Vehicle Costs",
  description:
    "Estimate fuel burned (and cost) while a vehicle idles from minutes, GPH, and gas price.",
  formulaType: "idlingFuelCost",
  useCategoryPath: true,
  ready: true,
  inputs: [
    input("idleMinutes", "Idle Time (minutes)", 15, 1, 180, 1),
    input("gallonsPerHour", "Idle Fuel Use (gal/hr)", 0.4, 0.1, 2, 0.05),
    input("gasPrice", "Gas Price ($/gal)", 3.89, 1, 10, 0.01),
  ],
  formulaSummary:
    "Gallons = (minutes ÷ 60) × gal/hr; cost = gallons × gas price.",
  realWorldExample:
    "15 minutes at 0.4 gal/hr uses 0.1 gal. At $3.89/gal that idle costs about $0.39.",
  seoContextTemplate:
    "{{title}} for “{{focusKeyword}}”: {{formulaSummary}} Example: {{example}} Updated {{year}}.",
  explanationTemplate:
    "{{variantExplanation}} Free {{title}} — “{{focusKeyword}}” ({{year}}).",
  longTailModifiers: [
    modifier(
      "per-day",
      "idling fuel cost calculator per day",
      "Sum typical idle minutes across morning warm-ups, school pickup, and drive-thrus to see a realistic daily fuel leak.",
      {
        benefit: "Daily idle fuel waste",
        faqs: [
          {
            question:
              "How do I calculate idling fuel cost per day in {{year}}?",
            answer:
              "Estimate total idle minutes per day, convert to hours, multiply by idle gallons per hour, then by gas price.",
          },
        ],
      }
    ),
  ],
  seoContent: {
    intro:
      "Idling feels free until you price the gallons. Estimate what waiting in line or warming up actually costs.",
    howToUse: [
      "Enter how many minutes you idle.",
      "Set idle fuel use in gallons per hour (engine-size dependent).",
      "Enter local gas price.",
      "Read gallons burned and dollar cost.",
    ],
    faqs: [
      {
        question: "How do I calculate idling fuel cost?",
        answer:
          "Convert idle minutes to hours, multiply by gallons burned per idle hour, then multiply by the price per gallon.",
      },
    ],
  },
};

/** ——— 3. Shift Differential Pay — Payroll & Shift Work ——— */
const shiftDifferentialPay: Calculator = {
  slug: "shift-differential-pay-calculator",
  title: "Shift Differential Pay Calculator",
  category: "Payroll & Shift Work",
  description:
    "Estimate shift premium pay from base hourly rate and a differential percentage or flat add-on.",
  formulaType: "shiftDifferentialPay",
  useCategoryPath: true,
  ready: true,
  inputs: [
    input("baseRate", "Base Hourly Rate ($)", 24, 10, 100, 0.25),
    input("diffPercent", "Differential (%)", 10, 0, 50, 0.5),
    input("flatAddOn", "Flat Add-On ($/hr)", 0, 0, 20, 0.25),
    input("hours", "Shift Hours", 8, 0.5, 16, 0.5),
  ],
  formulaSummary:
    "Premium rate = base × (1 + diff%/100) + flat add-on; shift pay = premium rate × hours.",
  realWorldExample:
    "$24/hr with 10% differential → $26.40/hr. An 8-hour shift pays $211.20 (before taxes).",
  seoContextTemplate:
    "Searching “{{focusKeyword}}”? {{formulaSummary}} Example: {{example}} Free {{title}} for {{year}}.",
  explanationTemplate:
    "{{variantExplanation}} {{title}} — “{{focusKeyword}}” ({{year}}).",
  longTailModifiers: [
    modifier(
      "night-shift",
      "night shift differential pay calculator",
      "Night differentials are often a percent of base or a flat $/hr. Enter either (or both) to mirror your contract language.",
      {
        benefit: "Price night premiums",
        faqs: [
          {
            question:
              "How do I calculate night shift differential pay in {{year}}?",
            answer:
              "Apply the differential % to base rate, add any flat $/hr premium, then multiply by hours worked on the night shift.",
          },
        ],
      }
    ),
  ],
  seoContent: {
    intro:
      "Shift differentials change your effective hourly rate. Model percent and flat premiums before you pick nights or weekends.",
    howToUse: [
      "Enter your base hourly rate.",
      "Set the differential percentage and/or flat add-on.",
      "Enter hours on the premium shift.",
      "Read premium rate and total shift pay.",
    ],
    faqs: [
      {
        question: "How do I calculate shift differential pay?",
        answer:
          "Effective rate = base × (1 + differential%) + flat add-on. Multiply by hours for gross shift pay. Confirm whether OT stacks on the premium rate.",
      },
    ],
  },
};

/** ——— 4. Roommate Rent Split by Room Size — Rent & Roommate Splits ——— */
const roommateRentByRoomSize: Calculator = {
  slug: "roommate-rent-split-by-room-size-calculator",
  title: "Roommate Rent Split by Room Size Calculator",
  category: "Rent & Roommate Splits",
  description:
    "Split monthly rent proportionally by bedroom square footage for a fairer roommate share.",
  formulaType: "roommateRentSplitByRoomSize",
  useCategoryPath: true,
  ready: true,
  inputs: [
    input("totalRent", "Total Monthly Rent ($)", 2400, 500, 10000, 50),
    input("roomSqFt", "Your Bedroom (sq ft)", 140, 50, 600, 5),
    input("totalBedroomSqFt", "All Bedrooms Combined (sq ft)", 350, 100, 2000, 10),
  ],
  formulaSummary:
    "Your share = total rent × (your bedroom sq ft ÷ total bedroom sq ft).",
  realWorldExample:
    "$2,400 rent with a 140 sq ft room of 350 sq ft bedrooms → 40% share → $960/month.",
  seoContextTemplate:
    "{{title}} for “{{focusKeyword}}”. {{formulaSummary}} Example: {{example}} Updated {{year}}.",
  explanationTemplate:
    "{{variantExplanation}} Free {{title}} — “{{focusKeyword}}” ({{year}}).",
  longTailModifiers: [
    modifier(
      "fair-share",
      "fair roommate rent split by room size calculator",
      "Pro-rating by bedroom area ignores living-room equality but is a common starting point when one roommate gets a much larger room.",
      {
        benefit: "Fair sq-ft based split",
        faqs: [
          {
            question:
              "How do I calculate a fair roommate rent split by room size?",
            answer:
              "Divide your bedroom square footage by the sum of all private bedroom areas, then multiply by total rent. Discuss common-area value separately if needed.",
          },
        ],
      }
    ),
  ],
  seoContent: {
    intro:
      "When rooms differ in size, an even split feels unfair. Allocate rent by bedroom square footage for a transparent starting point.",
    howToUse: [
      "Enter total monthly rent.",
      "Enter your bedroom square footage.",
      "Enter the combined square footage of all private bedrooms.",
      "Read your share amount and percent.",
    ],
    faqs: [
      {
        question: "How do I split rent by room size?",
        answer:
          "Your rent share equals total rent times your bedroom’s fraction of total private bedroom area.",
      },
    ],
  },
};

/** ——— 5. Freelance Rate After Platform Fees — Freelance & Micro-Business ——— */
const freelanceRateAfterFees: Calculator = {
  slug: "freelance-rate-after-platform-fees-calculator",
  title: "Freelance Rate After Platform Fees Calculator",
  category: "Freelance & Micro-Business",
  description:
    "See your effective hourly rate after marketplace or platform percentage fees.",
  formulaType: "freelanceRateAfterPlatformFees",
  useCategoryPath: true,
  ready: true,
  inputs: [
    input("grossRate", "Gross Hourly Rate ($)", 75, 10, 500, 1),
    input("feePercent", "Platform Fee (%)", 20, 0, 50, 0.5),
    input("hours", "Hours on Project", 10, 1, 200, 0.5),
  ],
  formulaSummary:
    "Net rate = gross × (1 − fee%/100); net project = net rate × hours.",
  realWorldExample:
    "$75/hr with 20% platform fee → $60 net/hr. A 10-hour job nets $600 after fees.",
  seoContextTemplate:
    "Need “{{focusKeyword}}”? {{formulaSummary}} Example: {{example}} Free {{title}} ({{year}}).",
  explanationTemplate:
    "{{variantExplanation}} {{title}} — “{{focusKeyword}}” ({{year}}).",
  longTailModifiers: [
    modifier(
      "upwork",
      "freelance rate after Upwork fees calculator",
      "Marketplace sliding fees change your true hourly. Enter the fee % that applies to this contract tier so quotes still hit your take-home target.",
      {
        benefit: "Net rate after marketplace cut",
        faqs: [
          {
            question:
              "How do I calculate freelance rate after platform fees in {{year}}?",
            answer:
              "Multiply your billed hourly rate by (1 − fee%). Use that net rate when comparing platforms or setting client-facing prices.",
          },
        ],
      }
    ),
  ],
  seoContent: {
    intro:
      "Platform fees shrink your real hourly. Convert gross quotes into net rates before you accept marketplace work.",
    howToUse: [
      "Enter the hourly rate you bill the client.",
      "Set the platform fee percentage.",
      "Optionally enter project hours for net project total.",
      "Read net hourly and net project proceeds.",
    ],
    faqs: [
      {
        question: "How do I calculate freelance rate after platform fees?",
        answer:
          "Net hourly = gross hourly × (1 − fee%). Multiply by hours for net project income before taxes.",
      },
    ],
  },
};

/** ——— 6. Meal Prep Cost Per Meal — Food & Catering Business ——— */
const mealPrepCostPerMeal: Calculator = {
  slug: "meal-prep-cost-per-meal-calculator",
  title: "Meal Prep Cost Per Meal Calculator",
  category: "Food & Catering Business",
  description:
    "Divide grocery and packaging costs by the number of meal-prep portions to get cost per meal.",
  formulaType: "mealPrepCostPerMeal",
  useCategoryPath: true,
  ready: true,
  inputs: [
    input("groceryCost", "Grocery / Ingredient Cost ($)", 60, 5, 500, 1),
    input("packagingCost", "Packaging / Containers ($)", 8, 0, 100, 0.5),
    input("meals", "Meals Prepared", 12, 1, 100, 1),
  ],
  formulaSummary:
    "Cost per meal = (grocery + packaging) ÷ meals prepared.",
  realWorldExample:
    "$60 groceries + $8 packaging for 12 meals → $5.67 cost per meal.",
  seoContextTemplate:
    "{{title}} for “{{focusKeyword}}”: {{formulaSummary}} Example: {{example}} Planning tool for {{year}}.",
  explanationTemplate:
    "{{variantExplanation}} Free {{title}} — “{{focusKeyword}}” ({{year}}).",
  longTailModifiers: [
    modifier(
      "weekly-batch",
      "weekly meal prep cost per meal calculator",
      "Batch-cook once, portion into containers, and include packaging so your per-meal cost matches what you actually spend each week.",
      {
        benefit: "Weekly batch meal cost",
        faqs: [
          {
            question:
              "How do I calculate weekly meal prep cost per meal?",
            answer:
              "Add ingredient and packaging spend for the batch, then divide by the number of portions you packed.",
          },
        ],
      }
    ),
  ],
  seoContent: {
    intro:
      "Meal prep only saves money if you know true cost per portion—including containers.",
    howToUse: [
      "Enter ingredient cost for the batch.",
      "Add packaging or container cost.",
      "Enter how many meals you portioned.",
      "Read cost per meal instantly.",
    ],
    faqs: [
      {
        question: "How do I calculate meal prep cost per meal?",
        answer:
          "Sum groceries and packaging, then divide by meals prepared. Add labor separately if you sell meal prep.",
      },
    ],
  },
};


/** ——— 7. Dryer Cost Per Load — Home & Appliance Utilities ——— */
const dryerCostPerLoad: Calculator = {
  slug: "dryer-cost-per-load-calculator",
  title: "Dryer Cost Per Load Calculator",
  category: "Home & Appliance Utilities",
  description:
    "Estimate electricity cost for a dryer cycle from kWh per load and your utility rate.",
  formulaType: "dryerCostPerLoad",
  useCategoryPath: true,
  ready: true,
  inputs: [
    input("kwhPerLoad", "Dryer Energy (kWh/load)", 2.5, 0.2, 8, 0.1),
    input("ratePerKwh", "Electricity Rate ($/kWh)", 0.14, 0.05, 0.8, 0.01),
    input("loadsPerWeek", "Loads Per Week", 4, 0, 21, 1),
  ],
  formulaSummary:
    "Cost/load = kWh × $/kWh; weekly = cost/load × loads/week.",
  realWorldExample:
    "2.5 kWh at $0.14 ≈ $0.35 per load. Four loads/week ≈ $1.40.",
  seoContextTemplate:
    "Looking for “{{focusKeyword}}”? {{formulaSummary}} Example: {{example}} Free {{title}} for {{year}}.",
  explanationTemplate:
    "{{variantExplanation}} Free {{title}} for “{{focusKeyword}}” ({{year}}).",
  longTailModifiers: [
    modifier(
      "electric-dryer",
      "electric dryer cost per load calculator",
      "Electric dryers draw multiple kWh per cycle. Pair your Energy Guide figure with the local rate to see whether air-drying a few loads is worth it.",
      {
        benefit: "Price each dryer cycle",
        faqs: [
          {
            question:
              "How do I calculate electric dryer cost per load in {{year}}?",
            answer:
              "Multiply kWh per load by your electricity rate. Multiply by weekly loads for a weekly estimate.",
          },
        ],
      }
    ),
  ],
  seoContent: {
    intro:
      "Dryer heat is often the expensive half of laundry. Price each cycle before you run half-empty loads.",
    howToUse: [
      "Enter dryer kWh per load from the Energy Guide or a meter.",
      "Set your electricity rate.",
      "Optionally enter loads per week.",
      "Read cost per load and weekly cost.",
    ],
    faqs: [
      {
        question: "How do I calculate dryer cost per load?",
        answer:
          "Multiply kWh per load by your $/kWh rate. That is your electricity cost for one dryer cycle.",
      },
    ],
  },
};

/** ——— 8. Drive-Thru Idling Cost — Commute & Vehicle Costs ——— */
const driveThruIdlingCost: Calculator = {
  slug: "drive-thru-idling-cost-calculator",
  title: "Drive-Thru Idling Cost Calculator",
  category: "Commute & Vehicle Costs",
  description:
    "Estimate fuel burned waiting in drive-thru lines from minutes, idle GPH, and gas price.",
  formulaType: "driveThruIdlingCost",
  useCategoryPath: true,
  ready: true,
  inputs: [
    input("idleMinutes", "Wait Time (minutes)", 8, 1, 60, 1),
    input("gallonsPerHour", "Idle Fuel Use (gal/hr)", 0.4, 0.1, 2, 0.05),
    input("gasPrice", "Gas Price ($/gal)", 3.89, 1, 10, 0.01),
    input("tripsPerWeek", "Drive-Thrus Per Week", 5, 0, 21, 1),
  ],
  formulaSummary:
    "Gallons = (minutes ÷ 60) × gal/hr; cost = gallons × gas; weekly = cost × trips.",
  realWorldExample:
    "8 minutes at 0.4 gal/hr uses ~0.053 gal. At $3.89 that stop costs about $0.21; five times/week ≈ $1.04.",
  seoContextTemplate:
    "{{title}} for “{{focusKeyword}}”: {{formulaSummary}} Example: {{example}} Updated {{year}}.",
  explanationTemplate:
    "{{variantExplanation}} Free {{title}} — “{{focusKeyword}}” ({{year}}).",
  longTailModifiers: [
    modifier(
      "weekly",
      "drive thru idling cost calculator weekly",
      "Stack typical wait minutes and trips per week to see how often coffee runs quietly burn fuel.",
      {
        benefit: "Weekly drive-thru fuel waste",
        faqs: [
          {
            question:
              "How do I calculate weekly drive-thru idling cost in {{year}}?",
            answer:
              "Estimate minutes per stop, convert to hours, multiply by idle gallons per hour and gas price, then multiply by trips per week.",
          },
        ],
      }
    ),
  ],
  seoContent: {
    intro:
      "Drive-thru waits feel free until you price the idle gallons. Estimate what each line actually costs.",
    howToUse: [
      "Enter typical minutes in line.",
      "Set idle fuel use in gallons per hour.",
      "Enter gas price and trips per week.",
      "Read cost per stop and weekly total.",
    ],
    faqs: [
      {
        question: "How do I calculate drive-thru idling cost?",
        answer:
          "Convert wait minutes to hours, multiply by idle gal/hr, then by gas price. Multiply by weekly trips for a habit cost.",
      },
    ],
  },
};

/** ——— 9. 12-Hour Shift Pay — Payroll & Shift Work ——— */
const twelveHourShiftPay: Calculator = {
  slug: "twelve-hour-shift-pay-calculator",
  title: "12-Hour Shift Pay Calculator",
  category: "Payroll & Shift Work",
  description:
    "Estimate gross pay for a 12-hour shift with optional differential percent or flat add-on.",
  formulaType: "twelveHourShiftPay",
  useCategoryPath: true,
  ready: true,
  inputs: [
    input("baseRate", "Base Hourly Rate ($)", 28, 10, 100, 0.25),
    input("diffPercent", "Differential (%)", 10, 0, 50, 0.5),
    input("flatAddOn", "Flat Add-On ($/hr)", 0, 0, 20, 0.25),
    input("hours", "Shift Hours", 12, 8, 16, 0.5),
  ],
  formulaSummary:
    "Premium rate = base × (1 + diff%/100) + flat; shift pay = premium × hours (default 12).",
  realWorldExample:
    "$28/hr with 10% differential → $30.80/hr. A 12-hour shift pays $369.60 (before taxes).",
  seoContextTemplate:
    "Searching “{{focusKeyword}}”? {{formulaSummary}} Example: {{example}} Free {{title}} for {{year}}.",
  explanationTemplate:
    "{{variantExplanation}} {{title}} — “{{focusKeyword}}” ({{year}}).",
  longTailModifiers: [
    modifier(
      "night",
      "12 hour night shift pay calculator",
      "Long night shifts often stack a differential on base. Enter percent and/or flat add-on to mirror your contract.",
      {
        benefit: "Price a 12-hour night",
        faqs: [
          {
            question: "How do I calculate 12-hour night shift pay in {{year}}?",
            answer:
              "Apply the differential to base rate, add any flat $/hr, then multiply by 12 (or your rostered hours).",
          },
        ],
      }
    ),
  ],
  seoContent: {
    intro:
      "Twelve-hour shifts change your effective rate when differentials apply. Model a full tour before you pick nights.",
    howToUse: [
      "Enter base hourly rate.",
      "Set differential % and/or flat add-on.",
      "Confirm hours (default 12).",
      "Read premium rate and total shift pay.",
    ],
    faqs: [
      {
        question: "How do I calculate 12-hour shift pay?",
        answer:
          "Effective rate = base × (1 + differential%) + flat add-on. Multiply by hours for gross shift pay.",
      },
    ],
  },
};

/** ——— 10. Master Bedroom Fair Rent — Rent & Roommate Splits ——— */
const masterBedroomFairRent: Calculator = {
  slug: "master-bedroom-fair-rent-calculator",
  title: "Master Bedroom Fair Rent Calculator",
  category: "Rent & Roommate Splits",
  description:
    "Split rent by room size, then add a master-bedroom premium for en-suite or larger space.",
  formulaType: "masterBedroomFairRent",
  useCategoryPath: true,
  ready: true,
  inputs: [
    input("totalRent", "Total Monthly Rent ($)", 2400, 500, 10000, 50),
    input("roomSqFt", "Master Bedroom (sq ft)", 180, 50, 600, 5),
    input("totalBedroomSqFt", "All Bedrooms (sq ft)", 400, 100, 2000, 10),
    input("premiumPercent", "Master Premium (%)", 10, 0, 40, 1),
  ],
  formulaSummary:
    "Base share = rent × (master sq ft ÷ total bedroom sq ft); fair rent = base × (1 + premium%).",
  realWorldExample:
    "$2,400 rent, 180/400 sq ft base share $1,080 + 10% premium → $1,188 for the master.",
  seoContextTemplate:
    "Need “{{focusKeyword}}”? {{formulaSummary}} Example: {{example}} Free {{title}} ({{year}}).",
  explanationTemplate:
    "{{variantExplanation}} {{title}} — “{{focusKeyword}}” ({{year}}).",
  longTailModifiers: [
    modifier(
      "ensuite",
      "master bedroom ensuite fair rent calculator",
      "An en-suite bath often justifies a premium on top of size-weighted share. Adjust the premium % until everyone agrees it feels fair.",
      {
        benefit: "Price ensuite premium",
        faqs: [
          {
            question:
              "How do I calculate master bedroom fair rent with ensuite in {{year}}?",
            answer:
              "Split rent by bedroom square footage, then multiply the master share by (1 + premium%) for bath or closet upgrades.",
          },
        ],
      }
    ),
  ],
  seoContent: {
    intro:
      "Masters with baths or walk-ins should pay more — but how much? Size-weight first, then add a clear premium.",
    howToUse: [
      "Enter total rent and bedroom square footages.",
      "Set a master premium percentage.",
      "Read size-based share and premium-adjusted rent.",
      "Adjust premium until roommates agree.",
    ],
    faqs: [
      {
        question: "How do I calculate master bedroom fair rent?",
        answer:
          "Allocate rent by bedroom sq ft, then multiply the master’s share by (1 + premium%) for extras like a private bath.",
      },
    ],
  },
};

/** ——— 11. Meal Prep Selling Price — Food & Catering Business ——— */
const mealPrepSellingPrice: Calculator = {
  slug: "meal-prep-selling-price-calculator",
  title: "Meal Prep Selling Price Calculator",
  category: "Food & Catering Business",
  description:
    "Set a meal prep sell price from batch cost, portions, and target margin.",
  formulaType: "mealPrepSellingPrice",
  useCategoryPath: true,
  ready: true,
  inputs: [
    input("groceryCost", "Ingredient Cost ($)", 60, 5, 500, 1),
    input("packagingCost", "Packaging ($)", 8, 0, 100, 0.5),
    input("meals", "Meals Prepared", 12, 1, 100, 1),
    input("marginPercent", "Target Margin (%)", 40, 0, 80, 1),
  ],
  formulaSummary:
    "Cost/meal = (grocery + packaging) ÷ meals; sell price = cost ÷ (1 − margin%/100).",
  realWorldExample:
    "$68 batch / 12 meals = $5.67 cost. 40% margin → sell at about $9.44.",
  seoContextTemplate:
    "{{title}} for “{{focusKeyword}}”: {{formulaSummary}} Example: {{example}} Planning tool for {{year}}.",
  explanationTemplate:
    "{{variantExplanation}} Free {{title}} — “{{focusKeyword}}” ({{year}}).",
  longTailModifiers: [
    modifier(
      "wholesale",
      "meal prep wholesale selling price calculator",
      "Use a lower margin for wholesale and a higher one for direct-to-customer meal prep boxes.",
      {
        benefit: "Price for margin",
        faqs: [
          {
            question:
              "How do I calculate meal prep selling price with margin in {{year}}?",
            answer:
              "Divide batch cost by portions for cost per meal, then divide by (1 − margin%) to get the sell price that hits your target.",
          },
        ],
      }
    ),
  ],
  seoContent: {
    intro:
      "Cost per meal is only half the story. Back into a sell price that actually leaves margin.",
    howToUse: [
      "Enter ingredient and packaging costs.",
      "Set meals prepared and target margin %.",
      "Read cost per meal and suggested sell price.",
      "Adjust margin for wholesale vs DTC.",
    ],
    faqs: [
      {
        question: "How do I calculate meal prep selling price?",
        answer:
          "Cost per meal = batch cost ÷ portions. Sell price = cost ÷ (1 − margin%). Confirm local food regs and delivery fees separately.",
      },
    ],
  },
};

/** ——— 12. Recipe Cost Per Serving — Food & Catering Business ——— */
const recipeCostPerServing: Calculator = {
  slug: "recipe-cost-per-serving-calculator",
  title: "Recipe Cost Per Serving Calculator",
  category: "Food & Catering Business",
  description:
    "Divide a recipe’s ingredient batch cost by the number of servings for cost per plate.",
  formulaType: "recipeCostPerServing",
  useCategoryPath: true,
  ready: true,
  inputs: [
    input("batchCost", "Ingredient Batch Cost ($)", 24, 1, 500, 0.5),
    input("servings", "Servings Yielded", 6, 1, 100, 1),
    input("wastePercent", "Waste / Trim (%)", 5, 0, 40, 1),
  ],
  formulaSummary:
    "Adjusted cost = batch × (1 + waste%/100); cost/serving = adjusted ÷ servings.",
  realWorldExample:
    "$24 batch with 5% waste → $25.20. Six servings ≈ $4.20 each.",
  seoContextTemplate:
    "Need “{{focusKeyword}}”? {{formulaSummary}} Example: {{example}} Free {{title}} ({{year}}).",
  explanationTemplate:
    "{{variantExplanation}} {{title}} — “{{focusKeyword}}” ({{year}}).",
  longTailModifiers: [
    modifier(
      "restaurant",
      "restaurant recipe cost per serving calculator",
      "Include trim waste so menu pricing reflects what you actually buy, not the plated weight alone.",
      {
        benefit: "Plate cost with waste",
        faqs: [
          {
            question:
              "How do I calculate restaurant recipe cost per serving in {{year}}?",
            answer:
              "Inflate ingredient cost by waste %, then divide by servings yielded from the batch.",
          },
        ],
      }
    ),
  ],
  seoContent: {
    intro:
      "Know the true cost of a plated serving — including trim waste — before you set a menu price.",
    howToUse: [
      "Enter total ingredient cost for the recipe batch.",
      "Set servings yielded.",
      "Add waste/trim percent if needed.",
      "Read cost per serving.",
    ],
    faqs: [
      {
        question: "How do I calculate recipe cost per serving?",
        answer:
          "Multiply batch cost by (1 + waste%), then divide by the number of servings the recipe yields.",
      },
    ],
  },
};

/** Compact stub defs for the remaining tools (TODO: full configs + formulas). */
const STUB_DEFS: Array<{
  slug: string;
  title: string;
  category: string;
  formulaType: string;
  focusHint: string;
  description: string;
}> = [
  // Home & Appliance Utilities (19 remaining)
  ["dishwasher-cost-per-cycle-calculator", "Dishwasher Cost Per Cycle Calculator", "Home & Appliance Utilities", "dishwasherCostPerCycle", "dishwasher cost per cycle calculator", "Estimate dishwasher energy and water cost per cycle."],
  ["hand-washing-vs-dishwasher-cost-calculator", "Hand Washing vs Dishwasher Cost Calculator", "Home & Appliance Utilities", "handWashVsDishwasherCost", "hand washing vs dishwasher cost calculator", "Compare hand-washing water/energy vs dishwasher cycles."],
  ["shower-cost-per-minute-calculator", "Shower Cost Per Minute Calculator", "Home & Appliance Utilities", "showerCostPerMinute", "shower cost per minute calculator", "Estimate water and heat cost per minute of showering."],
  ["bath-vs-shower-cost-calculator", "Bath vs Shower Cost Calculator", "Home & Appliance Utilities", "bathVsShowerCost", "bath vs shower cost calculator", "Compare the utility cost of a bath versus a shower."],
  ["toilet-flush-water-cost-calculator", "Toilet Flush Water Cost Calculator", "Home & Appliance Utilities", "toiletFlushWaterCost", "toilet flush water cost calculator", "Estimate water/sewer cost per flush."],
  ["toilet-leak-cost-calculator", "Toilet Leak Cost Calculator", "Home & Appliance Utilities", "toiletLeakCost", "toilet leak cost calculator", "Estimate monthly cost of a running toilet leak."],
  ["coffee-maker-cost-per-cup-calculator", "Coffee Maker Cost Per Cup Calculator", "Home & Appliance Utilities", "coffeeMakerCostPerCup", "coffee maker cost per cup calculator", "Estimate electricity cost to brew a cup."],
  ["kettle-boiling-cost-calculator", "Kettle Boiling Cost Calculator", "Home & Appliance Utilities", "kettleBoilingCost", "kettle boiling cost calculator", "Estimate electricity cost to boil a kettle."],
  ["microwave-cost-per-use-calculator", "Microwave Cost Per Use Calculator", "Home & Appliance Utilities", "microwaveCostPerUse", "microwave cost per use calculator", "Estimate microwave electricity per use."],
  ["oven-cost-per-hour-calculator", "Oven Cost Per Hour Calculator", "Home & Appliance Utilities", "ovenCostPerHour", "oven cost per hour calculator", "Estimate oven electricity or gas cost per hour."],
  ["air-fryer-cost-per-use-calculator", "Air Fryer Cost Per Use Calculator", "Home & Appliance Utilities", "airFryerCostPerUse", "air fryer cost per use calculator", "Estimate air fryer electricity per cook."],
  ["slow-cooker-cost-per-meal-calculator", "Slow Cooker Cost Per Meal Calculator", "Home & Appliance Utilities", "slowCookerCostPerMeal", "slow cooker cost per meal calculator", "Estimate slow cooker electricity per meal."],
  ["rice-cooker-electricity-cost-calculator", "Rice Cooker Electricity Cost Calculator", "Home & Appliance Utilities", "riceCookerElectricityCost", "rice cooker electricity cost calculator", "Estimate rice cooker electricity per batch."],
  ["space-heater-cost-per-night-calculator", "Space Heater Cost Per Night Calculator", "Home & Appliance Utilities", "spaceHeaterCostPerNight", "space heater cost per night calculator", "Estimate space heater cost overnight."],
  ["fan-cost-per-night-calculator", "Fan Cost Per Night Calculator", "Home & Appliance Utilities", "fanCostPerNight", "fan cost per night calculator", "Estimate fan electricity overnight."],
  ["humidifier-cost-per-month-calculator", "Humidifier Cost Per Month Calculator", "Home & Appliance Utilities", "humidifierCostPerMonth", "humidifier cost per month calculator", "Estimate humidifier electricity and water monthly."],
  ["dehumidifier-cost-per-month-calculator", "Dehumidifier Cost Per Month Calculator", "Home & Appliance Utilities", "dehumidifierCostPerMonth", "dehumidifier cost per month calculator", "Estimate dehumidifier electricity monthly."],
  ["christmas-lights-electricity-cost-calculator", "Christmas Lights Electricity Cost Calculator", "Home & Appliance Utilities", "christmasLightsElectricityCost", "christmas lights electricity cost calculator", "Estimate seasonal lighting electricity cost."],

  // Commute & Vehicle Costs (14 remaining; idling ready)
  ["remote-start-fuel-cost-calculator", "Remote Start Fuel Cost Calculator", "Commute & Vehicle Costs", "remoteStartFuelCost", "remote start fuel cost calculator", "Estimate fuel used during remote start warm-ups."],
  ["winter-warm-up-fuel-cost-calculator", "Winter Warm-Up Fuel Cost Calculator", "Commute & Vehicle Costs", "winterWarmUpFuelCost", "winter warm up fuel cost calculator", "Estimate winter warm-up idling fuel cost."],
  ["traffic-jam-fuel-cost-calculator", "Traffic Jam Fuel Cost Calculator", "Commute & Vehicle Costs", "trafficJamFuelCost", "traffic jam fuel cost calculator", "Estimate fuel burned sitting in traffic."],
  ["car-ac-fuel-cost-calculator", "Car AC Fuel Cost Calculator", "Commute & Vehicle Costs", "carAcFuelCost", "car AC fuel cost calculator", "Estimate extra fuel cost from running AC."],
  ["car-heater-fuel-cost-calculator", "Car Heater Fuel Cost Calculator", "Commute & Vehicle Costs", "carHeaterFuelCost", "car heater fuel cost calculator", "Estimate cabin heat impact on fuel use."],
  ["parking-plus-fuel-commute-cost-calculator", "Parking + Fuel Commute Cost Calculator", "Commute & Vehicle Costs", "parkingPlusFuelCommuteCost", "parking and fuel commute cost calculator", "Combine parking fees with commute fuel."],
  ["two-car-commute-comparison-calculator", "Two-Car Commute Comparison Calculator", "Commute & Vehicle Costs", "twoCarCommuteComparison", "two car commute comparison calculator", "Compare commute cost across two vehicles."],
  ["work-from-home-vs-driving-cost-calculator", "Work From Home vs Driving Cost Calculator", "Commute & Vehicle Costs", "wfhVsDrivingCost", "work from home vs driving cost calculator", "Compare WFH days against driving commute cost."],
  ["gas-vs-ev-commute-cost-calculator", "Gas vs EV Commute Cost Calculator", "Commute & Vehicle Costs", "gasVsEvCommuteCost", "gas vs EV commute cost calculator", "Compare gas and EV cost for the same commute."],
  ["transit-vs-car-commute-cost-calculator", "Transit vs Car Commute Cost Calculator", "Commute & Vehicle Costs", "transitVsCarCommuteCost", "transit vs car commute cost calculator", "Compare transit passes against driving costs."],
  ["cost-of-driving-to-work-per-year-calculator", "Cost of Driving to Work Per Year Calculator", "Commute & Vehicle Costs", "drivingToWorkPerYearCost", "cost of driving to work per year calculator", "Annualize daily commute driving costs."],
  ["cost-of-a-1-hour-commute-calculator", "Cost of a 1-Hour Commute Calculator", "Commute & Vehicle Costs", "oneHourCommuteCost", "cost of a 1 hour commute calculator", "Monetize a one-hour each-way commute."],
  ["extra-cost-of-a-longer-commute-calculator", "Extra Cost of a Longer Commute Calculator", "Commute & Vehicle Costs", "extraCostLongerCommute", "extra cost of a longer commute calculator", "Compare incremental cost of a longer drive."],

  // Payroll & Shift Work (14 remaining; shift differential ready)
  ["night-shift-plus-overtime-pay-calculator", "Night Shift + Overtime Pay Calculator", "Payroll & Shift Work", "nightShiftPlusOvertimePay", "night shift overtime pay calculator", "Stack night differential with overtime premiums."],
  ["weekend-shift-pay-calculator", "Weekend Shift Pay Calculator", "Payroll & Shift Work", "weekendShiftPay", "weekend shift pay calculator", "Estimate weekend premium shift pay."],
  ["two-jobs-take-home-pay-calculator", "Two Jobs Take-Home Pay Calculator", "Payroll & Shift Work", "twoJobsTakeHomePay", "two jobs take-home pay calculator", "Combine take-home from two jobs."],
  ["job-plus-side-hustle-income-calculator", "Job + Side Hustle Income Calculator", "Payroll & Shift Work", "jobPlusSideHustleIncome", "job plus side hustle income calculator", "Combine W-2 and side hustle income."],
  ["unpaid-lunch-break-salary-calculator", "Unpaid Lunch Break Salary Calculator", "Payroll & Shift Work", "unpaidLunchBreakSalary", "unpaid lunch break salary calculator", "See salary impact of unpaid lunch breaks."],
  ["paid-vs-unpaid-break-pay-calculator", "Paid vs Unpaid Break Pay Calculator", "Payroll & Shift Work", "paidVsUnpaidBreakPay", "paid vs unpaid break pay calculator", "Compare paid and unpaid break policies."],
  ["overtime-after-shift-differential-calculator", "Overtime After Shift Differential Calculator", "Payroll & Shift Work", "overtimeAfterShiftDifferential", "overtime after shift differential calculator", "Apply OT on top of differential rates."],
  ["four-on-four-off-salary-calculator", "4-on-4-off Salary Calculator", "Payroll & Shift Work", "fourOnFourOffSalary", "4 on 4 off salary calculator", "Project pay on a 4-on-4-off roster."],
  ["rotating-shift-income-calculator", "Rotating Shift Income Calculator", "Payroll & Shift Work", "rotatingShiftIncome", "rotating shift income calculator", "Average income across rotating shift patterns."],
  ["missed-shift-pay-loss-calculator", "Missed Shift Pay Loss Calculator", "Payroll & Shift Work", "missedShiftPayLoss", "missed shift pay loss calculator", "Estimate wages lost from a missed shift."],
  ["calling-in-sick-pay-loss-calculator", "Calling in Sick Pay Loss Calculator", "Payroll & Shift Work", "callingInSickPayLoss", "calling in sick pay loss calculator", "Estimate unpaid sick-day wage loss."],
  ["extra-hour-of-work-take-home-calculator", "Extra Hour of Work Take-Home Calculator", "Payroll & Shift Work", "extraHourWorkTakeHome", "extra hour of work take-home calculator", "Net take-home from one extra hour."],
  ["raise-vs-overtime-income-calculator", "Raise vs Overtime Income Calculator", "Payroll & Shift Work", "raiseVsOvertimeIncome", "raise vs overtime income calculator", "Compare a raise against working more OT."],

  // Rent & Roommate Splits (9 remaining)
  ["room-with-private-bathroom-rent-calculator", "Room With Private Bathroom Rent Calculator", "Rent & Roommate Splits", "roomPrivateBathroomRent", "room with private bathroom rent calculator", "Adjust rent for a private bath."],
  ["roommate-rent-split-different-closets-calculator", "Roommate Rent Split With Different Closets Calculator", "Rent & Roommate Splits", "roommateRentDifferentClosets", "roommate rent split different closets calculator", "Factor closet size into rent share."],
  ["roommate-rent-split-extra-person-calculator", "Roommate Rent Split With Extra Person Calculator", "Rent & Roommate Splits", "roommateRentExtraPerson", "roommate rent split extra person calculator", "Recalculate shares when someone moves in."],
  ["boyfriend-girlfriend-moving-in-rent-calculator", "Boyfriend/Girlfriend Moving In Rent Calculator", "Rent & Roommate Splits", "partnerMovingInRent", "boyfriend girlfriend moving in rent calculator", "Split rent when a partner moves in."],
  ["roommate-utility-split-by-usage-calculator", "Roommate Utility Split by Usage Calculator", "Rent & Roommate Splits", "roommateUtilitySplitByUsage", "roommate utility split by usage calculator", "Split utilities by estimated usage."],
  ["roommate-utility-split-wfh-calculator", "Roommate Utility Split With Work-From-Home Calculator", "Rent & Roommate Splits", "roommateUtilitySplitWfh", "roommate utility split work from home calculator", "Adjust utilities for WFH days at home."],
  ["roommate-rent-parking-split-calculator", "Roommate Rent + Parking Split Calculator", "Rent & Roommate Splits", "roommateRentParkingSplit", "roommate rent parking split calculator", "Split rent and parking spots fairly."],
  ["roommate-rent-split-different-bedroom-sizes-calculator", "Roommate Rent Split With Different Bedroom Sizes Calculator", "Rent & Roommate Splits", "roommateRentDifferentBedroomSizes", "roommate rent split different bedroom sizes calculator", "Multi-room size-weighted rent split."],

  // Freelance & Micro-Business (9 remaining)
  ["freelance-rate-after-taxes-calculator", "Freelance Rate After Taxes Calculator", "Freelance & Micro-Business", "freelanceRateAfterTaxes", "freelance rate after taxes calculator", "Net hourly after estimated tax drag."],
  ["freelance-rate-non-billable-hours-calculator", "Freelance Rate With Non-Billable Hours Calculator", "Freelance & Micro-Business", "freelanceRateNonBillableHours", "freelance rate with non-billable hours calculator", "Inflate rate for admin and sales time."],
  ["freelance-project-scope-creep-cost-calculator", "Freelance Project Scope-Creep Cost Calculator", "Freelance & Micro-Business", "freelanceScopeCreepCost", "freelance project scope creep cost calculator", "Cost extra hours from scope creep."],
  ["freelance-retainer-pricing-calculator", "Freelance Retainer Pricing Calculator", "Freelance & Micro-Business", "freelanceRetainerPricing", "freelance retainer pricing calculator", "Price a monthly retainer from hours and rate."],
  ["hourly-rate-to-project-quote-calculator", "Hourly Rate to Project Quote Calculator", "Freelance & Micro-Business", "hourlyRateToProjectQuote", "hourly rate to project quote calculator", "Turn hourly rate into a fixed project quote."],
  ["client-discount-vs-profit-calculator", "Client Discount vs Profit Calculator", "Freelance & Micro-Business", "clientDiscountVsProfit", "client discount vs profit calculator", "See how discounts cut project profit."],
  ["freelancer-break-even-client-calculator", "Freelancer Break-Even Client Calculator", "Freelance & Micro-Business", "freelancerBreakEvenClient", "freelancer break-even client calculator", "Find the client volume needed to break even."],
  ["freelance-monthly-income-target-calculator", "Freelance Monthly Income Target Calculator", "Freelance & Micro-Business", "freelanceMonthlyIncomeTarget", "freelance monthly income target calculator", "Back into hours/rate for a monthly income goal."],
  ["freelancer-vacation-cost-calculator", "Freelancer Vacation Cost Calculator", "Freelance & Micro-Business", "freelancerVacationCost", "freelancer vacation cost calculator", "Estimate income lost during unpaid vacation."],

  // Food & Catering Business (9 remaining)
  ["meal-prep-delivery-profit-calculator", "Meal Prep Delivery Profit Calculator", "Food & Catering Business", "mealPrepDeliveryProfit", "meal prep delivery profit calculator", "Profit after delivery fees per meal."],
  ["food-packaging-cost-per-order-calculator", "Food Packaging Cost Per Order Calculator", "Food & Catering Business", "foodPackagingCostPerOrder", "food packaging cost per order calculator", "Packaging cost allocated per order."],
  ["restaurant-portion-cost-calculator", "Restaurant Portion Cost Calculator", "Food & Catering Business", "restaurantPortionCost", "restaurant portion cost calculator", "Food cost for a plated portion."],
  ["food-delivery-break-even-calculator", "Food Delivery Break-Even Calculator", "Food & Catering Business", "foodDeliveryBreakEven", "food delivery break-even calculator", "Orders needed to cover delivery overhead."],
  ["catering-cost-per-guest-calculator", "Catering Cost Per Guest Calculator", "Food & Catering Business", "cateringCostPerGuest", "catering cost per guest calculator", "Per-guest cost for a catering event."],
  ["catering-profit-per-event-calculator", "Catering Profit Per Event Calculator", "Food & Catering Business", "cateringProfitPerEvent", "catering profit per event calculator", "Event revenue minus catering costs."],
  ["food-truck-daily-break-even-calculator", "Food Truck Daily Break-Even Calculator", "Food & Catering Business", "foodTruckDailyBreakEven", "food truck daily break-even calculator", "Sales needed to cover a food truck day."],
].map(([slug, title, category, formulaType, focusHint, description]) => ({
  slug,
  title,
  category,
  formulaType,
  focusHint,
  description,
}));

const intent80Stubs: Calculator[] = STUB_DEFS.map((def) =>
  stub80({
    slug: def.slug,
    title: def.title,
    category: def.category,
    description: def.description,
    formulaType: def.formulaType,
    focusHint: def.focusHint,
  })
);

export const INTENT80_TOOLS: Calculator[] = [
  laundryCostPerLoad,
  idlingFuelCost,
  shiftDifferentialPay,
  roommateRentByRoomSize,
  freelanceRateAfterFees,
  mealPrepCostPerMeal,
  dryerCostPerLoad,
  driveThruIdlingCost,
  twelveHourShiftPay,
  masterBedroomFairRent,
  mealPrepSellingPrice,
  recipeCostPerServing,
  ...intent80Stubs,
];

export const INTENT80_READY_TOOLS = INTENT80_TOOLS.filter(
  (tool) => tool.ready !== false
);

export const INTENT80_SLUGS = new Set(INTENT80_TOOLS.map((t) => t.slug));

export const INTENT80_CATEGORIES = [
  "Home & Appliance Utilities",
  "Commute & Vehicle Costs",
  "Payroll & Shift Work",
  "Rent & Roommate Splits",
  "Freelance & Micro-Business",
  "Food & Catering Business",
] as const;

export function getIntent80ToolBySlug(slug: string): Calculator | undefined {
  return INTENT80_TOOLS.find((tool) => tool.slug === slug);
}
