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
import { HomeView } from "@/features/home";

/** Metadatos SEO de la página de inicio */
export const metadata: Metadata = {
  title: "Inicio Inspira | Productos farmacéuticos, suplementos y vitaminas",
  description:
    "Descubre nuestra amplia gama de productos farmacéuticos, suplementos y vitaminas de alta calidad para tu salud y bienestar.",
  openGraph: {
    title: "Inicio Inspira | Productos farmacéuticos, suplementos y vitaminas",
    description:
      "Descubre nuestra amplia gama de productos de alta calidad para tu salud y bienestar.",
    // TODO: Reemplazar con imagen OG de la Home cuando esté disponible
    // images: [{ url: "/images/og-home.jpg", width: 1200, height: 630, alt: "Terbol Home" }],
  },
};

export default function HomePage() {
  return (
    <PageLayout>
      <HomeView />
    </PageLayout>
  );
}
