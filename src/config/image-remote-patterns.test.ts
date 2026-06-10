import assert from "node:assert/strict";
import { test } from "node:test";
import { createRemoteImagePatterns } from "./image-remote-patterns";

test("createRemoteImagePatterns incluye defaults y URLs remotas de entorno", () => {
  const patterns = createRemoteImagePatterns([
    "https://cdn.example.com/storage",
    "http://localhost:8000/storage",
    "/api/products",
    "data:image/png;base64,abc",
  ]);

  assert.ok(
    patterns.some(
      (pattern) =>
        pattern.protocol === "https" &&
        pattern.hostname === "cms.terbolinspira.com",
    ),
  );
  assert.ok(
    patterns.some(
      (pattern) =>
        pattern.protocol === "https" &&
        pattern.hostname === "terbol.blob.core.windows.net",
    ),
  );
  assert.ok(
    patterns.some(
      (pattern) =>
        pattern.protocol === "https" && pattern.hostname === "cdn.example.com",
    ),
  );
  assert.ok(
    patterns.some(
      (pattern) =>
        pattern.protocol === "http" &&
        pattern.hostname === "localhost" &&
        pattern.port === "8000",
    ),
  );
  assert.equal(
    patterns.some((pattern) => pattern.hostname === "api"),
    false,
  );
});

test("createRemoteImagePatterns deduplica patrones repetidos", () => {
  const patterns = createRemoteImagePatterns([
    "https://cdn.example.com/storage",
    "https://cdn.example.com/assets",
  ]);
  const matchingPatterns = patterns.filter(
    (pattern) =>
      pattern.protocol === "https" && pattern.hostname === "cdn.example.com",
  );

  assert.equal(matchingPatterns.length, 1);
});
