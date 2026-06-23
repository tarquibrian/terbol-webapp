/**
 * @fileoverview ProductsHero — sección hero de la página "Nuestros Productos".
 *
 * Componente de presentación con título y descripción del catálogo.
 * Sigue el layout estándar: section full-width + container 1512px + px-16.
 *
 * Animaciones:
 * - Título: slide-up (aparece subiendo)
 * - Descripción: slide-up con delay (efecto stagger)
 */

"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";
import { SearchInput } from "@/components/ui/SearchInput";

/**
 * Hero de la sección Productos con descripción del catálogo Terbol.
 */
export function ProductsHero({ totalResults, loading }: { totalResults?: number, loading?: boolean }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSearch = searchParams.get("search") || "";

  const handleSearch = (query: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (query.trim()) {
      params.set("search", query.trim());
    } else {
      params.delete("search");
    }
    params.set("page", "1");
    router.push(`/products?${params.toString()}`, { scroll: false });
  };

  return (
    <section className="wrapper-section pb-0">
      <div className="wrapper-content">
        {/* Breadcrumb - Índice de navegación */}
        <nav className="flex items-center gap-2 text-body-medium text-foreground/60 mb-6">
          <Link
            href="/"
            className="hover:text-primary-orange transition-colors duration-200"
          >
            Inicio
          </Link>
          <span className="text-foreground/40">/</span>
          <span className="text-foreground font-medium">Productos</span>
        </nav>

        {/* Título y Buscador — slide-up inmediato */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-6 lg:gap-10">
          <AnimateOnScroll variant="slide-up">
            <h1 className="heading-h4 font-bold">
              Nuestros Productos
            </h1>
          </AnimateOnScroll>

          <AnimateOnScroll variant="slide-up" delay={0.1} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:max-w-[600px] lg:justify-end">
            <span
              className="text-body-sm text-foreground/60 whitespace-nowrap order-2 sm:order-1 sm:flex sm:w-[112px] sm:shrink-0 sm:items-center sm:justify-end sm:text-right"
              aria-live="polite"
              aria-atomic="true"
            >
              {loading || totalResults === undefined ? (
                "…"
              ) : (
                `${totalResults} resultado${totalResults !== 1 ? "s" : ""}`
              )}
            </span>
            <span
              aria-hidden="true"
              className="hidden sm:block order-2 h-6 w-px shrink-0 bg-gray-200"
            />
            <SearchInput
              placeholder="Buscar productos…"
              defaultValue={currentSearch}
              className="w-full order-1 sm:order-3 sm:flex-1 sm:min-w-0"
              onSearch={handleSearch}
            />
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}
