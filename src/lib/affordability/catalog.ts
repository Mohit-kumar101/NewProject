/**
 * Affordability pSEO catalog — loads `data/affordability.config.json`.
 *
 * READY: 6 pages (1 per category hub).
 * TODO: expand taxonomyTodos → full page configs with presets, then ready: true.
 */

import configData from "../../../data/affordability.config.json";
import {
  formulaTypeFromMode,
} from "@/lib/formulas_affordability";
import type { Calculator, CalculatorInput } from "@/lib/types";
import type {
  AffordabilityCategoryConfig,
  AffordabilityCategoryId,
  AffordabilityConfigFile,
  AffordabilityPageConfig,
  AffordabilityTodoItem,
} from "./types";

const config = configData as unknown as AffordabilityConfigFile;

export const AFFORDABILITY_CATEGORIES: AffordabilityCategoryConfig[] =
  config.categories;

export const AFFORDABILITY_CATEGORY_IDS = AFFORDABILITY_CATEGORIES.map(
  (c) => c.id
) as AffordabilityCategoryId[];

export const AFFORDABILITY_CATEGORY_NAMES = AFFORDABILITY_CATEGORIES.map(
  (c) => c.name
);

export function getAffordabilityCategory(
  idOrSlug: string
): AffordabilityCategoryConfig | undefined {
  return AFFORDABILITY_CATEGORIES.find(
    (c) => c.id === idOrSlug || c.slug === idOrSlug
  );
}

export function getAffordabilityPages(
  opts?: { readyOnly?: boolean }
): AffordabilityPageConfig[] {
  const pages = config.pages;
  if (opts?.readyOnly) return pages.filter((p) => p.ready !== false);
  return pages;
}

export function getAffordabilityPage(
  category: string,
  slug: string
): AffordabilityPageConfig | undefined {
  return config.pages.find(
    (p) => p.slug === slug && p.category === category && p.ready !== false
  );
}

export function getAffordabilityPageBySlug(
  slug: string
): AffordabilityPageConfig | undefined {
  return config.pages.find((p) => p.slug === slug && p.ready !== false);
}

export function getAffordabilityTodos(
  category?: AffordabilityCategoryId
): AffordabilityTodoItem[] {
  if (category) return config.taxonomyTodos[category] ?? [];
  return Object.values(config.taxonomyTodos).flat();
}

export function getAffordabilityHref(
  page: Pick<AffordabilityPageConfig, "category" | "slug">
): string {
  return `/affordability/${page.category}/${page.slug}`;
}

export function getAffordabilityCategoryHref(
  category: AffordabilityCategoryId | string
): string {
  return `/affordability/${category}`;
}

function toCalculatorInput(
  page: AffordabilityPageConfig,
  def: AffordabilityPageConfig["inputs"][number]
): CalculatorInput {
  const fromPreset = page.presets[def.id];
  return {
    id: def.id,
    label: def.label,
    defaultValue:
      def.defaultValue ??
      (Number.isFinite(fromPreset) ? fromPreset : 0),
    min: def.min,
    max: def.max,
    step: def.step,
    inputType: def.inputType,
  };
}

/** Map a ready affordability page into the shared Calculator registry shape. */
export function affordabilityPageToCalculator(
  page: AffordabilityPageConfig
): Calculator {
  const categoryMeta = getAffordabilityCategory(page.category);
  return {
    slug: page.slug,
    title: page.title,
    category: categoryMeta?.name ?? page.category,
    description: page.description,
    inputs: page.inputs.map((input) => toCalculatorInput(page, input)),
    formulaType: formulaTypeFromMode(page.engineMode),
    seoTitle: page.seoTitle,
    seoDescription: page.metaDescription,
    seoH1: page.h1,
    seoKeywords: [
      page.intentQuestion,
      page.title,
      "can I afford",
      "affordability calculator",
      "free online",
    ],
    formulaSummary: `Affordability Engine mode “${page.engineMode}” with rule set “${page.ruleSet}”.`,
    realWorldExample: page.seoContent.intro,
    seoContent: page.seoContent,
    ready: page.ready,
  };
}

export function affordabilityPagesAsCalculators(
  opts?: { readyOnly?: boolean }
): Calculator[] {
  return getAffordabilityPages(opts).map(affordabilityPageToCalculator);
}

export const AFFORDABILITY_READY_TOOLS: Calculator[] =
  affordabilityPagesAsCalculators({ readyOnly: true });

export function generateAffordabilityStaticParams(): Array<{
  category: string;
  slug: string;
}> {
  return getAffordabilityPages({ readyOnly: true }).map((p) => ({
    category: p.category,
    slug: p.slug,
  }));
}
