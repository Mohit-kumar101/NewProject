import type { Calculator } from "@/lib/types";
import { SITE_NAME, SITE_URL } from "@/lib/calculators";
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
    category.includes("Media")
  ) {
    return "LifestyleApplication";
  }
  return "FinanceApplication";
}

export function JsonLd({ calculator }: { calculator: Calculator }) {
  const url = getToolCanonicalUrl(calculator);
  const name = getToolMetaTitle(calculator);
  const headline = getToolPageH1(calculator);
  const description = getToolPageDescription(calculator);
  const metric = getToolMetricName(calculator);
  const keywords = getToolPageKeywords(calculator).join(", ");

  const softwareApplication = {
    "@context": "https://schema.org",
    "@type": ["SoftwareApplication", "WebApplication"],
    name,
    alternateName: [calculator.title, headline].filter(
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
      ...calculator.seoContent.howToUse.slice(0, 5),
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
    mainEntity: calculator.seoContent.faqs.map((faq) => ({
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
        name: headline,
        item: url,
      },
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
