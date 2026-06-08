import assert from "node:assert/strict";
import { test } from "node:test";
import { createContentSecurityPolicy, securityHeaders } from "./security-headers";

test("securityHeaders incluye headers base de endurecimiento", () => {
  const headers = new Map(
    securityHeaders.map((header) => [header.key.toLowerCase(), header.value]),
  );

  assert.equal(headers.get("x-frame-options"), "DENY");
  assert.equal(headers.get("x-content-type-options"), "nosniff");
  assert.equal(
    headers.get("referrer-policy"),
    "strict-origin-when-cross-origin",
  );
  assert.ok(headers.get("strict-transport-security")?.includes("preload"));
  assert.ok(headers.get("permissions-policy")?.includes("camera=()"));
});

test("createContentSecurityPolicy permite solo fuentes esperadas", () => {
  const csp = createContentSecurityPolicy({ isDevelopment: false });

  assert.ok(csp.includes("default-src 'self'"));
  assert.ok(csp.includes("object-src 'none'"));
  assert.ok(csp.includes("frame-ancestors 'none'"));
  assert.ok(csp.includes("img-src 'self' data: blob:"));
  assert.ok(csp.includes("https://cms.terbolinspira.com"));
  assert.ok(csp.includes("https://images.unsplash.com"));
  assert.ok(csp.includes("frame-src 'self' https://www.youtube-nocookie.com"));
  assert.ok(csp.includes("https://player.vimeo.com"));
  assert.equal(csp.includes("upgrade-insecure-requests"), false);
  assert.equal(csp.includes("'unsafe-eval'"), false);
});

test("createContentSecurityPolicy habilita unsafe-eval solo en desarrollo", () => {
  const csp = createContentSecurityPolicy({ isDevelopment: true });

  assert.ok(csp.includes("'unsafe-eval'"));
  assert.ok(csp.includes("ws:"));
});
