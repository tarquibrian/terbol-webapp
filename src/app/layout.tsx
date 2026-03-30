import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { PageTransition } from "@/components/layout/PageTransition";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { env } from "@/config/env";
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
  title: {
    default: "Terbol — Soluciones para la salud",
    template: "%s | Terbol",
  },
  description:
    "Descubre nuestra amplia gama de productos farmacéuticos y suplementos de alta calidad. Terbol: comprometidos con tu salud y bienestar.",
  openGraph: {
    siteName: "Terbol",
    type: "website",
    locale: "es_ES",
    // Cada página puede sobreescribir title, description e images.
    // Esto actúa como fallback global.
    title: "Terbol — Soluciones para la salud",
    description:
      "Descubre nuestra amplia gama de productos farmacéuticos y suplementos de alta calidad.",
    images: [
      {
        // Imagen placeholder hasta que exista la imagen OG oficial.
        // Reemplazar con la imagen final: /images/og-default.jpg
        url: "/logo-terbol-main.svg",
        width: 1200,
        height: 630,
        alt: "Terbol — Soluciones para la salud",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Terbol — Soluciones para la salud",
    description:
      "Descubre nuestra amplia gama de productos farmacéuticos y suplementos de alta calidad.",
    images: ["/logo-terbol-main.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
        <Footer />
      </body>
    </html>
  );
}
