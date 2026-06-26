"use client";

import { motion } from "framer-motion";
import FadeIn, { StaggerContainer, StaggerItem } from "@/components/ui/FadeIn";
import { ClipboardCheck, MessageSquareText, ShieldCheck } from "lucide-react";

const principios = [
  {
    icon: MessageSquareText,
    titulo: "Primero te escuchamos",
    descripcion:
      "Entendemos tu caso y dónde se atoró. Sin prisas y sin mandarte de un lado a otro.",
    color: "text-naranja-600",
    bg: "bg-naranja-100",
    border: "border-naranja-200",
  },
  {
    icon: ClipboardCheck,
    titulo: "Te lo explicamos fácil",
    descripcion:
      "Qué papeles llevar, a dónde ir y qué sigue, en palabras simples.",
    color: "text-amber-700",
    bg: "bg-amber-100",
    border: "border-amber-200",
  },
  {
    icon: ShieldCheck,
    titulo: "No te dejamos solo",
    descripcion:
      "Le damos seguimiento: cada cita o solicitud tiene su estado y su siguiente paso.",
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
                <strong className="font-bold text-gray-900">¿Y esta página para qué sirve?</strong>{" "}
                Para echarte la mano cuando necesitas un trámite o un apoyo y no sabes ni por dónde
                empezar. Tú no tienes que saberle a todo: para eso estamos.
              </p>
              <p>
                Te ayudamos a buscar, a juntar tus papeles y a hacer tu trámite bien hecho.
              </p>
            </div>

            {/* Aclaración clave: orientamos, NO otorgamos */}
            <div className="mt-6 rounded-[28px] border-2 border-naranja-300 bg-naranja-50 p-5 shadow-card">
              <p className="text-[12px] font-black uppercase tracking-[0.16em] text-naranja-700">
                Importante
              </p>
              <p className="mt-2 text-[18px] font-black leading-snug text-gray-900">
                Aquí no damos becas ni regalamos nada.
              </p>
              <p className="mt-2 text-[15px] leading-relaxed text-gray-800">
                Los apoyos los dan las autoridades. <strong className="font-bold">Nosotros te
                decimos cuáles hay, qué papeles necesitas y te llevamos a la ventanilla correcta</strong>
                {" "}&mdash; contigo, con calma y con confianza.
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
