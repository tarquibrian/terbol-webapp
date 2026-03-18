/**
 * @fileoverview AnimateOnScroll — componente reutilizable para animaciones
 * basadas en scroll usando Framer Motion.
 *
 * Proporciona dos variantes de animación:
 *
 * 1. `fade` — El elemento aparece suavemente (opacity: 0 → 1) en su posición.
 * 2. `slide-up` — El elemento aparece desde 20px abajo y sube a su posición
 *    original con un efecto de desvanecimiento simultáneo.
 *
 * Usa `whileInView` de Framer Motion para activar la animación cuando el
 * elemento entra al viewport, lo que funciona tanto al cargar la página
 * como al hacer scroll.
 *
 * @example
 * // Fade simple
 * <AnimateOnScroll variant="fade">
 *   <h1>Título</h1>
 * </AnimateOnScroll>
 *
 * // Slide up con delay personalizado
 * <AnimateOnScroll variant="slide-up" delay={0.2}>
 *   <p>Párrafo animado</p>
 * </AnimateOnScroll>
 *
 * // Con tag HTML personalizado
 * <AnimateOnScroll variant="fade" as="section" className="w-full">
 *   <div>Contenido</div>
 * </AnimateOnScroll>
 */

"use client";

import * as React from "react";
import { motion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

// ─── Variantes de Animación ───

/** Animación de tipo disponibles para el componente */
export type AnimationVariant = "fade" | "slide-up";

/**
 * Mapa de variantes de Framer Motion.
 *
 * Cada variante define dos estados:
 * - `hidden`: estado inicial (invisible)
 * - `visible`: estado final (visible, en posición)
 */
const ANIMATION_VARIANTS: Record<AnimationVariant, Variants> = {
  /**
   * Fade: aparece en su posición original.
   * opacity: 0 → 1
   */
  fade: {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
    },
  },

  /**
   * Slide Up: aparece desde 20px abajo con fade.
   * opacity: 0 → 1, y: 20px → 0px
   */
  "slide-up": {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
    },
  },
};

// ─── Configuración por defecto ───

/** Duración estándar de la animación en segundos */
const DEFAULT_DURATION = 0.6;

/** Delay base en segundos (útil para stagger manual) */
const DEFAULT_DELAY = 0;

/**
 * Porcentaje del viewport mínimo que debe ser visible para
 * activar la animación. 0.2 = 20% del elemento visible.
 */
const DEFAULT_VIEWPORT_AMOUNT = 0.2;

/** Curva de easing para transiciones suaves */
const DEFAULT_EASING = [0.25, 0.1, 0.25, 1.0] as const;

// ─── Props ───

/**
 * Props del componente AnimateOnScroll.
 */
interface AnimateOnScrollProps {
  /** Variante de animación a aplicar */
  variant?: AnimationVariant;

  /** Delay antes de iniciar la animación (en segundos) */
  delay?: number;

  /** Duración de la animación (en segundos) */
  duration?: number;

  /**
   * Si true, la animación se ejecuta solo una vez.
   * Si false, se re-ejecuta cada vez que el elemento
   * vuelve a entrar al viewport.
   * @default true
   */
  once?: boolean;

  /**
   * Porcentaje del elemento que debe estar visible para
   * activar la animación (0-1).
   * @default 0.2
   */
  viewportAmount?: number;

  /** Contenido a animar */
  children: React.ReactNode;

  /** Clases CSS adicionales para el contenedor */
  className?: string;

  /**
   * Elemento HTML a renderizar.
   * @default "div"
   */
  as?: "div" | "section" | "article" | "span" | "header" | "footer";
}

/**
 * Componente reutilizable para animaciones de entrada basadas en scroll.
 *
 * Usa `whileInView` de Framer Motion para detectar cuándo el elemento
 * entra al viewport y ejecutar la animación automáticamente.
 *
 * @param props.variant - Tipo de animación: "fade" o "slide-up"
 * @param props.delay - Delay en segundos
 * @param props.duration - Duración en segundos
 * @param props.once - Si se ejecuta solo una vez (default: true)
 * @param props.viewportAmount - Porción visible para activar (default: 0.2)
 * @param props.children - Contenido a animar
 * @param props.className - Clases CSS opcionales
 * @param props.as - Tag HTML del contenedor (default: "div")
 */
export function AnimateOnScroll({
  variant = "fade",
  delay = DEFAULT_DELAY,
  duration = DEFAULT_DURATION,
  once = true,
  viewportAmount = DEFAULT_VIEWPORT_AMOUNT,
  children,
  className,
  as = "div",
}: AnimateOnScrollProps) {
  /**
   * Creamos el componente motion dinámico según el tag `as`.
   * Esto permite renderizar <motion.section>, <motion.div>, etc.
   */
  const MotionComponent = motion.create(as);

  return (
    <MotionComponent
      variants={ANIMATION_VARIANTS[variant]}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: viewportAmount }}
      transition={{
        duration,
        delay,
        ease: DEFAULT_EASING,
      }}
      className={cn(className)}
    >
      {children}
    </MotionComponent>
  );
}
