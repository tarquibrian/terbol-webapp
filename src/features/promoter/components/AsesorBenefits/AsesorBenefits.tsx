/**
 * @fileoverview AsesorBenefits — Sección de beneficios para el asesor de ventas.
 */

"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import { DollarSign, Clock, Heart, Zap, Award, Smile } from "lucide-react";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";
import {
  isSvgAsset,
  resolvePromoterAsset,
  sortByOrder,
  type PromoterDetail,
  type PromoterSection,
} from "../../data/cmsPromoter";

interface BenefitItemProps {
  icon: ReactNode;
  label?: string;
  title: string;
  description: string;
  index: number;
}

function BenefitCard({
  icon,
  label,
  title,
  description,
  index,
}: BenefitItemProps) {
  return (
    <AnimateOnScroll variant="slide-up" delay={index * 0.1} className="h-full">
      <div className="bg-primary-soft-gray-balance p-6 rounded-md h-full flex flex-col gap-8 group transition-colors duration-300 border border-transparent">
        {/* Header: Icono + Etiqueta interna */}
        <div className="flex items-start justify-between w-full">
          <div className="text-primary-orange">{icon}</div>
          {label && (
            <span className="text-[16px] font-medium text-primary-orange bg-white uppercase rounded-full px-2 py-[2px] leading-normal">
              {label}
            </span>
          )}
        </div>

        {/* Contenido */}
        <div className="flex flex-col gap-2">
          <h3 className="heading-h6-bold text-primary">{title}</h3>
          <p className="text-body-small text-gray-500">{description}</p>
        </div>
      </div>
    </AnimateOnScroll>
  );
}

interface AsesorBenefitsProps {
  data?: PromoterSection;
}

function getDefaultIcon(index: number): ReactNode {
  const icons = [
    <DollarSign key="income" size={48} strokeWidth={1.2} />,
    <Clock key="time" size={48} strokeWidth={1.2} />,
    <Heart key="health" size={48} strokeWidth={1.2} />,
    <Zap key="energy" size={48} strokeWidth={1.2} />,
    <Award key="award" size={48} strokeWidth={1.2} />,
    <Smile key="smile" size={48} strokeWidth={1.2} />,
  ];

  return icons[index % icons.length];
}

function getBenefitIcon(item: PromoterDetail, index: number): ReactNode {
  const iconUrl = resolvePromoterAsset(item.icon, "");

  if (!iconUrl) return getDefaultIcon(index);

  return (
    <Image
      src={iconUrl}
      alt=""
      width={48}
      height={48}
      unoptimized={isSvgAsset(iconUrl)}
      className="h-12 w-12 object-contain"
    />
  );
}

export function AsesorBenefits({ data }: AsesorBenefitsProps) {
  const header = data?.header;
  const rawDetails =
    data?.details && data.details.length > 0 ? sortByOrder(data.details) : null;

  const defaultBenefits: PromoterDetail[] = [
    {
      label: "Ganancias",
      title: "Ingresos Competitivos",
      description:
        "Obtén comisiones atractivas por cada venta realizada y bonos por cumplimiento de metas.",
    },
    {
      label: "Tiempo",
      title: "Flexibilidad Total",
      description:
        "Tú decides tus propios horarios y cuánto tiempo dedicarle a tu negocio independiente.",
    },
    {
      label: "Salud",
      title: "Bienestar Primero",
      description:
        "Acceso preferencial a productos que mejoran tu salud y la de tu entorno cercano.",
    },
    {
      label: "Energía",
      title: "Crecimiento Personal",
      description:
        "Desarrolla nuevas habilidades de comunicación, ventas y gestión de equipos.",
    },
    {
      label: "Reconocimiento",
      title: "Premios y Viajes",
      description:
        "Participa en programas de incentivos exclusivos, convenciones y viajes nacionales.",
    },
    {
      label: "Comunidad",
      title: "Satisfacción Personal",
      description:
        "Siente el orgullo de ayudar a otras personas a transformar su vida y su salud.",
    },
  ];

  const benefits = rawDetails
    ? rawDetails.map((item) => ({
        id: item.id,
        icon: item.icon,
        label: item.label || item.subtitle || "",
        title: item.title,
        description: item.description,
      }))
    : defaultBenefits;

  const subtitle = header?.label || header?.subtitle || "Beneficios";
  const title =
    header?.title || "¿Por qué ser asesor de ventas de Térbol Inspira?";
  const description =
    header?.description ||
    "Más allá de los ingresos, ser promotora te ofrece crecimiento personal, flexibilidad y la satisfacción de ayudar a otros.";

  return (
    <section className="wrapper-section bg-white">
      <div className="wrapper-content">
        {/* Cabecera */}
        <div className="flex flex-col gap-6 mb-12 items-center text-center max-w-[800px] mx-auto">
          <AnimateOnScroll variant="slide-up">
            <span className="text-gray-400 text-body-medium font-medium uppercase">
              {subtitle}
            </span>
          </AnimateOnScroll>
          <AnimateOnScroll variant="slide-up" delay={0.1}>
            <h2 className="heading-h3 text-foreground">{title}</h2>
          </AnimateOnScroll>
          {description && (
            <AnimateOnScroll variant="slide-up" delay={0.2}>
              <p className="text-gray-500 text-body-medium">{description}</p>
            </AnimateOnScroll>
          )}
        </div>

        {/* Grid 3x2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {benefits.map((benefit, idx) => (
            <BenefitCard
              key={benefit.id ?? benefit.title ?? idx}
              index={idx}
              icon={getBenefitIcon(benefit, idx)}
              label={benefit.label}
              title={benefit.title ?? ""}
              description={benefit.description ?? ""}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
