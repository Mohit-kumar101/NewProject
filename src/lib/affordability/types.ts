/**
 * Types for the Affordability pSEO matrix (`data/affordability.config.json`).
 */

import type {
  AffordabilityMode,
  AffordabilityRuleSet,
} from "@/lib/formulas_affordability";

export type AffordabilityCategoryId =
  | "vehicle-auto"
  | "housing-rent"
  | "life-events-family"
  | "tech-electronics"
  | "lifestyle-spending"
  | "financial-freedom";

export type AffordabilityFaq = {
  question: string;
  answer: string;
};

export type AffordabilityPresets = Record<string, number>;

export type AffordabilityInputDef = {
  id: string;
  label: string;
  min: number;
  max: number;
  step: number;
  /** When omitted, value comes from presets[id] or 0. */
  defaultValue?: number;
  inputType?: "number" | "checkbox";
};

export type AffordabilityPageConfig = {
  slug: string;
  category: AffordabilityCategoryId;
  ready: boolean;
  title: string;
  seoTitle: string;
  metaDescription: string;
  h1: string;
  /** Exact search-intent question featured in FAQ / schema. */
  intentQuestion: string;
  description: string;
  engineMode: AffordabilityMode;
  ruleSet: AffordabilityRuleSet;
  /** Default values injected into the Affordability Engine on load. */
  presets: AffordabilityPresets;
  inputs: AffordabilityInputDef[];
  seoContent: {
    intro: string;
    howToUse: string[];
    faqs: AffordabilityFaq[];
  };
};

export type AffordabilityCategoryConfig = {
  id: AffordabilityCategoryId;
  slug: AffordabilityCategoryId;
  name: string;
  description: string;
  defaultRuleSet: AffordabilityRuleSet;
};

export type AffordabilityTodoItem = {
  slug: string;
  label: string;
  status: "TODO";
};

export type AffordabilityConfigFile = {
  /** Optional docs for maintainers — ignored by the runtime catalog. */
  _meta?: {
    description?: string;
    routePattern?: string;
  };
  categories: AffordabilityCategoryConfig[];
  /** Phase-1 ready pages (1 per category). */
  pages: AffordabilityPageConfig[];
  /**
   * Remaining taxonomy slugs — do not route until ready:true configs exist.
   * TODO: expand each list into full page configs with presets.
   */
  taxonomyTodos: Record<AffordabilityCategoryId, AffordabilityTodoItem[]>;
};
