import { env } from "@/config/env";
import { BASE_PATH } from "@/lib/base-path";

const LOCAL_PUBLIC_ASSET_PREFIXES = [
  "/about/",
  "/banner/",
  "/categories/",
  "/homegrid/",
  "/images/",
  "/product/",
  "/producthome/",
  "/logo-",
  "/favicon",
  "/gradientradius.png",
] as const;

function isRemoteAsset(path: string) {
  return /^https?:\/\//.test(path) || path.startsWith("data:");
}

function isLocalPublicAsset(path: string) {
  return LOCAL_PUBLIC_ASSET_PREFIXES.some((prefix) => path.startsWith(prefix));
}

export function resolveImageAsset(
  path?: string | null,
  fallback?: string | null,
): string | null {
  const assetPath = path?.trim() || fallback?.trim();

  if (!assetPath) return null;
  if (isRemoteAsset(assetPath)) return assetPath;
  // Assets locales de /public: anteponer el basePath (ej. /qas) para que carguen
  // bajo un subpath. En root, BASE_PATH es "" y queda igual.
  if (isLocalPublicAsset(assetPath)) return `${BASE_PATH}${assetPath}`;

  const cleanPath = assetPath.replace(/^\/+/, "").replace(/^storage\//, "");
  const baseStorage = env.STORAGE_URL.endsWith("/")
    ? env.STORAGE_URL
    : `${env.STORAGE_URL}/`;

  return `${baseStorage}${cleanPath}`;
}

export function isSvgAsset(path?: string | null): boolean {
  return Boolean(path?.split("?")[0]?.toLowerCase().endsWith(".svg"));
}
