import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { serverEnv } from "@/config/env";
import {
  getDurationMs,
  getRequestLogContext,
  logError,
  logInfo,
  logWarn,
} from "@/lib/logger";

const VALID_TAGS = new Set([
  "home",
  "footer",
  "advisor-registration",
  "about",
  "success-plan",
  "learn",
  "help",
  "promoter",
  "science",
  // Tag único para todo el contenido de productos (lista, filtros y detalle).
  "products",
  // Tag único para el detalle de artículos del blog.
  "blog",
  "sitemap",
]);

const VALID_DYNAMIC_TAG_PATTERNS: RegExp[] = [];

interface RevalidateRequestBody {
  tag?: unknown;
}

function isValidRevalidationTag(tag: string): boolean {
  return (
    VALID_TAGS.has(tag) ||
    VALID_DYNAMIC_TAG_PATTERNS.some((pattern) => pattern.test(tag))
  );
}

function getRevalidationTags(body: unknown): string[] {
  if (!body || typeof body !== "object") {
    return [];
  }

  const { tag } = body as RevalidateRequestBody;
  const requestedTags =
    typeof tag === "string"
      ? [tag]
      : Array.isArray(tag)
        ? tag.filter((item) => typeof item === "string")
        : [];

  return [...new Set(requestedTags.map((item) => item.trim()).filter(Boolean))];
}

/**
 * Webhook para revalidar la caché ISR (Incremental Static Regeneration).
 * El CMS de Laravel debe llamar a este endpoint POST cuando se actualiza contenido.
 *
 * @example
 * POST /api/revalidate
 * Headers:
 *   x-revalidate-secret: TU_TOKEN_SECRETO
 * Body:
 *   { "tag": "home" }
 *   { "tag": ["products", "blog"] }
 */
export async function POST(request: NextRequest) {
  const startedAt = Date.now();
  const logContext = getRequestLogContext(request, "/api/revalidate");

  try {
    const secret = request.headers.get("x-revalidate-secret");

    // 1. Proteger el endpoint (definir REVALIDATE_SECRET en .env)
    const validSecret = serverEnv.REVALIDATE_SECRET;
    if (!validSecret) {
      logError("revalidate_missing_secret", undefined, {
        ...logContext,
        durationMs: getDurationMs(startedAt),
      });
      return NextResponse.json(
        { success: false, message: "Revalidación no configurada" },
        { status: 500 }
      );
    }

    if (secret !== validSecret) {
      logWarn("revalidate_invalid_token", {
        ...logContext,
        durationMs: getDurationMs(startedAt),
      });
      return NextResponse.json({ success: false, message: "Token inválido" }, { status: 401 });
    }

    const body = await request.json();
    const tags = getRevalidationTags(body);

    if (tags.length === 0) {
      logWarn("revalidate_missing_tags", {
        ...logContext,
        durationMs: getDurationMs(startedAt),
      });
      return NextResponse.json(
        { success: false, message: "Falta el campo 'tag' en el body" },
        { status: 400 }
      );
    }

    const invalidTags = tags.filter((tag) => !isValidRevalidationTag(tag));

    if (invalidTags.length > 0) {
      logWarn("revalidate_invalid_tags", {
        ...logContext,
        invalidTags,
        durationMs: getDurationMs(startedAt),
      });
      return NextResponse.json(
        {
          success: false,
          message: `Tags no permitidos: ${invalidTags.join(", ")}`,
          data: {
            invalidTags,
            allowedTags: [...VALID_TAGS],
          },
        },
        { status: 400 }
      );
    }

    // 2. Limpiar la caché en Next.js para la etiqueta específica
    tags.forEach((tag) => revalidateTag(tag, "max"));
    logInfo("revalidate_succeeded", {
      ...logContext,
      tags,
      tagCount: tags.length,
      durationMs: getDurationMs(startedAt),
    });

    return NextResponse.json({
      success: true,
      message:
        tags.length === 1
          ? `Tag '${tags[0]}' marcado para revalidación.`
          : "Tags marcados para revalidación.",
      data: {
        tags,
        now: Date.now(),
      },
    });
  } catch (error) {
    logError("revalidate_failed", error, {
      ...logContext,
      durationMs: getDurationMs(startedAt),
    });
    return NextResponse.json(
      { success: false, message: "Error interno del servidor al revalidar" },
      { status: 500 }
    );
  }
}
