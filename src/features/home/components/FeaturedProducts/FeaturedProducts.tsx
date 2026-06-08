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
import { CategoryCard } from "@/components/ui/CategoryCard/CategoryCard";
import { CONSUMPTION_CATEGORIES, FEATURED_PRODUCTS } from "@/features/products/data/products";
import { Button } from "@/components/ui/Button";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, Autoplay, type CarouselApi } from "@/components/ui/Carousel/Carousel";

export function FeaturedProducts() {
  const plugin = React.useMemo(() => {
    return [Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true })];
  }, []);

  const [api, setApi] = React.useState<CarouselApi>();

  const handlePrev = React.useCallback(() => {
    api?.scrollPrev();
    api?.plugins()?.autoplay?.reset();
  }, [api]);

  const handleNext = React.useCallback(() => {
    api?.scrollNext();
    api?.plugins()?.autoplay?.reset();
  }, [api]);


  return (
    <section className="wrapper-section">
      <div className="wrapper-content">
        {/* Cabecera de la sección */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <AnimateOnScroll variant="slide-up">
            <h2 className="heading-h4 font-bold text-foreground whitespace-nowrap">
              Productos Destacados
            </h2>
          </AnimateOnScroll>
          <div className="w-full h-px bg-transparent border-dashed border-b border-gray-200"></div>
        </div>

        {/* Grid de Productos Interactivos (máx. 3 products con featuredProduct: true) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 lg:gap-4">
          {FEATURED_PRODUCTS.map((product, index) => (
            <AnimateOnScroll key={product.id} variant="slide-up" delay={(index + 1) * 0.1}>
              <FeaturedProductCard
                id={product.id}
                number={String(index + 1).padStart(2, "0")}
                name={product.shortName ?? product.name}
                imageSrc={product.featuredCoverImage ?? product.cardImage}
                productImageSrc={product.featuredBgImage ?? product.cardImage}
              />
            </AnimateOnScroll>
          ))}
        </div>

        {/* Sección de Categorías */}
        <div className="mt-12 md:mt-24">
          <Carousel
            opts={{ loop: true, align: "start" }}
            plugins={plugin}
            setApi={setApi}
            className="flex flex-col gap-8"
          >
            <div className="flex items-center justify-between gap-4">
              <AnimateOnScroll variant="slide-up">
                <h3 className="heading-h5 font-bold text-foreground md:whitespace-nowrap">
                  Productos para diferentes enfoques
                </h3>
              </AnimateOnScroll>
              <div className="hidden md:block w-full h-px bg-transparent border-dashed border-b border-gray-200"></div>

              {CONSUMPTION_CATEGORIES.length > 3 && (
                <AnimateOnScroll variant="fade" className="hidden md:flex gap-3 shrink-0">
                  <button
                    onClick={handlePrev}
                    className="w-12 h-12 flex justify-center items-center rounded-full bg-primary-soft-gray-balance text-primary-orange transition-colors hover:bg-gray-100 focus:outline-none"
                    aria-label="Anterior"
                  >
                    <ChevronLeft size={24} strokeWidth={1.5} />
                  </button>
                  <button
                    onClick={handleNext}
                    className="w-12 h-12 flex justify-center items-center rounded-full bg-primary-soft-gray-balance text-primary-orange transition-colors hover:bg-gray-100 focus:outline-none"
                    aria-label="Siguiente"
                  >
                    <ChevronRight size={24} strokeWidth={1.5} />
                  </button>
                </AnimateOnScroll>
              )}
            </div>

            <AnimateOnScroll variant="slide-up" delay={0.2}>
              <div className="relative w-full">
                <div className="px-0 md:px-0">
                  <CarouselContent>
                    {CONSUMPTION_CATEGORIES.map((category, index) => (
                      <CarouselItem
                        key={category.id}
                        className="w-full sm:basis-1/2 lg:basis-1/4"
                      >
                        <CategoryCard
                          name={category.name}
                          imageSrc={category.imageSrc}
                          href={category.href}
                          index={index}
                          disableAnimation={true}
                        />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </div>

                {/* Controles para Mobile */}
                {CONSUMPTION_CATEGORIES.length > 1 && (
                  <div className="flex md:hidden justify-center gap-4 mt-4">
                    <button
                      onClick={handlePrev}
                      className="w-10 h-10 flex justify-center items-center rounded-full bg-primary-soft-gray-balance text-primary-orange transition-colors hover:bg-gray-100 focus:outline-none"
                      aria-label="Anterior"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={handleNext}
                      className="w-10 h-10 flex justify-center items-center rounded-full bg-primary-soft-gray-balance text-primary-orange transition-colors hover:bg-gray-100 focus:outline-none"
                      aria-label="Siguiente"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                )}
              </div>
            </AnimateOnScroll>
          </Carousel>
        </div>

        <div className="w-full flex items-center justify-center">
          <Button
            variant="secondary"
            size="sm"
            className="mt-8 md:mt-16 mx-auto text-primary-white w-full sm:w-fit"
            icon={<ArrowRight className="w-5 h-5 text-primary-white" />}
            iconPosition="right"
            href="/products"
            scroll={false}
          >
            Ver todos los productos
          </Button>

        </div>
      </div>
    </section>
  );
}
