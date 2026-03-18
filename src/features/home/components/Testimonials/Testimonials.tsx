/**
 * @fileoverview Testimonials — sección genérica para mostrar reseñas.
 *
 * Utiliza animaciones de slide-up combinadas con un fondo distinto para
 * destacar el scroll.
 */

"use client";

import * as React from "react";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";

export function Testimonials() {
  const testimonials = [
    { name: "Ana Martínez", role: "Cliente Frecuente", text: "Excelente calidad y servicio. El envío fue muy rápido y todo llegó en perfectas condiciones." },
    { name: "Carlos López", role: "Arquitecto", text: "Los mejores productos del mercado para mis proyectos. Son altamente fiables y con gran diseño." },
    { name: "María Fernández", role: "Diseñadora de Interiores", text: "Me encanta la variedad y los acabados que ofrecen. Totalmente recomendado para uso profesional." },
  ];

  return (
    <section className="w-full py-16 md:py-24 bg-primary-soft-gray-light">
      <div className="container mx-auto px-4 md:px-6 max-w-[1512px]">
        <AnimateOnScroll variant="slide-up">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-center mb-16 text-foreground">
            Lo que dicen nuestros clientes
          </h2>
        </AnimateOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item, index) => (
            <AnimateOnScroll
              key={index}
              variant="slide-up"
              delay={0.15 * index}
              className="bg-background p-8 rounded-2xl shadow-sm border border-border flex flex-col space-y-6"
            >
              {/* Estrellas */}
              <div className="flex text-primary-orange">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none" className="lucide lucide-star">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                ))}
              </div>
              <p className="text-muted-foreground italic flex-1 text-lg leading-relaxed">
                "{item.text}"
              </p>
              <div>
                <p className="font-bold text-foreground">{item.name}</p>
                <p className="text-sm text-gray-500">{item.role}</p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
