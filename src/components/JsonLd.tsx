import type { Calculator } from "@/lib/types";
import { SITE_NAME, SITE_URL } from "@/lib/calculators";

function applicationCategory(category: string): string {
  if (category.includes("Education") || category.includes("Statistics")) {
    return "EducationalApplication";
  }
  if (category.includes("Legal") || category.includes("HR")) {
    return "BusinessApplication";
  }
  return "FinanceApplication";
}

export function JsonLd({ calculator }: { calculator: Calculator }) {
  const url = `${SITE_URL}/tools/${calculator.slug}`;

  const softwareApplication = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: calculator.title,
    applicationCategory: applicationCategory(calculator.category),
    applicationSubCategory: calculator.category,
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript",
    description: calculator.description,
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
        name: calculator.category,
        item: `${SITE_URL}/#${calculator.category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: calculator.title,
        item: url,
      },
    ],
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
    </>
  );
}
