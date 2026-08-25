import keywordsData from "../../data/keywords.json";
import type { Calculator, CalculatorFaq } from "@/lib/types";

export const SEO_CONTENT_YEAR = 2026;

function metricName(calculator: Calculator): string {
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

function isConverterTool(calculator: Calculator): boolean {
  return calculator.category.includes("Converter");
}

export type KeywordFaq = {
  question: string;
  answer: string;
};

export type KeywordVariation = {
  /** URL segment under `/tools/[slug]/for/[variation]` */
  slug: string;
  /** Long-tail focus phrase for this landing intent */
  focus: string;
  benefit: string;
  intro: string;
  /** When true, a dedicated static route is generated */
  route?: boolean;
};

export type KeywordPack = {
  primary: string;
  benefit: string;
  synonyms: string[];
  useCases: string[];
  regions: string[];
  longTails: string[];
  features: string[];
  faqs: KeywordFaq[];
  variations?: KeywordVariation[];
};

type KeywordPackMap = Record<string, KeywordPack>;

const packs = keywordsData as KeywordPackMap;

export function getKeywordPack(slug: string): KeywordPack | undefined {
  return packs[slug];
}

export function getAllKeywordPacks(): KeywordPackMap {
  return packs;
}

/** Build a sensible pack when a tool is missing from keywords.json. */
export function buildFallbackKeywordPack(calculator: Calculator): KeywordPack {
  const metric = metricName(calculator);
  const metricLower = metric.toLowerCase();
  const converter = isConverterTool(calculator);
  const verb = converter
    ? "convert"
    : /tracker/i.test(calculator.slug)
      ? "track"
      : "calculate";

  return {
    primary: converter
      ? `${metricLower} converter free online`
      : `${metricLower} calculator free online`,
    benefit: converter ? "Convert instantly" : "Get results instantly",
    synonyms: [`${metricLower} ${converter ? "converter" : "calculator"}`],
    useCases: [
      `Run a quick ${metricLower} check before you decide`,
      `Compare scenarios by changing one input at a time`,
      `Use the formula section to verify the math`,
    ],
    regions: ["Works in modern browsers worldwide"],
    longTails: [
      `how to ${verb} ${metricLower}`,
      `${metricLower} ${converter ? "converter" : "calculator"} no sign up`,
    ],
    features: [
      "Instant results in your browser",
      "Free online tool — no sign up",
      "Clear outputs for planning decisions",
    ],
    faqs: [
      {
        question: `How do I ${verb} ${metricLower} online?`,
        answer: `Open the free ${calculator.title}, enter your inputs, and read the result instantly. No account is required.`,
      },
      {
        question: `Is the ${metricLower} ${converter ? "converter" : "calculator"} free?`,
        answer:
          "Yes. It is free to use with instant results and no sign-up wall. Outputs are for planning guidance.",
      },
    ],
  };
}

export function resolveKeywordPack(calculator: Calculator): KeywordPack {
  const raw = getKeywordPack(calculator.slug) ?? buildFallbackKeywordPack(calculator);
  return {
    primary: raw.primary,
    benefit: raw.benefit,
    synonyms: raw.synonyms ?? [],
    useCases: raw.useCases ?? [],
    regions: raw.regions ?? [],
    longTails: raw.longTails ?? [],
    features: raw.features ?? [],
    faqs: raw.faqs ?? [],
    variations: raw.variations,
  };
}

export function getRoutableVariations(
  slug: string
): Array<KeywordVariation & { route: true }> {
  const pack = getKeywordPack(slug);
  if (!pack?.variations?.length) return [];
  return pack.variations.filter(
    (variation): variation is KeywordVariation & { route: true } =>
      variation.route === true && Boolean(variation.slug)
  );
}

export function getKeywordVariation(
  slug: string,
  variationSlug: string
): KeywordVariation | undefined {
  return getRoutableVariations(slug).find((item) => item.slug === variationSlug);
}

/** Dedupe FAQs by normalized question; calculator FAQs win on conflicts. */
export function mergeToolFaqs(
  calculator: Calculator,
  pack: KeywordPack,
  variation?: KeywordVariation
): CalculatorFaq[] {
  const focused: CalculatorFaq[] = variation
    ? [
        {
          question: `What does “${variation.focus}” mean on this page?`,
          answer: `${variation.intro} The calculator below is free, updates instantly, and does not require an account.`,
        },
      ]
    : [];

  const merged = [
    ...focused,
    ...calculator.seoContent.faqs,
    ...pack.faqs,
  ];

  const seen = new Set<string>();
  const unique: CalculatorFaq[] = [];
  for (const faq of merged) {
    const key = faq.question.toLowerCase().replace(/\s+/g, " ").trim();
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(faq);
    if (unique.length >= 12) break;
  }
  return unique;
}

export function buildLongTailSubtitle(
  calculator: Calculator,
  pack: KeywordPack,
  variation?: KeywordVariation
): string {
  if (variation) {
    return `${variation.focus} — free online, ${variation.benefit.toLowerCase()}, no sign up.`;
  }
  const metric = metricName(calculator);
  return `Free ${metric.toLowerCase()} tool for ${pack.primary}. ${pack.benefit}. Updated for ${SEO_CONTENT_YEAR}.`;
}

export function buildLongTailIntro(
  calculator: Calculator,
  pack: KeywordPack,
  variation?: KeywordVariation
): string {
  if (variation?.intro) return variation.intro;
  const base = calculator.seoContent.intro?.trim();
  if (base) {
    return `${base} Built for searches like “${pack.longTails[0] || pack.primary}” with instant, private results.`;
  }
  return `Use this free ${calculator.title} for instant results—no sign up. Ideal when you need ${pack.primary}.`;
}

export function getKeywordSearchTerms(
  pack: KeywordPack,
  variation?: KeywordVariation
): string[] {
  const terms = [
    variation?.focus,
    pack.primary,
    ...pack.longTails,
    ...pack.synonyms,
  ].filter((term): term is string => Boolean(term));

  const seen = new Set<string>();
  const unique: string[] = [];
  for (const term of terms) {
    const key = term.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(term);
  }
  return unique;
}
