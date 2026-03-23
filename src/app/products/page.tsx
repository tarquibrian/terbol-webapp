/**
 * @fileoverview Página Products — punto de entrada de la ruta `/products`.
 *
 * Thin wrapper: delega toda la lógica de presentación al feature `products`.
 *
 * @see {@link @/features/products} para la implementación.
 */

import * as React from "react";
import type { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import { ProductsView } from "@/features/products";

/** Metadatos SEO de la página de productos */
export const metadata: Metadata = {
  title: "Nuestros Productos | Terbol",
  description:
    "Descubre nuestra amplia gama de productos de alta calidad. Desde soluciones industriales hasta productos de consumo.",
};

export default function ProductsPage() {
  return (
    <PageLayout>
      <ProductsView />
    </PageLayout>
  );
}
