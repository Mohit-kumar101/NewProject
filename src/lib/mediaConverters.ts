/**
 * Client-side audio/video conversion via FFmpeg.wasm.
 */

import { fetchFile } from "@ffmpeg/util";
import { ensureFfmpeg, resetFfmpegFs } from "@/lib/ffmpegClient";

export class MediaConvertError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MediaConvertError";
  }
}

export type MediaFormat =
  | "mp4"
  | "mp3"
  | "wav"
  | "mov"
  | "webm"
  | "ogg"
  | "flac";

export type MediaConvertResult = {
  blob: Blob;
  filename: string;
  mimeType: string;
  extension: string;
};

const MIME: Record<MediaFormat, string> = {
  mp4: "video/mp4",
  mp3: "audio/mpeg",
  wav: "audio/wav",
  mov: "video/quicktime",
  webm: "video/webm",
  ogg: "audio/ogg",
  flac: "audio/flac",
};

function safeBaseName(name: string): string {
  const base = name.replace(/\.[^.]+$/, "") || "converted";
  return base.replace(/[^\w.-]+/g, "_").slice(0, 80);
}

function buildArgs(
  inputName: string,
  outputName: string,
  from: MediaFormat,
  to: MediaFormat
): string[] {
  // Prefer re-encode for broad compatibility inside the WASM build.
  if (to === "mp3") {
    return [
      "-i",
      inputName,
      "-vn",
      "-acodec",
      "libmp3lame",
      "-b:a",
      "192k",
      outputName,
    ];
  }

  if (to === "wav") {
    return ["-i", inputName, "-vn", "-acodec", "pcm_s16le", outputName];
  }

  if (from === "mp3" && to === "mp4") {
    // Audio-only MP4 (AAC) — valid container without a video track.
    return [
      "-i",
      inputName,
      "-c:a",
      "aac",
      "-b:a",
      "192k",
      "-movflags",
      "+faststart",
      outputName,
    ];
  }

  if (to === "mp4") {
    return [
      "-i",
      inputName,
      "-c:v",
      "libx264",
      "-preset",
      "ultrafast",
      "-crf",
      "28",
      "-c:a",
      "aac",
      "-b:a",
      "128k",
      "-movflags",
      "+faststart",
      outputName,
    ];
  }

  if (to === "mov") {
    return [
      "-i",
      inputName,
      "-c:v",
      "libx264",
      "-preset",
      "ultrafast",
      "-crf",
      "28",
      "-c:a",
      "aac",
      "-b:a",
      "128k",
      outputName,
    ];
  }

  if (to === "webm") {
    return [
      "-i",
      inputName,
      "-c:v",
      "libvpx-vp9",
      "-b:v",
      "0",
      "-crf",
      "35",
      "-c:a",
      "libopus",
      "-b:a",
      "96k",
      outputName,
    ];
  }

  return ["-i", inputName, outputName];
}

/** Fallback args when GPL encoders are unavailable in the core build. */
function fallbackArgs(
  inputName: string,
  outputName: string,
  to: MediaFormat
): string[] | null {
  if (to === "mp3") {
    return ["-i", inputName, "-vn", "-c:a", "aac", "-b:a", "192k", outputName.replace(/\.mp3$/i, ".m4a")];
  }
  if (to === "mp4" || to === "mov") {
    return [
      "-i",
      inputName,
      "-c:v",
      "copy",
      "-c:a",
      "aac",
      "-movflags",
      "+faststart",
      outputName,
    ];
  }
  if (to === "webm") {
    return ["-i", inputName, "-c:v", "libvpx", "-c:a", "libvorbis", outputName];
  }
  return null;
}

export async function convertMediaFile(
  file: File,
  from: MediaFormat,
  to: MediaFormat
): Promise<MediaConvertResult> {
  const ffmpeg = await ensureFfmpeg();
  const base = safeBaseName(file.name);
  const inputName = `input_${Date.now()}.${from}`;
  let outputExt: string = to;
  let outputName = `output_${Date.now()}.${outputExt}`;
  let mimeType = MIME[to];
  let extension = to === "mp3" ? "mp3" : to;

  await ffmpeg.writeFile(inputName, await fetchFile(file));

  let args = buildArgs(inputName, outputName, from, to);
  let code = await ffmpeg.exec(args);

  if (code !== 0) {
    const fb = fallbackArgs(inputName, outputName, to);
    if (!fb) {
      await resetFfmpegFs([inputName, outputName]);
      throw new MediaConvertError(
        "FFmpeg could not convert this file. Try another format or a smaller clip."
      );
    }
    // Adjust output for AAC fallback when lame is missing
    if (to === "mp3" && fb[fb.length - 1].endsWith(".m4a")) {
      outputName = fb[fb.length - 1];
      outputExt = "m4a";
      mimeType = "audio/mp4";
      extension = "m4a";
    }
    args = fb;
    code = await ffmpeg.exec(args);
    if (code !== 0) {
      await resetFfmpegFs([inputName, outputName]);
      throw new MediaConvertError(
        "Conversion failed. The WASM build may lack an encoder for this pair—try a shorter file or different format."
      );
    }
  }

  const data = await ffmpeg.readFile(outputName);
  await resetFfmpegFs([inputName, outputName]);

  const bytes =
    typeof data === "string"
      ? new TextEncoder().encode(data)
      : new Uint8Array(data as Uint8Array);
  const blob = new Blob([bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength)], {
    type: mimeType,
  });

  return {
    blob,
    filename: `${base}.${extension}`,
    mimeType,
    extension,
  };
}
