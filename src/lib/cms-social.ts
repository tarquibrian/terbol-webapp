import { isSvgAsset, resolveImageAsset } from "@/lib/image-assets";

export interface CmsSocialNetwork {
  id?: string | number;
  name?: string;
  url?: string;
  order?: string | number;
  icon?: string | null;
}

export function normalizeSocialNetworks(
  socialNetworks?: CmsSocialNetwork[] | null,
): CmsSocialNetwork[] {
  if (!Array.isArray(socialNetworks)) return [];

  return [...socialNetworks]
    .filter((social) => Boolean(social.name && social.url))
    .sort((a, b) => Number(a.order ?? 0) - Number(b.order ?? 0));
}

export function resolveCmsAsset(path?: string | null): string | null {
  return resolveImageAsset(path);
}

export { isSvgAsset };
