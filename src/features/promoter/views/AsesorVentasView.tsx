/**
 * @fileoverview AsesorVentasView — vista completa de la página "Asesor de Ventas".
 */

import { AsesorHero } from "../components/AsesorHero/AsesorHero";
import { AsesorBenefits } from "../components/AsesorBenefits/AsesorBenefits";
import { RoleDescription } from "../components/RoleDescription/RoleDescription";
import { AsesorRequirements } from "../components/AsesorRequirements/AsesorRequirements";
import { AsesorSteps } from "../components/AsesorSteps/AsesorSteps";
import { AdvisorBanner } from "@/components/layout/AdvisorBanner";
import type { PromoterPageData } from "../data/cmsPromoter";

interface AsesorVentasViewProps {
  data?: PromoterPageData;
}

export function AsesorVentasView({ data }: AsesorVentasViewProps) {
  return (
    <>
      <AsesorHero data={data?.cover_section} />
      <RoleDescription data={data?.meaning} />
      <AsesorBenefits data={data?.why_be} />
      <AsesorRequirements data={data?.requirements} />
      <AsesorSteps data={data?.affiliation_process} />
      <div id="advisor-registration">
        <AdvisorBanner />
      </div>
    </>
  );
}
