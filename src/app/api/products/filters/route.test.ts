import assert from "node:assert/strict";
import { afterEach, beforeEach, test } from "node:test";
import { GET } from "./route";

const originalInfo = console.info;
const originalError = console.error;

beforeEach(() => {
  console.info = () => {};
  console.error = () => {};
});

afterEach(() => {
  console.info = originalInfo;
  console.error = originalError;
});

test("GET /api/products/filters devuelve opciones fallback si no hay API externa", async () => {
  const response = await GET(new Request("http://localhost/api/products/filters"));
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.source, "mock");
  assert.ok(body.productTypes.length > 0);
  assert.ok(body.consumptionTypes.length > 0);
  assert.ok(body.focuses.length > 0);
});
