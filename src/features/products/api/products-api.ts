import { env } from "@/config/env";
import { logError, logWarn } from "@/lib/logger";
import { PRODUCTS, type Product } from "../data/products";
import type {
  ProductsDataSource,
  ProductsListResponse,
  ProductsMeta,
  ProductsQuery,
} from "./types";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 9;
const MAX_LIMIT = 60;

class ProductDetailNotFoundError extends Error {}

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
    categories: uniqueNonEmpty(searchParams.getAll("category")),
    consumptionTypes: uniqueNonEmpty(searchParams.getAll("consumptionType")),
    search: searchParams.get("search")?.trim() ?? "",
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readRecord(
  record: Record<string, unknown>,
  key: string,
): Record<string, unknown> | undefined {
  const value = record[key];
  return isRecord(value) ? value : undefined;
}

function readString(
  record: Record<string, unknown>,
  keys: string[],
): string | undefined {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) return value.trim();
    if (typeof value === "number" && Number.isFinite(value)) return String(value);
  }

  return undefined;
}

function readBoolean(
  record: Record<string, unknown>,
  keys: string[],
): boolean | undefined {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "boolean") return value;
    if (typeof value === "string") {
      if (value === "true" || value === "1") return true;
      if (value === "false" || value === "0") return false;
    }
  }

  return undefined;
}

function readNumber(
  record: Record<string, unknown> | undefined,
  keys: string[],
): number | undefined {
  if (!record) return undefined;

  for (const key of keys) {
    const value = record[key];
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string") {
      const normalized = value.replace(",", ".").replace(/[^\d.-]/g, "");
      const parsed = Number(normalized);
      if (Number.isFinite(parsed)) return parsed;
    }
  }

  return undefined;
}

function readStringArray(
  record: Record<string, unknown>,
  keys: string[],
): string[] | undefined {
  for (const key of keys) {
    const value = record[key];
    if (Array.isArray(value)) {
      const items = value.filter(
        (item): item is string => typeof item === "string" && item.trim() !== "",
      );
      if (items.length > 0) return items;
    }
  }

  return undefined;
}

function readNestedString(
  record: Record<string, unknown>,
  key: string,
  nestedKeys: string[],
) {
  const nestedRecord = readRecord(record, key);
  return nestedRecord ? readString(nestedRecord, nestedKeys) : undefined;
}

function normalizeProduct(rawProduct: unknown): Product | null {
  if (!isRecord(rawProduct)) return null;

  const id = readString(rawProduct, ["id", "productId", "product_id", "slug"]);
  const name = readString(rawProduct, ["name", "title", "productName", "product_name"]);

  if (!id || !name) return null;

  const shortDescription =
    readString(rawProduct, [
      "shortDescription",
      "short_description",
      "summary",
      "excerpt",
    ]) ?? "";
  const description =
    readString(rawProduct, ["description", "body", "content"]) ?? shortDescription;
  const category =
    readString(rawProduct, ["category", "categoryName", "category_name"]) ??
    readNestedString(rawProduct, "category", ["name", "title"]) ??
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
  const cardImage =
    readString(rawProduct, [
      "cardImage",
      "card_image",
      "image",
      "imageUrl",
      "image_url",
      "thumbnail",
      "thumbnail_url",
    ]) ??
    readNestedString(rawProduct, "image", ["url", "src", "path"]) ??
    readNestedString(rawProduct, "media", ["url", "src", "path"]) ??
    "/product/image6.png";

  return {
    id,
    name,
    shortName: readString(rawProduct, ["shortName", "short_name"]),
    price: readNumber(rawProduct, ["price", "amount", "cost"]) ?? 0,
    stockStatus: readString(rawProduct, [
      "stockStatus",
      "stock_status",
      "availability",
    ]),
    shortDescription,
    description,
    detailsSubtitle: readString(rawProduct, [
      "detailsSubtitle",
      "details_subtitle",
      "subtitle",
    ]),
    detailsList: readStringArray(rawProduct, ["detailsList", "details_list"]),
    usageInstructions: readString(rawProduct, [
      "usageInstructions",
      "usage_instructions",
      "instructions",
    ]),
    benefits: readStringArray(rawProduct, ["benefits"]),
    tags: readStringArray(rawProduct, ["tags"]),
    featuredCoverImage: readString(rawProduct, [
      "featuredCoverImage",
      "featured_cover_image",
    ]),
    featuredBgImage: readString(rawProduct, [
      "featuredBgImage",
      "featured_bg_image",
    ]),
    cardImage,
    extraImages: readStringArray(rawProduct, [
      "extraImages",
      "extra_images",
      "gallery",
    ]),
    category,
    consumptionType,
    featuredProduct: readBoolean(rawProduct, [
      "featuredProduct",
      "featured_product",
      "featured",
    ]),
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
  const total = readNumber(meta, ["total", "totalItems", "total_items"]) ?? products.length;
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
    .map(normalizeProduct)
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
    payload.related;

  if (!Array.isArray(relatedItems)) return [];

  return relatedItems
    .map(normalizeProduct)
    .filter((product): product is Product => product !== null);
}

function filterMockProducts(query: ProductsQuery) {
  const search = query.search.toLowerCase();

  return PRODUCTS.filter((product) => {
    const matchesSearch =
      !search ||
      product.name.toLowerCase().includes(search) ||
      product.shortDescription.toLowerCase().includes(search);
    const matchesCategory =
      query.categories.length === 0 || query.categories.includes(product.category);
    const matchesConsumptionType =
      query.consumptionTypes.length === 0 ||
      query.consumptionTypes.includes(product.consumptionType);

    return matchesSearch && matchesCategory && matchesConsumptionType;
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
  return resolveApiUrl(env.PRODUCTS_API_URL);
}

function createProductDetailUrl(productId: string) {
  const detailEndpoint = env.PRODUCTS_DETAIL_API_URL;
  const listEndpoint = env.PRODUCTS_API_URL;

  if (detailEndpoint) {
    const encodedId = encodeURIComponent(productId);
    const nextEndpoint = detailEndpoint
      .replace("{id}", encodedId)
      .replace(":id", encodedId);

    return resolveApiUrl(
      nextEndpoint === detailEndpoint
        ? `${detailEndpoint.replace(/\/$/, "")}/${encodedId}`
        : nextEndpoint,
    );
  }

  if (!listEndpoint) return null;

  const url = resolveApiUrl(listEndpoint);
  if (!url) return null;

  url.pathname = `${url.pathname.replace(/\/$/, "")}/${encodeURIComponent(productId)}`;
  url.search = "";

  return url;
}

function createProductsUrl(query: ProductsQuery) {
  const url = getProductsEndpoint();
  if (!url) return null;

  url.searchParams.set("page", String(query.page));
  url.searchParams.set("limit", String(query.limit));
  query.categories.forEach((category) => url.searchParams.append("category", category));
  query.consumptionTypes.forEach((type) =>
    url.searchParams.append("consumptionType", type),
  );
  if (query.search) url.searchParams.set("search", query.search);

  return url;
}

function createProductsHeaders(): HeadersInit {
  const headers: HeadersInit = {
    Accept: "application/json",
  };

  if (env.PRODUCTS_API_TOKEN) {
    headers.Authorization = `Bearer ${env.PRODUCTS_API_TOKEN}`;
  }

  return headers;
}

async function getExternalProducts(
  query: ProductsQuery,
): Promise<ProductsListResponse> {
  const url = createProductsUrl(query);
  if (!url) {
    return getMockProducts(query);
  }

  const response = await fetch(url, {
    headers: createProductsHeaders(),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Products API responded with HTTP ${response.status}`);
  }

  return normalizeProductsPayload(await response.json(), query);
}

async function getExternalProductDetail(
  productId: string,
): Promise<{ product: Product; relatedProducts: Product[] }> {
  const url = createProductDetailUrl(productId);
  if (!url) {
    const mockProduct = getMockProductDetail(productId);
    if (!mockProduct) throw new Error("Product detail endpoint is not configured");
    return {
      product: mockProduct,
      relatedProducts: getMockRelatedProducts(mockProduct),
    };
  }

  const response = await fetch(url, {
    headers: createProductsHeaders(),
    cache: "no-store",
  });

  if (response.status === 404) {
    throw new ProductDetailNotFoundError("Product detail responded with HTTP 404");
  }

  if (!response.ok) {
    throw new Error(`Product detail responded with HTTP ${response.status}`);
  }

  const payload = await response.json();
  const product = normalizeProduct(extractProductItem(payload));

  if (!product) {
    throw new Error("La respuesta del API de detalle no contiene producto valido.");
  }

  return {
    product,
    relatedProducts: extractRelatedProducts(payload),
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
  if (!env.PRODUCTS_API_URL) return getMockProducts(query);

  try {
    return await getExternalProducts(query);
  } catch (error) {
    logError("products_api_failed", error, {
      page: query.page,
      limit: query.limit,
      categoryCount: query.categories.length,
      consumptionTypeCount: query.consumptionTypes.length,
      hasSearch: Boolean(query.search),
    });

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

async function getCatalogRelatedProducts(
  product: Product,
  limit: number,
): Promise<Product[]> {
  const relatedResponse = await getProducts({
    page: 1,
    limit: limit + 1,
    categories: [],
    consumptionTypes: [product.consumptionType],
    search: "",
  });

  const relatedProducts = relatedResponse.data.filter((item) => item.id !== product.id);
  return relatedProducts.length > 0
    ? relatedProducts.slice(0, limit)
    : getMockRelatedProducts(product, limit);
}

export async function getProductDetailPageData(
  productId: string,
  relatedLimit = 9,
): Promise<{ product: Product; relatedProducts: Product[] } | null> {
  const normalizedProductId = productId.trim();
  if (!normalizedProductId) return null;

  if (!env.PRODUCTS_DETAIL_API_URL && !env.PRODUCTS_API_URL) {
    const product = getMockProductDetail(normalizedProductId);
    if (!product) return null;

    return {
      product,
      relatedProducts: getMockRelatedProducts(product, relatedLimit),
    };
  }

  try {
    const detail = await getExternalProductDetail(normalizedProductId);
    const relatedProducts =
      detail.relatedProducts.length > 0
        ? detail.relatedProducts
            .filter((item) => item.id !== detail.product.id)
            .slice(0, relatedLimit)
        : await getCatalogRelatedProducts(detail.product, relatedLimit);

    return {
      product: detail.product,
      relatedProducts,
    };
  } catch (error) {
    if (error instanceof ProductDetailNotFoundError) return null;

    logError("product_detail_api_failed", error, {
      productId: normalizedProductId,
    });
    const product = getMockProductDetail(normalizedProductId);
    if (!product) return null;

    return {
      product,
      relatedProducts: getMockRelatedProducts(product, relatedLimit),
    };
  }
}

export async function getProductDetail(productId: string): Promise<Product | null> {
  return (await getProductDetailPageData(productId))?.product ?? null;
}

export async function getRelatedProducts(
  product: Product,
  limit = 9,
): Promise<Product[]> {
  if (!env.PRODUCTS_DETAIL_API_URL && !env.PRODUCTS_API_URL) {
    return getMockRelatedProducts(product, limit);
  }

  try {
    const detail = await getExternalProductDetail(product.id);
    if (detail.relatedProducts.length > 0) {
      return detail.relatedProducts
        .filter((item) => item.id !== product.id)
        .slice(0, limit);
    }
  } catch {
    logWarn("related_products_detail_fetch_failed", {
      productId: product.id,
    });
  }

  return getCatalogRelatedProducts(product, limit);
}
