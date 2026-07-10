/**
 * @fileoverview SuccessPlanView — vista completa de la página "Plan de Éxito".
 *
 * Compone los componentes del feature `success-plan`.
 * Importada por `app/success-plan/page.tsx` como thin wrapper.
 */

import * as React from "react";
import { About } from "@/features/home/components/About";
import { SuccessPlanStepsSection } from "../components/SuccessPlanStepsSection/SuccessPlanStepsSection";
import { AdvisorBanner, getAdvisorWhatsAppUrl } from "@/components/layout/AdvisorBanner";

export interface SuccessPlanPageData {
  video_section?: React.ComponentProps<typeof About>["data"];
  how_it_works?: React.ComponentProps<typeof SuccessPlanStepsSection>["data"];
}

interface SuccessPlanViewProps {
  data?: SuccessPlanPageData;
}

export async function SuccessPlanView({ data }: SuccessPlanViewProps) {
  const whatsappUrl = await getAdvisorWhatsAppUrl();

  return (
    <>
      <SuccessPlanStepsSection
        data={data?.how_it_works}
        whatsappUrl={whatsappUrl}
      />
      <About data={data?.video_section} />
      <AdvisorBanner />
    </>
  );
}
