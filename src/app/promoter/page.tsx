/**
 * @fileoverview Página Asesor de Ventas / Promotora — punto de entrada de la ruta `/promoter`.
 */

import type { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import { AsesorVentasView } from "@/features/promoter/views/AsesorVentasView";
import { cmsApi } from "@/lib/cms-api";
import { CMS_PAGE_SCHEMAS } from "@/lib/cms-data";
import { getOptionalCmsPageData } from "@/lib/cms-page-data";
import { createPageMetadata, SEO_IMAGES } from "@/lib/seo";
import type { PromoterPageData } from "@/features/promoter/data/cmsPromoter";

export const metadata: Metadata = createPageMetadata({
  title: "Quiero ser promotora",
  description:
    "Únete como promotora / asesora de ventas y forma parte de nuestra comunidad de bienestar.",
  path: "/promoter",
  image: SEO_IMAGES.promoter,
});

export default async function PromoterPage() {
  const promoterData = await getOptionalCmsPageData<PromoterPageData>(
    () => cmsApi.getPromoter(),
    CMS_PAGE_SCHEMAS.promoter,
    "promoter",
  );

  return (
    <PageLayout>
      <AsesorVentasView data={promoterData} />
    </PageLayout>
  );
}
