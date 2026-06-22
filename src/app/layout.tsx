import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import SmoothScrollProvider from "@/providers/SmoothScrollProvider";
import Navbar from "@/components/layout/Navbar";
import { cn } from "@/lib/utils";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.armandoruizmc.com"),
  title: {
    default: "Armando Ruiz | Diputado Federal · Movimiento Naranja",
    template: "%s | Armando Ruiz Diputado",
  },
  description:
    "Página oficial del Diputado Armando Ruiz. Apoyos, programas y servicios para personas con discapacidad en la Ciudad de México.",
  keywords: ["Armando Ruiz", "Diputado Federal", "Movimiento Naranja", "discapacidad", "Tarjeta Incluyente"],
  alternates: { canonical: "/" },
  openGraph: {
    title: "Armando Ruiz | Diputado Federal",
    description: "Apoyos y servicios para personas con discapacidad en la Ciudad de México",
    url: "https://www.armandoruizmc.com",
    siteName: "Armando Ruiz · Diputado Federal",
    locale: "es_MX",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={cn("font-sans", geist.variable)}>
      <body>
        <a href="#contenido-principal" className="skip-link">
          Ir al contenido principal
        </a>
        <SmoothScrollProvider>
          <Navbar />
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
