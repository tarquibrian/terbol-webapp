import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";
import {
  TARGET_AUDIENCES,
  TARGET_AUDIENCE_IMAGE_FALLBACK,
} from "./targetAudiences";

function publicAssetExists(assetPath: string) {
  const projectRoot = path.resolve(__dirname, "../../../../");
  return existsSync(path.join(projectRoot, "public", assetPath.replace(/^\//, "")));
}

test("TARGET_AUDIENCE_IMAGE_FALLBACK apunta a un asset publico existente", () => {
  assert.equal(publicAssetExists(TARGET_AUDIENCE_IMAGE_FALLBACK), true);
});

test("TARGET_AUDIENCES usa imagenes publicas existentes", () => {
  for (const audience of Object.values(TARGET_AUDIENCES)) {
    assert.equal(publicAssetExists(audience.image), true);
  }
});
