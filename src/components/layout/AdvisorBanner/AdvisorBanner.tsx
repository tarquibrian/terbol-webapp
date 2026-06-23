/**
 * @fileoverview AdvisorBanner — server component autónomo para el banner de
 * registro de asesor.
 *
 * Hace fetch directo al endpoint `/advisor-registration` con ISR tag
 * `"advisor-registration"`. Solo las páginas que incluyan este componente
 * se re-renderizan cuando el CMS dispara la revalidación de ese tag.
 *
 * Páginas que lo usan: Home, About, FAQ, Science, Success Plan, Promoter.
 * Páginas que NO lo usan: Products, Blog.
 */

import { cmsApi } from "@/lib/cms-api";
import { normalizeCmsRecordValue, type CmsRecord } from "@/lib/cms-data";
import { Banner, type BannerData, buildWhatsAppUrl } from "@/components/layout/Banner";

/**
 * Server component que obtiene los datos de advisor-registration del CMS
 * y renderiza el Banner.
 */
export async function AdvisorBanner() {
  const data = await getAdvisorRegistrationData();

  if (!data) return null;

  return <Banner data={data} />;
}

// ─── Data fetching ──────────────────────────────────────────────────────────

async function getAdvisorRegistrationData(): Promise<BannerData | undefined> {
  const response = await cmsApi.getAdvisorRegistration();

  const normalized = normalizeCmsRecordValue<CmsRecord>(
    response?.data,
    "advisor-registration",
  );

  if (!normalized) return undefined;

  return normalized as unknown as BannerData;
}

/**
 * Obtiene la URL de WhatsApp del advisor-registration del CMS.
 * Usado por componentes que necesitan la URL sin renderizar el banner completo
 * (por ejemplo, EndBanner).
 */
export async function getAdvisorWhatsAppUrl(): Promise<string | undefined> {
  const data = await getAdvisorRegistrationData();
  return buildWhatsAppUrl(data?.country_code, data?.phone_number);
}
