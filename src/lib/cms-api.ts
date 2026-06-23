import { CMS_REVALIDATE_SECONDS } from "@/config/cache";
import { env } from "@/config/env";
import { logError } from "@/lib/logger";

interface CmsEnvelope<T = unknown> {
  success?: boolean;
  message?: string;
  data?: T;
}

export class CmsHttpError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly endpoint: string,
  ) {
    super(message);
    this.name = "CmsHttpError";
  }
}

export function isCmsNotFoundError(error: unknown): error is CmsHttpError {
  return error instanceof CmsHttpError && error.status === 404;
}

/**
 * Función genérica interna para realizar peticiones al CMS de Laravel.
 * Centraliza la configuración de headers y las estrategias de caché (ISR).
 *
 * @param endpoint - La ruta de la API (ej: '/sections/home')
 * @param tags - Etiquetas para revalidación On-Demand (ISR)
 * @param cacheOptions - Opciones adicionales de caché (opcional)
 */
async function fetchCMS<T>(
  endpoint: string,
  tags: string[],
  cacheOptions?: RequestInit["cache"],
): Promise<T> {
  const url = `${env.API_URL}${endpoint}`;
  const endpointPath = endpoint.split("?")[0];

  const options: RequestInit = {
    headers: {
      Accept: "application/json",
      // Añade aquí headers de autorización si Laravel lo requiere en el futuro
      // "Authorization": `Bearer ${process.env.CMS_API_TOKEN}`
    },
  };

  // Si se proveen opciones explícitas de caché (ej: 'no-store'), las usamos
  if (cacheOptions) {
    options.cache = cacheOptions;
  } else {
    // Estrategia ISR: webhook por tag + revalidación temporal como fallback
    options.next = { tags, revalidate: CMS_REVALIDATE_SECONDS };
  }

  try {
    const res = await fetch(url, options);

    if (!res.ok) {
      // Capturamos el error HTTP para facilitar el debugeo
      throw new CmsHttpError(
        `Error HTTP: ${res.status} al solicitar ${endpointPath}`,
        res.status,
        endpointPath,
      );
    }

    return (await res.json()) as T;
  } catch (error) {
    logError("cms_fetch_failed", error, {
      endpoint: endpointPath,
      tagCount: tags.length,
      cacheMode: cacheOptions ?? "isr",
    });
    // Relanzamos el error para que pueda ser manejado por un error.tsx en Next.js
    throw error;
  }
}

// ==========================================
// SERVICIOS DE LA API DEL CMS
// ==========================================

export const cmsApi = {
  // ─── Secciones Principales Estáticas (ISR) ──────────────────────────────────

  getHome: () => fetchCMS<CmsEnvelope>("/sections/home", ["home"]),

  getAbout: () => fetchCMS<CmsEnvelope>("/sections/about", ["about"]),

  getSuccessPlan: () =>
    fetchCMS<CmsEnvelope>("/sections/success-plan", ["success-plan"]),

  getLearn: () => fetchCMS<CmsEnvelope>("/sections/learn", ["learn"]),

  getHelp: () => fetchCMS<CmsEnvelope>("/sections/help", ["help"]),

  getPromoter: () => fetchCMS<CmsEnvelope>("/sections/promoter", ["promoter"]),

  getScience: () => fetchCMS<CmsEnvelope>("/sections/science", ["science"]),

  // ─── Endpoints Globales (compartidos entre páginas) ────────────────────────

  getFooter: () => fetchCMS<CmsEnvelope>("/footer", ["footer"]),

  getAdvisorRegistration: () =>
    fetchCMS<CmsEnvelope>("/advisor-registration", ["advisor-registration"]),

  // ─── Blog / Artículos ──────────────────────────────────────────────────────

  /**
   * Obtiene la lista paginada y filtrada de artículos del blog.
   * ISR con tag "blog": cada combinación de filtros/búsqueda/página se cachea en
   * el Data Cache y se revalida on-demand cuando el CMS dispara { "tag": "blog" }
   * (más el fallback temporal). Mismo patrón que la lista de productos.
   */
  getBlogsFiltered: (
    categoryId: string | number = 0,
    search: string = "",
    page: string | number = 1,
  ) => {
    const queryParams = new URLSearchParams({
      category_blog_id: String(categoryId),
      search: search,
      page: String(page),
    });

    return fetchCMS<CmsEnvelope>(
      `/sections/learn/blogs?${queryParams.toString()}`,
      ["blog"],
    );
  },

  /**
   * Obtiene el detalle de un artículo específico.
   * Tag único "blog": el CMS revalida con { "tag": "blog" } y refresca lista y
   * detalle de una vez (ambos ISR con el mismo tag).
   */
  getBlogDetail: (id: string | number) =>
    fetchCMS<CmsEnvelope>(`/sections/learn/blogs/${id}`, ["blog"]),
};
