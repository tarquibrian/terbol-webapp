/**
 * @fileoverview HomeView — vista principal de la página de inicio.
 *
 * Compone todos los componentes del feature `home` en una vista completa.
 * Esta vista es importada por `app/page.tsx` como thin wrapper.
 *
 * @see {@link ../components/Hero/Hero.tsx} para el componente Hero.
 */

import * as React from "react";
import { Hero } from "../components/Hero";
import { FeaturedProducts } from "../components/FeaturedProducts";
import { Testimonials } from "../components/Testimonials";
import { Newsletter } from "../components/Newsletter";

/**
 * Vista completa de la página Home.
 *
 * Organiza la composición de las secciones de la landing.
 * A medida que crezca el home, se agregan más secciones aquí.
 */
export function HomeView() {
  return (
    <>
      <Hero />
      <FeaturedProducts />
      <Testimonials />
      <Newsletter />
    </>
  );
}
