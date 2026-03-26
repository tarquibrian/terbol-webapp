import * as React from "react";
import { Microscope, ScrollText, SunMedium, Star } from "lucide-react";
import { FeatureCard } from "@/components/ui/FeatureCard";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";

const PILLARS_DATA = [
  {
    id: "calidad",
    icon: <Star strokeWidth={1.5} size={32} />,
    title: "Innovación",
    description: "Desarrollamos cada producto con formulaciones únicas, basadas en las últimas investigaciones científicas."
  },
  {
    id: "envios",
    icon: <Microscope strokeWidth={1.5} size={32} />,
    title: "Ciencia y Tecnología",
    description: "Verificamos la calidad final del producto mediante controles y pruebas de laboratorio."
  },
  {
    id: "rapidez",
    icon: <SunMedium strokeWidth={1.5} size={32} />,
    title: "Ingredientes de calidad",
    description: "Nuestros ingredientes principales cuentan con estudios que respaldan su eficacia en las dosis utilizadas."
  },
  {
    id: "soporte",
    icon: <ScrollText strokeWidth={1.5} size={32} />,
    title: "Formulación",
    description: "Desarrollamos cada producto con formulaciones únicas, basadas en las últimas investigaciones científicas y estándares de calidad internacional."
  }
];

export function ProductPillars() {
  return (
    <section className="wrapper-section">
      <div className="wrapper-content flex flex-col items-start lg:flex-row justify-between gap-6 lg:gap-12">
        <AnimateOnScroll variant="slide-up">
          <div className="flex flex-col items-start justify-start text-left mx-auto">
            <h2 className="heading-h4 text-primary">
              Pilares de Productos
            </h2>
            {/* <p className="text-body text-gray-500">
              Nos enfocamos en brindar confianza y excelencia en cada etapa,
              asegurando que obtengas los mejores resultados con nosotros.
            </p> */}
          </div>
        </AnimateOnScroll>

        <div className="grid grid-cols-1 gap-3 lg:gap-3">
          {PILLARS_DATA.map((pillar, index) => (
            <AnimateOnScroll key={pillar.id} delay={index * 0.1} variant="slide-up">
              <div className="flex items-start gap-6 md:gap-8 border-b border-gray-100 py-6 md:py-8">
                <div className="min-w-16 min-h-16 flex items-center justify-center bg-primary-soft-gray-balance rounded-lg text-primary-orange">
                  {pillar.icon}
                </div>
                {/* <span className="text-xl font-regular text-gray-300">0{index + 1}</span> */}
                <div className="flex flex-col max-w-[600px]">
                  <h3 className="heading-h6-bold text-primary mb-3">{pillar.title}</h3>
                  <p className="text-body-medium text-gray-400">{pillar.description}</p>
                </div>
              </div>
              {/* <FeatureCard
                icon={pillar.icon}
                title={pillar.title}
                description={pillar.description}
                className="h-full"
              /> */}
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
