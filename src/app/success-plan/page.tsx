/**
 * @fileoverview Página Success Plan — punto de entrada de la ruta `/success-plan`.
 *
 * Thin wrapper: delega toda la lógica de presentación al feature `success-plan`.
 *
 * @see {@link @/features/success-plan} para la implementación.
 */

import * as React from "react";
import type { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import {
  SuccessPlanView,
  type SuccessPlanPageData,
} from "@/features/success-plan";
import { cmsApi } from "@/lib/cms-api";
import { CMS_PAGE_SCHEMAS } from "@/lib/cms-data";
import { getOptionalCmsPageData } from "@/lib/cms-page-data";
import { createPageMetadata, SEO_IMAGES } from "@/lib/seo";

/** Metadatos SEO de la página Plan de Éxito */
export const metadata: Metadata = createPageMetadata({
  title: "Plan de Éxito",
  description:
    "Nuestro plan de éxito te acompaña en cada paso de tu crecimiento. Conoce las herramientas y estrategias que ofrecemos.",
  path: "/success-plan",
  image: SEO_IMAGES.successPlan,
});

export default async function SuccessPlanPage() {
  const successPlanData = await getOptionalCmsPageData<SuccessPlanPageData>(
    () => cmsApi.getSuccessPlan(),
    CMS_PAGE_SCHEMAS.successPlan,
    "success-plan",
  );

  return (
    <PageLayout>
      <SuccessPlanView data={successPlanData} />
    </PageLayout>
  );
}
