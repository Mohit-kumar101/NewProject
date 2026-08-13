import type { Metadata } from "next";
import { ImageFileConverter } from "@/components/ImageFileConverter";
import {
  buildCustomToolMetadata,
  CustomToolPage,
} from "@/lib/customToolPage";

const SLUG = "ico-png-converter" as const;

export function generateMetadata(): Metadata {
  return buildCustomToolMetadata(SLUG, "ICO ↔ PNG Converter (Favicon)");
}

export default function Page() {
  return (
    <CustomToolPage
      slug={SLUG}
      fallbackTitle="ICO ↔ PNG Converter (Favicon)"
      workspace={<ImageFileConverter slug={SLUG} />}
    />
  );
}
