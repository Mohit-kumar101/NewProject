/**
 * Skilled-trades niche pack — 61 tools across 7 categories.
 * Routes: /tools/{category-slug}/{tool-slug}
 */

import type { Calculator, CalculatorInput, LongTailModifier } from "@/lib/types";
import {
  UNIQUE_SEO_CONTEXT,
  uniqueFaqs,
  uniqueHowToUse,
} from "@/lib/uniqueToolCopy";
import { TRADES_PACK_SPECS } from "@/lib/hubs/tradesPackData";
import {
  CONSTRUCTION_TRADES_CATEGORY,
  ELECTRICAL_TRADES_CATEGORY,
  HVAC_TRADES_CATEGORY,
  LANDSCAPING_TRADES_CATEGORY,
  MASONRY_TRADES_CATEGORY,
  PLUMBING_TRADES_CATEGORY,
  ROOFING_TRADES_CATEGORY,
} from "@/lib/categoryPaths";

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

function buildFromSpec(
  spec: (typeof TRADES_PACK_SPECS)[number]
): Calculator {
  const inputs: CalculatorInput[] = spec.inputs.map(([id, label, defaultValue, min, max, step]) => ({
    id,
    label,
    defaultValue,
    min,
    max,
    step,
  }));

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
    seoKeywords: [spec.focusKeyword, spec.title],
    inputs,
    formulaSummary: spec.formulaSummary,
    realWorldExample: spec.realWorldExample,
    seoContextTemplate: UNIQUE_SEO_CONTEXT,
    explanationTemplate:
      "{{variantExplanation}} {{formulaSummary}} Example: {{example}}",
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
      intro: `${spec.description} Planning estimates only — verify measurements and local codes on site.`,
      howToUse: uniqueHowToUse({
        inputLabels: inputs.map((input) => input.label),
        formulaSummary: spec.formulaSummary,
        example: spec.realWorldExample,
        domain: "trade",
      }),
      faqs: uniqueFaqs({
        title: spec.title,
        formulaSummary: spec.formulaSummary,
        example: spec.realWorldExample,
        domain: "trade",
      }),
    },
  };
}

export const TRADES_NICHE_TOOLS: Calculator[] = TRADES_PACK_SPECS.map(buildFromSpec);

export const TRADES_NICHE_READY_TOOLS = TRADES_NICHE_TOOLS;
export const TRADES_NICHE_SLUGS = new Set(TRADES_NICHE_TOOLS.map((t) => t.slug));

export const TRADES_NICHE_CATEGORIES = [
  HVAC_TRADES_CATEGORY,
  PLUMBING_TRADES_CATEGORY,
  ELECTRICAL_TRADES_CATEGORY,
  ROOFING_TRADES_CATEGORY,
  CONSTRUCTION_TRADES_CATEGORY,
  LANDSCAPING_TRADES_CATEGORY,
  MASONRY_TRADES_CATEGORY,
] as const;

export function getTradesNicheToolBySlug(slug: string): Calculator | undefined {
  return TRADES_NICHE_TOOLS.find((tool) => tool.slug === slug);
}
