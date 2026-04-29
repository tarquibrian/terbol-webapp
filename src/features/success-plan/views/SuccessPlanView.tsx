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

interface SuccessPlanViewProps {
  data?: any;
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
