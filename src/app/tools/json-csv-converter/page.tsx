import type { Metadata } from "next";
import { DataCodeConverter } from "@/components/DataCodeConverter";
import {
  buildCustomToolMetadata,
  CustomToolPage,
} from "@/lib/customToolPage";

const SLUG = "json-csv-converter" as const;

export function generateMetadata(): Metadata {
  return buildCustomToolMetadata(SLUG, "JSON ↔ CSV Converter");
}

export default function Page() {
  return (
    <CustomToolPage
      slug={SLUG}
      fallbackTitle="JSON ↔ CSV Converter"
      workspace={<DataCodeConverter slug={SLUG} />}
    />
  );
}
