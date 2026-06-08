import type { NextConfig } from "next";

type ImageConfig = NonNullable<NextConfig["images"]>;
type RemotePattern = NonNullable<ImageConfig["remotePatterns"]>[number];

const DEFAULT_REMOTE_IMAGE_PATTERNS = [
  {
    protocol: "https",
    hostname: "images.unsplash.com",
  },
  {
    protocol: "http",
    hostname: "localhost",
  },
  {
    protocol: "http",
    hostname: "127.0.0.1",
  },
  {
    protocol: "http",
    hostname: "192.168.0.7",
  },
  {
    protocol: "https",
    hostname: "cms.terbolinspira.com",
  },
] as const satisfies readonly RemotePattern[];

const ENV_IMAGE_SOURCE_URLS = [
  process.env.NEXT_PUBLIC_STORAGE_URL,
  process.env.NEXT_PUBLIC_API_URL,
  process.env.PRODUCTS_API_URL,
  process.env.PRODUCTS_DETAIL_API_URL,
];

function createRemotePatternFromUrl(urlValue: string): RemotePattern | null {
  try {
    const url = new URL(urlValue);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;

    return {
      protocol: url.protocol.replace(":", "") as "http" | "https",
      hostname: url.hostname,
      ...(url.port ? { port: url.port } : {}),
    };
  } catch {
    return null;
  }
}

function getRemotePatternKey(pattern: RemotePattern) {
  return [
    pattern.protocol ?? "",
    pattern.hostname ?? "",
    pattern.port ?? "",
    pattern.pathname ?? "",
  ].join("|");
}

export function createRemoteImagePatterns(
  urls: Array<string | undefined> = ENV_IMAGE_SOURCE_URLS,
): RemotePattern[] {
  const patterns = [
    ...DEFAULT_REMOTE_IMAGE_PATTERNS,
    ...urls
      .filter((url): url is string => Boolean(url?.trim()))
      .map(createRemotePatternFromUrl)
      .filter((pattern): pattern is RemotePattern => pattern !== null),
  ];
  const dedupedPatterns = new Map<string, RemotePattern>();

  patterns.forEach((pattern) => {
    dedupedPatterns.set(getRemotePatternKey(pattern), pattern);
  });

  return [...dedupedPatterns.values()];
}
