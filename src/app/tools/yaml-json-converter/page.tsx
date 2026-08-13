import type { Metadata } from "next";
import { DataCodeConverter } from "@/components/DataCodeConverter";
import {
  buildCustomToolMetadata,
  CustomToolPage,
} from "@/lib/customToolPage";

const SLUG = "yaml-json-converter" as const;

export function generateMetadata(): Metadata {
  return buildCustomToolMetadata(SLUG, "YAML ↔ JSON Converter");
}

export default function Page() {
  return (
    <CustomToolPage
      slug={SLUG}
      fallbackTitle="YAML ↔ JSON Converter"
      workspace={<DataCodeConverter slug={SLUG} />}
    />
  );
}
