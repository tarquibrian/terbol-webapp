"use client";

import { FeatureCard } from "@/components/ui/FeatureCard";
import Image from "next/image";
import { TrendingUp, User, Star, Lightbulb, type LucideIcon } from 'lucide-react';
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";
import { resolveImageAsset } from "@/lib/image-assets";
import * as React from "react";

interface EvidenceDetail {
  id: number | string;
  title: string;
  description: string;
  icon?: string;
}

interface ScienceAboutProps {
  data?: {
    header?: {
      label?: string;
      title?: string;
      description?: string;
      legend?: string;
      image?: string;
    };
    details?: EvidenceDetail[];
  };
}

export const ScienceAbout = ({ data }: ScienceAboutProps) => {
  const getImageUrl = (path?: string) => {
    return resolveImageAsset(path);
  };

  const header = data?.header || {
    label: "EVIDENCIA Y RESPALDO",
    title: "Productos basados en ciencia, no en tendencias",
    description: "Nuestros productos se apoyan en evidencia científica, documentación rigurosa y un compromiso constante con la calidad: lo que ves en cada fórmula tiene respaldo, no moda pasajera.",
    legend: '"Más que un producto, una relación de confianza."',
    image: "/science/evidence/evidence.png" // fallback
  };

  const defaultDetails: EvidenceDetail[] = [
    { id: 1, title: "Estudios clínicos", description: "Nuestros ingredientes principales cuentan con estudios que respaldan su eficacia en las dosis utilizadas." },
    { id: 2, title: "Documentación técnica", description: "Cada producto tiene una ficha técnica detallada con información sobre composición, origen y propiedades." },
    { id: 3, title: "Ingredientes patentados", description: "Utilizamos formas patentadas de ciertos nutrientes que garantizan mayor absorción y pureza." },
    { id: 4, title: "Actualización continua", description: "Seguimos la literatura científica para incorporar nuevos hallazgos y mejorar nuestras fórmulas." }
  ];

  const details = data?.details && data.details.length === 4 ? data.details : defaultDetails;
  
  const mainImgUrl = data?.header?.image && !data.header.image.startsWith("/") 
    ? getImageUrl(data.header.image) 
    : (data?.header?.image || "/images/image15.png");

  const renderIcon = (path: string | undefined, FallbackIcon: LucideIcon) => {
    if (!path) return <FallbackIcon strokeWidth={1.2} size={40} />;
    
    const url = getImageUrl(path);
    if (!url) return <FallbackIcon strokeWidth={1.2} size={40} />;

    return (
      <Image 
        src={url} 
        alt="Icon" 
        width={40} 
        height={40} 
        className="w-10 h-10 object-contain text-primary"
      />
    );
  };

  return (
    <section className="wrapper-section">
      <div className="wrapper-content flex flex-col gap-16">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <AnimateOnScroll variant="slide-up">
              <span className="text-gray-400 text-body-medium font-medium text-center block uppercase">
                {header.label}
              </span>
            </AnimateOnScroll>
            <AnimateOnScroll variant="slide-up" delay={0.1}>
              <h2 className="heading-h3 text-foreground text-center">
                {header.title}
              </h2>
            </AnimateOnScroll>
          </div>
          <AnimateOnScroll variant="slide-up" delay={0.2}>
            <p className="text-gray-500 text-body-medium text-center max-w-[800px] mx-auto whitespace-pre-line">
              {header.description}
            </p>
          </AnimateOnScroll>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 xl:gap-16 items-center justify-center">
          {/* Imagen Central - Siempre primero en mobile/tablet. En tablet ocupa la columna izquierda completa */}
          <AnimateOnScroll variant="fade" delay={0.2} className="order-1 lg:order-2 md:row-span-2 lg:row-span-1 sticky md:top-30 self-start w-full">
            <div className="aspect-square lg:aspect-3/4 rounded-lg overflow-hidden w-full mx-auto relative bg-primary-soft-gray-balance">
              {mainImgUrl && (
                <Image
                  src={mainImgUrl}
                  alt={header.title || "Science About"}
                  fill
                  className="w-full h-full object-cover"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />
              )}
              {header.legend && (
                <div className="absolute bottom-0 left-0 right-0 bg-primary-green-terbol/20 p-4">
                  <div className="bg-primary-white text-gray-500 heading-h6-light text-center p-4 rounded-md">
                    {header.legend}
                  </div>
                </div>
              )}
            </div>
          </AnimateOnScroll>

          {/* Columna de Cards 1 */}
          <div className="flex flex-col gap-10 order-2 lg:order-1">
            <AnimateOnScroll variant="slide-up" delay={0.3}>
              <FeatureCard
                variant="ghost"
                icon={renderIcon(details[0]?.icon, TrendingUp)}
                title={details[0]?.title || ""}
                description={details[0]?.description || ""}
              />
            </AnimateOnScroll>
            <div className="w-full h-px bg-gray-100 lg:hidden"></div>
            <AnimateOnScroll variant="slide-up" delay={0.4}>
              <div className="w-full h-px bg-gray-100 hidden lg:block mb-10"></div>
              <FeatureCard
                variant="ghost"
                icon={renderIcon(details[1]?.icon, User)}
                title={details[1]?.title || ""}
                description={details[1]?.description || ""}
              />
            </AnimateOnScroll>
          </div>

          {/* Columna de Cards 2 */}
          <div className="flex flex-col gap-10 order-3 lg:order-3">
            <AnimateOnScroll variant="slide-up" delay={0.5}>
              <FeatureCard
                variant="ghost"
                align="left"
                className="lg:items-end lg:text-right"
                icon={renderIcon(details[2]?.icon, Lightbulb)}
                title={details[2]?.title || ""}
                description={details[2]?.description || ""}
              />
            </AnimateOnScroll>
            <div className="w-full h-px bg-gray-100 lg:hidden"></div>
            <AnimateOnScroll variant="slide-up" delay={0.6}>
              <div className="w-full h-px bg-gray-100 hidden lg:block mb-10"></div>
              <FeatureCard
                variant="ghost"
                align="left"
                className="lg:items-end lg:text-right"
                icon={renderIcon(details[3]?.icon, Star)}
                title={details[3]?.title || ""}
                description={details[3]?.description || ""}
              />
            </AnimateOnScroll>
          </div>
        </div>
      </div>
    </section>
  );
};
