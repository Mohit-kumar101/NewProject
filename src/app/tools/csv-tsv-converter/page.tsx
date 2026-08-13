import type { Metadata } from "next";
import { DataCodeConverter } from "@/components/DataCodeConverter";
import {
  buildCustomToolMetadata,
  CustomToolPage,
} from "@/lib/customToolPage";

const SLUG = "csv-tsv-converter" as const;

export function generateMetadata(): Metadata {
  return buildCustomToolMetadata(SLUG, "CSV ↔ TSV Converter");
}

export default function Page() {
  return (
    <CustomToolPage
      slug={SLUG}
      fallbackTitle="CSV ↔ TSV Converter"
      workspace={<DataCodeConverter slug={SLUG} />}
    />
  );
}
