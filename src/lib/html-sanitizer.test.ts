import assert from "node:assert/strict";
import { test } from "node:test";
import { sanitizeCmsHtml } from "./html-sanitizer";

test("sanitizeCmsHtml elimina scripts y esquemas peligrosos", () => {
  const html = sanitizeCmsHtml(
    '<p>Texto</p><script>alert(1)</script><a href="javascript:alert(1)" target="_blank">link</a>',
  );

  assert.ok(html.includes("<p>Texto</p>"));
  assert.equal(html.includes("<script"), false);
  assert.equal(html.includes("javascript:"), false);
});

test("sanitizeCmsHtml fuerza rel seguro para links target blank", () => {
  const html = sanitizeCmsHtml(
    '<a href="https://terbol.com" target="_blank">Terbol</a>',
  );

  assert.ok(html.includes('href="https://terbol.com"'));
  assert.ok(html.includes('target="_blank"'));
  assert.ok(html.includes('rel="noopener noreferrer"'));
});
