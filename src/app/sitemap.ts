import type { MetadataRoute } from "next";
import { SITE_URL, calculators } from "@/lib/calculators";
import { CRYPTO_SHORT_SLUGS } from "@/lib/cryptoFormulas";
import { PSEO_SLUGS, PSEO_TOOLS } from "@/lib/pseo/calculatorsData";

const STATIC_PAGES: MetadataRoute.Sitemap = [
  { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
  { url: `${SITE_URL}/tools`, changeFrequency: "weekly", priority: 0.9 },
  { url: `${SITE_URL}/crypto`, changeFrequency: "weekly", priority: 0.9 },
  {
    url: `${SITE_URL}/crypto/reports`,
    changeFrequency: "monthly",
    priority: 0.85,
  },
  {
    url: `${SITE_URL}/crypto/token-creator`,
    changeFrequency: "monthly",
    priority: 0.85,
  },
  { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.7 },
  { url: `${SITE_URL}/contact`, changeFrequency: "monthly", priority: 0.7 },
  { url: `${SITE_URL}/privacy`, changeFrequency: "yearly", priority: 0.4 },
  { url: `${SITE_URL}/terms`, changeFrequency: "yearly", priority: 0.4 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const cryptoToolSlugs = new Set(Object.values(CRYPTO_SHORT_SLUGS));

  const pseoPages: MetadataRoute.Sitemap = PSEO_TOOLS.map((tool) => ({
    url: `${SITE_URL}/tools/${tool.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const catalogPages: MetadataRoute.Sitemap = calculators
    .filter(
      (calculator) =>
        !cryptoToolSlugs.has(calculator.slug) && !PSEO_SLUGS.has(calculator.slug)
    )
    .map((calculator) => ({
      url: `${SITE_URL}/tools/${calculator.slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    }));

  const cryptoPages: MetadataRoute.Sitemap = Object.keys(CRYPTO_SHORT_SLUGS).map(
    (short) => ({
      url: `${SITE_URL}/crypto/${short}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.85,
    })
  );

  return [
    ...STATIC_PAGES.map((page) => ({ ...page, lastModified: now })),
    ...cryptoPages,
    ...pseoPages,
    ...catalogPages,
  ];
}
