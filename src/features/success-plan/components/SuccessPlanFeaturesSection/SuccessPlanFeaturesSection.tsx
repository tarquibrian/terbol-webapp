import { FeatureCard } from "@/components/ui/FeatureCard";
import { Award, Microscope, Star } from "lucide-react";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";
import Image from "next/image";
import { resolveImageAsset } from "@/lib/image-assets";
import * as React from "react";

interface FeatureItem {
  id: number | string;
  title: string;
  description: string;
  icon?: string;
}

interface SuccessPlanFeaturesSectionProps {
  data?: {
    header?: {
      label?: string;
      title?: string;
      description?: string;
    };
    details?: FeatureItem[];
  };
}

export function SuccessPlanFeaturesSection({ data }: SuccessPlanFeaturesSectionProps) {
  const getIconUrl = (path?: string) => {
    return resolveImageAsset(path);
  };

  const header = data?.header || {
    title: "¿Qué es el Plan de Éxito?",
    description: "El Plan de Éxito es un programa de fidelización de Térbol que premia a los clientes por su preferencia. Con cada compra, los clientes acumulan puntos que pueden canjear por productos de alta calidad."
  };

  const defaultDetails: FeatureItem[] = [
    {
      id: 1,
      title: "Formulaciones únicas",
      description: "Cada producto es desarrollado con combinaciones de ingredientes cuidadosamente seleccionados, basados en investigación científica actual.",
    },
    {
      id: 2,
      title: "Respaldo científico",
      description: "Evidencia de laboratorio respalda la eficacia de nuestros ingredientes. Transparencia total sobre lo que consumís.",
    },
    {
      id: 3,
      title: "Alta gama",
      description: "Ingredientes de primera calidad, procesos de fabricación controlados y estándares internacionales en cada producto.",
    }
  ];

  const details = data?.details && data.details.length === 3 ? data.details : defaultDetails;
  const fallbackIcons = [Award, Microscope, Star];

  return (
    <section className="wrapper-section">
      <div className="wrapper-content">
        <AnimateOnScroll variant="slide-up">
          <div className="flex flex-col gap-4 items-center justify-center text-center">
            {header.label && (
              <span className="text-gray-400 text-body-medium font-medium uppercase tracking-wider block mb-2">
                {header.label}
              </span>
            )}
            <h2 className="heading-h2 font-semibold">
              {header.title}
            </h2>
            <p className="text-body-medium text-gray-500 max-w-[850px] whitespace-pre-line">
              {header.description}
            </p>
          </div>
        </AnimateOnScroll>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10">
          {details.map((detail, index) => {
            const FallbackIcon = fallbackIcons[index % fallbackIcons.length];
            const iconUrl = getIconUrl(detail.icon);

            return (
              <AnimateOnScroll key={detail.id} variant="slide-up" delay={0.1 + (index * 0.1)} className="h-full">
                <FeatureCard
                  title={detail.title}
                  description={detail.description}
                  icon={
                    iconUrl ? (
                      <Image 
                        src={iconUrl} 
                        alt={detail.title} 
                        width={40} 
                        height={40} 
                        className="w-10 h-10 object-contain text-primary"
                      />
                    ) : (
                      <FallbackIcon strokeWidth={1.2} size={40} />
                    )
                  }
                  className="h-full"
                />
              </AnimateOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}
