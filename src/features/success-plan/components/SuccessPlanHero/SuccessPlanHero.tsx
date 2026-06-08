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
import { Button } from "@/components/ui/Button";
import { ArrowRight, MessageCircle } from "lucide-react";

interface SuccessPlanHeroProps {
  data?: {
    label?: string;
    title?: string;
    description?: string;
  };
}

/**
 * Hero de la sección Plan de Éxito con descripción del programa Terbol.
 */
export function SuccessPlanHero({ data }: SuccessPlanHeroProps) {
  return (
    <section className="wrapper-section">
      <div className="wrapper-content flex flex-col items-center gap-6 min-h-[400px] justify-center">
        {/* Título — slide-up inmediato */}
        <div className="text-body-small font-medium text-gray-500 bg-primary-soft-gray-balance px-3 py-1 rounded-full flex items-center gap-2 uppercase">
          <div className="h-2 w-2 bg-gray-300 rounded-full"></div>
          {data?.label || "Una iniciativa de Térbol"}
        </div>
        <AnimateOnScroll variant="slide-up">
          <h1 className="heading-h2 font-semibold text-foreground text-center">
            {data?.title || "Bienestar respaldado por la ciencia"}
          </h1>
        </AnimateOnScroll>
        {/* Descripción — slide-up con delay */}
        <AnimateOnScroll variant="slide-up" delay={0.15}>
          <p className="text-body-medium text-center text-gray-500 max-w-[800px] mb-2 whitespace-pre-line">
            {data?.description || "Térbol Inspira es nuestra línea de vitaminas y nutracéuticos de alta gama, con formulaciones desarrolladas con evidencia científica para quienes buscan productos confiables para su salud."}
          </p>
        </AnimateOnScroll>
        <AnimateOnScroll variant="slide-up" delay={0.3} className="flex gap-4 md:flex-row flex-col w-full items-center justify-center">
          <Button variant="default" size="default" className="w-full md:w-fit" icon={<MessageCircle strokeWidth={1.75} />}>
            Contactar por whatsapp
          </Button>
          <Button variant="outline" size="default" className="min-w-full min-full md:min-w-[300px]" icon={<ArrowRight strokeWidth={1.75} />}>
            Saber más
          </Button>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
