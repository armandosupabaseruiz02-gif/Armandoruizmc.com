"use client";

import { motion } from "framer-motion";
import FadeIn, { StaggerContainer, StaggerItem } from "@/components/ui/FadeIn";
import { ArrowRight, ClipboardCheck, FileText, Megaphone, Users } from "lucide-react";

const pasos = [
  {
    num: "01",
    icon: Users,
    titulo: "Nos cuentas tu caso",
    descripcion:
      "Tú nos dices qué necesitas: salud, un apoyo, empleo, un trámite o seguimiento.",
  },
  {
    num: "02",
    icon: FileText,
    titulo: "Te decimos por dónde",
    descripcion:
      "Te marcamos la ruta correcta: qué te toca a ti y qué a la dependencia.",
  },
  {
    num: "03",
    icon: ClipboardCheck,
    titulo: "Te ayudamos con los papeles",
    descripcion:
      "Te decimos qué documentos llevar y los errores que conviene evitar.",
  },
  {
    num: "04",
    icon: Megaphone,
    titulo: "No te soltamos",
    descripcion:
      "Le damos seguimiento y te decimos el siguiente paso, para que nada se pierda.",
  },
];

export default function ComoTeAyudamos() {
  return (
    <section
      id="como-funciona"
      className="landing-sheet bg-white"
      aria-labelledby="como-funciona-titulo"
    >
      <div className="absolute inset-0 bg-dot-pattern opacity-45 pointer-events-none" aria-hidden="true" />
      <div className="absolute left-[-12%] top-10 h-[380px] w-[380px] rounded-full bg-naranja-200/30 blur-3xl pointer-events-none" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.82fr_1.18fr]">
          {/* Columna izquierda: qué es, para qué sirve y la aclaración clave */}
          <FadeIn className="lg:sticky lg:top-28 lg:self-start">
            <span className="section-badge-light">Cómo te ayudamos</span>
            <h2
              id="como-funciona-titulo"
              className="mt-5 text-[40px] font-black leading-tight tracking-tight text-gray-900 sm:text-[52px]"
            >
              De la duda al{" "}
              <span className="text-highlight">siguiente paso.</span>
            </h2>
            <div className="mt-6 space-y-4 text-[17px] leading-relaxed text-gray-800">
              <p>
                <strong className="font-bold text-gray-900">¿Y esta página para qué sirve?</strong>{" "}
                Para echarte la mano cuando necesitas un trámite o un apoyo y no sabes ni por dónde
                empezar. Tú no tienes que saberle a todo: para eso estamos.
              </p>
              <p>Te ayudamos a buscar, a juntar tus papeles y a hacer tu trámite bien hecho.</p>
            </div>

            {/* Aclaración clave: orientamos y conectamos, NO otorgamos ni manejamos dinero */}
            <div className="mt-6 rounded-[28px] border-2 border-naranja-300 bg-naranja-50 p-5 shadow-card">
              <p className="text-[12px] font-black uppercase tracking-[0.16em] text-naranja-700">
                Importante
              </p>
              <p className="mt-2 text-[18px] font-black leading-snug text-gray-900">
                Aquí no damos becas ni regalamos nada.
              </p>
              <p className="mt-2 text-[15px] leading-relaxed text-gray-800">
                Los apoyos los dan las autoridades.{" "}
                <strong className="font-bold">
                  Nosotros te decimos cuáles hay, qué papeles necesitas y te llevamos a la ventanilla
                  correcta
                </strong>
                . Contigo, con calma y con confianza.
              </p>
            </div>
          </FadeIn>

          {/* Columna derecha: los 4 pasos del acompañamiento */}
          <StaggerContainer className="relative grid grid-cols-1 gap-4" stagger={0.1}>
            <div
              className="absolute bottom-8 left-7 top-8 hidden w-px bg-gradient-to-b from-naranja-300 via-naranja-200 to-transparent md:block"
              aria-hidden="true"
            />

            {pasos.map((paso) => {
              const Icon = paso.icon;

              return (
                <StaggerItem key={paso.num}>
                  <motion.div
                    className="group relative overflow-hidden rounded-[30px] border-2 border-gray-100 bg-white p-5 shadow-sm transition-all duration-300 hover:border-naranja-200 hover:shadow-card md:ml-14"
                    whileHover={{ y: -4 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                      <div className="flex items-center gap-4 sm:block">
                        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-naranja-50 text-[18px] font-black text-naranja-600 ring-8 ring-white transition-colors duration-300 group-hover:bg-naranja-500 group-hover:text-white">
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
                      <ArrowRight
                        className="hidden h-5 w-5 flex-shrink-0 text-naranja-500 transition-transform duration-200 group-hover:translate-x-1 sm:block"
                        aria-hidden="true"
                      />
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
