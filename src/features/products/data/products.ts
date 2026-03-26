/**
 * @fileoverview Datos de productos genéricos (mock data).
 *
 * Este archivo simula la respuesta de una API de productos.
 * Cuando se integre un backend real, este archivo se reemplazará
 * por llamadas a la API en `features/products/api/`.
 *
 * También exporta el tipo `Product` que es la interfaz pública
 * del dominio de productos.
 */

// ─── Tipos ───

/** Representa un producto en el catálogo */
export interface Product {
  /** Identificador único del producto */
  id: string;
  /** Nombre comercial del producto */
  name: string;
  /** Precio en USD */
  price: number;
  /** Descripción corta para cards */
  shortDescription: string;
  /** Descripción larga para la página de detalle */
  description: string;
  /** URL de la imagen principal */
  image: string;
  /** Categoría del producto */
  category: string;
}

// ─── Mock Data ───

/**
 * Array de productos genéricos para desarrollo.
 *
 * Usa imágenes de Unsplash (gratuitas) como placeholder.
 * En producción estos datos vendrán de la API.
 */
export const PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Camiseta Premium Algodón",
    price: 29.99,
    shortDescription: "Camiseta de algodón orgánico de alta calidad.",
    description:
      "Confeccionada con algodón orgánico 100% certificado, esta camiseta premium ofrece una suavidad incomparable y un ajuste perfecto. Ideal para el uso diario, disponible en múltiples tallas y colores. Su fabricación sostenible garantiza el mínimo impacto ambiental sin comprometer la calidad ni el confort.",
    image: "/product/image6.png",
    category: "Ropa",
  },
  {
    id: "2",
    name: "Zapatillas Deportivas Pro",
    price: 89.99,
    shortDescription: "Zapatillas ligeras con amortiguación avanzada.",
    description:
      "Diseñadas para el rendimiento máximo, estas zapatillas deportivas cuentan con tecnología de amortiguación avanzada y una suela de alto agarre. Su diseño transpirable mantiene tus pies frescos durante los entrenamientos más intensos. Perfectas para correr, entrenar en el gimnasio o usar como calzado casual de estilo urbano.",
    image: "/product/image7.png",
    category: "Calzado",
  },
  {
    id: "3",
    name: "Reloj Clásico Acero",
    price: 149.99,
    shortDescription: "Reloj elegante con caja de acero inoxidable.",
    description:
      "Un reloj que combina elegancia y durabilidad. Su caja de acero inoxidable con cristal resistente a rayones lo convierte en el accesorio perfecto para cualquier ocasión. Mecanismo de cuarzo japonés de alta precisión, resistente al agua hasta 50 metros y con garantía de 2 años.",
    image: "/product/image8.png",
    category: "Accesorios",
  },
  {
    id: "4",
    name: "Mochila Urban Explorer",
    price: 59.99,
    shortDescription: "Mochila resistente con compartimento para laptop.",
    description:
      "La compañera ideal para la ciudad o el viaje. Fabricada en nylon resistente al agua con múltiples compartimentos organizadores, incluyendo un compartimento acolchado para laptops de hasta 15 pulgadas. Correas ergonómicas ajustables y panel trasero transpirable para máxima comodidad durante todo el día.",
    image: "/product/image6.png",
    category: "Accesorios",
  },
  {
    id: "5",
    name: "Auriculares Inalámbricos",
    price: 79.99,
    shortDescription: "Auriculares Bluetooth con cancelación de ruido.",
    description:
      "Sumérgete en tu música con estos auriculares inalámbricos de última generación. Tecnología de cancelación activa de ruido, batería de larga duración (hasta 30 horas), y conectividad Bluetooth 5.3 para una experiencia de audio sin interrupciones. Incluye estuche de carga portátil y cable USB-C.",
    image: "/product/image7.png",
    category: "Electrónica",
  },
  {
    id: "6",
    name: "Chaqueta Impermeable",
    price: 119.99,
    shortDescription: "Chaqueta ligera, transpirable e impermeable.",
    description:
      "Protégete de los elementos con esta chaqueta impermeable de alto rendimiento. Membrana transpirable que repele el agua sin sacrificar la ventilación. Costuras selladas, capucha ajustable y bolsillos con cremallera. Ideal para actividades al aire libre, senderismo o simplemente para los días lluviosos en la ciudad.",
    image: "/product/image8.png",
    category: "Ropa",
  },
];

// ─── Helpers ───

/**
 * Busca un producto por su ID.
 *
 * @param id - Identificador del producto
 * @returns El producto encontrado o `undefined`
 */
export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((product) => product.id === id);
}

/**
 * Obtiene todos los IDs de productos disponibles.
 * Útil para `generateStaticParams` de Next.js.
 */
export function getAllProductIds(): string[] {
  return PRODUCTS.map((product) => product.id);
}
