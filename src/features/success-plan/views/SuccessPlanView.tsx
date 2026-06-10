/**
 * @fileoverview SuccessPlanView — vista completa de la página "Plan de Éxito".
 *
 * Compone los componentes del feature `success-plan`.
 * Importada por `app/success-plan/page.tsx` como thin wrapper.
 */

import * as React from "react";
import { SuccessPlanHero } from "../components/SuccessPlanHero";
import { About } from "@/features/home/components/About";
import { SuccessPlanFeaturesSection } from "../components/SuccessPlanFeaturesSection/SuccessPlanFeaturesSection";
import { SuccessPlanStepsSection } from "../components/SuccessPlanStepsSection/SuccessPlanStepsSection";
import { AdvisorBanner, getAdvisorWhatsAppUrl } from "@/components/layout/AdvisorBanner";

export interface SuccessPlanPageData {
  plan?: React.ComponentProps<typeof SuccessPlanHero>["data"];
  video_section?: React.ComponentProps<typeof About>["data"];
  our_proposal?: React.ComponentProps<typeof SuccessPlanFeaturesSection>["data"];
  how_it_works?: React.ComponentProps<typeof SuccessPlanStepsSection>["data"];
}

interface SuccessPlanViewProps {
  data?: SuccessPlanPageData;
}

export async function SuccessPlanView({ data }: SuccessPlanViewProps) {
  const whatsappUrl = await getAdvisorWhatsAppUrl();

  return (
    <>
      <SuccessPlanHero data={data?.plan} whatsappUrl={whatsappUrl} />
      <About data={data?.video_section} />
      <SuccessPlanFeaturesSection data={data?.our_proposal} />
      <SuccessPlanStepsSection data={data?.how_it_works} />
      <AdvisorBanner />
    </>
  );
}
