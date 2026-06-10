import { NextResponse } from "next/server";
import { getProductFilters } from "@/features/products/api/products-api";
import {
  getDurationMs,
  getRequestLogContext,
  logError,
  logInfo,
} from "@/lib/logger";

export async function GET(request: Request) {
  const startedAt = Date.now();
  const logContext = getRequestLogContext(request, "/api/products/filters");

  try {
    const result = await getProductFilters();

    logInfo("product_filters_route_succeeded", {
      ...logContext,
      productTypeCount: result.productTypes.length,
      consumptionTypeCount: result.consumptionTypes.length,
      focusCount: result.focuses.length,
      source: result.source,
      durationMs: getDurationMs(startedAt),
    });

    return NextResponse.json(result);
  } catch (error) {
    logError("product_filters_route_failed", error, {
      ...logContext,
      durationMs: getDurationMs(startedAt),
    });

    return NextResponse.json(
      {
        productTypes: [],
        consumptionTypes: [],
        focuses: [],
        source: "unavailable",
      },
      { status: 500 },
    );
  }
}
