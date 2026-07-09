import assert from "node:assert/strict";
import { test } from "node:test";
import { env } from "@/config/env";
import { getAllProductIds } from "@/features/products";
import sitemap from "./sitemap";

async function getSitemapUrls() {
  return (await sitemap()).map((entry) => entry.url);
}

test("sitemap incluye rutas estaticas principales", async () => {
  const urls = await getSitemapUrls();
  const siteUrl = env.SITE_URL.replace(/\/$/, "");

  assert.ok(urls.includes(siteUrl));
  assert.ok(urls.includes(`${siteUrl}/about`));
  assert.ok(urls.includes(`${siteUrl}/blog`));
  assert.ok(urls.includes(`${siteUrl}/products`));
  assert.ok(urls.includes(`${siteUrl}/success-plan`));
});

test("sitemap incluye todos los detalles de producto disponibles", async () => {
  const urls = await getSitemapUrls();
  const siteUrl = env.SITE_URL.replace(/\/$/, "");

  for (const productId of getAllProductIds()) {
    assert.ok(
      urls.includes(`${siteUrl}/products/${encodeURIComponent(productId)}`),
      `Falta /products/${productId} en sitemap`,
    );
  }
});
