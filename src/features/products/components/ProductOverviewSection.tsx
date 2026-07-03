"use client";

import * as React from "react";
import Image from "next/image";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";
import { Product } from "../data/products";
import Link from "next/link";

interface ProductOverviewSectionProps {
  product: Product;
}

function formatProductDetailPrice(price: number) {
  const hasDecimals = !Number.isInteger(price);
  const formattedPrice = hasDecimals ? price.toFixed(2) : String(price);

  return `${formattedPrice} Bs.`;
}

export function ProductOverviewSection({ product }: ProductOverviewSectionProps) {
  const [selectedImage, setSelectedImage] = React.useState<string | undefined>(undefined);
  const formattedPrice = formatProductDetailPrice(product.price);

  return (
    <section className="wrapper-section">
      <div className="wrapper-content">
        <AnimateOnScroll variant="fade">
          <nav className="flex items-center gap-2 text-body-medium text-foreground/60 mb-6">
            <Link
              href="/"
              className="hover:text-primary-orange transition-colors duration-200"
            >
              Inicio
            </Link>
            <span className="text-foreground/40">/</span>
            <Link
              href="/products"
              className="hover:text-primary-orange transition-colors duration-200"
            >
              Productos
            </Link>
            <span className="text-foreground/40">/</span>
            <span className="text-foreground font-medium line-clamp-1">{product.name}</span>
          </nav>
        </AnimateOnScroll>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Columna de Imágenes del producto - Sticky para scroll */}
          <div className="flex flex-col gap-4 lg:sticky lg:top-32">
            {/* Imagen principal */}
            <AnimateOnScroll variant="fade" delay={0.1}>
              <div className="w-full aspect-4/3 sm:aspect-square rounded-lg overflow-hidden bg-primary-soft-gray-light">
                <div className="flex h-full w-full items-center justify-center p-4">
                  <Image
                    src={selectedImage ?? product.cardImage}
                    alt={product.name}
                    width={800}
                    height={800}
                    className="h-auto max-h-full w-auto max-w-full rounded-md object-contain"
                    priority
                  />
                </div>
              </div>
            </AnimateOnScroll>

            {/* Galería de imágenes adicionales */}
            {product.extraImages && product.extraImages.length > 0 && (
              <AnimateOnScroll variant="fade" delay={0.2}>
                <div className="flex gap-4 overflow-x-auto pb-4 snap-x no-scrollbar">
                  {[product.cardImage, ...product.extraImages.filter((img) => img !== product.cardImage)].map(
                    (img, idx) => {
                      const isSelected = (selectedImage ?? product.cardImage) === img;
                      return (
                        <button
                          key={idx}
                          onClick={() => setSelectedImage(img)}
                          className={`relative shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-md overflow-hidden bg-primary-soft-gray-balance snap-center border transition-all duration-200 ${isSelected
                            ? "border-primary-orange shadow-md"
                            : "border-transparent opacity-70 hover:opacity-100 hover:border-primary-orange/50"
                            }`}
                          aria-label={`Ver imagen ${idx + 1} de ${product.name}`}
                          aria-current={isSelected ? "true" : "false"}
                        >
                          <Image
                            src={img}
                            alt={`${product.name} miniatura ${idx + 1}`}
                            fill
                            sizes="96px"
                            className="object-contain"
                          />
                        </button>
                      );
                    }
                  )}
                </div>
              </AnimateOnScroll>
            )}
          </div>

          {/* Información del producto */}
          <div className="flex flex-col gap-12">
            <div className="flex flex-col justify-start gap-8">
              {product.tags && product.tags.length > 0 && (
                <AnimateOnScroll variant="slide-up" className="flex flex-wrap gap-3">
                  {product.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="inline-block bg-gray-50 uppercase text-orange-500 text-body-sm font-medium px-3 py-1 rounded-full w-fit"
                    >
                      {tag}
                    </span>
                  ))}
                </AnimateOnScroll>
              )}

              <AnimateOnScroll variant="slide-up" delay={0.1}>
                <h1 className="heading-h3 text-gray-900 text-wrap">
                  {product.name}
                </h1>
              </AnimateOnScroll>

              <AnimateOnScroll variant="slide-up" delay={0.2}>
                <p className="text-body-medium text-gray-600">
                  {product.description}
                </p>
              </AnimateOnScroll>

              {product.detailsSubtitle && product.detailsList && product.detailsList.length > 0 && (
                <AnimateOnScroll variant="slide-up" delay={0.3}>
                  <h2 className="text-body-lg text-gray-900 font-bold mb-4">
                    {product.detailsSubtitle}
                  </h2>
                  <ul className="text-body-md text-gray-500 flex flex-col gap-4">
                    {product.detailsList.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-4">
                        <span className="mt-2 w-2 h-2 shrink-0 rounded-full bg-primary-orange"></span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </AnimateOnScroll>
              )}
            </div>

            <AnimateOnScroll variant="fade" delay={0.4}>
              <div className="w-full h-px bg-gray-100"></div>
            </AnimateOnScroll>

            <div className="flex gap-4 lg:gap-8 justify-between">
              <AnimateOnScroll variant="slide-up" delay={0.4}>
                <div className="text-body-md text-gray-500 mb-2">Precio</div>
                <div className="heading-h4 text-gray-900 font-bold">
                  {formattedPrice}
                </div>
              </AnimateOnScroll>

              <AnimateOnScroll variant="slide-up" delay={0.5}>
                <div className="text-body-md text-gray-500 mb-2">Disponibilidad</div>
                <div className="heading-h5 text-primary-orange font-bold">
                  {product.stockStatus || "En stock"}
                </div>
              </AnimateOnScroll>
            </div>

            <AnimateOnScroll variant="fade" delay={0.5}>
              <div className="w-full h-px bg-gray-100"></div>
            </AnimateOnScroll>

            <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 justify-between sm:items-center">
              <AnimateOnScroll variant="slide-up" delay={0.5}>
                <div className="text-body-sm text-gray-500">
                  Serás redirigido a la tienda oficial de Térbol para completar tu compra de forma segura.
                </div>
              </AnimateOnScroll>

              <AnimateOnScroll variant="slide-up" delay={0.6} className="shrink-0">
                <Button
                  variant="default"
                  className="w-full sm:w-auto"
                  icon={<ArrowRight />}
                  iconPosition="right"
                  href={product.purchaseUrl}
                  target={product.purchaseUrl ? "_blank" : undefined}
                  rel={product.purchaseUrl ? "noopener noreferrer" : undefined}
                >
                  Comprar ahora
                </Button>
              </AnimateOnScroll>
            </div>

            {product.usageInstructions && (
              <>
                <AnimateOnScroll variant="fade" delay={0.6}>
                  <div className="w-full h-px bg-gray-100"></div>
                </AnimateOnScroll>
                <AnimateOnScroll variant="slide-up" delay={0.6} className="flex flex-col gap-4">
                  <h2 className="heading-h5 text-gray-900 font-bold">Modo de uso</h2>
                  <p className="text-body-medium text-gray-600 leading-relaxed">
                    {product.usageInstructions}
                  </p>
                </AnimateOnScroll>
              </>
            )}

            {product.benefits && product.benefits.length > 0 && (
              <>
                <AnimateOnScroll variant="fade" delay={0.7}>
                  <div className="w-full h-px bg-gray-100"></div>
                </AnimateOnScroll>
                <AnimateOnScroll variant="slide-up" delay={0.7} className="flex flex-col gap-4">
                  <h2 className="heading-h5 text-gray-900 font-bold">Beneficios</h2>
                  <ul className="text-body-md text-gray-600 flex flex-col gap-4">
                    {product.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-4">
                        <Check
                          className="mt-0.5 h-5 w-5 shrink-0 text-primary-orange"
                          strokeWidth={2.25}
                          aria-hidden="true"
                        />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </AnimateOnScroll>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
