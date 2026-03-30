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
import { CONSUMPTION_CATEGORIES } from "../data/products";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { Filter } from "lucide-react";
import { EndBanner } from "@/components/layout/EndBanner";

// ─── Constantes ───
const PRODUCTS_PER_PAGE = 9;

// ─── Filtros (Desktop & Mobile reutilizable) ───
const FilterContent = ({ 
  onApply,
  selectedCategories,
  selectedConsumptionTypes,
  onFilterChange
}: { 
  onApply: () => void;
  selectedCategories: string[];
  selectedConsumptionTypes: string[];
  onFilterChange: (type: "category" | "consumptionType", value: string) => void;
}) => (
  <div className="flex flex-col gap-8">
    <h2 className="text-xl font-bold text-foreground hidden lg:block">Filtros</h2>

    {/* Categorías (Multi-select) */}
    <div>
      <h3 className="text-body-small font-semibold uppercase tracking-wider text-gray-900 mb-4">
        Tipo de producto
      </h3>
      <ul className="space-y-3">
        {["Medicamentos", "Suplementos", "Vitaminas"].map((cat) => {
          const isSelected = selectedCategories.includes(cat);
          return (
            <li 
              key={cat} 
              className={`flex items-center gap-3 cursor-pointer transition-colors ${isSelected ? 'text-primary-orange font-medium' : 'text-foreground/80 hover:text-primary-orange'}`}
              onClick={() => onFilterChange("category", cat)}
            >
              <div className={`w-4 h-4 border rounded-sm shrink-0 flex items-center justify-center ${isSelected ? 'border-primary-orange bg-primary-orange' : 'border-primary-light-gray'}`}>
                {isSelected && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
              </div>
              <span className="text-body-small">{cat}</span>
            </li>
          );
        })}
      </ul>
    </div>

    <div className="w-full h-px bg-gray-100"></div>

    {/* Laboratorio (Multi-select) */}
    <div>
      <h3 className="text-body-small font-semibold uppercase tracking-wider text-gray-900 mb-4">
        Tipo de consumo
      </h3>
      <ul className="space-y-3">
        {CONSUMPTION_CATEGORIES.map((categoryObj) => {
          const lab = categoryObj.name;
          const isSelected = selectedConsumptionTypes.includes(lab);
          return (
            <li 
              key={lab} 
              className={`flex items-center gap-3 cursor-pointer transition-colors ${isSelected ? 'text-primary-orange font-medium' : 'text-foreground/80 hover:text-primary-orange'}`}
              onClick={() => onFilterChange("consumptionType", lab)}
            >
              <div className={`w-4 h-4 border rounded-sm shrink-0 flex items-center justify-center ${isSelected ? 'border-primary-orange bg-primary-orange' : 'border-primary-light-gray'}`}>
                {isSelected && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
              </div>
              <span className="text-body-small">{lab}</span>
            </li>
          );
        })}
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
  const appliedCategories = searchParams.getAll("category");
  const appliedConsumptionTypes = searchParams.getAll("consumptionType");
  const searchQuery = searchParams.get("search");

  const [products, setProducts] = React.useState<Product[]>([]);
  const [totalPages, setTotalPages] = React.useState(1);
  const [totalResults, setTotalResults] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [isFiltersOpen, setIsFiltersOpen] = React.useState(false);

  // Estados locales para los filtros antes de aplicarlos
  const [pendingCategories, setPendingCategories] = React.useState<string[]>([]);
  const [pendingConsumptionTypes, setPendingConsumptionTypes] = React.useState<string[]>([]);

  // Sincronizar estado local cuando cambian los params de la URL
  React.useEffect(() => {
    setPendingCategories(searchParams.getAll("category"));
    setPendingConsumptionTypes(searchParams.getAll("consumptionType"));
  }, [searchParams]);

  // ─── Fetch de productos ───
  // Se dispara cada vez que cambia 'currentPage' o los parámetros de la URL
  React.useEffect(() => {
    let cancelled = false;
    setLoading(true);

    const params = new URLSearchParams();
    params.set("page", currentPage.toString());
    params.set("limit", PRODUCTS_PER_PAGE.toString());
    appliedCategories.forEach((cat) => params.append("category", cat));
    appliedConsumptionTypes.forEach((type) => params.append("consumptionType", type));
    if (searchQuery) params.set("search", searchQuery);

    fetch(`/api/products?${params.toString()}`)
      .then((res) => res.json())
      .then((result) => {
        if (cancelled) return;
        setProducts(result.data);
        setTotalPages(result.meta.totalPages);
        setTotalResults(result.meta.total);
      })
      .catch((err) => console.error("Error fetching products:", err))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [currentPage, searchParams]); // Usamos searchParams como dependencia porque contiene todo lo aplicado

  // ─── Navegación de página y filtros ───
  const updateParams = (newParams: URLSearchParams) => {
    router.push(`${pathname}?${newParams.toString()}`, { scroll: false });
  };

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    updateParams(params);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePendingFilterChange = (type: "category" | "consumptionType", value: string) => {
    if (type === "category") {
      setPendingCategories((prev) =>
        prev.includes(value) ? prev.filter((c) => c !== value) : [...prev, value]
      );
    } else {
      setPendingConsumptionTypes((prev) =>
        prev.includes(value) ? prev.filter((t) => t !== value) : [...prev, value]
      );
    }
  };

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Clear old filters and set new ones
    params.delete("category");
    pendingCategories.forEach((cat) => params.append("category", cat));
    
    params.delete("consumptionType");
    pendingConsumptionTypes.forEach((type) => params.append("consumptionType", type));
    
    // Reset page to 1 on filter application
    params.set("page", "1");
    updateParams(params);
    setIsFiltersOpen(false);
  };

  return (
    <>
      <ProductsHero totalResults={totalResults} loading={loading} />

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
            <FilterContent 
              onApply={applyFilters}
              selectedCategories={pendingCategories}
              selectedConsumptionTypes={pendingConsumptionTypes}
              onFilterChange={handlePendingFilterChange}
            />
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
                <FilterContent 
                  onApply={applyFilters}
                  selectedCategories={pendingCategories}
                  selectedConsumptionTypes={pendingConsumptionTypes}
                  onFilterChange={handlePendingFilterChange}
                />
              </AnimateOnScroll>
            </aside>

            {/* Columna Derecha: Grid de Productos o Empty State */}
            <div className="flex-1 w-full">
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {Array.from({ length: PRODUCTS_PER_PAGE }).map((_, i) => (
                    <ProductCardSkeleton key={`skeleton-${i}`} />
                  ))}
                </div>
              ) : products.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {products.map((product, index) => (
                      <ProductCard key={product.id} product={product} index={index} />
                    ))}
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
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center py-24 px-4 text-center rounded-2xl bg-gray-50/50 border border-gray-100">
                  <div className="w-16 h-16 mb-4 rounded-full bg-primary-light-gray flex items-center justify-center text-primary-orange">
                    <Filter size={32} />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3">
                    No encontramos productos
                  </h3>
                  <p className="text-foreground/70 max-w-sm mb-8">
                    Lo sentimos, no hay resultados que coincidan con los filtros seleccionados. Intenta buscar con otro tipo de producto o consumo.
                  </p>
                  <Button
                    variant="default"
                    onClick={() => {
                      setPendingCategories([]);
                      setPendingConsumptionTypes([]);
                      updateParams(new URLSearchParams());
                    }}
                  >
                    Limpiar todos los filtros
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
