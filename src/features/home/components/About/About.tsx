import Image from "next/image";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";

export const About = () => {
  return (
    <section className="wrapper-section">
      <div className="wrapper-content">
        <div className="bg-primary-soft-gray-balance m-full max-w-[1200px] mx-auto p-3 rounded-lg">
          <AnimateOnScroll variant="slide-up">
            <div className="flex flex-col  gap-4 py-4 md:py-8 max-w-[770px] mx-auto">
              <header className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-6">
                <span className="text-body font-medium text-primary-orange">NUESTRA MARCA</span>
                <div className="w-[20px] h-px bg-gray-200"></div>
                <Image src="/logo-terbol.svg" alt="Terbol" width={200} height={33} />
              </header>
              <p className="text-center text-body-md text-gray-500">Térbol Inspira es la línea premium de vitaminas y nutracéuticos de Térbol, desarrollada con formulaciones respaldadas por evidencia científica. Nacimos para ofrecer productos de alta gama a quienes no se conforman con menos cuando se trata de su salud.</p>
            </div>
          </AnimateOnScroll>

          {/* <div className="rounded-lg overflow-hidden bg-primary-black"> */}
          <AnimateOnScroll variant="fade" delay={0.4} className="aspect-video">
            <div className="w-full h-full rounded-lg bg-primary-black"></div>
            {/* <iframe
              className="w-full h-full rounded-lg"
              src="https://www.youtube.com/embed/VIDEO_ID"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            /> */}
          </AnimateOnScroll>
          {/* </div> */}
        </div>
      </div>
    </section>
  );
}