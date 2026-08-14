import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // FFmpeg.wasm ships ESM workers; keep them external to the RSC bundle.
  serverExternalPackages: ["@ffmpeg/ffmpeg", "@ffmpeg/util"],
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
