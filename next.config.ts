import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // FFmpeg.wasm ships ESM workers; keep them external to the RSC bundle.
  serverExternalPackages: ["@ffmpeg/ffmpeg", "@ffmpeg/util"],
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      { source: "/vaultline", destination: "/", permanent: true },
      { source: "/vaultline/:path*", destination: "/", permanent: true },
      { source: "/savewise", destination: "/", permanent: true },
      { source: "/savewise/:path*", destination: "/", permanent: true },
      { source: "/crypto/token-creator", destination: "/crypto", permanent: true },
      { source: "/presentation", destination: "/", permanent: true },
      { source: "/presentation/:path*", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
