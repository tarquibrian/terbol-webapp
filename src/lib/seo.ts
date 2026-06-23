import type { Metadata } from "next";
import { env } from "@/config/env";

export const SITE_NAME = "Terbol";

export const DEFAULT_SEO = {
  title: "Terbol — Soluciones para la salud",
  description:
    "Descubre productos farmacéuticos, suplementos y vitaminas de alta calidad para cuidar tu salud y bienestar.",
  path: "/",
} as const;

export interface SeoImage {
  url: string;
  width?: number;
  height?: number;
  alt: string;
}

export const SEO_IMAGES = {
  default: {
    url: "/banner/productbanner.png",
    width: 698,
    height: 464,
    alt: "Productos Terbol para salud y bienestar",
  },
  home: {
    url: "/banner/productbanner.png",
    width: 698,
    height: 464,
    alt: "Productos Terbol Inspira para salud y bienestar",
  },
  about: {
    url: "/about/aboutproduct.png",
    width: 467,
    height: 572,
    alt: "Producto Terbol destacado",
  },
  blog: {
    url: "/images/image14.png",
    width: 1667,
    height: 1110,
    alt: "Contenido de salud y bienestar Terbol",
  },
  faq: {
    url: "/images/endbanner2.png",
    width: 680,
    height: 323,
    alt: "Atención y ayuda Terbol",
  },
  promoter: {
    url: "/images/image18.png",
    width: 1667,
    height: 1110,
    alt: "Comunidad de promotoras Terbol",
  },
  science: {
    url: "/images/image19.png",
    width: 1667,
    height: 1110,
    alt: "Ciencia y calidad Terbol",
  },
  successPlan: {
    url: "/images/image20.png",
    width: 1667,
    height: 1110,
    alt: "Plan de éxito Terbol",
  },
  products: {
    url: "/banner/productbanner.png",
    width: 698,
    height: 464,
    alt: "Catálogo de productos Terbol",
  },
} as const satisfies Record<string, SeoImage>;

interface CreatePageMetadataOptions {
  title: string;
  description: string;
  path: string;
  image?: SeoImage;
  noIndex?: boolean;
}

export function getCanonicalPath(path: string) {
  if (!path || path === "/") return "/";

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return normalizedPath.replace(/\/+$/, "");
}

export function getAbsoluteUrl(path: string) {
  const siteUrl = env.SITE_URL.replace(/\/$/, "");
  const canonicalPath = getCanonicalPath(path);

  return canonicalPath === "/" ? siteUrl : `${siteUrl}${canonicalPath}`;
}

export function createOpenGraphImage(image: SeoImage) {
  return {
    url: image.url,
    width: image.width,
    height: image.height,
    alt: image.alt,
  };
}

export function createPageMetadata({
  title,
  description,
  path,
  image = SEO_IMAGES.default,
  noIndex = false,
}: CreatePageMetadataOptions): Metadata {
  const canonicalPath = getCanonicalPath(path);

  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath,
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
        },
    openGraph: {
      title,
      description,
      url: canonicalPath,
      siteName: SITE_NAME,
      locale: "es_ES",
      type: "website",
      images: [createOpenGraphImage(image)],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image.url],
    },
  };
}
