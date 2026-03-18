import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

// Configuración de Roboto con las variantes solicitadas: regular(400), medium(500), semibold(600), bold(700)
const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "Terbol Ecommerce",
  description: "Terbol Ecommerce Base Architecture",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${roboto.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
