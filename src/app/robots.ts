import { MetadataRoute } from "next";
import { env } from "@/config/env";

/**
 * Genera dinámicamente el archivo robots.txt en tiempo de build o runtime.
 *
 * Utiliza la variable centralizada `env.SITE_URL` para indicar a los
 * rastreadores (como Googlebot) dónde encontrar el mapa del sitio oficial,
 * ayudando a la indexación correcta (incluyendo la influencia de Sitelinks).
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      // Permite que cualquier bot (Google, Bing, Yahoo, etc.) lea tu web.
      userAgent: "*",
      
      // Permite el acceso a todas las rutas por defecto.
      allow: "/",
      
      // Deniega el acceso a rutas internas que no nos interesa indexar.
      // Así evitamos gastar recursos del crawler ("Crawl Budget") en APIs internas.
      disallow: "/api/",
    },
    // Le indica automáticamente el dominio donde está el sitemap en base al entorno.
    sitemap: `${env.SITE_URL}/sitemap.xml`,
  };
}
