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
import { Button } from "@/components/ui/Button";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, Autoplay, type CarouselApi } from "@/components/ui/Carousel/Carousel";
import type { ProductCategoryLink } from "@/features/products/api/types";
import type { Product } from "@/features/products/data/products";

interface FeaturedProductsProps {
  featuredProducts: Product[];
  focusCategories: ProductCategoryLink[];
}

export function FeaturedProducts({
  featuredProducts,
  focusCategories,
}: FeaturedProductsProps) {
  const productPlugins = React.useMemo(() => {
    return [Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true })];
  }, []);
  const focusPlugins = React.useMemo(() => {
    return [Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true })];
  }, []);

  const [productApi, setProductApi] = React.useState<CarouselApi>();
  const [focusApi, setFocusApi] = React.useState<CarouselApi>();
  const hasFeaturedProducts = featuredProducts.length > 0;
  const hasFocusCategories = focusCategories.length > 0;
  const hasMultipleFeaturedProducts = featuredProducts.length > 1;
  const hasFeaturedProductDesktopControls = featuredProducts.length > 3;

  const handleProductPrev = React.useCallback(() => {
    productApi?.scrollPrev();
    productApi?.plugins()?.autoplay?.reset();
  }, [productApi]);

  const handleProductNext = React.useCallback(() => {
    productApi?.scrollNext();
    productApi?.plugins()?.autoplay?.reset();
  }, [productApi]);

  const handleFocusPrev = React.useCallback(() => {
    focusApi?.scrollPrev();
    focusApi?.plugins()?.autoplay?.reset();
  }, [focusApi]);

  const handleFocusNext = React.useCallback(() => {
    focusApi?.scrollNext();
    focusApi?.plugins()?.autoplay?.reset();
  }, [focusApi]);


  if (!hasFeaturedProducts && !hasFocusCategories) return null;

  return (
    <section className="wrapper-section">
      <div className="wrapper-content">
        {hasFeaturedProducts && (
          <Carousel
            opts={{ loop: hasMultipleFeaturedProducts, align: "start" }}
            plugins={hasMultipleFeaturedProducts ? productPlugins : []}
            setApi={setProductApi}
            className="flex flex-col gap-8"
          >
            <div className="flex items-center justify-between gap-4">
              <AnimateOnScroll variant="slide-up">
                <h2 className="heading-h4 font-bold text-foreground whitespace-nowrap">
                  Productos Destacados
                </h2>
              </AnimateOnScroll>
              <div className="hidden md:block w-full h-px bg-transparent border-dashed border-b border-gray-200"></div>

              {hasFeaturedProductDesktopControls && (
                <AnimateOnScroll variant="fade" className="hidden md:flex gap-3 shrink-0">
                  <button
                    onClick={handleProductPrev}
                    className="w-12 h-12 flex justify-center items-center rounded-full bg-primary-soft-gray-balance text-primary-orange transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    aria-label="Producto anterior"
                  >
                    <ChevronLeft size={24} strokeWidth={1.5} />
                  </button>
                  <button
                    onClick={handleProductNext}
                    className="w-12 h-12 flex justify-center items-center rounded-full bg-primary-soft-gray-balance text-primary-orange transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    aria-label="Producto siguiente"
                  >
                    <ChevronRight size={24} strokeWidth={1.5} />
                  </button>
                </AnimateOnScroll>
              )}
            </div>

            <AnimateOnScroll variant="slide-up" delay={0.2}>
              <div className="relative w-full">
                <CarouselContent>
                  {featuredProducts.map((product, index) => (
                    <CarouselItem
                      key={product.id}
                      className="w-full sm:basis-1/2 lg:basis-1/3"
                    >
                      <FeaturedProductCard
                        id={product.id}
                        number={String(index + 1).padStart(2, "0")}
                        name={product.shortName ?? product.name}
                        imageSrc={product.featuredCoverImage ?? product.cardImage}
                        productImageSrc={product.featuredBgImage ?? product.cardImage}
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>

                {hasMultipleFeaturedProducts && (
                  <div className="flex md:hidden justify-center gap-4 mt-4">
                    <button
                      onClick={handleProductPrev}
                      className="w-10 h-10 flex justify-center items-center rounded-full bg-primary-soft-gray-balance text-primary-orange transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      aria-label="Producto anterior"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={handleProductNext}
                      className="w-10 h-10 flex justify-center items-center rounded-full bg-primary-soft-gray-balance text-primary-orange transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      aria-label="Producto siguiente"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                )}
              </div>
            </AnimateOnScroll>
          </Carousel>
        )}

        {/* Sección de Categorías */}
        {hasFocusCategories && (
        <div className={hasFeaturedProducts ? "mt-12 md:mt-24" : ""}>
          <Carousel
            opts={{ loop: true, align: "start" }}
            plugins={focusPlugins}
            setApi={setFocusApi}
            className="flex flex-col gap-8"
          >
            <div className="flex items-center justify-between gap-4">
              <AnimateOnScroll variant="slide-up">
                <h3 className="heading-h5 font-bold text-foreground md:whitespace-nowrap">
                  Productos para diferentes enfoques
                </h3>
              </AnimateOnScroll>
              <div className="hidden md:block w-full h-px bg-transparent border-dashed border-b border-gray-200"></div>

              {focusCategories.length > 3 && (
                <AnimateOnScroll variant="fade" className="hidden md:flex gap-3 shrink-0">
                  <button
                    onClick={handleFocusPrev}
                    className="w-12 h-12 flex justify-center items-center rounded-full bg-primary-soft-gray-balance text-primary-orange transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    aria-label="Anterior"
                  >
                    <ChevronLeft size={24} strokeWidth={1.5} />
                  </button>
                  <button
                    onClick={handleFocusNext}
                    className="w-12 h-12 flex justify-center items-center rounded-full bg-primary-soft-gray-balance text-primary-orange transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
                    {focusCategories.map((category, index) => (
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
                {focusCategories.length > 1 && (
                  <div className="flex md:hidden justify-center gap-4 mt-4">
                    <button
                      onClick={handleFocusPrev}
                      className="w-10 h-10 flex justify-center items-center rounded-full bg-primary-soft-gray-balance text-primary-orange transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      aria-label="Anterior"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={handleFocusNext}
                      className="w-10 h-10 flex justify-center items-center rounded-full bg-primary-soft-gray-balance text-primary-orange transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
        )}

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
