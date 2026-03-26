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
      <section className="w-full">
        <div className="wrapper-content">
          {/* Layout Principal: Filtros + Grid de Productos */}
          <div className="flex flex-col lg:flex-row gap-x-12 gap-y-10 items-start">

            {/* Columna Izquierda: Filtros de Búsqueda */}
            <aside className="w-full lg:w-[280px] lg:sticky lg:top-32 shrink-0">
              <div className="p-6 bg-primary-soft-gray-light rounded-2xl border border-primary-soft-gray-hard shadow-sm">
                <h3 className="text-xl font-bold text-foreground mb-6">Filtros</h3>

                {/* Placeholder para los componentes de filtro */}
                <div className="space-y-8">
                  <div>
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                      Categorías
                    </h4>
                    <ul className="space-y-3">
                      {["Analgésicos", "Antibióticos", "Dermatología", "Vitaminas"].map((cat) => (
                        <li key={cat} className="flex items-center gap-3 text-foreground/80 hover:text-primary-orange cursor-pointer transition-colors">
                          <div className="w-4 h-4 border border-primary-light-gray rounded-sm shrink-0" />
                          <span className="text-body-medium">{cat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-primary-soft-gray-hard">
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                      Laboratorio
                    </h4>
                    <ul className="space-y-3">
                      {["Terbol", "Genéricos", "Importados"].map((lab) => (
                        <li key={lab} className="flex items-center gap-3 text-foreground/80 hover:text-primary-orange cursor-pointer transition-colors">
                          <div className="w-4 h-4 border border-primary-light-gray rounded-sm shrink-0" />
                          <span className="text-body-medium">{lab}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </aside>

            {/* Columna Derecha: Grid de Productos */}
            <div className="flex-1 w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {PRODUCTS.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={index}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
