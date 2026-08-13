import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/calculators";
import type { PseoTool } from "./types";

export function buildPseoMetadata(tool: PseoTool): Metadata {
  const url = `${SITE_URL}/tools/${tool.slug}`;
  const absoluteTitle = `${tool.seoTitle} | ${SITE_NAME}`;

  return {
    title: tool.seoTitle,
    description: tool.metaDescription,
    keywords: [
      tool.targetKeyword,
      "free online calculator",
      "no sign up",
      "instant calculation",
      "formula & step-by-step example",
      tool.category,
      SITE_NAME,
    ],
    alternates: { canonical: url },
    openGraph: {
      title: absoluteTitle,
      description: tool.metaDescription,
      url,
      type: "website",
      siteName: SITE_NAME,
      locale: "en_US",
      images: [
        {
          url: "/myicon.png",
          width: 1144,
          height: 928,
          alt: `${tool.h1} on ${SITE_NAME}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: absoluteTitle,
      description: tool.metaDescription,
      images: ["/myicon.png"],
    },
    robots: { index: true, follow: true },
  };
}
