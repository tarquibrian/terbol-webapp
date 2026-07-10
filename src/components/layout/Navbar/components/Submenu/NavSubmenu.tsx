/**
 * @fileoverview Componente NavSubmenu — popup desplegable de navegación.
 *
 * Renderiza una lista de links secundarios dentro de un panel flotante
 * con animación de entrada/salida. Diseñado para ser controlado externamente
 * mediante props (patrón controlado).
 *
 * Características:
 * - Animación CSS suave de apertura (scale + opacity).
 * - Soporte de descripciones opcionales por cada link.
 * - Cierre automático al navegar a un link.
 * - Roles ARIA para accesibilidad (menu/menuitem).
 */

"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { NavSubmenuItem } from "../../Navbar.types";

/** Props del componente NavSubmenu */
interface NavSubmenuProps {
  /** Lista de items a renderizar en el submenú */
  items: NavSubmenuItem[];
  /** Callback que se ejecuta al hacer click en un link (para cerrar el menú) */
  onItemClick?: () => void;
  /** Clases CSS adicionales para el contenedor */
  className?: string;
}

/**
 * Panel desplegable con links de navegación secundarios.
 *
 * @param props.items - Array de items ({label, href, description?})
 * @param props.onItemClick - Callback al seleccionar un item
 * @param props.className - Clases CSS opcionales
 *
 * @example
 * <NavSubmenu
 *   items={[
 *     { label: "Ciencia y Calidad", href: "/science-and-quality", description: "Respaldo científico" },
 *     { label: "FAQ", href: "/faq" },
 *   ]}
 *   onItemClick={() => setIsOpen(false)}
 * />
 */
export function NavSubmenu({ items, onItemClick, className }: NavSubmenuProps) {
  return (
    <div
      role="menu"
      aria-label="Submenú de navegación"
      className={cn(
        // Posicionamiento
        "absolute top-full right-0 mt-3",
        // Dimensiones
        "min-w-[280px] w-max",
        // Fondo y bordes
        "bg-background rounded-xl",
        "border border-border",
        // Sombra premium
        "shadow-[0_8px_30px_rgba(0,0,0,0.08)]",
        // Padding
        "p-2",
        // Animación de entrada
        "animate-in fade-in-0 zoom-in-95",
        "origin-top-right",
        "duration-200 ease-out",
        className
      )}
    >
      <ul className="flex flex-col gap-0.5">
        {items.map((item) => (
          <li key={item.href} role="none">
            <Link
              href={item.href!}
              prefetch={true}
              scroll={false}
              role="menuitem"
              onClick={onItemClick}
              className="flex flex-col gap-1 rounded-xl p-3 hover:bg-gray-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring group"
            >
              {/* Label principal */}
              <span
                className={cn(
                  "text-body-sm font-medium text-foreground",
                  "group-hover:text-button-orange",
                  "transition-colors duration-150"
                )}
              >
                {item.label}
              </span>

              {/* Descripción opcional */}
              {item.description && (
                <span className="text-[13px] leading-snug text-gray-400">
                  {item.description}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
