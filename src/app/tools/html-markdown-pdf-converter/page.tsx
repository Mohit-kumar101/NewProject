import type { Metadata } from "next";
import { DocumentFileConverter } from "@/components/DocumentFileConverter";
import {
  buildCustomToolMetadata,
  CustomToolPage,
} from "@/lib/customToolPage";

const SLUG = "html-markdown-pdf-converter" as const;

export function generateMetadata(): Metadata {
  return buildCustomToolMetadata(SLUG, "HTML / Markdown to PDF");
}

export default function Page() {
  return (
    <CustomToolPage
      slug={SLUG}
      fallbackTitle="HTML / Markdown to PDF"
      workspace={<DocumentFileConverter slug={SLUG} />}
    />
  );
}
