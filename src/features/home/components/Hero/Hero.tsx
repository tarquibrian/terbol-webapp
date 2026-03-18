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
import { Button } from "@/components/ui/Button";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";

export function Hero() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-muted/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px] items-center">

          {/* Contenido Izquierdo */}
          <div className="flex flex-col justify-center space-y-8">
            <div className="space-y-4">
              {/* Título — slide-up inmediato */}
              <AnimateOnScroll variant="slide-up">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-h1 leading-tight text-primary">
                  La mejor experiencia en Ecommerce
                </h1>
              </AnimateOnScroll>

              {/* Descripción — slide-up con delay para efecto stagger */}
              <AnimateOnScroll variant="slide-up" delay={0.15}>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Descubre nuestra nueva colección. Calidad inigualable y envío
                  gratuito en todos tus pedidos, todo cuidadosamente diseñado para ti.
                </p>
              </AnimateOnScroll>
            </div>

            {/* Botones — slide-up con delay mayor */}
            <AnimateOnScroll variant="slide-up" delay={0.3}>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button size="default" className="w-full sm:w-auto">
                  Comprar Ahora
                </Button>
                <Button size="default" variant="outline" className="w-full sm:w-auto">
                  Explorar Catálogo
                </Button>
              </div>
            </AnimateOnScroll>
          </div>

          {/* Imagen Derecha — fade suave */}
          <AnimateOnScroll variant="fade" delay={0.2} className="mx-auto flex w-full items-center justify-center lg:justify-end">
            <div className="relative w-full aspect-video rounded-sm overflow-hidden shadow-xl sm:aspect-square lg:aspect-video lg:h-[400px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1470&auto=format&fit=crop"
                alt="Colección de moda"
                className="object-cover w-full h-full"
                loading="lazy"
              />
            </div>
          </AnimateOnScroll>

        </div>
      </div>
    </section>
  );
}
