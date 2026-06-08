import assert from "node:assert/strict";
import { test } from "node:test";
import {
  createPageMetadata,
  getAbsoluteUrl,
  getCanonicalPath,
  SEO_IMAGES,
} from "./seo";
import { env } from "@/config/env";

test("getCanonicalPath normaliza raiz, slash inicial y slash final", () => {
  assert.equal(getCanonicalPath(""), "/");
  assert.equal(getCanonicalPath("/"), "/");
  assert.equal(getCanonicalPath("products/"), "/products");
  assert.equal(getCanonicalPath("/products/1/"), "/products/1");
});

test("getAbsoluteUrl construye URL absoluta sin doble slash", () => {
  const siteUrl = env.SITE_URL.replace(/\/$/, "");

  assert.equal(getAbsoluteUrl("/products"), `${siteUrl}/products`);
  assert.equal(getAbsoluteUrl("/"), siteUrl);
});

test("createPageMetadata incluye canonical, Open Graph y Twitter consistentes", () => {
  const metadata = createPageMetadata({
    title: "Nuestros Productos",
    description: "Catálogo Terbol",
    path: "/products",
    image: SEO_IMAGES.products,
  });

  assert.deepEqual(metadata.alternates, {
    canonical: "/products",
  });
  assert.equal(metadata.openGraph?.title, "Nuestros Productos");
  assert.equal(metadata.openGraph?.url, "/products");
  assert.deepEqual(metadata.twitter?.images, [SEO_IMAGES.products.url]);
});

test("createPageMetadata marca no-index cuando se solicita", () => {
  const metadata = createPageMetadata({
    title: "Producto no encontrado",
    description: "No existe",
    path: "/products/404",
    noIndex: true,
  });

  assert.deepEqual(metadata.robots, {
    index: false,
    follow: false,
  });
});
