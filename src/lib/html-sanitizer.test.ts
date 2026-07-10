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

test("sanitizeCmsHtml conserva las imágenes y figuras permitidas del editor", () => {
  const html = sanitizeCmsHtml(
    '<figure class="image image-style-side"><img src="https://cms.terbolinspira.com/storage/learn/blogs/content/example.jpg" alt="Descripción" width="768" height="765" style="aspect-ratio: 768 / 765"><figcaption>Pie de imagen</figcaption></figure>',
  );

  assert.ok(html.includes("<figure"));
  assert.ok(html.includes('class="image image-style-side"'));
  assert.ok(html.includes('src="https://cms.terbolinspira.com/storage/learn/blogs/content/example.jpg"'));
  assert.ok(html.includes('alt="Descripción"'));
  assert.ok(html.includes('style="aspect-ratio:768 / 765"'));
  assert.ok(html.includes("<figcaption>Pie de imagen</figcaption>"));
});

test("sanitizeCmsHtml elimina esquemas inseguros en imágenes", () => {
  const html = sanitizeCmsHtml('<img src="javascript:alert(1)" alt="insegura">');

  assert.equal(html.includes("javascript:"), false);
});
