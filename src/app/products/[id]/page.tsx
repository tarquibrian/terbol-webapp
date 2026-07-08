/**
 * @fileoverview Página de Detalle de Producto — ruta dinámica `/products/[id]`.
 *
 * Thin wrapper con `generateMetadata` para SEO dinámico por producto.
 * Obtiene el nombre y descripción del producto para los metadatos.
 *
 * @see {@link @/features/products} para la implementación.
 */

import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageLayout } from "@/components/layout/PageLayout";
import { ProductDetailView } from "@/features/products";
import { getProductDetailPageData } from "@/features/products/api/products-api";
import { createPageMetadata } from "@/lib/seo";

/** Parámetros de la ruta dinámica */
interface ProductPageProps {
  params: Promise<{ id: string }>;
}

const getCachedProductDetailPageData = cache(getProductDetailPageData);

/**
 * Genera metadatos SEO dinámicos basados en el producto.
 *
 * Si el producto existe, usa su nombre y descripción.
 * Si no existe, muestra un título genérico de "no encontrado".
 */
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const pageData = await getCachedProductDetailPageData(id);
  const product = pageData?.product;

  if (!product) {
    return createPageMetadata({
      title: "Producto no encontrado",
      description: "El producto que buscas no existe en nuestro catálogo.",
      path: `/products/${encodeURIComponent(id)}`,
      noIndex: true,
    });
  }

  return createPageMetadata({
    title: product.name,
    description: product.shortDescription,
    path: `/products/${encodeURIComponent(product.id)}`,
    image: {
      url: product.cardImage,
      alt: product.name,
    },
  });
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const pageData = await getCachedProductDetailPageData(id);

  if (!pageData) {
    notFound();
  }

  return (
    <PageLayout>
      <ProductDetailView
        product={pageData.product}
        relatedProducts={pageData.relatedProducts}
        focusCategories={pageData.suggestedFocuses}
      />
    </PageLayout>
  );
}
