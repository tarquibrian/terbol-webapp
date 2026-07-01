import { Button } from "@/components/ui/Button";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  GraduationCap,
  BookOpen,
  FlaskConical,
  Heart,
  Package,
  ShieldPlus,
  Users,
} from "lucide-react";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { assetPath } from "@/lib/base-path";

interface EndBannerProps {
  variant?: "default" | "expanded" | "compact";
  title?: string;
  description?: string;
  /** URL directa de WhatsApp (wa.me/...) para la card de contacto */
  whatsappUrl?: string;
}

const LARGE_CARDS = [
  {
    id: 1,
    imageSrc: "/images/endbanner1.png",
    icon: <GraduationCap size={40} strokeWidth={1.3} />,
    title: "¿Quieres conocer más de nuestros productos?",
    description:
      "Accede a contenido educativo, guías especializadas y publicaciones diseñadas para profundizar tus conocimientos.",
    buttonLabel: "VER PUBLICACIONES",
    buttonIcon: <ArrowRight size={20} />,
    buttonVariant: "secondary" as const,
    href: "/blog",
  },
  {
    id: 2,
    imageSrc: "/images/endbanner2.png",
    icon: <Users size={40} strokeWidth={1.3} />,
    title: "Contáctanos",
    description:
      "Contacta para recibir asesoramiento y saber más de térbol Inspira.",
    buttonLabel: "CONTACTAR POR WHATSAPP",
    buttonIcon: <WhatsAppIcon className="h-5 w-5 -translate-y-px" />,
    buttonVariant: "outline" as const,
    href: "/promoter#advisor-registration",
  },
];

const SMALL_CARDS = [
  {
    href: "/blog",
    icon: <BookOpen size={40} strokeWidth={1} />,
    title: "Guías de Salud",
    description: "Aprende más sobre tu cuerpo",
    delay: 0.3,
  },
  {
    href: "/about",
    icon: <Heart size={40} strokeWidth={1} />,
    title: "Nuestra Misión",
    description: "Conoce el propósito de Terbol",
    delay: 0.4,
  },
  {
    href: "/success-plan",
    icon: <ShieldPlus size={40} strokeWidth={1} />,
    title: "Plan de Éxito",
    description: "Únete a nuestro programa",
    delay: 0.5,
  },
];

const COMPACT_CARDS = [
  {
    href: "/products",
    icon: <Package size={40} strokeWidth={1} />,
    title: "Ver catálogo completo",
    description: "Explora todos nuestros productos",
    delay: 0.3,
  },
  {
    href: "/science-and-quality",
    icon: <FlaskConical size={40} strokeWidth={1} />,
    title: "Ciencia y Calidad",
    description: "Nuestro respaldo científico",
    delay: 0.4,
  },
  {
    href: "/success-plan",
    icon: <BookOpen size={40} strokeWidth={1} />,
    title: "Cómo funciona",
    description: "Aprende más sobre el modelo",
    delay: 0.5,
  },
];

export function EndBanner({
  variant = "default",
  title,
  description,
  whatsappUrl,
}: EndBannerProps) {
  const whatsappHref = whatsappUrl || "/promoter#advisor-registration";
  const isCompact = variant === "compact";
  const headingTitle =
    title ??
    (isCompact
      ? "Continúa explorando"
      : "¿No encontraste lo que buscabas?");
  const headingDescription =
    description ??
    (isCompact
      ? undefined
      : "Contáctanos y te ayudaremos a encontrar el producto perfecto para ti.");
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
                    const href = card.id === 2 ? whatsappHref : card.href;
                    const isExternal = card.id === 2 && whatsappUrl;

                    return (
                      <Button
                        href={href}
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
                    <p className="text-body-medium line-clamp-1 text-gray-500">
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
