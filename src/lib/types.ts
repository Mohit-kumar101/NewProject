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