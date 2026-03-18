/**
 * @fileoverview Página Home — punto de entrada de la ruta `/`.
 *
 * Thin wrapper: delega toda la lógica de presentación al feature `home`.
 * Esta página solo se encarga del routing de Next.js App Router.
 *
 * @see {@link @/features/home} para la implementación.
 */

import * as React from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { HomeView } from "@/features/home";

export default function HomePage() {
  return (
    <PageLayout>
      <HomeView />
    </PageLayout>
  );
}
