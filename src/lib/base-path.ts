/**
 * Prefijo de ruta (basePath) del despliegue.
 *
 * Next aplica `basePath` automáticamente a `<Link>`, `next/image` y los assets,
 * PERO no a los `fetch()` manuales hacia las route handlers propias. Por eso las
 * llamadas del cliente a `/api/*` deben construirse con `apiPath()` para que
 * funcionen también bajo un subpath (ej. `/qas`).
 *
 * Vacío en root/Vercel; en el QA self-host se define `NEXT_PUBLIC_BASE_PATH=/qas`.
 */
export const BASE_PATH =
  process.env.NEXT_PUBLIC_BASE_PATH?.trim().replace(/\/$/, "") ?? "";

/** Antepone el basePath a una ruta absoluta de la app (ej. una route handler). */
export function apiPath(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${BASE_PATH}${normalized}`;
}
