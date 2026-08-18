import type { Calculator, CalculatorFaq } from "@/lib/types";
import { SITE_NAME, SITE_URL } from "@/lib/calculators";
import {
  resolveKeywordPack,
  type KeywordVariation,
} from "@/lib/keywords";
import {
  SEO_MODIFIERS,
  getFormulaHeading,
  getHowToHeading,
  getToolCanonicalUrl,
  getToolMetaTitle,
  getToolMetricName,
  getToolPageDescription,
  getToolPageH1,
  getToolPageKeywords,
  getToolVariationCanonicalUrl,
  isFileConverter,
} from "@/lib/seo";

function applicationCategory(category: string): string {
  if (category.includes("Converter")) return "UtilitiesApplication";
  if (category.includes("Education") || category.includes("Statistics")) {
    return "EducationalApplication";
  }
  if (category.includes("Legal") || category.includes("HR")) {
    return "BusinessApplication";
  }
  if (
    category.includes("Lifestyle") ||
    category.includes("Cooking") ||
    category.includes("Media") ||
    category.includes("Health")
  ) {
    return "LifestyleApplication";
  }
  return "FinanceApplication";
}

export function JsonLd({
  calculator,
  faqs,
  variation,
}: {
  calculator: Calculator;
  faqs?: CalculatorFaq[];
  variation?: KeywordVariation;
}) {
  const pack = resolveKeywordPack(calculator);
  const url = variation
    ? getToolVariationCanonicalUrl(calculator, variation.slug)
    : getToolCanonicalUrl(calculator);
  const name = getToolMetaTitle(calculator, variation);
  const headline = variation?.focus || getToolPageH1(calculator);
  const description = getToolPageDescription(calculator, variation);
  const metric = getToolMetricName(calculator);
  const keywords = getToolPageKeywords(calculator, variation).join(", ");
  const faqItems = faqs?.length
    ? faqs
    : [...calculator.seoContent.faqs, ...pack.faqs].slice(0, 8);

  const softwareApplication = {
    "@context": "https://schema.org",
    "@type": ["SoftwareApplication", "WebApplication"],
    name,
    alternateName: [calculator.title, headline, pack.primary].filter(
      (value, index, arr) => value && arr.indexOf(value) === index
    ),
    headline,
    applicationCategory: applicationCategory(calculator.category),
    applicationSubCategory: calculator.category,
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript. Runs in modern browsers.",
    description,
    url,
    image: `${SITE_URL}/myicon.png`,
    keywords,
    inLanguage: "en-US",
    isAccessibleForFree: true,
    isFamilyFriendly: true,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      description: "Free online tool. No sign up. Instant calculation.",
    },
    author: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/favicon-512.png`,
      },
    },
    featureList: [
      ...SEO_MODIFIERS,
      ...pack.features.slice(0, 4),
      ...calculator.seoContent.howToUse.slice(0, 3),
    ],
    additionalProperty: SEO_MODIFIERS.map((value) => ({
      "@type": "PropertyValue",
      name: value,
      value: true,
    })),
    audience: {
      "@type": "Audience",
      audienceType: calculator.category,
    },
    potentialAction: {
      "@type": "UseAction",
      target: url,
      name: isFileConverter(calculator)
        ? `Convert ${metric} free online`
        : `Calculate ${metric} free online`,
    },
  };

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    name: `${metric} Frequently Asked Questions`,
    url,
    inLanguage: "en-US",
    isAccessibleForFree: true,
    mainEntity: faqItems.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  const howTo = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: getHowToHeading(calculator),
    description,
    url,
    totalTime: "PT2M",
    tool: {
      "@type": "HowToTool",
      name: calculator.title,
    },
    step: calculator.seoContent.howToUse.map((text, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: `Step ${index + 1}`,
      text,
    })),
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Tools",
        item: `${SITE_URL}/tools`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: calculator.title,
        item: getToolCanonicalUrl(calculator),
      },
      ...(variation
        ? [
            {
              "@type": "ListItem",
              position: 4,
              name: variation.focus,
              item: url,
            },
          ]
        : []),
    ],
  };

  const webPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: headline,
    headline,
    description,
    url,
    inLanguage: "en-US",
    isAccessibleForFree: true,
    keywords,
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
    },
    about: {
      "@type": "Thing",
      name: metric,
      description: getFormulaHeading(calculator),
    },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", "h2"],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(softwareApplication),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPage) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howTo) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPage) }}
      />
    </>
  );
}
