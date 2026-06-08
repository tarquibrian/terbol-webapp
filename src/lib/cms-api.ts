import { env } from "@/config/env";
import { logError } from "@/lib/logger";

interface CmsEnvelope<T = unknown> {
  success?: boolean;
  message?: string;
  data?: T;
}

const DEFAULT_CMS_REVALIDATE_SECONDS = 60 * 60;

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
    options.next = { tags, revalidate: DEFAULT_CMS_REVALIDATE_SECONDS };
  }

  try {
    const res = await fetch(url, options);

    if (!res.ok) {
      // Capturamos el error HTTP para facilitar el debugeo
      throw new Error(`Error HTTP: ${res.status} al solicitar ${endpointPath}`);
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

  getHome: () => fetchCMS<CmsEnvelope>("/sections/home", ["home", "footer"]),

  getAbout: () => fetchCMS<CmsEnvelope>("/sections/about", ["about"]),

  getSuccessPlan: () =>
    fetchCMS<CmsEnvelope>("/sections/success-plan", ["success-plan"]),

  getLearn: () => fetchCMS<CmsEnvelope>("/sections/learn", ["learn"]),

  getHelp: () => fetchCMS<CmsEnvelope>("/sections/help", ["help"]),

  getPromoter: () => fetchCMS<CmsEnvelope>("/sections/promoter", ["promoter"]),

  getScience: () => fetchCMS<CmsEnvelope>("/sections/science", ["science"]),

  // ─── Blog / Artículos ──────────────────────────────────────────────────────

  /**
   * Obtiene la lista paginada y filtrada de artículos del blog.
   * Al depender de parámetros dinámicos, optamos por no cachear agresivamente
   * u omitir el caché para obtener datos frescos al filtrar.
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

    // Usamos 'no-store' (SSR dinámico) para búsquedas, o configuramos un revalidate muy corto
    return fetchCMS<CmsEnvelope>(
      `/sections/learn/blogs?${queryParams.toString()}`,
      ["learn"],
      "no-store",
    );
  },

  /**
   * Obtiene el detalle de un artículo específico.
   * Etiquetado con un tag general y uno específico para revalidar solo este artículo.
   */
  getBlogDetail: (id: string | number) =>
    fetchCMS<CmsEnvelope>(`/sections/learn/blogs/${id}`, [
      "learn",
      `blog-${id}`,
    ]),
};
