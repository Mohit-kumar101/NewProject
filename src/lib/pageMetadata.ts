import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/calculators";

/** Final <title> budget including " | CalculioHub". */
export const META_TITLE_MAX = 60;
/** Title segment before the layout template suffix. */
export const META_TITLE_SEGMENT_MAX = 45;
export const META_DESCRIPTION_MAX = 155;

export const DEFAULT_OG_IMAGE = {
  url: "/myicon.png",
  width: 1144,
  height: 928,
  alt: SITE_NAME,
} as const;

export function clampMetaText(text: string, max: number): string {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (normalized.length <= max) return normalized;
  const cut = normalized.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  const base = (lastSpace > Math.min(40, max - 20) ? cut.slice(0, lastSpace) : cut).replace(
    /[.,;: ]+$/,
    ""
  );
  return `${base}…`;
}

/** Keep title segments short enough for `%s | CalculioHub` ≤ 60 chars. */
export function clampTitleSegment(text: string, max = META_TITLE_SEGMENT_MAX): string {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (normalized.length <= max) return normalized;
  const cut = normalized.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > 20 ? cut.slice(0, lastSpace) : cut).replace(/[.,;:…-]+$/, "").trim();
}

type BuildPageMetadataInput = {
  /** Title segment (template appends `| CalculioHub`) unless absoluteTitle is set. */
  title: string;
  description: string;
  /** Path starting with `/`, or full URL. */
  path: string;
  keywords?: string[];
  ogTitle?: string;
  imageAlt?: string;
  noIndex?: boolean;
};

export function absoluteUrl(pathOrUrl: string): string {
  if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) {
    return pathOrUrl;
  }
  const path = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
  return `${SITE_URL}${path === "/" ? "" : path}` || SITE_URL;
}

/**
 * Shared metadata for static/marketing pages: canonical, OG, Twitter, robots.
 */
export function buildPageMetadata({
  title,
  description,
  path,
  keywords,
  ogTitle,
  imageAlt,
  noIndex,
}: BuildPageMetadataInput): Metadata {
  const titleSegment = clampTitleSegment(title);
  const desc = clampMetaText(description, META_DESCRIPTION_MAX);
  const url = absoluteUrl(path);
  const socialTitle = clampMetaText(
    ogTitle ?? `${titleSegment} | ${SITE_NAME}`,
    META_TITLE_MAX
  );
  const image = {
    ...DEFAULT_OG_IMAGE,
    alt: imageAlt ?? `${SITE_NAME} — ${titleSegment}`,
  };

  return {
    title: titleSegment,
    description: desc,
    keywords,
    alternates: { canonical: url },
    openGraph: {
      title: socialTitle,
      description: desc,
      url,
      type: "website",
      siteName: SITE_NAME,
      locale: "en_US",
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description: desc,
      images: [image.url],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}
