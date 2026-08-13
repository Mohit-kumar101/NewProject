/** Slugs with dedicated App Router pages (not served by tools/[slug]). */

export const DATA_CONVERTER_SLUGS = [
  "json-csv-converter",
  "xml-json-converter",
  "yaml-json-converter",
  "csv-tsv-converter",
  "html-markdown-converter",
  "base64-text-converter",
  "properties-json-converter",
] as const;

export type DataConverterSlug = (typeof DATA_CONVERTER_SLUGS)[number];

export const IMAGE_CONVERTER_SLUGS = [
  "png-jpg-converter",
  "webp-png-converter",
  "heic-jpg-converter",
  "svg-png-converter",
  "bmp-png-converter",
  "ico-png-converter",
  "tiff-jpg-converter",
] as const;

export type ImageConverterSlug = (typeof IMAGE_CONVERTER_SLUGS)[number];

export const DOCUMENT_CONVERTER_SLUGS = [
  "pdf-text-converter",
  "images-pdf-converter",
  "html-markdown-pdf-converter",
  "pdf-merge-split",
] as const;

export type DocumentConverterSlug = (typeof DOCUMENT_CONVERTER_SLUGS)[number];

export const MEDIA_CONVERTER_SLUGS = [
  "mp4-mp3-converter",
  "wav-mp3-converter",
  "mov-mp4-converter",
  "webm-mp4-converter",
  "ogg-flac-mp3-converter",
] as const;

export type MediaConverterSlug = (typeof MEDIA_CONVERTER_SLUGS)[number];

export const CUSTOM_TOOL_SLUGS = new Set<string>([
  "expense-tracker",
  ...DATA_CONVERTER_SLUGS,
  ...IMAGE_CONVERTER_SLUGS,
  ...DOCUMENT_CONVERTER_SLUGS,
  ...MEDIA_CONVERTER_SLUGS,
]);

export function isDataConverterSlug(slug: string): slug is DataConverterSlug {
  return (DATA_CONVERTER_SLUGS as readonly string[]).includes(slug);
}

export function isImageConverterSlug(slug: string): slug is ImageConverterSlug {
  return (IMAGE_CONVERTER_SLUGS as readonly string[]).includes(slug);
}

export function isDocumentConverterSlug(
  slug: string
): slug is DocumentConverterSlug {
  return (DOCUMENT_CONVERTER_SLUGS as readonly string[]).includes(slug);
}

export function isMediaConverterSlug(slug: string): slug is MediaConverterSlug {
  return (MEDIA_CONVERTER_SLUGS as readonly string[]).includes(slug);
}
