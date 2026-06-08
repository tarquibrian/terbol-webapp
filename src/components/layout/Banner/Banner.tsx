import { Button } from "@/components/ui/Button";
import { ArrowRight, Phone, Mail } from "lucide-react";
import Image from "next/image";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";
import { resolveImageAsset } from "@/lib/image-assets";

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

interface BannerProps {
  data?: BannerData;
}

export function Banner({ data }: BannerProps) {
  // Función para resolver la URL de la imagen del CMS
  const getImageUrl = (path?: string) => {
    return resolveImageAsset(path, "/banner/productbanner.png") ?? "/banner/productbanner.png";
  };

  const imageUrl = getImageUrl(data?.image);

  // Separar la descripción si tiene varias oraciones (opcional, para mantener el diseño original de dos párrafos si es necesario)
  // Aquí usaremos la descripción completa si viene del CMS.
  const description = data?.description || 
    "Súmate a una comunidad que cree en tu potencial y forma parte de la red de Asesores de Venta Independiente de térbol Inspira donde tu crecimiento personal y profesional van de la mano. Este es tu momento para inspirar, crecer y transformar tu vida.";

  return (
    <section className="wrapper-section">
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
                className="w-fit justify-between"
                href={data?.button_url || "#"}
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
                <div className="flex items-center gap-3 text-gray-500">
                  <Phone size={20} />
                  <p className="text-body-medium">
                    {data?.country_code && data?.phone_number 
                      ? `${data.country_code} ${data.phone_number}`
                      : "+591 6789 1234"}
                  </p>
                </div>
                <div className="hidden sm:block h-3 w-[2px] bg-gray-400"></div>
                <div className="flex items-center gap-3 text-gray-500">
                  <Mail size={20} />
                  <p className="text-body-medium">
                    {data?.email || "contacto@terbolinspira.com"}
                  </p>
                </div>
              </div>
            </AnimateOnScroll>
          </div>

          {/* Imagen (Derecha en desktop, Abajo en mobile) */}
          <AnimateOnScroll variant="slide-up" delay={0.2} className="w-full flex items-end justify-center lg:justify-end min-h-[200px] lg:min-h-0 relative">
            <Image
              src={imageUrl}
              alt={data?.title || "Comienza tu camino hacia el bienestar"}
              width={700}
              height={540}
              className="object-contain object-bottom w-full h-auto lg:h-full lg:absolute lg:bottom-0 lg:right-0"
              loading="lazy"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </AnimateOnScroll>

        </div>
      </div>
    </section>
  );
}
