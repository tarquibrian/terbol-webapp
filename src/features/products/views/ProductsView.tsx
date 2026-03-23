/**
 * @fileoverview ProductsView — vista completa de la página "Nuestros Productos".
 *
 * Compone el Hero y el grid de tarjetas de productos.
 * Importada por `app/products/page.tsx` como thin wrapper.
 */

"use client";

import * as React from "react";
import { ProductsHero } from "../components/ProductsHero";
import { ProductCard } from "../components/ProductCard";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";
import { PRODUCTS } from "../data/products";

/**
 * Vista completa de la página Products.
 *
 * Incluye el Hero y un grid interactivo de productos con cards
 * que enlazan a la vista de detalle `/products/[id]`.
 */
export function ProductsView() {
  return (
    <>
      <ProductsHero />

      {/* Sección del catálogo de productos */}
      <section className="w-full py-16 md:py-24 bg-background">
        <div className="max-w-[1512px] mx-auto px-16">
          {/* Cabecera de la sección */}
          <AnimateOnScroll variant="slide-up" className="mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Catálogo
            </h2>
            <p className="text-muted-foreground text-lg">
              Haz click en cualquier producto para ver más detalles.
            </p>
          </AnimateOnScroll>

          {/* Grid de productos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {PRODUCTS.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
