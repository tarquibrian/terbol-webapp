/**
 * @fileoverview Hook personalizado para gestionar el estado y la lógica
 * del submenú desplegable del Navbar.
 *
 * Encapsula:
 * - Estado de apertura/cierre del popup.
 * - Cierre automático al hacer click fuera (click outside).
 * - Cierre al presionar la tecla Escape (accesibilidad).
 * - Prevención del cierre prematuro al soltar el click del trigger.
 */

import { useState, useEffect, useRef, useCallback } from "react";

/**
 * Retorno del hook `useNavSubmenu`.
 */
interface UseNavSubmenuReturn {
  /** Indica si el submenú está abierto */
  isOpen: boolean;
  /** Alterna la visibilidad del submenú */
  toggle: () => void;
  /** Cierra el submenú */
  close: () => void;
  /** Ref para el contenedor del submenú (necesaria para click-outside) */
  submenuRef: React.RefObject<HTMLDivElement | null>;
}

/**
 * Hook para manejar el ciclo de vida del submenú desplegable.
 *
 * @returns {UseNavSubmenuReturn} Objeto con estado y acciones del submenú.
 *
 * @example
 * const { isOpen, toggle, close, submenuRef } = useNavSubmenu();
 *
 * return (
 *   <div ref={submenuRef}>
 *     <button onClick={toggle}>Más</button>
 *     {isOpen && <SubmenuPanel onClose={close} />}
 *   </div>
 * );
 */
export function useNavSubmenu(): UseNavSubmenuReturn {
  const [isOpen, setIsOpen] = useState(false);
  const submenuRef = useRef<HTMLDivElement | null>(null);

  /**
   * Flag para prevenir que el evento `mouseup` del botón
   * trigger cierre inmediatamente el menú después de abrirlo.
   * Se activa brevemente tras abrir el menú.
   */
  const justOpenedRef = useRef(false);

  /** Alterna el estado de apertura/cierre */
  const toggle = useCallback(() => {
    setIsOpen((prev) => {
      const next = !prev;
      if (next) {
        justOpenedRef.current = true;
        // Reset del flag después de un ciclo de eventos
        setTimeout(() => {
          justOpenedRef.current = false;
        }, 150);
      }
      return next;
    });
  }, []);

  /** Cierra el submenú */
  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  /**
   * Efecto: cierre al hacer click fuera del contenedor del submenú.
   * Solo se registra cuando el menú está abierto para evitar listeners innecesarios.
   */
  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      // Evitar cerrar si acabamos de abrir
      if (justOpenedRef.current) return;

      if (
        submenuRef.current &&
        !submenuRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  /**
   * Efecto: cierre al presionar Escape (accesibilidad WCAG).
   */
  useEffect(() => {
    if (!isOpen) return;

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  return { isOpen, toggle, close, submenuRef };
}
