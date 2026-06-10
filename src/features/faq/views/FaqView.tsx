import * as React from "react";
import { FaqHero } from "../components/FaqHero";
import { EndBanner } from "@/components/layout/EndBanner";
import { AdvisorBanner, getAdvisorWhatsAppUrl } from "@/components/layout/AdvisorBanner";

export interface FaqPageData {
  cover_section?: React.ComponentProps<typeof FaqHero>["data"] extends infer T
    ? T extends { cover?: infer Cover }
      ? Cover
      : never
    : never;
  faq?: React.ComponentProps<typeof FaqHero>["data"] extends infer T
    ? T extends { faqs?: infer Faqs }
      ? Faqs
      : never
    : never;
}

interface FaqViewProps {
  data?: FaqPageData;
}

export async function FaqView({ data }: FaqViewProps) {
  const whatsappUrl = await getAdvisorWhatsAppUrl();

  return (
    <>
      <FaqHero data={{ cover: data?.cover_section, faqs: data?.faq }} />
      <EndBanner
        variant="expanded"
        title="¿Aún tienes dudas? Hablemos."
        description=""
        whatsappUrl={whatsappUrl}
      />
      <AdvisorBanner />
    </>
  );
}
