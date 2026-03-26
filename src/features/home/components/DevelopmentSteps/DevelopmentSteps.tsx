import * as React from "react";
import Image from "next/image";
import { Beaker, ShieldCheck, Microscope, FlaskConical, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";

export function DevelopmentSteps() {
  return (
    <section className="wrapper-section">
      <div className="wrapper-content">
        <AnimateOnScroll variant="slide-up" className="mb-8 sm:mb-10">
          <h2 className="heading-h4  mb-0 text-wrap">
            ¿Cómo desarrollamos cada producto?
          </h2>
        </AnimateOnScroll>

        {/* 
          Grid Layout Responsive:
          Móvil: grid-cols-1
          Tablet (md): grid-cols-2 (para 2x2 donde el item 4 y 1 varíen)
          Escritorio (xl): grid-cols-3
        */}
        <AnimateOnScroll variant="slide-up" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 auto-rows-auto xl:h-[650px]">
          {/* Card 1 - Ocupa 2 filas, 1 columna */}
          <div className="md:row-span-2 xl:row-span-2 rounded-lg bg-primary-soft-gray-balance p-6 sm:p-8 flex flex-col relative overflow-hidden group h-[600px] md:h-[650px]">
            <div className="flex justify-between items-start w-full relative z-10">
              <div className="flex items-center justify-center text-primary-orange">
                <Beaker strokeWidth={1} size={48} />
              </div>
              <span className="text-xl font-regular text-gray-300">01</span>
            </div>

            <div className="mt-8 mb-8 relative z-10 flex-1">
              <h3 className="heading-h6-bold text-primary mb-3">Investigación</h3>
              <p className="text-body-medium text-gray-600 mb-6">
                Iniciamos con investigación científica rigurosa para comprender las necesidades y formular soluciones innovadoras.
              </p>
              <Button
                size="sm"
                className="w-full sm:w-[250px] justify-between"
                icon={<ArrowRight />}
                iconPosition="right"
              >
                Ver productos
              </Button>
            </div>

            {/* Contenedor inferior para Imagen */}
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

          {/* Card 2 - Estándar */}
          <div className="rounded-lg bg-primary-soft-gray-balance p-6 sm:p-8 flex flex-col relative group">
            <div className="flex justify-between items-start w-full">
              <div className="flex items-center justify-center text-primary-orange">
                <FlaskConical strokeWidth={1} size={48} />
              </div>
              <span className="text-xl font-regular text-gray-300">02</span>
            </div>

            <div className="mt-8">
              <h3 className="heading-h6-bold text-primary mb-3">Selección Activa</h3>
              <p className="text-body-medium text-gray-400">
                Seleccionamos materias primas e ingredientes de pureza certificada y calidad internacional.
              </p>
            </div>
          </div>

          {/* Card 3 - Estándar */}
          <div className="rounded-lg bg-primary-soft-gray-balance p-6 sm:p-8 flex flex-col relative group">
            <div className="flex justify-between items-start w-full">
              <div className="flex items-center justify-center text-primary-orange">
                <Microscope strokeWidth={1} size={48} />
              </div>
              <span className="text-xl font-regular text-gray-300">03</span>
            </div>

            <div className="mt-8">
              <h3 className="heading-h6-bold text-primary mb-3">Pruebas Clínicas</h3>
              <p className="text-body-medium text-gray-400">
                Testeamos la eficacia y seguridad de cada fórmula en nuestros laboratorios de alta tecnología antes de ser aprobada.
              </p>
            </div>
          </div>

          {/* Card 4 - Ocupa 2 espacios horizontales */}
          <div className="md:col-span-2 xl:col-span-2 rounded-lg bg-primary-soft-gray-balance flex flex-col justify-between sm:flex-row relative group overflow-hidden p-3">
            {/* Contenido Izquierdo */}
            <div className="p-4 flex max-w-[400px] flex-col flex-1 relative z-10 sm:w-1/2 lg:w-3/5 xl:w-1/2 justify-center">
              <div className="flex justify-between items-start w-full">
                <div className="flex items-center justify-center text-primary-orange">
                  <ShieldCheck strokeWidth={1} size={48} />
                </div>
                <span className="text-xl font-regular text-gray-300">04</span>
              </div>

              <div className="mt-8 max-w-md">
                <h3 className="heading-h6-bold text-primary mb-3">Producción Controlada</h3>
                <p className="text-body-medium text-gray-400">
                  Fabricamos bajo estrictos estándares de control de calidad, asegurando que cada producto final sea completamente idóneo y seguro.
                </p>
              </div>
            </div>

            {/* Imagen Derecha */}
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
