"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { LayoutRouterContext } from "next/dist/shared/lib/app-router-context.shared-runtime";

export interface PageTransitionProps {
  children: React.ReactNode;
  /** Duración de la animación de entrada de página (fade-in) en segundos */
  enterDuration?: number;
  /** Duración de la animación de salida de página (fade-out) en segundos */
  exitDuration?: number;
}

/**
 * Componente interno para "congelar" el contexto de enrutamiento
 * en la página que está saliendo. Esto evita que Next.js (App Router)
 * re-renderice la página nueva dentro de la página vieja durante 
 * el fade-out.
 */
function FrozenRouter({ children }: { children: React.ReactNode }) {
  const context = React.useContext(LayoutRouterContext);
  const frozen = React.useRef(context).current;

  return (
    <LayoutRouterContext.Provider value={frozen}>
      {children}
    </LayoutRouterContext.Provider>
  );
}

/**
 * Envoltorio para animaciones de transición de ruta de toda la página.
 * Usa `framer-motion` para retrasar el desmontaje de la página previa
 * permitiendo una animación de salida suave (opacity: 0) antes de 
 * renderizar y animar la entrada (opacity: 1) de la nueva página.
 *
 * @param props.enterDuration - Control editable del tiempo de entrada
 * @param props.exitDuration - Control editable del tiempo de salida
 */
export function PageTransition({
  children,
  enterDuration = 0.3,
  exitDuration = 0.2,
}: PageTransitionProps) {
  const pathname = usePathname();

  return (
    <AnimatePresence 
      mode="wait" 
      onExitComplete={() => window.scrollTo(0, 0)}
    >
      <motion.div
        key={pathname}
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          transition: { duration: enterDuration, ease: "easeOut" },
        }}
        exit={{
          opacity: 0,
          transition: { duration: exitDuration, ease: "easeIn" },
        }}
      >
        <FrozenRouter>{children}</FrozenRouter>
      </motion.div>
    </AnimatePresence>
  );
}

