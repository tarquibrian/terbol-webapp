/**
 * @fileoverview Página Asesor de Ventas / Promotora — punto de entrada de la ruta `/promoter`.
 */

import type { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import { AsesorVentasView } from "@/features/promoter/views/AsesorVentasView";
import { cmsApi } from "@/lib/cms-api";
import type { PromoterPageData } from "@/features/promoter/data/cmsPromoter";

export const metadata: Metadata = {
  title: "Quiero ser Promotora | Terbol Inspira",
  description:
    "Únete como promotora / asesora de ventas y forma parte de nuestra comunidad de bienestar.",
};

export default async function PromoterPage() {
  const promoterDataResponse = await cmsApi.getPromoter();
  const promoterData = promoterDataResponse?.data as PromoterPageData | undefined;

  return (
    <PageLayout>
      <AsesorVentasView data={promoterData} />
    </PageLayout>
  );
}
