/**
 * @fileoverview ProductDetailView — vista de detalle de un producto.
 *
 * Muestra la información completa de un producto seleccionado:
 * imagen grande, nombre, precio, descripción y botón de acción.
 *
 * Recibe el `productId` como prop desde la thin page dinámica
 * `app/products/[id]/page.tsx`.
 */

"use client";

import * as React from "react";
import Link from "next/link";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";
import { getProductById } from "../data/products";
import { ProductOverviewSection } from "../components/ProductOverviewSection";
import { ProductTargetSection } from "../components/ProductTargetSection";
import { ProductFeaturesSection } from "../components/ProductFeaturesSection";
import { ProductCarouselSection } from "../components/ProductCarouselSection";
import { CategoryCarouselSection } from "../components/CategoryCarouselSection";
import { PRODUCTS, CONSUMPTION_CATEGORIES } from "../data/products";

/** Props del componente ProductDetailView */
interface ProductDetailViewProps {
  /** ID del producto a mostrar */
  productId: string;
}

/**
 * Vista de detalle de un producto individual.
 *
 * Busca el producto en los datos y muestra su información completa.
 * Si el producto no existe, muestra un mensaje de error con link
 * para volver al catálogo.
 *
 * @param props.productId - ID del producto obtenido desde la ruta dinámica
 */
export function ProductDetailView({ productId }: ProductDetailViewProps) {
  const product = getProductById(productId);

  // ─── Producto no encontrado ───
  if (!product) {
    return (
      <section className="w-full py-24">
        <div className="max-w-[1512px] mx-auto px-16 text-center">
          <h1 className="text-h2 font-bold text-foreground mb-4">
            Producto no encontrado
          </h1>
          <p className="text-muted-foreground mb-8">
            El producto que buscas no existe o fue removido del catálogo.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:opacity-50 border border-input hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
          >
            ← Volver al catálogo
          </Link>
        </div>
      </section>
    );
  }

  // ─── Vista de detalle ───
  return (
    <>
      {/* Componente principal de Übersicht del producto (Imágenes e Info) */}
      <ProductOverviewSection product={product} />

      {/* Sección dinámica ¿Para quién está diseñado? basada en el tipo de consumo */}
      <ProductTargetSection product={product} />

      {/* Sección estática ¿Por qué elegir este producto? */}
      <ProductFeaturesSection />

      {/* SECCION DE CAROUSEL */}
      <ProductCarouselSection
        products={PRODUCTS.filter(p => p.id !== product.id)}
        title="Productos Relacionados"
        maxItems={9}
        autoplayIntervalMs={4000}
      />

      {/* SECCION DE CATEGORIAS */}
      <CategoryCarouselSection 
        categories={CONSUMPTION_CATEGORIES}
        title="Tipo de consumo"
        autoplayIntervalMs={5000}
      />
    </>
  );
}
