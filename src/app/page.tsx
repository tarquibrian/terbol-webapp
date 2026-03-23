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
  title: "Inicio | Terbol",
  description:
    "Descubre la mejor experiencia en ecommerce. Calidad inigualable, envío gratuito y productos cuidadosamente seleccionados para ti.",
};

export default function HomePage() {
  return (
    <PageLayout>
      <HomeView />
    </PageLayout>
  );
}
