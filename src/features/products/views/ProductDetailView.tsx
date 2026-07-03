/**
 * @fileoverview ProductDetailView — vista de detalle de un producto.
 *
 * Muestra la información completa de un producto seleccionado:
 * imagen grande, nombre, precio, descripción y botón de acción.
 *
 * Recibe el producto resuelto desde la thin page dinámica
 * `app/products/[id]/page.tsx`.
 */

"use client";

import { ProductOverviewSection } from "../components/ProductOverviewSection";
import { ProductTargetSection } from "../components/ProductTargetSection";
import { ProductFeaturesSection } from "../components/ProductFeaturesSection";
import { ProductCarouselSection } from "../components/ProductCarouselSection";
import { CategoryCarouselSection } from "../components/CategoryCarouselSection";
import type { Product } from "../data/products";
import type { ProductCategoryLink } from "../api/types";

/** Props del componente ProductDetailView */
interface ProductDetailViewProps {
  /** Producto a mostrar */
  product: Product;
  /** Productos relacionados ya resueltos en servidor */
  relatedProducts: Product[];
  /** Enfoques sugeridos por el endpoint de detalle del producto */
  focusCategories: ProductCategoryLink[];
}

/**
 * Vista de detalle de un producto individual.
 *
 * Muestra la información completa del producto. La página dinámica se encarga
 * de resolver datos y disparar `notFound()` si el producto no existe.
 */
export function ProductDetailView({
  product,
  relatedProducts,
  focusCategories,
}: ProductDetailViewProps) {
  return (
    <>
      {/* Componente principal de Übersicht del producto (Imágenes e Info) */}
      <ProductOverviewSection product={product} />

      {/* Sección dinámica ¿Para quién está diseñado? basada en el tipo de consumo */}
      <ProductTargetSection product={product} />

      {/* Sección estática ¿Por qué elegir este producto? */}
      <ProductFeaturesSection product={product} />

      {/* SECCION DE CAROUSEL */}
      <ProductCarouselSection
        products={relatedProducts}
        title="Productos Relacionados"
        maxItems={9}
        autoplayIntervalMs={4000}
      />

      {/* SECCION DE CATEGORIAS */}
      <CategoryCarouselSection
        categories={focusCategories}
        title="Productos para diferentes enfoques"
        autoplayIntervalMs={5000}
      />
    </>
  );
}
