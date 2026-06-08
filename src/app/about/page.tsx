/**
 * @fileoverview Página About — punto de entrada de la ruta `/about`.
 *
 * Thin wrapper: delega toda la lógica de presentación al feature `about`.
 *
 * @see {@link @/features/about} para la implementación.
 */

import * as React from "react";
import type { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import { AboutView, type AboutPageData } from "@/features/about";
import { cmsApi } from "@/lib/cms-api";
import { CMS_PAGE_SCHEMAS } from "@/lib/cms-data";
import { getOptionalCmsPageData } from "@/lib/cms-page-data";
import { createPageMetadata, SEO_IMAGES } from "@/lib/seo";

/** Metadatos SEO de la página ¿Quiénes somos? */
export const metadata: Metadata = createPageMetadata({
  title: "Quiénes somos",
  description:
    "Conoce la historia y los valores de Terbol. Más de años de trayectoria en el sector farmacéutico, comprometidos con la salud y el bienestar de las personas.",
  path: "/about",
  image: SEO_IMAGES.about,
});

export default async function AboutPage() {
  const aboutData = await getOptionalCmsPageData<AboutPageData>(
    () => cmsApi.getAbout(),
    CMS_PAGE_SCHEMAS.about,
    "about",
  );

  return (
    <PageLayout>
      <AboutView data={aboutData} />
    </PageLayout>
  );
}
