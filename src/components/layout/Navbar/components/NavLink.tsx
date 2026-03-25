/**
 * @fileoverview Componente NavLink — link individual de la barra de navegación.
 *
 * Componente atómico que renderiza un link de navegación estilizado.
 * Incluye detección automática de ruta activa para mostrar un
 * indicador visual (borde inferior naranja) en el link correspondiente
 * a la página actual.
 *
 * Diseñado para ser compuesto dentro del Navbar y reutilizable
 * en versiones mobile/responsive.
 */

"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

/** Props del componente NavLink */
interface NavLinkProps {
  /** Texto visible del link */
  label: string;
  /** Ruta de destino (Next.js) */
  href: string;
  /** Clases CSS adicionales */
  className?: string;
}

/**
 * Link de navegación principal del Navbar.
 *
 * Detecta automáticamente si la ruta actual coincide con el `href`
 * y aplica un borde inferior naranja como indicador activo.
 * Para rutas anidadas (e.g., `/products/123`), también se marca como
 * activo si el pathname comienza con el href del link.
 *
 * @param props.label - Texto del link
 * @param props.href - URL de destino
 * @param props.className - Clases opcionales
 *
 * @example
 * <NavLink label="Productos" href="/products" />
 */
export function NavLink({ label, href, className }: NavLinkProps) {
  const pathname = usePathname();

  /**
   * Determina si este link está activo.
   * - Coincidencia exacta: `/products` === `/products`
   * - Coincidencia parcial (subrutas): `/products/123`.startsWith(`/products`)
   * - Excluye "/" para evitar que el home marque todos los links como activos.
   */
  const isActive =
    pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <Link
      href={href}
      prefetch={true} // ← Prefetch agresivo para la navegación principal (instant load)
      scroll={false} // Evitar el reinicio abrupto del scroll antes de la animación de salida
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "transition-all duration-200",
        "hover:text-foreground/80",
        "text-foreground",
        "flex items-center h-full border-b-2",
        // Estado activo: borde naranja visible | inactivo: borde transparente
        isActive
          ? "border-primary-orange text-foreground"
          : "border-transparent",
        className
      )}
    >
      {label}
    </Link>
  );
}
