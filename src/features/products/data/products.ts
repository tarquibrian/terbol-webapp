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
export const BASE_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Paracetamol 500mg",
    price: 3.50,
    shortDescription: "Analgésico y antipirético eficaz para el alivio del dolor y la fiebre.",
    description: "El Paracetamol de 500mg es un medicamento indispensable en el botiquín del hogar. Proporciona un alivio rápido y eficaz de los dolores de cabeza, dolores musculares, molestias menstruales y reduce significativamente la fiebre. Su formato en tabletas es fácil de tragar y es suave con el estómago cuando se toma según las indicaciones.",
    image: "/product/image6.png",
    category: "Medicamentos",
  },
  {
    id: "2",
    name: "Vitamina C + Zinc",
    price: 12.99,
    shortDescription: "Comprimidos efervescentes para fortalecer el sistema inmunológico.",
    description: "Refuerza tus defensas naturales con esta potente combinación de Vitamina C y Zinc. Elaborado en un conveniente formato efervescente con agradable sabor a naranja, ayuda a prevenir resfriados y acelera la recuperación. Ideal para uso diario, especialmente durante los cambios de estación.",
    image: "/product/image7.png",
    category: "Vitaminas",
  },
  {
    id: "3",
    name: "Omega 3 Cápsulas Blandas",
    price: 18.50,
    shortDescription: "Suplemento de aceite de pescado para la salud cardiovascular.",
    description: "Suplemento alimenticio de alta pureza extraído de peces de aguas profundas. Cada cápsula blanda proporciona los ácidos grasos esenciales EPA y DHA que tu cuerpo necesita para mantener un corazón sano, mejorar la función cerebral y apoyar la salud de las articulaciones. Libre de metales pesados y sabor a pescado.",
    image: "/product/image8.png",
    category: "Suplementos",
  },
  {
    id: "4",
    name: "Ibuprofeno 400mg",
    price: 5.20,
    shortDescription: "Antiinflamatorio no esteroideo para dolores moderados.",
    description: "Alivio rápido y duradero para el dolor y la inflamación. El Ibuprofeno de 400mg es altamente efectivo para tratar dolores musculares, articulares, dolor de espalda y molestias dentales. Actúa inhibiendo las sustancias en el cuerpo que causan la inflamación, proporcionando confort para que puedas continuar con tu día.",
    image: "/product/image6.png",
    category: "Medicamentos",
  },
  {
    id: "5",
    name: "Multivitamínico Adulto Activo",
    price: 22.00,
    shortDescription: "Fórmula completa con 24 vitaminas y minerales esenciales.",
    description: "Suplemento vitamínico integral diseñado específicamente para adultos con un estilo de vida exigente. Contiene vitaminas del complejo B para la energía, calcio y vitamina D para los huesos, y antioxidantes para combatir el estrés oxidativo. Una sola tableta al día cubre tus requerimientos nutricionales para mantenerte al máximo nivel.",
    image: "/product/image7.png",
    category: "Vitaminas",
  },
  {
    id: "6",
    name: "Colágeno Hidrolizado",
    price: 28.90,
    shortDescription: "Polvo sin sabor para la salud de piel, cabello y articulaciones.",
    description: "Péptidos de colágeno de alta absorción que estimulan la regeneración celular. Este suplemento en polvo se disuelve fácilmente en cualquier bebida fría o caliente sin alterar su sabor. Ayuda a reducir las arrugas, fortalece el cabello y las uñas, y mejora la movilidad articular, combatiendo los signos del envejecimiento desde el interior.",
    image: "/product/image8.png",
    category: "Suplementos",
  },
];

// Generamos 30 productos para poder probar la paginación de forma local.
export const PRODUCTS: Product[] = Array.from({ length: 30 }).map((_, index) => {
  const base = BASE_PRODUCTS[index % 6];
  return {
    ...base,
    id: `${index + 1}`,
    name: `${base.name} - Variante ${index + 1}`
  };
});

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
