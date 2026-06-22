"use client";

import { motion } from "framer-motion";
import FadeIn, { StaggerContainer, StaggerItem } from "@/components/ui/FadeIn";
import { ArrowRight, ClipboardCheck, FileText, Megaphone, Users } from "lucide-react";

const pasos = [
  {
    num: "01",
    icon: Users,
    titulo: "Escuchamos el caso",
    descripcion:
      "Identificamos si busca salud, apoyo, empleo, trámite o seguimiento.",
  },
  {
    num: "02",
    icon: FileText,
    titulo: "Ubicamos la ruta correcta",
    descripcion:
      "Separamos lo que resuelve el portal de lo que requiere una dependencia.",
  },
  {
    num: "03",
    icon: ClipboardCheck,
    titulo: "Preparamos requisitos",
    descripcion:
      "Aclaramos documentos, datos y errores comunes antes de avanzar.",
  },
  {
    num: "04",
    icon: Megaphone,
    titulo: "Damos seguimiento",
    descripcion:
      "Mostramos estado y siguiente acción para que nada se pierda.",
  },
];

export default function QueHacemos() {
  return (
    <section
      id="que-hacemos"
      className="landing-sheet bg-white"
      aria-labelledby="que-hacemos-titulo"
    >
      <div className="absolute inset-0 bg-dot-pattern opacity-45 pointer-events-none" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.72fr_1.28fr]">
          <FadeIn className="lg:sticky lg:top-28 lg:self-start">
            <span className="section-badge-light">Cómo te ayudamos</span>
            <h2
              id="que-hacemos-titulo"
              className="mt-5 text-[40px] font-black leading-tight tracking-tight text-gray-900 sm:text-[52px]"
            >
              De la duda al{" "}
              <span className="text-highlight">siguiente paso.</span>
            </h2>
            <p className="mt-5 text-[18px] leading-relaxed text-gray-800">
              Explicamos cómo se mueve una persona dentro del portal y qué puede esperar.
            </p>
          </FadeIn>

          <StaggerContainer className="relative grid grid-cols-1 gap-4" stagger={0.1}>
            <div className="absolute bottom-8 left-7 top-8 hidden w-px bg-gradient-to-b from-naranja-300 via-naranja-200 to-transparent md:block" aria-hidden="true" />

            {pasos.map((paso) => {
              const Icon = paso.icon;

              return (
                <StaggerItem key={paso.num}>
                  <motion.div
                    className="group relative overflow-hidden rounded-[30px] border-2 border-gray-100 bg-white p-5 shadow-sm transition-all duration-300 hover:border-naranja-200 hover:shadow-card md:ml-14"
                    whileHover={{ y: -4 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <div className="absolute left-0 top-0 h-full w-1 bg-naranja-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" aria-hidden="true" />
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                      <div className="flex items-center gap-4 sm:block">
                        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-naranja-50 text-[18px] font-black text-naranja-600 ring-8 ring-white">
                          {paso.num}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="mb-3 flex items-center gap-3">
                          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-950 text-white">
                            <Icon className="h-5 w-5" aria-hidden="true" />
                          </span>
                          <h3 className="text-[22px] font-black leading-tight text-gray-900">
                            {paso.titulo}
                          </h3>
                        </div>
                        <p className="text-[16px] leading-relaxed text-gray-700">
                          {paso.descripcion}
                        </p>
                      </div>
                      <ArrowRight className="hidden h-5 w-5 flex-shrink-0 text-naranja-500 transition-transform duration-200 group-hover:translate-x-1 sm:block" aria-hidden="true" />
                    </div>
                  </motion.div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </div>
    </section>
  );
}
