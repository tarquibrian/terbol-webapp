"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import { Menu, ArrowRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { SearchInput } from "@/components/ui/SearchInput";
import { Drawer } from "@/components/ui/Drawer";
import { getFlatNavLinks } from "../Navbar.constants";

export function MobileMenu({ className }: { className?: string }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const isPromoterPage = pathname === "/promoter";
  const ctaHref = isPromoterPage
    ? "https://www.terbolinspira.com/VentaPorCatalogo/PRD"
    : "/promoter";
  const ctaIcon = isPromoterPage ? <ArrowUpRight /> : <ArrowRight />;

  // Usa la función de aplanado extraída a la capa de constantes/data
  const flatItems = React.useMemo(() => getFlatNavLinks(), []);

  const handleNavigation = (href: string) => {
    setIsOpen(false);
    // Esperamos a que la animación de cierre (600ms en Drawer.tsx) termine o esté avanzada
    setTimeout(() => {
      router.push(href);
    }, 400); 
  };

  const handleSearch = (query: string) => {
    const normalizedQuery = query.trim();
    const params = new URLSearchParams();
    if (normalizedQuery) params.set("search", normalizedQuery);
    const search = params.toString();

    handleNavigation(`/products${search ? `?${search}` : ""}`);
  };

  return (
    <div className={className}>
      {/* Botón Trigger Hamburguesa */}
      <button
        type="button"
        onClick={() => {
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
        onClose={() => {
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
            onSearch={handleSearch}
          />
        </div>

        <nav className="mb-8 flex flex-col gap-2" role="menu">
          {flatItems.map((item) => (
            <button
              key={item.href}
              onClick={() => handleNavigation(item.href!)}
              role="menuitem"
              className={cn(
                "flex flex-col gap-1 px-3 py-3 rounded-xl transition-colors duration-150 text-left w-full",
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
            </button>
          ))}
        </nav>

        {/* CTA Móvil: Solo se muestra aquí en pantallas < 768px */}
        <div className="mb-8 block md:hidden px-3">
          <Button
            variant="default"
            size="default"
            icon={ctaIcon}
            className="w-full justify-between"
            onClick={() => {
              if (isPromoterPage) {
                setIsOpen(false);
                window.open(ctaHref, "_blank", "noopener,noreferrer");
              } else {
                handleNavigation(ctaHref);
              }
            }}
          >
            Soy asesor de ventas
          </Button>
        </div>
      </Drawer>
    </div>
  );
}
