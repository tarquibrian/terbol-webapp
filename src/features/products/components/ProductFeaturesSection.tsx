"use client";

import * as React from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";
import { resolveImageAsset } from "@/lib/image-assets";
import type { Product } from "../data/products";

interface ProductFeaturesSectionProps {
  product?: Product;
}

export function ProductFeaturesSection({ product }: ProductFeaturesSectionProps) {
  const items = product?.whyChooseItems && product.whyChooseItems.length > 0
    ? product.whyChooseItems
    : [
        "Ultrapurificado mediante destilación molecular.",
        "Libre de metales pesados, PCB y dioxinas.",
        "Concentración garantizada de activos esenciales.",
        "Fórmula especializada para máxima biodisponibilidad.",
      ];

  return (
    <section className="wrapper-section">
      <div className="wrapper-content flex flex-col gap-8 md:gap-10 justify-center items-center">
        <AnimateOnScroll variant="slide-up" className="flex flex-col gap-2 justify-center items-center text-center">
          <h2 className="heading-h4 text-gray-900 font-bold text-wrap">¿Por qué elegir este producto?</h2>
          <p className="text-body-medium text-gray-500 text-wrap">Calidad estricta, ingredientes certificados y respaldo científico.</p>
        </AnimateOnScroll>
        <div className="max-w-[1024px] w-full rounded-lg bg-primary-soft-gray-balance p-3 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-3">
          <AnimateOnScroll variant="fade" delay={0.2} className="w-full aspect-video md:aspect-square rounded-md overflow-hidden">
            <Image src={resolveImageAsset(product?.whyChooseImage, "/images/productextra2.png") ?? ""} alt="Por qué elegir producto" width={800} height={800} className="w-full h-full object-cover" />
          </AnimateOnScroll>
          <div className="w-full p-4 lg:p-6 flex flex-col justify-between gap-6">
            <div>
              <AnimateOnScroll variant="slide-up" delay={0.3}>
                <h2 className="heading-h6-bold text-gray-900 text-wrap mb-4">
                  {product?.whyChooseTitle ?? "Respaldo Térbol Inspira"}
                </h2>
              </AnimateOnScroll>
              <ul className="flex flex-col gap-4 md:gap-5">
                {items.map((item, index) => (
                  <AnimateOnScroll
                    key={`${item}-${index}`}
                    as="li"
                    variant="slide-up"
                    delay={0.4 + index * 0.1}
                    className="flex items-start gap-3 md:gap-4"
                  >
                    <div className="flex items-center justify-center text-body-lg text-gray-900 font-bold mt-1">
                      {index + 1}.
                    </div>
                    <p className="text-body-medium text-gray-500 mt-1">
                      {item}
                    </p>
                  </AnimateOnScroll>
                ))}
              </ul>
            </div>
            <AnimateOnScroll variant="fade" delay={0.8} className="flex justify-start md:justify-end mt-4 md:mt-0">
              <Button
                href="/science-and-quality"
                variant="secondary"
                className="w-full sm:w-auto"
                icon={<ArrowRight />}
                iconPosition="right"
              >
                CONOCE NUESTRA CIENCIA
              </Button>
            </AnimateOnScroll>
          </div>
        </div>
      </div>
    </section>
  );
}
