import assert from "node:assert/strict";
import { afterEach, beforeEach, test } from "node:test";
import { CMS_PAGE_SCHEMAS, normalizeCmsPageData } from "./cms-data";

const originalWarn = console.warn;
let warnings: string[] = [];

beforeEach(() => {
  warnings = [];
  console.warn = (message?: unknown) => {
    warnings.push(String(message));
  };
});

afterEach(() => {
  console.warn = originalWarn;
});

test("normalizeCmsPageData conserva secciones esperadas y descarta formas invalidas", () => {
  const data = normalizeCmsPageData(
    {
      hero_section: {
        title: "Inicio",
        details: "deberia ser array",
        unsafe: () => "no serializable",
      },
      pillars: [
        { id: 1, title: "Calidad", description: "Control" },
        "invalid",
      ],
      featured_focuses: [
        { id: 1, nombre: "Rendimiento", image: "products/focuses/focuses1.png" },
      ],
      featured_products: [
        { id: 29, nombre: "Paracetamol", featured_image: "products/catalog/featured/image1.webp" },
      ],
      development_products: "invalid",
      ignored_section: { title: "No debe salir" },
    },
    CMS_PAGE_SCHEMAS.home,
    "home-test",
  );

  assert.deepEqual(data, {
    hero_section: {
      title: "Inicio",
    },
    pillars: [{ id: 1, title: "Calidad", description: "Control" }],
    featured_focuses: [
      { id: 1, nombre: "Rendimiento", image: "products/focuses/focuses1.png" },
    ],
    featured_products: [
      { id: 29, nombre: "Paracetamol", featured_image: "products/catalog/featured/image1.webp" },
    ],
    development_products: [],
  });
  assert.ok(warnings.some((warning) => warning.includes("home-test.pillars")));
  assert.ok(
    warnings.some((warning) =>
      warning.includes("home-test.development_products"),
    ),
  );
});

test("normalizeCmsPageData devuelve objeto vacio para payload no objeto", () => {
  assert.deepEqual(
    normalizeCmsPageData(null, CMS_PAGE_SCHEMAS.about, "about-test"),
    {},
  );
  assert.deepEqual(
    normalizeCmsPageData("invalid", CMS_PAGE_SCHEMAS.about, "about-test"),
    {},
  );
});
