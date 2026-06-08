import assert from "node:assert/strict";
import { test } from "node:test";
import { env } from "@/config/env";
import { isSvgAsset, resolveImageAsset } from "./image-assets";

test("resolveImageAsset conserva rutas public locales conocidas", () => {
  assert.equal(resolveImageAsset("/images/image14.png"), "/images/image14.png");
  assert.equal(
    resolveImageAsset("/product/image6.png"),
    "/product/image6.png",
  );
});

test("resolveImageAsset resuelve rutas CMS contra STORAGE_URL", () => {
  const storageUrl = env.STORAGE_URL.endsWith("/")
    ? env.STORAGE_URL
    : `${env.STORAGE_URL}/`;

  assert.equal(
    resolveImageAsset("help/social/facebook.svg"),
    `${storageUrl}help/social/facebook.svg`,
  );
  assert.equal(
    resolveImageAsset("/storage/products/image.png"),
    `${storageUrl}storage/products/image.png`,
  );
});

test("resolveImageAsset conserva URLs remotas y aplica fallback", () => {
  assert.equal(
    resolveImageAsset("https://cdn.example.com/image.png"),
    "https://cdn.example.com/image.png",
  );
  assert.equal(resolveImageAsset(undefined, "/banner/productbanner.png"), "/banner/productbanner.png");
});

test("isSvgAsset detecta SVG aun con query string", () => {
  assert.equal(isSvgAsset("/icons/facebook.svg?v=1"), true);
  assert.equal(isSvgAsset("/images/image14.png"), false);
});
