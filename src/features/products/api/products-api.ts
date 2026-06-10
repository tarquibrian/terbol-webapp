import { CMS_REVALIDATE_SECONDS } from "@/config/cache";
import { env } from "@/config/env";
import { resolveImageAsset } from "@/lib/image-assets";
import { logError } from "@/lib/logger";
import {
  isRecord,
  readBoolean,
  readNestedNumber,
  readNestedString,
  readNumber,
  readRecord,
  readRecordArray,
  readString,
  readStringArray,
} from "@/lib/safe-read";
import {
  getOptionIdsByName,
  getOptionNamesById,
  normalizeLookup,
} from "./filter-options";
import { PRODUCTS, type Product, type ProductInfoItem } from "../data/products";
import type {
  ProductCategoryLink,
  ProductFilterOption,
  ProductsDataSource,
  ProductsFiltersResponse,
  ProductsListResponse,
  ProductsMeta,
  ProductsQuery,
} from "./types";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 9;
const MAX_LIMIT = 60;
// Tag único para todo el contenido de productos (lista, filtros y detalle).
// El CMS revalida con { "tag": "products" } y refresca todo de una vez.
const PRODUCTS_TAG = "products";
const PRODUCTS_ENDPOINT = "/products";

interface ProductDetailPageData {
  product: Product;
  relatedProducts: Product[];
  suggestedFocuses: ProductCategoryLink[];
}

interface NormalizeProductOptions {
  allowFeaturedImageAsCardImage?: boolean;
}

const FALLBACK_PRODUCT_TYPES: ProductFilterOption[] = [
  { id: "1", name: "Medicamentos", order: 1 },
  { id: "2", name: "Suplementos Y Vitaminas", order: 2 },
  { id: "3", name: "Superalimentos", order: 3 },
];

const FALLBACK_FOCUSES: ProductFilterOption[] = [
  { id: "1", name: "Rendimiento y Energía", imageSrc: "/categories/img2.png", featured: true, order: 1 },
  { id: "2", name: "Longevidad y Prevención", imageSrc: "/categories/img1.png", featured: false, order: 2 },
  { id: "3", name: "Foco y Antiestrés", imageSrc: "/categories/img3.png", featured: true, order: 3 },
  { id: "4", name: "Alimentación y Salud", imageSrc: "/categories/img4.png", featured: false, order: 4 },
];

const FALLBACK_CONSUMPTION_TYPES: ProductFilterOption[] = [
  { id: "1", name: "Vía oral", order: 1 },
  { id: "2", name: "Vía tópica", order: 2 },
  { id: "3", name: "Vía inyectable", order: 3 },
  { id: "4", name: "Vía oftálmica", order: 4 },
  { id: "5", name: "Vía ótica", order: 5 },
];

class ProductDetailNotFoundError extends Error {}

function canUseProductsMockFallback() {
  return process.env.NODE_ENV !== "production";
}

function toPositiveInteger(
  value: string | null,
  fallback: number,
  max = Number.MAX_SAFE_INTEGER,
) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 1) return fallback;
  return Math.min(Math.floor(parsed), max);
}

function uniqueNonEmpty(values: string[]) {
  return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)));
}

export function parseProductsQuery(searchParams: URLSearchParams): ProductsQuery {
  return {
    page: toPositiveInteger(searchParams.get("page"), DEFAULT_PAGE),
    limit: toPositiveInteger(searchParams.get("limit"), DEFAULT_LIMIT, MAX_LIMIT),
    productTypeIds: uniqueNonEmpty([
      ...searchParams.getAll("productTypeId"),
      ...searchParams.getAll("productTypeIds"),
      ...searchParams.getAll("product_type_id"),
      ...searchParams.getAll("product_type_ids[]"),
    ]),
    consumptionTypeIds: uniqueNonEmpty([
      ...searchParams.getAll("consumptionTypeId"),
      ...searchParams.getAll("consumptionTypeIds"),
      ...searchParams.getAll("consumption_type_id"),
      ...searchParams.getAll("consumption_type_ids[]"),
    ]),
    focusIds: uniqueNonEmpty([
      ...searchParams.getAll("focusId"),
      ...searchParams.getAll("focusIds"),
      ...searchParams.getAll("focus_id"),
      ...searchParams.getAll("focus_ids[]"),
    ]),
    categories: uniqueNonEmpty(searchParams.getAll("category")),
    search: searchParams.get("search")?.trim() ?? searchParams.get("name")?.trim() ?? "",
  };
}



function isCatalogItemVisible(rawProduct: Record<string, unknown>) {
  const visible = readNestedString(rawProduct, "ProductoOrder", ["Visible"]);
  return visible?.toUpperCase() !== "N";
}

function normalizeInfoItems(items?: Record<string, unknown>[]): ProductInfoItem[] | undefined {
  const normalizedItems = items
    ?.map((item) => {
      const title = readString(item, ["title", "name"]);
      const description = readString(item, ["description", "content", "text"]);
      return title && description ? { title, description } : null;
    })
    .filter((item): item is ProductInfoItem => item !== null);

  return normalizedItems && normalizedItems.length > 0 ? normalizedItems : undefined;
}

function readGalleryImages(rawProduct: Record<string, unknown>) {
  const galleryRecords = readRecordArray(rawProduct, ["gallery"]);
  const galleryImages = galleryRecords
    ?.map((item) => readString(item, ["image", "url", "src", "path"]))
    .filter((image): image is string => Boolean(image))
    .map((image) => resolveImageAsset(image))
    .filter((image): image is string => Boolean(image));

  const arrayImages = readStringArray(rawProduct, [
    "extraImages",
    "extra_images",
  ])
    ?.map((image) => resolveImageAsset(image))
    .filter((image): image is string => Boolean(image));

  return galleryImages ?? arrayImages;
}

function normalizeProduct(
  rawProduct: unknown,
  options: NormalizeProductOptions = {},
): Product | null {
  if (!isRecord(rawProduct)) return null;
  if (!isCatalogItemVisible(rawProduct)) return null;
  const allowFeaturedImageAsCardImage =
    options.allowFeaturedImageAsCardImage ?? true;

  const id =
    readString(rawProduct, [
      "id",
      "productId",
      "product_id",
      "slug",
      "CodigoMaterial",
    ]) ?? readNestedString(rawProduct, "PropiedadEncabezado", ["CodigoMaterial"]);
  const name =
    readString(rawProduct, [
      "name",
      "title",
      "productName",
      "product_name",
      "NombreMaterial",
    ]) ?? readNestedString(rawProduct, "PropiedadEncabezado", ["NombreMaterial"]);

  if (!id || !name) return null;

  const shortDescription =
    readString(rawProduct, [
      "shortDescription",
      "short_description",
      "summary",
      "excerpt",
      "description",
      "ContenidoMaterial",
    ]) ??
    readNestedString(rawProduct, "PropiedadEncabezado", ["ContenidoMaterial"]) ??
    "";
  const description =
    readString(rawProduct, [
      "description",
      "body",
      "content",
      "ContenidoMaterial",
    ]) ??
    readNestedString(rawProduct, "PropiedadEncabezado", ["ContenidoMaterial"]) ??
    shortDescription;
  const category =
    readString(rawProduct, [
      "category",
      "categoryName",
      "category_name",
      "NombreGrupoMaterial",
    ]) ??
    readNestedString(rawProduct, "category", ["name", "title"]) ??
    readNestedString(rawProduct, "product_type", ["name", "title"]) ??
    readNestedString(rawProduct, "productType", ["name", "title"]) ??
    "Sin categoria";
  const consumptionType =
    readString(rawProduct, [
      "consumptionType",
      "consumption_type",
      "consumptionCategory",
      "consumption_category",
    ]) ??
    readNestedString(rawProduct, "consumptionType", ["name", "title"]) ??
    readNestedString(rawProduct, "consumption_type", ["name", "title"]) ??
    category;
  const cardImageKeys = [
    "cardImage",
    "card_image",
    ...(allowFeaturedImageAsCardImage ? ["featured_image", "featuredImage"] : []),
    "image",
    "imageUrl",
    "image_url",
    "thumbnail",
    "thumbnail_url",
    "UrlFotoMaterial",
  ];
  const rawCardImage =
    readString(rawProduct, cardImageKeys) ??
    readNestedString(rawProduct, "image", ["url", "src", "path"]) ??
    readNestedString(rawProduct, "media", ["url", "src", "path"]) ??
    "/product/image6.png";
  const cardImage = resolveImageAsset(rawCardImage, "/product/image6.png") ?? "/product/image6.png";
  const availability = readBoolean(rawProduct, ["availability", "available", "in_stock"]);
  const detailsList =
    readStringArray(rawProduct, ["detailsList", "details_list", "features"]) ??
    readStringArray(rawProduct, ["why_choose"]);
  const targetItems = normalizeInfoItems(
    readRecordArray(rawProduct, ["designed_for", "designedFor"]),
  );
  const whyChooseItems = readStringArray(rawProduct, [
    "why_choose",
    "whyChoose",
    "whyChooseItems",
    "why_choose_items",
  ]);
  const galleryImages = readGalleryImages(rawProduct);
  const productTypeId =
    readNestedNumber(rawProduct, "product_type", ["id"]) ??
    readNestedNumber(rawProduct, "productType", ["id"]);
  const consumptionTypeId =
    readNestedNumber(rawProduct, "consumption_type", ["id"]) ??
    readNestedNumber(rawProduct, "consumptionType", ["id"]);
  const focusId =
    readNestedNumber(rawProduct, "focus", ["id"]) ??
    readNestedNumber(rawProduct, "focuses", ["id"]);

  return {
    id,
    name,
    shortName:
      readString(rawProduct, ["shortName", "short_name"]) ??
      readNestedString(rawProduct, "PropiedadEncabezado", ["DosisMaterial"]),
    price: readNumber(rawProduct, ["price", "amount", "cost", "PrecioNeto"]) ?? 0,
    currencySymbol:
      readNestedString(rawProduct, "currency", ["symbol", "name"]) ??
      readString(rawProduct, ["MonedaVenta"]),
    stockStatus:
      readString(rawProduct, ["stockStatus", "stock_status"]) ??
      (availability === false ? "Agotado" : availability === true ? "En stock" : undefined),
    purchaseUrl: readString(rawProduct, ["purchase_url", "purchaseUrl", "url"]),
    shortDescription,
    description,
    detailsSubtitle:
      readString(rawProduct, [
        "detailsSubtitle",
        "details_subtitle",
        "features_title",
        "featuresTitle",
        "subtitle",
      ]) ?? readNestedString(rawProduct, "PropiedadEncabezado", ["DosisMaterial"]),
    detailsList,
    usageInstructions: readString(rawProduct, [
      "usageInstructions",
      "usage_instructions",
      "usage_mode",
      "usageMode",
      "instructions",
    ]),
    benefits: readStringArray(rawProduct, ["benefits"]),
    tags: readStringArray(rawProduct, ["tags"]),
    featuredCoverImage:
      resolveImageAsset(
        readString(rawProduct, [
          "featuredCoverImage",
          "featured_cover_image",
          "featured_image",
        ]),
      ) ?? undefined,
    featuredBgImage:
      resolveImageAsset(
        readString(rawProduct, [
          "featuredBgImage",
          "featured_bg_image",
          "productImage",
          "product_image",
          "packshot",
          "packshot_image",
          "image",
        ]),
      ) ?? undefined,
    cardImage,
    extraImages: galleryImages,
    category,
    consumptionType,
    featuredProduct: readBoolean(rawProduct, [
      "featuredProduct",
      "featured_product",
      "featured",
    ]),
    productTypeId: productTypeId ? String(productTypeId) : undefined,
    consumptionTypeId: consumptionTypeId ? String(consumptionTypeId) : undefined,
    focusId: focusId ? String(focusId) : undefined,
    focusName: readNestedString(rawProduct, "focus", ["name", "title"]),
    targetImage:
      resolveImageAsset(
        readString(rawProduct, [
          "designed_for_image",
          "designedForImage",
          "targetImage",
        ]),
      ) ?? undefined,
    targetItems,
    whyChooseImage:
      resolveImageAsset(
        readString(rawProduct, [
          "why_choose_image",
          "whyChooseImage",
        ]),
      ) ?? undefined,
    whyChooseTitle: readString(rawProduct, [
      "why_choose_title",
      "whyChooseTitle",
    ]),
    whyChooseItems,
  };
}

function extractProductItems(payload: unknown): unknown[] | null {
  if (Array.isArray(payload)) return payload;
  if (!isRecord(payload)) return null;

  const data = payload.data;
  if (Array.isArray(data)) return data;

  if (isRecord(data)) {
    if (Array.isArray(data.data)) return data.data;
    if (Array.isArray(data.products)) return data.products;
    if (Array.isArray(data.items)) return data.items;
  }

  if (Array.isArray(payload.Data)) return payload.Data;
  if (Array.isArray(payload.products)) return payload.products;
  if (Array.isArray(payload.items)) return payload.items;

  return null;
}

function extractMetaRecord(payload: unknown): Record<string, unknown> | undefined {
  if (!isRecord(payload)) return undefined;

  const data = readRecord(payload, "data");
  return (
    readRecord(payload, "meta") ??
    readRecord(payload, "pagination") ??
    (data ? readRecord(data, "meta") : undefined) ??
    (data ? readRecord(data, "pagination") : undefined) ??
    (data ? data : undefined) ??
    data ??
    payload
  );
}

function createMeta(
  query: ProductsQuery,
  products: Product[],
  source: ProductsDataSource,
  payload?: unknown,
): ProductsMeta {
  const meta = extractMetaRecord(payload);
  const total = readNumber(meta, ["total", "Total", "totalItems", "total_items"]) ?? products.length;
  const page =
    readNumber(meta, ["page", "currentPage", "current_page"]) ?? query.page;
  const limit = readNumber(meta, ["limit", "perPage", "per_page"]) ?? query.limit;
  const totalPages =
    readNumber(meta, ["totalPages", "total_pages", "lastPage", "last_page"]) ??
    Math.max(1, Math.ceil(total / limit));

  return {
    total,
    page,
    limit,
    totalPages,
    source,
  };
}

function normalizeProductsPayload(
  payload: unknown,
  query: ProductsQuery,
): ProductsListResponse {
  const rawItems = extractProductItems(payload);
  if (!rawItems) {
    throw new Error("La respuesta del API de productos no contiene una lista.");
  }

  const data = rawItems
    .map((item) => normalizeProduct(item))
    .filter((product): product is Product => product !== null);

  return {
    data,
    meta: createMeta(query, data, "external", payload),
  };
}

function extractProductItem(payload: unknown): unknown | null {
  if (!isRecord(payload)) return null;

  const data = payload.data;
  if (isRecord(data)) {
    if (isRecord(data.product)) return data.product;
    if (isRecord(data.item)) return data.item;
    if (readString(data, ["id", "productId", "product_id", "slug"])) return data;
  }

  if (isRecord(payload.Data)) return payload.Data;
  if (isRecord(payload.product)) return payload.product;
  if (isRecord(payload.item)) return payload.item;
  if (readString(payload, ["id", "productId", "product_id", "slug"])) {
    return payload;
  }

  return null;
}

function extractRelatedProducts(payload: unknown): Product[] {
  if (!isRecord(payload)) return [];

  const data = readRecord(payload, "data");
  const relatedItems =
    (data?.relatedProducts as unknown) ??
    (data?.related_products as unknown) ??
    payload.relatedProducts ??
    payload.related_products ??
    payload.related ??
    (data?.related as unknown);

  if (!Array.isArray(relatedItems)) return [];

  return relatedItems
    .map((item) =>
      normalizeProduct(item, { allowFeaturedImageAsCardImage: false }),
    )
    .filter((product): product is Product => product !== null);
}

function filterMockProducts(query: ProductsQuery) {
  const search = query.search.toLowerCase();
  const selectedCategories = [
    ...query.categories,
    ...getOptionNamesById(query.productTypeIds, FALLBACK_PRODUCT_TYPES),
  ].map(normalizeLookup);

  return PRODUCTS.filter((product) => {
    const matchesSearch =
      !search ||
      product.name.toLowerCase().includes(search) ||
      product.shortDescription.toLowerCase().includes(search);
    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(normalizeLookup(product.category));

    return matchesSearch && matchesCategory;
  });
}

function getMockProducts(query: ProductsQuery): ProductsListResponse {
  const filteredProducts = filterMockProducts(query);
  const startIndex = (query.page - 1) * query.limit;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + query.limit,
  );

  return {
    data: paginatedProducts,
    meta: createMeta(query, paginatedProducts, "mock", {
      meta: {
        total: filteredProducts.length,
        page: query.page,
        limit: query.limit,
        totalPages: Math.max(1, Math.ceil(filteredProducts.length / query.limit)),
      },
    }),
  };
}

function resolveApiUrl(urlValue: string) {
  if (!urlValue) return null;

  try {
    return new URL(urlValue);
  } catch {
    const baseUrl = env.API_URL.endsWith("/") ? env.API_URL : `${env.API_URL}/`;
    return new URL(urlValue.replace(/^\//, ""), baseUrl);
  }
}

function getProductsEndpoint() {
  return resolveApiUrl(PRODUCTS_ENDPOINT);
}

function appendPathSegment(url: URL, segment: string) {
  const nextUrl = new URL(url.toString());
  nextUrl.pathname = `${nextUrl.pathname.replace(/\/$/, "")}/${segment.replace(/^\//, "")}`;
  nextUrl.search = "";
  return nextUrl;
}

function createProductsSubresourceUrl(segment: string) {
  const url = getProductsEndpoint();
  return url ? appendPathSegment(url, segment) : null;
}

function createProductDetailUrl(productId: string) {
  const url = getProductsEndpoint();
  if (!url) return null;

  url.pathname = `${url.pathname.replace(/\/$/, "")}/${encodeURIComponent(productId)}`;
  url.search = "";

  return url;
}

function createProductsUrl(query: ProductsQuery) {
  const url = getProductsEndpoint();
  if (!url) return null;
  const productTypeIds =
    query.productTypeIds.length > 0
      ? query.productTypeIds
      : getOptionIdsByName(query.categories, FALLBACK_PRODUCT_TYPES);

  url.searchParams.set("page", String(query.page));
  url.searchParams.set("per_page", String(query.limit));
  if (query.search) url.searchParams.set("name", query.search);
  productTypeIds.forEach((id) => url.searchParams.append("product_type_ids[]", id));
  query.consumptionTypeIds.forEach((id) => url.searchParams.append("consumption_type_ids[]", id));
  query.focusIds.forEach((id) => url.searchParams.append("focus_ids[]", id));

  return url;
}

function createProductsHeaders(): HeadersInit {
  const headers: HeadersInit = {
    Accept: "application/json",
  };

  if (env.PRODUCTS_API_TOKEN) {
    headers.Authorization = `Bearer ${env.PRODUCTS_API_TOKEN}`;
  }

  if (env.PRODUCTS_API_KEY) {
    headers[env.PRODUCTS_API_KEY_HEADER] = env.PRODUCTS_API_KEY;
  }

  return headers;
}

function extractFilterItems(payload: unknown): unknown[] {
  if (Array.isArray(payload)) return payload;
  if (!isRecord(payload)) return [];

  const data = payload.data;
  if (Array.isArray(data)) return data;
  if (isRecord(data)) {
    if (Array.isArray(data.items)) return data.items;
    if (Array.isArray(data.data)) return data.data;
  }
  if (Array.isArray(payload.items)) return payload.items;

  return [];
}

function normalizeFilterOption(rawOption: unknown): ProductFilterOption | null {
  if (!isRecord(rawOption)) return null;

  const id = readString(rawOption, ["id", "value", "slug"]);
  const name = readString(rawOption, ["name", "nombre", "label", "title"]);
  if (!id || !name) return null;

  const imageSrc = resolveImageAsset(
    readString(rawOption, ["image", "imageSrc", "image_src", "icon"]),
  );

  return {
    id,
    name,
    ...(imageSrc ? { imageSrc } : {}),
    ...(readBoolean(rawOption, ["featured"]) !== undefined
      ? { featured: readBoolean(rawOption, ["featured"]) }
      : {}),
    ...(readNumber(rawOption, ["order", "sort"]) !== undefined
      ? { order: readNumber(rawOption, ["order", "sort"]) }
      : {}),
  };
}

function toProductCategoryLink(
  option: ProductFilterOption & { imageSrc: string },
): ProductCategoryLink {
  const params = new URLSearchParams({ focusId: option.id });

  return {
    id: option.id,
    name: option.name,
    imageSrc: option.imageSrc,
    href: `/products?${params.toString()}`,
  };
}

function sortFilterOptions(options: ProductFilterOption[]) {
  return [...options].sort((a, b) => {
    const orderA = a.order ?? Number.MAX_SAFE_INTEGER;
    const orderB = b.order ?? Number.MAX_SAFE_INTEGER;
    if (orderA !== orderB) return orderA - orderB;
    return a.name.localeCompare(b.name, "es");
  });
}

function resolveFilterOptions(
  options: ProductFilterOption[] | null,
  fallback: ProductFilterOption[],
) {
  if (options && options.length > 0) return options;
  return canUseProductsMockFallback() ? fallback : [];
}

async function getExternalFilterOptions(segment: string) {
  const url = createProductsSubresourceUrl(segment);
  if (!url) return null;

  const response = await fetch(url, {
    headers: createProductsHeaders(),
    next: {
      tags: [PRODUCTS_TAG],
      revalidate: CMS_REVALIDATE_SECONDS,
    },
  });

  if (!response.ok) {
    throw new Error(`Product filters API responded with HTTP ${response.status}`);
  }

  return sortFilterOptions(
    extractFilterItems(await response.json())
      .map(normalizeFilterOption)
      .filter((option): option is ProductFilterOption => option !== null),
  );
}

export async function getProductFilters(): Promise<ProductsFiltersResponse> {
  try {
    const [productTypes, consumptionTypes, focuses] = await Promise.all([
      getExternalFilterOptions("types"),
      getExternalFilterOptions("consumption-types"),
      getExternalFilterOptions("focuses"),
    ]);

    return {
      productTypes: resolveFilterOptions(productTypes, FALLBACK_PRODUCT_TYPES),
      consumptionTypes: resolveFilterOptions(consumptionTypes, FALLBACK_CONSUMPTION_TYPES),
      focuses: resolveFilterOptions(focuses, FALLBACK_FOCUSES),
      source: "external",
    };
  } catch (error) {
    logError("product_filters_api_failed", error);

    if (!canUseProductsMockFallback()) {
      return {
        productTypes: [],
        consumptionTypes: [],
        focuses: [],
        source: "unavailable",
      };
    }

    return {
      productTypes: FALLBACK_PRODUCT_TYPES,
      consumptionTypes: FALLBACK_CONSUMPTION_TYPES,
      focuses: FALLBACK_FOCUSES,
      source: "mock",
    };
  }
}

async function getExternalProducts(
  query: ProductsQuery,
): Promise<ProductsListResponse> {
  const url = createProductsUrl(query);
  if (!url) {
    throw new Error("Products endpoint is not configured");
  }

  const response = await fetch(url, {
    headers: createProductsHeaders(),
    next: {
      tags: [PRODUCTS_TAG],
      revalidate: CMS_REVALIDATE_SECONDS,
    },
  });

  if (!response.ok) {
    throw new Error(`Products API responded with HTTP ${response.status}`);
  }

  return normalizeProductsPayload(await response.json(), query);
}

function extractSuggestedFocuses(payload: unknown): ProductCategoryLink[] {
  if (!isRecord(payload)) return [];

  const data = readRecord(payload, "data");
  const product = data
    ? readRecord(data, "product") ?? readRecord(data, "item")
    : undefined;
  const suggestedFocuses =
    (data?.suggested_focuses as unknown) ??
    (data?.suggestedFocuses as unknown) ??
    (product?.suggested_focuses as unknown) ??
    (product?.suggestedFocuses as unknown) ??
    payload.suggested_focuses ??
    payload.suggestedFocuses;

  if (!Array.isArray(suggestedFocuses)) return [];

  const categoryLinks = suggestedFocuses
    .map(normalizeFilterOption)
    .filter(
      (focus): focus is ProductFilterOption & { imageSrc: string } =>
        Boolean(focus?.imageSrc),
    )
    .map(toProductCategoryLink);

  return categoryLinks.filter(
    (focus, index, items) =>
      items.findIndex((item) => item.id === focus.id) === index,
  );
}

async function getExternalProductDetail(
  productId: string,
): Promise<ProductDetailPageData> {
  const url = createProductDetailUrl(productId);
  if (!url) {
    throw new Error("Product detail endpoint is not configured");
  }

  const response = await fetch(url, {
    headers: createProductsHeaders(),
    next: {
      tags: [PRODUCTS_TAG],
      revalidate: CMS_REVALIDATE_SECONDS,
    },
  });

  if (response.status === 404) {
    throw new ProductDetailNotFoundError("Product detail responded with HTTP 404");
  }

  if (!response.ok) {
    throw new Error(`Product detail responded with HTTP ${response.status}`);
  }

  const payload = await response.json();
  const product = normalizeProduct(extractProductItem(payload), {
    allowFeaturedImageAsCardImage: false,
  });

  if (!product) {
    throw new Error("La respuesta del API de detalle no contiene producto valido.");
  }

  return {
    product,
    relatedProducts: extractRelatedProducts(payload),
    suggestedFocuses: extractSuggestedFocuses(payload),
  };
}

function getMockProductDetail(productId: string): Product | null {
  return PRODUCTS.find((product) => product.id === productId) ?? null;
}

function getMockRelatedProducts(product: Product, limit = 9): Product[] {
  const sameConsumptionType = PRODUCTS.filter(
    (item) =>
      item.id !== product.id && item.consumptionType === product.consumptionType,
  );
  const sameCategory = PRODUCTS.filter(
    (item) =>
      item.id !== product.id &&
      item.category === product.category &&
      item.consumptionType !== product.consumptionType,
  );
  const fallback = PRODUCTS.filter((item) => item.id !== product.id);

  return [...sameConsumptionType, ...sameCategory, ...fallback]
    .filter(
      (item, index, items) =>
        items.findIndex((candidate) => candidate.id === item.id) === index,
    )
    .slice(0, limit);
}

export async function getProducts(
  query: ProductsQuery,
): Promise<ProductsListResponse> {
  try {
    return await getExternalProducts(query);
  } catch (error) {
    logError("products_api_failed", error, {
      page: query.page,
      limit: query.limit,
      categoryCount: query.categories.length,
      hasSearch: Boolean(query.search),
    });

    if (!canUseProductsMockFallback()) {
      return {
        data: [],
        meta: {
          total: 0,
          page: query.page,
          limit: query.limit,
          totalPages: 1,
          source: "unavailable",
        },
        error: {
          code: "PRODUCTS_API_UNAVAILABLE",
          message:
            "No pudimos cargar el catalogo desde el CMS. Intenta nuevamente.",
        },
      };
    }

    return {
      ...getMockProducts(query),
      error: {
        code: "PRODUCTS_API_UNAVAILABLE",
        message:
          "No pudimos actualizar el catalogo externo. Mostramos informacion disponible.",
      },
    };
  }
}

export async function getProductDetailPageData(
  productId: string,
  relatedLimit = 9,
): Promise<ProductDetailPageData | null> {
  const normalizedProductId = productId.trim();
  if (!normalizedProductId) return null;

  try {
    const detail = await getExternalProductDetail(normalizedProductId);
    const relatedProducts =
      detail.relatedProducts
        .filter((item) => item.id !== detail.product.id)
        .slice(0, relatedLimit);

    return {
      product: detail.product,
      relatedProducts,
      suggestedFocuses: detail.suggestedFocuses,
    };
  } catch (error) {
    if (error instanceof ProductDetailNotFoundError) return null;

    logError("product_detail_api_failed", error, {
      productId: normalizedProductId,
    });
    if (!canUseProductsMockFallback()) return null;

    const product = getMockProductDetail(normalizedProductId);
    if (!product) return null;

    return {
      product,
      relatedProducts: getMockRelatedProducts(product, relatedLimit),
      suggestedFocuses: [],
    };
  }
}

export async function getProductDetail(productId: string): Promise<Product | null> {
  return (await getProductDetailPageData(productId))?.product ?? null;
}

export async function getProductSitemapIds(): Promise<string[]> {
  const baseQuery: ProductsQuery = {
    page: 1,
    limit: MAX_LIMIT,
    productTypeIds: [],
    consumptionTypeIds: [],
    focusIds: [],
    categories: [],
    search: "",
  };
  const firstPage = await getProducts(baseQuery);
  const remainingPages = Array.from(
    { length: Math.max(0, firstPage.meta.totalPages - 1) },
    (_, index) => index + 2,
  );
  const remainingResponses = await Promise.all(
    remainingPages.map((page) => getProducts({ ...baseQuery, page })),
  );

  return [
    ...firstPage.data,
    ...remainingResponses.flatMap((response) => response.data),
  ].map((product) => product.id);
}

export async function getProductFocusCategories(): Promise<ProductCategoryLink[]> {
  try {
    const focuses = await getExternalFilterOptions("focuses");

    return (focuses ?? [])
      .filter((focus): focus is ProductFilterOption & { imageSrc: string } =>
        Boolean(focus.imageSrc),
      )
      .map(toProductCategoryLink);
  } catch (error) {
    logError("product_focus_categories_api_failed", error);
    return [];
  }
}
