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

const STUFFED_KEYWORD =
  /\b(?:calculator|converter|tool)\s+free online\b|\bno sign[- ]?up\b|\bfree\b.+\binstant\b/i;

export function isStuffedKeyword(term: string): boolean {
  return STUFFED_KEYWORD.test(term);
}

/** First real search phrase — skips “X calculator free online” clones. */
export function preferredLongTail(pack: KeywordPack): string | undefined {
  const candidates = [...pack.longTails, pack.primary, ...pack.synonyms];
  return (
    candidates.find((term) => /^how to /i.test(term) && !isStuffedKeyword(term)) ||
    candidates.find((term) => term && !isStuffedKeyword(term))
  );
}

function inputHint(calculator: Calculator): string {
  const labels = calculator.inputs.map((input) => input.label.toLowerCase());
  const distinctive = labels.find((label) =>
    /extra|tax|fee|insurance|macro|cobra|rsu|bonus|equity|down payment|apr|term/i.test(
      label
    )
  );
  return distinctive || labels[0] || "your numbers";
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
  const hint = inputHint(calculator);

  return {
    primary: `how to ${verb} ${metricLower}`,
    benefit: converter
      ? `Convert ${metric} without uploading a file`
      : `See how ${hint} changes ${metricLower}`,
    synonyms: [metricLower, `${metricLower} ${converter ? "converter" : "formula"}`],
    useCases: [
      `Adjust ${hint} and watch ${metricLower} update`,
      `Compare two ${metricLower} scenarios before you commit`,
      `Cross-check a quote or spreadsheet with the same inputs`,
    ],
    regions: converter
      ? ["Works in the browser on iPhone, Android, and desktop"]
      : [`${calculator.category} planning examples`],
    longTails: [
      `how to ${verb} ${metricLower}`,
      `${metricLower} with ${hint}`,
      `${metricLower} formula explained`,
    ],
    features: [
      calculator.inputs
        .slice(0, 3)
        .map((input) => input.label)
        .join(", ") || "Live inputs",
      calculator.formulaSummary || packBenefitFallback(converter, metric),
      converter
        ? "Conversion runs on this device — files are not uploaded"
        : "Planning estimate you can verify against the formula",
    ],
    faqs: [
      {
        question: `What do I enter to ${verb} ${metricLower}?`,
        answer: `Use ${calculator.inputs.map((input) => input.label.toLowerCase()).join(", ") || "the fields below"}. Each change recalculates immediately.`,
      },
      {
        question: `How should I read the ${metricLower} result?`,
        answer: calculator.description
          ? `${calculator.description.replace(/\s+/g, " ").trim()} Treat it as a planning figure, not a signed quote.`
          : `The output follows the on-page formula. Confirm final numbers with your ${converter ? "original file" : "lender, employer, or advisor"}.`,
      },
    ],
  };
}

function packBenefitFallback(converter: boolean, metric: string): string {
  return converter
    ? `${metric} conversion with a live preview`
    : `${metric} result from the inputs below`;
}

function looksClonedUseCases(useCases: string[]): boolean {
  const blob = useCases.join(" ");
  return (
    blob.includes("Compare extra monthly payments vs keeping the current schedule") ||
    (blob.includes("Run a quick ") && blob.includes("check before you decide"))
  );
}

function looksClonedRegions(regions: string[], calculator: Calculator): boolean {
  const metric = metricName(calculator).toLowerCase();
  const blob = regions.join(" ").toLowerCase();
  if (regions.length === 1 && /works in modern browsers worldwide/i.test(regions[0])) {
    return true;
  }
  if (
    blob.includes("auto and personal loan") &&
    !/\b(car|auto|personal loan)\b/.test(metric)
  ) {
    return true;
  }
  return false;
}

function looksClonedFeatures(features: string[]): boolean {
  const generic = features.filter((feature) =>
    /no account required|no email wall|no email required|instant results in your browser|free online tool — no sign up|private browser-side math|adjust rate, term, and extra payments with live results|see interest saved and months cut from the schedule/i.test(
      feature
    )
  );
  return generic.length >= 2 || features.length === 0;
}

function isClonedBenefit(benefit: string): boolean {
  return /^(instant payoff timeline|get results instantly|convert instantly|instant results|estimate payment instantly)$/i.test(
    benefit.trim()
  );
}

function isStuffedIntro(intro: string): boolean {
  return /run the free calculator|free online with no email wall|searching for how to|instant results and no account/i.test(
    intro
  );
}

export function resolveKeywordPack(calculator: Calculator): KeywordPack {
  const stored = getKeywordPack(calculator.slug);
  const fallback = buildFallbackKeywordPack(calculator);
  if (!stored) return fallback;

  const longTails = (stored.longTails ?? []).filter((term) => !isStuffedKeyword(term));
  const primary = isStuffedKeyword(stored.primary) ? fallback.primary : stored.primary;
  const focusForIntro = primary;

  return {
    primary,
    benefit: isClonedBenefit(stored.benefit) ? fallback.benefit : stored.benefit,
    synonyms: (stored.synonyms ?? []).filter((term) => !isStuffedKeyword(term)),
    useCases: looksClonedUseCases(stored.useCases ?? [])
      ? fallback.useCases
      : stored.useCases?.length
        ? stored.useCases
        : fallback.useCases,
    regions: looksClonedRegions(stored.regions ?? [], calculator)
      ? fallback.regions
      : stored.regions?.length
        ? stored.regions
        : fallback.regions,
    longTails: longTails.length ? longTails : fallback.longTails,
    features: looksClonedFeatures(stored.features ?? [])
      ? fallback.features
      : stored.features ?? fallback.features,
    faqs: (stored.faqs ?? []).filter((faq) => !isGenericFaq(faq)),
    variations: stored.variations?.map((variation) => {
      const focus = isStuffedKeyword(variation.focus) ? focusForIntro : variation.focus;
      return {
        ...variation,
        focus,
        intro: isStuffedIntro(variation.intro)
          ? `${calculator.seoContent.intro?.trim() || fallback.useCases[0]} This page is aimed at “${focus}.”`
          : variation.intro,
      };
    }),
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

export function isGenericFaq(faq: Pick<CalculatorFaq, "answer" | "question">): boolean {
  const answer = faq.answer.toLowerCase();
  const question = faq.question.toLowerCase();
  return (
    /free online tool with instant/.test(answer) ||
    /no sign-up wall/.test(answer) ||
    /no upload is required for standard calculations/.test(answer) ||
    /open the free .+ enter your (values|inputs)/i.test(faq.answer) ||
    /read the result instantly in your browser/.test(answer) ||
    /is (the|this|a) .+ free\??/.test(question)
  );
}

/** Dedupe FAQs by normalized question; calculator FAQs win on conflicts. */
export function mergeToolFaqs(
  calculator: Calculator,
  pack: KeywordPack,
  variation?: KeywordVariation
): CalculatorFaq[] {
  const focused: CalculatorFaq[] =
    variation && !isGenericFaq({ question: variation.focus, answer: variation.intro })
      ? [
          {
            question: `How is this different when you care about ${variation.focus}?`,
            answer: variation.intro,
          },
        ]
      : [];

  const merged = [
    ...focused,
    ...calculator.seoContent.faqs,
    ...pack.faqs.filter((faq) => !isGenericFaq(faq)),
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
  if (variation?.benefit) return variation.benefit;
  if (pack.benefit) return pack.benefit;
  const tail = preferredLongTail(pack);
  if (tail) return tail;
  return calculator.description;
}

export function buildLongTailIntro(
  calculator: Calculator,
  pack: KeywordPack,
  variation?: KeywordVariation
): string {
  if (variation?.intro) {
    if (isStuffedIntro(variation.intro)) {
      const base = calculator.seoContent.intro?.trim();
      const focus = isStuffedKeyword(variation.focus)
        ? pack.primary
        : variation.focus;
      return base
        ? `${base} This page is aimed at “${focus}.”`
        : `This page is aimed at “${focus}.”`;
    }
    return variation.intro.trim();
  }
  const base = calculator.seoContent.intro?.trim();
  if (base) return base;
  if (calculator.description?.trim()) return calculator.description.trim();
  const tail = preferredLongTail(pack);
  const metric = metricName(calculator).toLowerCase();
  if (tail) {
    return `Use the fields below to ${tail.replace(/^how to /i, "").trim()}. The result updates as you change ${inputHint(calculator)}.`;
  }
  return `Enter your ${metric} figures below. The result updates as each input changes.`;
}

export function getKeywordSearchTerms(
  pack: KeywordPack,
  variation?: KeywordVariation
): string[] {
  const terms = [
    variation?.focus,
    preferredLongTail(pack),
    pack.primary,
    ...pack.longTails,
    ...pack.synonyms,
  ].filter((term): term is string => typeof term === "string" && !isStuffedKeyword(term));

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
