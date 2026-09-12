import type { Metadata } from "next";
import type { Calculator, LongTailModifier } from "@/lib/types";
import { SITE_NAME, SITE_URL } from "@/lib/calculators";
import {
  DEFAULT_OG_IMAGE,
  META_DESCRIPTION_MAX,
  META_TITLE_MAX,
  clampMetaText,
  clampTitleSegment,
} from "@/lib/pageMetadata";
import { CRYPTO_CATEGORY, CRYPTO_SHORT_SLUGS, getToolHref, getToolModifierHref } from "@/lib/cryptoFormulas";
import {
  SEO_CONTENT_YEAR,
  getKeywordSearchTerms,
  resolveKeywordPack,
  preferredLongTail,
  type KeywordVariation,
} from "@/lib/keywords";
import {
  buildVariantExplanation,
  interpolateTemplate,
} from "@/lib/expansion/tools";
import { categoryToSlug } from "@/lib/categoryPaths";

/** Short crypto path for a tools slug, if registered. */
function cryptoPublicPath(toolSlug: string): string | null {
  const entry = Object.entries(CRYPTO_SHORT_SLUGS).find(
    ([, full]) => full === toolSlug
  );
  return entry ? `/crypto/${entry[0]}` : null;
}

export function isFileConverter(calculator: Calculator): boolean {
  return calculator.category.includes("Converter");
}

export function usesCalculatorTitleSuffix(calculator: Calculator): boolean {
  if (isFileConverter(calculator)) return false;
  if (/tracker|generator|extractor/i.test(calculator.slug)) return false;
  return true;
}

/** Human metric name, e.g. "Car Loan Payoff" from "Car Loan Payoff Calculator". */
export function getToolMetricName(calculator: Calculator): string {
  const stripped = calculator.title
    .replace(
      /\s*(Calculator|Converter|Tracker|Generator|Extractor|Wizard|Studio)\s*$/i,
      ""
    )
    .replace(/\s*Online$/i, "")
    .replace(/^Free\s+/i, "")
    .trim();
  return stripped || calculator.title;
}

/**
 * Curated long-tail H1s (question / role-specific).
 * Kept for on-page SEO; meta <title> uses the shorter getToolMetaTitle().
 */
const LONG_TAIL_H1: Record<string, string> = {
  "when-can-i-retire": "When Can I Retire?",
  "how-long-will-my-money-last": "How Long Will My Money Last?",
  "how-rich-will-i-be-at-40": "How Rich Will I Be at 40?",
  "what-will-my-net-worth-be-at-50": "What Will My Net Worth Be at 50?",
  "when-will-i-become-a-millionaire": "When Will I Become a Millionaire?",
  "how-much-money-do-i-need-to-retire": "How Much Money Do I Need to Retire?",
  "what-age-can-i-stop-working": "What Age Can I Stop Working?",
  "how-much-will-i-have-saved-at-60": "How Much Will I Have Saved at 60?",
  "what-will-1000-a-month-become-in-20-years":
    "What Will $1,000/Month Become in 20 Years?",
  "how-much-time-do-i-have-left-to-retire":
    "How Much Time Do I Have Left to Retire?",
  "how-many-days-have-i-been-alive": "How Many Days Have I Been Alive?",
  "days-until-i-turn-30-40-50": "How Many Days Until I Turn 30, 40, or 50?",
  "weekends-left-until-80": "How Many Weekends Do I Have Left Until 80?",
  "hours-spent-sleeping": "How Many Hours Have I Spent Sleeping?",
  "how-much-of-my-life-have-i-spent-working":
    "How Much of My Life Have I Spent Working?",
  "phone-time-in-a-lifetime": "How Much Time Do I Spend on My Phone in a Lifetime?",
  "days-spent-commuting": "How Many Days Do I Spend Commuting?",
  "years-spent-working": "How Many Years Do I Spend Working?",
  "how-much-of-my-life-is-left": "How Much of My Life Is Left?",
  "percentage-of-life-lived": "What Percentage of My Life Have I Lived?",
  "if-i-invested-100-every-month":
    "What Would I Be Worth If I Invested $100 Every Month?",
  "money-worth-in-10-years": "What Would My Money Be Worth in 10 Years?",
  "money-lost-to-inflation": "How Much Money Am I Losing to Inflation?",
  "lifestyle-cost-per-year": "How Much Does My Lifestyle Cost Me Per Year?",
  "how-much-does-my-car-really-cost": "How Much Does My Car Really Cost Me?",
  "coffee-spend-in-a-lifetime": "How Much Do I Spend on Coffee in a Lifetime?",
  "if-i-stop-spending-10-a-day": "What Happens If I Stop Spending $10 a Day?",
  "if-i-started-investing-10-years-ago":
    "How Much Would I Have If I Started Investing 10 Years Ago?",
  "how-long-to-save-first-100k": "How Long Until I Save My First $100K?",
  "what-salary-to-become-a-millionaire":
    "What Salary Do I Need to Become a Millionaire?",
  "how-long-have-i-known-my-partner": "How Long Have I Known My Partner?",
  "days-we-have-been-together": "How Many Days Have We Been Together?",
  "percentage-of-life-together":
    "What Percentage of My Life Have We Been Together?",
  "days-until-1000th-day-together": "How Long Until Our 1,000th Day Together?",
  "memories-we-have-created-together":
    "How Many Memories Have We Probably Created Together?",
  "scientific-calculator":
    "How to Solve Trig and Log Problems on a Scientific Calculator",
  "compound-interest-calculator":
    "How to Calculate Compound Interest with Monthly Contributions",
  "ai-nutrition-calorie-calculator":
    "How to Calculate TDEE and Macro Targets from BMR",
  "expense-tracker": "How to Track Personal Expenses Without Signing Up",
  "car-loan-payoff-calculator":
    "How Extra Payments Change a Car Loan Payoff Date",
  "personal-loan-calculator":
    "How to Calculate Personal Loan Payments Before You Borrow",
  "json-csv-converter": "How to Convert JSON to CSV Without Uploading a File",
  "heic-jpg-converter": "How to Convert iPhone HEIC Photos to JPG Without Uploading",
  "pdf-merge-split": "How to Merge PDFs Without an Account",
  "home-affordability-calculator": "How Much House Can I Afford?",
  "mp4-mp3-converter": "How to Extract MP3 Audio from an MP4 in Your Browser",
  "pdf-text-converter": "How to Extract Text from a PDF Without Uploading",
  "crypto-profit-calculator":
    "How to Calculate Crypto Profit After Trading Fees",
  "crypto-dca-calculator":
    "How to Calculate Dollar-Cost Averaging Returns on Crypto",
  "crypto-market-cap-calculator":
    "How to Calculate Token Market Cap from Price and Supply",
  "crypto-fdv-calculator":
    "How to Calculate Fully Diluted Valuation from Max Supply",
  "crypto-token-price-calculator":
    "How to Back Into Token Price from a Target Market Cap",
  "crypto-tokenomics-calculator":
    "How to Model Token Vesting and Circulating Supply",
  "crypto-liquidity-calculator":
    "How to Calculate DEX Pool Share with Constant Product",
  "crypto-staking-calculator":
    "How to Estimate Staking Yield Before You Lock Tokens",
  "crypto-roi-calculator":
    "How to Calculate Crypto ROI Including Fees and Hold Time",
  "crypto-token-launch-cost-calculator":
    "How to Budget a Token Launch Including Gas and Liquidity",
  "bc-used-vehicle-private-sale-pst-calculator":
    "BC Used Car Private Sale PST Calculator (Black Book Value)",
  "bulk-cut-macro-planner":
    "How to Calculate Macros for Lean Bulk and Cutting",
  "financial-freedom-property-planner":
    "How to Calculate FIRE with Rental Property and Side Income",
  "salary-ctc-in-hand-calculator":
    "How to Calculate In-Hand Salary from CTC in India",
  "reverse-diet-planner":
    "How to Reverse Diet with Adaptive Weekly Calorie Bumps",
  "emergency-fund-runway-planner":
    "How to Calculate Emergency Fund Runway After a Job Loss",
  "multi-goal-savings-planner":
    "How to Prioritize Multiple Savings Goals Faster",
  "body-recomposition-planner":
    "How to Calculate Recomp Macros by Training Volume",
  "freelance-true-rate-planner":
    "How to Calculate Freelance Rates After Platform Fees",
  "wedding-budget-cashflow-planner":
    "How to Plan Wedding Deposits Without Cash Crunches",
  "baby-first-year-cost-planner":
    "How to Budget a Baby’s First Year Through Parental Leave",
  "subscription-runway-audit":
    "How Pausing Subscriptions Extends Emergency Runway",
  "keep-lease-buy-car-tco":
    "How to Compare Keep vs Lease vs Buy Car Costs by Year",
};

const LONG_TAIL_DESCRIPTIONS: Record<string, string> = {
  "scientific-calculator":
    "Solve trig, logs, and exponents with deg/rad modes. Free online tool, no sign up, instant calculation.",
  "compound-interest-calculator":
    "Project growth with monthly deposits and compounding. Free, instant, no email required.",
  "ai-nutrition-calorie-calculator":
    "Estimate BMR, TDEE, and macros from age, weight, and activity. Free online tool, no sign up.",
  "expense-tracker":
    "Log income and spending privately in your browser. Free online tool, no sign up required.",
  "car-loan-payoff-calculator":
    "See how extra payments cut auto-loan interest and months left. Free, instant, no email required.",
  "personal-loan-calculator":
    "Estimate monthly payments and total interest before you apply. Free online tool, no sign up.",
  "json-csv-converter":
    "Convert JSON to CSV (and back) on-device. Free online tool, no sign up, instant conversion.",
  "heic-jpg-converter":
    "Turn iPhone HEIC photos into JPG in your browser. Free online tool, no sign up, nothing uploaded.",
  "pdf-merge-split":
    "Merge or split PDFs privately in your browser. Free online tool, no sign up, instant result.",
  "mp4-mp3-converter":
    "Extract MP3 from MP4 in your browser. Free online tool, no sign up, instant conversion.",
  "pdf-text-converter":
    "Extract PDF text or wrap text as PDF on-device. Free online tool, no sign up required.",
  "crypto-profit-calculator":
    "Get net P&L and ROI after buy/sell fees. Free online tool, no sign up, instant calculation.",
  "crypto-dca-calculator":
    "Model DCA returns from periodic buys. Free, instant, no email required.",
  "crypto-fdv-calculator":
    "Compute FDV from price and max supply. Free online tool, no sign up required.",
  "crypto-tokenomics-calculator":
    "Project vesting unlocks and circulating supply. Free, instant, no email required.",
  "crypto-staking-calculator":
    "Estimate compounding staking rewards before you lock. Free online tool, no sign up.",
  "crypto-token-launch-cost-calculator":
    "Budget gas, liquidity, and launch fees for a token. Free, instant, no email required.",
  "bc-used-vehicle-private-sale-pst-calculator":
    "Calculate BC private-sale used-car PST from Black Book vs price. Free, instant, no email required.",
  "bulk-cut-macro-planner":
    "Lean bulk and cutting macro calculator from TDEE and training experience. Free online tool, no sign up.",
  "financial-freedom-property-planner":
    "FIRE calculator with rental property, side income, and net worth milestones. Free, instant, no email required.",
  "salary-ctc-in-hand-calculator":
    "India CTC to in-hand salary with HRA, PF, and new vs old tax regime. Free online tool, no sign up.",
  "reverse-diet-planner":
    "Reverse diet planner with adaptive calorie bumps when weight still drops. Free online tool, no sign up.",
  "emergency-fund-runway-planner":
    "Emergency fund runway with job-loss and life-shock scenarios. Free, instant, no email required.",
  "multi-goal-savings-planner":
    "Multi-goal savings optimizer: sequential vs split funding. Free online tool, no sign up.",
  "body-recomposition-planner":
    "Recomp macros with training-volume deficit caps. Free online tool, no sign up.",
  "freelance-true-rate-planner":
    "Freelance rate after fees with reverse invoice waterfall. Free, instant, no email required.",
  "wedding-budget-cashflow-planner":
    "Wedding budget with deposit cashflow calendar. Free online tool, no sign up.",
  "baby-first-year-cost-planner":
    "Baby first-year costs with parental leave bridge. Free, instant, no email required.",
  "subscription-runway-audit":
    "Subscription audit that shows emergency runway gained. Free online tool, no sign up.",
  "keep-lease-buy-car-tco":
    "Keep vs lease vs buy car TCO matrix by year. Free online tool, no sign up.",
};

function asQuestionHeading(phrase: string): string {
  return phrase
    .split(/\s+/)
    .map((word, index) => {
      if (index > 0 && /^(a|an|the|and|or|of|for|to|with|from|in|on|vs)$/i.test(word)) {
        return word.toLowerCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

function defaultLongTailH1(calculator: Calculator): string {
  const pack = resolveKeywordPack(calculator);
  const tail = preferredLongTail(pack);
  if (tail) return asQuestionHeading(tail);
  const metric = getToolMetricName(calculator);
  if (isFileConverter(calculator)) {
    return `How to Convert ${metric} Without Uploading`;
  }
  if (/tracker/i.test(calculator.slug)) {
    return `How to Track ${metric} in Your Browser`;
  }
  return `How to Calculate ${metric}`;
}

/**
 * Unique title segment (≤45 chars) so `<title>` with `| CalculioHub` stays under 60.
 */
export function getToolMetaTitle(
  calculator: Calculator,
  variation?: KeywordVariation
): string {
  const pack = resolveKeywordPack(calculator);
  const metric = getToolMetricName(calculator);

  if (variation?.focus) {
    return clampTitleSegment(asQuestionHeading(variation.focus));
  }

  const tail = preferredLongTail(pack);
  if (tail) {
    const heading = asQuestionHeading(tail);
    if (heading.length <= 45) return clampTitleSegment(heading);
  }

  const benefit = pack.benefit.replace(/^Free\s+/i, "").trim();
  const withBenefit = `${metric}: ${benefit}`;
  if (withBenefit.length <= 45) {
    return clampTitleSegment(withBenefit);
  }

  return clampTitleSegment(metric);
}

/** @deprecated Prefer getToolMetaTitle for <title>; kept for callers expecting a page label. */
export function getToolPageTitle(calculator: Calculator): string {
  return getToolMetaTitle(calculator);
}

/** Visible H1 — long-tail for on-page SEO; may exceed 60 chars. */
export function getToolPageH1(calculator: Calculator): string {
  if (calculator.seoH1) return calculator.seoH1;
  return (
    LONG_TAIL_H1[calculator.slug] ||
    (calculator.seoTitle
      ? calculator.seoTitle
          .replace(/\s*\((?:Free|free)[^)]*\)\s*$/g, "")
          .replace(/^Free\s+/i, "")
          .trim()
      : defaultLongTailH1(calculator))
  );
}

export function getHowToHeading(calculator: Calculator): string {
  const metric = getToolMetricName(calculator);
  if (isFileConverter(calculator)) {
    return `How to Convert ${metric} Step-by-Step`;
  }
  if (/tracker/i.test(calculator.slug)) {
    return `How to Track ${metric} Step-by-Step`;
  }
  return `How to Calculate ${metric} Step-by-Step`;
}

export function getFormulaHeading(calculator: Calculator): string {
  return `${getToolMetricName(calculator)} Formula & Practical Example`;
}

export function getFaqHeading(): string {
  return "Frequently Asked Questions";
}

function stripUtilityBoilerplate(text: string): string {
  return text
    .replace(/\s*Built for searches like [“"'].+?[”"'][^.]*\.?/gi, "")
    .replace(/\s*Free online tool, no sign up\.?/gi, "")
    .replace(/\s*Free, instant, no email required\.?/gi, "")
    .replace(/\s*Updated for 20\d{2}\.?/gi, "")
    .replace(/\s*Instant results—no sign up\.?/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

function defaultDescription(calculator: Calculator): string {
  const metric = getToolMetricName(calculator);
  const pack = resolveKeywordPack(calculator);
  if (isFileConverter(calculator)) {
    return `Convert ${metric} in your browser. Files stay on this device.`;
  }
  if (pack.benefit) {
    return `${pack.benefit}. Adjust the inputs below to calculate ${metric.toLowerCase()}.`;
  }
  return `Calculate ${metric} from the inputs below and check the formula against a worked example.`;
}

/** Meta description, 155 characters max — unique per tool, no cloned modifiers. */
export function getToolPageDescription(
  calculator: Calculator,
  variation?: KeywordVariation
): string {
  if (variation) {
    return clampMetaText(
      stripUtilityBoilerplate(variation.intro || variation.benefit),
      META_DESCRIPTION_MAX
    );
  }

  const curated = LONG_TAIL_DESCRIPTIONS[calculator.slug];
  const source =
    curated ||
    calculator.seoDescription ||
    calculator.seoContent.intro ||
    defaultDescription(calculator);
  return clampMetaText(stripUtilityBoilerplate(source), META_DESCRIPTION_MAX);
}

export function getToolPageKeywords(
  calculator: Calculator,
  variation?: KeywordVariation
): string[] {
  const pack = resolveKeywordPack(calculator);
  const metric = getToolMetricName(calculator);
  const override = calculator.seoKeywords;
  const packTerms = getKeywordSearchTerms(pack, variation).slice(0, 6);
  const longTail = isFileConverter(calculator)
    ? [
        `how to convert ${metric.toLowerCase()}`,
        `convert ${metric.toLowerCase()} free`,
        `${metric.toLowerCase()} no sign up`,
      ]
    : [
        `how to calculate ${metric.toLowerCase()}`,
        `${metric.toLowerCase()} formula`,
        `${metric.toLowerCase()} step-by-step example`,
      ];

  const extras = [
    SITE_NAME,
    calculator.category,
    ...packTerms,
    ...longTail,
  ];

  if (override?.length) {
    return [...override, ...extras];
  }

  return [calculator.title, getToolPageH1(calculator), ...extras];
}

export function getToolCanonicalUrl(calculator: Calculator): string {
  if (calculator.category === CRYPTO_CATEGORY) {
    const cryptoPath = cryptoPublicPath(calculator.slug);
    if (cryptoPath) return `${SITE_URL}${cryptoPath}`;
  }
  if (calculator.useCategoryPath) {
    return `${SITE_URL}${getToolHref(calculator.slug)}`;
  }
  return `${SITE_URL}/tools/${calculator.slug}`;
}

export function getPracticalExample(calculator: Calculator): string {
  const inputs = calculator.inputs.slice(0, 3);
  if (inputs.length === 0) {
    return "Use the defaults, then adjust one input at a time to see the result update instantly—no sign up.";
  }
  const bits = inputs.map((input) => {
    const value =
      Number.isInteger(input.defaultValue) || input.step >= 1
        ? input.defaultValue.toLocaleString()
        : String(input.defaultValue);
    return `${input.label} = ${value}`;
  });
  return `Example: set ${bits.join(", ")}, then read the result.`;
}

export function getToolVariationCanonicalUrl(
  calculator: Calculator,
  variationSlug: string
): string {
  return `${SITE_URL}${getToolModifierHref(calculator.slug, variationSlug)}`;
}

/** Adapt a schema LongTailModifier into the KeywordVariation shape used by metadata helpers. */
export function longTailModifierToVariation(
  modifier: LongTailModifier
): KeywordVariation {
  return {
    slug: modifier.slug,
    focus: modifier.focusKeyword,
    benefit: modifier.benefit ?? "Instant results",
    intro: modifier.explanation,
    route: modifier.route !== false,
  };
}

export function buildModifierFaqs(
  calculator: Calculator,
  modifier?: LongTailModifier
) {
  const year = String(SEO_CONTENT_YEAR);
  const focus = modifier?.focusKeyword ?? calculator.title;
  const source = [
    ...(modifier?.faqs ?? []),
    ...calculator.seoContent.faqs,
  ];

  return source.map((faq) => ({
    question: interpolateTemplate(faq.question, {
      focusKeyword: focus,
      year,
      title: calculator.title,
    }),
    answer: interpolateTemplate(faq.answer, {
      focusKeyword: focus,
      year,
      title: calculator.title,
    }),
  }));
}

/**
 * Build unique per-tool (or long-tail variation) metadata.
 * Root layout title template appends `| CalculioHub`.
 */
export function buildToolMetadata(
  calculator: Calculator,
  variation?: KeywordVariation,
  modifier?: LongTailModifier
): Metadata {
  const resolvedVariation =
    variation ?? (modifier ? longTailModifierToVariation(modifier) : undefined);
  const pageTitle = getToolMetaTitle(calculator, resolvedVariation);
  const absoluteTitle = clampMetaText(
    `${pageTitle} | ${SITE_NAME}`,
    META_TITLE_MAX
  );
  const description = modifier
    ? clampMetaText(
        stripUtilityBoilerplate(buildVariantExplanation(calculator, modifier)),
        META_DESCRIPTION_MAX
      )
    : getToolPageDescription(calculator, resolvedVariation);
  // Thin long-tail / modifier URLs stay reachable for users but should not
  // compete as indexed duplicates — canonical points at the primary tool page.
  const isThinDerivative = Boolean(variation || modifier);
  const url = getToolCanonicalUrl(calculator);
  const image = {
    ...DEFAULT_OG_IMAGE,
    alt: `${calculator.title} on ${SITE_NAME}`,
  };
  const modifierKeywords = modifier
    ? [modifier.focusKeyword, categoryToSlug(calculator.category)]
    : [];

  return {
    title: pageTitle,
    description,
    keywords: [
      ...getToolPageKeywords(calculator, resolvedVariation),
      ...modifierKeywords,
    ],
    alternates: { canonical: url },
    openGraph: {
      title: absoluteTitle,
      description,
      url,
      type: "website",
      siteName: SITE_NAME,
      locale: "en_US",
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: absoluteTitle,
      description,
      images: [image.url],
    },
    robots: isThinDerivative
      ? { index: false, follow: true }
      : { index: true, follow: true },
  };
}
