import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { AnimateOnScroll } from "../AnimateOnScroll";

interface CategoryCardProps {
  name: string;
  imageSrc: string;
  href: string;
  animationDelay?: number;
  index?: number;
  /** Si es true, deshabilita la animación de entrada individual de la tarjeta */
  disableAnimation?: boolean;
}

export function CategoryCard({ name, imageSrc, href, animationDelay, index = 0, disableAnimation = false }: CategoryCardProps) {
  // Si se provee, usamos el delay custom; sino, el por defecto para grid-cols-3
  const delay = animationDelay !== undefined ? animationDelay : 0.1 * (index % 3);

  const cardContent = (
    <Link
      href={href}
      prefetch={true}
      scroll={false}
      className="group flex flex-col p-3 rounded-lg bg-primary-soft-gray-balance border border-transparent hover:border-primary-orange transition-colors duration-500"
    >
      {/* Imagen Superior */}
      <div className="relative w-full aspect-video rounded-md overflow-hidden mb-4">
        <Image
          src={imageSrc}
          alt={`Categoría ${name}`}
          fill
          className="object-cover transition-transform duration-300 ease-out group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
      </div>

      {/* Título Inferior e Ícono */}
      <div className="flex items-center justify-between px-1">
        <span className="text-body-lg font-bold text-foreground">
          {name}
        </span>
        <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-primary-orange transition-colors" />
      </div>
    </Link>
  );

  if (disableAnimation) {
    return cardContent;
  }

  return (
    <AnimateOnScroll variant="slide-up" delay={delay}>
      {cardContent}
    </AnimateOnScroll>
  );
}
