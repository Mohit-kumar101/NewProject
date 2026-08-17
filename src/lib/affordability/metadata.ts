import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/calculators";
import {
  DEFAULT_OG_IMAGE,
  META_DESCRIPTION_MAX,
  META_TITLE_MAX,
  clampMetaText,
  clampTitleSegment,
} from "@/lib/pageMetadata";
import {
  getAffordabilityCategory,
  getAffordabilityHref,
} from "./catalog";
import type { AffordabilityPageConfig } from "./types";

export function buildAffordabilityMetadata(
  page: AffordabilityPageConfig
): Metadata {
  const category = getAffordabilityCategory(page.category);
  const title = clampTitleSegment(page.seoTitle, META_TITLE_MAX);
  const description = clampMetaText(
    page.metaDescription,
    META_DESCRIPTION_MAX
  );
  const url = `${SITE_URL}${getAffordabilityHref(page)}`;

  return {
    title,
    description,
    keywords: [
      page.intentQuestion,
      page.title,
      category?.name ?? "Affordability",
      "can I afford calculator",
      "free online",
      "no sign up",
      SITE_NAME,
    ],
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title,
      description,
      url,
      locale: "en_US",
      images: [{ ...DEFAULT_OG_IMAGE, alt: page.h1 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [DEFAULT_OG_IMAGE.url],
    },
  };
}

export function buildAffordabilityCategoryMetadata(
  categorySlug: string
): Metadata {
  const category = getAffordabilityCategory(categorySlug);
  if (!category) {
    return { title: "Affordability Category Not Found" };
  }
  const title = clampTitleSegment(
    `${category.name} — Can I Afford…?`,
    META_TITLE_MAX
  );
  const description = clampMetaText(
    category.description,
    META_DESCRIPTION_MAX
  );
  const url = `${SITE_URL}/affordability/${category.slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title,
      description,
      url,
      images: [{ ...DEFAULT_OG_IMAGE, alt: category.name }],
    },
  };
}
