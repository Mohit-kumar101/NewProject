import type { MetadataRoute } from "next";
import { SITE_URL, calculators } from "@/lib/calculators";
import {
  CRYPTO_SHORT_SLUGS,
  getToolHref,
  getToolModifierHref,
} from "@/lib/cryptoFormulas";
import { getAllKeywordPacks, getRoutableVariations } from "@/lib/keywords";
import {
  CATEGORY_PATH_READY_TOOLS,
  CATEGORY_PATH_SLUGS,
  getCategoryPathModifiers,
} from "@/lib/categoryPathTools";
import { PSEO_SLUGS, PSEO_TOOLS } from "@/lib/pseo/calculatorsData";
import { getAllConfigCalculatorSlugs } from "@/config/calculators";

const STATIC_PAGES: MetadataRoute.Sitemap = [
  { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
  { url: `${SITE_URL}/tools`, changeFrequency: "weekly", priority: 0.9 },
  { url: `${SITE_URL}/workflows`, changeFrequency: "weekly", priority: 0.88 },
  { url: `${SITE_URL}/workflows/buy-a-home`, changeFrequency: "monthly", priority: 0.85 },
  { url: `${SITE_URL}/workflows/kill-debt`, changeFrequency: "monthly", priority: 0.85 },
  { url: `${SITE_URL}/workflows/go-freelance`, changeFrequency: "monthly", priority: 0.85 },
  { url: `${SITE_URL}/workflows/convert-safely`, changeFrequency: "monthly", priority: 0.85 },
  { url: `${SITE_URL}/workflows/fitness-phase`, changeFrequency: "monthly", priority: 0.88 },
  { url: `${SITE_URL}/workflows/money-runway`, changeFrequency: "monthly", priority: 0.88 },
  { url: `${SITE_URL}/hubs/fitness-planners`, changeFrequency: "weekly", priority: 0.9 },
  { url: `${SITE_URL}/hubs/money-milestones`, changeFrequency: "weekly", priority: 0.9 },
  { url: `${SITE_URL}/affordability`, changeFrequency: "weekly", priority: 0.85 },
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
  { url: `${SITE_URL}/vaultline`, changeFrequency: "weekly", priority: 0.75 },
  { url: `${SITE_URL}/vaultline/login`, changeFrequency: "monthly", priority: 0.5 },
  { url: `${SITE_URL}/vaultline/signup`, changeFrequency: "monthly", priority: 0.5 },
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

  const catalogPages: MetadataRoute.Sitemap = calculators
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
    CATEGORY_PATH_READY_TOOLS.flatMap((tool) => {
      const base = {
        url: `${SITE_URL}${getToolHref(tool.slug)}`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.8,
      };
      const modifiers = getCategoryPathModifiers(tool).map((modifier) => ({
        url: `${SITE_URL}${getToolModifierHref(tool.slug, modifier.slug)}`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      }));
      return [base, ...modifiers];
    });

  const cryptoPages: MetadataRoute.Sitemap = Object.keys(CRYPTO_SHORT_SLUGS).map(
    (short) => ({
      url: `${SITE_URL}/crypto/${short}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.85,
    })
  );

  const keywordVariationPages: MetadataRoute.Sitemap = Object.keys(
    getAllKeywordPacks()
  ).flatMap((slug) =>
    getRoutableVariations(slug).map((variation) => ({
      url: `${SITE_URL}/tools/${slug}/for/${variation.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }))
  );

  return [
    ...STATIC_PAGES.map((page) => ({ ...page, lastModified: now })),
    ...cryptoPages,
    ...pseoPages,
    ...configPackPages,
    ...catalogPages,
    ...categoryPathPages,
    ...keywordVariationPages,
  ];
}
