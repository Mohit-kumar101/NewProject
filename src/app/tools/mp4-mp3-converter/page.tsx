import type { Metadata } from "next";
import { MediaFileConverter } from "@/components/MediaFileConverter";
import {
  buildCustomToolMetadata,
  CustomToolPage,
} from "@/lib/customToolPage";

const SLUG = "mp4-mp3-converter" as const;

export function generateMetadata(): Metadata {
  return buildCustomToolMetadata(SLUG, "MP4 ↔ MP3 Converter");
}

export default function Page() {
  return (
    <CustomToolPage
      slug={SLUG}
      fallbackTitle="MP4 ↔ MP3 Converter"
      workspace={<MediaFileConverter slug={SLUG} />}
    />
  );
}
