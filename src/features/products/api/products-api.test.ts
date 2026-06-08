import assert from "node:assert/strict";
import { test } from "node:test";
import {
  getProductDetail,
  getProductDetailPageData,
  getProducts,
  parseProductsQuery,
} from "./products-api";

test("parseProductsQuery normaliza paginacion, filtros duplicados y busqueda", () => {
  const query = parseProductsQuery(
    new URLSearchParams(
      "page=-2&limit=999&category=%20Suplementos%20&category=Suplementos&category=&consumptionType=Belleza%20y%20Piel&search=%20collagen%20",
    ),
  );

  assert.deepEqual(query, {
    page: 1,
    limit: 60,
    categories: ["Suplementos"],
    consumptionTypes: ["Belleza y Piel"],
    search: "collagen",
  });
});

test("getProducts usa mock local con filtros y meta estable cuando no hay API externa", async () => {
  const result = await getProducts({
    page: 1,
    limit: 2,
    categories: ["Suplementos"],
    consumptionTypes: [],
    search: "",
  });

  assert.equal(result.meta.source, "mock");
  assert.equal(result.meta.page, 1);
  assert.equal(result.meta.limit, 2);
  assert.equal(result.data.length, 2);
  assert.ok(result.meta.total > result.data.length);
  assert.ok(result.data.every((product) => product.category === "Suplementos"));
});

test("getProductDetail usa mock local cuando no hay endpoint de detalle externo", async () => {
  const product = await getProductDetail("1");

  assert.equal(product?.id, "1");
  assert.ok(product?.name);
});

test("getProductDetailPageData entrega producto y relacionados sin incluir el actual", async () => {
  const pageData = await getProductDetailPageData("1", 3);

  assert.ok(pageData);
  assert.equal(pageData.product.id, "1");
  assert.equal(pageData.relatedProducts.length, 3);
  assert.ok(
    pageData.relatedProducts.every(
      (product) => product.id !== pageData.product.id,
    ),
  );
});

test("getProductDetail devuelve null para producto inexistente en fallback local", async () => {
  const product = await getProductDetail("999999");

  assert.equal(product, null);
});
