import * as React from "react";
import type { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import { FaqView, type FaqPageData } from "@/features/faq";
import { cmsApi } from "@/lib/cms-api";
import { CMS_PAGE_SCHEMAS } from "@/lib/cms-data";
import { getOptionalCmsPageData } from "@/lib/cms-page-data";
import { createPageMetadata, SEO_IMAGES } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Ayuda y contacto",
  description: "Encuentra respuestas a tus preguntas frecuentes y contáctanos para recibir ayuda personalizada sobre Terbol.",
  path: "/faq",
  image: SEO_IMAGES.faq,
});

export default async function FaqPage() {
  const helpData = await getOptionalCmsPageData<FaqPageData>(
    () => cmsApi.getHelp(),
    CMS_PAGE_SCHEMAS.help,
    "help",
  );

  return (
    <PageLayout>
      <React.Suspense fallback={<div className="min-h-screen flex items-center justify-center">Cargando...</div>}>
        <FaqView data={helpData} />
      </React.Suspense>
    </PageLayout>
  );
}
