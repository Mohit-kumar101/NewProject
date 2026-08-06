import type { MetadataRoute } from "next";
import { SITE_URL, calculators } from "@/lib/calculators";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...calculators.map((calculator) => ({
      url: `${SITE_URL}/tools/${calculator.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
