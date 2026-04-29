/**
 * @fileoverview AsesorHero — sección hero de la página "Asesor de Ventas".
 */

"use client";

import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";
import { ArrowRight, CheckCircle2, PackageCheck, TrendingUp } from "lucide-react";
import {
  isSvgAsset,
  resolvePromoterAsset,
  sortByOrder,
  type PromoterDetail,
  type PromoterSection,
} from "../../data/cmsPromoter";

interface AsesorHeroProps {
  data?: PromoterSection;
}

export function AsesorHero({ data }: AsesorHeroProps) {
  const header = data?.header;
  const details = sortByOrder(data?.details);
  const defaultIcons = [
    <CheckCircle2 key="check" strokeWidth={1.4} size={22} />,
    <PackageCheck key="package" strokeWidth={1.4} size={22} />,
    <TrendingUp key="growth" strokeWidth={1.4} size={22} />,
  ];

  const label = header?.label ?? "QUIERO SER PROMOTORA";
  const title = header?.title || "Únete como promotora y transforma tu futuro";
  const description =
    header?.description ||
    "Forma parte de Térbol Inspira y ayuda a otros a alcanzar su bienestar mientras construyes tu propio camino al éxito con el respaldo de una marca líder.";
  const imageUrl = resolvePromoterAsset(
    header?.image ?? header?.image_url,
    "/images/image19.png",
  );

  const renderDetailIcon = (detail: PromoterDetail, index: number) => {
    const iconUrl = resolvePromoterAsset(detail.icon, "");

    if (iconUrl) {
      return (
        <Image
          src={iconUrl}
          alt=""
          width={22}
          height={22}
          unoptimized={isSvgAsset(iconUrl)}
          className="h-5 w-5 object-contain"
        />
      );
    }

    return defaultIcons[index % defaultIcons.length];
  };

  return (
    <section className="wrapper-section">
      <div className="wrapper-content">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_570px] items-center">

          <div className="flex flex-col justify-center space-y-8 max-w-[760px]" >
            <div className="space-y-4">
              <AnimateOnScroll variant="slide-up">
                <span className="text-body-small font-medium text-gray-500 uppercase block mb-3">
                  {label}
                </span>
                <h1 className="heading-h1-bold text-balance">
                  {title}
                </h1>
              </AnimateOnScroll>

              <AnimateOnScroll variant="slide-up" delay={0.15}>
                <p className="text-gray-500 text-body-medium max-w-[600px]">
                  {description}
                </p>
              </AnimateOnScroll>
            </div>

            <AnimateOnScroll variant="slide-up" delay={0.3}>
              <div className="flex flex-col gap-4 sm:flex-row w-full lg:w-auto">
                <Button
                  size="default"
                  className="w-full sm:w-auto px-8"
                  href="#advisor-registration"
                >
                  REGISTRARME COMO PROMOTORA
                </Button>
                <Button
                  variant="outline"
                  size="default"
                  className="w-full sm:min-w-[280px] justify-between"
                  icon={<ArrowRight />}
                  iconPosition="right"
                  href="/success-plan"
                >
                  CONOCE EL PLAN DE ÉXITO
                </Button>
              </div>
            </AnimateOnScroll>

            {details.length > 0 && (
              <AnimateOnScroll variant="slide-up" delay={0.4}>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {details.map((detail, index) => (
                    <div
                      key={detail.id ?? detail.title}
                      className="flex items-center gap-3 rounded-md bg-primary-soft-gray-balance px-4 py-3 text-primary"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-primary-orange">
                        {renderDetailIcon(detail, index)}
                      </span>
                      <p className="text-body-small font-medium text-gray-700">
                        {detail.title}
                      </p>
                    </div>
                  ))}
                </div>
              </AnimateOnScroll>
            )}
          </div>

          <AnimateOnScroll variant="fade" delay={0.2} className="w-full lg:justify-end p-2 sm:p-3 bg-primary-soft-gray-balance rounded-2xl">
            <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-primary-soft-gray-balance lg:h-[500px] flex items-center justify-center">
              <Image
                src={imageUrl}
                alt={title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 570px"
              />
            </div>
          </AnimateOnScroll>

        </div>
      </div>
    </section>
  );
}
