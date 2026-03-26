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
import Link from "next/link";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";

/**
 * Hero de la sección Productos con descripción del catálogo Terbol.
 */
export function ProductsHero() {
  return (
    <section className="wrapper-section pb-0">
      <div className="wrapper-content">
        {/* Breadcrumb - Índice de navegación */}
        <nav className="flex items-center gap-2 text-body-medium text-foreground/60 mb-6">
          <Link
            href="/"
            className="hover:text-primary-orange transition-colors duration-200"
          >
            Inicio
          </Link>
          <span className="text-foreground/40">/</span>
          <span className="text-foreground font-medium">Productos</span>
        </nav>

        {/* Título — slide-up inmediato */}
        <AnimateOnScroll variant="slide-up">
          <h1 className="heading-h4 font-bold mb-4">
            Nuestros Productos
          </h1>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
