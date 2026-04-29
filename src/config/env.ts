/**
 * @fileoverview env.ts — Capa centralizada de configuración de entorno.
 *
 * ÚNICO PUNTO DE VERDAD para toda la configuración que depende del entorno
 *
 * --- CÓMO TRANSICIONAR A PRODUCCIÓN ---
 * 1. En el panel de hosting (Vercel, Railway, etc.), definir las variables de entorno.
 * 2. Poner `NEXT_PUBLIC_SITE_URL=https://tudominio.com`
 * 3. Poner `NEXT_PUBLIC_API_URL=https://api.tudominio.com`
 * 4. Hacer deploy. Fin. No hay que tocar ningún archivo de código.
 *
 * @see .env.example para ver la plantilla de variables requeridas.
 */

// ─── Site Configuration ──────────────────────────────────────────────────────

/**
 * URL base del sitio. Usada para:
 * - Construir metadataBase en Next.js (SEO / Open Graph).
 * - Generar URLs canónicas absolutas.
 *
 * En local: toma automáticamente http://localhost:3000 si la variable no está seteada.
 * En producción: DEBE definirse como `NEXT_PUBLIC_SITE_URL=https://tudominio.com`
 */
export const SITE_URL: string =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

// ─── API Configuration ───────────────────────────────────────────────────────

/**
 * URL base del backend / API REST.
 *
 * En local: apunta a la ruta interna de Next.js (`/api`).
 * En producción: cambiar a la URL del backend real una vez esté disponible.
 * Ej: `NEXT_PUBLIC_API_URL=https://api.tudominio.com`
 */
export const API_URL: string =
  process.env.NEXT_PUBLIC_API_URL ?? `${SITE_URL}/api`;

/**
 * URL base del almacenamiento de archivos (imágenes, documentos) del CMS.
 * 
 * En local: usa el storage local de Laravel.
 * En producción: usa la URL del bucket o disco del CMS en la nube.
 * Ej: `NEXT_PUBLIC_STORAGE_URL=https://cms.terbolinspira.com/storage`
 */
export const STORAGE_URL: string =
  process.env.NEXT_PUBLIC_STORAGE_URL ?? "http://localhost:8000/storage";

// ─── Aggregated env object (uso conveniente al importar) ─────────────────────

/**
 * Objeto de conveniencia para importar toda la configuración de una vez:
 *
 * @example
 * import { env } from "@/config/env";
 * fetch(`${env.API_URL}/products`);
 */
export const env = {
  SITE_URL,
  API_URL,
  STORAGE_URL,
} as const;
