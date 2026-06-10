/**
 * @fileoverview validation.ts — Reglas de validación compartidas de inputs.
 *
 * Tipos y evaluador usados por `FormInput` y `FormTextarea` para no duplicar la
 * lógica de validación en cada componente.
 */

export type ValidationRule =
  | { type: "required"; message?: string }
  | { type: "minLength"; value: number; message?: string }
  | { type: "maxLength"; value: number; message?: string }
  | { type: "pattern"; value: RegExp; message?: string }
  | { type: "email"; message?: string }
  | { type: "custom"; validate: (v: string) => boolean; message: string };

export type ValidationState = "idle" | "error" | "success";

/** Evalúa las reglas en orden y devuelve el primer mensaje de error, o null. */
export function runValidations(
  value: string,
  rules: ValidationRule[],
): string | null {
  for (const rule of rules) {
    switch (rule.type) {
      case "required":
        if (!value.trim())
          return rule.message ?? "Este campo es obligatorio.";
        break;
      case "minLength":
        if (value.length < rule.value)
          return rule.message ?? `Mínimo ${rule.value} caracteres.`;
        break;
      case "maxLength":
        if (value.length > rule.value)
          return rule.message ?? `Máximo ${rule.value} caracteres.`;
        break;
      case "pattern":
        if (!rule.value.test(value))
          return rule.message ?? "Formato inválido.";
        break;
      case "email":
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          return rule.message ?? "Correo electrónico inválido.";
        break;
      case "custom":
        if (!rule.validate(value))
          return rule.message;
        break;
    }
  }
  return null;
}
