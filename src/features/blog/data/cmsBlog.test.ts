import assert from "node:assert/strict";
import { test } from "node:test";
import { mapCmsBlogCategories, mapCmsBlogList, mapCmsBlogPost } from "./cmsBlog";

test("mapCmsBlogCategories filtra categorias invalidas y ordena por order", () => {
  const categories = mapCmsBlogCategories([
    { id: "2", title: " Nutricion ", order: 2 },
    { id: "bad", title: "Invalida", order: 0 },
    { id: 1, title: "Salud", order: 1 },
    { id: 3, title: "", order: 3 },
  ]);

  assert.deepEqual(categories, [
    { id: 0, title: "Todos" },
    { id: 1, title: "Salud" },
    { id: 2, title: "Nutricion" },
  ]);
});

test("mapCmsBlogPost devuelve null si faltan campos requeridos", () => {
  assert.equal(mapCmsBlogPost({ title: "Sin id" }), null);
  assert.equal(mapCmsBlogPost({ id: 10 }), null);
  assert.equal(mapCmsBlogPost("invalid"), null);
});

test("mapCmsBlogList normaliza posts y paginacion desde payload flexible", () => {
  const { posts, pagination } = mapCmsBlogList({
    items: [
      {
        id: 10,
        title: "Post de salud",
        image: "blog/post.jpg",
        category_blog_id: "3",
        category: { id: 3, title: "Salud" },
        published_at: "2026-01-10",
        detail: "<p>Contenido</p>",
      },
      { id: 11 },
    ],
    pagination: {
      current_page: "2",
      last_page: "4",
      per_page: "6",
      total: "20",
    },
  });

  assert.equal(posts.length, 1);
  assert.equal(posts[0].id, "10");
  assert.equal(posts[0].title, "Post de salud");
  assert.equal(posts[0].categoryId, 3);
  assert.equal(posts[0].category, "Salud");
  assert.equal(posts[0].href, "/blog/10");
  assert.deepEqual(pagination, {
    currentPage: 2,
    totalPages: 4,
    perPage: 6,
    total: 20,
  });
});
