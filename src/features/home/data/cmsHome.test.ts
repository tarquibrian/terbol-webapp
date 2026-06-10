import assert from "node:assert/strict";
import { test } from "node:test";
import { env } from "@/config/env";
import {
  mapHomeFeaturedFocuses,
  mapHomeFeaturedProducts,
} from "./cmsHome";

test("mapHomeFeaturedFocuses usa solo enfoques destacados del CMS", () => {
  const storageUrl = env.STORAGE_URL.endsWith("/")
    ? env.STORAGE_URL
    : `${env.STORAGE_URL}/`;

  const focuses = mapHomeFeaturedFocuses([
    {
      id: 1,
      nombre: " Rendimiento y Energia ",
      image: "products/focuses/focuses1.png",
    },
    {
      id: 3,
      name: "Foco y Antiestres",
      image_src: "/storage/products/focuses/focuses3.png",
    },
    {
      id: 4,
      nombre: "Sin imagen",
    },
    "invalid",
  ]);

  assert.deepEqual(focuses, [
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

test("mapHomeFeaturedFocuses devuelve lista vacia si no hay arreglo CMS", () => {
  assert.deepEqual(mapHomeFeaturedFocuses(undefined), []);
  assert.deepEqual(mapHomeFeaturedFocuses({ id: 1 }), []);
});

test("mapHomeFeaturedProducts devuelve vacio si Home no manda featured_products", () => {
  assert.deepEqual(mapHomeFeaturedProducts(undefined), []);
  assert.deepEqual(mapHomeFeaturedProducts({ id: 1 }), []);
});

test("mapHomeFeaturedProducts usa featured_products del Home sin limitar a 3", () => {
  const storageUrl = env.STORAGE_URL.endsWith("/")
    ? env.STORAGE_URL
    : `${env.STORAGE_URL}/`;

  const products = mapHomeFeaturedProducts([
    {
      id: 29,
      nombre: "Paracetamol 500 mg",
      image: "products/catalog/home-29.webp",
      featured_image: "products/catalog/featured/home-29.webp",
    },
    {
      id: 28,
      nombre: "Omeprazol 20 mg",
      image: "products/catalog/home-28.webp",
      featured_image: "products/catalog/featured/home-28.webp",
    },
    {
      id: 21,
      nombre: "Spirulina Azul Organica",
      image: "products/catalog/home-21.webp",
      featured_image: "products/catalog/featured/home-21.webp",
    },
    {
      id: 20,
      nombre: "Complejo B Forte",
      image: "products/catalog/home-20.webp",
      featured_image: "products/catalog/featured/home-20.webp",
    },
  ]);

  assert.deepEqual(
    products.map((product) => product.id),
    ["29", "28", "21", "20"],
  );
  assert.equal(products[0].name, "Paracetamol 500 mg");
  assert.equal(
    products[0].featuredCoverImage,
    `${storageUrl}products/catalog/featured/home-29.webp`,
  );
  assert.equal(
    products[0].featuredBgImage,
    `${storageUrl}products/catalog/home-29.webp`,
  );
});
