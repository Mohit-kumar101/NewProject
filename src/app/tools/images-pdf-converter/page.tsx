import type { Metadata } from "next";
import { DocumentFileConverter } from "@/components/DocumentFileConverter";
import {
  buildCustomToolMetadata,
  CustomToolPage,
} from "@/lib/customToolPage";

const SLUG = "images-pdf-converter" as const;

export function generateMetadata(): Metadata {
  return buildCustomToolMetadata(SLUG, "Images ↔ PDF Converter");
}

export default function Page() {
  return (
    <CustomToolPage
      slug={SLUG}
      fallbackTitle="Images ↔ PDF Converter"
      workspace={<DocumentFileConverter slug={SLUG} />}
    />
  );
}
