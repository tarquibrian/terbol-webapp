import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";
import type { BlogHeroContent } from "../data/cmsBlog";

interface BlogHeroProps {
  data?: BlogHeroContent;
}

export function BlogHero({ data }: BlogHeroProps) {
  return (
    <section className="wrapper-section">
      <div className="wrapper-content flex flex-col items-center gap-6">
        <div className="text-body-small font-medium text-gray-500 bg-primary-soft-gray-balance px-3 py-1 rounded-full flex items-center gap-2">
          <div className="h-2 w-2 bg-gray-300 rounded-full"></div>
          {data?.label ?? "NUESTRO BLOG"}
        </div>
        <AnimateOnScroll variant="slide-up">
          <h1 className="heading-h2 font-semibold text-foreground text-center">
            {data?.title ?? "Bienestar y salud al alcance de tu mano"}
          </h1>
        </AnimateOnScroll>
        <AnimateOnScroll variant="slide-up" delay={0.15}>
          <p className="text-body-medium text-center text-gray-500 max-w-[800px]">
            {data?.description ??
              "Explora nuestros artículos más recientes sobre nutrición, salud mental y estilo de vida para encontrar tu balance perfecto."}
          </p>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
