/**
 * @fileoverview ProductsView — vista completa de la página "Nuestros Productos".
 *
 * Compone el Hero, los Filtros y el grid paginado de productos.
 * La paginación se sincroniza con la URL (?page=2) para que las
 * URLs sean compartibles y navegables.
 *
 * El cliente consulta `/api/products`; la integracion real se resuelve del
 * lado servidor contra los endpoints fijos de productos del CMS.
 */

"use client";

import * as React from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { AnimatePresence, motion, useIsPresent } from "framer-motion";
import { ProductsHero } from "../components/ProductsHero";
import { ProductCard, ProductCardSkeleton } from "../components/ProductCard";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";
import type { Product } from "../data/products";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { Check, Filter } from "lucide-react";
import { EndBanner } from "@/components/layout/EndBanner";
import { logError } from "@/lib/logger";
import { cn } from "@/lib/utils";
import { apiPath } from "@/lib/base-path";
import { getOptionIdsByName } from "../api/filter-options";
import type {
  ProductFilterOption,
  ProductsFiltersResponse,
  ProductsListResponse,
} from "../api/types";

// ─── Constantes ───
const PRODUCTS_PER_PAGE = 9;
const FILTER_SKELETON_GROUPS = [3, 3, 4] as const;

type ProductFilterType = "productType" | "consumptionType" | "focus";

function uniqueValues(values: string[]) {
  return [...new Set(values.filter(Boolean))];
}

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
        "group flex min-h-9 w-full cursor-pointer items-center gap-2.5 rounded-md px-1 py-0.5 text-foreground/80 transition-colors hover:text-primary-orange lg:min-h-8",
        checked && "font-medium text-primary-orange",
      )}
    >
      <input
        id={id}
        name={name}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="peer sr-only"
      />
      <span
        aria-hidden="true"
        className={cn(
          "flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-primary-orange/40 peer-focus-visible:ring-offset-2",
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

function FilterButtonSkeleton() {
  return (
    <div
      className="w-full lg:hidden mb-6 flex justify-start"
      aria-hidden="true"
    >
      <div className="h-9 w-36 rounded-md bg-primary-soft-gray-light animate-pulse" />
    </div>
  );
}

function FilterContentSkeleton() {
  return (
    <div className="flex flex-col gap-5" aria-hidden="true">
      <div className="hidden h-7 w-24 rounded-md bg-primary-soft-gray-light animate-pulse lg:block" />

      {FILTER_SKELETON_GROUPS.map((itemCount, groupIndex) => (
        <React.Fragment key={`filter-skeleton-group-${groupIndex}`}>
          {groupIndex > 0 && <div className="w-full h-px bg-gray-100" />}
          <fieldset>
            <div className="mb-2.5 h-4 w-36 rounded bg-primary-soft-gray-light animate-pulse" />
            <ul className="space-y-1.5">
              {Array.from({ length: itemCount }).map((_, itemIndex) => (
                <li
                  key={`filter-skeleton-item-${groupIndex}-${itemIndex}`}
                  className="flex min-h-9 w-full items-center gap-2.5 px-1 py-0.5 lg:min-h-8"
                >
                  <span className="h-4 w-4 shrink-0 rounded-sm bg-primary-soft-gray-light animate-pulse" />
                  <span
                    className={cn(
                      "h-4 rounded bg-primary-soft-gray-light animate-pulse",
                      itemIndex % 3 === 0
                        ? "w-40"
                        : itemIndex % 3 === 1
                          ? "w-32"
                          : "w-24",
                    )}
                  />
                </li>
              ))}
            </ul>
          </fieldset>
        </React.Fragment>
      ))}

      <div className="h-10 w-full rounded-md bg-primary-soft-gray-balance animate-pulse" />
    </div>
  );
}

// ─── Filtros (Desktop & Mobile reutilizable) ───
const FilterContent = ({
  idPrefix,
  onApply,
  productTypes,
  consumptionTypes,
  focuses,
  selectedProductTypeIds,
  selectedConsumptionTypeIds,
  selectedFocusIds,
  onFilterChange
}: {
  idPrefix: string;
  onApply: () => void;
  productTypes: ProductFilterOption[];
  consumptionTypes: ProductFilterOption[];
  focuses: ProductFilterOption[];
  selectedProductTypeIds: string[];
  selectedConsumptionTypeIds: string[];
  selectedFocusIds: string[];
  onFilterChange: (type: ProductFilterType, value: string) => void;
}) => {
  const hasFilters = productTypes.length > 0 || consumptionTypes.length > 0 || focuses.length > 0;

  if (!hasFilters) return null;

  return (
    <form
      className="flex flex-col gap-5"
      onSubmit={(event) => {
        event.preventDefault();
        onApply();
      }}
    >
      <h2 className="text-xl font-bold text-foreground hidden lg:block">Filtros</h2>

      {productTypes.length > 0 && (
        <fieldset>
          <legend className="text-body-small font-semibold uppercase tracking-wider text-gray-900 mb-2.5">
            Tipo de producto
          </legend>
          <ul className="space-y-1.5">
            {productTypes.map((type) => {
              const isSelected = selectedProductTypeIds.includes(type.id);
              const id = `${idPrefix}-product-type-${type.id}`;

              return (
                <li key={type.id}>
                  <FilterCheckbox
                    id={id}
                    name={`${idPrefix}-productType`}
                    label={type.name}
                    checked={isSelected}
                    onChange={() => onFilterChange("productType", type.id)}
                  />
                </li>
              );
            })}
          </ul>
        </fieldset>
      )}

      {productTypes.length > 0 && (consumptionTypes.length > 0 || focuses.length > 0) && (
        <div className="w-full h-px bg-gray-100"></div>
      )}

      {consumptionTypes.length > 0 && (
        <fieldset>
          <legend className="text-body-small font-semibold uppercase tracking-wider text-gray-900 mb-2.5">
            Tipo de consumo
          </legend>
          <ul className="space-y-1.5">
            {consumptionTypes.map((type) => {
              const isSelected = selectedConsumptionTypeIds.includes(type.id);
              const id = `${idPrefix}-consumption-type-${type.id}`;

              return (
                <li key={type.id}>
                  <FilterCheckbox
                    id={id}
                    name={`${idPrefix}-consumptionType`}
                    label={type.name}
                    checked={isSelected}
                    onChange={() => onFilterChange("consumptionType", type.id)}
                  />
                </li>
              );
            })}
          </ul>
        </fieldset>
      )}

      {(productTypes.length > 0 || consumptionTypes.length > 0) && focuses.length > 0 && (
        <div className="w-full h-px bg-gray-100"></div>
      )}

      {focuses.length > 0 && (
        <fieldset>
          <legend className="text-body-small font-semibold uppercase tracking-wider text-gray-900 mb-2.5">
            Enfoque
          </legend>
          <ul className="space-y-1.5">
            {focuses.map((focus) => {
              const isSelected = selectedFocusIds.includes(focus.id);
              const id = `${idPrefix}-focus-${focus.id}`;

              return (
                <li key={focus.id}>
                  <FilterCheckbox
                    id={id}
                    name={`${idPrefix}-focus`}
                    label={focus.name}
                    checked={isSelected}
                    onChange={() => onFilterChange("focus", focus.id)}
                  />
                </li>
              );
            })}
          </ul>
        </fieldset>
      )}

      <Button size="sm" variant="secondary" className="w-full" type="submit">Aplicar Filtros</Button>
    </form>
  );
};

// ─── Vista Principal ───
export function ProductsView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  // Detecta si la página está en el DOM activo o en transición de salida.
  // Cuando isPresent es false (fade-out), congelamos las animaciones internas
  // para evitar parpadeos por conflictos entre AnimatePresence anidados.
  const isPresent = useIsPresent();
  const lastRenderRef = React.useRef<React.ReactNode>(null);

  // Leer la página actual desde la URL (?page=X)
  const currentPage = Number(searchParams.get("page")) || 1;
  const appliedProductTypeIds = React.useMemo(
    () => [
      ...searchParams.getAll("productTypeId"),
      ...searchParams.getAll("product_type_ids[]"),
    ],
    [searchParams],
  );
  const appliedFocusIds = React.useMemo(
    () => [
      ...searchParams.getAll("focusId"),
      ...searchParams.getAll("focus_ids[]"),
    ],
    [searchParams],
  );
  const appliedConsumptionTypeIds = React.useMemo(
    () => [
      ...searchParams.getAll("consumptionTypeId"),
      ...searchParams.getAll("consumption_type_ids[]"),
    ],
    [searchParams],
  );
  const legacyCategories = React.useMemo(() => searchParams.getAll("category"), [searchParams]);
  const searchQuery = searchParams.get("search");

  const [products, setProducts] = React.useState<Product[]>([]);
  const [productTypes, setProductTypes] =
    React.useState<ProductFilterOption[]>([]);
  const [consumptionTypes, setConsumptionTypes] =
    React.useState<ProductFilterOption[]>([]);
  const [focuses, setFocuses] = React.useState<ProductFilterOption[]>([]);
  const [totalPages, setTotalPages] = React.useState(1);
  const [totalResults, setTotalResults] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [filtersLoading, setFiltersLoading] = React.useState(true);
  const [fetchError, setFetchError] = React.useState<string | null>(null);
  const [reloadToken, setReloadToken] = React.useState(0);
  const [isFiltersOpen, setIsFiltersOpen] = React.useState(false);

  // Estados locales para los filtros antes de aplicarlos
  const [pendingProductTypeIds, setPendingProductTypeIds] = React.useState<string[]>([]);
  const [pendingConsumptionTypeIds, setPendingConsumptionTypeIds] = React.useState<string[]>([]);
  const [pendingFocusIds, setPendingFocusIds] = React.useState<string[]>([]);
  const hasAvailableFilters = productTypes.length > 0 || consumptionTypes.length > 0 || focuses.length > 0;
  const shouldReserveFiltersLayout = filtersLoading || hasAvailableFilters;
  const productsResultKey = `products-results-${currentPage}-${products
    .map((product) => product.id)
    .join("-")}`;

  React.useEffect(() => {
    const controller = new AbortController();

    fetch(apiPath("/api/products/filters"), { signal: controller.signal })
      .then(async (res) => {
        if (!res.ok) throw new Error("No pudimos cargar los filtros de productos.");
        return (await res.json()) as ProductsFiltersResponse;
      })
      .then((result) => {
        if (result.productTypes.length > 0) setProductTypes(result.productTypes);
        if (result.consumptionTypes.length > 0) setConsumptionTypes(result.consumptionTypes);
        if (result.focuses.length > 0) setFocuses(result.focuses);
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === "AbortError") return;
        logError("product_filters_client_fetch_failed", err, {
          route: "/products",
        });
      })
      .finally(() => {
        if (!controller.signal.aborted) setFiltersLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, []);

  // Sincronizar estado local cuando cambian los params de la URL
  React.useEffect(() => {
    setPendingProductTypeIds(
      uniqueValues([
        ...appliedProductTypeIds,
        ...getOptionIdsByName(legacyCategories, productTypes),
      ]),
    );
    setPendingConsumptionTypeIds(uniqueValues(appliedConsumptionTypeIds));
    setPendingFocusIds(uniqueValues(appliedFocusIds));
  }, [
    appliedConsumptionTypeIds,
    appliedFocusIds,
    appliedProductTypeIds,
    legacyCategories,
    productTypes,
  ]);

  // ─── Fetch de productos ───
  // Se dispara cada vez que cambia 'currentPage' o los parámetros de la URL
  React.useEffect(() => {
    // No iniciar fetches si la página está saliendo (transición de salida)
    if (!isPresent) return;

    const controller = new AbortController();
    setLoading(true);
    setFetchError(null);

    const params = new URLSearchParams();
    params.set("page", currentPage.toString());
    params.set("limit", PRODUCTS_PER_PAGE.toString());
    appliedProductTypeIds.forEach((id) => params.append("productTypeId", id));
    appliedConsumptionTypeIds.forEach((id) => params.append("consumptionTypeId", id));
    appliedFocusIds.forEach((id) => params.append("focusId", id));
    legacyCategories.forEach((cat) => params.append("category", cat));
    if (searchQuery) params.set("search", searchQuery);

    fetch(apiPath(`/api/products?${params.toString()}`), {
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
          productTypeIdCount: appliedProductTypeIds.length,
          focusIdCount: appliedFocusIds.length,
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
    appliedConsumptionTypeIds,
    appliedFocusIds,
    appliedProductTypeIds,
    currentPage,
    isPresent,
    legacyCategories,
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
    if (type === "productType") {
      setPendingProductTypeIds((prev) =>
        prev.includes(value) ? prev.filter((id) => id !== value) : [...prev, value]
      );
    } else if (type === "consumptionType") {
      setPendingConsumptionTypeIds((prev) =>
        prev.includes(value) ? prev.filter((id) => id !== value) : [...prev, value]
      );
    } else {
      setPendingFocusIds((prev) =>
        prev.includes(value) ? prev.filter((id) => id !== value) : [...prev, value]
      );
    }
  };

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());

    // Clear old filters and set new ones
    params.delete("productTypeId");
    params.delete("product_type_ids[]");
    pendingProductTypeIds.forEach((id) => params.append("productTypeId", id));

    params.delete("consumptionTypeId");
    params.delete("consumptionTypeIds");
    params.delete("consumption_type_id");
    params.delete("consumption_type_ids[]");
    pendingConsumptionTypeIds.forEach((id) => params.append("consumptionTypeId", id));

    params.delete("focusId");
    params.delete("focus_ids[]");
    pendingFocusIds.forEach((id) => params.append("focusId", id));

    // Clear legacy filters so URLs migrate to the canonical ID params.
    params.delete("category");
    params.delete("consumptionType");

    // Reset page to 1 on filter application
    params.set("page", "1");
    updateParams(params);
    setIsFiltersOpen(false);
  };

  const retryProductsFetch = () => {
    setReloadToken((value) => value + 1);
  };

  const currentRender = (
    <>
      <ProductsHero totalResults={totalResults} loading={loading} />

      {/* Sección del catálogo de productos */}
      <section className="w-full pb-20">
        <div className="wrapper-content">

          {/* Drawer Mobile de Filtros */}
          {hasAvailableFilters && (
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
                productTypes={productTypes}
                consumptionTypes={consumptionTypes}
                focuses={focuses}
                selectedProductTypeIds={pendingProductTypeIds}
                selectedConsumptionTypeIds={pendingConsumptionTypeIds}
                selectedFocusIds={pendingFocusIds}
                onFilterChange={handlePendingFilterChange}
              />
            </Drawer>
          )}

          {/* Botón Mostrar Filtros (Mobile) */}
          {filtersLoading ? (
            <FilterButtonSkeleton />
          ) : hasAvailableFilters ? (
            <div className="w-full lg:hidden mb-6 flex justify-start">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsFiltersOpen(true)}
                aria-haspopup="dialog"
                aria-expanded={isFiltersOpen}
                className="px-0"
                icon={<Filter size={18} aria-hidden="true" />}
                iconPosition="right"
              >
                Mostrar Filtros
              </Button>
            </div>
          ) : null}

          {/* Layout Principal: Filtros + Grid de Productos */}
          <div className="flex flex-col lg:flex-row gap-x-8 gap-y-8 items-start">

            {/* Columna Izquierda: Filtros de Búsqueda (Desktop) */}
            {shouldReserveFiltersLayout && (
              <aside className="hidden lg:block w-[300px] sticky top-32 pb-[78px] shrink-0">
                <AnimatePresence initial={false}>
                  {filtersLoading && isPresent ? (
                    <motion.div
                      key="filters-loading"
                      initial={{ opacity: 0.92 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.18 }}
                    >
                      <FilterContentSkeleton />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="filters-ready"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                    >
                      <AnimateOnScroll variant="slide-up">
                        <FilterContent
                          idPrefix="desktop-products"
                          onApply={applyFilters}
                          productTypes={productTypes}
                          consumptionTypes={consumptionTypes}
                          focuses={focuses}
                          selectedProductTypeIds={pendingProductTypeIds}
                          selectedConsumptionTypeIds={pendingConsumptionTypeIds}
                          selectedFocusIds={pendingFocusIds}
                          onFilterChange={handlePendingFilterChange}
                        />
                      </AnimateOnScroll>
                    </motion.div>
                  )}
                </AnimatePresence>
              </aside>
            )}

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

              <AnimatePresence initial={false}>
                {loading && isPresent ? (
                  <motion.div
                    key="products-loading"
                    initial={{ opacity: 0.92 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
                  >
                    {Array.from({ length: PRODUCTS_PER_PAGE }).map((_, i) => (
                      <ProductCardSkeleton key={`skeleton-${i}`} />
                    ))}
                  </motion.div>
                ) : products.length > 0 ? (
                  <motion.div
                    key={productsResultKey}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                      {products.map((product, index) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          index={index}
                        />
                      ))}
                    </div>

                    {/* Paginación */}
                    {totalPages > 1 && (
                      <div className="mt-10 grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:flex sm:justify-between sm:gap-4">
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
                          className="justify-self-end"
                        >
                          Siguiente
                        </Button>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="products-empty"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
                    className="w-full h-full flex flex-col items-center justify-center py-24 px-4 text-center rounded-2xl bg-primary-soft-gray-light border border-primary-soft-gray-balance"
                  >
                    <div className="w-16 h-16 mb-4 rounded-full flex items-center justify-center text-primary-orange">
                      <Filter size={48} strokeWidth={1.2} aria-hidden="true" />
                    </div>
                    <h3 className="heading-h4 font-bold text-gray-900 mb-4">
                      No encontramos productos
                    </h3>
                    <p className="text-body-medium text-gray-500 max-w-xl mb-8">
                      Lo sentimos, no hay resultados que coincidan con los filtros seleccionados. Intenta buscar con otro tipo de producto o enfoque.
                    </p>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        setPendingProductTypeIds([]);
                        setPendingConsumptionTypeIds([]);
                        setPendingFocusIds([]);
                        updateParams(new URLSearchParams());
                      }}
                    >
                      Limpiar todos los filtros
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>
      <EndBanner />
    </>
  );

  if (isPresent) {
    // eslint-disable-next-line react-hooks/refs
    lastRenderRef.current = currentRender;
  }

  // eslint-disable-next-line react-hooks/refs
  return lastRenderRef.current || currentRender;
}
