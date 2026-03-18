/**
 * @fileoverview Configuración centralizada de los links de navegación.
 *
 * Mantener la data separada de los componentes permite:
 * - Editar la navegación sin tocar lógica de componentes.
 * - Reutilizar la misma config en versiones mobile/desktop.
 * - Facilitar la internacionalización (i18n) futura.
 */

import type { NavLinkItem } from "./Navbar.types";

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
  },
  {
    label: "Nuestros Productos",
    href: "/products",
  },
  {
    label: "Plan de Éxito",
    href: "/success-plan",
  },
  {
    label: "Más",
    submenuItems: [
      {
        label: "Blog",
        href: "/blog",
        description: "Artículos, noticias y novedades",
      },
      {
        label: "Preguntas Frecuentes",
        href: "/faq",
        description: "Respuestas a tus dudas más comunes",
      },
      {
        label: "Trabaja con nosotros",
        href: "/careers",
        description: "Únete a nuestro equipo de trabajo",
      },
      {
        label: "Contacto",
        href: "/contact",
        description: "Ponte en contacto con nosotros",
      },
    ],
  },
];
