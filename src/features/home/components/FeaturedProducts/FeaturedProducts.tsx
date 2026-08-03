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
import { ArrowRight } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, Autoplay, type CarouselApi } from "@/components/ui/Carousel/Carousel";
import { CarouselControls } from "@/components/ui/Carousel/CarouselControls";
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

                {/* Flechas laterales (desktop) + fila de botones (mobile) */}
                <CarouselControls
                  api={productApi}
                  showSideControls={hasFeaturedProductDesktopControls}
                  showBottomControls={hasMultipleFeaturedProducts}
                  bottomClassName="mt-4"
                  previousLabel="Producto anterior"
                  nextLabel="Producto siguiente"
                />
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

                {/* Flechas laterales (desktop) + fila de botones (mobile) */}
                <CarouselControls
                  api={focusApi}
                  showSideControls={focusCategories.length > 3}
                  showBottomControls={focusCategories.length > 1}
                  bottomClassName="mt-4"
                />
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
