/**
 * @fileoverview AsesorRequirements — sección que describe los requisitos de afiliación.
 */

"use client";

import Image from "next/image";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";
import {
  resolvePromoterAsset,
  sortByOrder,
  type PromoterDetail,
  type PromoterRequirements,
} from "../../data/cmsPromoter";

interface AsesorRequirementsProps {
  data?: PromoterRequirements;
}

export function AsesorRequirements({ data }: AsesorRequirementsProps) {
  const header = data?.header;
  const items: PromoterDetail[] =
    data?.items && data.items.length > 0
      ? sortByOrder(data.items)
      : [
          { title: "Documento de identidad vigente (DNI)" },
          { title: "Constancia de CUIL/CUIT" },
          { title: "Datos bancarios para recibir comisiones" },
          { title: "Comprobante de domicilio actualizado" },
        ];

  const subtitle = header?.label || header?.subtitle || "Requisitos";
  const title = header?.title || "¿Qué necesitás para afiliarte?";
  const description =
    header?.description ||
    "Los requisitos son simples y están pensados para que puedas comenzar de manera ordenada y profesional.";
  const requirementTitle = header?.requirement_title || "Documentación básica";
  const imageUrl = resolvePromoterAsset(
    header?.image ?? header?.image_url,
    "/images/image14.png",
  );

  return (
    <section className="wrapper-section">
      <div className="wrapper-content">
        {/* Cabecera */}
        <div className="flex flex-col gap-6 mb-12 items-center text-center max-w-[800px] mx-auto">
          <AnimateOnScroll variant="slide-up">
            <span className="text-gray-400 text-body-medium font-medium uppercase">
              {subtitle}
            </span>
          </AnimateOnScroll>
          <AnimateOnScroll variant="slide-up" delay={0.1}>
            <h2 className="heading-h3 text-foreground">{title}</h2>
          </AnimateOnScroll>
          <AnimateOnScroll variant="slide-up" delay={0.2}>
            <div className="flex flex-col gap-4">
              <p className="text-gray-500 text-body-medium">{description}</p>
              {!data && (
                <p className="text-gray-400 text-body-small">
                  Los requisitos específicos y montos pueden variar. Consultá
                  con el equipo de afiliación para obtener información
                  actualizada y resolver tus dudas.
                </p>
              )}
            </div>
          </AnimateOnScroll>
        </div>

        {/* Card Central con Efecto Radial */}
        <AnimateOnScroll variant="fade" delay={0.3}>
          <div className="w-full bg-primary-soft-gray-light rounded-lg p-3 relative overflow-hidden lg:h-[524px] max-w-[1116px] mx-auto">
            {/* Gradiente Radial Figma */}
            <div
              className="absolute pointer-events-none"
              style={{
                width: "1166px",
                height: "1166px",
                right: "-565px",
                bottom: "-559px",
                background:
                  "radial-gradient(50% 50% at 50% 50%, rgba(255, 108, 16, 0.15) 0%, rgba(255, 255, 255, 0) 100%)",
                zIndex: 0,
              }}
            />

            <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-8 items-stretch relative z-10 h-full">
              {/* Columna 1 (Izquierda): Imagen */}
              <div className="relative min-h-[350px] lg:min-h-full rounded-md overflow-hidden">
                <Image
                  src={imageUrl}
                  alt={title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
              </div>

              {/* Columna 2 (Derecha): Documentación + CTA */}
              <div className="flex flex-col justify-between p-4 lg:py-8">
                <div>
                  <h3 className="heading-h5 text-primary mb-6">
                    {requirementTitle}
                  </h3>
                  <ul className="flex flex-col gap-5">
                    {items.map((item, idx) => (
                      <li
                        key={item.id ?? item.title ?? idx}
                        className="flex items-start gap-4"
                      >
                        <span className="text-body-lg font-bold text-primary">
                          {idx + 1}.
                        </span>
                        <p className="text-body-medium text-gray-600">
                          {item.title || item.description}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA de Soporte dentro de la card */}
                <div className="flex flex-col items-end justify-end gap-4 mt-8 lg:mt-0">
                  <p className="text-body-small text-gray-500">
                    ¿Aún tienes dudas?, háblanos.
                  </p>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full lg:w-auto"
                    icon={<MessageCircle size={18} />}
                    iconPosition="right"
                  >
                    CONTACTAR CON SOPORTE
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
