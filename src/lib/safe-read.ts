/**
 * @fileoverview safe-read.ts — Lectores seguros para payloads `unknown`.
 *
 * Helpers compartidos para extraer datos de respuestas no tipadas del CMS sin
 * romper ante formas inesperadas. Centraliza la lógica que antes se duplicaba en
 * `features/products/api/products-api.ts` y `features/home/data/cmsHome.ts`.
 */

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function readRecord(
  record: Record<string, unknown>,
  key: string,
): Record<string, unknown> | undefined {
  const value = record[key];
  return isRecord(value) ? value : undefined;
}

/** Coacciona un valor suelto a string no vacío (number → string), o null. */
export function coerceString(value: unknown): string | null {
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  if (typeof value !== "string") return null;

  const text = value.trim();
  return text.length > 0 ? text : null;
}

/** Primer valor de `keys` que resuelva a string no vacío (number → string). */
export function readString(
  record: Record<string, unknown>,
  keys: string[],
): string | undefined {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) return value.trim();
    if (typeof value === "number" && Number.isFinite(value)) return String(value);
  }

  return undefined;
}

export function readBoolean(
  record: Record<string, unknown>,
  keys: string[],
): boolean | undefined {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "boolean") return value;
    if (typeof value === "number") {
      if (value === 1) return true;
      if (value === 0) return false;
    }
    if (typeof value === "string") {
      const normalizedValue = value.trim().toLowerCase();
      if (["true", "1", "s", "si", "yes"].includes(normalizedValue)) return true;
      if (["false", "0", "n", "no"].includes(normalizedValue)) return false;
    }
  }

  return undefined;
}

export function readNumber(
  record: Record<string, unknown> | undefined,
  keys: string[],
): number | undefined {
  if (!record) return undefined;

  for (const key of keys) {
    const value = record[key];
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string") {
      const normalized = value.replace(",", ".").replace(/[^\d.-]/g, "");
      const parsed = Number(normalized);
      if (Number.isFinite(parsed)) return parsed;
    }
  }

  return undefined;
}

export function readNestedNumber(
  record: Record<string, unknown>,
  key: string,
  nestedKeys: string[],
): number | undefined {
  const nestedRecord = readRecord(record, key);
  return nestedRecord ? readNumber(nestedRecord, nestedKeys) : undefined;
}

export function readStringArray(
  record: Record<string, unknown>,
  keys: string[],
): string[] | undefined {
  for (const key of keys) {
    const value = record[key];
    if (Array.isArray(value)) {
      const items = value.filter(
        (item): item is string => typeof item === "string" && item.trim() !== "",
      );
      if (items.length > 0) return items;
    }
  }

  return undefined;
}

export function readRecordArray(
  record: Record<string, unknown>,
  keys: string[],
): Record<string, unknown>[] | undefined {
  for (const key of keys) {
    const value = record[key];
    if (Array.isArray(value)) {
      const items = value.filter(isRecord);
      if (items.length > 0) return items;
    }
  }

  return undefined;
}

export function readNestedString(
  record: Record<string, unknown>,
  key: string,
  nestedKeys: string[],
) {
  const nestedRecord = readRecord(record, key);
  return nestedRecord ? readString(nestedRecord, nestedKeys) : undefined;
}
