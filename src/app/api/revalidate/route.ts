import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

const VALID_TAGS = new Set([
  "home",
  "footer",
  "about",
  "success-plan",
  "learn",
  "help",
  "promoter",
  "science",
  "products-list",
]);

const VALID_DYNAMIC_TAG_PATTERNS = [/^blog-[1-9]\d*$/, /^product-[1-9]\d*$/];

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
 *   { "tag": ["blog-12", "learn"] }
 */
export async function POST(request: NextRequest) {
  try {
    const secret = request.headers.get("x-revalidate-secret");

    // 1. Proteger el endpoint (definir REVALIDATE_SECRET en .env)
    const validSecret = process.env.REVALIDATE_SECRET;
    if (validSecret && secret !== validSecret) {
      return NextResponse.json({ success: false, message: "Token inválido" }, { status: 401 });
    }

    const body = await request.json();
    const tags = getRevalidationTags(body);

    if (tags.length === 0) {
      return NextResponse.json(
        { success: false, message: "Falta el campo 'tag' en el body" },
        { status: 400 }
      );
    }

    const invalidTags = tags.filter((tag) => !isValidRevalidationTag(tag));

    if (invalidTags.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: `Tags no permitidos: ${invalidTags.join(", ")}`,
          data: {
            invalidTags,
            allowedTags: [...VALID_TAGS],
            allowedPatterns: ["blog-{id}", "product-{id}"],
          },
        },
        { status: 400 }
      );
    }

    // 2. Limpiar la caché en Next.js para la etiqueta específica
    tags.forEach((tag) => revalidateTag(tag, "max"));

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
    console.error("[Revalidate API Error]:", error);
    return NextResponse.json(
      { success: false, message: "Error interno del servidor al revalidar" },
      { status: 500 }
    );
  }
}
