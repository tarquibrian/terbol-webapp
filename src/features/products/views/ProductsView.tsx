/**
 * @fileoverview ProductsView — vista completa de la página "Nuestros Productos".
 *
 * Compone el Hero, los Filtros y el grid paginado de productos.
 * La paginación se sincroniza con la URL (?page=2) para que las
 * URLs sean compartibles y navegables.
 *
 * Cuando se integre el backend real, solo hay que cambiar la URL
 * del fetch en `fetchProducts()`.
 */

"use client";

import * as React from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { ProductsHero } from "../components/ProductsHero";
import { ProductCard, ProductCardSkeleton } from "../components/ProductCard";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";
import type { Product } from "../data/products";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { Filter } from "lucide-react";
import { EndBanner } from "@/components/layout/EndBanner";

// ─── Constantes ───
const PRODUCTS_PER_PAGE = 9;

// ─── Filtros (Desktop & Mobile reutilizable) ───
const FilterContent = ({ onApply }: { onApply?: () => void }) => (
  <div className="flex flex-col gap-8">
    <h2 className="text-xl font-bold text-foreground hidden lg:block">Filtros</h2>

    {/* Categorías */}
    <div>
      <h3 className="text-body-small font-semibold uppercase tracking-wider text-gray-900 mb-4">
        Categorías
      </h3>
      <ul className="space-y-3">
        {["Analgésicos", "Antibióticos", "Dermatología", "Vitaminas"].map((cat) => (
          <li key={cat} className="flex items-center gap-3 text-foreground/80 hover:text-primary-orange cursor-pointer transition-colors">
            <div className="w-4 h-4 border border-primary-light-gray rounded-sm shrink-0" />
            <span className="text-body-small">{cat}</span>
          </li>
        ))}
      </ul>
    </div>

    <div className="w-full h-px bg-gray-100"></div>

    {/* Laboratorio */}
    <div>
      <h3 className="text-body-small font-semibold uppercase tracking-wider text-gray-900 mb-4">
        Laboratorio
      </h3>
      <ul className="space-y-3">
        {["Terbol", "Genéricos", "Importados"].map((lab) => (
          <li key={lab} className="flex items-center gap-3 text-foreground/80 hover:text-primary-orange cursor-pointer transition-colors">
            <div className="w-4 h-4 border border-primary-light-gray rounded-sm shrink-0" />
            <span className="text-body-small">{lab}</span>
          </li>
        ))}
      </ul>
    </div>

    {/* Botón Aplicar */}
    <Button size="sm" variant="secondary" className="w-full" onClick={onApply}>Aplicar Filtros</Button>
  </div>
);

// ─── Vista Principal ───
export function ProductsView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Leer la página actual desde la URL (?page=X)
  const currentPage = Number(searchParams.get("page")) || 1;

  const [products, setProducts] = React.useState<Product[]>([]);
  const [totalPages, setTotalPages] = React.useState(1);
  const [loading, setLoading] = React.useState(true);
  const [isFiltersOpen, setIsFiltersOpen] = React.useState(false);

  // ─── Fetch de productos ───
  // Se dispara cada vez que cambia 'currentPage' (derivado de la URL)
  React.useEffect(() => {
    let cancelled = false;
    setLoading(true);

    fetch(`/api/products?page=${currentPage}&limit=${PRODUCTS_PER_PAGE}`)
      .then((res) => res.json())
      .then((result) => {
        if (cancelled) return;
        setProducts(result.data);
        setTotalPages(result.meta.totalPages);
      })
      .catch((err) => console.error("Error fetching products:", err))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [currentPage]);

  // ─── Navegación de página ───
  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <ProductsHero />

      {/* Sección del catálogo de productos */}
      <section className="w-full pb-20">
        <div className="wrapper-content">

          {/* Drawer Mobile de Filtros */}
          <Drawer
            isOpen={isFiltersOpen}
            onClose={() => setIsFiltersOpen(false)}
            title="Filtros"
            side="left"
            className="max-w-[320px]"
          >
            <FilterContent onApply={() => setIsFiltersOpen(false)} />
          </Drawer>

          {/* Botón Mostrar Filtros (Mobile) */}
          <div className="w-full lg:hidden mb-6 flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFiltersOpen(true)}
              className="flex items-center gap-2"
            >
              <Filter size={18} />
              Mostrar Filtros
            </Button>
          </div>

          {/* Layout Principal: Filtros + Grid de Productos */}
          <div className="flex flex-col lg:flex-row gap-x-8 gap-y-8 items-start">

            {/* Columna Izquierda: Filtros de Búsqueda (Desktop) */}
            <aside className="hidden lg:block w-[300px] sticky top-32 pb-[78px] shrink-0">
              <AnimateOnScroll variant="slide-up">
                <FilterContent />
              </AnimateOnScroll>
            </aside>

            {/* Columna Derecha: Grid de Productos */}
            <div className="flex-1 w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {loading
                  ? Array.from({ length: PRODUCTS_PER_PAGE }).map((_, i) => (
                    <ProductCardSkeleton key={`skeleton-${i}`} />
                  ))
                  : products.map((product, index) => (
                    <ProductCard key={product.id} product={product} index={index} />
                  ))
                }
              </div>

              {/* Paginación */}
              {totalPages > 1 && (
                <div className="mt-10 flex items-center justify-between gap-4">
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={currentPage <= 1 || loading}
                    onClick={() => goToPage(currentPage - 1)}
                  >
                    Atrás
                  </Button>

                  <span className="text-body-small font-medium text-gray-700">
                    {currentPage}/{totalPages}
                  </span>

                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={currentPage >= totalPages || loading}
                    onClick={() => goToPage(currentPage + 1)}
                  >
                    Siguiente
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      <EndBanner />
    </>
  );
}
