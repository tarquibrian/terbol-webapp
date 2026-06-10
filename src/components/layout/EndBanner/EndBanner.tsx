import { Button } from "@/components/ui/Button";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  GraduationCap,
  BookOpen,
  Heart,
  ShieldPlus,
  MessageCircle,
  Users,
} from "lucide-react";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";
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
    title: "¿Querés aprender con nosotros?",
    description:
      "Contenido educativo, guías especializadas y publicaciones para profundizar tus conocimientos.",
    buttonLabel: "VER PUBLICACIONES",
    buttonIcon: <ArrowRight size={20} />,
    buttonVariant: "secondary" as const,
    href: "/blog",
  },
  {
    id: 2,
    imageSrc: "/images/endbanner2.png",
    icon: <Users size={40} strokeWidth={1.3} />,
    title: "¿Querés saber más?",
    description:
      "Contactá con una promotora para recibir asesoramiento personalizado sobre qué productos son ideales para vos.",
    buttonLabel: "CONTACTAR POR WHATSAPP",
    buttonIcon: <MessageCircle size={20} />,
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

export function EndBanner({ variant = "default", whatsappUrl }: EndBannerProps) {
  const whatsappHref = whatsappUrl || "/promoter#advisor-registration";
  return (
    <section className="wrapper-section pb-16 md:pb-24">
      <div className="wrapper-content flex flex-col gap-0">
        <div className="flex flex-col items-center justify-center text-center mb-10">
          <h2 className="heading-h4 font-bold text-gray-900 mb-4">
            ¿No encontraste lo que buscabas?
          </h2>
          <p className="text-body-medium text-gray-500">
            Contáctanos y te ayudaremos a encontrar el producto perfecto para
            ti.
          </p>
        </div>

        {/* Large Cards (Hidden in compact variant) */}
        {variant !== "compact" && (
          <div className="flex flex-col md:flex-row justify-center gap-4 mb-4">
            {LARGE_CARDS.map((card) => (
              <div
                key={card.id}
                className="relative w-full rounded-lg overflow-hidden p-3"
              >
                <Image
                  src={card.imageSrc}
                  alt={card.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
                <div className="relative backdrop-blur-md bg-white/70 rounded-md p-6 flex flex-col justify-start items-start gap-8 md:gap-10">
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

                    return isExternal ? (
                      <a href={href} target="_blank" rel="noopener noreferrer">
                        <Button
                          size="sm"
                          variant={card.buttonVariant}
                          icon={card.buttonIcon}
                        >
                          {card.buttonLabel}
                        </Button>
                      </a>
                    ) : (
                      <Link href={href}>
                        <Button
                          size="sm"
                          variant={card.buttonVariant}
                          icon={card.buttonIcon}
                        >
                          {card.buttonLabel}
                        </Button>
                      </Link>
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
            {SMALL_CARDS.map((card) => (
              <AnimateOnScroll
                key={card.href}
                variant="slide-up"
                delay={card.delay}
              >
                <Link
                  href={card.href}
                  className="group bg-primary-soft-gray-balance rounded-lg px-6 py-8 flex items-center gap-6 border border-transparent hover:border-primary-orange transition-all"
                >
                  <div className="w-10 h-10 flex items-center justify-center text-primary-orange shrink-0 transition-colors">
                    {card.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="heading-h6 text-gray-900 font-bold mb-1">
                      {card.title}
                    </h4>
                    <p className="text-body-medium text-gray-500 line-clamp-1">
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
