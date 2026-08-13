import {
  MEDIA_CONVERTER_SLUGS,
  type MediaConverterSlug,
} from "@/lib/customToolSlugs";
import type { MediaFormat } from "@/lib/mediaConverters";

export type { MediaConverterSlug };
export { MEDIA_CONVERTER_SLUGS } from "@/lib/customToolSlugs";

export type MediaDirection = {
  id: string;
  label: string;
  from: MediaFormat;
  to: MediaFormat;
  accept: string;
  hint: string;
};

export type MediaConverterToolConfig = {
  slug: MediaConverterSlug;
  formulaType: string;
  title: string;
  directions: MediaDirection[];
};

export const MEDIA_CONVERTER_TOOLS: Record<
  MediaConverterSlug,
  MediaConverterToolConfig
> = {
  "mp4-mp3-converter": {
    slug: "mp4-mp3-converter",
    formulaType: "mp4Mp3Converter",
    title: "MP4 ↔ MP3 Converter",
    directions: [
      {
        id: "mp4-to-mp3",
        label: "MP4 → MP3",
        from: "mp4",
        to: "mp3",
        accept: ".mp4,video/mp4",
        hint: "Extracts audio from MP4 and encodes MP3 locally with FFmpeg.wasm.",
      },
      {
        id: "mp3-to-mp4",
        label: "MP3 → MP4",
        from: "mp3",
        to: "mp4",
        accept: ".mp3,audio/mpeg,audio/mp3",
        hint: "Wraps MP3 audio into an MP4 (AAC) container—no video track.",
      },
    ],
  },
  "wav-mp3-converter": {
    slug: "wav-mp3-converter",
    formulaType: "wavMp3Converter",
    title: "WAV ↔ MP3 Converter",
    directions: [
      {
        id: "wav-to-mp3",
        label: "WAV → MP3",
        from: "wav",
        to: "mp3",
        accept: ".wav,audio/wav,audio/x-wav,audio/wave",
        hint: "Compresses WAV to MP3 at 192 kbps in your browser.",
      },
      {
        id: "mp3-to-wav",
        label: "MP3 → WAV",
        from: "mp3",
        to: "wav",
        accept: ".mp3,audio/mpeg,audio/mp3",
        hint: "Decodes MP3 to 16-bit PCM WAV for editing workflows.",
      },
    ],
  },
  "mov-mp4-converter": {
    slug: "mov-mp4-converter",
    formulaType: "movMp4Converter",
    title: "MOV ↔ MP4 Converter",
    directions: [
      {
        id: "mov-to-mp4",
        label: "MOV → MP4",
        from: "mov",
        to: "mp4",
        accept: ".mov,video/quicktime",
        hint: "Re-encodes QuickTime MOV to MP4 (H.264/AAC) via FFmpeg.wasm.",
      },
      {
        id: "mp4-to-mov",
        label: "MP4 → MOV",
        from: "mp4",
        to: "mov",
        accept: ".mp4,video/mp4",
        hint: "Converts MP4 into a QuickTime MOV container locally.",
      },
    ],
  },
  "webm-mp4-converter": {
    slug: "webm-mp4-converter",
    formulaType: "webmMp4Converter",
    title: "WebM ↔ MP4 Converter",
    directions: [
      {
        id: "webm-to-mp4",
        label: "WebM → MP4",
        from: "webm",
        to: "mp4",
        accept: ".webm,video/webm",
        hint: "Transcodes WebM to MP4 for broader device playback.",
      },
      {
        id: "mp4-to-webm",
        label: "MP4 → WebM",
        from: "mp4",
        to: "webm",
        accept: ".mp4,video/mp4",
        hint: "Encodes MP4 to WebM (VP9/Opus) entirely on-device.",
      },
    ],
  },
  "ogg-flac-mp3-converter": {
    slug: "ogg-flac-mp3-converter",
    formulaType: "oggFlacMp3Converter",
    title: "OGG / FLAC to MP3 Converter",
    directions: [
      {
        id: "ogg-to-mp3",
        label: "OGG → MP3",
        from: "ogg",
        to: "mp3",
        accept: ".ogg,.oga,audio/ogg,application/ogg",
        hint: "Converts Ogg Vorbis audio to MP3 with FFmpeg.wasm.",
      },
      {
        id: "flac-to-mp3",
        label: "FLAC → MP3",
        from: "flac",
        to: "mp3",
        accept: ".flac,audio/flac,audio/x-flac",
        hint: "Compresses lossless FLAC to MP3 at 192 kbps locally.",
      },
    ],
  },
};

export function getMediaConverterTool(
  slug: string
): MediaConverterToolConfig | undefined {
  if ((MEDIA_CONVERTER_SLUGS as readonly string[]).includes(slug)) {
    return MEDIA_CONVERTER_TOOLS[slug as MediaConverterSlug];
  }
  return undefined;
}
