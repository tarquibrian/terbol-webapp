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

function isValidRevalidationTag(tag: string): boolean {
  return (
    VALID_TAGS.has(tag) ||
    VALID_DYNAMIC_TAG_PATTERNS.some((pattern) => pattern.test(tag))
  );
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
 */
export async function POST(request: NextRequest) {
  try {
    const secret = request.headers.get("x-revalidate-secret");

    // 1. Proteger el endpoint (definir REVALIDATE_SECRET en .env)
    const validSecret = process.env.REVALIDATE_SECRET;
    if (validSecret && secret !== validSecret) {
      return NextResponse.json({ message: "Token inválido" }, { status: 401 });
    }

    const body = await request.json();
    const tag = typeof body?.tag === "string" ? body.tag.trim() : "";

    if (!tag) {
      return NextResponse.json(
        { message: "Falta el campo 'tag' en el body" },
        { status: 400 }
      );
    }

    if (!isValidRevalidationTag(tag)) {
      return NextResponse.json(
        {
          message: `Tag no permitido: ${tag}`,
          allowedTags: [...VALID_TAGS],
          allowedPatterns: ["blog-{id}", "product-{id}"],
        },
        { status: 400 }
      );
    }

    // 2. Limpiar la caché en Next.js para la etiqueta específica
    revalidateTag(tag, "max");

    return NextResponse.json({
      revalidated: true,
      message: `Tag '${tag}' marcado para revalidación.`,
      tag,
      now: Date.now(),
    });
  } catch (error) {
    console.error("[Revalidate API Error]:", error);
    return NextResponse.json(
      { message: "Error interno del servidor al revalidar" },
      { status: 500 }
    );
  }
}
