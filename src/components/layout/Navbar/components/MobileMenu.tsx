"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { SearchInput } from "@/components/ui/SearchInput";
import { Drawer } from "@/components/ui/Drawer";
import { getFlatNavLinks } from "../Navbar.constants";

export function MobileMenu({ className }: { className?: string }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isInstant, setIsInstant] = React.useState(false);

  // Usa la función de aplanado extraída a la capa de constantes/data
  const flatItems = React.useMemo(() => getFlatNavLinks(), []);

  return (
    <div className={className}>
      {/* Botón Trigger Hamburguesa */}
      <button
        type="button"
        onClick={() => {
          setIsInstant(false);
          setIsOpen(true);
        }}
        aria-expanded={isOpen}
        aria-label="Abrir menú de navegación"
        className={cn(
          "flex items-center justify-center p-2 rounded-md",
          "text-foreground hover:bg-gray-100 transition-colors duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        )}
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Drawer centralizado en `ui/Drawer` */}
      <Drawer
        isOpen={isOpen}
        instantClose={isInstant}
        onClose={() => {
          setIsInstant(false);
          setIsOpen(false);
        }}
        title="Menú"
        className="w-full md:max-w-[500px]" // Pantalla completa en móvil, limitado en tablet/desktop
      >
        {/* Buscador: Solo se muestra aquí en pantallas < 1024px */}
        <div className="mb-8 block lg:hidden px-3">
          <SearchInput
            placeholder="Buscar productos..."
            className="w-full"
            onSearch={(query) => {
              console.log("Buscando en móvil:", query);
              setIsOpen(false);
            }}
          />
        </div>

        <nav className="mb-8 flex flex-col gap-2" role="menu">
          {flatItems.map((item) => (
            <Link
              key={item.href}
              href={item.href!} // el flat garantiza href
              prefetch={true}
              scroll={false}
              onClick={() => {
                setIsInstant(true);
                setIsOpen(false);
              }}
              role="menuitem"
              className={cn(
                "flex flex-col gap-1 px-3 py-3 rounded-xl transition-colors duration-150",
                "hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring group"
              )}
            >
              <span className="text-body-md font-medium text-foreground group-hover:text-button-orange transition-colors">
                {item.label}
              </span>
              {item.description && (
                <span className="text-[13px] leading-snug text-gray-400">
                  {item.description}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* CTA Móvil: Solo se muestra aquí en pantallas < 768px */}
        <div className="mb-8 block md:hidden px-3">
          <Button
            variant="default"
            size="default"
            icon={<ArrowRight />}
            className="w-full justify-center"
          >
            Soy asesor de ventas
          </Button>
        </div>
      </Drawer>
    </div>
  );
}
