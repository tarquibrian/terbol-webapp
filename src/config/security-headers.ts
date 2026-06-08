interface ContentSecurityPolicyOptions {
  isDevelopment?: boolean;
}

const CMS_ORIGIN = "https://cms.terbolinspira.com";
const UNSPLASH_ORIGIN = "https://images.unsplash.com";
const LOCAL_HTTP_SOURCES = [
  "http://localhost:*",
  "http://127.0.0.1:*",
  "http://192.168.0.7:*",
];
const VIDEO_FRAME_SOURCES = [
  "https://www.youtube-nocookie.com",
  "https://www.youtube.com",
  "https://player.vimeo.com",
];

function createDirective(name: string, values: string[]) {
  return `${name} ${values.join(" ")}`;
}

export function createContentSecurityPolicy({
  isDevelopment = process.env.NODE_ENV !== "production",
}: ContentSecurityPolicyOptions = {}) {
  const scriptSources = ["'self'", "'unsafe-inline'"];
  const connectSources = ["'self'", CMS_ORIGIN, ...LOCAL_HTTP_SOURCES];

  if (isDevelopment) {
    scriptSources.push("'unsafe-eval'");
    connectSources.push("ws:", "wss:");
  }

  const directives = [
    createDirective("default-src", ["'self'"]),
    createDirective("base-uri", ["'self'"]),
    createDirective("object-src", ["'none'"]),
    createDirective("frame-ancestors", ["'none'"]),
    createDirective("form-action", ["'self'"]),
    createDirective("script-src", scriptSources),
    createDirective("style-src", ["'self'", "'unsafe-inline'"]),
    createDirective("img-src", [
      "'self'",
      "data:",
      "blob:",
      CMS_ORIGIN,
      UNSPLASH_ORIGIN,
      ...LOCAL_HTTP_SOURCES,
    ]),
    createDirective("font-src", ["'self'", "data:"]),
    createDirective("connect-src", connectSources),
    createDirective("media-src", ["'self'", "data:", "blob:", CMS_ORIGIN]),
    createDirective("frame-src", ["'self'", ...VIDEO_FRAME_SOURCES]),
    createDirective("manifest-src", ["'self'"]),
    createDirective("worker-src", ["'self'", "blob:"]),
  ];

  return directives.join("; ");
}

export const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: createContentSecurityPolicy(),
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(), payment=(), usb=(), serial=(), bluetooth=(), magnetometer=(), interest-cohort=()",
  },
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "X-Download-Options",
    value: "noopen",
  },
  {
    key: "X-Permitted-Cross-Domain-Policies",
    value: "none",
  },
] as const;
