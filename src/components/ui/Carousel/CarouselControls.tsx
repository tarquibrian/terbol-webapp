/**
 * @fileoverview CarouselControls — controles de navegación compartidos.
 *
 * Centraliza el par prev/next que estaba duplicado en los cuatro carousels del
 * sitio, junto con su lógica: dar la vuelta al llegar al extremo y reiniciar el
 * timer de autoplay en cada interacción manual.
 *
 * Renderiza dos presentaciones a la vez, cada una visible en su breakpoint:
 * - Desktop (md+): flechas superpuestas sobre los bordes de los items.
 * - Mobile: fila de botones centrada debajo del carousel.
 *
 * IMPORTANTE: debe montarse dentro del contenedor `relative` que envuelve al
 * `CarouselContent` — de ese contenedor toman su posición las flechas
 * laterales. Va después del `CarouselContent` para que la fila mobile quede
 * debajo en el flujo normal.
 */

"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";
import { cn } from "@/lib/utils";
import type { CarouselApi } from "./Carousel";

interface CarouselControlsProps {
  api: CarouselApi;
  /** Flechas laterales en desktop. Apagar cuando todos los items ya se ven. */
  showSideControls?: boolean;
  /** Fila de botones debajo del carousel, en mobile. */
  showBottomControls?: boolean;
  /** Clases extra de la fila inferior, típicamente su separación superior. */
  bottomClassName?: string;
  previousLabel?: string;
  nextLabel?: string;
}

const BUTTON_BASE =
  "flex items-center justify-center rounded-full bg-primary-soft-gray-balance text-primary-orange transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

/**
 * Carril de altura completa que centra la flecha en vertical sin transform, y
 * deja pasar el puntero salvo en el botón — así la franja lateral no bloquea el
 * hover ni el arrastre sobre las cards.
 */
const SIDE_RAIL_BASE =
  "pointer-events-none absolute inset-y-0 z-10 hidden items-center md:flex";

/** El botón se corre media unidad hacia afuera para quedar a caballo del borde. */
const SIDE_BUTTON_BASE = "pointer-events-auto h-12 w-12 shadow-md";

export function CarouselControls({
  api,
  showSideControls = true,
  showBottomControls = true,
  bottomClassName = "mt-8",
  previousLabel = "Anterior",
  nextLabel = "Siguiente",
}: CarouselControlsProps) {
  const scrollPrev = React.useCallback(() => {
    if (!api) return;

    // El fallback cubre carousels sin `loop`: al llegar al inicio va al final.
    if (api.canScrollPrev()) {
      api.scrollPrev();
    } else {
      api.scrollTo(api.scrollSnapList().length - 1);
    }

    api.plugins()?.autoplay?.reset();
  }, [api]);

  const scrollNext = React.useCallback(() => {
    if (!api) return;

    if (api.canScrollNext()) {
      api.scrollNext();
    } else {
      api.scrollTo(0);
    }

    api.plugins()?.autoplay?.reset();
  }, [api]);

  return (
    <>
      {showSideControls && (
        <>
          <AnimateOnScroll
            variant="fade"
            className={cn(SIDE_RAIL_BASE, "left-0")}
          >
            <button
              type="button"
              onClick={scrollPrev}
              aria-label={previousLabel}
              className={cn(BUTTON_BASE, SIDE_BUTTON_BASE, "-translate-x-1/2")}
            >
              <ChevronLeft size={24} strokeWidth={1.5} />
            </button>
          </AnimateOnScroll>

          <AnimateOnScroll
            variant="fade"
            className={cn(SIDE_RAIL_BASE, "right-0")}
          >
            <button
              type="button"
              onClick={scrollNext}
              aria-label={nextLabel}
              className={cn(BUTTON_BASE, SIDE_BUTTON_BASE, "translate-x-1/2")}
            >
              <ChevronRight size={24} strokeWidth={1.5} />
            </button>
          </AnimateOnScroll>
        </>
      )}

      {showBottomControls && (
        <AnimateOnScroll
          variant="fade"
          className={cn("flex justify-center gap-4 md:hidden", bottomClassName)}
        >
          <button
            type="button"
            onClick={scrollPrev}
            aria-label={previousLabel}
            className={cn(BUTTON_BASE, "h-10 w-10")}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            onClick={scrollNext}
            aria-label={nextLabel}
            className={cn(BUTTON_BASE, "h-10 w-10")}
          >
            <ChevronRight size={20} />
          </button>
        </AnimateOnScroll>
      )}
    </>
  );
}
