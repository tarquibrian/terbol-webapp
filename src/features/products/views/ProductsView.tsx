/**
 * @fileoverview ProductsView — vista completa de la página "Nuestros Productos".
 *
 * Compone el Hero, los Filtros y el grid paginado de productos.
 * La paginación se sincroniza con la URL (?page=2) para que las
 * URLs sean compartibles y navegables.
 *
 * El cliente consulta `/api/products`; la integracion con el API real se
 * configura del lado servidor con `PRODUCTS_API_URL`.
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
import { Check, Filter } from "lucide-react";
import { EndBanner } from "@/components/layout/EndBanner";
import { logError } from "@/lib/logger";
import { cn } from "@/lib/utils";
import type { ProductsListResponse } from "../api/types";

// ─── Constantes ───
const PRODUCTS_PER_PAGE = 9;
const PRODUCT_TYPE_FILTERS = ["Medicamentos", "Suplementos", "Vitaminas"];

type ProductFilterType = "category" | "consumptionType";

interface FilterCheckboxProps {
  id: string;
  name: string;
  label: string;
  checked: boolean;
  onChange: () => void;
}

function FilterCheckbox({
  id,
  name,
  label,
  checked,
  onChange,
}: FilterCheckboxProps) {
  return (
    <label
      htmlFor={id}
      className={cn(
        "group flex min-h-10 w-full cursor-pointer items-center gap-3 rounded-md px-1 py-1 text-foreground/80 transition-colors hover:text-primary-orange focus-within:text-primary-orange focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
        checked && "font-medium text-primary-orange",
      )}
    >
      <input
        id={id}
        name={name}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      <span
        aria-hidden="true"
        className={cn(
          "flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border transition-colors",
          checked
            ? "border-primary-orange bg-primary-orange text-white"
            : "border-primary-light-gray bg-transparent",
        )}
      >
        {checked ? <Check className="h-3 w-3" strokeWidth={3} /> : null}
      </span>
      <span className="min-w-0 break-words text-body-small">{label}</span>
    </label>
  );
}

// ─── Filtros (Desktop & Mobile reutilizable) ───
const FilterContent = ({
  idPrefix,
  onApply,
  selectedCategories,
  selectedConsumptionTypes,
  onFilterChange
}: {
  idPrefix: string;
  onApply: () => void;
  selectedCategories: string[];
  selectedConsumptionTypes: string[];
  onFilterChange: (type: ProductFilterType, value: string) => void;
}) => (
  <form
    className="flex flex-col gap-8"
    onSubmit={(event) => {
      event.preventDefault();
      onApply();
    }}
  >
    <h2 className="text-xl font-bold text-foreground hidden lg:block">Filtros</h2>

    {/* Categorías (Multi-select) */}
    <fieldset>
      <legend className="text-body-small font-semibold uppercase tracking-wider text-gray-900 mb-4">
        Tipo de producto
      </legend>
      <ul className="space-y-3">
        {PRODUCT_TYPE_FILTERS.map((cat) => {
          const isSelected = selectedCategories.includes(cat);
          const id = `${idPrefix}-category-${cat.toLowerCase()}`;

          return (
            <li key={cat}>
              <FilterCheckbox
                id={id}
                name={`${idPrefix}-category`}
                label={cat}
                checked={isSelected}
                onChange={() => onFilterChange("category", cat)}
              />
            </li>
          );
        })}
      </ul>
    </fieldset>

    <div className="w-full h-px bg-gray-100"></div>

    {/* Laboratorio (Multi-select) */}
    <fieldset>
      <legend className="text-body-small font-semibold uppercase tracking-wider text-gray-900 mb-4">
        Tipo de consumo
      </legend>
      <ul className="space-y-3">
        {CONSUMPTION_CATEGORIES.map((categoryObj) => {
          const lab = categoryObj.name;
          const isSelected = selectedConsumptionTypes.includes(lab);
          const id = `${idPrefix}-consumption-${categoryObj.id}`;

          return (
            <li key={categoryObj.id}>
              <FilterCheckbox
                id={id}
                name={`${idPrefix}-consumptionType`}
                label={lab}
                checked={isSelected}
                onChange={() => onFilterChange("consumptionType", lab)}
              />
            </li>
          );
        })}
      </ul>
    </fieldset>

    {/* Botón Aplicar */}
    <Button size="sm" variant="secondary" className="w-full" type="submit">Aplicar Filtros</Button>
  </form>
);

// ─── Vista Principal ───
export function ProductsView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Leer la página actual desde la URL (?page=X)
  const currentPage = Number(searchParams.get("page")) || 1;
  const appliedCategories = React.useMemo(
    () => searchParams.getAll("category"),
    [searchParams],
  );
  const appliedConsumptionTypes = React.useMemo(
    () => searchParams.getAll("consumptionType"),
    [searchParams],
  );
  const searchQuery = searchParams.get("search");

  const [products, setProducts] = React.useState<Product[]>([]);
  const [totalPages, setTotalPages] = React.useState(1);
  const [totalResults, setTotalResults] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [fetchError, setFetchError] = React.useState<string | null>(null);
  const [reloadToken, setReloadToken] = React.useState(0);
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
    const controller = new AbortController();
    setLoading(true);
    setFetchError(null);

    const params = new URLSearchParams();
    params.set("page", currentPage.toString());
    params.set("limit", PRODUCTS_PER_PAGE.toString());
    appliedCategories.forEach((cat) => params.append("category", cat));
    appliedConsumptionTypes.forEach((type) => params.append("consumptionType", type));
    if (searchQuery) params.set("search", searchQuery);

    fetch(`/api/products?${params.toString()}`, {
      signal: controller.signal,
    })
      .then(async (res) => {
        const result = (await res.json()) as ProductsListResponse;

        if (!res.ok) {
          throw new Error(
            result.error?.message ?? "No pudimos cargar los productos.",
          );
        }

        return result;
      })
      .then((result) => {
        setProducts(result.data);
        setTotalPages(result.meta.totalPages);
        setTotalResults(result.meta.total);
        setFetchError(result.error?.message ?? null);
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === "AbortError") return;

        logError("products_client_fetch_failed", err, {
          route: "/products",
          page: currentPage,
          categoryCount: appliedCategories.length,
          consumptionTypeCount: appliedConsumptionTypes.length,
          hasSearch: Boolean(searchQuery),
        });
        setProducts([]);
        setTotalPages(1);
        setTotalResults(0);
        setFetchError("No pudimos cargar los productos. Intenta nuevamente.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, [
    appliedCategories,
    appliedConsumptionTypes,
    currentPage,
    reloadToken,
    searchQuery,
  ]);

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

  const handlePendingFilterChange = (type: ProductFilterType, value: string) => {
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

  const retryProductsFetch = () => {
    setReloadToken((value) => value + 1);
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
              idPrefix="mobile-products"
              onApply={applyFilters}
              selectedCategories={pendingCategories}
              selectedConsumptionTypes={pendingConsumptionTypes}
              onFilterChange={handlePendingFilterChange}
            />
          </Drawer>

          {/* Botón Mostrar Filtros (Mobile) */}
          <div className="w-full lg:hidden mb-6 flex justify-start">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFiltersOpen(true)}
              aria-haspopup="dialog"
              aria-expanded={isFiltersOpen}
              className="flex items-center gap-2 px-0"
            >
              <Filter size={18} aria-hidden="true" />
              Mostrar Filtros
            </Button>
          </div>

          {/* Layout Principal: Filtros + Grid de Productos */}
          <div className="flex flex-col lg:flex-row gap-x-8 gap-y-8 items-start">

            {/* Columna Izquierda: Filtros de Búsqueda (Desktop) */}
            <aside className="hidden lg:block w-[300px] sticky top-32 pb-[78px] shrink-0">
              <AnimateOnScroll variant="slide-up">
                <FilterContent
                  idPrefix="desktop-products"
                  onApply={applyFilters}
                  selectedCategories={pendingCategories}
                  selectedConsumptionTypes={pendingConsumptionTypes}
                  onFilterChange={handlePendingFilterChange}
                />
              </AnimateOnScroll>
            </aside>

            {/* Columna Derecha: Grid de Productos o Empty State */}
            <div className="flex-1 w-full" aria-busy={loading}>
              {fetchError && !loading ? (
                <div className="mb-4 flex flex-col gap-3 rounded-md border border-primary-soft-gray-balance bg-primary-soft-gray-light px-4 py-3 text-body-small text-gray-700 sm:flex-row sm:items-center sm:justify-between">
                  <span>{fetchError}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={retryProductsFetch}
                    className="w-full sm:w-fit"
                  >
                    Reintentar
                  </Button>
                </div>
              ) : null}

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
                <div className="w-full h-full flex flex-col items-center justify-center py-24 px-4 text-center rounded-2xl bg-primary-soft-gray-light border border-primary-soft-gray-balance">
                  <div className="w-16 h-16 mb-4 rounded-full flex items-center justify-center text-primary-orange">
                    <Filter size={48} strokeWidth={1.2} aria-hidden="true" />
                  </div>
                  <h3 className="heading-h4 font-bold text-gray-900 mb-4">
                    No encontramos productos
                  </h3>
                  <p className="text-body-medium text-gray-500 max-w-xl mb-8">
                    Lo sentimos, no hay resultados que coincidan con los filtros seleccionados. Intenta buscar con otro tipo de producto o consumo.
                  </p>
                  <Button
                    variant="secondary"
                    size="sm"
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
