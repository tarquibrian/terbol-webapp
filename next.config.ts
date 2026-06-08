import type { NextConfig } from "next";
import { securityHeaders } from "./src/config/security-headers";
import { createRemoteImagePatterns } from "./src/config/image-remote-patterns";

const nextConfig: NextConfig = {
  reactCompiler: true,
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [...securityHeaders],
      },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24,
    remotePatterns: createRemoteImagePatterns(),
  },
};

export default nextConfig;
