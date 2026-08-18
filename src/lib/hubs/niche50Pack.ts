/**
 * Hyper-niche calculator pack — 50 tools across 5 pSEO categories.
 * Routes: /tools/{category-slug}/{tool-slug}
 */

import type { Calculator, CalculatorInput, LongTailModifier } from "@/lib/types";
import {
  CRAFTERS_MAKERS_CATEGORY,
  GIG_ECONOMY_CATEGORY,
  HOMESTEADING_CATEGORY,
  NICHE_EVENTS_CATEGORY,
  SPECIALIZED_PETS_CATEGORY,
} from "@/lib/categoryPaths";

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
    benefit: extras?.benefit ?? "Instant estimate",
    faqs: extras?.faqs,
  };
}

function buildTool(spec: {
  slug: string;
  title: string;
  category: string;
  seoH1: string;
  seoDescription: string;
  focusKeyword: string;
  formulaType: string;
  description: string;
  formulaSummary: string;
  realWorldExample: string;
  inputs: CalculatorInput[];
}): Calculator {
  return {
    slug: spec.slug,
    title: spec.title,
    category: spec.category,
    description: spec.description,
    formulaType: spec.formulaType,
    useCategoryPath: true,
    ready: true,
    seoTitle: spec.seoH1,
    seoH1: spec.seoH1,
    seoDescription: spec.seoDescription,
    seoKeywords: [spec.focusKeyword, spec.title, "free calculator", "no sign up"],
    inputs: spec.inputs,
    formulaSummary: spec.formulaSummary,
    realWorldExample: spec.realWorldExample,
    seoContextTemplate:
      'Looking for "{{focusKeyword}}"? {{formulaSummary}} Example: {{example}} Free {{title}} — instant, no sign up.',
    explanationTemplate:
      '{{variantExplanation}} Free {{title}} for "{{focusKeyword}}".',
    longTailModifiers: [
      modifier("free-online", spec.focusKeyword, spec.description, {
        faqs: [
          {
            question: `How do I use the ${spec.title}?`,
            answer: spec.formulaSummary,
          },
        ],
      }),
    ],
    seoContent: {
      intro: `${spec.description} Planning estimates only — verify measurements independently.`,
      howToUse: [
        "Enter your project or scenario values.",
        "Read the primary result and supporting breakdown.",
        "Adjust inputs to compare scenarios.",
      ],
      faqs: [
        {
          question: `How is this ${spec.title.toLowerCase()} calculated?`,
          answer: spec.formulaSummary,
        },
        {
          question: "Is this calculator free?",
          answer: "Yes. Instant browser results with no sign up required.",
        },
      ],
    },
  };
}

export const NICHE50_TOOLS: Calculator[] = [
buildTool({
  slug: "river-table-epoxy-volume-calculator",
  title: "River Table Epoxy Volume Calculator",
  category: CRAFTERS_MAKERS_CATEGORY,
  seoH1: "How Much Epoxy Resin Do You Need for a River Table? Free Calculator",
  seoDescription: "Calculate epoxy volume for river tables from length, width, depth, and coat count.",
  focusKeyword: "how much epoxy resin do i need for a river table calculator",
  formulaType: "nicheEpoxyRiverTable",
  description: "Calculate epoxy volume for river tables from length, width, depth, and coat count.",
  formulaSummary: "Volume = L × W × D × coats; converted to liters and gallons.",
  realWorldExample: "48×24×2 in river pour, 2 coats → ~4.5 L epoxy before waste.",
  inputs: [
    input("lengthIn", "River length (in)", 48, 12, 120, 1),
    input("widthIn", "River width (in)", 24, 6, 48, 0.5),
    input("depthIn", "Pour depth (in)", 2, 0.25, 6, 0.25),
    input("coats", "Number of coats", 2, 1, 5, 1)
  ],
}),
buildTool({
  slug: "candle-fragrance-load-calculator",
  title: "Candle Fragrance Load Calculator",
  category: CRAFTERS_MAKERS_CATEGORY,
  seoH1: "Candle Fragrance Load Calculator — Percentage & Ounces by Wax Weight",
  seoDescription: "Compute fragrance load in ounces from wax weight and fragrance percentage.",
  focusKeyword: "candle fragrance load percentage calculator in ounces",
  formulaType: "nicheCandleFragrance",
  description: "Compute fragrance load in ounces from wax weight and fragrance percentage.",
  formulaSummary: "Fragrance oz = wax oz × (load % ÷ 100).",
  realWorldExample: "16 oz soy wax at 8% load → 1.28 oz fragrance oil.",
  inputs: [
    input("waxOz", "Wax weight (oz)", 16, 4, 128, 1),
    input("fragrancePct", "Fragrance load (%)", 8, 0, 12, 0.5)
  ],
}),
buildTool({
  slug: "cold-process-soap-lye-calculator",
  title: "Cold Process Soap Lye Calculator",
  category: CRAFTERS_MAKERS_CATEGORY,
  seoH1: "Cold Process Soap Lye & Water Ratio Calculator (NaOH)",
  seoDescription: "Estimate NaOH and water for cold-process soap from oil weight and superfat.",
  focusKeyword: "cold process soap lye and water ratio calculator",
  formulaType: "nicheColdProcessSoapLye",
  description: "Estimate NaOH and water for cold-process soap from oil weight and superfat.",
  formulaSummary: "Lye g = oil g × SAP × (1 − superfat%); water = lye × ratio.",
  realWorldExample: "32 oz oils, 5% superfat → ~4.3 oz NaOH and ~10 oz water (estimate).",
  inputs: [
    input("oilOz", "Total oil weight (oz)", 32, 8, 200, 1),
    input("avgSapValue", "Avg SAP value", 0.135, 0.12, 0.2, 0.005),
    input("superfatPct", "Superfat (%)", 5, 0, 15, 1),
    input("waterToLyeRatio", "Water:lye ratio", 2.5, 2, 3.5, 0.1)
  ],
}),
buildTool({
  slug: "yarn-substitution-yardage-calculator",
  title: "Yarn Substitution Yardage Calculator",
  category: CRAFTERS_MAKERS_CATEGORY,
  seoH1: "Yarn Substitution Yardage Calculator for Knitting Patterns",
  seoDescription: "Convert yardage when swapping yarn gauge in a knitting pattern.",
  focusKeyword: "yarn substitution yardage calculator for knitting patterns",
  formulaType: "nicheYarnSubstitution",
  description: "Convert yardage when swapping yarn gauge in a knitting pattern.",
  formulaSummary: "New yards = original yards × (new gauge ÷ old gauge).",
  realWorldExample: "400 yd at 5 sts/in switching to 4.5 sts/in → ~360 yd needed.",
  inputs: [
    input("originalYards", "Original yardage", 400, 50, 3000, 10),
    input("originalGauge", "Original gauge (sts/in)", 5, 3, 8, 0.25),
    input("newGauge", "New yarn gauge (sts/in)", 4.5, 3, 8, 0.25)
  ],
}),
buildTool({
  slug: "quilt-backing-binding-yardage-calculator",
  title: "Quilt Backing & Binding Yardage Calculator",
  category: CRAFTERS_MAKERS_CATEGORY,
  seoH1: "Quilt Backing & Binding Fabric Yardage Calculator",
  seoDescription: "Estimate backing and binding fabric yardage for a quilt size.",
  focusKeyword: "quilt backing and binding fabric yardage calculator",
  formulaType: "nicheQuiltBackingBinding",
  description: "Estimate backing and binding fabric yardage for a quilt size.",
  formulaSummary: "Backing includes 4 in overhang; binding from perimeter × strip width.",
  realWorldExample: "60×80 in quilt → ~4.5 yd backing and ~0.75 yd binding (estimate).",
  inputs: [
    input("quiltWidthIn", "Quilt width (in)", 60, 24, 120, 1),
    input("quiltLengthIn", "Quilt length (in)", 80, 24, 120, 1),
    input("bindingWidthIn", "Binding strip width (in)", 2.5, 2, 4, 0.25)
  ],
}),
buildTool({
  slug: "crochet-blanket-starting-chain-calculator",
  title: "Crochet Blanket Starting Chain Calculator",
  category: CRAFTERS_MAKERS_CATEGORY,
  seoH1: "How Many Chains to Start a Crochet Blanket? Free Calculator",
  seoDescription: "Estimate starting chain count from blanket width and stitch width.",
  focusKeyword: "how many chains to start a crochet blanket calculator",
  formulaType: "nicheCrochetStartingChain",
  description: "Estimate starting chain count from blanket width and stitch width.",
  formulaSummary: "Chains = blanket width ÷ average stitch width.",
  realWorldExample: "45 in blanket, 0.5 in per stitch → ~90 starting chains.",
  inputs: [
    input("blanketWidthIn", "Blanket width (in)", 45, 24, 90, 1),
    input("stitchWidthIn", "Stitch width (in)", 0.5, 0.2, 1.5, 0.05)
  ],
}),
buildTool({
  slug: "htv-vinyl-project-cost-calculator",
  title: "HTV & Vinyl Project Cost Calculator",
  category: CRAFTERS_MAKERS_CATEGORY,
  seoH1: "HTV & Adhesive Vinyl Project Cost and Profit Margin Calculator",
  seoDescription: "Price HTV/vinyl crafts with material, labor, and margin.",
  focusKeyword: "htv and adhesive vinyl project cost and profit margin calculator",
  formulaType: "nicheHtvVinylProjectCost",
  description: "Price HTV/vinyl crafts with material, labor, and margin.",
  formulaSummary: "Cost = vinyl sq ft × rate + labor + extras; margin from sell price.",
  realWorldExample: "2 sq ft HTV, $4/sq ft, 20 min labor → cost vs $18 sell price.",
  inputs: [
    input("vinylSqFt", "Vinyl used (sq ft)", 2, 0.25, 20, 0.25),
    input("vinylCostPerSqFt", "Vinyl cost ($/sq ft)", 4, 1, 15, 0.25),
    input("laborMin", "Labor (min)", 20, 5, 180, 5),
    input("hourlyRate", "Labor rate ($/hr)", 25, 10, 100, 5),
    input("otherCost", "Other costs ($)", 2, 0, 50, 1),
    input("sellPrice", "Sell price ($)", 18, 5, 200, 1)
  ],
}),
buildTool({
  slug: "epoxy-resin-coaster-cost-calculator",
  title: "Epoxy Resin Coaster Cost Calculator",
  category: CRAFTERS_MAKERS_CATEGORY,
  seoH1: "Epoxy Resin Coaster Set Cost Calculator (Per Gram)",
  seoDescription: "Calculate resin material cost per coaster for small batch pours.",
  focusKeyword: "epoxy resin coaster set material cost per gram calculator",
  formulaType: "nicheEpoxyCoasterCost",
  description: "Calculate resin material cost per coaster for small batch pours.",
  formulaSummary: "Batch cost = grams × $/g; per coaster = batch ÷ mold count.",
  realWorldExample: "120 g resin at $0.04/g, 4 molds → ~$1.20 per coaster.",
  inputs: [
    input("resinGrams", "Resin used (g)", 120, 20, 2000, 5),
    input("costPerGram", "Cost ($/g)", 0.04, 0.01, 0.2, 0.01),
    input("moldCount", "Coasters per pour", 4, 1, 12, 1)
  ],
}),
buildTool({
  slug: "leather-hide-yield-calculator",
  title: "Leather Hide Yield Calculator",
  category: CRAFTERS_MAKERS_CATEGORY,
  seoH1: "Leather Hide Yield Calculator for Bag Patterns",
  seoDescription: "Estimate usable hide area and how many bag patterns fit.",
  focusKeyword: "how much leather hide do i need for bag pattern calculator",
  formulaType: "nicheLeatherHideYield",
  description: "Estimate usable hide area and how many bag patterns fit.",
  formulaSummary: "Usable sq ft = hide sq ft × (1 − waste%); bags = usable ÷ pattern need.",
  realWorldExample: "22 sq ft hide, 3 sq ft/bag, 15% waste → ~6 bags (estimate).",
  inputs: [
    input("hideSqFt", "Hide size (sq ft)", 22, 5, 50, 0.5),
    input("patternSqFtPerBag", "Pattern need (sq ft/bag)", 3, 0.5, 10, 0.25),
    input("wastePct", "Waste allowance (%)", 15, 5, 40, 1)
  ],
}),
buildTool({
  slug: "sourdough-hydration-discard-calculator",
  title: "Sourdough Hydration & Discard Calculator",
  category: CRAFTERS_MAKERS_CATEGORY,
  seoH1: "Sourdough Starter Hydration & Discard Calculator",
  seoDescription: "Compute water, starter, and discard from flour and hydration %.",
  focusKeyword: "sourdough starter hydration ratio and discard calculator",
  formulaType: "nicheSourdoughHydration",
  description: "Compute water, starter, and discard from flour and hydration %.",
  formulaSummary: "Water = flour × hydration%; discard = starter × discard %.",
  realWorldExample: "500 g flour at 75% hydration → 375 g water (estimate).",
  inputs: [
    input("flourGrams", "Flour (g)", 500, 100, 2000, 25),
    input("hydrationPct", "Hydration (%)", 75, 50, 120, 1),
    input("starterPct", "Starter % of flour", 20, 5, 50, 1),
    input("discardPct", "Discard % of starter", 50, 0, 100, 5)
  ],
}),
buildTool({
  slug: "bearded-dragon-tank-gradient-calculator",
  title: "Bearded Dragon Tank Gradient Calculator",
  category: SPECIALIZED_PETS_CATEGORY,
  seoH1: "Bearded Dragon Tank Temperature Gradient Calculator",
  seoDescription: "Plan basking vs cool zones for a bearded dragon enclosure.",
  focusKeyword: "bearded dragon tank temperature gradient calculator",
  formulaType: "nicheBeardedDragonGradient",
  description: "Plan basking vs cool zones for a bearded dragon enclosure.",
  formulaSummary: "Hot zone ≈ one-third of tank length between basking and cool targets.",
  realWorldExample: "48 in tank, 105 °F bask / 78 °F cool → ~16 in basking zone.",
  inputs: [
    input("tankLengthIn", "Tank length (in)", 48, 24, 72, 1),
    input("baskingTempF", "Basking temp (°F)", 105, 95, 110, 1),
    input("coolTempF", "Cool side temp (°F)", 78, 70, 85, 1)
  ],
}),
buildTool({
  slug: "planted-tank-co2-bps-calculator",
  title: "Planted Tank CO₂ BPS Calculator",
  category: SPECIALIZED_PETS_CATEGORY,
  seoH1: "Planted Aquarium CO₂ Bubbles-Per-Second Calculator",
  seoDescription: "Estimate CO₂ bubble rate from tank size and plant load.",
  focusKeyword: "planted tank co2 bubbles per second calculator",
  formulaType: "nichePlantedTankCo2",
  description: "Estimate CO₂ bubble rate from tank size and plant load.",
  formulaSummary: "BPS scales with gallons and plant mass — start low and tune.",
  realWorldExample: "40 gal medium planted → ~2–3 BPS starting point (estimate).",
  inputs: [
    input("tankGallons", "Tank volume (gal)", 40, 5, 200, 1),
    input("plantLoad", "Plant load (1=light, 3=heavy)", 2, 1, 3, 1)
  ],
}),
buildTool({
  slug: "raw-dog-food-ratio-calculator",
  title: "Raw Dog Food 80/10/5/5 Calculator",
  category: SPECIALIZED_PETS_CATEGORY,
  seoH1: "Raw Dog Food 80/10/5/5 Ratio Calculator by Weight",
  seoDescription: "Split daily raw portions into meat, bone, organ, and veg.",
  focusKeyword: "raw dog food 80 10 5 5 ratio calculator by weight",
  formulaType: "nicheRawDogFoodRatio",
  description: "Split daily raw portions into meat, bone, organ, and veg.",
  formulaSummary: "Daily oz ≈ 2× bodyweight lb; split 80/10/5/5.",
  realWorldExample: "50 lb dog → ~100 oz/day split into BARF ratios (estimate).",
  inputs: [
    input("dogWeightLbs", "Dog weight (lb)", 50, 5, 150, 1)
  ],
}),
buildTool({
  slug: "horse-hay-winter-calculator",
  title: "Horse Hay Winter Supply Calculator",
  category: SPECIALIZED_PETS_CATEGORY,
  seoH1: "How Many Bales of Hay per Horse for Winter? Calculator",
  seoDescription: "Estimate winter hay bales from horses, daily intake, and season length.",
  focusKeyword: "how many bales of hay per horse for winter calculator",
  formulaType: "nicheHorseHayWinter",
  description: "Estimate winter hay bales from horses, daily intake, and season length.",
  formulaSummary: "Total lb = horses × lb/day × days; bales = total ÷ bale weight.",
  realWorldExample: "2 horses, 25 lb/day, 120 days, 50 lb bales → ~120 bales.",
  inputs: [
    input("horseCount", "Number of horses", 2, 1, 20, 1),
    input("lbsPerHorsePerDay", "Hay per horse (lb/day)", 25, 15, 35, 1),
    input("winterDays", "Winter days", 120, 30, 200, 1),
    input("baleWeightLbs", "Bale weight (lb)", 50, 30, 80, 5)
  ],
}),
buildTool({
  slug: "chicken-coop-nesting-calculator",
  title: "Chicken Coop Nesting Box Calculator",
  category: SPECIALIZED_PETS_CATEGORY,
  seoH1: "Chicken Coop Nesting Boxes & Space per Bird Calculator",
  seoDescription: "Size nesting boxes and coop floor space for a flock.",
  focusKeyword: "how many nesting boxes per chicken space calculator",
  formulaType: "nicheChickenCoopNesting",
  description: "Size nesting boxes and coop floor space for a flock.",
  formulaSummary: "Boxes = hens ÷ hens/box; floor = hens × sq ft/hen.",
  realWorldExample: "12 hens, 4 hens/box, 3 sq ft/hen → 3 boxes, 36 sq ft.",
  inputs: [
    input("henCount", "Number of hens", 12, 1, 100, 1),
    input("hensPerBox", "Hens per nesting box", 4, 3, 5, 1),
    input("sqFtPerHen", "Coop sq ft per hen", 3, 2, 5, 0.5)
  ],
}),
buildTool({
  slug: "axolotl-chiller-size-calculator",
  title: "Axolotl Aquarium Chiller Size Calculator",
  category: SPECIALIZED_PETS_CATEGORY,
  seoH1: "Aquarium Chiller Size Calculator for Axolotl Tanks",
  seoDescription: "Estimate chiller BTU load for axolotl tank temperature control.",
  focusKeyword: "aquarium chiller size calculator for axolotl tank gallons",
  formulaType: "nicheAxolotlChiller",
  description: "Estimate chiller BTU load for axolotl tank temperature control.",
  formulaSummary: "BTU load scales with gallons and ambient-to-target delta.",
  realWorldExample: "40 gal tank, 78 °F ambient → 60 °F target (estimate sizing).",
  inputs: [
    input("tankGallons", "Tank volume (gal)", 40, 10, 120, 1),
    input("ambientTempF", "Room temp (°F)", 78, 65, 90, 1),
    input("targetTempF", "Target water (°F)", 60, 55, 68, 1)
  ],
}),
buildTool({
  slug: "koi-pond-pump-gph-calculator",
  title: "Koi Pond Pump GPH Calculator",
  category: SPECIALIZED_PETS_CATEGORY,
  seoH1: "Koi Pond Pump GPH Flow Rate Calculator (Turnover)",
  seoDescription: "Size pond pump GPH from volume and desired turnover hours.",
  focusKeyword: "koi pond water pump gph flow rate calculator turnover",
  formulaType: "nicheKoiPondPumpGph",
  description: "Size pond pump GPH from volume and desired turnover hours.",
  formulaSummary: "GPH = pond gallons ÷ turnover hours.",
  realWorldExample: "5,000 gal pond, 2 hr turnover → 2,500 GPH pump target.",
  inputs: [
    input("pondGallons", "Pond volume (gal)", 5000, 500, 50000, 100),
    input("turnoverHours", "Turnover time (hr)", 2, 1, 6, 0.5)
  ],
}),
buildTool({
  slug: "guinea-pig-vitamin-c-calculator",
  title: "Guinea Pig Vitamin C Dosage Calculator",
  category: SPECIALIZED_PETS_CATEGORY,
  seoH1: "Guinea Pig Daily Vitamin C Dosage Calculator (mg)",
  seoDescription: "Estimate daily vitamin C mg from guinea pig body weight.",
  focusKeyword: "guinea pig daily liquid vitamin c dosage calculator mg",
  formulaType: "nicheGuineaPigVitaminC",
  description: "Estimate daily vitamin C mg from guinea pig body weight.",
  formulaSummary: "Daily mg = weight kg × mg/kg dose (often 10–30 mg/kg).",
  realWorldExample: "900 g guinea pig at 20 mg/kg → ~18 mg/day (estimate).",
  inputs: [
    input("weightGrams", "Body weight (g)", 900, 300, 1500, 25),
    input("mgPerKg", "Dose (mg/kg)", 20, 10, 50, 1)
  ],
}),
buildTool({
  slug: "dubia-roach-breeding-roi-calculator",
  title: "Dubia Roach Breeding ROI Calculator",
  category: SPECIALIZED_PETS_CATEGORY,
  seoH1: "Dubia Roach Breeding Colony Cost & ROI Calculator",
  seoDescription: "Model dubia colony startup, monthly cost, and sales ROI.",
  focusKeyword: "dubia roach breeding colony cost and roi calculator",
  formulaType: "nicheDubiaRoachRoi",
  description: "Model dubia colony startup, monthly cost, and sales ROI.",
  formulaSummary: "Monthly profit = sales − costs; payback = startup ÷ profit.",
  realWorldExample: "$400 startup, $80/mo cost, 500 roaches/mo @ $0.15 → ROI timeline.",
  inputs: [
    input("startupCost", "Startup cost ($)", 400, 50, 2000, 25),
    input("monthlyCost", "Monthly cost ($)", 80, 10, 500, 5),
    input("roachesSoldPerMonth", "Roaches sold / mo", 500, 50, 5000, 25),
    input("pricePerRoach", "Price per roach ($)", 0.15, 0.05, 0.5, 0.01)
  ],
}),
buildTool({
  slug: "monthly-cat-litter-cost-calculator",
  title: "Monthly Cat Litter Cost Calculator",
  category: SPECIALIZED_PETS_CATEGORY,
  seoH1: "Monthly Cat Litter Cost per Cat Calculator",
  seoDescription: "Budget monthly litter spend by cat count and bag price.",
  focusKeyword: "monthly cat litter cost per cat calculator clumping",
  formulaType: "nicheMonthlyCatLitterCost",
  description: "Budget monthly litter spend by cat count and bag price.",
  formulaSummary: "Monthly = cats × bags/mo × bag price.",
  realWorldExample: "2 cats, 2 bags/mo, $18/bag → $72/mo litter spend.",
  inputs: [
    input("cats", "Number of cats", 2, 1, 8, 1),
    input("bagsPerMonth", "Bags per month", 2, 1, 8, 1),
    input("bagPrice", "Price per bag ($)", 18, 5, 40, 1)
  ],
}),
buildTool({
  slug: "tattoo-artist-profit-calculator",
  title: "Tattoo Artist Profit Calculator",
  category: GIG_ECONOMY_CATEGORY,
  seoH1: "Tattoo Artist Piece Rate vs Hourly Profit Calculator",
  seoDescription: "Compare piece-rate profit vs hourly target for tattoo work.",
  focusKeyword: "tattoo artist piece rate vs hourly profit calculator",
  formulaType: "nicheTattooArtistProfit",
  description: "Compare piece-rate profit vs hourly target for tattoo work.",
  formulaSummary: "Effective $/hr = piece price ÷ hours; profit = price − supplies.",
  realWorldExample: "$400 piece, 3 hr, $40 supplies → ~$120/hr effective (estimate).",
  inputs: [
    input("piecePrice", "Piece price ($)", 400, 100, 2000, 25),
    input("hours", "Hours on piece", 3, 0.5, 12, 0.25),
    input("suppliesCost", "Supplies ($)", 40, 0, 200, 5),
    input("hourlyTarget", "Hourly target ($)", 150, 50, 300, 5)
  ],
}),
buildTool({
  slug: "twitch-subscriber-revenue-calculator",
  title: "Twitch Subscriber Revenue Calculator",
  category: GIG_ECONOMY_CATEGORY,
  seoH1: "Twitch Tier 1/2/3 Subscriber Monthly Revenue Calculator",
  seoDescription: "Estimate monthly Twitch sub revenue by tier and partner split.",
  focusKeyword: "twitch tier 1 2 3 subscriber monthly revenue calculator",
  formulaType: "nicheTwitchSubRevenue",
  description: "Estimate monthly Twitch sub revenue by tier and partner split.",
  formulaSummary: "Revenue = tier price × count × partner split % per tier.",
  realWorldExample: "100 Tier 1 subs at 50% split → ~$250/mo (estimate, excl. taxes).",
  inputs: [
    input("tier1Count", "Tier 1 subs", 100, 0, 5000, 1),
    input("tier2Count", "Tier 2 subs", 10, 0, 500, 1),
    input("tier3Count", "Tier 3 subs", 2, 0, 100, 1),
    input("partnerSplitPct", "Creator split (%)", 50, 50, 70, 1)
  ],
}),
buildTool({
  slug: "etsy-dimensional-weight-shipping-calculator",
  title: "Etsy Dimensional Weight Shipping Calculator",
  category: GIG_ECONOMY_CATEGORY,
  seoH1: "Etsy Dimensional Weight Shipping Cost Calculator (USPS)",
  seoDescription: "Compare actual vs dimensional weight for Etsy parcel shipping.",
  focusKeyword: "etsy dimensional weight shipping cost calculator usps",
  formulaType: "nicheEtsyDimensionalWeight",
  description: "Compare actual vs dimensional weight for Etsy parcel shipping.",
  formulaSummary: "Dim weight = L×W×H÷139; billable = max(actual, dim).",
  realWorldExample: "12×10×8 in, 2 lb actual → dim weight may bill higher (estimate).",
  inputs: [
    input("lengthIn", "Length (in)", 12, 4, 48, 0.5),
    input("widthIn", "Width (in)", 10, 4, 48, 0.5),
    input("heightIn", "Height (in)", 8, 2, 48, 0.5),
    input("actualWeightLb", "Actual weight (lb)", 2, 0.1, 70, 0.1),
    input("ratePerLb", "Rate ($/lb)", 0.75, 0.25, 5, 0.05)
  ],
}),
buildTool({
  slug: "food-truck-propane-calculator",
  title: "Food Truck Propane & Generator Calculator",
  category: GIG_ECONOMY_CATEGORY,
  seoH1: "Food Truck Generator & Propane Usage Calculator per Event",
  seoDescription: "Estimate propane gallons for generator runtime at an event.",
  focusKeyword: "food truck generator and propane usage calculator per event",
  formulaType: "nicheFoodTruckPropane",
  description: "Estimate propane gallons for generator runtime at an event.",
  formulaSummary: "Propane gal ≈ (BTU/hr × hours) ÷ 91,000.",
  realWorldExample: "10,000 BTU/hr generator, 6 hr event → ~0.66 gal propane.",
  inputs: [
    input("generatorBtuh", "Generator BTU/hr", 10000, 2000, 50000, 500),
    input("eventHours", "Event hours", 6, 1, 14, 0.5)
  ],
}),
buildTool({
  slug: "dji-drone-battery-cost-calculator",
  title: "DJI Drone Battery Cost per Flight Calculator",
  category: GIG_ECONOMY_CATEGORY,
  seoH1: "DJI Drone Battery Cycle Life & Cost per Flight Calculator",
  seoDescription: "Amortize drone battery cost over rated cycle life.",
  focusKeyword: "dji drone battery cycle life cost per flight calculator",
  formulaType: "nicheDjiDroneBatteryCost",
  description: "Amortize drone battery cost over rated cycle life.",
  formulaSummary: "Cost/flight = battery price ÷ cycle life.",
  realWorldExample: "$120 battery, 300 cycles → $0.40 per flight (estimate).",
  inputs: [
    input("batteryCost", "Battery cost ($)", 120, 50, 300, 5),
    input("cycleLife", "Rated cycles", 300, 100, 800, 25)
  ],
}),
buildTool({
  slug: "mobile-detailing-water-tank-calculator",
  title: "Mobile Detailing Water Tank Calculator",
  category: GIG_ECONOMY_CATEGORY,
  seoH1: "Mobile Detailing Water Tank Size Calculator (Gallons)",
  seoDescription: "Size on-truck water tank for daily car count and gallons per car.",
  focusKeyword: "mobile detailing water tank size capacity calculator gallons",
  formulaType: "nicheMobileDetailingWater",
  description: "Size on-truck water tank for daily car count and gallons per car.",
  formulaSummary: "Tank = cars/day × gal/car × buffer %.",
  realWorldExample: "6 cars/day, 8 gal/car, 20% buffer → ~58 gal tank.",
  inputs: [
    input("carsPerDay", "Cars per day", 6, 1, 20, 1),
    input("gallonsPerCar", "Gallons per car", 8, 3, 20, 0.5),
    input("bufferPct", "Buffer (%)", 20, 0, 50, 5)
  ],
}),
buildTool({
  slug: "vending-machine-roi-calculator",
  title: "Vending Machine ROI Calculator",
  category: GIG_ECONOMY_CATEGORY,
  seoH1: "Vending Machine Profit Margin & Restock Calculator",
  seoDescription: "Model vending machine payback from sales, restock, and fees.",
  focusKeyword: "vending machine profit margin and restock calculator monthly",
  formulaType: "nicheVendingMachineRoi",
  description: "Model vending machine payback from sales, restock, and fees.",
  formulaSummary: "Profit = sales − restock − location fee; payback = cost ÷ profit.",
  realWorldExample: "$3,500 machine, $900/mo sales, $400 costs → payback timeline.",
  inputs: [
    input("machineCost", "Machine cost ($)", 3500, 500, 10000, 100),
    input("monthlySales", "Monthly sales ($)", 900, 100, 5000, 25),
    input("restockCost", "Restock cost ($/mo)", 250, 50, 2000, 25),
    input("locationFee", "Location fee ($/mo)", 150, 0, 1000, 25)
  ],
}),
buildTool({
  slug: "creator-platform-fee-calculator",
  title: "Creator Platform Fee Comparison Calculator",
  category: GIG_ECONOMY_CATEGORY,
  seoH1: "Patreon vs OnlyFans vs Ko-fi Platform Fee Comparison Calculator",
  seoDescription: "See creator net after platform fee percentage.",
  focusKeyword: "patreon vs onlyfans vs ko-fi platform fee comparison calculator",
  formulaType: "nicheCreatorPlatformFee",
  description: "See creator net after platform fee percentage.",
  formulaSummary: "Net = gross × (1 − fee%).",
  realWorldExample: "$1,000 gross at 20% platform fee → $800 net (estimate).",
  inputs: [
    input("grossRevenue", "Gross revenue ($)", 1000, 50, 50000, 50),
    input("platformFeePct", "Platform fee (%)", 20, 0, 30, 0.5)
  ],
}),
buildTool({
  slug: "4k-video-upload-time-calculator",
  title: "4K Video File Size & Upload Time Calculator",
  category: GIG_ECONOMY_CATEGORY,
  seoH1: "4K Video File Size & Upload Time Calculator by Bitrate",
  seoDescription: "Estimate 4K export file size and upload duration from bitrate.",
  focusKeyword: "4k video file size and upload time calculator bitrate",
  formulaType: "nicheVideo4kUpload",
  description: "Estimate 4K export file size and upload duration from bitrate.",
  formulaSummary: "Size MB = duration × bitrate ÷ 8; upload from Mbps.",
  realWorldExample: "10 min 4K @ 50 Mbps → ~3.7 GB; upload time from your Mbps.",
  inputs: [
    input("durationMin", "Duration (min)", 10, 1, 120, 1),
    input("bitrateMbps", "Bitrate (Mbps)", 50, 10, 200, 5),
    input("uploadSpeedMbps", "Upload speed (Mbps)", 25, 1, 1000, 5)
  ],
}),
buildTool({
  slug: "house-sitting-rate-calculator",
  title: "Overnight House Sitting Rate Calculator",
  category: GIG_ECONOMY_CATEGORY,
  seoH1: "Overnight House Sitting & Pet Care Rate Calculator",
  seoDescription: "Price multi-night house sitting with pet and extra fees.",
  focusKeyword: "overnight house sitting and pet care rate calculator per night",
  formulaType: "nicheHouseSittingRate",
  description: "Price multi-night house sitting with pet and extra fees.",
  formulaSummary: "Total = nights × nightly rate + pet fee + extras.",
  realWorldExample: "5 nights @ $75 + $50 pet fee → $425 trip total.",
  inputs: [
    input("nights", "Nights", 5, 1, 30, 1),
    input("nightlyRate", "Nightly rate ($)", 75, 25, 250, 5),
    input("petFee", "Pet care fee ($)", 50, 0, 200, 5),
    input("extras", "Other fees ($)", 0, 0, 200, 5)
  ],
}),
buildTool({
  slug: "hydroponic-ppm-ec-calculator",
  title: "Hydroponic PPM/EC Mix Calculator",
  category: HOMESTEADING_CATEGORY,
  seoH1: "Hydroponic Nutrient Mixing PPM & EC Calculator",
  seoDescription: "Calculate nutrient ml to hit target PPM in a reservoir.",
  focusKeyword: "hydroponic nutrient mixing ppm and ec calculator reservoir gallons",
  formulaType: "nicheHydroponicPpmEc",
  description: "Calculate nutrient ml to hit target PPM in a reservoir.",
  formulaSummary: "ml to add ≈ (target − current) × gallons ÷ concentrate factor.",
  realWorldExample: "50 gal reservoir, 600→900 PPM target (estimate ml add).",
  inputs: [
    input("reservoirGal", "Reservoir (gal)", 50, 1, 500, 1),
    input("currentPpm", "Current PPM", 600, 0, 2000, 10),
    input("targetPpm", "Target PPM", 900, 100, 2500, 10),
    input("concentratePpmPerMl", "Concentrate strength (PPM per mL)", 50, 10, 200, 5)
  ],
}),
buildTool({
  slug: "mels-mix-calculator",
  title: "Mel's Mix Raised Bed Volume Calculator",
  category: HOMESTEADING_CATEGORY,
  seoH1: "Mel's Mix Square Foot Garden Soil Volume Calculator",
  seoDescription: "Compute Mel's Mix volume in thirds for raised beds.",
  focusKeyword: "mels mix square foot gardening soil volume calculator cubic feet",
  formulaType: "nicheMelsMixVolume",
  description: "Compute Mel's Mix volume in thirds for raised beds.",
  formulaSummary: "Total cu ft = L×W×depth; each third = total ÷ 3.",
  realWorldExample: "4×8 ft bed, 6 in deep → 16 cu ft → ~5.3 cu ft each component.",
  inputs: [
    input("bedLengthFt", "Bed length (ft)", 8, 2, 24, 0.5),
    input("bedWidthFt", "Bed width (ft)", 4, 2, 8, 0.5),
    input("depthIn", "Depth (in)", 6, 4, 24, 1)
  ],
}),
buildTool({
  slug: "microgreens-seed-density-calculator",
  title: "Microgreens 10×20 Tray Seed Density Calculator",
  category: HOMESTEADING_CATEGORY,
  seoH1: "10×20 Tray Microgreens Seed Density Calculator (Grams)",
  seoDescription: "Plan seed grams per 1020 tray and total for multiple trays.",
  focusKeyword: "10x20 tray microgreens seed density calculator grams",
  formulaType: "nicheMicrogreensSeedDensity",
  description: "Plan seed grams per 1020 tray and total for multiple trays.",
  formulaSummary: "Total seed = grams/tray × tray count.",
  realWorldExample: "Broccoli microgreens ~25 g/tray × 10 trays → 250 g seed.",
  inputs: [
    input("gramsPerTray", "Seed per tray (g)", 25, 10, 80, 1),
    input("trayCount", "Number of trays", 10, 1, 100, 1)
  ],
}),
buildTool({
  slug: "vanlife-solar-battery-calculator",
  title: "Vanlife Solar & Battery Calculator",
  category: HOMESTEADING_CATEGORY,
  seoH1: "Van Build Solar Panel & Lithium Battery Size Calculator",
  seoDescription: "Size solar watts and Ah battery bank from daily Wh load.",
  focusKeyword: "van build solar panel and lithium battery size calculator ah",
  formulaType: "nicheVanlifeSolarBattery",
  description: "Size solar watts and Ah battery bank from daily Wh load.",
  formulaSummary: "Panel W ≈ Wh ÷ sun hours; Ah ≈ Wh ÷ (12V × efficiency).",
  realWorldExample: "2,400 Wh/day, 5 sun hours → ~480 W solar, ~235 Ah @ 12V (est.).",
  inputs: [
    input("dailyWh", "Daily load (Wh)", 2400, 500, 10000, 100),
    input("peakSunHours", "Peak sun hours", 5, 2, 8, 0.5)
  ],
}),
buildTool({
  slug: "firewood-cord-btu-calculator",
  title: "Firewood Cord BTU Calculator",
  category: HOMESTEADING_CATEGORY,
  seoH1: "Firewood Cord BTU Heat Output Calculator by Wood Type",
  seoDescription: "Compare BTU output by cord for softwood vs hardwood types.",
  focusKeyword: "firewood cord btu heat output per wood type calculator",
  formulaType: "nicheFirewoodCordBtu",
  description: "Compare BTU output by cord for softwood vs hardwood types.",
  formulaSummary: "Total BTU = BTU/cord × number of cords (by wood class).",
  realWorldExample: "2 cords oak-class hardwood → ~50M BTU (estimate).",
  inputs: [
    input("woodType", "Wood type (1=hard, 2=mixed, 3=soft)", 1, 1, 3, 1),
    input("cords", "Cords", 2, 0.5, 20, 0.5)
  ],
}),
buildTool({
  slug: "poultry-fence-calculator",
  title: "Poultry Netting & T-Post Fence Calculator",
  category: HOMESTEADING_CATEGORY,
  seoH1: "Poultry Netting & T-Post Fence Material Calculator",
  seoDescription: "Estimate T-posts and netting rolls for poultry perimeter.",
  focusKeyword: "poultry netting and t-post fence material calculator length",
  formulaType: "nichePoultryFence",
  description: "Estimate T-posts and netting rolls for poultry perimeter.",
  formulaSummary: "Posts = perimeter ÷ spacing + 1; rolls from perimeter length.",
  realWorldExample: "200 ft perimeter, 8 ft post spacing → ~26 posts (estimate).",
  inputs: [
    input("perimeterFt", "Fence perimeter (ft)", 200, 50, 2000, 10),
    input("postSpacingFt", "Post spacing (ft)", 8, 4, 12, 1),
    input("rollWidthFt", "Netting roll width (ft)", 4, 3, 6, 1)
  ],
}),
buildTool({
  slug: "grow-tent-cfm-calculator",
  title: "Grow Tent Inline Fan CFM Calculator",
  category: HOMESTEADING_CATEGORY,
  seoH1: "Grow Tent Inline Exhaust Fan CFM Size Calculator",
  seoDescription: "Size inline fan CFM from tent volume and air changes per minute.",
  focusKeyword: "inline exhaust fan cfm size calculator for grow tent cubic feet",
  formulaType: "nicheGrowTentCfm",
  description: "Size inline fan CFM from tent volume and air changes per minute.",
  formulaSummary: "CFM = tent cu ft × air changes/min.",
  realWorldExample: "4×4×7 ft tent, 1 air change/min → ~112 CFM fan target.",
  inputs: [
    input("tentLengthFt", "Tent length (ft)", 4, 2, 10, 0.5),
    input("tentWidthFt", "Tent width (ft)", 4, 2, 10, 0.5),
    input("tentHeightFt", "Tent height (ft)", 7, 5, 10, 0.5),
    input("airChangesPerMin", "Air changes/min", 1, 0.5, 2, 0.1)
  ],
}),
buildTool({
  slug: "rainwater-harvesting-calculator",
  title: "Roof Rainwater Harvesting Calculator",
  category: HOMESTEADING_CATEGORY,
  seoH1: "Roof Catchment Rainwater Harvesting Gallon Calculator",
  seoDescription: "Estimate harvested gallons from roof area and rainfall.",
  focusKeyword: "roof catchment area rainwater harvesting gallon calculator inches rainfall",
  formulaType: "nicheRainwaterHarvesting",
  description: "Estimate harvested gallons from roof area and rainfall.",
  formulaSummary: "Gal = roof sq ft × inches rain × 0.623 × efficiency.",
  realWorldExample: "1,500 sq ft roof, 1 in rain, 85% efficiency → ~795 gal.",
  inputs: [
    input("roofSqFt", "Roof catchment (sq ft)", 1500, 100, 10000, 50),
    input("rainfallIn", "Rainfall (in)", 1, 0.1, 12, 0.1),
    input("efficiencyPct", "Collection efficiency (%)", 85, 50, 100, 1)
  ],
}),
buildTool({
  slug: "compost-cn-ratio-calculator",
  title: "Hot Compost C:N Ratio Calculator",
  category: HOMESTEADING_CATEGORY,
  seoH1: "Hot Compost Carbon-to-Nitrogen (C:N) Ratio Calculator",
  seoDescription: "Balance browns and greens to target hot compost C:N ratio.",
  focusKeyword: "carbon to nitrogen ratio calculator for hot compost pile",
  formulaType: "nicheCompostCnRatio",
  description: "Balance browns and greens to target hot compost C:N ratio.",
  formulaSummary: "C:N = (brown parts × C) ÷ (green parts × N); aim ~25–35.",
  realWorldExample: "3 parts leaves + 1 part food scraps → C:N estimate and status.",
  inputs: [
    input("brownParts", "Brown (carbon) parts", 3, 1, 20, 1),
    input("greenParts", "Green (nitrogen) parts", 1, 1, 20, 1),
    input("brownC", "Carbon value (brown)", 100, 50, 600, 10),
    input("greenN", "Nitrogen value (green)", 20, 10, 40, 1)
  ],
}),
buildTool({
  slug: "bulk-mulch-calculator",
  title: "Bulk Mulch Coverage & Cost Calculator",
  category: HOMESTEADING_CATEGORY,
  seoH1: "Bulk Mulch Cubic Yard Coverage & Cost Calculator",
  seoDescription: "Convert mulch depth and area to cubic yards and cost.",
  focusKeyword: "bulk mulch cubic yard coverage and cost calculator depth inches",
  formulaType: "nicheBulkMulch",
  description: "Convert mulch depth and area to cubic yards and cost.",
  formulaSummary: "Cu yd = area × depth ÷ 324; cost = cu yd × $/yd.",
  realWorldExample: "800 sq ft, 3 in depth, $35/yd → ~2.5 yd and ~$88.",
  inputs: [
    input("areaSqFt", "Area (sq ft)", 800, 50, 10000, 25),
    input("depthIn", "Depth (in)", 3, 1, 6, 0.5),
    input("costPerCuYd", "Cost ($/cu yd)", 35, 15, 80, 1)
  ],
}),
buildTool({
  slug: "wedding-cake-tier-serving-calculator",
  title: "Wilton Wedding Cake Tier Serving Calculator",
  category: NICHE_EVENTS_CATEGORY,
  seoH1: "Wilton Method Wedding Cake Tier Serving Size Calculator",
  seoDescription: "Estimate wedding cake servings using Wilton tier counts.",
  focusKeyword: "wilton method wedding cake tier serving size calculator",
  formulaType: "nicheWeddingCakeTiers",
  description: "Estimate wedding cake servings using Wilton tier counts.",
  formulaSummary: "Servings sum Wilton-style counts for 6/8/10/12 in tiers.",
  realWorldExample: "6+8+10 in tiers (1 each) → ~74 servings (estimate).",
  inputs: [
    input("tier6In", "6 inch tiers", 0, 0, 4, 1),
    input("tier8In", "8 inch tiers", 1, 0, 4, 1),
    input("tier10In", "10 inch tiers", 1, 0, 4, 1),
    input("tier12In", "12 inch tiers", 0, 0, 4, 1)
  ],
}),
buildTool({
  slug: "open-bar-alcohol-calculator",
  title: "DIY Wedding Open Bar Alcohol Calculator",
  category: NICHE_EVENTS_CATEGORY,
  seoH1: "DIY Wedding Open Bar Alcohol Purchasing Calculator",
  seoDescription: "Estimate bottles needed for a DIY open bar by guest count.",
  focusKeyword: "diy wedding open bar alcohol purchasing calculator per guest",
  formulaType: "nicheOpenBarAlcohol",
  description: "Estimate bottles needed for a DIY open bar by guest count.",
  formulaSummary: "Drinks = guests × hours × drinks/hr; bottles ≈ drinks ÷ 5.",
  realWorldExample: "120 guests, 4 hr, 1.5 drinks/hr → ~144 drinks (~29 bottles).",
  inputs: [
    input("guests", "Guests", 120, 20, 500, 5),
    input("hours", "Event hours", 4, 2, 8, 0.5),
    input("drinksPerGuestHour", "Drinks/guest/hr", 1.5, 0.5, 3, 0.1)
  ],
}),
buildTool({
  slug: "charcuterie-per-person-calculator",
  title: "Charcuterie Board per Person Calculator",
  category: NICHE_EVENTS_CATEGORY,
  seoH1: "Charcuterie Board Meat & Cheese per Person Calculator",
  seoDescription: "Scale meat and cheese ounces for charcuterie boards.",
  focusKeyword: "charcuterie board meat and cheese per person calculator ounces",
  formulaType: "nicheCharcuteriePerPerson",
  description: "Scale meat and cheese ounces for charcuterie boards.",
  formulaSummary: "Total oz = guests × (meat oz + cheese oz per guest).",
  realWorldExample: "25 guests, 2 oz meat + 2 oz cheese → 100 oz total (~6.25 lb).",
  inputs: [
    input("guests", "Guests", 25, 5, 200, 1),
    input("meatOzPerGuest", "Meat (oz/guest)", 2, 1, 4, 0.25),
    input("cheeseOzPerGuest", "Cheese (oz/guest)", 2, 1, 4, 0.25)
  ],
}),
buildTool({
  slug: "dnd-xp-budget-calculator",
  title: "D&D 5e Encounter XP Budget Calculator",
  category: NICHE_EVENTS_CATEGORY,
  seoH1: "D&D 5e Encounter XP Budget Calculator by Party Level",
  seoDescription: "Compute 5e encounter XP budget by level, party size, and difficulty.",
  focusKeyword: "dnd 5e encounter xp budget calculator by party level",
  formulaType: "nicheDndXpBudget",
  description: "Compute 5e encounter XP budget by level, party size, and difficulty.",
  formulaSummary: "Budget = per-character XP threshold × difficulty × party size.",
  realWorldExample: "Level 5 party of 4, hard encounter → XP budget from 5e tables.",
  inputs: [
    input("partyLevel", "Party level", 5, 1, 20, 1),
    input("partySize", "Party size", 4, 1, 8, 1),
    input("difficulty", "Difficulty (1=easy…4=deadly)", 3, 1, 4, 1)
  ],
}),
buildTool({
  slug: "ttrpg-prep-time-calculator",
  title: "TTRPG One-Shot Prep Time Calculator",
  category: NICHE_EVENTS_CATEGORY,
  seoH1: "TTRPG One-Shot Session Prep Time Budget Calculator",
  seoDescription: "Estimate GM prep hours for a one-shot by length and complexity.",
  focusKeyword: "ttrpg one shot session prep time budget calculator",
  formulaType: "nicheTtrpgPrepTime",
  description: "Estimate GM prep hours for a one-shot by length and complexity.",
  formulaSummary: "Prep min ≈ session hr × 30 × complexity × player factor.",
  realWorldExample: "4 hr one-shot, 5 players, medium complexity → ~2.5 hr prep (est.).",
  inputs: [
    input("sessionHours", "Session length (hr)", 4, 2, 8, 0.5),
    input("playerCount", "Players", 5, 1, 8, 1),
    input("complexity", "Complexity (1–3)", 2, 1, 3, 1)
  ],
}),
buildTool({
  slug: "homebrew-priming-sugar-calculator",
  title: "Homebrew Priming Sugar Calculator",
  category: NICHE_EVENTS_CATEGORY,
  seoH1: "Homebrew Priming Sugar Calculator by Beer Style & Volume",
  seoDescription: "Calculate corn sugar oz to bottle-carbonate homebrew.",
  focusKeyword: "homebrew priming sugar calculator volumes co2 beer style",
  formulaType: "nicheHomebrewPrimingSugar",
  description: "Calculate corn sugar oz to bottle-carbonate homebrew.",
  formulaSummary: "Sugar oz from volume, target CO₂ volumes, and beer temp.",
  realWorldExample: "5 gal ale at 2.4 vol CO₂ → ~4–5 oz corn sugar (estimate).",
  inputs: [
    input("beerVolumeGal", "Beer volume (gal)", 5, 1, 15, 0.5),
    input("co2Volumes", "Target CO₂ volumes", 2.4, 1.5, 3.5, 0.1),
    input("beerTempF", "Beer temp (°F)", 65, 32, 80, 1)
  ],
}),
buildTool({
  slug: "telescope-fov-calculator",
  title: "Astrophotography Telescope FOV Calculator",
  category: NICHE_EVENTS_CATEGORY,
  seoH1: "Astrophotography Telescope Field of View & Pixel Scale Calculator",
  seoDescription: "Compute telescope field of view and pixel scale for imaging.",
  focusKeyword: "astrophotography telescope field of view pixel scale calculator",
  formulaType: "nicheTelescopeFov",
  description: "Compute telescope field of view and pixel scale for imaging.",
  formulaSummary: "FOV arcmin = 3438 × sensor width ÷ focal length.",
  realWorldExample: "600 mm scope, 23 mm sensor → ~2.3° FOV (estimate).",
  inputs: [
    input("focalLengthMm", "Focal length (mm)", 600, 100, 3000, 10),
    input("sensorWidthMm", "Sensor width (mm)", 23, 10, 44, 0.5),
    input("pixelSizeUm", "Pixel size (µm)", 4, 2, 10, 0.1)
  ],
}),
buildTool({
  slug: "rc-gear-ratio-calculator",
  title: "RC Car Pinion Spur Gear Ratio Calculator",
  category: NICHE_EVENTS_CATEGORY,
  seoH1: "RC Car Pinion & Spur Gear Ratio Top Speed Calculator",
  seoDescription: "Estimate RC gear ratio and top speed from pinion/spur and tire.",
  focusKeyword: "rc car pinion spur gear ratio top speed calculator mph",
  formulaType: "nicheRcGearRatio",
  description: "Estimate RC gear ratio and top speed from pinion/spur and tire.",
  formulaSummary: "Ratio = spur ÷ pinion; speed from RPM and tire circumference.",
  realWorldExample: "16T pinion, 48T spur, 3500 KV, 2S → ratio 3.0 and speed est.",
  inputs: [
    input("pinionTeeth", "Pinion teeth", 16, 8, 30, 1),
    input("spurTeeth", "Spur teeth", 48, 30, 90, 1),
    input("motorKv", "Motor KV", 3500, 1000, 6000, 50),
    input("batteryVoltage", "Battery voltage (V)", 7.4, 3.7, 22, 0.1),
    input("tireDiameterIn", "Tire diameter (in)", 4, 2, 8, 0.1)
  ],
}),
buildTool({
  slug: "acid-dye-yarn-calculator",
  title: "Acid Dye Depth-of-Shade Calculator",
  category: NICHE_EVENTS_CATEGORY,
  seoH1: "Acid Dye Depth-of-Shade Calculator by Yarn Weight",
  seoDescription: "Calculate acid dye grams from yarn weight and depth of shade.",
  focusKeyword: "acid dye powder depth of shade yarn weight calculator percent",
  formulaType: "nicheAcidDyeYarn",
  description: "Calculate acid dye grams from yarn weight and depth of shade.",
  formulaSummary: "Dye g = yarn g × (DOS % ÷ 100).",
  realWorldExample: "100 g yarn at 1.5% DOS → 1.5 g dye powder (estimate).",
  inputs: [
    input("yarnWeightGrams", "Yarn weight (g)", 100, 25, 2000, 25),
    input("dosPct", "Depth of shade (%)", 1.5, 0.5, 4, 0.1)
  ],
}),
buildTool({
  slug: "coffee-roast-weight-loss-calculator",
  title: "Home Coffee Roast Weight Loss Calculator",
  category: NICHE_EVENTS_CATEGORY,
  seoH1: "Home Coffee Roasting Bean Weight Loss % Calculator",
  seoDescription: "Compute roasted weight from green coffee and roast loss %.",
  focusKeyword: "home coffee roasting bean weight loss percentage calculator",
  formulaType: "nicheCoffeeRoastWeightLoss",
  description: "Compute roasted weight from green coffee and roast loss %.",
  formulaSummary: "Roasted = green × (1 − loss%).",
  realWorldExample: "454 g green at 17% loss → ~377 g roasted (estimate).",
  inputs: [
    input("greenWeightGrams", "Green coffee (g)", 454, 100, 5000, 25),
    input("roastLossPct", "Weight loss (%)", 17, 10, 25, 0.5)
  ],
})
];

export const NICHE50_READY_TOOLS = NICHE50_TOOLS.filter((t) => t.ready !== false);
export const NICHE50_SLUGS = new Set(NICHE50_TOOLS.map((t) => t.slug));

export function getNiche50ToolBySlug(slug: string): Calculator | undefined {
  return NICHE50_TOOLS.find((tool) => tool.slug === slug);
}

// Generated 50 tools
