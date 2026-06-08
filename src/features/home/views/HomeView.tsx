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
import { About } from "../components/About";
import { ProductPillars } from "../components/ProductPillars";
import { DevelopmentSteps } from "../components/DevelopmentSteps";
import { Banner } from "@/components/layout/Banner";

export interface HomePageData {
  hero_section?: React.ComponentProps<typeof Hero>["data"];
  video_section?: React.ComponentProps<typeof About>["data"];
  pillars?: React.ComponentProps<typeof ProductPillars>["data"];
  development_products?: React.ComponentProps<typeof DevelopmentSteps>["data"];
  advisor_registration?: React.ComponentProps<typeof Banner>["data"];
}

interface HomeViewProps {
  data?: HomePageData;
}

/**
 * Vista completa de la página Home.
 *
 * Organiza la composición de las secciones de la landing.
 * A medida que crezca el home, se agregan más secciones aquí.
 */
export function HomeView({ data }: HomeViewProps) {
  return (
    <>
      <Hero data={data?.hero_section} />
      <About data={data?.video_section} />
      <FeaturedProducts />
      <ProductPillars data={data?.pillars} />
      <DevelopmentSteps data={data?.development_products} />
      <Banner data={data?.advisor_registration} />
      {/* NUEVA SECCION AQUI */}
    </>
  );
}
