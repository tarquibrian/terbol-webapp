import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeaturedProductCardProps {
  id: string;
  name: string;
  number: string;
  /** Imagen de fondo completa (Estado 1) */
  imageSrc: string;
  /** Imagen transparente del envase del producto (Estado 2) */
  productImageSrc: string;
  className?: string;
}

/**
 * Card interactiva de producto destacado (Home).
 * Estado Inicial: Muestra la Imagen de fondo con textos en blanco.
 * Hover: El contenedor de la imagen desliza a la izquierda comportándose
 *        como una recorte/línea revelando el Estado 2 fijo detrás. La imagen 
 *        se mantiene estática durante el recorte usando traslación opuesta.
 */
export function FeaturedProductCard({
  id,
  name,
  number,
  imageSrc,
  productImageSrc,
  className,
}: FeaturedProductCardProps) {
  return (
    <Link
      href={`/products/${id}`}
      prefetch={true}
      scroll={false}
      className={cn(
        "group relative block w-full aspect-3/6 sm:aspect-5/8 object-cover overflow-hidden rounded-lg bg-primary-soft-gray-balance border border-transparent hover:border-primary-orange transition-colors duration-500",
        className
      )}
    >
      {/* 
        ESTADO 2 (Fondo Trasero y Producto):
        Capa inferior fija. 
        El envase y el fondo son COMPLETAMENTE estáticos.
      */}
      <div className="absolute inset-0 flex items-center justify-center bg-primary-soft-gray-balance">
        <Image
          src={productImageSrc}
          alt={`Producto envase: ${name}`}
          width={600}
          height={600}
          className="w-full h-auto object-contain mix-blend-multiply"
        />
      </div>

      {/* 
        ESTADO 1 (Capa Frontal - Telón):
        Este div principal se desliza a la izquierda (-100%) en hover.
      */}
      <div className="absolute inset-0 transition-transform duration-1400 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-x-full overflow-hidden">

        {/* 
          Mantenimiento de Posición Estática para la Imagen y Gradiente:
          Se trasladan hacia la derecha (+100%) a la misa velocidad. 
          Esto cancela matemáticamente el movimiento del contenedor padre y 
          genera el efecto perfecto de "wipe line" sobre una imagen estática.
        */}
        <div className="absolute inset-0 h-full w-full transition-transform duration-1400 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-full flex items-center justify-center">
          <Image
            src={imageSrc}
            alt={name}
            fill
            className="object-cover transition-transform duration-1400 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-120"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          {/* Overlay Dark Gradiente fijo junto con la imagen */}
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
        </div>
      </div>

      {/* 
        CONTENIDO FIJO SUPERIOR (Capa de Textos e Iconos):
        Estático e independiente de todas las capas transformadas.
      */}
      <div className="absolute inset-0 z-10 p-6 flex flex-col justify-between pointer-events-none">

        {/* Parte Superior: Número y Flecha */}
        <div className="flex justify-between items-start w-full">
          {/* Número (blanco -> negro) */}
          <span className="text-body font-bold text-primary-orange">
            {number}
          </span>

          {/* Icono de flecha (blanca -> negra, y rota 45 grados a la derecha) */}
          <ArrowUpRight strokeWidth={1} size={48} className="text-primary-orange group-hover:rotate-45 transition-all duration-500" />
        </div>

        {/* Parte Inferior: Nombre del Producto */}
        <div className="mt-auto">
          <h3 className="text-h5 font-bold text-white group-hover:text-black transition-colors duration-500 tracking-tight leading-tight max-w-[90%]">
            {name}
          </h3>
        </div>

      </div>
    </Link>
  );
}
