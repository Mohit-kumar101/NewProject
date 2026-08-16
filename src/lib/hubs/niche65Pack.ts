/**
 * Niche-65 pSEO hub pack (65 tools across 6 categories).
 *
 * READY (6 — first tool per category):
 *   amazonFbaStorageFeeByBox, refrigeratorCostPerYear, dogFoodCostPerMonth,
 *   wfhElectricityCost, houseCleaningJobPrice, coffeeShopCostPerCup
 *
 * TODO: remaining 59 — expand stub configs + formulas.ts handlers, then ready: true
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

function stub65(partial: {
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
      intro: `${partial.description} (Niche-65 schema stub — engine TODO.)`,
      howToUse: [
        "Implement the formula handler, then set ready: true.",
        "Enter the labeled inputs.",
        "Read the live result and long-tail FAQ.",
      ],
      faqs: [
        {
          question: `How do I use the ${partial.title}?`,
          answer:
            "This calculator is scaffolded in the Niche-65 hub pack. The formula is marked TODO until implemented.",
        },
      ],
    },
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
    "Looking for “{{focusKeyword}}”? {{formulaSummary}} Example: {{example}} Free {{title}} for {{year}}—instant, no sign up.",
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
    "Need “{{focusKeyword}}”? {{formulaSummary}} Example: {{example}} Free {{title}} ({{year}}).",
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
    "Searching “{{focusKeyword}}”? {{formulaSummary}} Example: {{example}} Free {{title}} for {{year}}.",
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

/** Compact stub defs for the remaining 59 tools. */
const STUB_DEFS: Array<{
  slug: string;
  title: string;
  category: string;
  formulaType: string;
  focusHint: string;
  description: string;
}> = (
  [
    // E-Commerce, Logistics & Storage (16 remaining)
    ["etsy-shipping-cost-per-item-calculator", "Etsy Shipping Cost Per Item Calculator", "E-Commerce, Logistics & Storage", "etsyShippingCostPerItem", "Etsy shipping cost per item calculator", "Allocate shipping spend across items in an order."],
    ["shopify-packaging-cost-per-order-calculator", "Shopify Packaging Cost Per Order Calculator", "E-Commerce, Logistics & Storage", "shopifyPackagingCostPerOrder", "Shopify packaging cost per order calculator", "Estimate packaging materials cost per Shopify order."],
    ["box-dimensional-weight-calculator", "Box Dimensional Weight Calculator", "E-Commerce, Logistics & Storage", "boxDimensionalWeight", "box dimensional weight calculator", "Compute DIM weight from box size and carrier divisor."],
    ["shipping-box-cubic-volume-calculator", "Shipping Box Cubic Volume Calculator", "E-Commerce, Logistics & Storage", "shippingBoxCubicVolume", "shipping box cubic volume calculator", "Calculate cubic volume of a shipping carton."],
    ["pallet-space-calculator", "Pallet Space Calculator", "E-Commerce, Logistics & Storage", "palletSpace", "pallet space calculator", "Estimate usable pallet footprint and layers."],
    ["how-many-boxes-fit-on-a-pallet-calculator", "How Many Boxes Fit on a Pallet Calculator", "E-Commerce, Logistics & Storage", "boxesFitOnPallet", "how many boxes fit on a pallet calculator", "Fit boxes onto a pallet by footprint and stack height."],
    ["pallet-weight-capacity-calculator", "Pallet Weight Capacity Calculator", "E-Commerce, Logistics & Storage", "palletWeightCapacity", "pallet weight capacity calculator", "Check load vs pallet rated capacity."],
    ["container-fill-percentage-calculator", "Container Fill Percentage Calculator", "E-Commerce, Logistics & Storage", "containerFillPercentage", "container fill percentage calculator", "Estimate how full a container is by volume."],
    ["truck-load-weight-calculator", "Truck Load Weight Calculator", "E-Commerce, Logistics & Storage", "truckLoadWeight", "truck load weight calculator", "Sum pallet/box weights against truck limits."],
    ["warehouse-storage-cost-per-pallet-calculator", "Warehouse Storage Cost Per Pallet Calculator", "E-Commerce, Logistics & Storage", "warehouseStorageCostPerPallet", "warehouse storage cost per pallet calculator", "Monthly storage cost by pallet position."],
    ["warehouse-storage-cost-per-cubic-foot-calculator", "Warehouse Storage Cost Per Cubic Foot Calculator", "E-Commerce, Logistics & Storage", "warehouseStorageCostPerCuFt", "warehouse storage cost per cubic foot calculator", "Storage cost from cubic footage occupied."],
    ["pick-and-pack-cost-per-order-calculator", "Pick-and-Pack Cost Per Order Calculator", "E-Commerce, Logistics & Storage", "pickAndPackCostPerOrder", "pick and pack cost per order calculator", "Labor and materials for pick-and-pack."],
    ["moving-truck-cost-per-room-calculator", "Moving Truck Cost Per Room Calculator", "E-Commerce, Logistics & Storage", "movingTruckCostPerRoom", "moving truck cost per room calculator", "Allocate truck rental across rooms moved."],
    ["moving-box-quantity-by-apartment-size-calculator", "Moving Box Quantity Calculator by Apartment Size", "E-Commerce, Logistics & Storage", "movingBoxQuantityByApartment", "moving box quantity by apartment size calculator", "Estimate boxes needed by apartment size."],
    ["storage-unit-cost-per-square-foot-calculator", "Storage Unit Cost Per Square Foot Calculator", "E-Commerce, Logistics & Storage", "storageUnitCostPerSqFt", "storage unit cost per square foot calculator", "Unit rent divided by square footage."],
    ["closet-storage-capacity-calculator", "Closet Storage Capacity Calculator", "E-Commerce, Logistics & Storage", "closetStorageCapacity", "closet storage capacity calculator", "Estimate closet volume and shelf capacity."],

    // Home Utilities, Appliances & Specialty Amenities (12 remaining)
    ["freezer-electricity-cost-per-month-calculator", "Freezer Electricity Cost Per Month Calculator", "Home Utilities, Appliances & Specialty Amenities", "freezerElectricityCostPerMonth", "freezer electricity cost per month calculator", "Monthly freezer electricity from kWh and rate."],
    ["gaming-pc-monitor-electricity-cost-calculator", "Gaming PC + Monitor Electricity Cost Calculator", "Home Utilities, Appliances & Specialty Amenities", "gamingPcMonitorElectricityCost", "gaming PC monitor electricity cost calculator", "PC + monitor power cost per session or month."],
    ["bathroom-exhaust-fan-cost-calculator", "Cost to Run Bathroom Exhaust Fan Calculator", "Home Utilities, Appliances & Specialty Amenities", "bathroomExhaustFanCost", "cost to run bathroom exhaust fan calculator", "Exhaust fan electricity for timed use."],
    ["heated-bathroom-floor-cost-calculator", "Cost to Run Heated Bathroom Floor Calculator", "Home Utilities, Appliances & Specialty Amenities", "heatedBathroomFloorCost", "cost to run heated bathroom floor calculator", "Radiant floor heat electricity estimate."],
    ["heated-towel-rack-cost-calculator", "Cost to Run Heated Towel Rack Calculator", "Home Utilities, Appliances & Specialty Amenities", "heatedTowelRackCost", "cost to run heated towel rack calculator", "Towel warmer electricity cost."],
    ["aquarium-filter-cost-calculator", "Cost to Run Aquarium Filter Calculator", "Home Utilities, Appliances & Specialty Amenities", "aquariumFilterCost", "cost to run aquarium filter calculator", "Filter pump electricity for 24/7 run."],
    ["aquarium-heater-cost-calculator", "Cost to Run Aquarium Heater Calculator", "Home Utilities, Appliances & Specialty Amenities", "aquariumHeaterCost", "cost to run aquarium heater calculator", "Heater duty-cycle electricity estimate."],
    ["fish-tank-electricity-cost-calculator", "Fish Tank Electricity Cost Calculator", "Home Utilities, Appliances & Specialty Amenities", "fishTankElectricityCost", "fish tank electricity cost calculator", "Combined tank equipment electricity."],
    ["hot-tub-electricity-cost-per-month-calculator", "Hot Tub Electricity Cost Per Month Calculator", "Home Utilities, Appliances & Specialty Amenities", "hotTubElectricityCostPerMonth", "hot tub electricity cost per month calculator", "Monthly spa electricity estimate."],
    ["hot-tub-heating-cost-calculator", "Hot Tub Heating Cost Calculator", "Home Utilities, Appliances & Specialty Amenities", "hotTubHeatingCost", "hot tub heating cost calculator", "Cost to heat a hot tub to setpoint."],
    ["pool-pump-electricity-cost-calculator", "Pool Pump Electricity Cost Calculator", "Home Utilities, Appliances & Specialty Amenities", "poolPumpElectricityCost", "pool pump electricity cost calculator", "Pool pump run-time electricity."],
    ["pool-heater-running-cost-calculator", "Pool Heater Running Cost Calculator", "Home Utilities, Appliances & Specialty Amenities", "poolHeaterRunningCost", "pool heater running cost calculator", "Pool heater fuel or electric cost."],

    // Pet Care & Household Expenses (9 remaining)
    ["cost-to-feed-a-large-dog-calculator", "Cost to Feed a Large Dog Calculator", "Pet Care & Household Expenses", "costToFeedLargeDog", "cost to feed a large dog calculator", "Monthly feed cost scaled for large breeds."],
    ["puppy-food-cost-per-year-calculator", "Puppy Food Cost Per Year Calculator", "Pet Care & Household Expenses", "puppyFoodCostPerYear", "puppy food cost per year calculator", "Annualize puppy feeding costs."],
    ["cat-litter-cost-per-month-calculator", "Cat Litter Cost Per Month Calculator", "Pet Care & Household Expenses", "catLitterCostPerMonth", "cat litter cost per month calculator", "Litter bag cost spread over a month."],
    ["cost-per-cat-litter-box-cleaning-calculator", "Cost Per Cat Litter Box Cleaning Calculator", "Pet Care & Household Expenses", "costPerCatLitterBoxCleaning", "cost per cat litter box cleaning calculator", "Litter and liner cost per scooping cycle."],
    ["dog-treat-cost-per-month-calculator", "Dog Treat Cost Per Month Calculator", "Pet Care & Household Expenses", "dogTreatCostPerMonth", "dog treat cost per month calculator", "Monthly treat spend estimate."],
    ["pet-medication-cost-per-month-calculator", "Pet Medication Cost Per Month Calculator", "Pet Care & Household Expenses", "petMedicationCostPerMonth", "pet medication cost per month calculator", "Rx and preventatives monthly cost."],
    ["aquarium-fish-food-cost-calculator", "Aquarium Fish Food Cost Calculator", "Pet Care & Household Expenses", "aquariumFishFoodCost", "aquarium fish food cost calculator", "Fish food cost per week or month."],
    ["fish-tank-water-change-cost-calculator", "Fish Tank Water Change Cost Calculator", "Pet Care & Household Expenses", "fishTankWaterChangeCost", "fish tank water change cost calculator", "Water/sewer cost of tank changes."],
    ["multiple-pet-monthly-cost-calculator", "Multiple Pet Monthly Cost Calculator", "Pet Care & Household Expenses", "multiplePetMonthlyCost", "multiple pet monthly cost calculator", "Roll up food, litter, and care for multiple pets."],

    // Remote Work & Home Office (9 remaining)
    ["home-office-electricity-cost-calculator", "Home Office Electricity Cost Calculator", "Remote Work & Home Office", "homeOfficeElectricityCost", "home office electricity cost calculator", "Broader home-office electricity estimate."],
    ["laptop-electricity-cost-per-workday-calculator", "Laptop Electricity Cost Per Workday Calculator", "Remote Work & Home Office", "laptopElectricityCostPerWorkday", "laptop electricity cost per workday calculator", "Laptop-only power cost per workday."],
    ["external-monitor-electricity-cost-calculator", "External Monitor Electricity Cost Calculator", "Remote Work & Home Office", "externalMonitorElectricityCost", "external monitor electricity cost calculator", "Monitor wattage cost while working."],
    ["wfh-internet-cost-per-workday-calculator", "Work From Home Internet Cost Per Workday Calculator", "Remote Work & Home Office", "wfhInternetCostPerWorkday", "work from home internet cost per workday calculator", "Allocate monthly internet to workdays."],
    ["home-office-tax-deduction-by-sqft-calculator", "Home Office Tax Deduction Calculator by Square Foot", "Remote Work & Home Office", "homeOfficeTaxDeductionBySqFt", "home office tax deduction by square foot calculator", "Simplified sq-ft home office deduction estimate."],
    ["working-from-cafe-cost-calculator", "Working From Cafe Cost Calculator", "Remote Work & Home Office", "workingFromCafeCost", "working from cafe cost calculator", "Cafe spend vs home office for remote days."],
    ["remote-work-vs-office-cost-calculator", "Remote Work vs Office Cost Calculator", "Remote Work & Home Office", "remoteWorkVsOfficeCost", "remote work vs office cost calculator", "Compare WFH costs to commuting/office days."],
    ["work-from-home-savings-calculator", "Work From Home Savings Calculator", "Remote Work & Home Office", "workFromHomeSavings", "work from home savings calculator", "Net savings from WFH vs office baseline."],
    ["second-monitor-cost-vs-productivity-calculator", "Second Monitor Cost vs Productivity Calculator", "Remote Work & Home Office", "secondMonitorCostVsProductivity", "second monitor cost vs productivity calculator", "Payback of a second monitor via time saved."],

    // Local Services & Trade Pricing (9 remaining)
    ["window-cleaning-job-price-calculator", "Window Cleaning Job Price Calculator", "Local Services & Trade Pricing", "windowCleaningJobPrice", "window cleaning job price calculator", "Quote window cleaning from panes and rate."],
    ["lawn-mowing-job-price-calculator", "Lawn Mowing Job Price Calculator", "Local Services & Trade Pricing", "lawnMowingJobPrice", "lawn mowing job price calculator", "Price mowing from lot size and rate."],
    ["snow-removal-job-price-calculator", "Snow Removal Job Price Calculator", "Local Services & Trade Pricing", "snowRemovalJobPrice", "snow removal job price calculator", "Price driveway/ walk snow removal jobs."],
    ["pressure-washing-job-price-calculator", "Pressure Washing Job Price Calculator", "Local Services & Trade Pricing", "pressureWashingJobPrice", "pressure washing job price calculator", "Quote pressure washing by area and rate."],
    ["junk-removal-job-price-calculator", "Junk Removal Job Price Calculator", "Local Services & Trade Pricing", "junkRemovalJobPrice", "junk removal job price calculator", "Price junk hauling by volume and dump fees."],
    ["handyman-minimum-charge-calculator", "Handyman Minimum Charge Calculator", "Local Services & Trade Pricing", "handymanMinimumCharge", "handyman minimum charge calculator", "Set a profitable minimum service call."],
    ["painter-job-quote-calculator", "Painter Job Quote Calculator", "Local Services & Trade Pricing", "painterJobQuote", "painter job quote calculator", "Paint job quote from area, coats, and labor."],
    ["mobile-car-detailing-price-calculator", "Mobile Car Detailing Price Calculator", "Local Services & Trade Pricing", "mobileCarDetailingPrice", "mobile car detailing price calculator", "Detailing package price with travel."],
    ["house-cleaning-break-even-calculator", "House Cleaning Break-Even Calculator", "Local Services & Trade Pricing", "houseCleaningBreakEven", "house cleaning break-even calculator", "Jobs needed to cover cleaning business fixed costs."],

    // Events, Hospitality & Micro-Business (4 remaining)
    ["bakery-cost-per-cupcake-calculator", "Bakery Cost Per Cupcake Calculator", "Events, Hospitality & Micro-Business", "bakeryCostPerCupcake", "bakery cost per cupcake calculator", "Ingredient and liner cost per cupcake."],
    ["wedding-cost-per-guest-calculator", "Wedding Cost Per Guest Calculator", "Events, Hospitality & Micro-Business", "weddingCostPerGuest", "wedding cost per guest calculator", "Total wedding budget divided by guests."],
    ["airbnb-cost-per-occupied-night-calculator", "Airbnb Cost Per Occupied Night Calculator", "Events, Hospitality & Micro-Business", "airbnbCostPerOccupiedNight", "Airbnb cost per occupied night calculator", "Fixed + variable hosting cost per occupied night."],
    ["airbnb-cleaning-cost-per-booking-calculator", "Airbnb Cleaning Cost Per Booking Calculator", "Events, Hospitality & Micro-Business", "airbnbCleaningCostPerBooking", "Airbnb cleaning cost per booking calculator", "Cleaning fee vs true turnover cost per booking."],
  ] as Array<[string, string, string, string, string, string]>
).map(([slug, title, category, formulaType, focusHint, description]) => ({
  slug,
  title,
  category,
  formulaType,
  focusHint,
  description,
}));

const niche65Stubs: Calculator[] = STUB_DEFS.map((def) =>
  stub65({
    slug: def.slug,
    title: def.title,
    category: def.category,
    description: def.description,
    formulaType: def.formulaType,
    focusHint: def.focusHint,
  })
);

export const NICHE65_TOOLS: Calculator[] = [
  amazonFbaStorageByBox,
  refrigeratorCostPerYear,
  dogFoodCostPerMonth,
  wfhElectricityCost,
  houseCleaningJobPrice,
  coffeeShopCostPerCup,
  ...niche65Stubs,
];

export const NICHE65_READY_TOOLS = NICHE65_TOOLS.filter(
  (tool) => tool.ready !== false
);

export const NICHE65_SLUGS = new Set(NICHE65_TOOLS.map((t) => t.slug));

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
