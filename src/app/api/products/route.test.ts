import assert from "node:assert/strict";
import { afterEach, beforeEach, mock, test } from "node:test";
import { GET } from "./route";

const originalInfo = console.info;
const originalError = console.error;

beforeEach(() => {
  console.info = () => {};
  console.error = () => {};
});

afterEach(() => {
  mock.restoreAll();
  console.info = originalInfo;
  console.error = originalError;
});

test("GET /api/products devuelve contrato data/meta y no-store", async () => {
  mock.method(globalThis, "fetch", async () => {
    throw new TypeError("fetch failed");
  });

  const response = await GET(
    new Request(
      "http://localhost/api/products?page=1&limit=3&productTypeId=1",
    ),
  );
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.equal(body.meta.source, "mock");
  assert.equal(body.meta.page, 1);
  assert.equal(body.meta.limit, 3);
  assert.equal(body.data.length, 3);
  assert.ok(
    body.data.every(
      (product: { category: string }) =>
        product.category === "Medicamentos",
    ),
  );
});
