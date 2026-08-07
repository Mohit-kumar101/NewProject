export interface CalculatorInput {
  id: string;
  label: string;
  defaultValue: number;
  min: number;
  max: number;
  step: number;
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