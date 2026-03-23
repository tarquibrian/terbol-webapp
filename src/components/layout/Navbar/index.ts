/**
 * @fileoverview Barrel export del módulo Navbar.
 *
 * Re-exporta el componente principal y los subcomponentes
 * para facilitar importaciones limpias:
 *
 * @example
 * import { Navbar } from "@/components/layout/Navbar";
 */

export * from "./Navbar";
export * from "./components/NavLink";
export * from "./components/Submenu/NavSubmenu";
export * from "./components/Submenu/NavSubmenuTrigger";
export * from "./components/MobileMenu";
export type * from "./Navbar.types";
