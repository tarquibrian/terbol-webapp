/**
 * @fileoverview AboutView — vista completa de la página "¿Quiénes somos?".
 *
 * Compone los componentes del feature `about`.
 * Importada por `app/about/page.tsx` como thin wrapper.
 */

import * as React from "react";
import { AboutHero } from "../components/AboutHero";

/**
 * Vista completa de la página About.
 *
 * Secciones futuras: equipo, valores, timeline, partners, etc.
 */
export function AboutView() {
  return (
    <>
      <AboutHero />
      {/* Futuras secciones: Team, Values, Timeline, Partners, etc. */}
    </>
  );
}
