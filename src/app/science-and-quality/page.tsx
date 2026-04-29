/**
 * @fileoverview Página Ciencia y Calidad — punto de entrada de la ruta `/science-and-quality`.
 *
 * Thin wrapper: delega toda la lógica de presentación al feature `science-and-quality`.
 */

import * as React from "react";
import type { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import { ScienceQualityView } from "@/features/science-and-quality";
import { cmsApi } from "@/lib/cms-api";

/** Metadatos SEO de la página Ciencia y Calidad */
export const metadata: Metadata = {
  title: "Ciencia y Calidad | Terbol Inspira",
  description:
    "Descubre cómo la ciencia y la calidad respaldan cada uno de nuestros productos en Térbol Inspira.",
};

export default async function ScienceQualityPage() {
  const scienceDataResponse = await cmsApi.getScience();
  const scienceData = scienceDataResponse?.data;

  return (
    <PageLayout>
      <ScienceQualityView data={scienceData} />
    </PageLayout>
  );
}
