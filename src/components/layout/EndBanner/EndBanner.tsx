import { Button } from "@/components/ui/Button";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  GraduationCap,
  BookOpen,
  Heart,
  ShieldPlus,
} from "lucide-react";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";
interface EndBannerProps {
  variant?: "default" | "expanded" | "compact";
  title?: string;
  description?: string;
}

const LARGE_CARDS = [
  {
    id: 1,
    imageSrc: "/images/endbanner1.png",
    title: "¿Querés aprender con nosotros?",
    description:
      "Contenido educativo, guías especializadas y publicaciones para profundizar tus conocimientos.",
    buttonVariant: "secondary" as const,
  },
  {
    id: 2,
    imageSrc: "/images/endbanner2.png",
    title: "¿Querés aprender con nosotros?",
    description:
      "Contenido educativo, guías especializadas y publicaciones para profundizar tus conocimientos.",
    buttonVariant: "outline" as const,
    iconClassName: "w-full",
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

export function EndBanner({ variant = "default" }: EndBannerProps) {
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
                  alt="End Banner"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
                <div className="relative backdrop-blur-md bg-white/70 rounded-md p-6 flex flex-col justify-start items-start gap-8 md:gap-10">
                  <div className="w-14 h-14 rounded-md bg-primary-black flex items-center justify-center text-white">
                    <GraduationCap size={40} strokeWidth={1.3} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="heading-h5">{card.title}</h3>
                    <p className="text-body-medium text-gray-500">
                      {card.description}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant={card.buttonVariant}
                    icon={
                      <ArrowRight size={20} className={card.iconClassName} />
                    }
                  >
                    VER PUBLICACIONES
                  </Button>
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
