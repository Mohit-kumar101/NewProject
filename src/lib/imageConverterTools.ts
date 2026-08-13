import type { ImageFormat } from "@/lib/imageConverters";
import {
  IMAGE_CONVERTER_SLUGS,
  type ImageConverterSlug,
} from "@/lib/customToolSlugs";

export type { ImageConverterSlug };
export { IMAGE_CONVERTER_SLUGS } from "@/lib/customToolSlugs";

export type ImageConverterDirection = {
  id: string;
  label: string;
  fromLabel: string;
  toLabel: string;
  accept: string;
  target: ImageFormat;
  /** Show JPEG/WebP quality slider. */
  showQuality?: boolean;
  /** Show favicon size checkboxes. */
  showIcoSizes?: boolean;
  /** Note shown under controls. */
  note?: string;
};

export type ImageConverterToolConfig = {
  slug: ImageConverterSlug;
  formulaType: string;
  title: string;
  directions: ImageConverterDirection[];
};

export const IMAGE_CONVERTER_TOOLS: Record<
  ImageConverterSlug,
  ImageConverterToolConfig
> = {
  "png-jpg-converter": {
    slug: "png-jpg-converter",
    formulaType: "pngJpgConverter",
    title: "PNG ↔ JPG Converter",
    directions: [
      {
        id: "png-to-jpg",
        label: "PNG → JPG",
        fromLabel: "PNG",
        toLabel: "JPG",
        accept: ".png,image/png",
        target: "jpeg",
        showQuality: true,
        note: "Transparent pixels are filled with the background color.",
      },
      {
        id: "jpg-to-png",
        label: "JPG → PNG",
        fromLabel: "JPG",
        toLabel: "PNG",
        accept: ".jpg,.jpeg,image/jpeg",
        target: "png",
      },
    ],
  },
  "webp-png-converter": {
    slug: "webp-png-converter",
    formulaType: "webpPngConverter",
    title: "WEBP ↔ PNG Converter",
    directions: [
      {
        id: "webp-to-png",
        label: "WEBP → PNG",
        fromLabel: "WEBP",
        toLabel: "PNG",
        accept: ".webp,image/webp",
        target: "png",
      },
      {
        id: "png-to-webp",
        label: "PNG → WEBP",
        fromLabel: "PNG",
        toLabel: "WEBP",
        accept: ".png,image/png",
        target: "webp",
        showQuality: true,
      },
    ],
  },
  "heic-jpg-converter": {
    slug: "heic-jpg-converter",
    formulaType: "heicJpgConverter",
    title: "HEIC/HEIF to JPG Converter",
    directions: [
      {
        id: "heic-to-jpg",
        label: "HEIC → JPG",
        fromLabel: "HEIC/HEIF",
        toLabel: "JPG",
        accept: ".heic,.heif,image/heic,image/heif,image/heic-sequence",
        target: "jpeg",
        showQuality: true,
        note: "Decoded locally with heic2any, then encoded via Canvas.",
      },
    ],
  },
  "svg-png-converter": {
    slug: "svg-png-converter",
    formulaType: "svgPngConverter",
    title: "SVG ↔ PNG Converter",
    directions: [
      {
        id: "svg-to-png",
        label: "SVG → PNG",
        fromLabel: "SVG",
        toLabel: "PNG",
        accept: ".svg,image/svg+xml",
        target: "png",
        note: "Rasterizes vectors at your chosen size.",
      },
      {
        id: "png-to-svg",
        label: "PNG → SVG",
        fromLabel: "PNG",
        toLabel: "SVG",
        accept: ".png,image/png",
        target: "svg",
        note: "Embeds the PNG inside an SVG wrapper (no vector tracing).",
      },
    ],
  },
  "bmp-png-converter": {
    slug: "bmp-png-converter",
    formulaType: "bmpPngConverter",
    title: "BMP ↔ PNG Converter",
    directions: [
      {
        id: "bmp-to-png",
        label: "BMP → PNG",
        fromLabel: "BMP",
        toLabel: "PNG",
        accept: ".bmp,image/bmp,image/x-ms-bmp",
        target: "png",
      },
      {
        id: "png-to-bmp",
        label: "PNG → BMP",
        fromLabel: "PNG",
        toLabel: "BMP",
        accept: ".png,image/png",
        target: "bmp",
        note: "Exports 24-bit BMP with an opaque background fill.",
      },
    ],
  },
  "ico-png-converter": {
    slug: "ico-png-converter",
    formulaType: "icoPngConverter",
    title: "ICO ↔ PNG Converter (Favicon)",
    directions: [
      {
        id: "ico-to-png",
        label: "ICO → PNG",
        fromLabel: "ICO",
        toLabel: "PNG",
        accept: ".ico,image/x-icon,image/vnd.microsoft.icon",
        target: "png",
        note: "Extracts the largest icon frame as PNG.",
      },
      {
        id: "png-to-ico",
        label: "PNG → ICO",
        fromLabel: "PNG",
        toLabel: "ICO",
        accept: ".png,image/png",
        target: "ico",
        showIcoSizes: true,
        note: "Builds a multi-size favicon ICO from your PNG.",
      },
    ],
  },
  "tiff-jpg-converter": {
    slug: "tiff-jpg-converter",
    formulaType: "tiffJpgConverter",
    title: "TIFF ↔ JPG Converter",
    directions: [
      {
        id: "tiff-to-jpg",
        label: "TIFF → JPG",
        fromLabel: "TIFF",
        toLabel: "JPG",
        accept: ".tif,.tiff,image/tiff,image/tif",
        target: "jpeg",
        showQuality: true,
        note: "Decoded locally with UTIF, then encoded via Canvas.",
      },
      {
        id: "jpg-to-tiff",
        label: "JPG → TIFF",
        fromLabel: "JPG",
        toLabel: "TIFF",
        accept: ".jpg,.jpeg,image/jpeg",
        target: "tiff",
      },
    ],
  },
};

export function getImageConverterTool(
  slug: string
): ImageConverterToolConfig | undefined {
  if ((IMAGE_CONVERTER_SLUGS as readonly string[]).includes(slug)) {
    return IMAGE_CONVERTER_TOOLS[slug as ImageConverterSlug];
  }
  return undefined;
}
