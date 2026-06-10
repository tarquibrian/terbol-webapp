import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { PageTransition } from "@/components/layout/PageTransition";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { env } from "@/config/env";
import { cmsApi } from "@/lib/cms-api";
import type { CmsSocialNetwork } from "@/lib/cms-social";
import {
  createOpenGraphImage,
  DEFAULT_SEO,
  SEO_IMAGES,
  SITE_NAME,
} from "@/lib/seo";
import "./globals.css";

// Configuración de Roboto con las variantes solicitadas: regular(400), medium(500), semibold(600), bold(700)
const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-roboto",
});

/**
 * Metadatos base globales de la aplicación.
 *
 * `metadataBase` resuelve el warning de build y permite que Next.js construya
 * URLs absolutas para Open Graph, Twitter cards e imágenes SEO.
 *
 * Para cambiar el dominio en producción, simplemente setear la variable de
 * entorno `NEXT_PUBLIC_SITE_URL` en el panel del hosting. Ningún archivo de
 * código necesita modificarse.
 */
export const metadata: Metadata = {
  metadataBase: new URL(env.SITE_URL),
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/favicons/favicon_16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicons/favicon_32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicons/favicon_48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/favicons/favicon_64x64.png", sizes: "64x64", type: "image/png" },
      { url: "/favicons/favicon_128x128.png", sizes: "128x128", type: "image/png" },
      { url: "/favicons/favicon_256x256.png", sizes: "256x256", type: "image/png" },
    ],
    shortcut: [{ url: "/favicons/favicon_32x32.png", type: "image/png" }],
    apple: [
      { url: "/favicons/favicon_256x256.png", sizes: "256x256", type: "image/png" },
    ],
  },
  title: {
    default: DEFAULT_SEO.title,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_SEO.description,
  openGraph: {
    siteName: SITE_NAME,
    type: "website",
    locale: "es_ES",
    title: DEFAULT_SEO.title,
    description: DEFAULT_SEO.description,
    url: DEFAULT_SEO.path,
    images: [createOpenGraphImage(SEO_IMAGES.default)],
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_SEO.title,
    description: DEFAULT_SEO.description,
    images: [SEO_IMAGES.default.url],
  },
};

interface FooterResponse {
  social_networks?: CmsSocialNetwork[];
}

async function getFooterSocialNetworks(): Promise<CmsSocialNetwork[] | undefined> {
  try {
    const response = await cmsApi.getFooter();
    const data = response?.data as FooterResponse | undefined;

    return data?.social_networks;
  } catch {
    return undefined;
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const socialNetworks = await getFooterSocialNetworks();

  return (
    <html lang="es">
      <body className={`${roboto.variable} antialiased flex min-h-screen flex-col overflow-y-scroll`}>
        <Navbar />
        <PageTransition enterDuration={0.3} exitDuration={0.3}>
          <main className="flex-1 pt-[100px]">
            {children}
          </main>
        </PageTransition>

        {/* Footer Global */}
        <Footer socialNetworks={socialNetworks} />
      </body>
    </html>
  );
}
