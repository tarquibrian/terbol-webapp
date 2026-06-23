import Image from "next/image";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";
import { YouTubeFacade } from "@/components/ui/YouTubeFacade";
import { assetPath } from "@/lib/base-path";

interface AboutProps {
  data?: {
    description?: string;
    video_url?: string;
    video_id?: string;
    embed_url?: string;
  };
}

export const About = ({ data }: AboutProps) => {
  return (
    <section className="w-full py-6 md:py-8 lg:py-12">
      <div className="wrapper-content">
        <div className="bg-primary-soft-gray-balance m-full max-w-[1200px] mx-auto p-3 rounded-lg">
          <AnimateOnScroll variant="slide-up">
            <div className="flex flex-col  gap-4 py-4 md:py-8 max-w-[770px] mx-auto">
              <header className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-6">
                <span className="text-body font-medium text-primary-orange" aria-hidden="true">NUESTRA MARCA</span>
                <div className="w-[20px] h-px bg-gray-200"></div>
                <Image src={assetPath("/logo-terbol.svg")} alt="Terbol" width={200} height={33} style={{ width: 'auto', height: 'auto' }} />
              </header>
              <p className="text-center text-body-medium text-gray-500">
                {data?.description || "Térbol Inspira es la línea premium de vitaminas y nutracéuticos de Térbol, desarrollada con formulaciones respaldadas por evidencia científica. Nacimos para ofrecer productos de alta gama a quienes no se conforman con menos cuando se trata de su salud."}
              </p>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll variant="fade" delay={0.4} className="aspect-video relative rounded-lg overflow-hidden bg-primary-black">
            {data?.embed_url ? (
              <YouTubeFacade
                embedUrl={data.embed_url}
                videoId={data.video_id}
                title="Térbol Inspira Video"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500">Video no disponible</div>
            )}
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
};
