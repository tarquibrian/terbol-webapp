/**
 * @fileoverview ProductsHero — sección hero de la página "Nuestros Productos".
 *
 * Componente de presentación con título y descripción del catálogo.
 * Sigue el layout estándar: section full-width + container 1512px + px-16.
 *
 * Animaciones:
 * - Título: slide-up (aparece subiendo)
 * - Descripción: slide-up con delay (efecto stagger)
 */

"use client";

import * as React from "react";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";

/**
 * Hero de la sección Productos con descripción del catálogo Terbol.
 */
export function ProductsHero() {
  return (
    <section className="w-full bg-background">
      <div className="max-w-[1512px] mx-auto px-16 py-24">
        {/* Título — slide-up inmediato */}
        <AnimateOnScroll variant="slide-up">
          <h1 className="text-h2 font-bold text-foreground mb-4">
            Nuestros Productos
          </h1>
        </AnimateOnScroll>

        {/* Descripción — slide-up con delay */}
        <AnimateOnScroll variant="slide-up" delay={0.15}>
          <p className="text-body text-gray-400 max-w-[640px]">
            Descubre nuestra amplia gama de productos de alta calidad.
            Desde soluciones industriales hasta productos de consumo,
            tenemos lo que necesitas.
          </p>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
