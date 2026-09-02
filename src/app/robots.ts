import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/calculators";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/vaultline/purchases",
          "/vaultline/subscriptions",
          "/vaultline/saved",
          "/vaultline/settings",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
