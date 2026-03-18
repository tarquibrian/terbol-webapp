/**
 * @fileoverview SuccessPlanView — vista completa de la página "Plan de Éxito".
 *
 * Compone los componentes del feature `success-plan`.
 * Importada por `app/success-plan/page.tsx` como thin wrapper.
 */

import * as React from "react";
import { SuccessPlanHero } from "../components/SuccessPlanHero";

/**
 * Vista completa de la página Plan de Éxito.
 *
 * Secciones futuras: Steps, Benefits, Testimonials, CTA, etc.
 */
export function SuccessPlanView() {
  return (
    <>
      <SuccessPlanHero />
      {/* Futuras secciones: Steps, Benefits, Testimonials, CTA, etc. */}
    </>
  );
}
