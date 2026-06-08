/**
 * @fileoverview Hero — sección hero principal de la página Home.
 *
 * Usa AnimateOnScroll para animaciones de entrada:
 * - Título: slide-up (aparece subiendo desde abajo)
 * - Descripción: slide-up con delay
 * - Botones: slide-up con delay mayor (efecto stagger)
 * - Imagen: fade (aparece suavemente en su posición)
 */

"use client";

import * as React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";
import { ArrowRight } from "lucide-react";
import { resolveImageAsset } from "@/lib/image-assets";

interface HeroProps {
  data?: {
    label?: string;
    title?: string;
    description?: string;
    button_label?: string;
    button_url?: string;
    image?: string;
  };
}

export function Hero({ data }: HeroProps) {
  // Construir la URL completa de la imagen si viene del CMS, o usar el fallback
  const getImageUrl = (path?: string) => {
    return resolveImageAsset(path, "/images/productextra2.png") ?? "/images/productextra2.png";
  };

  const imageUrl = getImageUrl(data?.image);

  return (
    <section className="wrapper-section">
      <div className="wrapper-content">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_570px] items-center">
          <div className="flex flex-col justify-center space-y-8 max-w-[760px]">
            <div className="space-y-4">
              {/* Título — slide-up inmediato */}
              <AnimateOnScroll variant="slide-up">
                {data?.label && (
                  <div className="text-body-small uppercase font-medium text-gray-500 bg-primary-soft-gray-balance mb-4 px-3 py-1 rounded-full flex items-center gap-2 w-fit">
                    <div className="h-2 w-2 bg-gray-300 rounded-full"></div>
                    {data.label}
                  </div>
                )}
                <h1 className="heading-h1-bold">
                  {data?.title || "Inspiramos bienestar, transformamos vidas"}
                </h1>
              </AnimateOnScroll>

              {/* Descripción — slide-up con delay para efecto stagger */}
              <AnimateOnScroll variant="slide-up" delay={0.15}>
                <p className="text-gray-500 text-body-medium">
                  {data?.description ||
                    "Térbol Inspira nace para elevar tu calidad de vida. Una nueva gama de nutracéuticos de alta gama, respaldados por la trayectoria de Térbol y formulados con estricta evidencia científica."}
                </p>
              </AnimateOnScroll>
            </div>

            {/* Botones — slide-up con delay mayor */}
            <AnimateOnScroll variant="slide-up" delay={0.3}>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button
                  size="default"
                  className="w-full md:max-w-[440px] justify-between"
                  icon={<ArrowRight />}
                  iconPosition="right"
                  href={data?.button_url || "#"}
                >
                  {data?.button_label || "ÚNETE AL EQUIPO AHORA"}
                </Button>
              </div>
            </AnimateOnScroll>
          </div>

          <AnimateOnScroll
            variant="fade"
            delay={0.2}
            className="mx-auto flex w-full items-center justify-center lg:justify-end p-3 bg-primary-soft-gray-balance rounded-lg"
          >
            <div className="relative w-full aspect-video rounded-md overflow-hidden bg-primary-soft-gray-balance lg:aspect-video lg:h-[500px] p-3 flex items-center justify-center">
              <Image
                src={imageUrl}
                alt={data?.title || "Térbol Inspira"}
                fill
                className="object-cover w-full h-full"
                priority
                sizes="(max-width: 1024px) 100vw, 570px"
              />
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}
