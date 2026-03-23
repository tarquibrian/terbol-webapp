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
// Ya no necesitamos importar Navbar aquí porque ahora vive en app/layout.tsx
// Se mantiene este archivo por retrocompatibilidad con las páginas existentes.

/** Props del componente PageLayout */
interface PageLayoutProps {
  /** Contenido de la página */
  children: React.ReactNode;
}

/**
 * Layout base de la aplicación (Heredado).
 * Ahora la estructura (Navbar + Footer) reside globalmente en RootLayout (app/layout.tsx)
 * para permitir que PageTransition anime solo el contenido sin animar el Navbar.
 * 
 * @param props.children - Contenido específico de la página
 */
export function PageLayout({ children }: PageLayoutProps) {
  return <>{children}</>;
}
