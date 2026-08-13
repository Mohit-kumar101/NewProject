import type { Metadata } from "next";
import { DataCodeConverter } from "@/components/DataCodeConverter";
import {
  buildCustomToolMetadata,
  CustomToolPage,
} from "@/lib/customToolPage";

const SLUG = "html-markdown-converter" as const;

export function generateMetadata(): Metadata {
  return buildCustomToolMetadata(SLUG, "HTML ↔ Markdown Converter");
}

export default function Page() {
  return (
    <CustomToolPage
      slug={SLUG}
      fallbackTitle="HTML ↔ Markdown Converter"
      workspace={<DataCodeConverter slug={SLUG} />}
    />
  );
}
