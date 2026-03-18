/**
 * @fileoverview Página About — punto de entrada de la ruta `/about`.
 *
 * Thin wrapper: delega toda la lógica de presentación al feature `about`.
 * Esta página solo se encarga del routing de Next.js App Router.
 *
 * @see {@link @/features/about} para la implementación.
 */

import * as React from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { AboutView } from "@/features/about";

export default function AboutPage() {
  return (
    <PageLayout>
      <AboutView />
    </PageLayout>
  );
}
