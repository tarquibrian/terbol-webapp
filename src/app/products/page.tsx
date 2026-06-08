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
import { createPageMetadata, SEO_IMAGES } from "@/lib/seo";

/** Metadatos SEO de la página de productos */
export const metadata: Metadata = createPageMetadata({
  title: "Nuestros Productos",
  description:
    "Explora el catálogo completo de Terbol: medicamentos, suplementos y vitaminas de alta calidad para el cuidado de tu salud.",
  path: "/products",
  image: SEO_IMAGES.products,
});

export default function ProductsPage() {
  return (
    <PageLayout>
      <React.Suspense fallback={<div className="min-h-screen flex items-center justify-center">Cargando productos...</div>}>
        <ProductsView />
      </React.Suspense>
    </PageLayout>
  );
}
