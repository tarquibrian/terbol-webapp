/**
 * @fileoverview Página Products — punto de entrada de la ruta `/products`.
 *
 * Thin wrapper: delega toda la lógica de presentación al feature `products`.
 * Esta página solo se encarga del routing de Next.js App Router.
 *
 * @see {@link @/features/products} para la implementación.
 */

import * as React from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { ProductsView } from "@/features/products";

export default function ProductsPage() {
  return (
    <PageLayout>
      <ProductsView />
    </PageLayout>
  );
}
