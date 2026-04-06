import { FeatureCard } from "@/components/ui/FeatureCard";
import { Award, Microscope, Star } from "lucide-react";

export function SuccessPlanFeaturesSection() {
  return (
    <section className="wrapper-section">
      <div className="wrapper-content">
        <div className="flex flex-col gap-4 items-center justify-center text-center">
          <h2 className="heading-h2 font-semibold">¿Qué es el Plan de Éxito?</h2>
          <p className="text-body-medium text-gray-500 max-w-[850px]">
            El Plan de Éxito es un programa de fidelización de Térbol que premia a los clientes por su preferencia. Con cada compra, los clientes acumulan puntos que pueden canjear por productos de alta calidad.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10">
          <FeatureCard
            title="Formulaciones únicas"
            description="Cada producto es desarrollado con combinaciones de ingredientes cuidadosamente seleccionados, basados en investigación científica actual."
            icon={<Award strokeWidth={1.2} size={40} />}
          />
          <FeatureCard
            title="Respaldo científico"
            description="Evidencia de laboratorio respalda la eficacia de nuestros ingredientes. Transparencia total sobre lo que consumís."
            icon={<Microscope strokeWidth={1.2} size={40} />}
          />
          <FeatureCard
            title="Alta gama"
            description="Ingredientes de primera calidad, procesos de fabricación controlados y estándares internacionales en cada producto."
            icon={<Star strokeWidth={1.2} size={40} />}
          />
        </div>
      </div>
    </section>
  );
}
