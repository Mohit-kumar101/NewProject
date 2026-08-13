import type { Metadata } from "next";
import { ImageFileConverter } from "@/components/ImageFileConverter";
import {
  buildCustomToolMetadata,
  CustomToolPage,
} from "@/lib/customToolPage";

const SLUG = "heic-jpg-converter" as const;

export function generateMetadata(): Metadata {
  return buildCustomToolMetadata(SLUG, "HEIC/HEIF to JPG Converter");
}

export default function Page() {
  return (
    <CustomToolPage
      slug={SLUG}
      fallbackTitle="HEIC/HEIF to JPG Converter"
      workspace={<ImageFileConverter slug={SLUG} />}
    />
  );
}
