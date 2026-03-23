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
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";
import type { Product } from "../../data/products";

/** Props del componente ProductCard */
interface ProductCardProps {
  /** Datos del producto a mostrar */
  product: Product;
  /** Índice de la tarjeta en el grid (para calcular delay del stagger) */
  index?: number;
}

/**
 * Tarjeta de producto con link a la página de detalle.
 *
 * @param props.product - Datos del producto
 * @param props.index - Posición en el grid (para delay de animación)
 */
export function ProductCard({ product, index = 0 }: ProductCardProps) {
  return (
    <AnimateOnScroll
      variant="slide-up"
      delay={0.1 * (index % 3)} // Stagger sincronizado para grid-cols-3
    >
      <Link
        href={`/products/${product.id}`}
        className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
      >
        {/* Imagen del producto */}
        <div className="relative w-full aspect-square overflow-hidden bg-muted/30">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          {/* Badge de categoría */}
          <span className="absolute top-3 left-3 bg-primary-orange text-white text-xs font-semibold px-3 py-1 rounded-full">
            {product.category}
          </span>
        </div>

        {/* Info del producto */}
        <div className="flex flex-col gap-2 p-5">
          <h3 className="font-semibold text-lg text-foreground group-hover:text-primary-orange transition-colors line-clamp-1">
            {product.name}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {product.shortDescription}
          </p>
          <p className="text-xl font-bold text-primary-orange mt-1">
            ${product.price.toFixed(2)}
          </p>
        </div>
      </Link>
    </AnimateOnScroll>
  );
}
