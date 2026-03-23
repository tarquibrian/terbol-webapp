import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { PageTransition } from "@/components/layout/PageTransition";
import { Navbar } from "@/components/layout/Navbar";
import "./globals.css";

// Configuración de Roboto con las variantes solicitadas: regular(400), medium(500), semibold(600), bold(700)
const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "Terbol Ecommerce",
  description: "Terbol Ecommerce Base Architecture",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${roboto.variable} antialiased flex min-h-screen flex-col`}>
        <Navbar />
        <PageTransition enterDuration={0.3} exitDuration={0.3}>
          <main className="flex-1">
            {children}
          </main>
        </PageTransition>

        {/* Footer Global */}
        <footer className="border-t py-6 md:py-8 lg:py-12 mt-auto">
          <div className="container mx-auto px-4 md:px-6">
            <p className="text-center text-sm text-muted-foreground">
              © 2026 Terbol Ecommerce. Todos los derechos reservados.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
