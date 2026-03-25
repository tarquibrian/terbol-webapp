import { Button } from "@/components/ui/Button";
import { ArrowRight, Phone, Mail } from "lucide-react";
import Image from "next/image";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";

export function Banner() {
  return (
    <section className="w-full">
      <div className="container max-w-[1512px] mx-auto py-12 px-6 md:px-16">
        <div className="flex flex-col lg:grid lg:grid-cols-2 rounded-lg bg-linear-to-b from-[#D2D2D2] to-[#EDEDE8] min-h-[540px] w-full overflow-hidden">

          {/* Contenido (Textos + Boton + Contacto) */}
          <div className="flex flex-col gap-8 lg:gap-10 justify-center items-start w-full px-6 py-10 lg:px-16 lg:py-16">
            <AnimateOnScroll variant="slide-up" className="flex flex-col gap-8 lg:gap-10">
              <div className="flex flex-col gap-4">
                <h4 className="heading-h3 text-primary">
                  Comienza tu camino hacia el bienestar
                </h4>
                <p className="text-body text-gray-500">
                  Súmate a una comunidad que cree en tu potencial y forma parte de la red de Asesores de Venta Independiente de térbol Inspira donde tu crecimiento personal y profesional van de la mano.
                </p>
                <p className="text-body text-gray-500">
                  Este es tu momento para inspirar, crecer y transformar tu vida.
                </p>
              </div>

              <Button
                variant="secondary"
                size="default"
                icon={<ArrowRight />}
                iconPosition="right"
                className="w-full sm:w-auto"
              >
                REGISTRARSE COMO ASESOR DE VENTAS
              </Button>

              {/* Información de Contacto */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mt-2 text-nowrap flex-wrap">
                <div className="flex items-center gap-3 text-gray-500">
                  <Phone size={20} />
                  <p className="text-body">+591 6789 1234</p>
                </div>
                <div className="hidden sm:block h-3 w-[2px] bg-gray-400"></div>
                <div className="flex items-center gap-3 text-gray-500">
                  <Mail size={20} />
                  <p className="text-body">contacto@terbolinspira.com</p>
                </div>
              </div>
            </AnimateOnScroll>
          </div>

          {/* Imagen (Derecha en desktop, Abajo en mobile) */}
          <AnimateOnScroll variant="slide-up" delay={0.2} className="w-full flex items-end justify-center lg:justify-end min-h-[200px] lg:min-h-0 relative">
            <Image
              src="/banner/productbanner.png"
              alt="Comienza tu camino hacia el bienestar"
              width={700}
              height={540}
              className="object-contain object-bottom w-full h-auto lg:h-full lg:absolute lg:bottom-0 lg:right-0"
              priority
            />
          </AnimateOnScroll>

        </div>
      </div>
    </section>
  );
}