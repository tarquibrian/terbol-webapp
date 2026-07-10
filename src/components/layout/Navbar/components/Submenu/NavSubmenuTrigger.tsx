/**
 * @fileoverview Componente NavSubmenuTrigger — botón que despliega el submenú.
 *
 * Combina un botón trigger con el panel NavSubmenu.
 * Utiliza el hook `useNavSubmenu` para gestionar todo el ciclo de vida
 * del popup (apertura, cierre, click-outside, Escape).
 *
 * Detección de ruta activa:
 * El trigger se marca como "activo" cuando la ruta actual coincide
 * con el `href` de cualquiera de sus items del submenú. Esto permite
 * que el usuario sepa visualmente que está en una sección del submenú.
 *
 * Atributos ARIA:
 * - `aria-expanded`: indica el estado del submenú.
 * - `aria-haspopup`: indica que el botón despliega un menú.
 * - `aria-current`: indica la sección activa de navegación.
 */

"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { NavSubmenu } from "./NavSubmenu";
import { useNavSubmenu } from "../../hooks/useNavSubmenu";
import type { NavSubmenuItem } from "../../Navbar.types";

/** Props del componente NavSubmenuTrigger */
interface NavSubmenuTriggerProps {
  /** Texto visible del botón trigger */
  label: string;
  /** Items que se renderizan en el submenú desplegable */
  items: NavSubmenuItem[];
  /** Clases CSS adicionales */
  className?: string;
}

/**
 * Botón trigger + submenú desplegable.
 *
 * Se marca como activo si la ruta actual coincide con alguno
 * de los `href` de sus `items` del submenú.
 *
 * @param props.label - Texto del botón (e.g., "Más")
 * @param props.items - Array de items del submenú
 * @param props.className - Clases opcionales
 *
 * @example
 * <NavSubmenuTrigger
 *   label="Más"
 *   items={[
 *     { label: "Ciencia y Calidad", href: "/science-and-quality" },
 *     { label: "FAQ", href: "/faq" },
 *   ]}
 * />
 */
export function NavSubmenuTrigger({
  label,
  items,
  className,
}: NavSubmenuTriggerProps) {
  const { isOpen, toggle, close, submenuRef } = useNavSubmenu();
  const pathname = usePathname();

  /**
   * El trigger se considera activo si el pathname actual coincide
   * con el `href` de alguno de sus items (exacta o parcialmente).
   *
   * Ejemplo: si items incluye { href: "/products" } y pathname es
   * "/products/1", el trigger se marca como activo.
   */
  const isActive = items.some(
    (item) =>
      pathname === item.href ||
      (item.href !== "/" && pathname.startsWith(item.href))
  );

  return (
    <div ref={submenuRef} className={cn("relative h-full", className)}>
      {/* Botón Trigger */}
      <button
        type="button"
        onClick={toggle}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-current={isActive ? "true" : undefined}
        className={cn(
          "flex items-center gap-1",
          "transition-all duration-200",
          "hover:text-foreground/80",
          "text-foreground",
          "cursor-pointer",
          "h-full border-b-2",
          // Focus visible para accesibilidad
          "focus-visible:outline-none focus-visible:ring-2",
          "focus-visible:ring-ring focus-visible:rounded-sm",
          // Estado activo: borde naranja | inactivo: borde transparente
          isActive
            ? "border-primary-orange text-foreground font-medium"
            : "border-transparent"
        )}
      >
        {label}

        {/* Icono chevron con rotación animada */}
        <ChevronDown
          className={cn(
            "h-4 w-4 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {/* Panel del submenú — renderizado condicional */}
      {isOpen && <NavSubmenu items={items} onItemClick={close} />}
    </div>
  );
}
