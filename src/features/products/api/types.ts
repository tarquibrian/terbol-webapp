import type { Product } from "../data/products";

export interface ProductsQuery {
  page: number;
  limit: number;
  categories: string[];
  consumptionTypes: string[];
  search: string;
}

export type ProductsDataSource = "external" | "mock";

export interface ProductsMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  source: ProductsDataSource;
}

export interface ProductsError {
  code:
    | "PRODUCTS_API_UNAVAILABLE"
    | "PRODUCTS_API_INVALID_RESPONSE"
    | "PRODUCT_NOT_FOUND";
  message: string;
}

export interface ProductsListResponse {
  data: Product[];
  meta: ProductsMeta;
  error?: ProductsError;
}
