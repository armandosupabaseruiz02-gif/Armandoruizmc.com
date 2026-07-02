"use client";

import type { MouseEvent } from "react";
import FadeIn from "@/components/ui/FadeIn";
import FlowingMenu, { type FlowingMenuItem } from "@/components/effects/FlowingMenu";
import InfoHint from "@/components/ui/InfoHint";
import { lenisScrollTo } from "@/providers/SmoothScrollProvider";

/* Lanzador de tareas estilo React Bits FlowingMenu:
   filas grandes que llevan DIRECTO a las acciones principales del portal.
   Es un atajo prioritario; el scroll informativo de la home se conserva debajo. */

const tareas: FlowingMenuItem[] = [
  {
    text: "Asesoría de salud",
    description: "Agenda tu cita y te acompañamos, en persona o por internet",
    eyebrow: "Cita prioritaria",
    link: "/salud/agendar",
    image: "/images/quick-access/salud.svg",
    info: "¿Te preocupa algo de tu salud o de una discapacidad? Aparta un día con nosotros. Te escuchamos y te decimos qué sigue, pasito a pasito. Vienes en persona o lo vemos por internet, como tú quieras.",
  },
  {
    text: "Tarjeta Accesible",
    description: "Te explicamos, pasito a pasito, cómo conseguirla",
    eyebrow: "Trámite",
    link: "/tarjeta-accesible",
    image: "/images/quick-access/tarjeta.svg",
    info: "Es una tarjeta que te abre puertas y te da facilidades. Te decimos qué papeles juntar y a dónde llevarlos. No andas solo: te llevamos de la mano.",
  },
  {
    text: "Programas sociales",
    description: "Te ayudamos a encontrar el apoyo que es para ti",
    eyebrow: "Orientación",
    link: "/programas-sociales",
    image: "/images/quick-access/programas.svg",
    info: "Hay apoyos del gobierno y a veces no sabes cuál te toca. Aquí te ayudamos a encontrar el tuyo y a pedirlo bien. Ojo: el apoyo lo da el gobierno; nosotros te orientamos.",
  },
  {
    text: "Bolsa de trabajo",
    description: "Te ayudamos a buscar un empleo accesible",
    eyebrow: "Empleo",
    link: "/bolsa-trabajo",
    image: "/images/quick-access/trabajo.svg",
    info: "¿Andas buscando chamba? Aquí buscamos contigo un trabajo pensado para personas con discapacidad y te echamos la mano para encontrarlo.",
  },
  {
    text: "Quiero ayudar",
    description: "Ayuda a alguien, o pide ayuda con confianza",
    eyebrow: "Donación",
    link: "#donar",
    image: "/images/quick-access/donar.svg",
    info: "¿Quieres ayudar a alguien? Te conectamos derechito con una persona o familia que lo necesita. El dinero no pasa por nosotros: tú ayudas directo.",
  },
  {
    text: "Mi perfil",
    description: "Sigue tus citas y tus datos en un solo lugar",
    eyebrow: "Seguimiento",
    link: "/mi-cuenta",
    image: "/images/quick-access/cuenta.svg",
    info: "Es tu rincón en la página. Aquí ves tus citas y tus trámites juntos, sin que se te pierda nada. Entras cuando tú quieras.",
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
            ¿En qué te echamos <span className="text-highlight">la mano hoy</span>?
          </h2>
          <p className="text-[18px] text-gray-800 max-w-2xl mx-auto leading-relaxed">
            Pícale a lo que necesitas y vamos directo, sin darle tantas vueltas.
          </p>
        </FadeIn>

        <FadeIn className="mx-auto max-w-5xl">
          {/* Altura: en movil las 6 filas necesitan mas espacio para que el
              texto no se recorte (titulo + descripcion en varias lineas). */}
          <div className="flex h-[840px] items-stretch gap-2 min-[480px]:h-[760px] sm:gap-3 sm:h-[clamp(500px,58svh,620px)]">
            <div className="min-w-0 flex-1">
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

            {/* Columna de "?" al lado del cuadro: una por acceso, alineada a su fila */}
            <div className="flex w-10 flex-shrink-0 flex-col sm:w-11">
              {tareas.map((tarea) =>
                tarea.info ? (
                  <div key={tarea.link} className="flex flex-1 items-center justify-center">
                    <InfoHint title={tarea.text} text={tarea.info} />
                  </div>
                ) : (
                  <div key={tarea.link} className="flex-1" />
                ),
              )}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
