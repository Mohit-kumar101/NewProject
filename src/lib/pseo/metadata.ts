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

export function getPseoMetaTitle(tool: PseoTool): string {
  return clampTitleSegment(tool.h1 || tool.targetKeyword);
}

export function buildPseoMetadata(tool: PseoTool): Metadata {
  const url = `${SITE_URL}/tools/${tool.slug}`;
  const pageTitle = getPseoMetaTitle(tool);
  const absoluteTitle = clampMetaText(
    `${pageTitle} | ${SITE_NAME}`,
    META_TITLE_MAX
  );
  const description = clampMetaText(tool.metaDescription, META_DESCRIPTION_MAX);
  const image = {
    ...DEFAULT_OG_IMAGE,
    alt: `${tool.h1} on ${SITE_NAME}`,
  };

  return {
    title: pageTitle,
    description,
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
