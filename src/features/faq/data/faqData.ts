export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export const FAQ_DATA: FaqItem[] = [
  {
    id: "1",
    question: "¿Qué es Térbol Inspira y en qué se diferencia?",
    answer: "Térbol Inspira es la línea premium de Térbol especializada exclusivamente en productos de alta gama con evidencia científica, enfocados en el bienestar integral y la longevidad."
  },
  {
    id: "2",
    question: "¿Cómo puedo convertirme en asesor de ventas?",
    answer: "Puedes registrarte a través de nuestro Plan de Éxito. Simplemente completa el formulario en nuestra página de inicio o contáctanos directamente para guiarte en el proceso."
  },
  {
    id: "3",
    question: "¿Tienen envíos a nivel nacional?",
    answer: "Sí, realizamos envíos a todo el territorio nacional a través de nuestra red de distribuidores autorizados y logística propia para asegurar la calidad del producto."
  },
  {
    id: "4",
    question: "¿Los productos tienen registro sanitario?",
    answer: "Absolutamente. Todos nuestros suplementos y productos nutricionales cuentan con el registro sanitario correspondiente y están bajo estrictos controles de calidad."
  },
];
