/**
 * @fileoverview ProductsView — vista completa de la página "Nuestros Productos".
 *
 * Compone el Hero y el grid de tarjetas de productos.
 * Importada por `app/products/page.tsx` como thin wrapper.
 */

"use client";

import * as React from "react";
import { ProductsHero } from "../components/ProductsHero";
import { ProductCard, ProductCardSkeleton } from "../components/ProductCard";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";
import type { Product } from "../data/products";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { Filter } from "lucide-react";
import { EndBanner } from "@/components/layout/EndBanner";

/** Componente interno para reutilizar los filtros en Desktop y Mobile */
const FilterContent = ({ onApply }: { onApply?: () => void }) => (
  <div className="flex flex-col gap-8">
    <h3 className="text-xl font-bold text-foreground hidden lg:block">Filtros</h3>

    {/* Categorías */}
    <div>
      <h4 className="text-body-small font-semibold uppercase tracking-wider text-gray-900 mb-4">
        Categorías
      </h4>
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
      <h4 className="text-body-small font-semibold uppercase tracking-wider text-gray-900 mb-4">
        Laboratorio
      </h4>
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

/**
 * Vista completa de la página Products.
 *
 * Incluye el Hero y un grid interactivo de productos con cards
 * que enlazan a la vista de detalle `/products/[id]`.
 */
export function ProductsView() {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [page, setPage] = React.useState(1);
  const [loading, setLoading] = React.useState(true);
  const [totalPages, setTotalPages] = React.useState(1);
  const [isFiltersOpen, setIsFiltersOpen] = React.useState(false);

  React.useEffect(() => {
    let isMounted = true;
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products?page=${page}&limit=9`);
        const result = await res.json();

        if (!isMounted) return;

        setProducts(result.data);
        setTotalPages(result.meta.totalPages);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProducts();
    return () => { isMounted = false; };
  }, [page]);

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
                {loading ? (
                  // Mostramos 9 skeletons durante la carga en lugar de texto
                  Array.from({ length: 9 }).map((_, i) => (
                    <ProductCardSkeleton key={i} />
                  ))
                ) : (
                  products.map((product, index) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      index={index}
                    />
                  ))
                )}
              </div>

              {/* Paginación */}
              {totalPages > 1 && (
                <div className="mt-10 flex items-center justify-between gap-4">
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={page === 1 || loading}
                    onClick={() => {
                      setPage(p => Math.max(1, p - 1));
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    Atrás
                  </Button>

                  <span className="text-body-small font-medium text-gray-700">
                    {page}/{totalPages}
                  </span>

                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={page === totalPages || loading}
                    onClick={() => {
                      setPage(p => Math.min(totalPages, p + 1));
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
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
