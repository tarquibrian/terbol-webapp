/**
 * @fileoverview Página de Detalle de Producto — ruta dinámica `/products/[id]`.
 *
 * Thin wrapper con `generateMetadata` para SEO dinámico por producto.
 * Obtiene el nombre y descripción del producto para los metadatos.
 *
 * @see {@link @/features/products} para la implementación.
 */

import * as React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageLayout } from "@/components/layout/PageLayout";
import { ProductDetailView, getProductById, getAllProductIds } from "@/features/products";

/** Parámetros de la ruta dinámica */
interface ProductPageProps {
  params: Promise<{ id: string }>;
}

/**
 * Genera los parámetros estáticos para pre-renderizar todas las
 * páginas de producto en tiempo de build (SSG).
 */
export function generateStaticParams() {
  return getAllProductIds().map((id) => ({ id }));
}

/**
 * Genera metadatos SEO dinámicos basados en el producto.
 *
 * Si el producto existe, usa su nombre y descripción.
 * Si no existe, muestra un título genérico de "no encontrado".
 */
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) {
    return {
      title: "Producto no encontrado",
      description: "El producto que buscas no existe en nuestro catálogo.",
    };
  }

  return {
    // El template del layout.tsx añade " | Terbol" automáticamente
    title: product.name,
    description: product.shortDescription,
    openGraph: {
      title: `${product.name} | Terbol`,
      description: product.shortDescription,
      images: [
        {
          url: product.image,
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | Terbol`,
      description: product.shortDescription,
      images: [product.image],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;

  return (
    <PageLayout>
      <ProductDetailView productId={id} />
    </PageLayout>
  );
}
