"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/** Props del componente Drawer reutilizable */
export interface DrawerProps {
  /** Indica si el drawer está visible */
  isOpen: boolean;
  /** Callback para cerrar el drawer (accionado por el X o click afuera) */
  onClose: () => void;
  /** Título opcional para mostrar en el Header del modal */
  title?: React.ReactNode;
  /** Contenido interno */
  children: React.ReactNode;
  /** Clases CSS extra para aplicarse *al panel* del Drawer (ej. md:max-w-[400px]) */
  className?: string;
  /** Si es true, cancela la animación y cierra instantáneamente */
  instantClose?: boolean;
  /** Lado desde el cual se desliza el panel (por defecto "right") */
  side?: "left" | "right";
}

/**
 * Componente abstracto UI: Drawer (Panel deslizable lateral).
 * Escapa el árbol de React y previene problemas de Stacking Context renderizando
 * con `createPortal` hacia `document.body`.
 *
 * Usa un estado de renderizado en dos fases (`visible` → `animating`) para
 * garantizar que la animación de entrada se ejecute correctamente. Sin este
 * patrón, el browser puede optimizar el cambio `translate-x-full → translate-x-0`
 * y renderizarlo de forma instantánea (sin transición).
 */
export function Drawer({ isOpen, onClose, title, children, className, instantClose, side = "right" }: DrawerProps) {
  const [mounted, setMounted] = React.useState(false);
  // `visible` controla si los elementos del Drawer están en el DOM
  // `animating` controla si la animación de slide-in está activa (desfasada un frame)
  const [visible, setVisible] = React.useState(false);
  const [animating, setAnimating] = React.useState(false);
  const titleId = React.useId();
  const closeButtonRef = React.useRef<HTMLButtonElement>(null);
  const previousActiveElementRef = React.useRef<HTMLElement | null>(null);

  // Evitar error de hidratación renderizando el Portal solo en el cliente
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Dos fases de apertura/cierre:
  // Apertura: isOpen=true → visible=true (monta en DOM) → siguiente frame → animating=true (anima)
  // Cierre:   isOpen=false → animating=false (anima salida) → al terminar → visible=false (desmonta)
  React.useEffect(() => {
    if (isOpen) {
      // Fase 1: montar en el DOM
      setVisible(true);
      // Fase 2: esperar un frame para que el browser pinte la posición inicial,
      // luego activar la animación de entrada
      const frameId = requestAnimationFrame(() => {
        // Forzar un segundo frame para garantizar que el layout se estabilizó
        requestAnimationFrame(() => {
          setAnimating(true);
        });
      });
      return () => cancelAnimationFrame(frameId);
    } else {
      // Activar animación de salida
      setAnimating(false);
    }
  }, [isOpen]);

  // Cuando la animación de salida termina, desmontar del DOM
  const handleTransitionEnd = React.useCallback(
    (event: React.TransitionEvent<HTMLDivElement>) => {
      // Solo respondemos al transitionend del panel, no de hijos
      if (event.currentTarget !== event.target) return;
      if (!isOpen && !animating) {
        setVisible(false);
      }
    },
    [isOpen, animating],
  );

  // Bloquear scroll global del documento cuando está abierto
  React.useEffect(() => {
    if (isOpen) {
      previousActiveElementRef.current =
        document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null;
      document.body.style.overflow = "hidden";
      window.requestAnimationFrame(() => closeButtonRef.current?.focus());
    } else {
      document.body.style.overflow = "";
      previousActiveElementRef.current?.focus();
      previousActiveElementRef.current = null;
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  React.useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!mounted || !visible) return null;

  const shouldAnimate = !instantClose;
  const isSlideIn = animating;

  return createPortal(
    <>
      {/* Overlay oscuro de fondo */}
      <div
        className={cn(
          "fixed inset-0 z-100 bg-black/30 backdrop-blur-sm",
          shouldAnimate ? "transition-opacity duration-400" : "transition-none duration-0",
          isSlideIn ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Contenedor transparente estricto para clip (`overflow-hidden`) que evita scrollbar del layout */}
      <div className="fixed inset-0 z-101 overflow-hidden pointer-events-none">
        {/* Panel lateral deslizable */}
        <div
          className={cn(
            "absolute inset-y-0 w-full bg-background shadow-2xl flex flex-col pointer-events-auto",
            side === "left" ? "left-0" : "right-0",
            shouldAnimate ? "transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]" : "transition-none duration-0",
            isSlideIn ? "translate-x-0" : side === "left" ? "-translate-x-full" : "translate-x-full",
            className
          )}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? titleId : undefined}
          aria-hidden={!isOpen}
          inert={!isOpen}
          tabIndex={-1}
          onTransitionEnd={handleTransitionEnd}
        >
          {/* Drawer Header (Opcional, pero se asume un diseño estándar con 'X') */}
          <div className="flex items-center justify-between p-6">
            {title ? (
              <h2 id={titleId} className="font-medium text-h5 text-primary-orange">
                {title}
              </h2>
            ) : (
              <div /> // Espaciador para justificar 'X' a la derecha si no hay título
            )}
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              aria-label="Cerrar modal"
              className="p-2 -mr-2 rounded-md hover:bg-gray-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <X className="h-6 w-6 text-foreground" aria-hidden="true" />
            </button>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden overscroll-contain py-3 px-3">
            {children}
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}
