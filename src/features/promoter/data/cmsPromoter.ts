import { isSvgAsset, resolveImageAsset } from "@/lib/image-assets";

export interface PromoterHeader {
  label?: string;
  subtitle?: string;
  title?: string;
  description?: string;
  legend?: string;
  requirement_title?: string;
  image?: string | null;
  image_url?: string | null;
}

export interface PromoterDetail {
  id?: string | number;
  order?: string | number;
  label?: string;
  subtitle?: string;
  title?: string;
  description?: string;
  icon?: string | null;
  image?: string | null;
  image_url?: string | null;
}

export interface PromoterSection {
  header?: PromoterHeader;
  details?: PromoterDetail[];
}

export interface PromoterRequirements {
  header?: PromoterHeader;
  items?: PromoterDetail[];
}

export interface PromoterAffiliationProcess {
  header?: PromoterHeader;
  steps?: PromoterDetail[];
}

export interface PromoterSocialNetwork {
  id?: string | number;
  name?: string;
  url?: string;
  order?: string | number;
  icon?: string | null;
}

export interface PromoterPageData {
  cover_section?: PromoterSection;
  meaning?: PromoterSection;
  why_be?: PromoterSection;
  requirements?: PromoterRequirements;
  affiliation_process?: PromoterAffiliationProcess;
}

export function resolvePromoterAsset(
  path?: string | null,
  fallback = "/images/image19.png",
): string {
  return resolveImageAsset(path, fallback) ?? fallback;
}

export { isSvgAsset };

export function sortByOrder<T extends { order?: string | number }>(
  items?: T[] | null,
): T[] {
  if (!Array.isArray(items)) return [];

  return [...items].sort((a, b) => {
    const orderA = Number(a.order ?? 0);
    const orderB = Number(b.order ?? 0);

    return orderA - orderB;
  });
}
