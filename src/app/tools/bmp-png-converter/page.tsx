import type { Metadata } from "next";
import { ImageFileConverter } from "@/components/ImageFileConverter";
import {
  buildCustomToolMetadata,
  CustomToolPage,
} from "@/lib/customToolPage";

const SLUG = "bmp-png-converter" as const;

export function generateMetadata(): Metadata {
  return buildCustomToolMetadata(SLUG, "BMP ↔ PNG Converter");
}

export default function Page() {
  return (
    <CustomToolPage
      slug={SLUG}
      fallbackTitle="BMP ↔ PNG Converter"
      workspace={<ImageFileConverter slug={SLUG} />}
    />
  );
}
