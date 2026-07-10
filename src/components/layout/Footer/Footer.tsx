import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Facebook, Instagram } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  isSvgAsset,
  normalizeSocialNetworks,
  resolveCmsAsset,
  type CmsSocialNetwork,
} from "@/lib/cms-social";
import { assetPath } from "@/lib/base-path";

// ─── Datos ────────────────────────────────────────────────────────────────────

const FOOTER_NAV_COL_1 = [
  { label: "¿Quiénes somos?", href: "/about" },
  { label: "Productos", href: "/products" },
  { label: "Cómo funciona", href: "/success-plan" },
];

const FOOTER_NAV_COL_2 = [
  { label: "Ciencia y Calidad", href: "/science-and-quality" },
  { label: "Ayuda y Contacto", href: "/faq" },
];

const SOCIAL_LINKS = [
  {
    label: "Facebook",
    href: "https://facebook.com",
    icon: <Facebook size={20} />,
  },
  {
    label: "Instagram",
    href: "https://instagram.com",
    icon: <Instagram size={20} />,
  },
  {
    label: "Tiktok",
    href: "https://tiktok.com",
    // TikTok no está en lucide-react, usamos SVG inline
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={20}
        height={20}
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.75a8.2 8.2 0 0 0 4.78 1.52V6.8a4.85 4.85 0 0 1-1.01-.11z" />
      </svg>
    ),
  },
];

// ─── Componente ───────────────────────────────────────────────────────────────

interface FooterProps {
  socialNetworks?: CmsSocialNetwork[];
}

export function Footer({ socialNetworks }: FooterProps) {
  const cmsSocialLinks = normalizeSocialNetworks(socialNetworks);

  return (
    <footer className="w-full mt-20">
      {/* Contenido Principal */}
      <div className="container max-w-[1512px] mx-auto px-6 md:px-16 py-12 md:py-16 bg-primary-soft-gray-balance rounded-t-lg flex flex-col gap-6">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-x-16 md:gap-y-12 xl:grid-cols-[2fr_1fr_1fr] xl:gap-16">
          {/* ─── Columna 1: Logo + Descripción + Redes ─── */}
          <div className="flex max-w-[400px] flex-col gap-6 md:col-span-2 xl:col-span-1">
            <div className="flex flex-col gap-3">
              <Link href="/" className="inline-block">
                <Image
                  src={assetPath("/logo-terbol.svg")}
                  alt="Térbol Inspira"
                  width={230}
                  height={30}
                  priority
                  style={{ width: "auto", height: "auto" }}
                />
              </Link>

              <p className="text-body-medium text-gray-900 font-semibold">
                Una iniciativa de Térbol
              </p>
            </div>

            <p className="text-body-small text-gray-500">
              Los productos mencionados son suplementos dietarios. Antes de
              consumir cualquier suplemento, consulte a su médico o profesional
              de la salud.
            </p>

            <div className="w-full h-px bg-gray-200" />

            {/* Redes Sociales */}
            <div className="flex items-center gap-5">
              {cmsSocialLinks.length > 0
                ? cmsSocialLinks.map((social) => {
                    const iconUrl = resolveCmsAsset(social.icon);

                    return (
                      <Link
                        key={social.id ?? social.name}
                        href={social.url ?? "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-bodyd-sm text-gray-500 hover:text-primary transition-colors duration-200 group"
                        aria-label={social.name}
                      >
                        {iconUrl && (
                          <Image
                            src={iconUrl}
                            alt=""
                            width={20}
                            height={20}
                            unoptimized={isSvgAsset(iconUrl)}
                            className="h-5 w-5 object-contain"
                          />
                        )}
                        <span>{social.name}</span>
                      </Link>
                    );
                  })
                : SOCIAL_LINKS.map((social) => (
                    <Link
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-bodyd-sm text-gray-500 hover:text-primary transition-colors duration-200 group"
                      aria-label={social.label}
                    >
                      <span className="text-gray-500 group-hover:text-primary transition-colors duration-200">
                        {social.icon}
                      </span>
                      <span>{social.label}</span>
                    </Link>
                  ))}
            </div>
          </div>

          {/* ─── Columna 2: Nav Col 1 ─── */}
          <nav
            className="flex flex-col gap-6"
            aria-label="Links de navegación – columna 1"
          >
            {FOOTER_NAV_COL_1.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-body text-gray-600 hover:text-primary transition-colors duration-200 whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* ─── Columna 3: Nav Col 2 ─── */}
          <nav
            className="flex flex-col gap-6"
            aria-label="Links de navegación – columna 2"
          >
            {FOOTER_NAV_COL_2.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-body text-gray-600 hover:text-primary transition-colors duration-200 whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}
            <div className="flex items-start">
              <Button
                href="/promoter"
                variant="default"
                size="default"
                icon={<ArrowRight />}
                iconPosition="right"
                className="w-full sm:w-auto justify-between"
                aria-label="Soy asesor de ventas"
              >
                SOY ASESOR DE VENTAS
              </Button>
            </div>
          </nav>
        </div>
        <div className="w-full h-px bg-gray-200"></div>
        <p className="text-body-small text-gray-500">
          © 2026 Térbol Inspira. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
