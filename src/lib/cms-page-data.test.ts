import assert from "node:assert/strict";
import { test } from "node:test";
import { CMS_PAGE_SCHEMAS } from "./cms-data";
import { getOptionalCmsPageData } from "./cms-page-data";

async function captureWarnings<T>(run: () => Promise<T>) {
  const originalWarn = console.warn;
  const warnings: string[] = [];

  console.warn = (message?: unknown) => {
    warnings.push(String(message));
  };

  try {
    const result = await run();
    return { result, warnings };
  } finally {
    console.warn = originalWarn;
  }
}

test("getOptionalCmsPageData normaliza respuestas validas del CMS", async () => {
  const data = await getOptionalCmsPageData(
    async () => ({
      data: {
        hero_section: {
          title: "Inicio",
        },
        pillars: [{ title: "Calidad" }],
        ignored: "no debe salir",
      },
    }),
    CMS_PAGE_SCHEMAS.home,
    "home-test",
  );

  assert.deepEqual(data, {
    hero_section: {
      title: "Inicio",
    },
    pillars: [{ title: "Calidad" }],
  });
});

test("getOptionalCmsPageData devuelve fallback vacio si el CMS falla", async () => {
  const { result, warnings } = await captureWarnings(() =>
    getOptionalCmsPageData(
      async () => {
        throw new Error("CMS offline");
      },
      CMS_PAGE_SCHEMAS.home,
      "home-test",
    ),
  );
  const warning = JSON.parse(warnings[0]) as Record<string, unknown>;

  assert.deepEqual(result, {});
  assert.equal(warning.level, "warn");
  assert.equal(warning.message, "cms_page_data_fallback");
  assert.equal(warning.context, "home-test");
});
