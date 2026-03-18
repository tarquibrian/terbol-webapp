/**
 * @fileoverview Componente Navbar — barra de navegación principal del ecommerce.
 *
 * Arquitectura:
 * - Los links se definen en `Navbar.constants.ts` (data-driven).
 * - Cada link puede ser directo (NavLink) o con submenú (NavSubmenuTrigger).
 * - El componente Navbar solo se encarga de la composición y el layout.
 *
 * Componentes internos:
 * - `NavLink` → link atómico de navegación.
 * - `NavSubmenuTrigger` → botón + popup desplegable.
 * - `NavSubmenu` → panel del popup con items.
 *
 * @see {@link ./Navbar.constants.ts} para la configuración de links.
 * @see {@link ./Navbar.types.ts} para las interfaces de tipos.
 */

"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { SearchInput } from "@/components/ui/SearchInput";

import { NavLink } from "./NavLink";
import { NavSubmenuTrigger } from "./NavSubmenuTrigger";
import { NAV_LINKS } from "./Navbar.constants";

/**
 * Navbar principal del ecommerce Terbol.
 *
 * Renderiza:
 * 1. Logo con link al home.
 * 2. Barra de búsqueda.
 * 3. Links de navegación (con soporte de submenú).
 * 4. CTA de "Soy asesor de ventas".
 */
export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex max-w-[1512px] mx-auto px-16">
        <div className="border-b border-border flex gap-12 h-[100px] items-center w-full">

          {/* ─── Logo ─── */}
          <Link
            href="/"
            className="min-w-[180px] flex items-center gap-2 text-primary font-bold text-lg"
          >
            <Image src="/logo-terbol.svg" alt="Terbol" width={200} height={33} />
          </Link>

          {/* ─── Buscador ─── */}
          <SearchInput
            placeholder="Buscar productos..."
            className="w-full max-w-[400px] min-w-[240px]"
            onSearch={(query) => console.log("Buscando:", query)}
          />

          {/* ─── Navegación + CTA ─── */}
          <div className="flex flex-1 items-center justify-end gap-6 min-w-fit">

            {/* Links de Navegación */}
            <nav
              className="hidden md:flex items-center gap-6 text-body-sm h-full"
              aria-label="Navegación principal"
            >
              {NAV_LINKS.map((link) =>
                link.submenuItems ? (
                  /**
                   * Si el link tiene `submenuItems`, se renderiza como trigger
                   * de submenú desplegable con popup.
                   */
                  <NavSubmenuTrigger
                    key={link.label}
                    label={link.label}
                    items={link.submenuItems}
                  />
                ) : (
                  /**
                   * Link directo de navegación (sin submenú).
                   */
                  <NavLink
                    key={link.label}
                    label={link.label}
                    href={link.href!}
                  />
                )
              )}
            </nav>

            {/* CTA Principal */}
            <Button variant="default" size="default" icon={<ArrowRight />}>
              Soy asesor de ventas
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
