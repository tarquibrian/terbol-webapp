import { SuccessPlanStep } from "../SuccessPlanStep/SuccessPlanStep";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { resolveImageAsset } from "@/lib/image-assets";
import { ArrowRight } from "lucide-react";
import * as React from "react";
import s1 from "../../../../../public/images/image15.png";
import s2 from "../../../../../public/images/image14.png";
import s3 from "../../../../../public/images/image16.png";
import s4 from "../../../../../public/images/image18.png";
import s5 from "../../../../../public/images/image19.png";
import s6 from "../../../../../public/images/image20.png";

interface StepItem {
  id: number | string;
  order?: number;
  title: string;
  description: string;
  image?: string;
  reverse?: boolean;
}

interface SuccessPlanStepsSectionProps {
  data?: {
    header?: {
      label?: string;
      title?: string;
      description?: string;
    };
    steps?: StepItem[];
  };
  /** URL directa de WhatsApp (wa.me/...) para el botón de contacto */
  whatsappUrl?: string;
}

export function SuccessPlanStepsSection({
  data,
  whatsappUrl,
}: SuccessPlanStepsSectionProps) {
  const contactHref = whatsappUrl || "/promoter#advisor-registration";

  const getImageUrl = (path?: string) => {
    return resolveImageAsset(path);
  };

  const header = data?.header || {
    label: "NUESTRO MODELO",
    title: "¿Cómo funciona Térbol Inspira?",
    description: "Un modelo cercano y personalizado, basado en promotoras que conocen los productos y acompañan a cada persona."
  };

  const defaultSteps = [
    {
      id: 1,
      number: 1,
      title: "Ganancia por vender",
      description: `
      <b>Tu trabajo tiene valor. Tu pasión también.</b><br>
      Cada Asesor de Ventas Independiente gana entre el <b>25% y el 30%</b> de descuento por cada venta realizada. Esto no solo representa ingresos reales: cada venta es una oportunidad de llevar salud, bienestar y energía a más personas. <br>
      Tú construyes tu cartera de clientes, planificas tus metas y nosotros premiamos tu compromiso con ganancias inmediatas.
      `,
      image: s1,
      reverse: false,
    },
    {
      id: 2,
      number: 2,
      title: "Ganancia por Retener: Inspira+",
      description: `
      <b>La clave está en la perseverancia.</b><br>
      Realiza pedidos cada mes y recibe <b> bonificaciones e incentivos diferenciados </b> por tu constancia.<br>
      En <b>térbol Inspira</b> valoramos a quienes cultivan relaciones duraderas, acompañan a sus clientes y mantienen vivo el vínculo.
      Tu compromiso merece ser reconocido.
      `,
      image: s2,
      reverse: true,
    },
    {
      id: 3,
      number: 3,
      title: "Bono por Incorporación: Inspira y Gana",
      description: `
      <b>Cuando inspiras, también ganas.</b><br>
      Invita a más personas a unirse a esta gran oportunidad y recibe <b>un bono fijo por cada nuevo integrante que forme parte de nuestra comunidad térbol Inspira.</b><br>
      Cada incorporación es una historia que comienza a transformarse gracias a ti.<br>
      <b>Inspirar a alguien a emprender es sembrar libertad.</b>
  `,
      image: s3,
      reverse: false,
    },
    {
      id: 4,
      number: 4,
      title: "Bono de Crecimiento: Inspira y Crece ",
      description: `
      <b>Inspirar es el primer paso para crecer.</b><br>
      Al construir tu equipo de ventas y ayudarlo a crecer, recibes <b>un porcentaje de la venta neta comisionable de tu red directa.</b><br>
      Esto no es solo un bono: es el resultado de crear una red sólida, activa y comprometida.<br>
      <b>Cuando tu equipo crece, tú también creces.</b>
  `,
      image: s4,
      reverse: true,
    },
    {
      id: 5,
      number: 5,
      title: "Bono de Líder en Formación",
      description: `
      <b>Tu camino de liderazgo está comenzando.</b><br>
        Liderar es asumir el compromiso de crecer y, al mismo tiempo, impulsar el crecimiento de tu equipo.<br>
        Al desarrollar una red estable y mantener una evaluación positiva durante dos meses consecutivos, accedes a un bono especial que reconoce tu avance.
        Este bono no solo recompensa resultados, es un reflejo del impacto que empiezas a generar en quienes te rodean.
  `,
      image: s5,
      reverse: false,
    },
    {
      id: 6,
      number: 6,
      title: "Bono de Liderazgo",
      description: `
      <b>Consolidas tu liderazgo, multiplicas tu impacto.</b><br>
      Al convertirte en Líder, guiando, acompañando y desarrollando una red directa y sólida, ganas a <b>un porcentaje en efectivo de la venta neta comisionable de toda tu red directa.</b><br>
        Tu ejemplo motiva. Tu liderazgo transforma.
        Y en <b>térbol Inspira</b>, celebramos ese camino con reconocimiento y crecimiento.
  `,
      image: s6,
      reverse: true,
    },
  ];

  const steps = data?.steps && data.steps.length > 0 
    ? data.steps.map((step, index) => ({
        ...step,
        number: step.order || index + 1,
        // En el diseño original, los items pares están a la inversa (imagen a la izq)
        reverse: (index + 1) % 2 === 0,
        // Resolvemos la URL de la imagen del CMS o usamos un fallback
        image: getImageUrl(step.image) || defaultSteps[index % defaultSteps.length].image
      }))
    : defaultSteps;

  return (
    <section className="wrapper-section">
      <div className="wrapper-content flex flex-col gap-20">
        <AnimateOnScroll variant="slide-up">
          <div className="flex flex-col gap-4 items-center justify-center text-center">
            {header.label && (
              <span className="text-gray-400 text-body-medium font-medium uppercase tracking-wider block mb-2">
                {header.label}
              </span>
            )}
            <h2 className="heading-h2 font-semibold">{header.title}</h2>
            <p className="text-body-medium text-gray-500 max-w-[850px] whitespace-pre-line">
              {header.description}
            </p>
            <div className="flex w-full flex-col items-center justify-center gap-4 pt-4 md:w-auto md:flex-row">
              <Button
                variant="default"
                size="default"
                className="w-full md:w-auto"
                icon={<WhatsAppIcon className="h-5 w-5 -translate-y-px" />}
                href={contactHref}
                target={whatsappUrl ? "_blank" : undefined}
                rel={whatsappUrl ? "noopener noreferrer" : undefined}
              >
                Contactar por whatsapp
              </Button>
              <Button
                href="/promoter"
                variant="outline"
                size="default"
                className="w-full md:w-auto md:min-w-[300px]"
                icon={<ArrowRight strokeWidth={1.75} />}
              >
                Saber más
              </Button>
            </div>
          </div>
        </AnimateOnScroll>
        <div className="flex flex-col gap-20 max-w-[1200px] mx-auto">
          {steps.map((step) => (
            <SuccessPlanStep
              key={step.id || step.number}
              number={step.number}
              title={step.title}
              description={step.description}
              image={step.image}
              reverse={step.reverse!}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
