/**
 * @fileoverview Configuración centralizada de los links de navegación.
 *
 * Mantener la data separada de los componentes permite:
 * - Editar la navegación sin tocar lógica de componentes.
 * - Reutilizar la misma config en versiones mobile/desktop.
 * - Facilitar la internacionalización (i18n) futura.
 */

import type { NavLinkItem, NavSubmenuItem } from "./Navbar.types";

/**
 * Links principales del Navbar.
 *
 * El último item ("Más") incluye `submenuItems`, lo que lo convierte
 * automáticamente en un trigger de submenú desplegable.
 */
export const NAV_LINKS: NavLinkItem[] = [
  {
    label: "¿Quiénes somos?",
    href: "/about",
    description: "Conoce nuestra historia y valores corporativos",
  },
  {
    label: "Nuestros Productos",
    href: "/products",
    description: "Explora nuestro catálogo completo de productos",
  },
  {
    label: "Plan de Éxito",
    href: "/success-plan",
    description: "Descubre nuestro modelo de negocio y cómo crecer",
  },
  {
    label: "Más",
    submenuItems: [
      {
        label: "Ciencia y Calidad",
        href: "/science-and-quality",
        description: "Nuestro respaldo científico y estándares de calidad",
      },
      {
        label: "Aprende",
        href: "/blog",
        description: "Artículos, noticias y novedades",
      },
      {
        label: "Ayuda y Contacto",
        href: "/faq",
        description: "Respuestas a tus dudas más comunes",
      },
    ],
  },
];

/**
 * Función helper que extrae una lista plana de todos los links,
 * útil para aplanar menús anidados (e.g. MobileMenu) en una sola lista uniforme.
 */
export const getFlatNavLinks = (): NavSubmenuItem[] => {
  return NAV_LINKS.reduce<NavSubmenuItem[]>((acc, link) => {
    if (link.submenuItems) {
      acc.push(...link.submenuItems);
    } else if (link.href) {
      acc.push({
        label: link.label,
        href: link.href,
        description: link.description,
      });
    }
    return acc;
  }, []);
};
