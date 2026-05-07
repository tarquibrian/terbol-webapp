import type { MetadataRoute } from "next";
import { env } from "@/config/env";

const STATIC_ROUTES = [
  "",
  "/about",
  "/blog",
  "/faq",
  "/products",
  "/promoter",
  "/science-and-quality",
  "/success-plan",
] as const;

function getAbsoluteUrl(path: string): string {
  const siteUrl = env.SITE_URL.replace(/\/$/, "");

  return `${siteUrl}${path}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  // TODO: Agregar /blog/{id} cuando backend confirme paginación o endpoint liviano.
  return STATIC_ROUTES.map((route) => ({
    url: getAbsoluteUrl(route),
    lastModified,
    changeFrequency: route === "" || route === "/blog" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.8,
  }));
}
