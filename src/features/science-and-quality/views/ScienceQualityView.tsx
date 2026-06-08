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

export interface ScienceQualityPageData {
  cover_section?: React.ComponentProps<typeof ScienceHero>["data"];
  development_products?: React.ComponentProps<typeof ScienceDevelopmentSteps>["data"];
  evidence?: React.ComponentProps<typeof ScienceAbout>["data"];
  advisor_registration?: React.ComponentProps<typeof Banner>["data"];
}

interface ScienceQualityViewProps {
  data?: ScienceQualityPageData;
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
