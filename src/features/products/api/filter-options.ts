/**
 * @fileoverview filter-options.ts — Utilidades de mapeo de opciones de filtro.
 *
 * Funciones puras compartidas entre el lado servidor (`products-api.ts`) y el
 * cliente (`ProductsView.tsx`) para traducir entre nombres e ids de filtros sin
 * duplicar la normalización.
 */

import type { ProductFilterOption } from "./types";

/** Normaliza un texto para comparaciones (sin acentos, minúsculas, espacios). */
export function normalizeLookup(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

/** Resuelve los nombres de las opciones a partir de sus ids. */
export function getOptionNamesById(
  ids: string[],
  options: ProductFilterOption[],
) {
  const namesById = new Map(options.map((option) => [option.id, option.name]));
  return ids
    .map((id) => namesById.get(id))
    .filter((name): name is string => Boolean(name));
}

/** Resuelve los ids de las opciones a partir de sus nombres (normalizados). */
export function getOptionIdsByName(
  names: string[],
  options: ProductFilterOption[],
) {
  const idsByName = new Map(
    options.map((option) => [normalizeLookup(option.name), option.id]),
  );
  return names
    .map((name) => idsByName.get(normalizeLookup(name)))
    .filter((id): id is string => Boolean(id));
}
