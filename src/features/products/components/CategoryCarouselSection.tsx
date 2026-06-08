"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CategoryCard } from "@/components/ui/CategoryCard/CategoryCard";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";
import { Carousel, CarouselContent, CarouselItem, Autoplay, type CarouselApi } from "@/components/ui/Carousel/Carousel";

export interface CategoryData {
  id: string;
  name: string;
  imageSrc: string;
  href: string;
}

// Datos de categorías de ejemplo
const DEFAULT_CATEGORIES: CategoryData[] = [
  { id: "1", name: "Energía y Vitalidad", imageSrc: "/categories/img1.png", href: "/products?category=energia" },
  { id: "2", name: "Sistema Inmunológico", imageSrc: "/categories/img2.png", href: "/products?category=inmunologico" },
  { id: "3", name: "Belleza y Piel", imageSrc: "/categories/img3.png", href: "/products?category=belleza" },
  { id: "4", name: "Rendimiento Deportivo", imageSrc: "/categories/img4.png", href: "/products?category=deporte" },
  { id: "5", name: "Longevidad", imageSrc: "/categories/img1.png", href: "/products?category=longevidad" },
  { id: "6", name: "Descanso y Sueño", imageSrc: "/categories/img2.png", href: "/products?category=descanso" },
];

interface CategoryCarouselSectionProps {
  /** Las categorías a mostrar en el carousel */
  categories?: CategoryData[];
  /** Título de la sección */
  title?: string;
  /** Intervalo de auto-play en milisegundos. 0 para desactivar. */
  autoplayIntervalMs?: number;
}

export function CategoryCarouselSection({
  categories = DEFAULT_CATEGORIES,
  title = "Tipo de consumo",
  autoplayIntervalMs = 5000,
}: CategoryCarouselSectionProps) {

  const plugin = React.useMemo(() => {
    return autoplayIntervalMs > 0
      ? [Autoplay({ delay: autoplayIntervalMs, stopOnInteraction: false, stopOnMouseEnter: true })]
      : [];
  }, [autoplayIntervalMs]);

  const [api, setApi] = React.useState<CarouselApi>();

  /** Navega al slide anterior y resetea el timer de autoplay */
  const handlePrev = React.useCallback(() => {
    api?.scrollPrev();
    api?.plugins()?.autoplay?.reset();
  }, [api]);

  /** Navega al slide siguiente y resetea el timer de autoplay */
  const handleNext = React.useCallback(() => {
    api?.scrollNext();
    api?.plugins()?.autoplay?.reset();
  }, [api]);

  if (!categories || categories.length === 0) return null;

  return (
    <section className="wrapper-section pb-16 md:pb-24 overflow-hidden">
      <Carousel
        opts={{ loop: true, align: "start" }}
        plugins={plugin}
        setApi={setApi}
        className="wrapper-content flex flex-col gap-8"
      >
        {/* Header del Carousel: Título y Controles */}
        <div className="flex justify-between items-center gap-6 0">
          <AnimateOnScroll variant="slide-up" className="shrink-0 whitespace-nowrap">
            <h2 className="text-body-medium uppercase text-gray-300 font-medium">{title}</h2>
          </AnimateOnScroll>

          <div className="flex-1 h-px bg-gray-100"></div>

          {categories.length > 3 && (
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

        {/* Carousel Wrapper */}
        <AnimateOnScroll variant="slide-up" delay={0.2}>
          <div className="relative w-full">
            <div className="px-0 md:px-0">
              <CarouselContent>
                {categories.map((category, idx) => (
                  <CarouselItem
                    key={category.id}
                    className="w-full md:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                  >
                    <CategoryCard
                      name={category.name}
                      imageSrc={category.imageSrc}
                      href={category.href}
                      index={idx}
                      disableAnimation={true}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </div>

            {/* Controles para Mobile */}
            {categories.length > 1 && (
              <div className="flex md:hidden justify-center gap-4 mt-8">
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
    </section>
  );
}
