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

const IS_PRODUCTION = process.env.NODE_ENV === "production";

/**
 * Lee una URL pública obligatoria.
 *
 * - En producción: si falta o no es una URL absoluta válida, lanza un error
 *   (fail-fast) para evitar arrancar con un fallback silencioso a `localhost`
 *   que rompería el consumo del CMS sin dar señales.
 * - En local: usa `devFallback` para no fricción durante el desarrollo.
 */
function requirePublicUrl(
  name: string,
  rawValue: string | undefined,
  devFallback: string,
): string {
  const value = rawValue?.trim();

  if (!value) {
    if (IS_PRODUCTION) {
      throw new Error(
        `[env] Falta la variable obligatoria ${name}. Definila en el entorno del servidor de producción.`,
      );
    }
    return devFallback;
  }

  try {
    // Valida que sea una URL absoluta bien formada.
    new URL(value);
  } catch {
    if (IS_PRODUCTION) {
      throw new Error(`[env] ${name} no es una URL absoluta válida: "${value}".`);
    }
    return devFallback;
  }

  return value;
}

/** Lee una variable server-only opcional (string vacío si no está definida). */
function readOptional(rawValue: string | undefined): string {
  return rawValue?.trim() ?? "";
}

/** Lee un entero positivo o usa el fallback indicado. */
function readPositiveInteger(
  rawValue: string | undefined,
  fallback: number,
): number {
  const value = Number(rawValue);
  return Number.isSafeInteger(value) && value > 0 ? value : fallback;
}

// ─── Site Configuration ──────────────────────────────────────────────────────

/**
 * URL base del sitio. Usada para:
 * - Construir metadataBase en Next.js (SEO / Open Graph).
 * - Generar URLs canónicas absolutas.
 *
 * En local: toma automáticamente http://localhost:3000 si la variable no está seteada.
 * En producción: DEBE definirse como `NEXT_PUBLIC_SITE_URL=https://tudominio.com`
 */
export const SITE_URL: string = requirePublicUrl(
  "NEXT_PUBLIC_SITE_URL",
  process.env.NEXT_PUBLIC_SITE_URL,
  "http://localhost:3000",
);

// ─── API Configuration ───────────────────────────────────────────────────────

/**
 * URL base del backend / API REST.
 *
 * En local: apunta a la ruta interna de Next.js (`/api`).
 * En producción: cambiar a la URL del backend real una vez esté disponible.
 * Ej: `NEXT_PUBLIC_API_URL=https://api.tudominio.com`
 */
export const API_URL: string = requirePublicUrl(
  "NEXT_PUBLIC_API_URL",
  process.env.NEXT_PUBLIC_API_URL,
  `${SITE_URL}/api`,
);

/**
 * Token opcional para el API de productos. Solo se usa desde Route Handlers.
 */
export const PRODUCTS_API_TOKEN: string =
  process.env.PRODUCTS_API_TOKEN?.trim() ?? "";

/**
 * API key opcional para integraciones que usan un header dedicado, por ejemplo
 * el catalogo VPC que espera `ApiKey`.
 */
export const PRODUCTS_API_KEY: string =
  process.env.PRODUCTS_API_KEY?.trim() ?? "";

export const PRODUCTS_API_KEY_HEADER: string =
  process.env.PRODUCTS_API_KEY_HEADER?.trim() || "ApiKey";

/**
 * URL base del almacenamiento de archivos (imágenes, documentos) del CMS.
 * 
 * En local: usa el storage local de Laravel.
 * En producción: usa la URL del bucket o disco del CMS en la nube.
 * Ej: `NEXT_PUBLIC_STORAGE_URL=https://cms.terbolinspira.com/storage`
 */
export const STORAGE_URL: string = requirePublicUrl(
  "NEXT_PUBLIC_STORAGE_URL",
  process.env.NEXT_PUBLIC_STORAGE_URL,
  "http://localhost:8000/storage",
);

/**
 * URL base de la app externa de "Venta por Catálogo" (registro/login de
 * asesores), que tiene entornos separados (PRD/QAS).
 *
 * Por defecto apunta a producción (PRD). En el ambiente de QA se define
 * `NEXT_PUBLIC_ASESOR_URL=https://www.terbolinspira.com/VentaPorCatalogo/QAS`
 * para que los CTAs de asesores apunten al entorno de pruebas.
 */
export const ASESOR_URL: string =
  process.env.NEXT_PUBLIC_ASESOR_URL?.trim().replace(/\/$/, "") ||
  "https://www.terbolinspira.com/VentaPorCatalogo/PRD";

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
  PRODUCTS_API_TOKEN,
  PRODUCTS_API_KEY,
  PRODUCTS_API_KEY_HEADER,
  STORAGE_URL,
  ASESOR_URL,
} as const;

// ─── Server-only configuration ───────────────────────────────────────────────

/**
 * Variables SOLO de servidor (sin prefijo `NEXT_PUBLIC_`). Nunca se exponen al
 * cliente. Se leen como opcionales: las features que las consumen (webhook de
 * revalidación, envío de email del formulario) ya degradan de forma controlada
 * cuando faltan, así que NO se hace fail-fast aquí para no tumbar el arranque.
 *
 * IMPORTANTE: importar `serverEnv` únicamente desde código de servidor
 * (Route Handlers, Server Components), nunca desde componentes con "use client".
 */
// Se leen con getters (lazy) en cada acceso: las variables server-only NO se
// inlinean en build, se resuelven en runtime del servidor. Esto refleja el
// entorno actual y mantiene la testabilidad (los tests mutan process.env).
export const serverEnv = {
  /** Secret obligatorio para autenticar POST /api/revalidate. */
  get REVALIDATE_SECRET() {
    return readOptional(process.env.REVALIDATE_SECRET);
  },
  /** Fallback ISR cuando el CMS no dispara el webhook. Por defecto: 1 día. */
  get CMS_REVALIDATE_SECONDS() {
    return readPositiveInteger(process.env.CMS_REVALIDATE_SECONDS, 60 * 60 * 24);
  },

  // SMTP del formulario de contacto (/about). Ver .env.example.
  get SMTP_HOST() {
    return readOptional(process.env.SMTP_HOST);
  },
  get SMTP_PORT() {
    return readOptional(process.env.SMTP_PORT);
  },
  get SMTP_SECURE() {
    return process.env.SMTP_SECURE === "true";
  },
  get SMTP_USER() {
    return readOptional(process.env.SMTP_USER);
  },
  get SMTP_PASS() {
    return readOptional(process.env.SMTP_PASS);
  },
  get CONTACT_TO() {
    return readOptional(process.env.CONTACT_TO);
  },
  get CONTACT_FROM() {
    return readOptional(process.env.CONTACT_FROM);
  },
};
