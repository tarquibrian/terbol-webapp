/**
 * @fileoverview ProductCard — tarjeta de producto para el catálogo.
 *
 * Muestra imagen, nombre, precio y categoría de un producto.
 * Al hacer click, navega a la página de detalle `/products/[id]`.
 *
 * Usa AnimateOnScroll para efectos de entrada al viewport.
 */

"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";
import type { Product } from "../../data/products";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

/** Props del componente ProductCard */
interface ProductCardProps {
  /** Datos del producto a mostrar */
  product: Product;
  /** Índice de la tarjeta en el grid (para calcular delay del stagger) */
  index?: number;
  /** Delay customizado para sobreescribir el cálculo del grid (útil en carousels) */
  animationDelay?: number;
  /** Si es true, deshabilita la animación de entrada individual de la tarjeta */
  disableAnimation?: boolean;
}

function formatProductCardPrice(price: number) {
  const hasDecimals = !Number.isInteger(price);
  const formattedPrice = hasDecimals ? price.toFixed(2) : String(price);

  return `${formattedPrice} Bs.`;
}

/**
 * Tarjeta de producto con link a la página de detalle.
 *
 * @param props.product - Datos del producto
 * @param props.index - Posición en el grid (para delay de animación)
 */
export function ProductCard({ product, index = 0, animationDelay, disableAnimation = false }: ProductCardProps) {
  // Si se provee, usamos el delay custom; sino, el por defecto para grid-cols-3
  const delay = animationDelay !== undefined ? animationDelay : 0.1 * (index % 3);
  const formattedPrice = formatProductCardPrice(product.price);
  const [imageLoaded, setImageLoaded] = React.useState(false);

  React.useEffect(() => {
    setImageLoaded(false);
  }, [product.cardImage]);

  const cardContent = (
    <Link
      href={`/products/${product.id}`}
      scroll={false}
      className="relative group flex flex-col overflow-hidden rounded-lg transition-all duration-300 bg-primary-soft-gray-balance border border-primary-soft-gray-balance hover:border-primary-orange"
    >
      {/* Badge de categoría */}
      <div className="absolute top-6 left-6 z-11">
        <span className="bg-primary-white text-gray-500 text-sm font-semibold px-2 py-1 rounded-md uppercase">
          {product.category}
        </span>
      </div>
      {/* Imagen del producto */}
      <div className="relative w-full aspect-square overflow-hidden bg-muted/30 px-8 py-4">
        <div className="relative w-full h-full flex items-center justify-center">
          <div
            aria-hidden="true"
            className={cn(
              "absolute inset-4 rounded-md bg-primary-soft-gray-light transition-opacity duration-300",
              imageLoaded ? "opacity-0" : "opacity-100 animate-pulse",
            )}
          />
          <div
            className={cn(
              "relative h-full w-full transition-[opacity,transform] duration-500 ease-out",
              imageLoaded ? "scale-100 opacity-100" : "scale-[0.96] opacity-0",
            )}
          >
            <Image
              src={product.cardImage}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-contain transition-transform duration-300 group-hover:scale-[1.03]"
              priority={index < 3}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageLoaded(true)}
            />
          </div>
        </div>

      </div>

      {/* Info del producto */}
      <div className="flex flex-col gap-6 p-6">
        <div className="flex flex-col gap-2">
          <h2 className="font-semibold text-body-lg text-foreground group-hover:text-primary-orange transition-colors truncate">
            {product.name}
          </h2>
          <p className="text-body-small text-gray-500 truncate">
            {product.shortDescription}
          </p>
        </div>
        <div className="flex flex-col items-stretch gap-4 min-[600px]:flex-row min-[600px]:items-center min-[600px]:justify-between">
          <p className="text-xl font-bold text-gray-900 mt-1">
            {formattedPrice}
          </p>
          <Button
            variant="default"
            size="sm"
            icon={<ArrowRight size={16} />}
            iconPosition="right"
          >
            Ver más
          </Button>
        </div>
      </div>
    </Link>
  );

  if (disableAnimation) {
    return cardContent;
  }

  return (
    <AnimateOnScroll
      variant="fade"
      delay={delay}
    >
      {cardContent}
    </AnimateOnScroll>
  );
}
