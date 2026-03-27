import { NextResponse } from 'next/server';
import { PRODUCTS } from '@/features/products/data/products';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "9");

  // Simulated delay to mimic real network request
  await new Promise(resolve => setTimeout(resolve, 900));

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedProducts = PRODUCTS.slice(startIndex, endIndex);

  return NextResponse.json({
    data: paginatedProducts,
    meta: {
      total: PRODUCTS.length,
      page,
      limit,
      totalPages: Math.ceil(PRODUCTS.length / limit)
    }
  });
}
