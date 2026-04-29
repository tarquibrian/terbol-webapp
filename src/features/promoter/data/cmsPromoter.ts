import { env } from "@/config/env";

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
  advisor_registration?: {
    title?: string;
    description?: string;
    button_label?: string;
    button_url?: string;
    email?: string;
    country_code?: string;
    phone_number?: string;
    image?: string;
  };
  social_networks?: PromoterSocialNetwork[];
}

export function resolvePromoterAsset(
  path?: string | null,
  fallback = "/images/image19.png",
): string {
  if (!path) return fallback;
  if (/^https?:\/\//.test(path) || path.startsWith("data:")) return path;
  if (path.startsWith("/")) return path;

  const baseStorage = env.STORAGE_URL.endsWith("/")
    ? env.STORAGE_URL
    : `${env.STORAGE_URL}/`;

  return `${baseStorage}${path}`;
}

export function isSvgAsset(path?: string): boolean {
  return Boolean(path?.split("?")[0]?.toLowerCase().endsWith(".svg"));
}

export function sortByOrder<T extends { order?: string | number }>(
  items?: T[],
): T[] {
  return [...(items ?? [])].sort((a, b) => {
    const orderA = Number(a.order ?? 0);
    const orderB = Number(b.order ?? 0);

    return orderA - orderB;
  });
}
