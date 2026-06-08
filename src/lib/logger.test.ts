import assert from "node:assert/strict";
import { test } from "node:test";
import {
  getRequestLogContext,
  logError,
  logInfo,
  logWarn,
  serializeError,
} from "./logger";

function captureLogs(run: () => void) {
  const originalInfo = console.info;
  const originalWarn = console.warn;
  const originalError = console.error;
  const logs: string[] = [];

  console.info = (message?: unknown) => {
    logs.push(String(message));
  };
  console.warn = (message?: unknown) => {
    logs.push(String(message));
  };
  console.error = (message?: unknown) => {
    logs.push(String(message));
  };

  try {
    run();
    return logs;
  } finally {
    console.info = originalInfo;
    console.warn = originalWarn;
    console.error = originalError;
  }
}

test("logInfo escribe entradas JSON y omite campos undefined", () => {
  const logs = captureLogs(() => {
    logInfo("products_route_succeeded", {
      route: "/api/products",
      requestId: "req-1",
      optional: undefined,
    });
  });

  const entry = JSON.parse(logs[0]) as Record<string, unknown>;

  assert.equal(entry.level, "info");
  assert.equal(entry.message, "products_route_succeeded");
  assert.equal(entry.route, "/api/products");
  assert.equal(entry.requestId, "req-1");
  assert.equal("timestamp" in entry, true);
  assert.equal("optional" in entry, false);
});

test("logWarn redacta claves sensibles del contexto", () => {
  const logs = captureLogs(() => {
    logWarn("revalidate_invalid_token", {
      route: "/api/revalidate",
      secret: "no-debe-salir",
      authorization: "Bearer token",
    });
  });

  const entry = JSON.parse(logs[0]) as Record<string, unknown>;

  assert.equal(entry.level, "warn");
  assert.equal(entry.secret, "[redacted]");
  assert.equal(entry.authorization, "[redacted]");
  assert.equal(JSON.stringify(entry).includes("no-debe-salir"), false);
  assert.equal(JSON.stringify(entry).includes("Bearer token"), false);
});

test("logError serializa errores como objeto estructurado", () => {
  const logs = captureLogs(() => {
    logError("cms_fetch_failed", new TypeError("fallo de red"), {
      endpoint: "/sections/home",
    });
  });

  const entry = JSON.parse(logs[0]) as {
    level: string;
    message: string;
    error: {
      name: string;
      message: string;
      stack?: string;
    };
  };

  assert.equal(entry.level, "error");
  assert.equal(entry.message, "cms_fetch_failed");
  assert.equal(entry.error.name, "TypeError");
  assert.equal(entry.error.message, "fallo de red");
});

test("serializeError conserva digest cuando Next lo entrega", () => {
  const error = new Error("render failed") as Error & { digest?: string };
  error.digest = "NEXT_DIGEST";

  assert.equal(serializeError(error).digest, "NEXT_DIGEST");
});

test("getRequestLogContext usa request id existente antes de generar uno", () => {
  const context = getRequestLogContext(
    new Request("http://localhost/api/products", {
      headers: {
        "x-request-id": "req-from-proxy",
      },
    }),
    "/api/products",
  );

  assert.deepEqual(context, {
    route: "/api/products",
    method: "GET",
    requestId: "req-from-proxy",
  });
});
