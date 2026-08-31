import { SITE_NAME, SITE_URL } from "@/lib/calculators";
import type { ConfigCalculator } from "@/config/calculators";

export function ConfigCalculatorJsonLd({ tool }: { tool: ConfigCalculator }) {
  const url = `${SITE_URL}/tools/${tool.slug}`;

  const softwareApplication = {
    "@context": "https://schema.org",
    "@type": ["SoftwareApplication", "WebApplication"],
    name: tool.seoTitle,
    alternateName: [tool.h1, tool.topic, ...tool.trailingWords.map((w) => `${tool.topic} ${w}`)],
    headline: tool.h1,
    applicationCategory: tool.applicationCategory,
    applicationSubCategory: tool.category,
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript. Runs in modern browsers.",
    description: tool.metaDescription,
    url,
    image: `${SITE_URL}/myicon.png`,
    keywords: tool.keywords.join(", "),
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
      ...tool.trailingWords,
      "Free online",
      "No sign up",
      "Instant calculation",
      tool.formulaSummary,
    ],
    additionalProperty: tool.trailingWords.map((value) => ({
      "@type": "PropertyValue",
      name: value,
      value: true,
    })),
    audience: {
      "@type": "Audience",
      audienceType: tool.category,
    },
    potentialAction: {
      "@type": "UseAction",
      target: url,
      name: `Use ${tool.topic} calculator free online`,
    },
  };

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    name: `${tool.topic} Frequently Asked Questions`,
    url,
    inLanguage: "en-US",
    isAccessibleForFree: true,
    mainEntity: tool.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
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
    </>
  );
}
