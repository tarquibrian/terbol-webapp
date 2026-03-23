/**
 * @fileoverview ProductDetailView — vista de detalle de un producto.
 *
 * Muestra la información completa de un producto seleccionado:
 * imagen grande, nombre, precio, descripción y botón de acción.
 *
 * Recibe el `productId` como prop desde la thin page dinámica
 * `app/products/[id]/page.tsx`.
 */

"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";
import { getProductById } from "../data/products";

/** Props del componente ProductDetailView */
interface ProductDetailViewProps {
  /** ID del producto a mostrar */
  productId: string;
}

/**
 * Vista de detalle de un producto individual.
 *
 * Busca el producto en los datos y muestra su información completa.
 * Si el producto no existe, muestra un mensaje de error con link
 * para volver al catálogo.
 *
 * @param props.productId - ID del producto obtenido desde la ruta dinámica
 */
export function ProductDetailView({ productId }: ProductDetailViewProps) {
  const product = getProductById(productId);

  // ─── Producto no encontrado ───
  if (!product) {
    return (
      <section className="w-full py-24">
        <div className="max-w-[1512px] mx-auto px-16 text-center">
          <h1 className="text-h2 font-bold text-foreground mb-4">
            Producto no encontrado
          </h1>
          <p className="text-muted-foreground mb-8">
            El producto que buscas no existe o fue removido del catálogo.
          </p>
          <Link href="/products">
            <Button variant="outline">← Volver al catálogo</Button>
          </Link>
        </div>
      </section>
    );
  }

  // ─── Vista de detalle ───
  return (
    <section className="w-full py-12 md:py-20">
      <div className="max-w-[1512px] mx-auto px-16">
        {/* Breadcrumb */}
        <AnimateOnScroll variant="fade">
          <nav className="mb-8 text-sm text-muted-foreground">
            <Link href="/products" className="hover:text-primary-orange transition-colors">
              Productos
            </Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">{product.name}</span>
          </nav>
        </AnimateOnScroll>

        {/* Layout principal: imagen + info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Imagen del producto */}
          <AnimateOnScroll variant="fade" delay={0.1}>
            <div className="w-full aspect-square rounded-2xl overflow-hidden bg-muted/30 shadow-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </AnimateOnScroll>

          {/* Información del producto */}
          <div className="flex flex-col justify-center space-y-6">
            <AnimateOnScroll variant="slide-up">
              <span className="inline-block bg-primary-orange/10 text-primary-orange text-sm font-semibold px-4 py-1.5 rounded-full w-fit">
                {product.category}
              </span>
            </AnimateOnScroll>

            <AnimateOnScroll variant="slide-up" delay={0.1}>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
                {product.name}
              </h1>
            </AnimateOnScroll>

            <AnimateOnScroll variant="slide-up" delay={0.2}>
              <p className="text-3xl font-bold text-primary-orange">
                ${product.price.toFixed(2)}
              </p>
            </AnimateOnScroll>

            <AnimateOnScroll variant="slide-up" delay={0.25}>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </AnimateOnScroll>

            <AnimateOnScroll variant="slide-up" delay={0.3}>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button size="default" className="w-full sm:w-auto bg-button-orange text-white hover:bg-button-orange-hover">
                  Añadir al Carrito
                </Button>
                <Link href="/products">
                  <Button size="default" variant="outline" className="w-full sm:w-auto">
                    ← Volver al catálogo
                  </Button>
                </Link>
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </div>
    </section>
  );
}
