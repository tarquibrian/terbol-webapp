"use client";

import * as React from "react";
import { ProductCard } from "./ProductCard/ProductCard";
import type { Product } from "../data/products";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";

import { Carousel, CarouselContent, CarouselItem, Autoplay, type CarouselApi } from "@/components/ui/Carousel/Carousel";
import { CarouselControls } from "@/components/ui/Carousel/CarouselControls";

interface ProductCarouselSectionProps {
  /** Los productos a mostrar en el carousel */
  products: Product[];
  /** Título de la sección */
  title?: string;
  /** Intervalo de auto-play en milisegundos. 0 para desactivar. */
  autoplayIntervalMs?: number;
}

const ITEM_FADE_DURATION_SECONDS = 0.9;
const ITEM_FADE_STAGGER_SECONDS = 0.14;

export function ProductCarouselSection({
  products,
  title = "Productos similares",
  autoplayIntervalMs = 5000,
}: ProductCarouselSectionProps) {
  const hasMultipleItems = products.length > 1;

  const plugin = React.useMemo(() => {
    return autoplayIntervalMs > 0
      ? [Autoplay({ delay: autoplayIntervalMs, stopOnInteraction: false, stopOnMouseEnter: true })]
      : [];
  }, [autoplayIntervalMs]);

  const [api, setApi] = React.useState<CarouselApi>();

  if (products.length === 0) return null;

  return (
    <section className="w-full overflow-hidden py-6 md:py-8 lg:py-12">
      <Carousel
        opts={{ loop: true, align: "start" }}
        plugins={plugin}
        setApi={setApi}
        className="wrapper-content flex flex-col gap-8"
      >
        {/* Header del Carousel: Título y Controles */}
        <div className="flex justify-between items-center gap-6">
          <AnimateOnScroll variant="fade" className="shrink-0 whitespace-nowrap">
            <h2 className="text-body-medium uppercase text-gray-300 font-medium">{title}</h2>
          </AnimateOnScroll>

          <div className="flex-1 h-px bg-gray-100"></div>
        </div>

        {/* Carousel Wrapper */}
        <div className="relative w-full">
          <div className="px-0 md:px-0">
            <CarouselContent>
              {products.map((product, idx) => (
                <CarouselItem
                  key={product.id}
                  className="w-full md:basis-1/2 lg:basis-1/3"
                >
                  <AnimateOnScroll
                    variant="fade"
                    duration={ITEM_FADE_DURATION_SECONDS}
                    delay={(idx % 3) * ITEM_FADE_STAGGER_SECONDS}
                  >
                    <ProductCard
                      product={product}
                      index={idx}
                      disableAnimation={true}
                    />
                  </AnimateOnScroll>
                </CarouselItem>
              ))}
            </CarouselContent>
          </div>

          {/* Flechas laterales (desktop) + fila de botones (mobile) */}
          {hasMultipleItems && <CarouselControls api={api} />}
        </div>
      </Carousel>
    </section>
  );
}
