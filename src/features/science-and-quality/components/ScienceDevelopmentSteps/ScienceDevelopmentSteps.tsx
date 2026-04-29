import * as React from "react";
import Image from "next/image";
import { Beaker, ShieldCheck, Microscope, FlaskConical, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";
import { env } from "@/config/env";

interface DevelopmentStepData {
  id: string | number;
  title: string;
  description: string;
  icon?: string;
}

interface ScienceDevelopmentStepsProps {
  data?: DevelopmentStepData[];
}

export function ScienceDevelopmentSteps({ data }: ScienceDevelopmentStepsProps) {
  // Función para resolver la URL del icono o imagen proveniente del CMS
  const getIconUrl = (path?: string) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    const cleanPath = path.startsWith("/") ? path.slice(1) : path;
    const baseStorage = env.STORAGE_URL.endsWith("/") ? env.STORAGE_URL : `${env.STORAGE_URL}/`;
    return `${baseStorage}${cleanPath}`;
  };

  // Extraemos la información del CMS con text fallbacks de seguridad
  const step1: DevelopmentStepData = data?.[0] || {
    id: "investigacion",
    title: "Investigación",
    description: "Revisamos la evidencia científica disponible sobre ingredientes, interacciones y dosis efectivas."
  };
  const step2: DevelopmentStepData = data?.[1] || {
    id: "proposito-claro",
    title: "Propósito claro",
    description: "Definimos un objetivo específico para cada producto, evitando fórmulas genéricas sin foco."
  };
  const step3: DevelopmentStepData = data?.[2] || {
    id: "formulacion",
    title: "Formulación",
    description: "Seleccionamos ingredientes de alta biodisponibilidad y combinaciones que potencian su efecto."
  };
  const step4: DevelopmentStepData = data?.[3] || {
    id: "validacion",
    title: "Validación",
    description: "Verificamos la calidad final del producto mediante controles y pruebas de laboratorio."
  };

  return (
    <section className="wrapper-section">
      <div className="wrapper-content">
        <AnimateOnScroll variant="slide-up" className="mb-8 sm:mb-10">
          <h2 className="heading-h4  mb-0 text-wrap">
            ¿Cómo desarrollamos cada producto?
          </h2>
        </AnimateOnScroll>

        <AnimateOnScroll variant="slide-up" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 auto-rows-auto xl:h-[650px]">
          {/* Card 1 */}
          <div className="md:row-span-2 xl:row-span-2 rounded-lg bg-primary-soft-gray-balance p-6 sm:p-8 flex flex-col relative overflow-hidden group h-[600px] md:h-[650px]">
            <div className="flex justify-between items-start w-full relative z-10">
              <div className="flex items-center justify-center text-primary-orange w-12 h-12 relative">
                {getIconUrl(step1.icon) ? (
                  <Image src={getIconUrl(step1.icon)!} alt={step1.title} fill className="object-contain" />
                ) : (
                  <Beaker strokeWidth={1} size={48} />
                )}
              </div>
              <span className="text-xl font-regular text-gray-300">01</span>
            </div>

            <div className="mt-8 mb-8 relative z-10 flex-1">
              <h3 className="heading-h6-bold text-primary mb-3">{step1.title}</h3>
              <p className="text-body-medium text-gray-600 mb-6">
                {step1.description}
              </p>
              <Button
                size="sm"
                className="w-full sm:w-[250px] justify-between"
                icon={<ArrowRight />}
                iconPosition="right"
                href="/products"
              >
                Ver productos
              </Button>
            </div>

            <div className="absolute bottom-0 left-0 w-full h-80 md:h-90 overflow-hidden xl:h-96">
              <Image
                src="/homegrid/bgcard1.png"
                alt="Investigación y Desarrollo"
                fill
                className="object-contain object-bottom-left"
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
              />
            </div>
          </div>

          {/* Card 2 */}
          <div className="rounded-lg bg-primary-soft-gray-balance p-6 sm:p-8 flex flex-col relative group">
            <div className="flex justify-between items-start w-full">
              <div className="flex items-center justify-center text-primary-orange w-12 h-12 relative">
                {getIconUrl(step2.icon) ? (
                  <Image src={getIconUrl(step2.icon)!} alt={step2.title} fill className="object-contain" />
                ) : (
                  <FlaskConical strokeWidth={1} size={48} />
                )}
              </div>
              <span className="text-xl font-regular text-gray-300">02</span>
            </div>

            <div className="mt-8">
              <h3 className="heading-h6-bold text-primary mb-3">{step2.title}</h3>
              <p className="text-body-medium text-gray-400">
                {step2.description}
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="rounded-lg bg-primary-soft-gray-balance p-6 sm:p-8 flex flex-col relative group">
            <div className="flex justify-between items-start w-full">
              <div className="flex items-center justify-center text-primary-orange w-12 h-12 relative">
                {getIconUrl(step3.icon) ? (
                  <Image src={getIconUrl(step3.icon)!} alt={step3.title} fill className="object-contain" />
                ) : (
                  <Microscope strokeWidth={1} size={48} />
                )}
              </div>
              <span className="text-xl font-regular text-gray-300">03</span>
            </div>

            <div className="mt-8">
              <h3 className="heading-h6-bold text-primary mb-3">{step3.title}</h3>
              <p className="text-body-medium text-gray-400">
                {step3.description}
              </p>
            </div>
          </div>

          {/* Card 4 */}
          <div className="md:col-span-2 xl:col-span-2 rounded-lg bg-primary-soft-gray-balance flex flex-col justify-between sm:flex-row relative group overflow-hidden p-3">
            <div className="p-4 flex max-w-[400px] flex-col flex-1 relative z-10 sm:w-1/2 lg:w-3/5 xl:w-1/2 justify-center">
              <div className="flex justify-between items-start w-full">
                <div className="flex items-center justify-center text-primary-orange w-12 h-12 relative">
                  {getIconUrl(step4.icon) ? (
                    <Image src={getIconUrl(step4.icon)!} alt={step4.title} fill className="object-contain" />
                  ) : (
                    <ShieldCheck strokeWidth={1} size={48} />
                  )}
                </div>
                <span className="text-xl font-regular text-gray-300">04</span>
              </div>

              <div className="mt-8 max-w-md">
                <h3 className="heading-h6-bold text-primary mb-3">{step4.title}</h3>
                <p className="text-body-medium text-gray-400">
                  {step4.description}
                </p>
              </div>
            </div>

            <div className="relative flex border border-primary-orange rounded-lg p-6 h-64 sm:h-full sm:w-1/2 lg:w-2/5  overflow-hidden">
              <Image
                src="/homegrid/bgcard4.png"
                alt="Producción y Control"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 40vw"
              />
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
