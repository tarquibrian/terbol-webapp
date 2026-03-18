/**
 * @fileoverview SuccessPlanHero — sección hero de la página "Plan de Éxito".
 *
 * Componente de presentación con título y descripción del programa.
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
 * Hero de la sección Plan de Éxito con descripción del programa Terbol.
 */
export function SuccessPlanHero() {
  return (
    <section className="w-full bg-primary-soft-gray-light">
      <div className="max-w-[1512px] mx-auto px-16 py-24">
        {/* Título — slide-up inmediato */}
        <AnimateOnScroll variant="slide-up">
          <h1 className="text-h2 font-bold text-foreground mb-4">
            Plan de Éxito
          </h1>
        </AnimateOnScroll>

        {/* Descripción — slide-up con delay */}
        <AnimateOnScroll variant="slide-up" delay={0.15}>
          <p className="text-body text-gray-400 max-w-[640px]">
            Nuestro plan de éxito te acompaña en cada paso de tu
            crecimiento. Conoce las herramientas, estrategias y el soporte
            que ofrecemos para alcanzar tus metas.
          </p>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
