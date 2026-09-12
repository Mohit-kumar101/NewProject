import type { MetadataRoute } from "next";
import { SITE_URL, getPublicCalculators } from "@/lib/calculators";
import {
  CRYPTO_SHORT_SLUGS,
  getToolHref,
} from "@/lib/cryptoFormulas";
import {
  CATEGORY_PATH_READY_TOOLS,
  CATEGORY_PATH_SLUGS,
} from "@/lib/categoryPathTools";
import { PSEO_SLUGS, PSEO_TOOLS } from "@/lib/pseo/calculatorsData";
import { getAllConfigCalculatorSlugs } from "@/config/calculators";
import { getAllGuideSlugs } from "@/lib/guides/articles";

const STATIC_PAGES: MetadataRoute.Sitemap = [
  { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
  { url: `${SITE_URL}/tools`, changeFrequency: "weekly", priority: 0.9 },
  { url: `${SITE_URL}/guides`, changeFrequency: "weekly", priority: 0.92 },
  ...getAllGuideSlugs().map((slug) => ({
    url: `${SITE_URL}/guides/${slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.86,
  })),
  { url: `${SITE_URL}/workflows`, changeFrequency: "weekly", priority: 0.88 },
  { url: `${SITE_URL}/workflows/buy-a-home`, changeFrequency: "monthly", priority: 0.85 },
  { url: `${SITE_URL}/workflows/kill-debt`, changeFrequency: "monthly", priority: 0.85 },
  { url: `${SITE_URL}/workflows/go-freelance`, changeFrequency: "monthly", priority: 0.85 },
  { url: `${SITE_URL}/workflows/convert-safely`, changeFrequency: "monthly", priority: 0.85 },
  { url: `${SITE_URL}/workflows/fitness-phase`, changeFrequency: "monthly", priority: 0.88 },
  { url: `${SITE_URL}/workflows/money-runway`, changeFrequency: "monthly", priority: 0.88 },
  { url: `${SITE_URL}/hubs/fitness-planners`, changeFrequency: "weekly", priority: 0.9 },
  { url: `${SITE_URL}/hubs/money-milestones`, changeFrequency: "weekly", priority: 0.9 },
  { url: `${SITE_URL}/hubs/life-questions`, changeFrequency: "weekly", priority: 0.9 },
  { url: `${SITE_URL}/affordability`, changeFrequency: "weekly", priority: 0.85 },
  { url: `${SITE_URL}/crypto`, changeFrequency: "weekly", priority: 0.9 },
  {
    url: `${SITE_URL}/crypto/reports`,
    changeFrequency: "monthly",
    priority: 0.85,
  },
  { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.75 },
  { url: `${SITE_URL}/contact`, changeFrequency: "monthly", priority: 0.75 },
  { url: `${SITE_URL}/disclaimer`, changeFrequency: "yearly", priority: 0.45 },
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

  const configPackPages: MetadataRoute.Sitemap =
    getAllConfigCalculatorSlugs().map((slug) => ({
      url: `${SITE_URL}/tools/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.85,
    }));

  const catalogPages: MetadataRoute.Sitemap = getPublicCalculators()
    .filter(
      (calculator) =>
        !cryptoToolSlugs.has(calculator.slug) &&
        !PSEO_SLUGS.has(calculator.slug) &&
        !CATEGORY_PATH_SLUGS.has(calculator.slug)
    )
    .map((calculator) => ({
      url: `${SITE_URL}${getToolHref(calculator.slug)}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    }));

  const categoryPathPages: MetadataRoute.Sitemap =
    CATEGORY_PATH_READY_TOOLS.map((tool) => ({
      url: `${SITE_URL}${getToolHref(tool.slug)}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
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

  // Intentionally omit thin long-tail `/for/` and category modifier URLs from
  // the sitemap so crawlers prioritize canonical tool + guide pages.

  return [
    ...STATIC_PAGES.map((page) => ({ ...page, lastModified: now })),
    ...cryptoPages,
    ...pseoPages,
    ...configPackPages,
    ...catalogPages,
    ...categoryPathPages,
  ];
}
