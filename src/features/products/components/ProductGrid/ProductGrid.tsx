import * as React from "react";
import { getPaginatedProducts } from "../../data/products";
import { ProductCard } from "../ProductCard";
import { Pagination } from "@/components/ui/Pagination";

export async function ProductGrid({ page = 1 }: { page?: number }) {
  const { data: products, meta } = await getPaginatedProducts(page, 9);

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
