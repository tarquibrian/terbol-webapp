import type { NextConfig } from "next";
import { securityHeaders } from "./src/config/security-headers";
import { createRemoteImagePatterns } from "./src/config/image-remote-patterns";

// Subpath opcional para ambientes montados bajo una ruta (ej. /qas en staging).
// Vacío en root/Vercel; en el QA self-host se define NEXT_PUBLIC_BASE_PATH=/qas.
// Debe empezar con "/" y no terminar en "/".
const basePath = process.env.NEXT_PUBLIC_BASE_PATH?.trim().replace(/\/$/, "") || undefined;
const deploymentId = process.env.NEXT_DEPLOYMENT_ID?.trim() || undefined;

const nextConfig: NextConfig = {
  output: "standalone",
  ...(basePath ? { basePath } : {}),
  ...(deploymentId ? { deploymentId } : {}),
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
    // Bajo un basePath (ej. /qas en staging) el optimizador de imágenes no
    // antepone el prefijo al fetch interno de imágenes locales, así que estas
    // dan 400 ("received null"). Servirlas sin optimizar hace que Next aplique
    // el basePath al `src` directo y carguen. En root/Vercel (sin basePath) la
    // optimización queda intacta.
    ...(basePath ? { unoptimized: true } : {}),
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24,
    remotePatterns: createRemoteImagePatterns(),
  },
};

export default nextConfig;
