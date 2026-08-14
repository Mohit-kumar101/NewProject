import { HomeExplorer } from "@/components/HomeExplorer";
import type { Metadata } from "next";
import { calculators, SITE_NAME, SITE_URL } from "@/lib/calculators";
import { buildPageMetadata } from "@/lib/pageMetadata";

const homeMeta = buildPageMetadata({
  title: "Free Calculators & Converters",
  description:
    "Free PDF, HEIC, video, and data converters plus finance and crypto calculators. No subscription, no watermark — files stay in your browser.",
  path: "/",
  keywords: [
    "free file converter",
    "free calculator",
    "PDF converter",
    "HEIC to JPG",
    "crypto calculator",
    SITE_NAME,
  ],
  ogTitle: "CalculioHub — Free Calculators & Converters",
});

export const metadata: Metadata = {
  ...homeMeta,
  // Brand-first absolute title (skip "| CalculioHub" template).
  title: {
    absolute: "CalculioHub — Free Calculators & Converters",
  },
};

export default function HomePage() {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description:
      "Free PDF, HEIC, video, and data converters plus finance and crypto calculators. Private, in-browser, no paywall.",
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
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    alternateName: "Calculio Hub",
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/favicon-512.png`,
      width: 512,
      height: 512,
      caption: SITE_NAME,
    },
    image: `${SITE_URL}/myicon.png`,
    sameAs: [],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <HomeExplorer calculators={calculators} />
    </>
  );
}
