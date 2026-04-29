import { env } from "@/config/env";

export interface CmsSocialNetwork {
  id?: string | number;
  name?: string;
  url?: string;
  order?: string | number;
  icon?: string | null;
}

export function normalizeSocialNetworks(
  socialNetworks?: CmsSocialNetwork[],
): CmsSocialNetwork[] {
  return [...(socialNetworks ?? [])]
    .filter((social) => Boolean(social.name && social.url))
    .sort((a, b) => Number(a.order ?? 0) - Number(b.order ?? 0));
}

export function resolveCmsAsset(path?: string | null): string | null {
  if (!path) return null;
  if (/^https?:\/\//.test(path) || path.startsWith("data:")) return path;
  if (path.startsWith("/")) return path;

  const baseStorage = env.STORAGE_URL.endsWith("/")
    ? env.STORAGE_URL
    : `${env.STORAGE_URL}/`;

  return `${baseStorage}${path}`;
}

export function isSvgAsset(path?: string | null): boolean {
  return Boolean(path?.split("?")[0]?.toLowerCase().endsWith(".svg"));
}
