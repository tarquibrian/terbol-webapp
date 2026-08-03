/**
 * @fileoverview useProductSuggestions — datos del dropdown de sugerencias.
 *
 * Consulta `/api/products?search=…` mientras el usuario escribe. Hoy el CMS
 * solo filtra por nombre (manda el término como `name=`), así que las
 * sugerencias coinciden por nombre y no por descripción. Si el CMS habilita más
 * campos, este hook no cambia: el término ya viaja por el mismo parámetro.
 */

"use client";

import * as React from "react";
import { apiPath } from "@/lib/base-path";
import { logError } from "@/lib/logger";
import type { Product } from "../../data/products";
import type { ProductsListResponse } from "../../api/types";

/**
 * Caracteres mínimos antes de consultar al API.
 *
 * En 1 a pedido del equipo: el dropdown sugiere desde la primera letra. Tener
 * en cuenta que el CMS filtra por subcadena (`LIKE %texto%`), así que con una
 * sola letra los resultados son poco selectivos — una vocal llega a coincidir
 * con casi todo el catálogo. Quien acote el ruido es el `MAX_SUGGESTIONS`.
 */
export const MIN_SUGGESTIONS_QUERY_LENGTH = 1;
/** Espera tras la última tecla antes de disparar el fetch (ms). */
const DEBOUNCE_MS = 250;
/** Máximo de productos listados en el dropdown. */
const MAX_SUGGESTIONS = 6;

interface ProductSuggestionsState {
  suggestions: Product[];
  loading: boolean;
  /** true mientras el término sea demasiado corto para consultar. */
  idle: boolean;
}

/**
 * Devuelve las sugerencias para un término, con debounce y cancelación.
 *
 * Cada cambio de término aborta la petición anterior, así que una respuesta
 * lenta de un término viejo nunca pisa a la del término actual.
 */
export function useProductSuggestions(query: string): ProductSuggestionsState {
  const normalizedQuery = query.trim();
  const isQueryLongEnough =
    normalizedQuery.length >= MIN_SUGGESTIONS_QUERY_LENGTH;

  const [suggestions, setSuggestions] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (!isQueryLongEnough) {
      setSuggestions([]);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    // Se marca cargando ya en la primera tecla, antes del debounce, para que el
    // dropdown abra con feedback en vez de quedarse vacío 250ms.
    setLoading(true);

    const timeoutId = setTimeout(() => {
      const params = new URLSearchParams({
        search: normalizedQuery,
        limit: String(MAX_SUGGESTIONS),
      });

      fetch(apiPath(`/api/products?${params.toString()}`), {
        signal: controller.signal,
      })
        .then(async (res) => {
          const result = (await res.json()) as ProductsListResponse;

          if (!res.ok) {
            throw new Error(
              result.error?.message ?? "No pudimos cargar las sugerencias.",
            );
          }

          return result;
        })
        .then((result) => {
          setSuggestions(result.data.slice(0, MAX_SUGGESTIONS));
        })
        .catch((err: unknown) => {
          if (err instanceof DOMException && err.name === "AbortError") return;

          logError("product_suggestions_fetch_failed", err, {
            queryLength: normalizedQuery.length,
          });
          // Sin sugerencias el dropdown cae al estado "sin resultados"; el
          // usuario siempre puede lanzar la búsqueda completa con Enter.
          setSuggestions([]);
        })
        .finally(() => {
          if (!controller.signal.aborted) setLoading(false);
        });
    }, DEBOUNCE_MS);

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [isQueryLongEnough, normalizedQuery]);

  return { suggestions, loading, idle: !isQueryLongEnough };
}
