import type { Metadata } from "next";
import { MediaFileConverter } from "@/components/MediaFileConverter";
import {
  buildCustomToolMetadata,
  CustomToolPage,
} from "@/lib/customToolPage";

const SLUG = "wav-mp3-converter" as const;

export function generateMetadata(): Metadata {
  return buildCustomToolMetadata(SLUG, "WAV ↔ MP3 Converter");
}

export default function Page() {
  return (
    <CustomToolPage
      slug={SLUG}
      fallbackTitle="WAV ↔ MP3 Converter"
      workspace={<MediaFileConverter slug={SLUG} />}
    />
  );
}
