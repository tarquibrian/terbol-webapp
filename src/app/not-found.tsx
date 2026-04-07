import { Button } from "@/components/ui/Button/Button";
import { ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center max-w-4xl mx-auto py-20">
      <h1 className="text-[clamp(80px,15vw,160px)] font-bold leading-none text-primary-orange mb-6 drop-shadow-sm">
        404
      </h1>
      <h2 className="heading-h4 font-semibold text-primary-black mb-6">
        No pudimos encontrar nada aquí
      </h2>
      <p className="text-body-small text-gray-600 max-w-2xl mx-auto mb-10">
        Ya sea que quieras mejorar tu salud o emprender con nosotros, queremos que tengas toda la información clara. Revisa nuestras preguntas frecuentes o escríbenos directamente.
      </p>
      <Button href="/" variant="secondary" size="default" icon={<ArrowRight strokeWidth={1.75} />}>
        Volver a Inicio
      </Button>
    </div>
  );
}
