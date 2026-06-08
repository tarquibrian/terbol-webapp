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
import { Banner } from "@/components/layout/Banner";

export interface SuccessPlanPageData {
  plan?: React.ComponentProps<typeof SuccessPlanHero>["data"];
  video_section?: React.ComponentProps<typeof About>["data"];
  our_proposal?: React.ComponentProps<typeof SuccessPlanFeaturesSection>["data"];
  how_it_works?: React.ComponentProps<typeof SuccessPlanStepsSection>["data"];
  advisor_registration?: React.ComponentProps<typeof Banner>["data"];
}

interface SuccessPlanViewProps {
  data?: SuccessPlanPageData;
}

export function SuccessPlanView({ data }: SuccessPlanViewProps) {
  return (
    <>
      <SuccessPlanHero data={data?.plan} />
      <About data={data?.video_section} />
      <SuccessPlanFeaturesSection data={data?.our_proposal} />
      <SuccessPlanStepsSection data={data?.how_it_works} />
      <Banner data={data?.advisor_registration} />
    </>
  );
}
