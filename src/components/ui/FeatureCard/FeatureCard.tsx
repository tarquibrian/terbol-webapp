import * as React from "react";
import { cn } from "@/lib/utils";

export interface FeatureCardProps {
  /** Icono o elemento visual que encabeza la card */
  icon: React.ReactNode;
  /** Título principal de la card */
  title: string;
  /** Párrafo de descripción o contenido */
  description: string;
  /** Variante del diseño */
  variant?: "default" | "ghost";
  /** Alineación del contenido */
  align?: "left" | "right";
  /** Clases adicionales opcionales */
  className?: string;
}

/**
 * Componente FeatureCard (o PillarCard).
 * Card reutilizable que consiste en un Icono (típicamente naranja),
 * un título y un texto descriptivo.
 */
const VARIANT_CLASSES = {
  default: "p-6 rounded-lg bg-primary-soft-gray-balance gap-10",
  ghost: "p-0 bg-transparent gap-6",
};

export function FeatureCard({
  icon,
  title,
  description,
  variant = "default",
  align = "left",
  className,
}: FeatureCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col",
        align === "left" ? "items-start text-left" : "items-end text-right",
        VARIANT_CLASSES[variant],
        className
      )}
    >
      <div className="flex items-center justify-center text-primary-orange">
        {icon}
      </div>
      <div className={cn("flex flex-col gap-2", align === "right" && "items-end")}>
        <h3
          className={cn(
            "text-primary",
            variant === "default" ? "heading-h6-bold" : "heading-h5"
          )}
        >
          {title}
        </h3>
        <p className="text-body-medium text-gray-400">{description}</p>
      </div>
    </div>
  );
}
