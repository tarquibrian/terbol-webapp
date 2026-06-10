/**
 * @fileoverview ScienceHero — sección hero de la página "Ciencia y Calidad".
 *
 * Componente de presentación con título y descripción sobre la ciencia y calidad de Térbol.
 */

"use client";

import * as React from "react";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";
import { Button } from "@/components/ui/Button";
import { ArrowRight, MessageCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { resolveImageAsset } from "@/lib/image-assets";

interface DetailItem {
  id: number | string;
  title: string;
  icon?: string;
}

interface ScienceHeroProps {
  data?: {
    header?: {
      label?: string;
      title?: string;
      description?: string;
    };
    details?: DetailItem[];
  };
  /** URL directa de WhatsApp (wa.me/...) para el botón de contacto */
  whatsappUrl?: string;
}

/**
 * Hero de la sección Ciencia y Calidad.
 */
export function ScienceHero({ data, whatsappUrl }: ScienceHeroProps) {
  const getIconUrl = (path?: string) => {
    return resolveImageAsset(path);
  };

  const header = data?.header || {
    label: "RESPALDO CIENTÍFICO",
    title: "Ciencia y calidad en cada fórmula",
    description:
      "En Térbol Inspira, cada producto nace de un proceso riguroso de investigación y desarrollo. No seguimos fórmulas genéricas: diseñamos combinaciones específicas con ingredientes de calidad probada y dosis respaldadas por evidencia.",
  };

  const details = data?.details || [];

  return (
    <section className="wrapper-section">
      <div className="wrapper-content flex flex-col items-center gap-6 min-h-[400px] justify-center">
        {/* Etiqueta superior */}
        <div className="text-body-small font-medium text-gray-500 bg-primary-soft-gray-balance px-3 py-1 rounded-full flex items-center gap-2 uppercase">
          <div className="h-2 w-2 bg-gray-300 rounded-full"></div>
          {header.label}
        </div>

        {/* Título — slide-up inmediato */}
        <AnimateOnScroll variant="slide-up">
          <h1 className="heading-h2 font-semibold text-foreground text-center">
            {header.title}
          </h1>
        </AnimateOnScroll>

        {/* Descripción — slide-up con delay */}
        <AnimateOnScroll variant="slide-up" delay={0.15}>
          <p className="text-body-medium text-center text-gray-500 max-w-[800px] mb-2 whitespace-pre-line">
            {header.description}
          </p>
        </AnimateOnScroll>

        {/* Detalles extras del hero (si existen) */}
        {details.length > 0 && (
          <AnimateOnScroll
            variant="slide-up"
            delay={0.2}
            className="flex gap-4 md:gap-8 flex-wrap justify-center mt-4"
          >
            {details.map((detail) => (
              <div key={detail.id} className="flex items-center gap-3">
                {getIconUrl(detail.icon) && (
                  <div className="w-6 h-6 relative">
                    <Image
                      src={getIconUrl(detail.icon)!}
                      alt={detail.title}
                      fill
                      sizes="24px"
                      className="object-contain"
                    />
                  </div>
                )}
                <span className="text-body-medium font-medium text-gray-600">
                  {detail.title}
                </span>
              </div>
            ))}
          </AnimateOnScroll>
        )}

        {/* Botones de acción */}
        <AnimateOnScroll
          variant="slide-up"
          delay={0.3}
          className="flex gap-4 md:flex-row flex-col w-full items-center justify-center mt-6"
        >
          <Button
            variant="default"
            size="default"
            className="w-full md:w-fit"
            icon={<MessageCircle strokeWidth={1.75} />}
            href={whatsappUrl}
            target={whatsappUrl ? "_blank" : undefined}
            rel={whatsappUrl ? "noopener noreferrer" : undefined}
          >
            Contactar por whatsapp
          </Button>
          <Link href="/promoter" className="min-w-full md:min-w-[300px]">
            <Button
              variant="outline"
              size="default"
              className="w-full"
              icon={<ArrowRight strokeWidth={1.75} />}
            >
              Saber más
            </Button>
          </Link>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
