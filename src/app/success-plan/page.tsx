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
import { SuccessPlanView } from "@/features/success-plan";
import { cmsApi } from "@/lib/cms-api";

/** Metadatos SEO de la página Plan de Éxito */
export const metadata: Metadata = {
  title: "Plan de Éxito | Terbol",
  description:
    "Nuestro plan de éxito te acompaña en cada paso de tu crecimiento. Conoce las herramientas y estrategias que ofrecemos.",
};

export default async function SuccessPlanPage() {
  const successPlanDataResponse = await cmsApi.getSuccessPlan();
  const successPlanData = successPlanDataResponse?.data;

  return (
    <PageLayout>
      <SuccessPlanView data={successPlanData} />
    </PageLayout>
  );
}
