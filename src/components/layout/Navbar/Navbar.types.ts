/**
 * @fileoverview Tipos e interfaces para el sistema de navegación del Navbar.
 *
 * Define la estructura de datos para los links de navegación,
 * incluyendo soporte para submenús anidados (dropdown).
 */

/**
 * Representa un link individual dentro de un submenú desplegable.
 *
 * @example
 * const submenuItem: NavSubmenuItem = {
 *   label: "Ciencia y Calidad",
 *   href: "/science-and-quality",
 *   description: "Respaldo científico",
 * };
 */
export interface NavSubmenuItem {
  /** Texto visible del link */
  label: string;
  /** Ruta de destino (Next.js router path) */
  href: string;
  /** Descripción breve opcional que aparece debajo del label */
  description?: string;
}

/**
 * Representa un link de navegación principal del Navbar.
 *
 * Puede ser un link directo (con `href`) o un disparador de submenú
 * (con `submenuItems`). Ambas propiedades son mutuamente excluyentes:
 * si `submenuItems` está definido, `href` se ignora.
 *
 * @example
 * // Link directo
 * const directLink: NavLinkItem = {
 *   label: "Productos",
 *   href: "/products",
 * };
 *
 * // Link con submenú
 * const menuTrigger: NavLinkItem = {
 *   label: "Más",
 *   submenuItems: [
 *     { label: "Ciencia y Calidad", href: "/science-and-quality" },
 *     { label: "FAQ", href: "/faq" },
 *   ],
 * };
 */
export interface NavLinkItem {
  /** Texto visible del link */
  label: string;
  /** Ruta de destino — requerida si no tiene submenuItems */
  href?: string;
  /** Descripción breve opcional que aparece debajo del label en menú móvil */
  description?: string;
  /** Lista de items del submenú — si se define, el link actúa como trigger */
  submenuItems?: NavSubmenuItem[];
}
