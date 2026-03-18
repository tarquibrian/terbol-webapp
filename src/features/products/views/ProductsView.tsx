/**
 * @fileoverview ProductsView — vista completa de la página "Nuestros Productos".
 *
 * Compone los componentes del feature `products`.
 * Importada por `app/products/page.tsx` como thin wrapper.
 */

import * as React from "react";
import { ProductsHero } from "../components/ProductsHero";

/**
 * Vista completa de la página Products.
 *
 * Secciones futuras: ProductGrid, Filters, Categories, etc.
 */
export function ProductsView() {
  return (
    <>
      <ProductsHero />
      {/* Futuras secciones: ProductGrid, Filters, Categories, etc. */}
    </>
  );
}
