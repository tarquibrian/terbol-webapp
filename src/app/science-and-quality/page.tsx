/**
 * @fileoverview Página Ciencia y Calidad — punto de entrada de la ruta `/science-and-quality`.
 *
 * Thin wrapper: delega toda la lógica de presentación al feature `science-and-quality`.
 */

import * as React from "react";
import type { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import {
  ScienceQualityView,
  type ScienceQualityPageData,
} from "@/features/science-and-quality";
import { cmsApi } from "@/lib/cms-api";
import { CMS_PAGE_SCHEMAS } from "@/lib/cms-data";
import { getOptionalCmsPageData } from "@/lib/cms-page-data";
import { createPageMetadata, SEO_IMAGES } from "@/lib/seo";

/** Metadatos SEO de la página Ciencia y Calidad */
export const metadata: Metadata = createPageMetadata({
  title: "Ciencia y calidad",
  description:
    "Descubre cómo la ciencia y la calidad respaldan cada uno de nuestros productos en Térbol Inspira.",
  path: "/science-and-quality",
  image: SEO_IMAGES.science,
});

export default async function ScienceQualityPage() {
  const scienceData = await getOptionalCmsPageData<ScienceQualityPageData>(
    () => cmsApi.getScience(),
    CMS_PAGE_SCHEMAS.science,
    "science",
  );

  return (
    <PageLayout>
      <ScienceQualityView data={scienceData} />
    </PageLayout>
  );
}
