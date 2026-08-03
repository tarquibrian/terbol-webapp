/**
 * @fileoverview ProductSearchBox — buscador con sugerencias en vivo.
 *
 * Envuelve el `SearchInput` genérico y le agrega un dropdown que lista
 * productos mientras se escribe (patrón combobox de WAI-ARIA). Elegir una
 * sugerencia lleva al detalle del producto; la última fila lanza la búsqueda
 * completa en /products.
 *
 * La navegación se delega vía `onNavigate` porque cada consumidor la resuelve
 * distinto: el navbar hace push directo y el menú mobile cierra el drawer antes
 * de navegar.
 */

"use client";

import * as React from "react";
import Image from "next/image";
import { ArrowRight, Search } from "lucide-react";
import { SearchInput } from "@/components/ui/SearchInput";
import { cn } from "@/lib/utils";
import { formatProductPrice } from "../../format";
import type { Product } from "../../data/products";
import {
  MIN_SUGGESTIONS_QUERY_LENGTH,
  useProductSuggestions,
} from "./useProductSuggestions";

interface ProductSearchBoxProps {
  /** Clases del contenedor: ancho y visibilidad responsive del buscador. */
  className?: string;
  placeholder?: string;
  /** Texto inicial del input (ej. el `?search=` vigente en /products). */
  defaultValue?: string;
  /** Navega a una ruta interna de la app. */
  onNavigate: (href: string) => void;
  /**
   * Construye el destino de la búsqueda completa. Por defecto va al catálogo
   * con el término aplicado; /products lo sobrescribe para conservar los
   * filtros activos de la URL.
   */
  buildSearchHref?: (query: string) => string;
}

/**
 * Opción navegable del dropdown; el índice activo se mueve sobre esta lista.
 *
 * El destino se resuelve recién al elegir, no al construir la lista: así
 * `options` no depende de `buildSearchHref`, que llega como prop inline y
 * cambiaría de identidad en cada render, reseteando la opción resaltada.
 */
type SuggestionOption =
  | { kind: "product"; key: string; product: Product }
  | { kind: "all"; key: string };

function defaultSearchHref(query: string) {
  const normalizedQuery = query.trim();
  return normalizedQuery
    ? `/products?search=${encodeURIComponent(normalizedQuery)}`
    : "/products";
}

/**
 * Resalta en el nombre el tramo que coincide con lo tecleado.
 *
 * Usa coincidencia de subcadena sin distinguir mayúsculas, que es exactamente
 * lo que hace hoy el filtro `name` del CMS, así que lo resaltado siempre
 * explica por qué apareció ese resultado.
 */
function HighlightedName({ name, query }: { name: string; query: string }) {
  const matchIndex = query
    ? name.toLowerCase().indexOf(query.toLowerCase())
    : -1;

  if (matchIndex === -1) return <>{name}</>;

  return (
    <>
      {name.slice(0, matchIndex)}
      <mark className="bg-transparent text-primary-orange font-semibold">
        {name.slice(matchIndex, matchIndex + query.length)}
      </mark>
      {name.slice(matchIndex + query.length)}
    </>
  );
}

export function ProductSearchBox({
  className,
  placeholder = "Buscar productos…",
  defaultValue,
  onNavigate,
  buildSearchHref = defaultSearchHref,
}: ProductSearchBoxProps) {
  const [query, setQuery] = React.useState(defaultValue ?? "");
  const [isOpen, setIsOpen] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(-1);

  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const listRef = React.useRef<HTMLUListElement | null>(null);
  const baseId = React.useId();
  const listboxId = `${baseId}-listbox`;
  const optionId = (index: number) => `${baseId}-option-${index}`;

  const { suggestions, loading, idle } = useProductSuggestions(query);
  const normalizedQuery = query.trim();

  const options = React.useMemo<SuggestionOption[]>(() => {
    if (idle) return [];

    const productOptions: SuggestionOption[] = suggestions.map((product) => ({
      kind: "product",
      key: `product-${product.id}`,
      product,
    }));

    // La fila "ver todos" solo aporta si hay algo que ver.
    if (suggestions.length === 0) return productOptions;

    return [...productOptions, { kind: "all", key: "all-results" }];
  }, [idle, suggestions]);

  // Un término nuevo o una tanda nueva de resultados invalidan lo resaltado.
  React.useEffect(() => {
    setActiveIndex(-1);
  }, [options, normalizedQuery]);

  // Cierra al hacer click fuera. Se escucha `pointerdown` (no `blur`) para que
  // el click sobre una sugerencia alcance a ejecutarse antes del cierre.
  React.useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isOpen]);

  // Mantiene visible la opción activa cuando la lista scrollea.
  React.useEffect(() => {
    if (activeIndex < 0) return;
    listRef.current?.children[activeIndex]?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  const isExpanded = isOpen && !idle;

  const selectOption = (option: SuggestionOption) => {
    setIsOpen(false);
    setActiveIndex(-1);
    onNavigate(
      option.kind === "product"
        ? `/products/${option.product.id}`
        : buildSearchHref(query),
    );
  };

  const handleValueChange = (value: string) => {
    setQuery(value);
    setIsOpen(value.trim().length >= MIN_SUGGESTIONS_QUERY_LENGTH);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      setIsOpen(false);
      setActiveIndex(-1);
      return;
    }

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      if (options.length === 0) return;

      // Evita que el cursor salte al inicio/fin del texto del input.
      event.preventDefault();
      setIsOpen(true);

      const offset = event.key === "ArrowDown" ? 1 : -1;
      setActiveIndex((current) => {
        const next = current + offset;
        if (next < 0) return options.length - 1;
        if (next >= options.length) return 0;
        return next;
      });
      return;
    }

    if (event.key === "Enter" && activeIndex >= 0) {
      const option = options[activeIndex];
      if (!option) return;

      // Cancela el submit por defecto del SearchInput: gana la opción activa.
      event.preventDefault();
      selectOption(option);
    }
  };

  const handleSearchSubmit = (value: string) => {
    setIsOpen(false);
    setActiveIndex(-1);
    onNavigate(buildSearchHref(value));
  };

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <SearchInput
        className="w-full"
        placeholder={placeholder}
        defaultValue={defaultValue}
        onValueChange={handleValueChange}
        onSearch={handleSearchSubmit}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          if (normalizedQuery.length >= MIN_SUGGESTIONS_QUERY_LENGTH) {
            setIsOpen(true);
          }
        }}
        role="combobox"
        aria-expanded={isExpanded}
        // Solo se referencia el listbox cuando existe en el DOM.
        aria-controls={isExpanded ? listboxId : undefined}
        aria-activedescendant={
          activeIndex >= 0 ? optionId(activeIndex) : undefined
        }
        aria-autocomplete="list"
      />

      {isExpanded && (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-md border border-primary-soft-gray-balance bg-white shadow-lg">
          <div role="status" aria-live="polite">
            {loading && suggestions.length === 0 && (
              <p className="px-4 py-3 text-body-sm text-gray-500">Buscando…</p>
            )}
            {!loading && suggestions.length === 0 && (
              <p className="px-4 py-3 text-body-sm text-gray-500">
                Sin resultados para “{normalizedQuery}”
              </p>
            )}
          </div>

          <ul
            ref={listRef}
            id={listboxId}
            role="listbox"
            aria-label="Sugerencias de productos"
            className="max-h-[320px] overflow-y-auto"
          >
            {options.map((option, index) => {
              const isActive = index === activeIndex;

              return (
                <li
                  key={option.key}
                  id={optionId(index)}
                  role="option"
                  aria-selected={isActive}
                  // Mantiene el foco en el input al clickear una sugerencia.
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => selectOption(option)}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={cn(
                    "cursor-pointer px-4 transition-colors",
                    isActive && "bg-primary-soft-gray-light",
                  )}
                >
                  {option.kind === "product" ? (
                    <div className="flex items-center gap-3 py-2.5">
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-primary-soft-gray-light">
                        {option.product.cardImage && (
                          <Image
                            src={option.product.cardImage}
                            alt=""
                            width={48}
                            height={48}
                            className="h-full w-full object-cover"
                          />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-body-sm text-foreground">
                          <HighlightedName
                            name={option.product.name}
                            query={normalizedQuery}
                          />
                        </p>
                        <p className="text-body-small text-gray-500">
                          {formatProductPrice(option.product.price)}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 border-t border-primary-soft-gray-balance py-3 text-body-sm font-medium text-gray-900">
                      <Search size={16} strokeWidth={1.75} aria-hidden="true" />
                      <span className="min-w-0 flex-1 truncate">
                        Ver todos los resultados de “{normalizedQuery}”
                      </span>
                      <ArrowRight size={16} aria-hidden="true" />
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
