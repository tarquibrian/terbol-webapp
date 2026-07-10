import * as React from "react";
import Image from "next/image";
import { Microscope, ScrollText, SunMedium, Star } from "lucide-react";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";
import { resolveImageAsset } from "@/lib/image-assets";

interface PillarData {
  id: string | number;
  title: string;
  description: string;
  icon?: string;
}

interface ProductPillarsProps {
  data?: PillarData[];
}

const FALLBACK_PILLARS: PillarData[] = [
  {
    id: "calidad",
    title: "Innovación",
    description: "Desarrollamos cada producto con formulaciones únicas, basadas en las últimas investigaciones científicas."
  },
  {
    id: "envios",
    title: "Ciencia y Tecnología",
    description: "Verificamos la calidad final del producto mediante controles y pruebas de laboratorio."
  },
  {
    id: "rapidez",
    title: "Ingredientes de calidad",
    description: "Nuestros ingredientes principales cuentan con estudios que respaldan su eficacia en las dosis utilizadas."
  },
  {
    id: "soporte",
    title: "Formulación",
    description: "Desarrollamos cada producto con formulaciones únicas, basadas en las últimas investigaciones científicas y estándares de calidad internacional."
  }
];

const FALLBACK_ICONS = [
  <Star key="1" strokeWidth={1.5} size={32} />,
  <Microscope key="2" strokeWidth={1.5} size={32} />,
  <SunMedium key="3" strokeWidth={1.5} size={32} />,
  <ScrollText key="4" strokeWidth={1.5} size={32} />
];

export function ProductPillars({ data }: ProductPillarsProps) {
  const pillarsToRender = data && data.length > 0 ? data : FALLBACK_PILLARS;
  const pillarsImageSrc = "/images/pilares-de-productos.png";

  const getIconUrl = (path?: string) => {
    return resolveImageAsset(path);
  };

  return (
    <section className="wrapper-section">
      <div className="wrapper-content grid grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(280px,0.85fr)_minmax(0,1.15fr)] lg:gap-16 xl:gap-20">
        <AnimateOnScroll variant="slide-up" className="w-full">
          <div className="flex w-full flex-col items-start justify-start gap-8 text-left">
            <h2 className="heading-h4 text-primary">
              Pilares de Productos
            </h2>
            <div className="relative aspect-square w-full max-w-[520px] overflow-hidden rounded-lg bg-primary-soft-gray-balance lg:max-w-[500px]">
              <Image
                src={pillarsImageSrc}
                alt="Mujer meditando junto a productos Térbol Inspira"
                fill
                sizes="(min-width: 1280px) 500px, (min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </AnimateOnScroll>

        <div className="grid grid-cols-1 gap-3 lg:gap-3">
          {pillarsToRender.map((pillar, index) => {
            const iconUrl = getIconUrl(pillar.icon);
            
            return (
              <AnimateOnScroll key={pillar.id} delay={index * 0.1} variant="slide-up">
                <div className={`flex items-start gap-6 md:gap-8 border-b border-gray-100 pb-6 md:pb-8 ${index === 0 ? "pt-0" : "pt-6 md:pt-8"}`}>
                  <div className="min-w-16 min-h-16 flex items-center justify-center bg-primary-soft-gray-balance rounded-lg text-primary-orange relative overflow-hidden p-2">
                    {iconUrl ? (
                      <Image 
                        src={iconUrl} 
                        alt={pillar.title} 
                        width={32} 
                        height={32} 
                        className="object-contain w-8 h-8"
                      />
                    ) : (
                      FALLBACK_ICONS[index % FALLBACK_ICONS.length]
                    )}
                  </div>
                  <div className="flex flex-col max-w-[600px]">
                    <h3 className="heading-h6-bold text-primary mb-3">{pillar.title}</h3>
                    <p className="text-body-medium text-gray-400">{pillar.description}</p>
                  </div>
                </div>
              </AnimateOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}
