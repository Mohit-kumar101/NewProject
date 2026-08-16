/**
 * 33-tool expansion pack — category mapping + long-tail pSEO schema.
 *
 * READY (formulas implemented): paypal-fee, bc-stat-holiday-pay, markup
 * TODO: remaining formulaType handlers in src/lib/formulas.ts
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

function stubTool(partial: {
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
    inputs: [
      input("placeholder", "Value (TODO)", 100, 0, 1_000_000, 1),
    ],
    explanationTemplate: `{{variantExplanation}} This {{title}} page targets “{{focusKeyword}}” (${SEO_CONTENT_YEAR}). Formula wiring is TODO in src/lib/formulas.ts.`,
    longTailModifiers: [
      modifier(
        "overview",
        partial.focusHint,
        `Overview intent for ${partial.title}. Replace this stub explanation when the formula ships.`,
        { benefit: "Instant estimate", route: false }
      ),
    ],
    seoContent: {
      intro: `${partial.description} (Schema registered — calculation engine TODO.)`,
      howToUse: [
        "Open this tool once the formula is implemented.",
        "Enter the labeled inputs.",
        "Read the live result and FAQ for long-tail context.",
      ],
      faqs: [
        {
          question: `How do I use the ${partial.title}?`,
          answer:
            "This tool is registered in the expansion pack schema. The calculation formula is marked TODO and will return a placeholder until implemented.",
        },
      ],
    },
  };
}

/** ——— Example 1: PayPal Fee (E-commerce Fees) ——— */
const paypalFeeCalculator: Calculator = {
  slug: "paypal-fee-calculator",
  title: "PayPal Fee Calculator",
  category: "E-commerce Fees",
  description:
    "Estimate PayPal fees on domestic and international sales. See net proceeds after percentage and fixed fees.",
  formulaType: "paypalFee",
  useCategoryPath: true,
  ready: true,
  inputs: [
    input("saleAmount", "Sale Amount ($)", 100, 1, 100000, 1),
    input("percentFee", "Percentage Fee (%)", 3.49, 0, 15, 0.01),
    input("fixedFee", "Fixed Fee ($)", 0.49, 0, 5, 0.01),
    input("fxPercent", "FX / Cross-Border Extra (%)", 0, 0, 10, 0.1),
  ],
  explanationTemplate:
    "{{variantExplanation}} Use this free {{title}} for “{{focusKeyword}}” — updated for {{year}}. Adjust percentage, fixed, and FX extras to mirror your PayPal rate card.",
  longTailModifiers: [
    modifier(
      "international-sales",
      "PayPal fee calculator for international sales",
      `International / cross-border PayPal sales often stack a percentage fee, a fixed fee, and an FX or cross-border surcharge. Enter your marketplace payout in the sale field, set the published international percentage, then add any FX uplift in the extra field so net proceeds reflect conversion drag—not just the headline rate.`,
      {
        benefit: "See net after FX fees",
        faqs: [
          {
            question:
              "How do I calculate PayPal fees for international sales in {{year}}?",
            answer:
              "Enter the sale amount, your international percentage fee, the fixed fee, and any FX/cross-border uplift. Net proceeds = sale − (sale × total% / 100) − fixed fee.",
          },
          {
            question:
              "Does this PayPal fee calculator for international sales include currency conversion?",
            answer:
              "Model conversion drag with the FX / cross-border extra percentage. Confirm live PayPal rate cards for your country pair—this is a planning estimate.",
          },
        ],
      }
    ),
    modifier(
      "goods-and-services",
      "PayPal goods and services fee calculator",
      `Goods and Services (G&S) payments usually carry the standard merchant percentage plus a fixed per-transaction fee. Set FX extra to 0 for domestic G&S, then compare net proceeds against Friends & Family (which may be free but unprotected).`,
      {
        benefit: "Estimate G&S net payout",
        faqs: [
          {
            question:
              "How do I calculate PayPal Goods and Services fees in {{year}}?",
            answer:
              "Use your G&S percentage and fixed fee on the sale amount. Leave FX at 0 for domestic transactions unless PayPal shows a surcharge.",
          },
        ],
      }
    ),
  ],
  seoContent: {
    intro:
      "Know what you actually keep after PayPal takes its cut. Model percentage, fixed, and optional FX fees before you price a product or invoice.",
    howToUse: [
      "Enter the gross sale or invoice amount.",
      "Set the percentage fee from your PayPal rate card.",
      "Add the fixed per-transaction fee.",
      "For cross-border sales, include any FX / international uplift.",
      "Read fee total and net proceeds instantly.",
    ],
    faqs: [
      {
        question: "How are PayPal fees calculated?",
        answer:
          "Most merchant rates use a percentage of the transaction plus a fixed fee. International sales may add FX or cross-border percentages on top.",
      },
      {
        question: "Is this PayPal fee calculator free?",
        answer:
          "Yes. It runs in your browser with instant results and no sign up. Figures are planning estimates—not PayPal’s official quote.",
      },
    ],
  },
};

/** ——— Example 2: BC Stat Holiday Pay (BC Local Taxes) ——— */
const bcStatHolidayPayCalculator: Calculator = {
  slug: "bc-stat-holiday-pay-calculator",
  title: "BC Stat Holiday Pay Calculator",
  category: "BC Local Taxes",
  description:
    "Estimate British Columbia statutory holiday pay from average daily wages or an hourly rate and hours.",
  formulaType: "bcStatHolidayPay",
  useCategoryPath: true,
  ready: true,
  inputs: [
    input("avgDailyWage", "Average Daily Wage ($)", 220, 0, 2000, 1),
    input("hourlyRate", "Hourly Rate if Working ($)", 28, 0, 200, 0.5),
    input("hoursWorked", "Hours Worked on Stat Day", 0, 0, 24, 0.5),
    input("statPremium", "Worked-Day Premium Multiplier", 1.5, 1, 3, 0.1),
  ],
  explanationTemplate:
    "{{variantExplanation}} This {{title}} targets “{{focusKeyword}}” for {{year}}. Confirm current Employment Standards rules—outputs are planning estimates, not legal advice.",
  longTailModifiers: [
    modifier(
      "2026",
      "BC stat holiday pay calculator 2026",
      `For ${SEO_CONTENT_YEAR} planning, BC statutory holiday pay is commonly estimated from an average day's pay when the holiday is taken off. If the employee works the holiday, many workplaces also owe a premium on hours worked (often time-and-a-half) in addition to holiday pay—enter hours and the premium multiplier to model both pieces.`,
      {
        benefit: "2026 BC holiday pay estimate",
        faqs: [
          {
            question: `How do I calculate BC Stat Holiday pay in ${SEO_CONTENT_YEAR}?`,
            answer:
              "Start with average daily wage for the holiday-off amount. If working the day, add hourly rate × hours × premium multiplier. Confirm eligibility and averaging rules under BC Employment Standards.",
          },
          {
            question: `Which BC statutory holidays apply in ${SEO_CONTENT_YEAR}?`,
            answer:
              "BC observes multiple statutory holidays each year (e.g., New Year’s, Canada Day, Labour Day, Christmas). Verify the official list for the date you are paying.",
          },
        ],
      }
    ),
    modifier(
      "hourly-employees",
      "BC stat holiday pay for hourly employees",
      `Hourly employees often need an average daily wage derived from a look-back period, plus any premium if they work the holiday. Enter the averaged daily figure in Average Daily Wage, then model worked hours separately.`,
      {
        benefit: "Hourly worker holiday estimate",
      }
    ),
  ],
  seoContent: {
    intro:
      "Estimate BC statutory holiday pay whether the day is taken off or worked at a premium. Useful for payroll planning—not a substitute for Employment Standards advice.",
    howToUse: [
      "Enter average daily wage (holiday-off entitlement estimate).",
      "If working the holiday, enter hourly rate and hours.",
      "Confirm the premium multiplier your policy uses.",
      "Review holiday pay, worked premium, and total.",
    ],
    faqs: [
      {
        question: "How is BC statutory holiday pay usually estimated?",
        answer:
          "Many payroll workflows use an average day's pay for the holiday itself, and may add a premium on hours actually worked. Eligibility and averaging methods depend on Employment Standards and the employment agreement.",
      },
      {
        question: "Is this BC stat holiday calculator legal advice?",
        answer:
          "No. It is a free planning tool. Confirm figures with payroll policy and current BC rules before issuing pay.",
      },
    ],
  },
};

/** ——— Example 3: Markup Calculator (E-commerce Fees) ——— */
const markupCalculator: Calculator = {
  slug: "markup-calculator",
  title: "Markup Calculator",
  category: "E-commerce Fees",
  description:
    "Calculate selling price from cost and markup percentage. See profit per unit and implied margin.",
  formulaType: "markup",
  useCategoryPath: true,
  ready: true,
  inputs: [
    input("cost", "Product Cost ($)", 40, 0.01, 100000, 0.01),
    input("markupPercent", "Markup (%)", 50, 0, 500, 1),
  ],
  explanationTemplate:
    "{{variantExplanation}} Free {{title}} for “{{focusKeyword}}” ({{year}}). Markup is percent of cost; margin is percent of selling price—this tool shows both so you do not mix them up.",
  longTailModifiers: [
    modifier(
      "wholesale-to-retail",
      "wholesale to retail markup calculator",
      `Wholesale-to-retail pricing often applies a target markup on landed cost (product + shipping + fees). Enter your true unit cost, then the markup percent buyers expect in your category. Review implied margin so retail price still clears marketplace fees.`,
      {
        benefit: "Price retail from wholesale cost",
        faqs: [
          {
            question:
              "How do I calculate wholesale to retail markup in {{year}}?",
            answer:
              "Selling price = cost × (1 + markup%/100). Margin% = (price − cost) / price × 100. Use landed cost if freight or duties apply.",
          },
        ],
      }
    ),
    modifier(
      "vs-margin",
      "markup vs margin calculator",
      `Markup and margin are not interchangeable: 50% markup on $40 cost → $60 price (33.3% margin). Use this variant when a vendor quotes markup but your dashboard tracks margin.`,
      {
        benefit: "Convert markup to margin",
      }
    ),
  ],
  seoContent: {
    intro:
      "Turn unit cost and a markup percentage into a selling price, dollar profit, and equivalent margin—so pricing conversations stay precise.",
    howToUse: [
      "Enter your product or landed cost.",
      "Set the markup percentage you want on cost.",
      "Read selling price, profit, and implied margin.",
    ],
    faqs: [
      {
        question: "What is the difference between markup and margin?",
        answer:
          "Markup is profit divided by cost. Margin is profit divided by selling price. A 50% markup is not a 50% margin.",
      },
      {
        question: "Is this markup calculator free?",
        answer:
          "Yes. Instant results in your browser with no sign up.",
      },
    ],
  },
};

/**
 * Remaining expansion tools — schema + category mapping only.
 * TODO: implement each formulaType in src/lib/formulas.ts and set ready: true.
 */
const expansionStubs: Calculator[] = [
  // Pay / Leave → Legal, HR & Payroll Management (BC tool above is ready)
  stubTool({
    slug: "double-time-pay-calculator",
    title: "Double Time Pay Calculator",
    category: "Legal, HR & Payroll Management",
    description: "Calculate double-time earnings from hourly rate and double-time hours.",
    formulaType: "doubleTimePay", // TODO: formulas.ts
    focusHint: "double time pay calculator",
  }),
  stubTool({
    slug: "shift-differential-pay-calculator",
    title: "Shift Differential Pay Calculator",
    category: "Legal, HR & Payroll Management",
    description: "Estimate shift premium pay from base rate and differential percentage or flat add-on.",
    formulaType: "shiftDifferentialPay", // TODO: formulas.ts
    focusHint: "shift differential pay calculator",
  }),
  stubTool({
    slug: "holiday-pay-calculator",
    title: "Holiday Pay Calculator",
    category: "Legal, HR & Payroll Management",
    description: "Estimate holiday pay from average daily wages or hourly rules.",
    formulaType: "holidayPay", // TODO: formulas.ts
    focusHint: "holiday pay calculator",
  }),
  stubTool({
    slug: "vacation-pay-calculator",
    title: "Vacation Pay Calculator",
    category: "Legal, HR & Payroll Management",
    description: "Calculate vacation pay from earnings and statutory or policy percentage.",
    formulaType: "vacationPay", // TODO: formulas.ts
    focusHint: "vacation pay calculator",
  }),
  stubTool({
    slug: "sick-time-accrual-calculator",
    title: "Sick Time Accrual Calculator",
    category: "Legal, HR & Payroll Management",
    description: "Project sick-time balances from hours worked and accrual rates.",
    formulaType: "sickTimeAccrual", // TODO: formulas.ts
    focusHint: "sick time accrual calculator",
  }),

  // Canada Tax → Canadian Taxes
  stubTool({
    slug: "ei-benefits-calculator-canada",
    title: "EI Benefits Calculator Canada",
    category: "Canadian Taxes",
    description: "Estimate Employment Insurance benefit amounts from insurable earnings.",
    formulaType: "eiBenefitsCanada", // TODO: formulas.ts
    focusHint: "EI benefits calculator Canada",
  }),
  stubTool({
    slug: "cpp-contribution-calculator",
    title: "CPP Contribution Calculator",
    category: "Canadian Taxes",
    description: "Estimate Canada Pension Plan contributions from pensionable earnings.",
    formulaType: "cppContribution", // TODO: formulas.ts
    focusHint: "CPP contribution calculator",
  }),
  stubTool({
    slug: "gst-calculator-canada",
    title: "GST Calculator Canada",
    category: "Canadian Taxes",
    description: "Add or remove 5% GST from a price for Canadian sales.",
    formulaType: "gstCanada", // TODO: formulas.ts
    focusHint: "GST calculator Canada",
  }),
  stubTool({
    slug: "hst-calculator-by-province",
    title: "HST Calculator by Province",
    category: "Canadian Taxes",
    description: "Calculate Harmonized Sales Tax using province-specific combined rates.",
    formulaType: "hstByProvince", // TODO: formulas.ts
    focusHint: "HST calculator by province",
  }),

  // Commerce / Fees → E-commerce Fees (paypal + markup ready above)
  stubTool({
    slug: "margin-calculator",
    title: "Margin Calculator",
    category: "E-commerce Fees",
    description: "Calculate profit margin from cost and selling price.",
    formulaType: "profitMargin", // TODO: formulas.ts
    focusHint: "profit margin calculator",
  }),
  stubTool({
    slug: "break-even-point-calculator",
    title: "Break-Even Point Calculator",
    category: "E-commerce Fees",
    description: "Find units or revenue needed to cover fixed and variable costs.",
    formulaType: "breakEvenPoint", // TODO: formulas.ts
    focusHint: "break-even point calculator",
  }),
  stubTool({
    slug: "profit-per-product-calculator",
    title: "Profit Per Product Calculator",
    category: "E-commerce Fees",
    description: "Estimate per-unit profit after COGS and selling fees.",
    formulaType: "profitPerProduct", // TODO: formulas.ts
    focusHint: "profit per product calculator",
  }),
  stubTool({
    slug: "etsy-profit-calculator",
    title: "Etsy Profit Calculator",
    category: "E-commerce Fees",
    description: "Estimate Etsy seller profit after listing and transaction fees.",
    formulaType: "etsyProfit", // TODO: formulas.ts
    focusHint: "Etsy profit calculator",
  }),
  stubTool({
    slug: "shopify-profit-calculator",
    title: "Shopify Profit Calculator",
    category: "E-commerce Fees",
    description: "Estimate Shopify order profit after payment and app fees.",
    formulaType: "shopifyProfit", // TODO: formulas.ts
    focusHint: "Shopify profit calculator",
  }),
  stubTool({
    slug: "amazon-seller-profit-calculator",
    title: "Amazon Seller Profit Calculator",
    category: "E-commerce Fees",
    description: "Estimate Amazon FBA/FBM profit after referral and fulfillment fees.",
    formulaType: "amazonSellerProfit", // TODO: formulas.ts
    focusHint: "Amazon seller profit calculator",
  }),
  stubTool({
    slug: "ebay-fee-calculator",
    title: "eBay Fee Calculator",
    category: "E-commerce Fees",
    description: "Estimate eBay final value and insertion-style fees on a sale.",
    formulaType: "ebayFee", // TODO: formulas.ts
    focusHint: "eBay fee calculator",
  }),
  stubTool({
    slug: "stripe-fee-calculator",
    title: "Stripe Fee Calculator",
    category: "E-commerce Fees",
    description: "Estimate Stripe processing fees and net payout on a charge.",
    formulaType: "stripeFee", // TODO: formulas.ts
    focusHint: "Stripe fee calculator",
  }),

  // Income / Housing / Utilities
  stubTool({
    slug: "freelance-project-pricing-calculator",
    title: "Freelance Project Pricing Calculator",
    category: "Freelance & Self-Employment",
    description: "Price a project from hours, rate, contingency, and desired profit.",
    formulaType: "freelanceProjectPricing", // TODO: formulas.ts
    focusHint: "freelance project pricing calculator",
  }),
  stubTool({
    slug: "hourly-to-salary-calculator",
    title: "Hourly to Salary Calculator",
    category: "Freelance & Self-Employment",
    description: "Convert an hourly wage into weekly, monthly, and annual salary equivalents.",
    formulaType: "hourlyToSalary", // TODO: formulas.ts
    focusHint: "hourly to salary calculator",
  }),
  stubTool({
    slug: "room-rent-split-calculator",
    title: "Room Rent Split Calculator",
    category: "Real Estate & Housing",
    description: "Split rent and utilities fairly across roommates by room or share.",
    formulaType: "roomRentSplit", // TODO: formulas.ts
    focusHint: "room rent split calculator",
  }),
  stubTool({
    slug: "move-in-cost-calculator",
    title: "Move-In Cost Calculator",
    category: "Real Estate & Housing",
    description: "Estimate first-month rent, deposit, and move-in fees before signing.",
    formulaType: "moveInCost", // TODO: formulas.ts
    focusHint: "move-in cost calculator",
  }),
  stubTool({
    slug: "security-deposit-calculator",
    title: "Security Deposit Calculator",
    category: "Real Estate & Housing",
    description: "Estimate allowable security deposit from monthly rent and local caps.",
    formulaType: "securityDeposit", // TODO: formulas.ts
    focusHint: "security deposit calculator",
  }),
  stubTool({
    slug: "car-payment-affordability-calculator",
    title: "Car Payment Affordability Calculator",
    category: "Automotive, Travel & Transit",
    description: "Estimate an affordable car payment from income and debt guidelines.",
    formulaType: "carPaymentAffordability", // TODO: formulas.ts
    focusHint: "car payment affordability calculator",
  }),
  stubTool({
    slug: "tire-cost-per-kilometer-calculator",
    title: "Tire Cost Per Kilometer Calculator",
    category: "Automotive, Travel & Transit",
    description: "Amortize tire set cost across expected tread life in kilometers.",
    formulaType: "tireCostPerKm", // TODO: formulas.ts
    focusHint: "tire cost per kilometer calculator",
  }),
  stubTool({
    slug: "electricity-cost-calculator",
    title: "Electricity Cost Calculator",
    category: "Living Expenses",
    description: "Estimate electricity cost from kWh usage and utility rates.",
    formulaType: "electricityCost", // TODO: formulas.ts
    focusHint: "electricity cost calculator",
  }),
  stubTool({
    slug: "appliance-electricity-cost-calculator",
    title: "Appliance Electricity Cost Calculator",
    category: "Living Expenses",
    description: "Estimate what a single appliance costs to run per day, month, or year.",
    formulaType: "applianceElectricityCost", // TODO: formulas.ts
    focusHint: "appliance electricity cost calculator",
  }),
  stubTool({
    slug: "solar-panel-savings-calculator",
    title: "Solar Panel Savings Calculator",
    category: "Living Expenses",
    description: "Estimate solar savings from system size, production, and utility rates.",
    formulaType: "solarPanelSavings", // TODO: formulas.ts
    focusHint: "solar panel savings calculator",
  }),
  stubTool({
    slug: "water-usage-cost-calculator",
    title: "Water Usage Cost Calculator",
    category: "Living Expenses",
    description: "Estimate water and sewer cost from usage and local rates.",
    formulaType: "waterUsageCost", // TODO: formulas.ts
    focusHint: "water usage cost calculator",
  }),
  stubTool({
    slug: "internet-data-usage-calculator",
    title: "Internet Data Usage Calculator",
    category: "Living Expenses",
    description: "Estimate monthly data use from streaming, work, and device habits.",
    formulaType: "internetDataUsage", // TODO: formulas.ts
    focusHint: "internet data usage calculator",
  }),
  stubTool({
    slug: "download-time-calculator",
    title: "Download Time Calculator",
    category: "Living Expenses",
    description: "Estimate download time from file size and connection speed.",
    formulaType: "downloadTime", // TODO: formulas.ts
    focusHint: "download time calculator",
  }),
];

export const EXPANSION_TOOLS: Calculator[] = [
  paypalFeeCalculator,
  bcStatHolidayPayCalculator,
  markupCalculator,
  ...expansionStubs,
];

export const EXPANSION_READY_TOOLS = EXPANSION_TOOLS.filter(
  (tool) => tool.ready !== false
);

export const EXPANSION_SLUGS = new Set(EXPANSION_TOOLS.map((t) => t.slug));

export function getExpansionToolBySlug(slug: string): Calculator | undefined {
  return EXPANSION_TOOLS.find((tool) => tool.slug === slug);
}

export function interpolateTemplate(
  template: string,
  vars: Record<string, string>
): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => vars[key] ?? "");
}

export function buildVariantExplanation(
  tool: Calculator,
  modifier?: LongTailModifier
): string {
  const focusKeyword = modifier?.focusKeyword ?? tool.title;
  const variantExplanation =
    modifier?.explanation ??
    tool.seoContent.intro ??
    `Use this free ${tool.title} for instant results.`;

  const template = tool.seoContextTemplate || tool.explanationTemplate;
  if (template) {
    return interpolateTemplate(template, {
      focusKeyword,
      year: String(SEO_CONTENT_YEAR),
      variantExplanation,
      title: tool.title,
      formulaSummary: tool.formulaSummary ?? "",
      example: tool.realWorldExample ?? "",
    });
  }

  return variantExplanation;
}

export function getRoutableLongTailModifiers(
  tool: Calculator
): LongTailModifier[] {
  return (tool.longTailModifiers ?? []).filter(
    (modifier) => modifier.route !== false && Boolean(modifier.slug)
  );
}
