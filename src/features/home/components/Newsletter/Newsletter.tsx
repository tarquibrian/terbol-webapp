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
import { ArrowRight } from "lucide-react";

export function Newsletter() {
  return (
    <section className="wrapper-section bg-primary text-primary-foreground">
      <div className="wrapper-content">
        <div className="flex flex-col items-center text-center gap-6 max-w-2xl mx-auto">
          <AnimateOnScroll variant="slide-up">
            <h2 className="heading-h4">
              Únete a nuestra comunidad
            </h2>
          </AnimateOnScroll>
          
          <AnimateOnScroll variant="slide-up" delay={0.15}>
            <p className="text-primary-foreground/80 md:text-xl">
              Suscríbete para recibir noticias, ofertas exclusivas y novedades sobre nuevos lanzamientos antes que nadie.
            </p>
          </AnimateOnScroll>
          
          <AnimateOnScroll variant="fade" delay={0.3} className="w-full max-w-md mt-2">
            <form className="flex flex-col sm:flex-row gap-3 w-full" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Tu dirección de correo" 
                className="flex h-12 w-full rounded-md border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-2 text-base placeholder:text-primary-foreground/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-orange transition-colors"
              />
              <Button
                size="default"
                className="w-full sm:w-auto shrink-0 bg-button-orange text-white hover:bg-button-orange-hover"
                icon={<ArrowRight />}
                iconPosition="right"
              >
                Suscribirse
              </Button>
            </form>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}
