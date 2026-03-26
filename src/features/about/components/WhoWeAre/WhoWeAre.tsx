"use client";

import { FeatureCard } from "@/components/ui/FeatureCard";
import Image from "next/image";
import { TrendingUp, User, Star, Lightbulb } from 'lucide-react'
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";

export const WhoWeAre = () => {
  return (
    <section className="wrapper-section">
      <div className="wrapper-content flex flex-col gap-16">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <AnimateOnScroll variant="slide-up">
              <span className="text-gray-400 text-body-medium font-medium text-center block">
                QUIÉNES SOMOS
              </span>
            </AnimateOnScroll>
            <AnimateOnScroll variant="slide-up" delay={0.1}>
              <h2 className="heading-h3 text-foreground text-center">
                ¿Por qué nace Térbol Inspira?
              </h2>
            </AnimateOnScroll>
          </div>
          <AnimateOnScroll variant="slide-up" delay={0.2}>
            <p className="text-gray-500 text-body-medium text-center max-w-[800px] mx-auto">
              Inspira nace para captar al consumidor informado con una propuesta nueva basada en confianza, calidad y evidencia.
            </p>
          </AnimateOnScroll>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 xl:gap-16 items-center justify-center">
          {/* Imagen Central - Siempre primero en mobile/tablet. En tablet ocupa la columna izquierda completa */}
          <AnimateOnScroll variant="fade" delay={0.2} className="order-1 lg:order-2 md:row-span-2 lg:row-span-1 sticky md:top-30 self-start w-full">
            <div className="aspect-square lg:aspect-3/4 rounded-lg overflow-hidden w-full mx-auto relative">
              <Image
                src="/about/aboutproduct.png"
                alt="Who we are"
                width={500}
                height={500}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-primary-green-terbol/20 p-4">
                <div className="bg-primary-white text-gray-500 heading-h6-light text-center p-4 rounded-md">
                  "Más que un producto, una relación de confianza."
                </div>
              </div>
            </div>
          </AnimateOnScroll>

          {/* Columna de Cards 1 */}
          <div className="flex flex-col gap-10 order-2 lg:order-1">
            <AnimateOnScroll variant="slide-up" delay={0.3}>
              <FeatureCard
                variant="ghost"
                icon={<TrendingUp strokeWidth={1.2} size={40} />}
                title="Evolución del mercado"
                description="Térbol Inspira ofrece calidad, ciencia y transparencia para el consumidor exigente."
              />
            </AnimateOnScroll>
            <div className="w-full h-px bg-gray-100 lg:hidden"></div>
            <AnimateOnScroll variant="slide-up" delay={0.4}>
              <div className="w-full h-px bg-gray-100 hidden lg:block mb-10"></div>
              <FeatureCard
                variant="ghost"
                icon={<User strokeWidth={1.2} size={40} />}
                title="Modelo cercano"
                description="Térbol Inspira emplea un modelo B2C con asesoría personalizada de promotoras para crear una conexión directa."
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
                icon={<Lightbulb strokeWidth={1.2} size={40} />}
                title="Innovación en formulación"
                description="En lugar de revender genéricos, crean fórmulas únicas basadas en investigación científica."
              />
            </AnimateOnScroll>
            <div className="w-full h-px bg-gray-100 lg:hidden"></div>
            <AnimateOnScroll variant="slide-up" delay={0.6}>
              <div className="w-full h-px bg-gray-100 hidden lg:block mb-10"></div>
              <FeatureCard
                variant="ghost"
                align="left"
                className="lg:items-end lg:text-right"
                icon={<Star strokeWidth={1.2} size={40} />}
                title="Segmento premium"
                description="Se enfocan en consumidores de gama alta que invierten in salud con resultados probados."
              />
            </AnimateOnScroll>
          </div>
        </div>
      </div>
    </section>
  );
};