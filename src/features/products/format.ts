/**
 * @fileoverview Helpers de formateo del dominio de productos.
 *
 * Módulo sin dependencias de React para que lo puedan importar tanto las
 * tarjetas del catálogo como componentes livianos (p. ej. el dropdown de
 * sugerencias del navbar) sin arrastrar el árbol de `ProductCard`.
 */

/**
 * Formatea el precio tal como se muestra en el catálogo: sin decimales cuando
 * es entero y con dos cuando no lo es.
 *
 * Nota: la moneda está fija en "Bs." a propósito, replicando el comportamiento
 * previo de la tarjeta. El CMS devuelve `currencySymbol` (ej. "BOB") pero hoy
 * no se usa en la UI.
 */
export function formatProductPrice(price: number): string {
  const hasDecimals = !Number.isInteger(price);
  const formattedPrice = hasDecimals ? price.toFixed(2) : String(price);

  return `${formattedPrice} Bs.`;
}
