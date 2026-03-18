/**
 * @fileoverview Página Success Plan — punto de entrada de la ruta `/success-plan`.
 *
 * Thin wrapper: delega toda la lógica de presentación al feature `success-plan`.
 * Esta página solo se encarga del routing de Next.js App Router.
 *
 * @see {@link @/features/success-plan} para la implementación.
 */

import * as React from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { SuccessPlanView } from "@/features/success-plan";

export default function SuccessPlanPage() {
  return (
    <PageLayout>
      <SuccessPlanView />
    </PageLayout>
  );
}
