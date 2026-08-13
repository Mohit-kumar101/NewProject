import type { Metadata } from "next";
import { ImageFileConverter } from "@/components/ImageFileConverter";
import {
  buildCustomToolMetadata,
  CustomToolPage,
} from "@/lib/customToolPage";

const SLUG = "png-jpg-converter" as const;

export function generateMetadata(): Metadata {
  return buildCustomToolMetadata(SLUG, "PNG ↔ JPG Converter");
}

export default function Page() {
  return (
    <CustomToolPage
      slug={SLUG}
      fallbackTitle="PNG ↔ JPG Converter"
      workspace={<ImageFileConverter slug={SLUG} />}
    />
  );
}
