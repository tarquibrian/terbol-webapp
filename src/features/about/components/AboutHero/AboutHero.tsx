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
import Image from "next/image";

/**
 * Hero de la sección About con información institucional de Terbol.
 */
export function AboutHero() {
  return (
    <section className="wrapper-section">
      <div className="wrapper-content flex flex-col items-center gap-16">
        <div className="flex flex-col items-center gap-6">

          {/* Título — slide-up inmediato */}
          <div className="text-body-small font-medium text-gray-500 bg-primary-soft-gray-balance px-3 py-1 rounded-full flex items-center gap-2">
            <div className="h-2 w-2 bg-gray-300 rounded-full"></div>
            NUESTRA IDENTIDAD
          </div>
          <AnimateOnScroll variant="slide-up">
            <h1 className="heading-h1-bold text-foreground text-center">
              ¿Qué es Térbol Inspira?
            </h1>
          </AnimateOnScroll>

          {/* Descripción — slide-up con delay */}
          <AnimateOnScroll variant="slide-up" delay={0.15}>
            <p className="text-body-medium text-center text-gray-500 max-w-[800px]">
              En un mundo que avanza con velocidad, elegimos el valor del equilibrio. Así nace térbol I Inspira: una invitación a vivir más y vivir mejor, desde la ciencia, la conciencia y la excelencia.
            </p>
          </AnimateOnScroll>
        </div>
        <div className="flex gap-4 max-w-[1024px] flex-col md:flex-row">
          <AnimateOnScroll variant="slide-up" delay={0.3} className="w-full p-6 bg-primary-soft-gray-balance rounded-lg h-fit md:h-[230px] flex flex-col gap-6 justify-between">
            {/* LOGO */}
            <Image src="/logo-terbol-main.svg" alt="Terbol" width={200} height={33} />
            <div className="flex flex-col gap-2">
              <h2 className="heading-h5">Nacida de Térbol</h2>
              <p className="text-gray-500 text-body-small">Térbol Inspira es la evolución premium de Térbol, respaldada por su trayectoria en salud.</p>
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll variant="slide-up" delay={0.4} className="w-full p-6 bg-primary-soft-gray-balance rounded-lg h-fit md:h-[230px] flex flex-col gap-6 justify-between">
            {/* LOGO */}
            <Image src="/logo-terbol.svg" alt="Terbol" width={200} height={33} />
            <div className="flex flex-col gap-2">
              <h2 className="heading-h5">Un enfoque diferente</h2>
              <p className="text-gray-500 text-body-small">
                A diferencia del portafolio tradicional, Inspira se especializa exclusivamente en productos de alta gama con evidencia científica.
              </p>
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}
