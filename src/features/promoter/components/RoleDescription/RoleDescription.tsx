/**
 * @fileoverview RoleDescription — sección que describe el rol de la promotora.
 */

"use client";

import { Fragment, type ReactNode } from "react";
import Image from "next/image";
import { FeatureCard } from "@/components/ui/FeatureCard";
import { TrendingUp, Users, ShieldCheck } from "lucide-react";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";
import {
  isSvgAsset,
  resolvePromoterAsset,
  sortByOrder,
  type PromoterDetail,
  type PromoterSection,
} from "../../data/cmsPromoter";

interface RoleDescriptionProps {
  data?: PromoterSection;
}

function getDefaultIcon(index: number): ReactNode {
  const icons = [
    <TrendingUp key="growth" strokeWidth={1.2} size={40} />,
    <Users key="users" strokeWidth={1.2} size={40} />,
    <ShieldCheck key="shield" strokeWidth={1.2} size={40} />,
  ];

  return icons[index % icons.length];
}

function getDetailIcon(detail: PromoterDetail, index: number): ReactNode {
  const iconUrl = resolvePromoterAsset(detail.icon, "");

  if (!iconUrl) return getDefaultIcon(index);

  return (
    <Image
      src={iconUrl}
      alt=""
      width={40}
      height={40}
      unoptimized={isSvgAsset(iconUrl)}
      className="h-10 w-10 object-contain"
    />
  );
}

export function RoleDescription({ data }: RoleDescriptionProps) {
  const header = data?.header;
  const details =
    data?.details && data.details.length > 0
      ? sortByOrder(data.details)
      : [
          {
            title: "Crecimiento Profesional",
            description:
              "Accede a capacitaciones constantes y herramientas para potenciar tus habilidades de venta y liderazgo.",
          },
          {
            title: "Comunidad de Apoyo",
            description:
              "Forma parte de una red de asesores que comparten experiencias y crecen juntos hacia metas comunes.",
          },
          {
            title: "Respaldo Institucional",
            description:
              "Trabaja con productos de alta calidad respaldados por la trayectoria y ciencia de Térbol.",
          },
        ];

  const title = header?.title || "¿Qué significa ser asesor de ventas?";
  const subtitle = header?.label || header?.subtitle || "El rol de promotora";
  const legend = header?.legend || header?.description;
  const imageUrl = resolvePromoterAsset(
    header?.image ?? header?.image_url,
    "/images/image20.png",
  );

  return (
    <section className="wrapper-section">
      <div className="wrapper-content">
        <div className="flex flex-col gap-6 mb-12 items-center text-center">
          <AnimateOnScroll variant="slide-up">
            <span className="text-gray-400 text-body-medium font-medium uppercase">
              {subtitle}
            </span>
          </AnimateOnScroll>
          <AnimateOnScroll variant="slide-up" delay={0.1}>
            <h2 className="heading-h3 text-foreground">{title}</h2>
          </AnimateOnScroll>
          {legend && (
            <AnimateOnScroll variant="slide-up" delay={0.2}>
              <p className="text-gray-500 text-body-medium max-w-[760px]">
                {legend}
              </p>
            </AnimateOnScroll>
          )}
        </div>

        <AnimateOnScroll variant="fade" delay={0.2}>
          <div className="w-full bg-primary-soft-gray-light rounded-lg p-3 max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
              {/* Columna 1: Features */}
              <div className="flex flex-col justify-center px-4 py-2">
                <div className="flex flex-col gap-6 py-6">
                  {details.map((item, idx) => (
                    <Fragment key={item.id ?? item.title ?? idx}>
                      <FeatureCard
                        variant="ghost"
                        icon={getDetailIcon(item, idx)}
                        title={item.title ?? ""}
                        description={item.description ?? ""}
                      />
                      {idx < details.length - 1 && (
                        <div className="w-full h-px bg-gray-100 my-2"></div>
                      )}
                    </Fragment>
                  ))}
                </div>
              </div>

              {/* Columna 2: Imagen */}
              <div className="relative min-h-[400px] rounded-md overflow-hidden">
                <Image
                  src={imageUrl}
                  alt={title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
