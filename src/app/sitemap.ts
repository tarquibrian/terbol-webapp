import type { MetadataRoute } from "next";
import { getProductSitemapIds } from "@/features/products/api/products-api";
import { getAbsoluteUrl } from "@/lib/seo";

type SitemapEntryConfig = {
  path: string;
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;
  priority: number;
};

const STATIC_ROUTES = [
  { path: "", changeFrequency: "weekly", priority: 1 },
  { path: "/about", changeFrequency: "monthly", priority: 0.8 },
  { path: "/faq", changeFrequency: "monthly", priority: 0.8 },
  { path: "/products", changeFrequency: "weekly", priority: 0.9 },
  { path: "/promoter", changeFrequency: "monthly", priority: 0.8 },
  { path: "/science-and-quality", changeFrequency: "monthly", priority: 0.8 },
  { path: "/success-plan", changeFrequency: "monthly", priority: 0.8 },
] as const satisfies readonly SitemapEntryConfig[];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();
  const staticRoutes = STATIC_ROUTES.map((route) => ({
    url: getAbsoluteUrl(route.path),
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
  const productIds = await getProductSitemapIds();
  const productRoutes = productIds.map((id) => ({
    url: getAbsoluteUrl(`/products/${encodeURIComponent(id)}`),
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Blog queda accesible por URL directa, pero no se publica en navegacion ni
  // sitemap mientras el modulo este oculto comercialmente.
  return [...staticRoutes, ...productRoutes];
}
