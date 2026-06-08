import * as React from "react";
import { FaqHero } from "../components/FaqHero";
import { EndBanner } from "@/components/layout/EndBanner";
import { Banner } from "@/components/layout/Banner";

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
  advisor_registration?: React.ComponentProps<typeof Banner>["data"];
}

interface FaqViewProps {
  data?: FaqPageData;
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
