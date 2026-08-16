import type { CalculatorFaq } from "@/lib/types";
import { SITE_NAME, SITE_URL } from "@/lib/calculators";
import { getPseoMetaTitle } from "@/lib/pseo/metadata";
import type { PseoTool } from "@/lib/pseo/types";

export function PseoJsonLd({
  tool,
  faqs,
}: {
  tool: PseoTool;
  faqs?: CalculatorFaq[];
}) {
  const url = `${SITE_URL}/tools/${tool.slug}`;
  const name = getPseoMetaTitle(tool);
  const faqItems = faqs?.length ? faqs : tool.schemaData.faqs;

  const softwareApplication = {
    "@context": "https://schema.org",
    "@type": ["SoftwareApplication", "WebApplication"],
    name,
    alternateName: [tool.h1, tool.targetKeyword].filter(
      (value, index, arr) => value && arr.indexOf(value) === index
    ),
    headline: tool.h1,
    applicationCategory: tool.schemaData.applicationCategory,
    applicationSubCategory: tool.category,
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript. Runs in modern browsers.",
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
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/favicon-512.png`,
        width: 512,
        height: 512,
      },
    },
    featureList: [
      "free online calculator",
      "no sign up",
      "instant calculation",
      "formula & step-by-step example",
    ],
  };

  const webPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: tool.h1,
    headline: tool.h1,
    description: tool.metaDescription,
    url,
    inLanguage: "en-US",
    isAccessibleForFree: true,
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
    },
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
        name: tool.h1,
        item: url,
      },
    ],
  };

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    name: `${tool.h1} frequently asked questions`,
    url,
    mainEntity: faqItems.map((faq) => ({
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPage) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPage) }}
      />
    </>
  );
}
