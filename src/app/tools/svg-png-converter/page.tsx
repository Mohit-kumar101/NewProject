import type { Metadata } from "next";
import { ImageFileConverter } from "@/components/ImageFileConverter";
import {
  buildCustomToolMetadata,
  CustomToolPage,
} from "@/lib/customToolPage";

const SLUG = "svg-png-converter" as const;

export function generateMetadata(): Metadata {
  return buildCustomToolMetadata(SLUG, "SVG ↔ PNG Converter");
}

export default function Page() {
  return (
    <CustomToolPage
      slug={SLUG}
      fallbackTitle="SVG ↔ PNG Converter"
      workspace={<ImageFileConverter slug={SLUG} />}
    />
  );
}
