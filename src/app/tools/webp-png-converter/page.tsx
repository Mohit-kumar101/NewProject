import type { Metadata } from "next";
import { ImageFileConverter } from "@/components/ImageFileConverter";
import {
  buildCustomToolMetadata,
  CustomToolPage,
} from "@/lib/customToolPage";

const SLUG = "webp-png-converter" as const;

export function generateMetadata(): Metadata {
  return buildCustomToolMetadata(SLUG, "WEBP ↔ PNG Converter");
}

export default function Page() {
  return (
    <CustomToolPage
      slug={SLUG}
      fallbackTitle="WEBP ↔ PNG Converter"
      workspace={<ImageFileConverter slug={SLUG} />}
    />
  );
}
