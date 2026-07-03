export const TARGET_AUDIENCE_IMAGE_FALLBACK = "/images/productextra.png";

export const TARGET_AUDIENCES: Record<string, { image: string; items: { title: string; description: string }[] }> = {
  "Longevidad y Prevención": {
    image: TARGET_AUDIENCE_IMAGE_FALLBACK,
    items: [
      {
        title: "Protección y prevención.",
        description: "Ideal para quienes buscan cuidar su corazón, mantener niveles saludables de triglicéridos y promover una circulación óptima."
      },
      {
        title: "Apoyo a largo plazo.",
        description: "Para adultos que buscan prevenir el desgaste natural del cuerpo y mantener un estilo de vida proactivo."
      },
      {
        title: "Compensación dietaria esencial.",
        description: "La solución perfecta complementaria para asegurar la ingesta necesaria de nutrientes enfocados en la longevidad."
      }
    ]
  },
  "Rendimiento y Energía": {
    image: TARGET_AUDIENCE_IMAGE_FALLBACK,
    items: [
      {
        title: "Impulso de energía sostenida.",
        description: "Diseñado para deportistas y personas activas que requieren vitalidad a lo largo del día sin picos de cansancio."
      },
      {
        title: "Recuperación física.",
        description: "Acelera los procesos de recuperación tras periodos de alta exigencia física."
      },
      {
        title: "Aumento del rendimiento.",
        description: "Ideal para optimizar tu metabolismo energético y superar tus límites en cada meta propuesta."
      }
    ]
  },
  "Foco y Antiestrés": {
    image: TARGET_AUDIENCE_IMAGE_FALLBACK,
    items: [
      {
        title: "Foco y claridad cognitiva.",
        description: "Para profesionales y estudiantes que enfrentan altas exigencias intelectuales y necesitan potenciar su concentración y memoria."
      },
      {
        title: "Reducción del estrés.",
        description: "Perfecto para personas con rutinas intensas que buscan calmar la mente y mejorar la calidad de su serenidad diaria."
      },
      {
        title: "Equilibrio emocional diario.",
        description: "Ayuda a mantener la estabilidad mental y el bienestar general incluso en las jornadas de mayor exigencia."
      }
    ]
  },
  "Belleza y Piel": {
    image: TARGET_AUDIENCE_IMAGE_FALLBACK,
    items: [
      {
        title: "Piel radiante y firme.",
        description: "Promueve la hidratación y firmeza de la piel desde el interior gracias a nutrientes de alta pureza."
      },
      {
        title: "Fortalecimiento estructural.",
        description: "Ayuda a mantener un cabello fuerte y unas uñas resistentes al quiebre diario."
      },
      {
        title: "Combate el envejecimiento.",
        description: "Acción antioxidante que retrasa los signos superficiales de la edad actuando desde las células."
      }
    ]
  },
  "Salud Inmunológica": {
    image: TARGET_AUDIENCE_IMAGE_FALLBACK,
    items: [
      {
        title: "Defensas activas.",
        description: "Fortalece las barreras naturales de tu cuerpo ayudándote a ser más resistente frente a amenazas externas."
      },
      {
        title: "Protección estacional.",
        description: "Ideal para consumir durante cambios de clima o temporada donde la inmunidad puede debilitarse."
      },
      {
        title: "Recuperación eficiente.",
        description: "Acelera el proceso de sanación y reduce el tiempo que necesitas para volver a estar al cien por ciento."
      }
    ]
  },
  "Descanso y Reparación": {
    image: TARGET_AUDIENCE_IMAGE_FALLBACK,
    items: [
      {
        title: "Sueño profundo.",
        description: "Facilita la inducción del sueño y evita las interrupciones nocturnas para lograr un descanso real."
      },
      {
        title: "Relajación muscular.",
        description: "Ayuda a distensionar los músculos y articulaciones cargadas tras el día a día."
      },
      {
        title: "Renovación celular nocturna.",
        description: "Aprovecha el ciclo de sueño para reparar y regenerar tejidos desde el interior."
      }
    ]
  }
};
