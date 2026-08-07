import type { Metadata } from "next";
import type { Calculator } from "@/lib/types";
import { SITE_NAME, SITE_URL } from "@/lib/calculators";

/** Per-tool SEO overrides keyed by slug. */
const TOOL_SEO_OVERRIDES: Record<
  string,
  { title: string; description: string; keywords?: string[] }
> = {
  "scientific-calculator": {
    title: "Free Online Scientific Calculator",
    description:
      "Use our advanced online scientific calculator with trigonometric, logarithmic, exponential functions, degree/radian modes, and calculation history.",
    keywords: [
      "scientific calculator",
      "online scientific calculator",
      "trigonometry calculator",
      "logarithm calculator",
      "degree radian calculator",
    ],
  },
  "compound-interest-calculator": {
    title: "Compound Interest Calculator",
    description:
      "Project investment growth with compound interest, monthly contributions, compounding frequency, and a coasting phase after you stop depositing.",
    keywords: [
      "compound interest calculator",
      "investment growth calculator",
      "compounding calculator",
      "coasting calculator",
    ],
  },
  "ai-nutrition-calorie-calculator": {
    title: "AI Nutrition & Calorie Calculator",
    description:
      "Estimate BMR, TDEE, and daily calorie targets with smart macro suggestions based on age, sex, weight, height, activity level, and goals.",
    keywords: [
      "calorie calculator",
      "TDEE calculator",
      "BMR calculator",
      "macro calculator",
      "nutrition calculator",
      "AI nutrition calculator",
    ],
  },
};

export function getToolPageTitle(calculator: Calculator): string {
  return (
    calculator.seoTitle ||
    TOOL_SEO_OVERRIDES[calculator.slug]?.title ||
    calculator.title
  );
}

export function getToolPageDescription(calculator: Calculator): string {
  const override =
    calculator.seoDescription ||
    TOOL_SEO_OVERRIDES[calculator.slug]?.description;
  if (override) return override;

  return calculator.description.endsWith(".")
    ? `${calculator.description} Free, instant results—no signup required.`
    : `${calculator.description}. Free, instant results—no signup required.`;
}

export function getToolPageKeywords(calculator: Calculator): string[] {
  const override =
    calculator.seoKeywords || TOOL_SEO_OVERRIDES[calculator.slug]?.keywords;
  if (override?.length) {
    return [...override, SITE_NAME, "online calculator"];
  }

  return [
    calculator.title,
    `${calculator.title} online`,
    `free ${calculator.title.toLowerCase()}`,
    calculator.category,
    SITE_NAME,
    "online calculator",
  ];
}

export function getToolCanonicalUrl(calculator: Calculator): string {
  return `${SITE_URL}/tools/${calculator.slug}`;
}

/**
 * Build unique per-tool metadata.
 * Root layout title template appends `| CalculioHub`.
 */
export function buildToolMetadata(calculator: Calculator): Metadata {
  const pageTitle = getToolPageTitle(calculator);
  const absoluteTitle = `${pageTitle} | ${SITE_NAME}`;
  const description = getToolPageDescription(calculator);
  const url = getToolCanonicalUrl(calculator);

  return {
    title: pageTitle,
    description,
    keywords: getToolPageKeywords(calculator),
    alternates: { canonical: url },
    openGraph: {
      title: absoluteTitle,
      description,
      url,
      type: "website",
      siteName: SITE_NAME,
      locale: "en_US",
      images: [
        {
          url: "/myicon.png",
          width: 1144,
          height: 928,
          alt: `${calculator.title} on ${SITE_NAME}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: absoluteTitle,
      description,
      images: ["/myicon.png"],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}
