import { Button } from "@/components/ui/Button";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  FlaskConical,
  Package,
  Users,
} from "lucide-react";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { assetPath } from "@/lib/base-path";

interface EndBannerProps {
  variant?: "default" | "expanded" | "compact";
  title?: string;
  description?: string;
}

const CALL_CENTER_WHATSAPP_URL = "https://wa.me/59177860555";

const LARGE_CARDS = [
  {
    id: 1,
    imageSrc: "/images/endbanner1.png",
    icon: <Package size={40} strokeWidth={1.3} />,
    title: "Conoce más de nuestros productos",
    description: "Descubre todos nuestros productos y encuentra el ideal para ti.",
    buttonLabel: "VER PRODUCTOS",
    buttonIcon: <ArrowRight size={20} />,
    buttonVariant: "secondary" as const,
    href: "/products",
  },
  {
    id: 2,
    imageSrc: "/images/endbanner2.png",
    icon: <Users size={40} strokeWidth={1.3} />,
    title: "Tu espacio de asesoría",
    description:
      "Recibe asesoramiento de nuestro equipo especializado. Estamos aquí para orientarte, resolver tus dudas y acompañarte en tu bienestar.",
    buttonLabel: "Contáctanos",
    buttonIcon: <WhatsAppIcon className="h-5 w-5 -translate-y-px" />,
    buttonVariant: "outline" as const,
    href: CALL_CENTER_WHATSAPP_URL,
  },
];

const SMALL_CARDS = [
  {
    href: "/products",
    icon: <Package size={40} strokeWidth={1} />,
    title: "Ver catálogo completo",
    description: "Descubre todos nuestros productos y encuentra el ideal para ti.",
    delay: 0.3,
  },
  {
    href: "/science-and-quality",
    icon: <FlaskConical size={40} strokeWidth={1} />,
    title: "Ciencia y calidad",
    description: "Respaldo científico que garantiza excelencia en cada fórmula.",
    delay: 0.4,
  },
  {
    href: "/success-plan",
    icon: <Users size={40} strokeWidth={1} />,
    title: "Un negocio para ti",
    description:
      "Sé parte de térbol Inspira: un negocio cercano que te da ingresos y propósito.",
    delay: 0.5,
  },
];

const COMPACT_CARDS = [
  {
    href: "/products",
    icon: <Package size={40} strokeWidth={1} />,
    title: "Ver catálogo completo",
    description: "Descubre todos nuestros productos y encuentra el ideal para ti.",
    delay: 0.3,
  },
  {
    href: "/science-and-quality",
    icon: <FlaskConical size={40} strokeWidth={1} />,
    title: "Ciencia y calidad",
    description: "Respaldo científico que garantiza excelencia en cada fórmula.",
    delay: 0.4,
  },
  {
    href: "/success-plan",
    icon: <Users size={40} strokeWidth={1} />,
    title: "Un negocio para ti",
    description:
      "Sé parte de térbol Inspira: un negocio cercano que te da ingresos y propósito.",
    delay: 0.5,
  },
];

export function EndBanner({
  variant = "default",
  title,
  description,
}: EndBannerProps) {
  const isCompact = variant === "compact";
  const headingTitle = title ?? "Continúa explorando.";
  const headingDescription =
    description ??
    (isCompact ? undefined : "Para inspirar, crecer y transformar tu vida.");
  const smallCards = isCompact ? COMPACT_CARDS : SMALL_CARDS;

  return (
    <section className="wrapper-section pb-16 md:pb-24">
      <div className="wrapper-content flex flex-col gap-0">
        <div className="flex flex-col items-center justify-center text-center mb-10">
          <h2
            className={`heading-h4 font-bold text-gray-900 ${
              headingDescription ? "mb-4" : ""
            }`}
          >
            {headingTitle}
          </h2>
          {headingDescription && (
            <p className="text-body-medium text-gray-500">
              {headingDescription}
            </p>
          )}
        </div>

        {/* Large Cards (Hidden in compact variant) */}
        {variant !== "compact" && (
          <div className="flex flex-col md:flex-row justify-center gap-4 mb-4">
            {LARGE_CARDS.map((card) => (
              <div
                key={card.id}
                className="relative flex min-h-[320px] w-full rounded-lg overflow-hidden p-3 md:min-h-[335px]"
              >
                <Image
                  src={assetPath(card.imageSrc)}
                  alt={card.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
                <div className="relative z-10 flex flex-1 flex-col items-start justify-between gap-8 rounded-md bg-white/70 p-6 backdrop-blur-md md:gap-10">
                  <div className="w-14 h-14 rounded-md bg-primary-black flex items-center justify-center text-white">
                    {card.icon}
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="heading-h5">{card.title}</h3>
                    <p className="text-body-medium text-gray-500">
                      {card.description}
                    </p>
                  </div>
                  {(() => {
                    const isExternal = card.href.startsWith("http");

                    return (
                      <Button
                        href={card.href}
                        size="sm"
                        variant={card.buttonVariant}
                        icon={card.buttonIcon}
                        target={isExternal ? "_blank" : undefined}
                        rel={isExternal ? "noopener noreferrer" : undefined}
                      >
                        {card.buttonLabel}
                      </Button>
                    );
                  })()}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 3 Small Cards (Hidden in default variant) */}
        {variant !== "default" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {smallCards.map((card) => (
              <AnimateOnScroll
                key={card.href}
                variant="slide-up"
                delay={card.delay}
                className="h-full"
              >
                <Link
                  href={card.href}
                  className="group flex h-full items-center gap-4 rounded-lg border border-transparent bg-primary-soft-gray-balance px-5 py-6 transition-[border-color,color] duration-300 hover:border-primary-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:gap-6 sm:px-6 sm:py-8"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center text-primary-orange transition-colors">
                    {card.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="heading-h6 mb-1 font-bold text-gray-900">
                      {card.title}
                    </h4>
                    <p className="text-body-medium line-clamp-2 text-gray-500">
                      {card.description}
                    </p>
                  </div>
                  <div className="text-gray-300 group-hover:text-primary-orange transition-colors">
                    <ArrowRight size={20} />
                  </div>
                </Link>
              </AnimateOnScroll>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
