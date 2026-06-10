import type { Product } from "../data/products";

export interface ProductsQuery {
  page: number;
  limit: number;
  productTypeIds: string[];
  consumptionTypeIds: string[];
  focusIds: string[];
  categories: string[];
  search: string;
}

export type ProductsDataSource = "external" | "mock" | "unavailable";

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

export interface ProductFilterOption {
  id: string;
  name: string;
  imageSrc?: string;
  featured?: boolean;
  order?: number;
}

export interface ProductsFiltersResponse {
  productTypes: ProductFilterOption[];
  consumptionTypes: ProductFilterOption[];
  focuses: ProductFilterOption[];
  source: ProductsDataSource;
}

export interface ProductCategoryLink {
  id: string;
  name: string;
  imageSrc: string;
  href: string;
}
