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
import { AboutView } from "@/features/about";
import { cmsApi } from "@/lib/cms-api";

/** Metadatos SEO de la página ¿Quiénes somos? */
export const metadata: Metadata = {
  title: "Quiénes somos",
  description:
    "Conoce la historia y los valores de Terbol. Más de años de trayectoria en el sector farmacéutico, comprometidos con la salud y el bienestar de las personas.",
  openGraph: {
    title: "Quiénes somos — Terbol",
    description:
      "Conoce la historia y los valores de Terbol. Comprometidos con la salud y el bienestar desde hace años.",
    // TODO: Reemplazar con imagen OG de About cuando esté disponible
    // images: [{ url: "/images/og-about.jpg", width: 1200, height: 630, alt: "Sobre Terbol" }],
  },
};

export default async function AboutPage() {
  const aboutDataResponse = await cmsApi.getAbout();
  const aboutData = aboutDataResponse?.data;

  return (
    <PageLayout>
      <AboutView data={aboutData} />
    </PageLayout>
  );
}
