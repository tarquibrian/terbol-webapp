/**
 * @fileoverview Datos de productos (mock data).
 *
 * Este archivo simula la respuesta de una API de productos.
 * Cuando se integre un backend real, este archivo se reemplazará
 * por llamadas a la API en `features/products/api/`.
 *
 * También exporta el tipo `Product` que es la interfaz pública
 * del dominio de productos.
 */

// ─── Tipos ───────────────────────────────────────────────────────────────────

/** Represent un producto en el catálogo */
export interface ProductInfoItem {
  title: string;
  description: string;
}

export interface Product {
  // ── Identificación ──
  /** Identificador único del producto */
  id: string;
  /** Nombre completo del producto — se usa en product/[id] */
  name: string;
  /** Nombre corto — se usa en la card de FeaturedProducts del Home */
  shortName?: string;

  // ── Precios & Disponibilidad ──
  /** Precio en USD */
  price: number;
  /** Simbolo de moneda devuelto por el API */
  currencySymbol?: string;
  /** Estado de disponibilidad */
  stockStatus?: string;
  /** URL externa de compra, si el API la entrega */
  purchaseUrl?: string;

  // ── Textos ──
  /** Descripción corta para cards del catálogo */
  shortDescription: string;
  /** Descripción larga para la página de detalle */
  description: string;
  /** Subtítulo para la sección de detalle principal */
  detailsSubtitle?: string;
  /** Lista de viñetas para la sección de detalle principal */
  detailsList?: string[];
  /** Instrucciones / Modo de uso */
  usageInstructions?: string;
  /** Lista de beneficios */
  benefits?: string[];
  /** Etiquetas destacadas (ej. ULTRAPURIFICADO, certificado ifos) */
  tags?: string[];

  // ── Imágenes ──
  /**
   * [FeaturedProductCard — Capa 1]
   * Imagen de portada con fondo. Se muestra en el estado inicial de la card
   * (telón frontal con gradiente oscuro encima).
   */
  featuredCoverImage?: string;
  /**
   * [FeaturedProductCard — Capa 2]
   * Imagen del envase del producto sobre fondo claro. Se revela al hacer hover
   * (capa trasera fija).
   */
  featuredBgImage?: string;
  /**
   * [ProductCard — Catálogo]
   * Imagen principal que aparece en la card del catálogo de productos.
   */
  cardImage: string;
  /**
   * Imágenes extra para la galería en la página de detalle product/[id].
   */
  extraImages?: string[];

  // ── Clasificación ──
  /** Categoría del producto */
  category: string;
  /** Tipo de consumo */
  consumptionType: string;
  /** Si es true, el producto aparece en la sección de Destacados del Home */
  featuredProduct?: boolean;
  /** Identificadores del CMS para filtros por ID */
  productTypeId?: string;
  consumptionTypeId?: string;
  focusId?: string;
  focusName?: string;

  // ── Detalle enriquecido desde CMS ──
  targetImage?: string;
  targetItems?: ProductInfoItem[];
  whyChooseImage?: string;
  whyChooseTitle?: string;
  whyChooseItems?: string[];
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

/**
 * Array de productos base para desarrollo.
 * En producción estos datos vendrán de la API.
 */
export const BASE_PRODUCTS: Product[] = [
  // ── Producto 1 — COLLAGEN CREAM (Featured) ──────────────────────────────
  {
    id: "1",
    name: "Collagen Cream Premium Plus",
    shortName: "COLLAGEN CREAM",
    price: 34.90,
    stockStatus: "En stock",
    shortDescription: "Crema de colágeno premium para la regeneración y elasticidad de la piel.",
    description: "Nuestra Collagen Cream está formulada con péptidos de colágeno de alta absorción que penetran profundamente en la dermis estimulando la regeneración celular. Su textura ligera se funde con la piel sin dejar residuo, aportando hidratación intensa y elasticidad visible desde la primera semana de uso.",
    detailsSubtitle: "Regeneración y elasticidad dérmica",
    detailsList: [
      "Estimula la producción natural de colágeno",
      "Reduce visiblemente arrugas y líneas finas",
      "Hidratación profunda de 24 horas",
    ],
    usageInstructions: "Aplicar una cantidad generosa sobre el rostro y cuello limpios, con suaves movimientos circulares, mañana y noche.",
    benefits: [
      "Piel más firme y luminosa",
      "Atenúa manchas de expresión",
      "Textura ligera de rápida absorción",
      "Apta para todo tipo de piel",
    ],
    tags: ["PÉPTIDOS", "colágeno marino", "hyalurónico"],
    // Imágenes
    featuredCoverImage: "/producthome/Collagen.png",
    featuredBgImage: "/producthome/product1.png",
    cardImage: "/product/image6.png",
    extraImages: ["/product/image6.png", "/product/image7.png", "/product/image8.png"],
    // Clasificación
    category: "Cuidado de Piel",
    consumptionType: "Belleza y Piel",
    featuredProduct: true,
  },

  // ── Producto 2 — OVA OVA ACTIVE (Featured) ──────────────────────────────
  {
    id: "2",
    name: "Ova Ova Active Suplemento Base",
    shortName: "OVA OVA ACTIVE",
    price: 28.50,
    stockStatus: "En stock",
    shortDescription: "Suplemento base de alta energía para potenciar tu rendimiento diario.",
    description: "Ova Ova Active es un suplemento nutricional de base diseñado para quienes buscan mantener su energía en niveles óptimos durante todo el día. Su fórmula exclusiva combina vitaminas del complejo B, electrolitos naturales y adaptógenos que apoyan la función cognitiva y reducen la fatiga física y mental.",
    detailsSubtitle: "Energía sostenida y rendimiento óptimo",
    detailsList: [
      "Aumenta los niveles de energía sin estimulantes",
      "Mejora el enfoque y la concentración",
      "Reduce la fatiga física y mental",
    ],
    usageInstructions: "Tomar 2 cápsulas al día con el desayuno. Para máximos beneficios, mantener un ciclo de 30 días.",
    benefits: [
      "Energía sostenida sin picos ni bajones",
      "Apoyo al sistema nervioso",
      "Mejora el rendimiento deportivo",
      "100% ingredientes naturales",
    ],
    tags: ["ADAPTÓGENOS", "complejo B", "sin estimulantes"],
    // Imágenes
    featuredCoverImage: "/producthome/ovaova1.png",
    featuredBgImage: "/producthome/product2.png",
    cardImage: "/product/image7.png",
    extraImages: ["/product/image7.png", "/product/image8.png", "/product/image6.png"],
    // Clasificación
    category: "Suplementos",
    consumptionType: "Rendimiento y Energía",
    featuredProduct: true,
  },

  // ── Producto 3 — OVA OVA FLEX (Featured) ────────────────────────────────
  {
    id: "3",
    name: "Ova Ova Flex Suplemento Avanzado",
    shortName: "OVA OVA FLEX",
    price: 36.00,
    stockStatus: "En stock",
    shortDescription: "Fórmula avanzada para la salud articular, movilidad y recuperación muscular.",
    description: "Ova Ova Flex es la versión avanzada de nuestra línea Ova Ova, especialmente formulada para deportistas y personas activas que desean proteger sus articulaciones y acelerar la recuperación muscular. Con una sinergia de colágeno tipo II, glucosamina, condroitina y MSM, ofrece soporte completo al tejido conectivo.",
    detailsSubtitle: "Soporte articular y recuperación avanzada",
    detailsList: [
      "Protege cartílagos y articulaciones",
      "Acelera la recuperación post-esfuerzo",
      "Mejora la flexibilidad y rango de movimiento",
    ],
    usageInstructions: "Disolver 1 sobre en 250ml de agua fría una vez al día, preferiblemente después del entrenamiento.",
    benefits: [
      "Articulaciones más fuertes y ágiles",
      "Menos dolor post-entrenamiento",
      "Soporte al tejido conectivo",
      "Sin gluten ni lactosa",
    ],
    tags: ["COLÁGENO TIPO II", "glucosamina", "MSM"],
    // Imágenes
    featuredCoverImage: "/producthome/ovaova3.png",
    featuredBgImage: "/producthome/product3.png",
    cardImage: "/product/image8.png",
    extraImages: ["/product/image8.png", "/product/image6.png", "/product/image7.png"],
    // Clasificación
    category: "Suplementos",
    consumptionType: "Foco y Antiestrés",
    featuredProduct: true,
  },

  // ── Producto 4 ───────────────────────────────────────────────────────────
  {
    id: "4",
    name: "Ibuprofeno 400mg Rápido Alivio",
    shortName: "Ibuprofeno",
    price: 5.20,
    stockStatus: "En stock",
    shortDescription: "Antiinflamatorio no esteroideo para dolores moderados.",
    description: "Alivio rápido y duradero para el dolor y la inflamación. El Ibuprofeno de 400mg es altamente efectivo para tratar dolores musculares, articulares, dolor de espalda y molestias dentales. Actúa inhibiendo las sustancias en el cuerpo que causan la inflamación.",
    detailsSubtitle: "Alivio del dolor e inflamación",
    detailsList: [
      "Alivia dolores de cabeza intensos",
      "Ideal para dolores musculares",
      "Reduce la fiebre rápidamente",
    ],
    usageInstructions: "Tomar 1 tableta cada 8 horas si el dolor persiste. No exceder la dosis recomendada.",
    benefits: [
      "Acción antiinflamatoria directa",
      "Duradero efecto analgésico",
      "Eficaz tras el ejercicio físico",
    ],
    tags: ["RÁPIDA ACCIÓN", "para el dolor"],
    // Imágenes
    cardImage: "/product/image6.png",
    extraImages: ["/product/image6.png", "/product/image8.png"],
    // Clasificación
    category: "Medicamentos",
    consumptionType: "Belleza y Piel",
  },

  // ── Producto 5 ───────────────────────────────────────────────────────────
  {
    id: "5",
    name: "Multivitamínico Adulto Activo Integral",
    shortName: "Multivitamínico",
    price: 22.00,
    stockStatus: "En stock",
    shortDescription: "Fórmula completa con 24 vitaminas y minerales esenciales.",
    description: "Suplemento vitamínico integral diseñado específicamente para adultos con un estilo de vida exigente. Contiene vitaminas del complejo B para la energía, calcio y vitamina D para los huesos, y antioxidantes para combatir el estrés oxidativo.",
    detailsSubtitle: "Energía y vitalidad diaria",
    detailsList: [
      "Aporta energía sostenida",
      "Reduce el cansancio y la fatiga",
      "Contribuye a la función psicológica normal",
    ],
    usageInstructions: "Tomar 1 cápsula diaria por la mañana con el desayuno.",
    benefits: [
      "Mejora el rendimiento físico",
      "Aporta antioxidantes diarios",
      "Optimiza el metabolismo energético",
    ],
    tags: ["COMPLEJO B", "24 vitaminas", "diario"],
    // Imágenes
    cardImage: "/product/image7.png",
    extraImages: ["/product/image7.png", "/product/image6.png", "/product/image8.png"],
    // Clasificación
    category: "Vitaminas",
    consumptionType: "Salud Inmunológica",
  },

  // ── Producto 6 ───────────────────────────────────────────────────────────
  {
    id: "6",
    name: "Péptidos de Colágeno Hidrolizado Articular",
    shortName: "Colágeno",
    price: 28.90,
    stockStatus: "Agotado",
    shortDescription: "Polvo sin sabor para la salud de piel, cabello y articulaciones.",
    description: "Péptidos de colágeno de alta absorción que estimulan la regeneración celular. Este suplemento en polvo se disuelve fácilmente en cualquier bebida fría o caliente sin alterar su sabor. Ayuda a reducir las arrugas, fortalece el cabello y las uñas, y mejora la movilidad articular.",
    detailsSubtitle: "Regeneración y movilidad",
    detailsList: [
      "Promueve la salud ósea",
      "Aumenta la elasticidad de la piel",
      "Retrasa signos del envejecimiento",
    ],
    usageInstructions: "Diluir 1 cucharada medidora en 200ml de agua o jugo, una vez al día.",
    benefits: [
      "Atenúa las arrugas finas",
      "Fortalece cabellos y uñas",
      "Mejora la motricidad articular",
    ],
    tags: ["PÉPTIDOS", "salud articular", "sin sabor"],
    // Imágenes
    cardImage: "/product/image8.png",
    extraImages: ["/product/image8.png", "/product/image7.png"],
    // Clasificación
    category: "Suplementos",
    consumptionType: "Descanso y Reparación",
  },
];

// Generamos 30 productos para poder probar la paginación de forma local.
export const PRODUCTS: Product[] = Array.from({ length: 30 }).map((_, index) => {
  const base = BASE_PRODUCTS[index % 6];
  return {
    ...base,
    id: `${index + 1}`,
    name: `${base.name} - Variante ${index + 1}`,
  };
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Busca un producto por su ID.
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
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedProducts = PRODUCTS.slice(startIndex, endIndex);

  return {
    data: paginatedProducts,
    meta: {
      total: PRODUCTS.length,
      page,
      limit,
      totalPages: Math.ceil(PRODUCTS.length / limit),
    },
  };
}
