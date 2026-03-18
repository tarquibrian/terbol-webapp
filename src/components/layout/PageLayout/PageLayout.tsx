/**
 * @fileoverview Componente PageLayout — estructura base compartida para todas las páginas.
 *
 * Encapsula el layout común de la aplicación:
 * - Navbar (sticky top)
 * - Contenido principal (children)
 * - Footer
 *
 * Al usar este componente, cada página solo necesita preocuparse por su
 * contenido específico, eliminando la duplicación de Navbar + Footer.
 *
 * @example
 * <PageLayout>
 *   <HeroSection />
 *   <ProductGrid />
 * </PageLayout>
 */

import * as React from "react";
import { Navbar } from "@/components/layout/Navbar";

/** Props del componente PageLayout */
interface PageLayoutProps {
  /** Contenido de la página que se renderiza entre Navbar y Footer */
  children: React.ReactNode;
}

/**
 * Layout base de la aplicación.
 *
 * Provee la estructura consistente de Navbar + main + Footer
 * para todas las páginas del ecommerce.
 *
 * @param props.children - Contenido específico de la página
 */
export function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        {children}
      </main>

      {/* Footer — futuro componente extraíble a components/layout/Footer */}
      <footer className="border-t py-6 md:py-8 lg:py-12 mt-auto">
        <div className="container mx-auto px-4 md:px-6">
          <p className="text-center text-sm text-muted-foreground">
            © 2026 Terbol Ecommerce. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
