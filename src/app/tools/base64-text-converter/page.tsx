import type { Metadata } from "next";
import { DataCodeConverter } from "@/components/DataCodeConverter";
import {
  buildCustomToolMetadata,
  CustomToolPage,
} from "@/lib/customToolPage";

const SLUG = "base64-text-converter" as const;

export function generateMetadata(): Metadata {
  return buildCustomToolMetadata(SLUG, "Base64 ↔ Text Converter");
}

export default function Page() {
  return (
    <CustomToolPage
      slug={SLUG}
      fallbackTitle="Base64 ↔ Text Converter"
      workspace={<DataCodeConverter slug={SLUG} />}
    />
  );
}
