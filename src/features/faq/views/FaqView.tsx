import * as React from "react";
import { FaqHero } from "../components/FaqHero";
import { EndBanner } from "@/components/layout/EndBanner";
import { Banner } from "@/components/layout/Banner";

interface FaqViewProps {
  data?: any;
}

export function FaqView({ data }: FaqViewProps) {
  return (
    <>
      <FaqHero data={{ cover: data?.cover_section, faqs: data?.faq }} />
      <EndBanner
        variant="expanded"
        title="¿Aún tienes dudas? Hablemos."
        description=""
      />
      <Banner data={data?.advisor_registration} />
    </>
  );
}
