import { SITE_NAME, SITE_URL } from "@/lib/calculators";
import type { PseoTool } from "@/lib/pseo/types";

export function PseoJsonLd({ tool }: { tool: PseoTool }) {
  const url = `${SITE_URL}/tools/${tool.slug}`;

  const softwareApplication = {
    "@context": "https://schema.org",
    "@type": ["SoftwareApplication", "WebApplication"],
    name: tool.seoTitle,
    alternateName: tool.h1,
    headline: tool.h1,
    applicationCategory: tool.schemaData.applicationCategory,
    applicationSubCategory: tool.category,
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript",
    description: tool.metaDescription,
    url,
    image: `${SITE_URL}/myicon.png`,
    keywords: [
      tool.targetKeyword,
      "free online calculator",
      "no sign up",
      "instant calculation",
      "formula & step-by-step example",
    ].join(", "),
    inLanguage: "en-US",
    isAccessibleForFree: true,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    featureList: [
      "free online calculator",
      "no sign up",
      "instant calculation",
      "formula & step-by-step example",
    ],
  };

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    name: `${tool.h1} frequently asked questions`,
    url,
    mainEntity: tool.schemaData.faqs.map((faq) => ({
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
