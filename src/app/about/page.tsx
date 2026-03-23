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

/** Metadatos SEO de la página ¿Quiénes somos? */
export const metadata: Metadata = {
  title: "¿Quiénes somos? | Terbol",
  description:
    "Conoce nuestra historia, valores y el equipo detrás de Terbol. Comprometidos con la excelencia y la innovación.",
};

export default function AboutPage() {
  return (
    <PageLayout>
      <AboutView />
    </PageLayout>
  );
}
