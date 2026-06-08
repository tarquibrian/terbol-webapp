/**
 * @fileoverview Barrel export del feature `home`.
 *
 * Expone públicamente solo los módulos que otras partes de la app necesitan.
 * Regla: solo exportar Views y tipos públicos, nunca componentes internos.
 */

export { HomeView } from "./views/HomeView";
export type { HomePageData } from "./views/HomeView";
