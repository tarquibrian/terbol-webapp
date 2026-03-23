/**
 * @fileoverview Barrel export del feature `products`.
 *
 * Expone públicamente las vistas principales y tipos del dominio.
 */

export { ProductsView } from "./views/ProductsView";
export { ProductDetailView } from "./views/ProductDetailView";
export type { Product } from "./data/products";
export { getProductById, getAllProductIds } from "./data/products";
