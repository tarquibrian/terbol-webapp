import { Button } from "@/components/ui/Button";
import Image from "next/image";
import { ArrowRight, GraduationCap } from "lucide-react";

export function EndBanner() {
  return (
    <section className="wrapper-section">
      <div className="wrapper-content flex flex-col gap-10">
        <div className="flex flex-col items-center justify-center text-center">
          <h2 className="heading-h4 font-bold text-gray-900 mb-4">¿No encontraste lo que buscabas?</h2>
          <p className="text-body-medium text-gray-500">Contáctanos y te ayudaremos a encontrar el producto perfecto para ti.</p>
        </div>
        <div className="flex flex-col md:flex-row justify-center gap-4">
          <div className="relative w-full rounded-lg overflow-hidden p-3">
            <Image src="/images/endbanner1.png" alt="End Banner" width={680} height={500} className="absolute inset-0 w-full h-full object-cover" />
            <div className="relative backdrop-blur-md bg-white/70 rounded-md p-6 flex flex-col justify-start items-start gap-8 md:gap-10">
              <div className="w-14 h-14 rounded-md bg-primary-black flex items-center justify-center text-white">
                <GraduationCap size={40} strokeWidth={1.3} />
              </div>
              <div className="flex flex-col gap-2">
                <h4 className="heading-h5">¿Querés aprender con nosotros?</h4>
                <p className="text-body-medium text-gray-500">Contenido educativo, guías especializadas y publicaciones para profundizar tus conocimientos.</p>
              </div>
              <Button size="sm" variant="secondary" icon={<ArrowRight size={20} />}>VER PUBLICACIONES</Button>
            </div>
          </div>
          <div className="relative w-full rounded-lg overflow-hidden p-3">
            <Image src="/images/endbanner2.png" alt="End Banner 2" width={680} height={500} className="absolute inset-0 w-full h-full object-cover" />
            <div className="relative backdrop-blur-md bg-white/70 rounded-md p-6 flex flex-col justify-start items-start gap-8 md:gap-10">
              <div className="w-14 h-14 rounded-md bg-primary-black flex items-center justify-center text-white">
                <GraduationCap size={40} strokeWidth={1.3} />
              </div>
              <div className="flex flex-col gap-2">
                <h4 className="heading-h5">¿Querés aprender con nosotros?</h4>
                <p className="text-body-medium text-gray-500">Contenido educativo, guías especializadas y publicaciones para profundizar tus conocimientos.</p>
              </div>
              <Button size="sm" variant="outline" icon={<ArrowRight size={20} className="w-full" />}>VER PUBLICACIONES</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}