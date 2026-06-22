"use client";

import { motion } from "framer-motion";
import FadeIn, { StaggerContainer, StaggerItem } from "@/components/ui/FadeIn";
import { ClipboardCheck, MessageSquareText, ShieldCheck } from "lucide-react";

const principios = [
  {
    icon: MessageSquareText,
    titulo: "Escuchar antes de mandar a ventanilla",
    descripcion:
      "Entendemos qué necesita la persona y qué parte del trámite está atorada.",
    color: "text-naranja-600",
    bg: "bg-naranja-100",
    border: "border-naranja-200",
  },
  {
    icon: ClipboardCheck,
    titulo: "Convertir el trámite en pasos claros",
    descripcion:
      "Requisitos, ruta correcta y siguiente acción en lenguaje claro.",
    color: "text-amber-700",
    bg: "bg-amber-100",
    border: "border-amber-200",
  },
  {
    icon: ShieldCheck,
    titulo: "Cuidar el seguimiento",
    descripcion:
      "Cada cita o solicitud debe tener estado y siguiente paso.",
    color: "text-emerald-700",
    bg: "bg-emerald-100",
    border: "border-emerald-200",
  },
];

export default function QuienesSomos() {
  return (
    <section
      id="quienes-somos"
      className="landing-sheet bg-warm-50"
      aria-labelledby="quienes-somos-titulo"
    >
      <div className="absolute inset-0 bg-dot-pattern opacity-45 pointer-events-none" aria-hidden="true" />
      <div className="absolute left-[-12%] top-10 h-[380px] w-[380px] rounded-full bg-naranja-200/35 blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <FadeIn>
            <span className="section-badge-light">Atención ciudadana</span>
            <h2
              id="quienes-somos-titulo"
              className="mt-5 text-[40px] font-black leading-tight tracking-tight text-gray-900 sm:text-[52px]"
            >
              Menos vueltas.{" "}
              <span className="text-highlight">Más claridad para resolver.</span>
            </h2>
            <div className="mt-6 space-y-4 text-[17px] leading-relaxed text-gray-800">
              <p>
                Esta página ordena la atención ciudadana del equipo del{" "}
                <strong className="font-bold text-gray-900">Diputado Armando Ruiz</strong>.
              </p>
              <p>
                La meta es que cada persona sepa qué preparar, a dónde ir y cómo dar seguimiento.
              </p>
            </div>

            <div className="mt-6 rounded-[28px] border-2 border-naranja-200 bg-white p-5 shadow-card">
              <p className="text-[12px] font-black uppercase tracking-[0.16em] text-naranja-600">
                Idea central
              </p>
              <p className="mt-2 text-[20px] font-black leading-snug text-gray-900">
                Llegar con duda. Salir con un paso concreto.
              </p>
            </div>
          </FadeIn>

          <StaggerContainer className="grid grid-cols-1 gap-3" stagger={0.12}>
            {principios.map((principio) => {
              const Icon = principio.icon;

              return (
                <StaggerItem key={principio.titulo} direction="left">
                  <motion.div
                    className={`group flex items-start gap-5 rounded-card border-2 ${principio.border} bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-card`}
                    whileHover={{ x: 6 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <div
                      className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl ${principio.bg} transition-transform duration-200 group-hover:scale-105`}
                    >
                      <Icon className={`h-6 w-6 ${principio.color}`} strokeWidth={2} aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="text-[19px] font-black leading-tight text-gray-900">
                        {principio.titulo}
                      </h3>
                      <p className="mt-2 text-[15px] leading-relaxed text-gray-700">
                        {principio.descripcion}
                      </p>
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
