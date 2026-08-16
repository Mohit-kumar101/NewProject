export interface CalculatorInput {
  id: string;
  label: string;
  defaultValue: number;
  min: number;
  max: number;
  step: number;
  /** Optional control type. Defaults to numeric slider. */
  inputType?: "number" | "checkbox";
}

export interface CalculatorFaq {
  question: string;
  answer: string;
}

export interface CalculatorSeoContent {
  intro: string;
  howToUse: string[];
  faqs: CalculatorFaq[];
}

/**
 * High-intent long-tail URL modifier for pSEO.
 * Generates `/tools/{categorySlug}/{toolSlug}/{modifier.slug}`.
 */
export interface LongTailModifier {
  /** URL segment, e.g. "international-sales" */
  slug: string;
  /** Search phrase injected into titles, H1, and FAQ questions */
  focusKeyword: string;
  /** Short benefit hook for meta/subtitle */
  benefit?: string;
  /**
   * Variant-specific contextual copy (rates, rules, locale notes).
   * Prefer this over stuffing the same intro on every URL.
   */
  explanation: string;
  /** Optional FAQs; `{{focusKeyword}}` and `{{year}}` are interpolated */
  faqs?: CalculatorFaq[];
  /** When false, modifier is content-only (no dedicated route). Default true. */
  route?: boolean;
}

export interface Calculator {
  slug: string;
  title: string;
  category: string;
  description: string;
  inputs: CalculatorInput[];
  formulaType: string;
  seoContent: CalculatorSeoContent;
  /** Optional SEO overrides (otherwise derived from title/description). */
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  /** Exact on-page H1 / title when a long-tail phrase is required. */
  seoH1?: string;
  /**
   * Template for below-calculator contextual copy.
   * Placeholders: {{focusKeyword}}, {{year}}, {{variantExplanation}}, {{title}}
   */
  explanationTemplate?: string;
  /**
   * pSEO contextual block (formula + real-world example) rendered below the widget.
   * Prefer this for new hub tools; falls back to explanationTemplate when absent.
   * Placeholders: {{focusKeyword}}, {{year}}, {{title}}, {{formulaSummary}}, {{example}}
   */
  seoContextTemplate?: string;
  /** Optional formula summary injected into seoContextTemplate */
  formulaSummary?: string;
  /** Optional worked example injected into seoContextTemplate */
  realWorldExample?: string;
  /** Programmatic long-tail URL + content variants for this tool */
  longTailModifiers?: LongTailModifier[];
  /**
   * When true, canonical href uses `/tools/{categorySlug}/{slug}`
   * (expansion / pSEO pack tools).
   */
  useCategoryPath?: boolean;
  /**
   * When false, tool appears in the registry/docs but is filtered from
   * public catalogs until formula work is finished. Default true.
   */
  ready?: boolean;
}

export interface CalcResultItem {
  label: string;
  value: string;
  highlight?: boolean;
}

export interface CalcResult {
  primary: CalcResultItem;
  secondary: CalcResultItem[];
  /** Optional extra glowing metrics (used by specific tools only). */
  featured?: CalcResultItem[];
  /** Optional insight callout (used by specific tools only). */
  insight?: string;
}

export interface ToolExplanationVariable {
  symbol: string;
  name: string;
  description: string;
}

export interface ToolExplanationContent {
  formula: string;
  summary: string;
  variables: ToolExplanationVariable[];
  notes?: string[];
}

export type AdviceTone = "positive" | "caution" | "warning" | "info";

export interface AdviceItem {
  tone: AdviceTone;
  badge: string;
  title: string;
  message: string;
}
