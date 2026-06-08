import assert from "node:assert/strict";
import { afterEach, beforeEach, test } from "node:test";
import { POST } from "./route";

interface NextCacheMock {
  calls: Array<[tag: string, profile: string]>;
  reset: () => void;
}

const originalSecret = process.env.REVALIDATE_SECRET;
const originalInfo = console.info;
const originalWarn = console.warn;
const originalError = console.error;
const nextCacheMock = () =>
  (globalThis as typeof globalThis & { __nextCacheMock: NextCacheMock })
    .__nextCacheMock;

function createRequest(
  body: unknown,
  secret?: string,
): Parameters<typeof POST>[0] {
  return new Request("http://localhost/api/revalidate", {
    method: "POST",
    headers: secret ? { "x-revalidate-secret": secret } : undefined,
    body: JSON.stringify(body),
  }) as Parameters<typeof POST>[0];
}

beforeEach(() => {
  nextCacheMock().reset();
  console.info = () => {};
  console.warn = () => {};
  console.error = () => {};
});

afterEach(() => {
  console.info = originalInfo;
  console.warn = originalWarn;
  console.error = originalError;

  if (originalSecret === undefined) {
    delete process.env.REVALIDATE_SECRET;
  } else {
    process.env.REVALIDATE_SECRET = originalSecret;
  }
});

test("POST /api/revalidate falla cerrado si falta REVALIDATE_SECRET", async () => {
  delete process.env.REVALIDATE_SECRET;

  const response = await POST(createRequest({ tag: "home" }));
  const body = await response.json();

  assert.equal(response.status, 500);
  assert.equal(body.success, false);
  assert.equal(nextCacheMock().calls.length, 0);
});

test("POST /api/revalidate rechaza token invalido", async () => {
  process.env.REVALIDATE_SECRET = "secret-ok";

  const response = await POST(createRequest({ tag: "home" }, "secret-bad"));
  const body = await response.json();

  assert.equal(response.status, 401);
  assert.equal(body.success, false);
  assert.equal(nextCacheMock().calls.length, 0);
});

test("POST /api/revalidate deduplica tags validos y llama revalidateTag", async () => {
  process.env.REVALIDATE_SECRET = "secret-ok";

  const response = await POST(
    createRequest({ tag: ["home", "blog-12", "home"] }, "secret-ok"),
  );
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.success, true);
  assert.deepEqual(body.data.tags, ["home", "blog-12"]);
  assert.deepEqual(nextCacheMock().calls, [
    ["home", "max"],
    ["blog-12", "max"],
  ]);
});

test("POST /api/revalidate rechaza tags no permitidos", async () => {
  process.env.REVALIDATE_SECRET = "secret-ok";

  const response = await POST(
    createRequest({ tag: ["home", "not-allowed"] }, "secret-ok"),
  );
  const body = await response.json();

  assert.equal(response.status, 400);
  assert.equal(body.success, false);
  assert.deepEqual(body.data.invalidTags, ["not-allowed"]);
  assert.equal(nextCacheMock().calls.length, 0);
});

test("POST /api/revalidate rechaza tags legacy de productos", async () => {
  process.env.REVALIDATE_SECRET = "secret-ok";

  const response = await POST(
    createRequest({ tag: ["products-list", "product-1"] }, "secret-ok"),
  );
  const body = await response.json();

  assert.equal(response.status, 400);
  assert.equal(body.success, false);
  assert.deepEqual(body.data.invalidTags, ["products-list", "product-1"]);
  assert.deepEqual(body.data.allowedPatterns, ["blog-{id}"]);
  assert.equal(nextCacheMock().calls.length, 0);
});
