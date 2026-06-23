/**
 * @fileoverview AsesorSteps — Sección que describe los pasos del proceso de afiliación.
 */

"use client";

import { Button } from "@/components/ui/Button";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";
import { ArrowRight } from "lucide-react";
import {
  sortByOrder,
  type PromoterAffiliationProcess,
  type PromoterDetail,
} from "../../data/cmsPromoter";

interface AsesorStepsProps {
  data?: PromoterAffiliationProcess;
}

interface StepViewModel extends PromoterDetail {
  number: string;
  hasCTA?: boolean;
}

export function AsesorSteps({ data }: AsesorStepsProps) {
  const header = data?.header;
  const rawSteps = data?.steps && data.steps.length > 0 ? sortByOrder(data.steps) : null;

  const defaultSteps: StepViewModel[] = [
    {
      number: "01",
      title: "Contacto inicial",
      description: "Completás el formulario de afiliación o contactás al equipo para expresar tu interés.",
      hasCTA: true,
    },
    {
      number: "02",
      title: "Registro y documentación",
      description: "Enviás la documentación requerida y completás el proceso de registro en la plataforma oficial.",
    },
    {
      number: "03",
      title: "Primer pedido",
      description: "Realizás tu primera compra a precio de promotora para armar tu stock inicial de productos.",
    },
    {
      number: "04",
      title: "Comenzás a promover",
      description: "Accedés a capacitaciones, materiales y empezás a compartir los productos con tu red.",
    },
  ];

  const steps = rawSteps ? rawSteps.map((step, idx) => ({
    id: step.id,
    number: String(idx + 1).padStart(2, "0"),
    title: step.title,
    description: step.description,
    hasCTA: false,
  })) : defaultSteps;

  const subtitle = header?.label || header?.subtitle || "Proceso de afiliación";
  const title = header?.title || "¿Cómo es el proceso para afiliarte?";
  const description = header?.description || "El proceso de afiliación se realiza a través de la plataforma oficial de Térbol. Acá te explicamos los pasos generales.";

  return (
    <section className="wrapper-section bg-white">
      <div className="wrapper-content">
        {/* Cabecera */}
        <div className="flex flex-col gap-6 mb-16 items-center text-center max-w-[800px] mx-auto">
          <AnimateOnScroll variant="slide-up">
            <span className="text-gray-400 text-body-medium font-medium uppercase">
              {subtitle}
            </span>
          </AnimateOnScroll>
          <AnimateOnScroll variant="slide-up" delay={0.1}>
            <h2 className="heading-h3 text-foreground">
              {title}
            </h2>
          </AnimateOnScroll>
          <AnimateOnScroll variant="slide-up" delay={0.2}>
            <p className="text-gray-500 text-body-medium">
              {description}
            </p>
          </AnimateOnScroll>
        </div>

        {/* Grid de Pasos 1x4 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {steps.map((step, idx) => (
            <AnimateOnScroll
              key={step.id ?? step.title ?? idx}
              variant="slide-up"
              delay={idx * 0.1}
              className="flex flex-col gap-6"
            >
              <div className="flex flex-col gap-4">
                {/* Número + Línea */}
                <div className="flex items-center gap-3">
                  <span className="heading-h4 font-bold text-primary leading-none">
                    {step.number}
                  </span>
                  <div className="w-full h-px bg-primary-soft-gray-hard" />
                </div>

                {/* Título */}
                <h3 className="heading-h6-bold text-primary min-h-[50px] flex items-center">
                  {step.title ?? ""}
                </h3>

                {/* Descripción */}
                <p className="text-body-medium text-gray-500">
                  {step.description ?? ""}
                </p>
              </div>

              {/* CTA solo para el primer paso */}
              {step.hasCTA && (
                <div className="mt-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="px-8"
                    icon={<ArrowRight size={16} />}
                    iconPosition="right"
                  >
                    REGISTRARME
                  </Button>
                </div>
              )}
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
