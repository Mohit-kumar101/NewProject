import { SITE_NAME, SITE_URL } from "@/lib/calculators";
import { getAffordabilityHref } from "@/lib/affordability/catalog";
import { buildAffordabilityFaqs } from "@/lib/affordability/faqs";
import type { AffordabilityPageConfig } from "@/lib/affordability/types";

export function AffordabilityJsonLd({
  page,
}: {
  page: AffordabilityPageConfig;
}) {
  const url = `${SITE_URL}${getAffordabilityHref(page)}`;
  const faqs = buildAffordabilityFaqs(page);

  const softwareApplication = {
    "@context": "https://schema.org",
    "@type": ["SoftwareApplication", "WebApplication"],
    name: page.seoTitle,
    alternateName: [page.h1, page.title, page.intentQuestion],
    headline: page.h1,
    applicationCategory: "FinanceApplication",
    applicationSubCategory: "Affordability Calculator",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript. Runs in modern browsers.",
    description: page.metaDescription,
    url,
    image: `${SITE_URL}/myicon.png`,
    keywords: [
      page.intentQuestion,
      "can I afford calculator",
      "free online calculator",
      "no sign up",
      "instant calculation",
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
      "pre-filled affordability presets",
      "free online calculator",
      "no sign up",
      "instant calculation",
      "rule-of-thumb benchmarks",
    ],
  };

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  const webPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: page.h1,
    headline: page.h1,
    description: page.metaDescription,
    url,
    inLanguage: "en-US",
    isAccessibleForFree: true,
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPage) }}
      />
    </>
  );
}
