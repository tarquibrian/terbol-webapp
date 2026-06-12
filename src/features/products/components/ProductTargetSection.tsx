"use client";

import * as React from "react";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { Product } from "../data/products";
import { TARGET_AUDIENCES } from "../data/targetAudiences";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";
import { resolveImageAsset } from "@/lib/image-assets";

interface ProductTargetSectionProps {
  product: Product;
}

export function ProductTargetSection({ product }: ProductTargetSectionProps) {
  const data = product.targetItems && product.targetItems.length > 0
    ? {
        image: resolveImageAsset(product.targetImage, "/images/productextra1.png") ?? "",
        items: product.targetItems,
      }
    : TARGET_AUDIENCES[product.consumptionType];

  if (!data || data.items.length === 0) {
    return null; // Fallback if no target data is provided for this type
  }

  return (
    <section className="wrapper-section">
      <div className="wrapper-content">
        <div className="flex flex-col gap-8 md:gap-10 justify-center items-center">
          <AnimateOnScroll variant="slide-up">
            <h2 className="heading-h4 text-gray-900 font-bold text-center text-wrap">
              ¿Para quién está diseñado?
            </h2>
          </AnimateOnScroll>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
            <AnimateOnScroll variant="fade" delay={0.2} className="w-full flex justify-center md:block">
              <div className="overflow-hidden rounded-lg aspect-video md:sticky md:top-32 w-full max-w-[500px] md:max-w-none">
                <Image src={data.image} alt="Para quién está diseñado" width={800} height={800} className="w-full h-full object-cover" />
              </div>
            </AnimateOnScroll>
            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-2">
                {data.items.map((item, idx) => {
                  const isLast = idx === data.items.length - 1;
                  return (
                    <AnimateOnScroll key={idx} variant="slide-up" delay={0.3 + idx * 0.15}>
                      <div className="grid grid-cols-[40px_1fr] md:grid-cols-[48px_1fr] gap-3 md:gap-4">
                        <div className="flex flex-col items-center gap-2">
                          <div className="flex items-center justify-center bg-white z-10">
                            <ChevronRight size={32} strokeWidth={1.75} className="text-primary-orange" />
                          </div>
                          <div
                            className={`h-full w-[2px] ${isLast ? 'hidden' : ''}`}
                            style={{
                              backgroundImage: 'repeating-linear-gradient(to bottom, var(--primary-orange) 0px, var(--primary-orange) 3px, transparent 2px, transparent 8px)'
                            }}
                          ></div>
                        </div>
                        <div className="flex flex-col pb-10 md:pb-12 pt-1">
                          <h3 className="heading-h6 text-gray-900 font-bold mb-2 md:mb-3">
                            {item.title}
                          </h3>
                          <p className="text-body-medium text-gray-500">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </AnimateOnScroll>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
