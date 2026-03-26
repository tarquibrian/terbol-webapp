/**
 * @fileoverview Hero — sección hero principal de la página Home.
 *
 * Usa AnimateOnScroll para animaciones de entrada:
 * - Título: slide-up (aparece subiendo desde abajo)
 * - Descripción: slide-up con delay
 * - Botones: slide-up con delay mayor (efecto stagger)
 * - Imagen: fade (aparece suavemente en su posición)
 */

"use client";

import * as React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="wrapper-section">
      <div className="wrapper-content">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_570px] items-center">

          <div className="flex flex-col justify-center space-y-8 max-w-[760px]" >
            <div className="space-y-4">
              {/* Título — slide-up inmediato */}
              <AnimateOnScroll variant="slide-up">
                <h1 className="heading-h1-bold">
                  Inspiramos bienestar,<br /> transformamos vidas
                </h1>
              </AnimateOnScroll>

              {/* Descripción — slide-up con delay para efecto stagger */}
              <AnimateOnScroll variant="slide-up" delay={0.15}>
                <p className="text-gray-500 text-body-medium">
                  Térbol Inspira nace para elevar tu calidad de vida. Una nueva gama de nutracéuticos de alta gama, respaldados por la trayectoria de Térbol y formulados con estricta evidencia científica.
                </p>
              </AnimateOnScroll>
            </div>

            {/* Botones — slide-up con delay mayor */}
            <AnimateOnScroll variant="slide-up" delay={0.3}>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button
                  size="default"
                  className="w-full md:max-w-[440px] justify-between"
                  icon={<ArrowRight />}
                  iconPosition="right"
                >
                  ÚNETE AL EQUIPO AHORA
                </Button>
                {/* <Button size="default" variant="outline" className="w-full sm:w-auto" icon={<ArrowRight />} iconPosition="right">
                  Explorar Catálogo
                </Button> */}
              </div>
            </AnimateOnScroll>
          </div>

          <AnimateOnScroll variant="fade" delay={0.2} className="mx-auto flex w-full items-center justify-center lg:justify-end">
            <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-primary-soft-gray-balance  lg:aspect-video lg:h-[500px] p-3 flex items-center justify-center">
              <Image
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1470&auto=format&fit=crop"
                alt="Colección de moda"
                fill
                className="object-cover w-full h-full rounded-md"
                priority
                sizes="(max-width: 1024px) 100vw, 570px"
              />
            </div>
          </AnimateOnScroll>

        </div>
      </div>
    </section>
  );
}
