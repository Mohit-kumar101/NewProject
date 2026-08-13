import type { Metadata } from "next";
import { MediaFileConverter } from "@/components/MediaFileConverter";
import {
  buildCustomToolMetadata,
  CustomToolPage,
} from "@/lib/customToolPage";

const SLUG = "mov-mp4-converter" as const;

export function generateMetadata(): Metadata {
  return buildCustomToolMetadata(SLUG, "MOV ↔ MP4 Converter");
}

export default function Page() {
  return (
    <CustomToolPage
      slug={SLUG}
      fallbackTitle="MOV ↔ MP4 Converter"
      workspace={<MediaFileConverter slug={SLUG} />}
    />
  );
}
