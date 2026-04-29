import * as React from "react";
import type { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import { FaqView } from "@/features/faq";
import { cmsApi } from "@/lib/cms-api";

export const metadata: Metadata = {
  title: "Ayuda y Contacto - Terbol",
  description: "Encuentra respuestas a tus preguntas frecuentes y contáctanos para recibir ayuda personalizada sobre Terbol.",
};

export default async function FaqPage() {
  const helpDataResponse = await cmsApi.getHelp();
  const helpData = helpDataResponse?.data;

  return (
    <PageLayout>
      <React.Suspense fallback={<div className="min-h-screen flex items-center justify-center">Cargando...</div>}>
        <FaqView data={helpData} />
      </React.Suspense>
    </PageLayout>
  );
}
