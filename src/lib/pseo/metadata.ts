import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/calculators";
import type { PseoTool } from "./types";
import {
  DEFAULT_OG_IMAGE,
  META_DESCRIPTION_MAX,
  META_TITLE_MAX,
  clampMetaText,
  clampTitleSegment,
} from "@/lib/pageMetadata";
import { SEO_CONTENT_YEAR } from "@/lib/keywords";

export function getPseoMetaTitle(tool: PseoTool): string {
  const benefit = "Instant Results";
  const actionDriven = `${tool.targetKeyword} Free ${benefit} (${SEO_CONTENT_YEAR})`;
  if (actionDriven.length <= 45) {
    return clampTitleSegment(actionDriven);
  }
  const compact = `${tool.targetKeyword} Free (${SEO_CONTENT_YEAR})`;
  if (compact.length <= 45) {
    return clampTitleSegment(compact);
  }
  return clampTitleSegment(tool.h1 || tool.targetKeyword);
}

export function buildPseoMetadata(tool: PseoTool): Metadata {
  const url = `${SITE_URL}/tools/${tool.slug}`;
  const pageTitle = getPseoMetaTitle(tool);
  const absoluteTitle = clampMetaText(
    `${pageTitle} | ${SITE_NAME}`,
    META_TITLE_MAX
  );
  const description = clampMetaText(
    tool.metaDescription.includes("instant")
      ? tool.metaDescription
      : `${tool.metaDescription} Instant results, free online, no sign up.`,
    META_DESCRIPTION_MAX
  );
  const image = {
    ...DEFAULT_OG_IMAGE,
    alt: `${tool.h1} on ${SITE_NAME}`,
  };

  return {
    title: pageTitle,
    description,
    keywords: [
      tool.targetKeyword,
      `how to calculate ${tool.targetKeyword}`,
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
      description,
      url,
      type: "website",
      siteName: SITE_NAME,
      locale: "en_US",
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: absoluteTitle,
      description,
      images: [image.url],
    },
    robots: { index: true, follow: true },
  };
}
