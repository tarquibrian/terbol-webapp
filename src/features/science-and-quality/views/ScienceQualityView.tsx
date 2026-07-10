/**
 * @fileoverview ScienceQualityView — vista completa de la página "Ciencia y Calidad".
 *
 * Compone los componentes del feature `science-and-quality`.
 */

import * as React from "react";
import { ScienceHero } from "../components/ScienceHero";
import { ScienceDevelopmentSteps } from "../components/ScienceDevelopmentSteps";
import { ScienceAbout } from "../components/ScienceAbout";
import { EndBanner } from "@/components/layout/EndBanner";
import { getAdvisorWhatsAppUrl } from "@/components/layout/AdvisorBanner";

export interface ScienceQualityPageData {
  cover_section?: React.ComponentProps<typeof ScienceHero>["data"];
  development_products?: React.ComponentProps<typeof ScienceDevelopmentSteps>["data"];
  evidence?: React.ComponentProps<typeof ScienceAbout>["data"];
}

interface ScienceQualityViewProps {
  data?: ScienceQualityPageData;
}

export async function ScienceQualityView({ data }: ScienceQualityViewProps) {
  const whatsappUrl = await getAdvisorWhatsAppUrl();

  return (
    <>
      <ScienceHero data={data?.cover_section} whatsappUrl={whatsappUrl} />
      <ScienceDevelopmentSteps data={data?.development_products} />
      <ScienceAbout data={data?.evidence} />
      <EndBanner />
    </>
  );
}
