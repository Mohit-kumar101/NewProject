import type { Metadata } from "next";
import { DataCodeConverter } from "@/components/DataCodeConverter";
import {
  buildCustomToolMetadata,
  CustomToolPage,
} from "@/lib/customToolPage";

const SLUG = "properties-json-converter" as const;

export function generateMetadata(): Metadata {
  return buildCustomToolMetadata(SLUG, "Properties ↔ JSON Converter");
}

export default function Page() {
  return (
    <CustomToolPage
      slug={SLUG}
      fallbackTitle="Properties ↔ JSON Converter"
      workspace={<DataCodeConverter slug={SLUG} />}
    />
  );
}
