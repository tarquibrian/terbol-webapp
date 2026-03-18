/**
 * @fileoverview FeaturedProducts — sección genérica para mostrar productos.
 *
 * Utiliza el componente AnimateOnScroll para crear un efecto de "stagger"
 * en las tarjetas de producto mientras se hace scroll.
 */

"use client";

import * as React from "react";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";

export function FeaturedProducts() {
  // Simulamos algunos productos para rellenar el grid
  const products = [1, 2, 3, 4];

  return (
    <section className="w-full py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6 max-w-[1512px]">
        {/* Cabecera de la sección */}
        <div className="flex flex-col items-center text-center space-y-4 mb-16">
          <AnimateOnScroll variant="slide-up">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-foreground">
              Productos Destacados
            </h2>
          </AnimateOnScroll>
          <AnimateOnScroll variant="slide-up" delay={0.15}>
            <p className="max-w-[700px] text-muted-foreground md:text-xl">
              Explora nuestra selección de los productos más populares y altamente recomendados por nuestros clientes.
            </p>
          </AnimateOnScroll>
        </div>

        {/* Grid de Productos con animación escalonada (stagger) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((item, index) => (
            <AnimateOnScroll
              key={item}
              variant="slide-up"
              delay={0.1 * index} // Retraso progresivo: 0s, 0.1s, 0.2s, 0.3s
              className="flex flex-col p-6 border border-border rounded-xl hover:shadow-lg transition-shadow bg-card"
            >
              <div className="w-full aspect-square bg-muted/50 rounded-md mb-4 flex items-center justify-center">
                <span className="text-muted-foreground text-sm font-medium">Imagen del Producto {item}</span>
              </div>
              <h3 className="font-semibold text-lg text-foreground">
                Producto de Prueba {item}
              </h3>
              <p className="text-primary-orange font-bold mt-2 text-xl">
                $99.99
              </p>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
