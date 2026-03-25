/**
 * @fileoverview FeaturedProducts — sección genérica para mostrar productos.
 *
 * Utiliza el componente AnimateOnScroll para crear un efecto de "stagger"
 * en las tarjetas de producto mientras se hace scroll.
 */

"use client";

import * as React from "react";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";
import { FeaturedProductCard } from "./FeaturedProductCard";
import { CategoryCard } from "./CategoryCard";
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";

export function FeaturedProducts() {
  // Simulamos algunos productos para rellenar el grid
  const products = [1, 2, 3, 4];

  return (
    <section className="w-full py-16 md:py-24 bg-background">
      <div className="container mx-auto px-16 max-w-[1512px]">
        {/* Cabecera de la sección */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <AnimateOnScroll variant="slide-up">
            <h2 className="text-h4 font-bold text-foreground whitespace-nowrap">
              Productos Destacados
            </h2>
          </AnimateOnScroll>
          <div className="w-full h-px bg-transparent border-dashed border-b border-gray-200"></div>
        </div>

        {/* Grid de Productos con animación escalonada (stagger) */}
        {/* Grid de Productos Interactivos (3 cards) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-4">
          <AnimateOnScroll variant="slide-up" delay={0.1}>
            <FeaturedProductCard
              id="colageno-premium"
              number="01"
              name="Colágeno Premium Plus"
              imageSrc="/producthome/Collagen.jpg"
              productImageSrc="/producthome/product1.png"
            />
          </AnimateOnScroll>

          <AnimateOnScroll variant="slide-up" delay={0.2}>
            <FeaturedProductCard
              id="ovaova-1"
              number="02"
              name="Ovaova Suplemento Base"
              imageSrc="/producthome/ovaova1.jpg"
              productImageSrc="/producthome/product2.png"
            />
          </AnimateOnScroll>

          <AnimateOnScroll variant="slide-up" delay={0.3}>
            <FeaturedProductCard
              id="ovaova-3"
              number="03"
              name="Ovaova Suplemento Avanzado"
              imageSrc="/producthome/ovaova3.jpg"
              productImageSrc="/producthome/product3.png"
            />
          </AnimateOnScroll>
        </div>

        {/* Sección de Categorías */}
        <div className="mt-12 md:mt-24">
          <div className="flex items-center justify-between gap-4 mb-8">
            <AnimateOnScroll variant="slide-up">
              <h3 className="text-h4 font-bold text-foreground whitespace-nowrap">
                Productos para diferentes enfoques
              </h3>
            </AnimateOnScroll>
            <div className="w-full h-px bg-transparent border-dashed border-b border-gray-200"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-4">
            <AnimateOnScroll variant="slide-up" delay={0.0}>
              <CategoryCard
                name="Energía y Vitalidad"
                imageSrc="/categories/img1.png"
                href="/products?category=energia"
              />
            </AnimateOnScroll>

            <AnimateOnScroll variant="slide-up" delay={0.1}>
              <CategoryCard
                name="Sistema Inmunológico"
                imageSrc="/categories/img2.png"
                href="/products?category=inmunologico"
              />
            </AnimateOnScroll>

            <AnimateOnScroll variant="slide-up" delay={0.2}>
              <CategoryCard
                name="Belleza y Piel"
                imageSrc="/categories/img3.png"
                href="/products?category=belleza"
              />
            </AnimateOnScroll>

            <AnimateOnScroll variant="slide-up" delay={0.3}>
              <CategoryCard
                name="Rendimiento Deportivo"
                imageSrc="/categories/img4.png"
                href="/products?category=deporte"
              />
            </AnimateOnScroll>
          </div>
        </div>

        <div className="w-full flex items-center justify-center">
          <Button
            variant="secondary"
            size="sm"
            className="mt-8 md:mt-16 mx-auto text-primary-white"
            icon={<ArrowRight className="w-5 h-5 text-primary-white" />}
            iconPosition="right"
            onClick={() => console.log("Ver todos los productos")}
          >
            Ver todos los productos
          </Button>

        </div>
      </div>
    </section>
  );
}
