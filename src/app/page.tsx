import { HomeExplorer } from "@/components/HomeExplorer";
import { ContinueHandoffStrip } from "@/components/home/ContinueHandoffStrip";
import { HomeScrollEffects } from "@/components/home/HomeScrollEffects";
import { HomeGuidesSpotlight } from "@/components/HomeGuidesSpotlight";
import { FeaturedPlanners } from "@/components/growth/FeaturedPlanners";
import { SpecialCareerTools } from "@/components/SpecialCareerTools";
import type { Metadata } from "next";
import { getPublicCalculators, SITE_NAME, SITE_URL } from "@/lib/calculators";
import { buildPageMetadata } from "@/lib/pageMetadata";
import { SITE_AUTHOR, personSchema } from "@/lib/siteIdentity";

const homeMeta = buildPageMetadata({
  title: "Free Calculators & Converters",
  description:
    "Free money and fitness planners, private PDF/HEIC converters, and practical guides by Mohit. Transparent formulas—no subscription wall.",
  path: "/",
  keywords: [
    "free calculator",
    "emergency fund calculator",
    "bulk cut macro calculator",
    "free file converter",
    "PDF converter",
    "freelance rate calculator",
    SITE_NAME,
  ],
  ogTitle: "CalculioHub — Free Calculators, Converters & Guides",
});

export const metadata: Metadata = {
  ...homeMeta,
  // Brand-first absolute title (skip "| CalculioHub" template).
  title: {
    absolute: "CalculioHub — Free Calculators, Converters & Guides",
  },
};

export default function HomePage() {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description:
      "Free money and fitness planners, private converters, and original guides. Built by Mohit.",
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      founder: personSchema(),
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
    founder: personSchema(),
    description: `${SITE_NAME} is run by ${SITE_AUTHOR.name}. Free planners, converters, and guides.`,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/favicon-512.png`,
      width: 512,
      height: 512,
      caption: SITE_NAME,
    },
    image: `${SITE_URL}/myicon.png`,
    sameAs: SITE_AUTHOR.sameAs,
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
      <HomeScrollEffects />
      <HomeExplorer calculators={getPublicCalculators()} />
      <ContinueHandoffStrip />
      <HomeGuidesSpotlight />
      <SpecialCareerTools />
      <FeaturedPlanners />
    </>
  );
}
