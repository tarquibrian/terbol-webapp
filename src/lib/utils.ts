import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Utilidad base para combinar clases de Tailwind de forma segura
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
