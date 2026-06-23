"use client";

import type { MouseEvent } from "react";
import FadeIn from "@/components/ui/FadeIn";
import FlowingMenu, { type FlowingMenuItem } from "@/components/effects/FlowingMenu";
import { lenisScrollTo } from "@/providers/SmoothScrollProvider";

/* Lanzador de tareas estilo React Bits FlowingMenu:
   filas grandes que llevan DIRECTO a las acciones principales del portal.
   Es un atajo prioritario; el scroll informativo de la home se conserva debajo. */

const tareas: FlowingMenuItem[] = [
  {
    text: "Asesoría de salud",
    description: "Agenda una cita presencial o en línea",
    eyebrow: "Cita prioritaria",
    link: "/salud/agendar",
    image: "/images/quick-access/salud.svg",
  },
  {
    text: "Tarjeta Accesible",
    description: "Revisa requisitos, beneficios y pasos",
    eyebrow: "Trámite",
    link: "/tarjeta-accesible",
    image: "/images/quick-access/tarjeta.svg",
  },
  {
    text: "Programas sociales",
    description: "Encuentra apoyos públicos disponibles",
    eyebrow: "Orientación",
    link: "/programas-sociales",
    image: "/images/quick-access/programas.svg",
  },
  {
    text: "Bolsa de trabajo",
    description: "Consulta vacantes accesibles",
    eyebrow: "Empleo",
    link: "/bolsa-trabajo",
    image: "/images/quick-access/trabajo.svg",
  },
  {
    text: "Quiero ayudar",
    description: "Conecta con una causa directa",
    eyebrow: "Donación",
    link: "#donar",
    image: "/images/quick-access/donar.svg",
  },
  {
    text: "Mi cuenta",
    description: "Da seguimiento a tus citas y datos",
    eyebrow: "Seguimiento",
    link: "/mi-cuenta",
    image: "/images/quick-access/cuenta.svg",
  },
];

export default function AyudaHoy() {
  const handleItemClick = (
    tarea: FlowingMenuItem,
    event: MouseEvent<HTMLAnchorElement>,
  ) => {
    if (!tarea.link.startsWith("#")) return;

    event.preventDefault();
    lenisScrollTo(tarea.link);
  };

  return (
    <section
      id="ayuda-hoy"
      className="landing-sheet bg-warm-100"
      aria-labelledby="ayuda-hoy-titulo"
    >
      <div className="relative max-w-7xl mx-auto px-5 sm:px-8">
        <FadeIn className="text-center mb-7 sm:mb-8">
          <span className="section-badge-light">Accesos directos</span>
          <h2
            id="ayuda-hoy-titulo"
            className="text-[34px] sm:text-[44px] font-black text-gray-900
                       leading-tight tracking-tight mt-5 mb-4"
          >
            ¿En qué te ayudamos <span className="text-highlight">hoy</span>?
          </h2>
          <p className="text-[18px] text-gray-800 max-w-2xl mx-auto leading-relaxed">
            Ve directo al trámite o apoyo que necesitas.
          </p>
        </FadeIn>

        <FadeIn className="mx-auto max-w-5xl">
          <div style={{ height: "clamp(500px, 58svh, 620px)" }}>
            <FlowingMenu
              items={tareas}
              speed={13}
              textColor="#7c2d12"
              bgColor="#fff7ed"
              marqueeBgColor="#f97316"
              marqueeTextColor="#ffffff"
              borderColor="#fed7aa"
              onItemClick={handleItemClick}
            />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
