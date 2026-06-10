"use client";

import { motion } from "framer-motion";
import FadeIn, { StaggerContainer, StaggerItem } from "@/components/ui/FadeIn";
import { FileText, Users, Megaphone, ClipboardCheck } from "lucide-react";

const acciones = [
  {
    num: "01",
    icon: FileText,
    titulo: "Legislamos por la inclusión",
    descripcion:
      "Presentamos iniciativas de ley y reformas para mejorar los derechos, el acceso y los servicios de las personas con discapacidad en la Ciudad de México.",
  },
  {
    num: "02",
    icon: ClipboardCheck,
    titulo: "Facilitamos trámites",
    descripcion:
      "Orientamos y acompañamos a ciudadanos para acceder a la Tarjeta Accesible, programas sociales, apoyos de salud y más, sin complicaciones.",
  },
  {
    num: "03",
    icon: Users,
    titulo: "Conectamos con oportunidades",
    descripcion:
      "Vinculamos a personas con discapacidad con empleos dignos, aliados estratégicos y redes de apoyo que mejoran su calidad de vida.",
  },
  {
    num: "04",
    icon: Megaphone,
    titulo: "Damos voz a la comunidad",
    descripcion:
      "Llevamos las necesidades reales de las personas con discapacidad y sus familias a la Cámara de Diputados para que sean atendidas.",
  },
];

export default function QueHacemos() {
  return (
    <section
      id="que-hacemos"
      className="py-28 bg-white relative overflow-hidden"
      aria-labelledby="que-hacemos-titulo"
    >
      <div className="absolute inset-0 bg-dot-pattern opacity-50 pointer-events-none" aria-hidden="true" />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8">
        <FadeIn className="text-center mb-20">
          <span className="section-badge-light">Qué Hacemos</span>
          <h2
            id="que-hacemos-titulo"
            className="text-[40px] sm:text-[52px] font-black text-gray-900
                       leading-tight tracking-tight mt-5 mb-5"
          >
            Acciones concretas,{" "}
            <span className="text-highlight">resultados reales</span>
          </h2>
          <p className="text-[18px] text-gray-800 max-w-2xl mx-auto leading-relaxed">
            Nuestro trabajo va más allá del discurso. Lo que hacemos todos los días por la comunidad.
          </p>
        </FadeIn>

        <StaggerContainer
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          stagger={0.1}
        >
          {acciones.map((a) => {
            const Icon = a.icon;
            return (
              <StaggerItem key={a.num}>
                <motion.div
                  className="relative flex gap-6 p-8 rounded-card border-2 border-gray-100
                               bg-white overflow-hidden cursor-default
                               hover:border-naranja-200 hover:shadow-card
                               transition-all duration-300 group"
                  whileHover={{ y: -4 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  {/* Número decorativo */}
                  <div className="flex-shrink-0 select-none">
                    <span
                      className="text-[64px] font-black text-gray-50 leading-none
                                   group-hover:text-naranja-500/10 transition-colors duration-500"
                      aria-hidden="true"
                    >
                      {a.num}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    {/* Ícono inline con heading */}
                    <div className="flex items-center gap-2.5 mb-3">
                      <Icon
                        className="w-5 h-5 text-naranja-500 flex-shrink-0"
                        strokeWidth={1.75}
                        aria-hidden="true"
                      />
                      <h3 className="text-[20px] font-bold text-gray-900 leading-tight">
                        {a.titulo}
                      </h3>
                    </div>
                    <p className="text-[16px] text-gray-800 leading-relaxed">
                      {a.descripcion}
                    </p>
                  </div>

                  {/* Línea naranja en hover */}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-[2px]
                                bg-naranja-500 opacity-0 group-hover:opacity-60
                                transition-opacity duration-500"
                    aria-hidden="true"
                  />
                </motion.div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
