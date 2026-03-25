import * as React from "react";
import { cn } from "@/lib/utils";

export interface FeatureCardProps {
  /** Icono o elemento visual que encabeza la card */
  icon: React.ReactNode;
  /** Título principal de la card */
  title: string;
  /** Párrafo de descripción o contenido */
  description: string;
  /** Clases adicionales opcionales */
  className?: string;
}

/**
 * Componente FeatureCard (o PillarCard).
 * Card reutilizable que consiste en un Icono (típicamente naranja),
 * un título y un texto descriptivo.
 */
export function FeatureCard({ icon, title, description, className }: FeatureCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-start gap-10 p-6 rounded-lg bg-primary-soft-gray-balance",
        className
      )}
    >
      <div className="flex items-center justify-center text-primary-orange">
        {icon}
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="heading-h6-bold text-primary">{title}</h3>
        <p className="text-body text-gray-400">
          {description}
        </p>
      </div>
    </div>
  );
}
