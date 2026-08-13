export const PSEO_CATEGORIES = [
  "HR & Ops",
  "BC Local Taxes",
  "Specialized Business",
] as const;

export type PseoCategory = (typeof PSEO_CATEGORIES)[number];

export type PseoFaq = {
  question: string;
  answer: string;
};

export type PseoSchemaData = {
  applicationCategory:
    | "BusinessApplication"
    | "FinanceApplication"
    | "UtilitiesApplication";
  faqs: PseoFaq[];
};

export type PseoTool = {
  id: string;
  slug: string;
  targetKeyword: string;
  seoTitle: string;
  metaDescription: string;
  h1: string;
  category: PseoCategory;
  schemaData: PseoSchemaData;
  whatIsIt: string;
  formula: string;
  realWorldExample: string;
  whyItMatters: string;
  ready: boolean;
};
