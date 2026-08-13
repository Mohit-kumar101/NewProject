import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // FFmpeg.wasm ships ESM workers; keep them external to the RSC bundle.
  serverExternalPackages: ["@ffmpeg/ffmpeg", "@ffmpeg/util"],
};

export default nextConfig;
