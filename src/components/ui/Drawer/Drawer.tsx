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
}

/**
 * Componente abstracto UI: Drawer (Panel deslizable lateral).
 * Escapa el árbol de React y previene problemas de Stacking Context renderizando
 * con `createPortal` hacia `document.body`.
 */
export function Drawer({ isOpen, onClose, title, children, className, instantClose }: DrawerProps) {
  const [mounted, setMounted] = React.useState(false);

  // Evitar error de hidratación renderizando el Portal solo en el cliente
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Bloquear scroll global del documento cuando está abierto
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!mounted) return null;

  return createPortal(
    <>
      {/* Overlay oscuro de fondo */}
      <div
        className={cn(
          "fixed inset-0 z-100 bg-black/30 backdrop-blur-sm",
          instantClose ? "transition-none duration-0" : "transition-all duration-400",
          isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Contenedor transparente estricto para clip (`overflow-hidden`) que evita scrollbar del layout */}
      <div className="fixed inset-0 z-101 overflow-hidden pointer-events-none">
        {/* Panel lateral deslizable */}
        <div
          className={cn(
            "absolute inset-y-0 right-0 w-full bg-background shadow-2xl flex flex-col pointer-events-auto",
            instantClose ? "transition-none duration-0" : "transition-transform duration-600 ease-in-out",
            isOpen ? "translate-x-0" : "translate-x-full",
            className
          )}
        >
          {/* Drawer Header (Opcional, pero se asume un diseño estándar con 'X') */}
          <div className="flex items-center justify-between p-6">
            {title ? (
              <span className="font-medium text-h5 text-primary-orange">{title}</span>
            ) : (
              <div /> // Espaciador para justificar 'X' a la derecha si no hay título
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar modal"
              className="p-2 -mr-2 rounded-md hover:bg-gray-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <X className="h-6 w-6 text-foreground" />
            </button>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden py-3 px-3">
            {children}
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}
