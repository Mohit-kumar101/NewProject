/**
 * Tech & engineering calculator pack — 50 tools across 5 categories.
 * Routes: /tools/{category-slug}/{tool-slug}
 */

import type { Calculator, CalculatorInput, LongTailModifier } from "@/lib/types";
import { TECH_PACK_SPECS } from "@/lib/hubs/techPackData";
import {
  CLOUD_AI_CATEGORY,
  DIGITAL_SEO_CATEGORY,
  ELECTRONICS_HW_CATEGORY,
  NETWORKING_IT_CATEGORY,
  SOFTWARE_DEV_CATEGORY,
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
  spec: (typeof TECH_PACK_SPECS)[number]
): Calculator {
  const inputs: CalculatorInput[] = spec.inputs.map(
    ([id, label, defaultValue, min, max, step]) => ({
      id,
      label,
      defaultValue,
      min,
      max,
      step,
    })
  );

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
    inputs,
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
      intro: `${spec.description} Planning estimates only — verify with production tools and vendor pricing where applicable.`,
      howToUse: [
        "Enter your values in the input sliders.",
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

export const TECH_NICHE_TOOLS: Calculator[] = TECH_PACK_SPECS.map(buildFromSpec);

export const TECH_NICHE_READY_TOOLS = TECH_NICHE_TOOLS;
export const TECH_NICHE_SLUGS = new Set(TECH_NICHE_TOOLS.map((t) => t.slug));

export const TECH_NICHE_CATEGORIES = [
  NETWORKING_IT_CATEGORY,
  SOFTWARE_DEV_CATEGORY,
  CLOUD_AI_CATEGORY,
  ELECTRONICS_HW_CATEGORY,
  DIGITAL_SEO_CATEGORY,
] as const;

export function getTechNicheToolBySlug(slug: string): Calculator | undefined {
  return TECH_NICHE_TOOLS.find((tool) => tool.slug === slug);
}
