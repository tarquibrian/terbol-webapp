/**
 * @fileoverview Newsletter — sección "call to action" para el home.
 *
 * Utiliza un fondo invertido (oscuro) y muestra el fade/slide en
 * los elementos de texto y el input.
 */

"use client";

import * as React from "react";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";
import { Button } from "@/components/ui/Button";

export function Newsletter() {
  return (
    <section className="w-full py-20 md:py-32 bg-primary text-primary-foreground relative overflow-hidden">
      {/* Círculos decorativos en el fondo para dar textura */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary-foreground/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-orange/20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 max-w-[1512px] relative z-10">
        <div className="flex flex-col items-center text-center space-y-6 max-w-2xl mx-auto">
          <AnimateOnScroll variant="slide-up">
            <h2 className="text-4xl font-bold tracking-tighter md:text-5xl lg:text-h2">
              Únete a nuestra comunidad
            </h2>
          </AnimateOnScroll>
          
          <AnimateOnScroll variant="slide-up" delay={0.15}>
            <p className="text-primary-foreground/80 md:text-xl">
              Suscríbete para recibir noticias, ofertas exclusivas y novedades sobre nuevos lanzamientos antes que nadie.
            </p>
          </AnimateOnScroll>
          
          <AnimateOnScroll variant="fade" delay={0.3} className="w-full max-w-md mt-4">
            <form className="flex flex-col sm:flex-row gap-3 w-full" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Tu dirección de correo" 
                className="flex h-12 w-full rounded-md border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-2 text-base placeholder:text-primary-foreground/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-orange transition-colors"
              />
              <Button size="default" className="w-full sm:w-auto shrink-0 bg-button-orange text-white hover:bg-button-orange-hover">
                Suscribirse
              </Button>
            </form>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}
