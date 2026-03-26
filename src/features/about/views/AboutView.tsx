/**
 * @fileoverview AboutView — vista completa de la página "¿Quiénes somos?".
 *
 * Compone los componentes del feature `about`.
 * Importada por `app/about/page.tsx` como thin wrapper.
 */

import * as React from "react";
import { AboutHero } from "../components/AboutHero";
import { WhoWeAre } from "../components/WhoWeAre";
import { ContactForm } from "../components/ContactForm";
import { Banner } from "@/components/layout/Banner";

export function AboutView() {
  return (
    <>
      <AboutHero />
      <WhoWeAre />
      <ContactForm />
      <Banner />
    </>
  );
}
