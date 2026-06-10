/**
 * @fileoverview cache.ts — Configuración centralizada de caché ISR.
 *
 * ÚNICO PUNTO DE VERDAD para la estrategia de revalidación temporal del
 * contenido del CMS.
 *
 * El refresco principal es on-demand vía webhook (`/api/revalidate` →
 * `revalidateTag`). Este valor es el *fallback temporal*: si el webhook falla,
 * se pierde un evento o el CMS no dispara, el contenido se auto-refresca como
 * máximo cada `CMS_REVALIDATE_SECONDS`.
 */

/** Fallback temporal de revalidación ISR para fetches del CMS (segundos). */
export const CMS_REVALIDATE_SECONDS = 60 * 60; // 1 hora
