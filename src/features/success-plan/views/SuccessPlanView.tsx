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

export function SuccessPlanView() {
  return (
    <>
      <SuccessPlanHero />
      <About />
      <SuccessPlanFeaturesSection />
      <SuccessPlanStepsSection />
      <Banner />
    </>
  );
}
