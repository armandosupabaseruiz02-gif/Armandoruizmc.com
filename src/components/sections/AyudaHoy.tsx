"use client";

import Link from "next/link";
import FadeIn, { StaggerContainer, StaggerItem } from "@/components/ui/FadeIn";
import { lenisScrollTo } from "@/providers/SmoothScrollProvider";
import {
  CalendarHeart, CreditCard, ScrollText,
  Briefcase, HandHeart, User, ArrowRight,
} from "lucide-react";

/* Lanzador de tareas estilo "navegación Metro CDMX":
   tarjetas grandes con chip de color + icono + texto claro que llevan
   DIRECTO a las acciones principales del portal. Es un atajo prioritario;
   el scroll informativo de la home se conserva debajo. */

const tareas = [
  {
    id: "agendar-salud",
    icon: CalendarHeart,
    titulo: "Agendar asesoría de salud",
    descripcion: "Cita con un asesor, presencial o en línea",
    href: "/salud/agendar",
    chip: "bg-naranja-600",
  },
  {
    id: "tarjeta",
    icon: CreditCard,
    titulo: "Tarjeta Accesible",
    descripcion: "Tramítala paso a paso, con sus beneficios",
    href: "/tarjeta-accesible",
    chip: "bg-amber-700",
  },
  {
    id: "programas",
    icon: ScrollText,
    titulo: "Programas sociales",
    descripcion: "Apoyos de gobierno para ti y tu familia",
    href: "/programas-sociales",
    chip: "bg-emerald-600",
  },
  {
    id: "trabajo",
    icon: Briefcase,
    titulo: "Bolsa de trabajo",
    descripcion: "Empleos dignos e incluyentes",
    href: "/bolsa-trabajo",
    chip: "bg-amber-900",
  },
  {
    id: "ayudar",
    icon: HandHeart,
    titulo: "Quiero ayudar",
    descripcion: "Conecta directo con quien lo necesita",
    href: "#donar",
    chip: "bg-rose-600",
  },
  {
    id: "cuenta",
    icon: User,
    titulo: "Mi cuenta",
    descripcion: "Tus citas y tus datos, en un lugar",
    href: "/mi-cuenta",
    chip: "bg-gray-800",
  },
];

const cardClass = `group flex items-center gap-4 p-5 sm:p-6 min-h-[96px]
  rounded-card border-2 border-gray-100 bg-white
  hover:border-naranja-300 hover:shadow-card-hover hover:-translate-y-1
  transition-all duration-300
  focus-visible:outline-4 focus-visible:outline-naranja-500 focus-visible:outline-offset-2`;

function TareaContenido({ tarea }: { tarea: (typeof tareas)[number] }) {
  const Icon = tarea.icon;
  return (
    <>
      <span
        className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${tarea.chip}`}
        aria-hidden="true"
      >
        <Icon className="w-7 h-7 text-white" strokeWidth={2} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[18px] font-bold text-gray-900 leading-snug">
          {tarea.titulo}
        </span>
        <span className="block text-[14px] text-gray-700 leading-snug mt-0.5">
          {tarea.descripcion}
        </span>
      </span>
      <ArrowRight
        className="w-5 h-5 text-naranja-500 flex-shrink-0 transition-transform duration-200 group-hover:translate-x-1"
        aria-hidden="true"
      />
    </>
  );
}

export default function AyudaHoy() {
  return (
    <section
      id="ayuda-hoy"
      className="relative py-16 sm:py-20 bg-warm-100"
      aria-labelledby="ayuda-hoy-titulo"
    >
      <div className="relative max-w-7xl mx-auto px-5 sm:px-8">
        <FadeIn className="text-center mb-10 sm:mb-12">
          <span className="section-badge-light">Accesos directos</span>
          <h2
            id="ayuda-hoy-titulo"
            className="text-[34px] sm:text-[44px] font-black text-gray-900
                       leading-tight tracking-tight mt-5 mb-4"
          >
            ¿En qué te ayudamos <span className="text-highlight">hoy</span>?
          </h2>
          <p className="text-[18px] text-gray-800 max-w-2xl mx-auto leading-relaxed">
            Ve directo al trámite o apoyo que necesitas, sin vueltas.
          </p>
        </FadeIn>

        <StaggerContainer
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5"
          stagger={0.07}
        >
          {tareas.map((tarea) => (
            <StaggerItem key={tarea.id}>
              {tarea.href.startsWith("#") ? (
                <a
                  href={tarea.href}
                  onClick={(e) => {
                    e.preventDefault();
                    lenisScrollTo(tarea.href);
                  }}
                  className={cardClass}
                  aria-label={`${tarea.titulo}: ${tarea.descripcion}`}
                >
                  <TareaContenido tarea={tarea} />
                </a>
              ) : (
                <Link
                  href={tarea.href}
                  className={cardClass}
                  aria-label={`${tarea.titulo}: ${tarea.descripcion}`}
                >
                  <TareaContenido tarea={tarea} />
                </Link>
              )}
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
