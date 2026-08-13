import type { Metadata } from "next";
import { DocumentFileConverter } from "@/components/DocumentFileConverter";
import {
  buildCustomToolMetadata,
  CustomToolPage,
} from "@/lib/customToolPage";

const SLUG = "pdf-text-converter" as const;

export function generateMetadata(): Metadata {
  return buildCustomToolMetadata(SLUG, "PDF ↔ Text Converter");
}

export default function Page() {
  return (
    <CustomToolPage
      slug={SLUG}
      fallbackTitle="PDF ↔ Text Converter"
      workspace={<DocumentFileConverter slug={SLUG} />}
    />
  );
}
