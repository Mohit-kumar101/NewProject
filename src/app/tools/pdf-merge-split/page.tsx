import type { Metadata } from "next";
import { DocumentFileConverter } from "@/components/DocumentFileConverter";
import {
  buildCustomToolMetadata,
  CustomToolPage,
} from "@/lib/customToolPage";

const SLUG = "pdf-merge-split" as const;

export function generateMetadata(): Metadata {
  return buildCustomToolMetadata(SLUG, "PDF Merger & Splitter");
}

export default function Page() {
  return (
    <CustomToolPage
      slug={SLUG}
      fallbackTitle="PDF Merger & Splitter"
      workspace={<DocumentFileConverter slug={SLUG} />}
    />
  );
}
