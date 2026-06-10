import type { ProductCategoryLink } from "@/features/products/api/types";
import type { Product } from "@/features/products/data/products";
import { resolveImageAsset } from "@/lib/image-assets";
import { coerceString, isRecord, readNumber, readString } from "@/lib/safe-read";

export interface HomeFeaturedFocus {
  [key: string]: unknown;
  id?: unknown;
  name?: unknown;
  nombre?: unknown;
  image?: unknown;
  imageSrc?: unknown;
  image_src?: unknown;
}

export interface HomeFeaturedProduct {
  [key: string]: unknown;
  id?: unknown;
  productId?: unknown;
  product_id?: unknown;
  slug?: unknown;
  name?: unknown;
  nombre?: unknown;
  title?: unknown;
  productName?: unknown;
  product_name?: unknown;
  image?: unknown;
  featured_image?: unknown;
  featuredCoverImage?: unknown;
  featured_cover_image?: unknown;
}

export function mapHomeFeaturedProducts(products?: unknown): Product[] {
  if (!Array.isArray(products)) return [];

  return products.reduce<Product[]>((items, product) => {
    if (!isRecord(product)) return items;

    const id = readString(product, ["id", "productId", "product_id", "slug"]);
    const name = readString(product, [
      "name",
      "nombre",
      "title",
      "productName",
      "product_name",
    ]);
    const productImage = resolveImageAsset(
      readString(product, [
        "featuredBgImage",
        "featured_bg_image",
        "productImage",
        "product_image",
        "packshot",
        "image",
      ]),
    );
    const featuredCoverImage = resolveImageAsset(
      readString(product, [
        "featuredCoverImage",
        "featured_cover_image",
        "featured_image",
      ]),
    );
    const coverImage = featuredCoverImage ?? productImage;

    if (!id || !name || !coverImage) return items;

    items.push({
      id,
      name,
      shortName: readString(product, ["shortName", "short_name"]) ?? name,
      price: readNumber(product, ["price", "amount", "cost"]) ?? 0,
      shortDescription:
        readString(product, [
          "shortDescription",
          "short_description",
          "description",
        ]) ?? "",
      description:
        readString(product, ["description", "body", "content"]) ?? "",
      featuredCoverImage: coverImage,
      featuredBgImage: productImage ?? coverImage,
      cardImage: productImage ?? coverImage,
      category:
        readString(product, ["category", "categoryName", "category_name"]) ??
        "Producto destacado",
      consumptionType:
        readString(product, ["consumptionType", "consumption_type"]) ??
        "Producto destacado",
      featuredProduct: true,
    });

    return items;
  }, []);
}

export function mapHomeFeaturedFocuses(
  focuses?: unknown,
): ProductCategoryLink[] {
  if (!Array.isArray(focuses)) return [];

  return focuses.reduce<ProductCategoryLink[]>((items, focus) => {
    if (!isRecord(focus)) return items;

    const id = coerceString(focus.id);
    const name = coerceString(focus.name) ?? coerceString(focus.nombre);
    const imagePath =
      coerceString(focus.imageSrc) ??
      coerceString(focus.image_src) ??
      coerceString(focus.image);
    const imageSrc = resolveImageAsset(imagePath);

    if (!id || !name || !imageSrc) return items;

    items.push({
      id,
      name,
      imageSrc,
      href: `/products?focusId=${encodeURIComponent(id)}`,
    });

    return items;
  }, []);
}
