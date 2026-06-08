/**
 * @fileoverview Página Home — punto de entrada de la ruta `/`.
 *
 * Thin wrapper: delega toda la lógica de presentación al feature `home`.
 * Esta página solo se encarga del routing de Next.js App Router.
 *
 * @see {@link @/features/home} para la implementación.
 */

import * as React from "react";
import type { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import { HomeView, type HomePageData } from "@/features/home";
import { cmsApi } from "@/lib/cms-api";
import { CMS_PAGE_SCHEMAS } from "@/lib/cms-data";
import { getOptionalCmsPageData } from "@/lib/cms-page-data";
import { createPageMetadata, SEO_IMAGES } from "@/lib/seo";

/** Metadatos SEO de la página de inicio */
export const metadata: Metadata = createPageMetadata({
  title: "Inicio Inspira | Productos farmacéuticos, suplementos y vitaminas",
  description:
    "Descubre nuestra amplia gama de productos farmacéuticos, suplementos y vitaminas de alta calidad para tu salud y bienestar.",
  path: "/",
  image: SEO_IMAGES.home,
});

export default async function HomePage() {
  const homeData = await getOptionalCmsPageData<HomePageData>(
    () => cmsApi.getHome(),
    CMS_PAGE_SCHEMAS.home,
    "home",
  );

  return (
    <PageLayout>
      <HomeView data={homeData} />
    </PageLayout>
  );
}
