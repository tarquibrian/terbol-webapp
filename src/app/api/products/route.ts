import { NextResponse } from "next/server";
import {
  getProducts,
  parseProductsQuery,
} from "@/features/products/api/products-api";
import {
  getDurationMs,
  getRequestLogContext,
  logError,
  logInfo,
} from "@/lib/logger";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const startedAt = Date.now();
  const logContext = getRequestLogContext(request, "/api/products");

  try {
    const { searchParams } = new URL(request.url);
    const query = parseProductsQuery(searchParams);
    const result = await getProducts(query);

    logInfo("products_route_succeeded", {
      ...logContext,
      page: result.meta.page,
      limit: result.meta.limit,
      total: result.meta.total,
      resultCount: result.data.length,
      source: result.meta.source,
      hasFallbackError: Boolean(result.error),
      productTypeIdCount: query.productTypeIds.length,
      focusIdCount: query.focusIds.length,
      durationMs: getDurationMs(startedAt),
    });

    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    logError("products_route_failed", error, {
      ...logContext,
      durationMs: getDurationMs(startedAt),
    });

    return NextResponse.json(
      {
        data: [],
        meta: {
          total: 0,
          page: 1,
          limit: 9,
          totalPages: 1,
          source: "unavailable",
        },
        error: {
          code: "PRODUCTS_API_UNAVAILABLE",
          message: "No pudimos cargar los productos. Intenta nuevamente.",
        },
      },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  }
}
