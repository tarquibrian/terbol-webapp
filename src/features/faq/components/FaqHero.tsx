"use client";

import * as React from "react";
import { Button } from "@/components/ui/Button";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";
import { Accordion } from "@/components/ui/Accordion/Accordion";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { FAQ_DATA } from "../data/faqData";

interface FaqItemData {
  id: string | number;
  question: string;
  answer: string;
  order?: number;
}

interface FaqHeroProps {
  data?: {
    cover?: {
      label?: string;
      title?: string;
      description?: string;
      country_code?: string;
      phone_number?: string;
    };
    faqs?: FaqItemData[];
  };
}

export function FaqHero({ data }: FaqHeroProps) {
  const cover = data?.cover || {
    label: "AYUDA Y CONTACTO",
    title: "¿Cómo podemos ayudarte hoy?",
    description: "Estamos aquí para resolver todas tus dudas sobre nuestros productos, tu proceso de compra o nuestro modelo de negocio para asesores.",
    country_code: "+591",
    phone_number: "67891234"
  };

  const faqs = data?.faqs && data.faqs.length > 0 
    ? data.faqs.map(faq => ({
        id: String(faq.id),
        question: faq.question,
        answer: faq.answer,
      }))
    : FAQ_DATA;

  // Formato para el enlace de WhatsApp
  const whatsappNumber = `${cover.country_code}${cover.phone_number}`.replace(/\D/g, "");
  const whatsappUrl = `https://wa.me/${whatsappNumber}`;

  return (
    <section className="wrapper-section pt-32 pb-16 md:pb-24">
      <div className="wrapper-content">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Columna Izquierda: Información y Botón */}
          <div className="flex flex-col gap-8 lg:sticky lg:top-32">
            <AnimateOnScroll
              variant="slide-up"
              className="flex flex-col gap-6 items-start"
            >
              <div className="text-body-small font-medium text-gray-500 bg-primary-soft-gray-balance px-3 py-1 rounded-full flex items-center gap-2 uppercase">
                <div className="h-2 w-2 bg-gray-300 rounded-full"></div>
                {cover.label}
              </div>

              <h1 className="heading-h2 font-semibold text-gray-900 leading-tight">
                {cover.title}
              </h1>

              <p className="text-body-large text-gray-500 whitespace-pre-line">
                {cover.description}
              </p>

              <Button
                variant="secondary"
                size="default"
                icon={<WhatsAppIcon className="h-5 w-5 -translate-y-px" />}
                iconPosition="right"
                className="mt-4"
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Contáctanos
              </Button>
            </AnimateOnScroll>
          </div>

          {/* Columna Derecha: Accordion FAQ */}
          <div className="flex flex-col gap-4 w-full">
            <AnimateOnScroll variant="slide-up">
              <h2 className="heading-h5 font-bold text-gray-900 mb-2">
                Preguntas Frecuentes (FAQ)
              </h2>
            </AnimateOnScroll>

            <AnimateOnScroll variant="slide-up" delay={0.2}>
              <Accordion items={faqs} />
            </AnimateOnScroll>
          </div>
        </div>
      </div>
    </section>
  );
}
