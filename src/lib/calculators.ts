import calculatorsData from "../../data/calculators.json";
import type { Calculator } from "./types";
import {
  DATA_CONVERTER_SLUGS,
  DOCUMENT_CONVERTER_SLUGS,
  IMAGE_CONVERTER_SLUGS,
  MEDIA_CONVERTER_SLUGS,
} from "@/lib/customToolSlugs";
import { getKeywordPack } from "@/lib/keywords";
import { EXPANSION_READY_TOOLS } from "@/lib/expansion/tools";
import { LONGTAIL_HUB_READY_TOOLS } from "@/lib/hubs/longTailPack";
import { INTENT80_READY_TOOLS } from "@/lib/hubs/intent80Pack";
import { NICHE65_READY_TOOLS } from "@/lib/hubs/niche65Pack";
import { AFFORDABILITY_READY_TOOLS } from "@/lib/affordability/catalog";
import { HEALTH_READY_TOOLS } from "@/lib/hubs/healthPack";
import {
  AFFORDABILITY_DISPLAY_CATEGORY,
  AFFORDABILITY_HUB_CATEGORIES,
  EXPANSION_CATEGORIES,
  HEALTH_DISPLAY_CATEGORY,
  HEALTH_HUB_CATEGORIES,
  INTENT80_HUB_CATEGORIES,
  LONGTAIL_HUB_CATEGORIES,
  NICHE65_HUB_CATEGORIES,
} from "@/lib/categoryPaths";
import { pseoToolsAsCalculators } from "@/lib/pseo/calculatorsData";

export const calculators: Calculator[] = [
  ...(calculatorsData as Calculator[]),
  ...pseoToolsAsCalculators(),
  ...EXPANSION_READY_TOOLS,
  ...LONGTAIL_HUB_READY_TOOLS,
  ...INTENT80_READY_TOOLS,
  ...NICHE65_READY_TOOLS,
  ...AFFORDABILITY_READY_TOOLS,
  ...HEALTH_READY_TOOLS,
];

export const CATEGORIES = [
  "Loans & Debt Management",
  "Real Estate & Housing",
  "Short-term Rental & Housing",
  "Rent & Roommate Splits",
  "Investing & Wealth Building",
  "Crypto & Digital Assets",
  "Freelance & Self-Employment",
  "Freelance & Micro-Business",
  "Shift Work & Payroll",
  "Payroll & Shift Work",
  "Everyday Utilities & Savings",
  "Living Expenses",
  "Home & Appliance Utilities",
  "Home Utilities, Appliances & Specialty Amenities",
  "Pet Care & Household Expenses",
  "Remote Work & Home Office",
  "Food & Meal Planning",
  "Food & Catering Business",
  "Events, Hospitality & Micro-Business",
  "Education, GPA & Academic",
  "Statistics, Probability & Advanced Math",
  "Legal, HR & Payroll Management",
  "HR & Ops",
  "Canadian Taxes",
  "BC Local Taxes",
  "E-commerce Fees",
  "E-Commerce, Logistics & Storage",
  "Specialized Business",
  "Local Services & Trade Pricing",
  "Automotive, Travel & Transit",
  "Commute & Vehicle Costs",
  "Media, Photography, Cooking & Lifestyle",
  AFFORDABILITY_DISPLAY_CATEGORY,
  HEALTH_DISPLAY_CATEGORY,
  "Data & Code Converters",
  "Image Converters",
  "Document Converters",
  "Audio & Video Converters",
] as const;

export {
  AFFORDABILITY_DISPLAY_CATEGORY,
  AFFORDABILITY_HUB_CATEGORIES,
  HEALTH_DISPLAY_CATEGORY,
  HEALTH_HUB_CATEGORIES,
  EXPANSION_CATEGORIES,
  LONGTAIL_HUB_CATEGORIES,
  INTENT80_HUB_CATEGORIES,
  NICHE65_HUB_CATEGORIES,
};

/** File-converter categories registered in the master directory. */
export const CONVERTER_CATEGORIES = [
  "Data & Code Converters",
  "Image Converters",
  "Document Converters",
  "Audio & Video Converters",
] as const;

export const FILE_CONVERTER_SLUGS = [
  ...DATA_CONVERTER_SLUGS,
  ...IMAGE_CONVERTER_SLUGS,
  ...DOCUMENT_CONVERTER_SLUGS,
  ...MEDIA_CONVERTER_SLUGS,
] as const;

export function isConverterCategory(category: string): boolean {
  return (CONVERTER_CATEGORIES as readonly string[]).includes(category);
}

export function getCalculatorBySlug(slug: string): Calculator | undefined {
  return calculators.find((c) => c.slug === slug);
}

export function getCalculatorsByCategory(category: string): Calculator[] {
  return calculators.filter((c) => c.category === category);
}

export function getFileConverters(): Calculator[] {
  return calculators.filter((c) => isConverterCategory(c.category));
}

/** Searchable text blob for directory / command / footer queries. */
export function getToolSearchHaystack(tool: Calculator): string {
  const keywords = tool.seoKeywords?.join(" ") ?? "";
  const metric = tool.title
    .replace(/\s*(Calculator|Converter|Tracker|Generator)\s*$/i, "")
    .trim();
  const pack = getKeywordPack(tool.slug);
  const packTerms = pack
    ? [
        pack.primary,
        ...(pack.longTails ?? []),
        ...(pack.synonyms ?? []),
        ...(pack.useCases ?? []),
      ].join(" ")
    : "";
  return [
    tool.title,
    tool.description,
    tool.category,
    tool.slug,
    tool.seoTitle ?? "",
    tool.seoH1 ?? "",
    tool.seoDescription ?? "",
    tool.seoContent?.intro ?? "",
    keywords,
    packTerms,
    tool.formulaType,
    `how to calculate ${metric}`,
    `how to convert ${metric}`,
    "free online tool",
    "no sign up",
    "instant calculation",
    "formula",
    "step-by-step example",
  ]
    .join(" ")
    .toLowerCase();
}

export function toolMatchesQuery(tool: Calculator, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const haystack = getToolSearchHaystack(tool);
  return q.split(/\s+/).every((token) => haystack.includes(token));
}

const CATALOG_BC_PST_SLUG = "bc-used-vehicle-private-sale-pst-calculator";

const BC_TAX_RIGHT_RAIL_SLUGS = [
  "property-tax-estimator",
  "payroll-tax-estimator-calculator",
  "self-employment-tax-estimator",
  "monthly-mortgage-payment-calculator",
  "bi-weekly-mortgage-payment-calculator",
  "rental-property-cash-flow-calculator",
] as const;

const DEFAULT_SPOTLIGHT_SLUGS = [
  "scientific-calculator",
  "compound-interest-calculator",
  "expense-tracker",
  "ai-nutrition-calorie-calculator",
  "pdf-text-converter",
  "mp4-mp3-converter",
  "json-csv-converter",
  "png-jpg-converter",
] as const;

export function isBcTaxCalculator(tool: Pick<Calculator, "slug" | "category">): boolean {
  return (
    tool.category === "BC Local Taxes" || tool.slug === CATALOG_BC_PST_SLUG
  );
}

function toolsBySlugs(slugs: readonly string[], excludeSlug: string): Calculator[] {
  return slugs
    .map((slug) => getCalculatorBySlug(slug))
    .filter((tool): tool is Calculator => !!tool && tool.slug !== excludeSlug);
}

/** Left-rail fillers: same category, with BC tax pages padded by the catalog PST tool. */
export function getSidebarRelatedTools(
  calculator: Calculator,
  limit = 6
): Calculator[] {
  if (isBcTaxCalculator(calculator)) {
    const seen = new Set<string>([calculator.slug]);
    const cluster: Calculator[] = [];
    const catalogPst = getCalculatorBySlug(CATALOG_BC_PST_SLUG);
    if (catalogPst && !seen.has(catalogPst.slug)) {
      seen.add(catalogPst.slug);
      cluster.push(catalogPst);
    }
    for (const tool of calculators) {
      if (tool.category !== "BC Local Taxes" || seen.has(tool.slug)) continue;
      seen.add(tool.slug);
      cluster.push(tool);
    }
    for (const extra of toolsBySlugs(BC_TAX_RIGHT_RAIL_SLUGS, calculator.slug)) {
      if (seen.has(extra.slug) || cluster.length >= limit) continue;
      seen.add(extra.slug);
      cluster.push(extra);
    }
    return cluster.slice(0, limit);
  }
  return getRelatedCalculators(calculator, limit);
}

/** Right-rail fillers until ads are live. */
export function getSidebarSpotlightTools(
  calculator: Calculator,
  limit = 5
): Calculator[] {
  if (isBcTaxCalculator(calculator)) {
    const left = new Set(
      getSidebarRelatedTools(calculator, 6).map((tool) => tool.slug)
    );
    const adjacent = toolsBySlugs(BC_TAX_RIGHT_RAIL_SLUGS, calculator.slug).filter(
      (tool) => !left.has(tool.slug)
    );
    const fallback = toolsBySlugs(DEFAULT_SPOTLIGHT_SLUGS, calculator.slug).filter(
      (tool) => !left.has(tool.slug)
    );
    return [...adjacent, ...fallback].slice(0, limit);
  }
  return toolsBySlugs(DEFAULT_SPOTLIGHT_SLUGS, calculator.slug).slice(0, limit);
}

export function getRelatedCalculators(
  calculator: Calculator,
  limit = 6
): Calculator[] {
  const stop = new Set([
    "and",
    "the",
    "for",
    "with",
    "from",
    "your",
    "calculator",
    "converter",
    "online",
    "free",
  ]);
  const keywords = [
    ...calculator.title.toLowerCase().split(/[^a-z0-9]+/),
    ...(calculator.seoKeywords ?? []).map((k) => k.toLowerCase()),
  ].filter((w) => w.length > 2 && !stop.has(w));

  const sameCategory = calculators.filter(
    (c) => c.category === calculator.category && c.slug !== calculator.slug
  );

  const scored = sameCategory
    .map((c) => {
      const haystack = getToolSearchHaystack(c);
      const score = keywords.reduce(
        (sum, word) => sum + (haystack.includes(word) ? 1 : 0),
        0
      );
      return { c, score };
    })
    .sort((a, b) => b.score - a.score || a.c.title.localeCompare(b.c.title));

  // Prefer 6 related tools; always at least 4 when available
  const target = Math.min(Math.max(limit, 4), 6);
  return scored.slice(0, target).map((s) => s.c);
}

export function searchCalculators(query: string): Calculator[] {
  const q = query.trim();
  if (!q) return calculators;
  return calculators.filter((c) => toolMatchesQuery(c, q));
}

export const SITE_URL = "https://calculiohub.com";
export const SITE_NAME = "CalculioHub";
export const SITE_SUPPORT_EMAIL = "calculiohub.support@gmail.com";
