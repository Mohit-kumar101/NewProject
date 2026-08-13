import type { Metadata } from "next";
import { ImageFileConverter } from "@/components/ImageFileConverter";
import {
  buildCustomToolMetadata,
  CustomToolPage,
} from "@/lib/customToolPage";

const SLUG = "tiff-jpg-converter" as const;

export function generateMetadata(): Metadata {
  return buildCustomToolMetadata(SLUG, "TIFF ↔ JPG Converter");
}

export default function Page() {
  return (
    <CustomToolPage
      slug={SLUG}
      fallbackTitle="TIFF ↔ JPG Converter"
      workspace={<ImageFileConverter slug={SLUG} />}
    />
  );
}
