import * as React from "react";
import { getProducts } from "../../api/products-api";
import { ProductCard } from "../ProductCard";
import { Pagination } from "@/components/ui/Pagination";

export async function ProductGrid({ page = 1 }: { page?: number }) {
  const { data: products, meta } = await getProducts({
    page,
    limit: 9,
    categories: [],
    consumptionTypes: [],
    search: "",
  });

  return (
    <div className="flex-1 w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {products.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </div>
      
      <Pagination currentPage={page} totalPages={meta.totalPages} />
    </div>
  );
}
