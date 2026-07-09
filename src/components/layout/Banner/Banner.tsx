import { Button } from "@/components/ui/Button";
import { ArrowRight, Mail } from "lucide-react";
import Image from "next/image";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";
import { resolveImageAsset } from "@/lib/image-assets";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { cn } from "@/lib/utils";

export interface BannerData {
  title?: string;
  description?: string;
  button_label?: string;
  button_url?: string;
  email?: string;
  country_code?: string;
  phone_number?: string;
  image?: string;
}

export type BannerSpacing = "default" | "compact";

/** Construye la URL de WhatsApp a partir de country_code y phone_number. */
export function buildWhatsAppUrl(countryCode?: string, phoneNumber?: string): string | undefined {
  if (!countryCode || !phoneNumber) return undefined;
  const digits = `${countryCode}${phoneNumber}`.replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}` : undefined;
}

interface BannerProps {
  data?: BannerData;
  spacing?: BannerSpacing;
  className?: string;
}

const SECTION_SPACING_CLASSES: Record<BannerSpacing, string> = {
  default: "wrapper-section",
  compact: "py-6 md:py-8 lg:py-12 w-full",
};

const isExternalUrl = (url?: string) => {
  return url ? /^(https?:)?\/\//.test(url) : false;
};

export function Banner({ data, spacing = "default", className }: BannerProps) {
  // Función para resolver la URL de la imagen del CMS
  const getImageUrl = (path?: string) => {
    return resolveImageAsset(path, "/banner/productbanner.png") ?? "/banner/productbanner.png";
  };

  const imageUrl = getImageUrl(data?.image);

  // Separar la descripción si tiene varias oraciones (opcional, para mantener el diseño original de dos párrafos si es necesario)
  // Aquí usaremos la descripción completa si viene del CMS.
  const description = data?.description || 
    "Súmate a una comunidad que cree en tu potencial y forma parte de la red de Asesores de Venta Independiente de térbol Inspira donde tu crecimiento personal y profesional van de la mano. Este es tu momento para inspirar, crecer y transformar tu vida.";

  const isExternalButton = isExternalUrl(data?.button_url);

  return (
    <section className={cn(SECTION_SPACING_CLASSES[spacing], className)}>
      <div className="wrapper-content">
        <div className="flex flex-col lg:grid lg:grid-cols-2 rounded-lg bg-linear-to-b from-[#D2D2D2] to-[#EDEDE8] min-h-[540px] w-full overflow-hidden">

          {/* Contenido (Textos + Boton + Contacto) */}
          <div className="flex flex-col md:gap-8 lg:gap-10 justify-center items-start w-full px-6 py-10 lg:px-16 lg:py-16">
            <AnimateOnScroll variant="slide-up" className="flex flex-col gap-8 lg:gap-10">
              <div className="flex flex-col gap-4">
                <h4 className="heading-h3 text-primary">
                  {data?.title || "Comienza tu camino hacia el bienestar"}
                </h4>
                <p className="text-body-medium text-gray-500 whitespace-pre-line">
                  {description}
                </p>
              </div>

              <Button
                variant="secondary"
                size="default"
                icon={<ArrowRight />}
                iconPosition="right"
                className="w-fit justify-between lg:min-w-[350px]"
                href={data?.button_url || "#"}
                target={isExternalButton ? "_blank" : undefined}
                rel={isExternalButton ? "noopener noreferrer" : undefined}
              >
                <span className="hidden sm:block uppercase">
                  {data?.button_label || "REGISTRARSE COMO ASESOR DE VENTAS"}
                </span>
                <span className="block sm:hidden uppercase">
                  {data?.button_label || "REGISTRARSE AHORA"}
                </span>
              </Button>

              {/* Información de Contacto */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mt-2 text-nowrap flex-wrap">
                {(() => {
                  const whatsappUrl = buildWhatsAppUrl(data?.country_code, data?.phone_number);
                  const phoneDisplay = data?.country_code && data?.phone_number
                    ? `${data.country_code} ${data.phone_number}`
                    : "+591 6789 1234";

                  return whatsappUrl ? (
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 text-gray-500 hover:text-primary-orange transition-colors"
                    >
                      <WhatsAppIcon className="h-[22px] w-[22px] shrink-0 -translate-y-[2px]" />
                      <span className="text-body-medium">{phoneDisplay}</span>
                    </a>
                  ) : (
                    <div className="flex items-center gap-2.5 text-gray-500">
                      <WhatsAppIcon className="h-[22px] w-[22px] shrink-0 -translate-y-[2px]" />
                      <p className="text-body-medium">{phoneDisplay}</p>
                    </div>
                  );
                })()}
                <div className="hidden sm:block h-3 w-[2px] bg-gray-400"></div>
                {(() => {
                  const emailAddress = data?.email || "contacto@terbolinspira.com";

                  return (
                    <a
                      href={`mailto:${emailAddress}`}
                      className="flex items-center gap-3 text-gray-500 hover:text-primary-orange transition-colors"
                    >
                      <Mail size={20} />
                      <span className="text-body-medium">{emailAddress}</span>
                    </a>
                  );
                })()}
              </div>
            </AnimateOnScroll>
          </div>

          {/* Imagen (Derecha en desktop, Abajo en mobile) */}
          <AnimateOnScroll variant="slide-up" delay={0.2} className="w-full p-3 lg:h-full">
            <div className="relative min-h-[260px] w-full overflow-hidden rounded-md sm:min-h-[360px] lg:h-full lg:min-h-0">
              <Image
                src={imageUrl}
                alt={data?.title || "Comienza tu camino hacia el bienestar"}
                fill
                className="object-cover object-bottom"
                loading="lazy"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </AnimateOnScroll>

        </div>
      </div>
    </section>
  );
}
