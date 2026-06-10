import assert from "node:assert/strict";
import { afterEach, mock, test } from "node:test";
import { env } from "@/config/env";
import {
  getProductDetail,
  getProductDetailPageData,
  getProductFilters,
  getProductFocusCategories,
  getProducts,
  parseProductsQuery,
} from "./products-api";

afterEach(() => {
  mock.restoreAll();
});

function mockProductsApiFailure() {
  mock.method(globalThis, "fetch", async () => {
    throw new TypeError("fetch failed");
  });
}

test("parseProductsQuery normaliza paginacion, filtros de producto/enfoque y busqueda", () => {
  const query = parseProductsQuery(
    new URLSearchParams(
      "page=-2&limit=999&productTypeId=2&product_type_ids[]=2&product_type_ids[]=&consumptionTypeId=1&focus_ids[]=3&category=%20Suplementos%20&category=Suplementos&category=&consumptionType=Belleza%20y%20Piel&name=%20omega%20",
    ),
  );

  assert.deepEqual(query, {
    page: 1,
    limit: 60,
    productTypeIds: ["2"],
    consumptionTypeIds: ["1"],
    focusIds: ["3"],
    categories: ["Suplementos"],
    search: "omega",
  });
});

test("getProducts usa mock local con filtros y meta estable cuando no hay API externa", async () => {
  mockProductsApiFailure();

  const result = await getProducts({
    page: 1,
    limit: 2,
    productTypeIds: [],
    consumptionTypeIds: [],
    focusIds: [],
    categories: ["Suplementos"],
    search: "",
  });

  assert.equal(result.meta.source, "mock");
  assert.equal(result.meta.page, 1);
  assert.equal(result.meta.limit, 2);
  assert.equal(result.data.length, 2);
  assert.ok(result.meta.total > result.data.length);
  assert.ok(result.data.every((product) => product.category === "Suplementos"));
});

test("getProducts usa IDs de filtros del CMS sobre el mock local", async () => {
  mockProductsApiFailure();

  const result = await getProducts({
    page: 1,
    limit: 5,
    productTypeIds: ["1"],
    consumptionTypeIds: [],
    focusIds: [],
    categories: [],
    search: "",
  });

  assert.equal(result.meta.source, "mock");
  assert.ok(result.data.length > 0);
  assert.ok(result.data.every((product) => product.category === "Medicamentos"));
});

test("getProducts envia al CMS solo filtros de tipo de producto y enfoque", async () => {
  let requestedUrl = "";

  mock.method(globalThis, "fetch", async (input: unknown) => {
    requestedUrl = String(input);

    return new Response(
      JSON.stringify({
        data: [],
        meta: {
          current_page: 1,
          last_page: 1,
          per_page: 9,
          total: 0,
        },
      }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  });

  await getProducts(
    parseProductsQuery(
      new URLSearchParams(
        "productTypeId=2&focusId=3&consumptionTypeId=1&page=1",
      ),
    ),
  );

  assert.match(requestedUrl, /product_type_ids%5B%5D=2/);
  assert.match(requestedUrl, /consumption_type_ids%5B%5D=1/);
  assert.match(requestedUrl, /focus_ids%5B%5D=3/);
});

test("getProductDetail usa mock local cuando no hay endpoint de detalle externo", async () => {
  mockProductsApiFailure();

  const product = await getProductDetail("1");

  assert.equal(product?.id, "1");
  assert.ok(product?.name);
});

test("getProductDetailPageData entrega producto y relacionados sin incluir el actual", async () => {
  mockProductsApiFailure();

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

test("getProductDetailPageData usa suggested_focuses del detalle del producto", async () => {
  const storageUrl = env.STORAGE_URL.endsWith("/")
    ? env.STORAGE_URL
    : `${env.STORAGE_URL}/`;

  mock.method(globalThis, "fetch", async (input: unknown) => {
    const url = String(input);
    assert.match(url, /\/products\/10$/);
    assert.doesNotMatch(url, /\/products\/focuses$/);

    return new Response(
      JSON.stringify({
        data: {
          product: {
            id: 10,
            name: "Producto CMS",
            price: 120,
            image: "products/catalog/product-cms.webp",
            featured_image: "products/catalog/featured/product-cms.webp",
            product_type: { id: 1, name: "Medicamentos" },
            consumption_type: { id: 1, name: "Rendimiento Y Energia" },
          },
          related_products: [
            {
              id: 11,
              name: "Producto relacionado",
              price: 80,
              image: "products/catalog/related.webp",
              featured_image: "products/catalog/featured/related.webp",
            },
            {
              id: 12,
              name: "Relacionado sin image",
              price: 90,
              featured_image: "products/catalog/featured/related-only.webp",
            },
          ],
          suggested_focuses: [
            {
              id: 1,
              nombre: "Rendimiento y Energia",
              image: "products/focuses/focuses1.png",
            },
            {
              id: 3,
              name: "Foco y Antiestres",
              image: "products/focuses/focuses3.png",
            },
          ],
        },
      }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  });

  const pageData = await getProductDetailPageData("10", 3);

  assert.ok(pageData);
  assert.equal(
    pageData.product.cardImage,
    `${storageUrl}products/catalog/product-cms.webp`,
  );
  assert.equal(
    pageData.relatedProducts[0].cardImage,
    `${storageUrl}products/catalog/related.webp`,
  );
  assert.equal(pageData.relatedProducts[1].cardImage, "/product/image6.png");
  assert.deepEqual(pageData.suggestedFocuses, [
    {
      id: "1",
      name: "Rendimiento y Energia",
      imageSrc: `${storageUrl}products/focuses/focuses1.png`,
      href: "/products?focusId=1",
    },
    {
      id: "3",
      name: "Foco y Antiestres",
      imageSrc: `${storageUrl}products/focuses/focuses3.png`,
      href: "/products?focusId=3",
    },
  ]);
});

test("getProductDetail devuelve null para producto inexistente en fallback local", async () => {
  mockProductsApiFailure();

  const product = await getProductDetail("999999");

  assert.equal(product, null);
});

test("getProductDetailPageData no inventa relacionados desde catalogo si el detalle no los manda", async () => {
  mock.method(globalThis, "fetch", async (input: unknown) => {
    const url = String(input);
    assert.match(url, /\/products\/10$/);
    assert.doesNotMatch(url, /\/products\?/);

    return new Response(
      JSON.stringify({
        data: {
          product: {
            id: 10,
            name: "Producto CMS",
            price: 120,
            image: "products/catalog/product-cms.webp",
            product_type: { id: 1, name: "Medicamentos" },
            consumption_type: { id: 1, name: "Rendimiento Y Energia" },
          },
        },
      }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  });

  const pageData = await getProductDetailPageData("10", 3);

  assert.ok(pageData);
  assert.deepEqual(pageData.relatedProducts, []);
});

test("getProductFocusCategories devuelve solo enfoques del CMS con imagen", async () => {
  mock.method(globalThis, "fetch", async (input: unknown) => {
    assert.match(String(input), /\/products\/focuses$/);

    return new Response(
      JSON.stringify({
        data: [
          {
            id: 1,
            name: "Rendimiento y Energia",
            image: "https://cms.terbolinspira.com/storage/focuses/energia.webp",
          },
          {
            id: 2,
            name: "Sin imagen",
          },
        ],
      }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  });

  const result = await getProductFocusCategories();

  assert.deepEqual(result, [
    {
      id: "1",
      name: "Rendimiento y Energia",
      imageSrc: "https://cms.terbolinspira.com/storage/focuses/energia.webp",
      href: "/products?focusId=1",
    },
  ]);
});

test("getProductFilters consulta tipos, consumption-types y enfoques", async () => {
  const requestedPaths: string[] = [];

  mock.method(globalThis, "fetch", async (input: unknown) => {
    const url = new URL(String(input));
    requestedPaths.push(url.pathname);

    let data;
    if (url.pathname.endsWith("/types")) {
      data = [{ id: 1, name: "Medicamentos" }];
    } else if (url.pathname.endsWith("/consumption-types")) {
      data = [{ id: 1, name: "Vía oral" }];
    } else {
      data = [{ id: 2, name: "Rendimiento y Energia" }];
    }

    return new Response(
      JSON.stringify({ data }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  });

  const result = await getProductFilters();

  assert.equal(result.source, "external");
  assert.deepEqual(result.productTypes.map((type) => type.id), ["1"]);
  assert.deepEqual(result.consumptionTypes.map((type) => type.id), ["1"]);
  assert.deepEqual(result.focuses.map((focus) => focus.id), ["2"]);
  assert.ok(requestedPaths.some((path) => path.endsWith("/products/types")));
  assert.ok(requestedPaths.some((path) => path.endsWith("/products/consumption-types")));
  assert.ok(requestedPaths.some((path) => path.endsWith("/products/focuses")));
});
