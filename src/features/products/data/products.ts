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
  /** Tipo de consumo */
  consumptionType: string;
  /** Imágenes adicionales para la galería */
  images?: string[];
  /** Etiquetas destacadas (ej. ULTRAPURIFICADO, certificado ifos) */
  tags?: string[];
  /** Nombre extendido para el detalle */
  longName?: string;
  /** Subtítulo para la sección de detalle principal */
  detailsSubtitle?: string;
  /** Lista de viñetas para la sección de detalle principal */
  detailsList?: string[];
  /** Estado de disponibilidad */
  stockStatus?: string;
  /** Instrucciones / Modo de uso */
  usageInstructions?: string;
  /** Lista de beneficios */
  benefits?: string[];
}

// ─── Mock Data ───

/**
 * Categorías basadas en el "Tipo de Consumo"
 */
export const CONSUMPTION_CATEGORIES = [
  { id: "c1", name: "Longevidad y Prevención", imageSrc: "/categories/img1.png", href: "/products?consumptionType=Longevidad%20y%20Prevenci%C3%B3n" },
  { id: "c2", name: "Rendimiento y Energía", imageSrc: "/categories/img2.png", href: "/products?consumptionType=Rendimiento%20y%20Energ%C3%ADa" },
  { id: "c3", name: "Foco y Antiestrés", imageSrc: "/categories/img3.png", href: "/products?consumptionType=Foco%20y%20Antiestr%C3%A9s" },
  { id: "c4", name: "Belleza y Piel", imageSrc: "/categories/img4.png", href: "/products?consumptionType=Belleza%20y%20Piel" },
  { id: "c5", name: "Salud Inmunológica", imageSrc: "/categories/img1.png", href: "/products?consumptionType=Salud%20Inmunol%C3%B3gica" },
  { id: "c6", name: "Descanso y Reparación", imageSrc: "/categories/img2.png", href: "/products?consumptionType=Descanso%20y%20Reparaci%C3%B3n" },
];

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
    consumptionType: "Longevidad y Prevención",
    images: ["/product/image6.png", "/product/image7.png", "/product/image8.png", "/product/image6.png", "/product/image7.png"],
    tags: ["ULTRAPURIFICADO", "sin sabor a pescado", "certificado ifos"],
    longName: "Omega 3 Aceite Ultrapurificado (Ejemplo largo)",
    detailsSubtitle: "Salud cardiovascular y cerebral",
    detailsList: [
      "Mantenimiento de los huesos en condiciones normales",
      "Nutre el tejido muscular",
      "Mantenimiento de cartílagos, tendones y ligamentos."
    ],
    stockStatus: "En stock",
    usageInstructions: "Tomar 2 cápsulas diarias con las comidas principales. Puede dividirse en una por la mañana y otra por la noche.",
    benefits: [
      "Apoya la salud del corazón y arterias",
      "Mejora la función cognitiva y memoria",
      "Reduce la inflamación sistémica",
      "Contribuye a la salud de piel y articulaciones"
    ]
  },
  {
    id: "2",
    name: "Vitamina C + Zinc",
    price: 12.99,
    shortDescription: "Comprimidos efervescentes para fortalecer el sistema inmunológico.",
    description: "Refuerza tus defensas naturales con esta potente combinación de Vitamina C y Zinc. Elaborado en un conveniente formato efervescente con agradable sabor a naranja, ayuda a prevenir resfriados y acelera la recuperación. Ideal para uso diario, especialmente durante los cambios de estación.",
    image: "/product/image7.png",
    category: "Vitaminas",
    consumptionType: "Rendimiento y Energía",
    images: ["/product/image7.png", "/product/image8.png", "/product/image6.png"],
    tags: ["ALTA ABSORCIÓN", "sabor naranja", "vitamina c"],
    longName: "Vitamina C + Zinc Efervescente",
    detailsSubtitle: "Inmunidad y recuperación rápida",
    detailsList: [
      "Ayuda a prevenir resfriados comunes",
      "Protege contra el daño celular",
      "Mantiene la piel saludable y radiante"
    ],
    stockStatus: "Pocas unidades",
    usageInstructions: "Disolver 1 pastilla efervescente en un vaso de agua al día, preferentemente por la mañana.",
    benefits: [
      "Refuerza el sistema inmunitario",
      "Potente acción antioxidante",
      "Favorece la producción de colágeno"
    ]
  },
  {
    id: "3",
    name: "Omega 3 Cápsulas Blandas",
    price: 18.50,
    shortDescription: "Suplemento de aceite de pescado para la salud cardiovascular.",
    description: "Suplemento alimenticio de alta pureza extraído de peces de aguas profundas. Cada cápsula blanda proporciona los ácidos grasos esenciales EPA y DHA que tu cuerpo necesita para mantener un corazón sano, mejorar la función cerebral y apoyar la salud de las articulaciones. Libre de metales pesados y sabor a pescado.",
    image: "/product/image8.png",
    category: "Suplementos",
    consumptionType: "Foco y Antiestrés",
    images: ["/product/image8.png", "/product/image6.png", "/product/image7.png", "/product/image8.png"],
    tags: ["PURO", "sin metales pesados", "con epa y dha"],
    longName: "Cápsulas Blandas de Omega 3 Premium",
    detailsSubtitle: "Funcionamiento cerebral óptimo",
    detailsList: [
      "Mejora la circulación de la sangre",
      "Protege el corazón",
      "Mantiene la función ocular normal"
    ],
    stockStatus: "En stock",
    usageInstructions: "Tomar de 1 a 2 cápsulas blandas al día junto a las comidas principales.",
    benefits: [
      "Reduce triglicéridos",
      "Mejora dolores articulares",
      "Apoyo esencial para la función cerebral"
    ]
  },
  {
    id: "4",
    name: "Ibuprofeno 400mg",
    price: 5.20,
    shortDescription: "Antiinflamatorio no esteroideo para dolores moderados.",
    description: "Alivio rápido y duradero para el dolor y la inflamación. El Ibuprofeno de 400mg es altamente efectivo para tratar dolores musculares, articulares, dolor de espalda y molestias dentales. Actúa inhibiendo las sustancias en el cuerpo que causan la inflamación, proporcionando confort para que puedas continuar con tu día.",
    image: "/product/image6.png",
    category: "Medicamentos",
    consumptionType: "Belleza y Piel",
    images: ["/product/image6.png", "/product/image8.png"],
    tags: ["RÁPIDA ACCIÓN", "para el dolor"],
    longName: "Ibuprofeno 400mg Rápido Alivio",
    detailsSubtitle: "Alivio del dolor e inflamación",
    detailsList: [
      "Alivia dolores de cabeza intensos",
      "Ideal para dolores musculares",
      "Reduce la fiebre rápidamente"
    ],
    stockStatus: "En stock",
    usageInstructions: "Tomar 1 tableta cada 8 horas si el dolor persiste. No exceder la dosis recomendada.",
    benefits: [
      "Acción antiinflamatoria directa",
      "Duradero efecto analgésico",
      "Eficaz tras el ejercicio físico"
    ]
  },
  {
    id: "5",
    name: "Multivitamínico Adulto Activo",
    price: 22.00,
    shortDescription: "Fórmula completa con 24 vitaminas y minerales esenciales.",
    description: "Suplemento vitamínico integral diseñado específicamente para adultos con un estilo de vida exigente. Contiene vitaminas del complejo B para la energía, calcio y vitamina D para los huesos, y antioxidantes para combatir el estrés oxidativo. Una sola tableta al día cubre tus requerimientos nutricionales para mantenerte al máximo nivel.",
    image: "/product/image7.png",
    category: "Vitaminas",
    consumptionType: "Salud Inmunológica",
    images: ["/product/image7.png", "/product/image6.png", "/product/image8.png", "/product/image7.png"],
    tags: ["COMPLEJO B", "24 vitaminas", "diario"],
    longName: "Multivitamínico Adulto Activo Integral",
    detailsSubtitle: "Energía y vitalidad diaria",
    detailsList: [
      "Aporta energía sostenida",
      "Reduce el cansancio y la fatiga",
      "Contribuye a la función psicológica normal"
    ],
    stockStatus: "En stock",
    usageInstructions: "Tomar 1 cápsula diaria por la mañana con el desayuno.",
    benefits: [
      "Mejora el rendimiento físico",
      "Aporta antioxidantes diarios",
      "Optimiza el metabolismo energético"
    ]
  },
  {
    id: "6",
    name: "Colágeno Hidrolizado",
    price: 28.90,
    shortDescription: "Polvo sin sabor para la salud de piel, cabello y articulaciones.",
    description: "Péptidos de colágeno de alta absorción que estimulan la regeneración celular. Este suplemento en polvo se disuelve fácilmente en cualquier bebida fría o caliente sin alterar su sabor. Ayuda a reducir las arrugas, fortalece el cabello y las uñas, y mejora la movilidad articular, combatiendo los signos del envejecimiento desde el interior.",
    image: "/product/image8.png",
    category: "Suplementos",
    consumptionType: "Descanso y Reparación",
    images: ["/product/image8.png", "/product/image7.png"],
    tags: ["PÉPTIDOS", "salud articular", "sin sabor"],
    longName: "Péptidos de Colágeno Hidrolizado Articular",
    detailsSubtitle: "Regeneración y movilidad",
    detailsList: [
      "Promueve la salud ósea",
      "Aumenta la elasticidad de la piel",
      "Retrasa signos del envejecimiento"
    ],
    stockStatus: "Agotado",
    usageInstructions: "Diluir 1 cucharada medidora en 200ml de agua o jugo, una vez al día.",
    benefits: [
      "Atenúa las arrugas finas",
      "Fortalece cabellos y uñas",
      "Mejora la motricidad articular"
    ]
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

/**
 * Obtiene productos paginados simulando un API backend.
 */
export async function getPaginatedProducts(page: number, limit: number) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 900));

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedProducts = PRODUCTS.slice(startIndex, endIndex);

  return {
    data: paginatedProducts,
    meta: {
      total: PRODUCTS.length,
      page,
      limit,
      totalPages: Math.ceil(PRODUCTS.length / limit)
    }
  };
}
