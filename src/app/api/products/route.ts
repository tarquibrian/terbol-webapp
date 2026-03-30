import { NextResponse } from 'next/server';
import { PRODUCTS } from '@/features/products/data/products';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "9");
  const categories = searchParams.getAll("category");
  const consumptionTypes = searchParams.getAll("consumptionType");
  const search = searchParams.get("search");

  // Simulated delay to mimic real network request
  await new Promise(resolve => setTimeout(resolve, 900));

  let filteredProducts = PRODUCTS;

  if (search) {
    const searchLower = search.toLowerCase();
    filteredProducts = filteredProducts.filter(p => p.name.toLowerCase().includes(searchLower));
  }

  if (categories.length > 0) {
    filteredProducts = filteredProducts.filter(p => categories.includes(p.category));
  }
  if (consumptionTypes.length > 0) {
    filteredProducts = filteredProducts.filter(p => consumptionTypes.includes(p.consumptionType));
  }

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  return NextResponse.json({
    data: paginatedProducts,
    meta: {
      total: filteredProducts.length,
      page,
      limit,
      totalPages: Math.ceil(filteredProducts.length / limit)
    }
  });
}
