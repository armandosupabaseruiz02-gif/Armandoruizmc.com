import type { Metadata } from "next";
import { Atkinson_Hyperlegible } from "next/font/google";
import "./globals.css";
import SmoothScrollProvider from "@/providers/SmoothScrollProvider";
import Navbar from "@/components/layout/Navbar";
import FloatingAssistant from "@/components/assistant/FloatingAssistant";
import { cn } from "@/lib/utils";

const atkinson = Atkinson_Hyperlegible({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.armandoruizmc.com"),
  title: {
    default: "Armando Ruiz | Diputado Federal · Movimiento Ciudadano",
    template: "%s | Armando Ruiz Diputado",
  },
  description:
    "Página oficial del Diputado Armando Ruiz. Apoyos, programas y servicios para personas con discapacidad en la Ciudad de México.",
  keywords: ["Armando Ruiz", "Diputado Federal", "Movimiento Ciudadano", "discapacidad", "Tarjeta Accesible"],
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
    <html lang="es" className={cn("font-sans", atkinson.variable)}>
      <body>
        <a href="#contenido-principal" className="skip-link">
          Ir al contenido principal
        </a>
        <SmoothScrollProvider>
          <Navbar />
          {children}
        </SmoothScrollProvider>
        <FloatingAssistant />
      </body>
    </html>
  );
}
