/**
 * @fileoverview ScienceQualityView — vista completa de la página "Ciencia y Calidad".
 *
 * Compone los componentes del feature `science-and-quality`.
 */

import * as React from "react";
import { ScienceHero } from "../components/ScienceHero";
import { ScienceDevelopmentSteps } from "../components/ScienceDevelopmentSteps";
import { ScienceAbout } from "../components/ScienceAbout";
import { Banner } from "@/components/layout/Banner";

interface ScienceQualityViewProps {
  data?: any;
}

export function ScienceQualityView({ data }: ScienceQualityViewProps) {
  return (
    <>
      <ScienceHero data={data?.cover_section} />
      <ScienceDevelopmentSteps data={data?.development_products} />
      <ScienceAbout data={data?.evidence} />
      <Banner data={data?.advisor_registration} />
    </>
  );
}
