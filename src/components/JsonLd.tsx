import type { Calculator } from "@/lib/types";
import { SITE_NAME, SITE_URL } from "@/lib/calculators";
import {
  getToolCanonicalUrl,
  getToolPageDescription,
  getToolPageTitle,
} from "@/lib/seo";

function applicationCategory(category: string): string {
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
    return "HealthApplication";
  }
  return "FinanceApplication";
}

export function JsonLd({ calculator }: { calculator: Calculator }) {
  const url = getToolCanonicalUrl(calculator);
  const name = getToolPageTitle(calculator);
  const description = getToolPageDescription(calculator);

  const softwareApplication = {
    "@context": "https://schema.org",
    "@type": ["SoftwareApplication", "WebApplication"],
    name,
    applicationCategory: applicationCategory(calculator.category),
    applicationSubCategory: calculator.category,
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript",
    description,
    url,
    image: `${SITE_URL}/myicon.png`,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
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
    isAccessibleForFree: true,
    featureList: calculator.seoContent.howToUse.slice(0, 5),
  };

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: calculator.seoContent.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
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
        item: url,
      },
    ],
  };

  const webPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name,
    description,
    url,
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
    },
    about: {
      "@type": "Thing",
      name: calculator.title,
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPage) }}
      />
    </>
  );
}
