/**
 * @fileoverview AboutHero — sección hero de la página "¿Quiénes somos?".
 *
 * Componente de presentación con título y descripción institucional.
 * Sigue el layout estándar: section full-width + container 1512px + px-16.
 *
 * Animaciones:
 * - Título: slide-up (aparece subiendo)
 * - Descripción: slide-up con delay (efecto stagger)
 */

"use client";

import * as React from "react";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";
import Image from "next/image";
import { resolveImageAsset } from "@/lib/image-assets";
import { assetPath } from "@/lib/base-path";

interface DetailItem {
  id: number | string;
  title: string;
  description: string;
  image?: string;
}

interface AboutHeroProps {
  data?: {
    header?: {
      label?: string;
      title?: string;
      description?: string;
    };
    details?: DetailItem[];
  };
}

/**
 * Hero de la sección About con información institucional de Terbol.
 */
export function AboutHero({ data }: AboutHeroProps) {
  const getImageUrl = (path?: string) => {
    return resolveImageAsset(path);
  };

  const header = data?.header || {
    label: "NUESTRA IDENTIDAD",
    title: "¿Qué es Térbol Inspira?",
    description:
      "En un mundo que avanza con velocidad, elegimos el valor del equilibrio. Así nace térbol I Inspira: una invitación a vivir más y vivir mejor, desde la ciencia, la conciencia y la excelencia.",
  };

  const defaultDetails: DetailItem[] = [
    {
      id: 1,
      title: "Nacida de Térbol",
      description:
        "Térbol Inspira es la evolución premium de Térbol, respaldada por su trayectoria en salud.",
      image: "/logo-terbol-main.svg", // fallback to root local static
    },
    {
      id: 2,
      title: "Un enfoque diferente",
      description:
        "A diferencia del portafolio tradicional, Inspira se especializa exclusivamente en productos de alta gama con evidencia científica.",
      image: "/logo-terbol.svg", // fallback to root local static
    },
  ];

  const details =
    data?.details && data.details.length > 0 ? data.details : defaultDetails;

  return (
    <section className="wrapper-section">
      <div className="wrapper-content flex flex-col items-center gap-16">
        <div className="flex flex-col items-center gap-6">
          {/* Etiqueta */}
          <div className="text-body-small font-medium text-gray-500 bg-primary-soft-gray-balance px-3 py-1 rounded-full flex items-center gap-2">
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
            <p className="text-body-medium text-center text-gray-500 max-w-[800px] whitespace-pre-line">
              {header.description}
            </p>
          </AnimateOnScroll>
        </div>

        <div className="flex gap-4 max-w-[1024px] flex-col md:flex-row w-full justify-center">
          {details.map((detail, index) => {
            const isFromCms = detail.image && !detail.image.startsWith("/");
            const imgUrl = isFromCms
              ? getImageUrl(detail.image)
              : detail.image
                ? assetPath(detail.image)
                : detail.image;

            return (
              <AnimateOnScroll
                key={detail.id}
                variant="slide-up"
                delay={0.3 + index * 0.1}
                className="w-full p-6 bg-primary-soft-gray-balance rounded-lg h-fit md:min-h-[230px] flex flex-col gap-6 justify-between flex-1"
              >
                {/* LOGO o ICONO */}
                <div
                  className={`relative ${index === 0 ? "h-12" : "h-8"} w-fit`}
                >
                  {imgUrl && (
                    <Image
                      src={imgUrl}
                      alt={detail.title}
                      width={160}
                      height={48}
                      className="h-full w-auto object-contain"
                    />
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <h2 className="heading-h5">{detail.title}</h2>
                  <p className="text-gray-500 text-body-small">
                    {detail.description}
                  </p>
                </div>
              </AnimateOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}
