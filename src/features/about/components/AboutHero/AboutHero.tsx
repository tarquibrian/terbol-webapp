/**
 * @fileoverview AboutHero — sección hero de la página "¿Quiénes somos?".
 *
 * Componente de presentación con título y descripción institucional.
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
 * Hero de la sección About con información institucional de Terbol.
 */
export function AboutHero() {
  return (
    <section className="w-full bg-background">
      <div className="max-w-[1512px] mx-auto px-16 py-24">
        {/* Título — slide-up inmediato */}
        <AnimateOnScroll variant="slide-up">
          <h1 className="text-h2 font-bold text-foreground mb-4">
            ¿Quiénes somos?
          </h1>
        </AnimateOnScroll>

        {/* Descripción — slide-up con delay */}
        <AnimateOnScroll variant="slide-up" delay={0.15}>
          <p className="text-body text-gray-400 max-w-[640px]">
            Somos Terbol, una empresa comprometida con la excelencia y la
            innovación. Conoce nuestra historia, valores y el equipo que hace
            posible nuestra misión.
          </p>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
