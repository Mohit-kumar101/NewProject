import type { Metadata } from "next";
import { DataCodeConverter } from "@/components/DataCodeConverter";
import {
  buildCustomToolMetadata,
  CustomToolPage,
} from "@/lib/customToolPage";

const SLUG = "xml-json-converter" as const;

export function generateMetadata(): Metadata {
  return buildCustomToolMetadata(SLUG, "XML ↔ JSON Converter");
}

export default function Page() {
  return (
    <CustomToolPage
      slug={SLUG}
      fallbackTitle="XML ↔ JSON Converter"
      workspace={<DataCodeConverter slug={SLUG} />}
    />
  );
}
