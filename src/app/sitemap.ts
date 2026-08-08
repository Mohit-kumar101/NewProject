import type { MetadataRoute } from "next";
import { SITE_URL, calculators } from "@/lib/calculators";

const STATIC_PAGES: MetadataRoute.Sitemap = [
  {
    url: SITE_URL,
    changeFrequency: "weekly",
    priority: 1,
  },
  {
    url: `${SITE_URL}/tools`,
    changeFrequency: "weekly",
    priority: 0.9,
  },
  {
    url: `${SITE_URL}/about`,
    changeFrequency: "monthly",
    priority: 0.7,
  },
  {
    url: `${SITE_URL}/contact`,
    changeFrequency: "monthly",
    priority: 0.7,
  },
  {
    url: `${SITE_URL}/privacy`,
    changeFrequency: "yearly",
    priority: 0.5,
  },
  {
    url: `${SITE_URL}/terms`,
    changeFrequency: "yearly",
    priority: 0.5,
  },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    ...STATIC_PAGES.map((page) => ({ ...page, lastModified: now })),
    ...calculators.map((calculator) => ({
      url: `${SITE_URL}/tools/${calculator.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
