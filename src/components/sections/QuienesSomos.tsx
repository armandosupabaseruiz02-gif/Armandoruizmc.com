"use client";

import { motion } from "framer-motion";
import FadeIn, { StaggerContainer, StaggerItem } from "@/components/ui/FadeIn";
import { Target, Eye, Shield } from "lucide-react";

const valores = [
  {
    icon: Target,
    titulo: "Nuestra Misión",
    descripcion: "Garantizar que cada persona con discapacidad en la Ciudad de México tenga acceso efectivo a sus derechos, programas y servicios gubernamentales.",
    color: "text-naranja-600",
    bg: "bg-naranja-100",
    border: "border-naranja-200",
  },
  {
    icon: Eye,
    titulo: "Nuestra Visión",
    descripcion: "Una Ciudad de México plenamente accesible, donde la discapacidad no sea un obstáculo para el desarrollo personal, laboral y social de nadie.",
    color: "text-blue-600",
    bg: "bg-blue-100",
    border: "border-blue-200",
  },
  {
    icon: Shield,
    titulo: "Nuestro Compromiso",
    descripcion: "Transparencia, honestidad y dedicación. Cada gestión y cada trámite que facilitamos es un paso hacia una ciudad más justa para todos.",
    color: "text-emerald-600",
    bg: "bg-emerald-100",
    border: "border-emerald-200",
  },
];

export default function QuienesSomos() {
  return (
    <section
      id="quienes-somos"
      className="py-28 bg-warm-50 relative overflow-hidden"
      aria-labelledby="quienes-somos-titulo"
    >
      <div className="absolute inset-0 bg-dot-pattern opacity-50 pointer-events-none" aria-hidden="true" />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

          {/* Texto */}
          <FadeIn>
            <span className="section-badge-light">Quiénes Somos</span>
            <h2
              id="quienes-somos-titulo"
              className="text-[40px] sm:text-[52px] font-black text-gray-900
                         leading-tight tracking-tight mt-5 mb-7"
            >
              Un equipo comprometido con la{" "}
              <span className="text-highlight">inclusión</span>
            </h2>
            <div className="space-y-5 text-[17px] text-gray-800 leading-relaxed">
              <p>
                Somos el equipo del{" "}
                <strong className="text-gray-900 font-bold">Diputado Federal Armando Ruiz</strong>,
                representante de la Ciudad de México ante la Cámara de Diputados Federal
                por el Movimiento Naranja.
              </p>
              <p>
                Nuestro trabajo se centra en legislar, gestionar y facilitar el acceso
                a todos los programas y servicios para{" "}
                <strong className="text-naranja-700 font-bold">
                  personas con discapacidad y sus familias
                </strong>.
              </p>
              <p>
                Entendemos de primera mano los retos de la comunidad porque nuestro
                diputado vive con discapacidad y conoce la realidad de quienes representa.
              </p>
            </div>
          </FadeIn>

          {/* Cards */}
          <StaggerContainer className="flex flex-col gap-4" stagger={0.12}>
            {valores.map((v) => {
              const Icon = v.icon;
              return (
                <StaggerItem key={v.titulo} direction="left">
                  <motion.div
                    className={`flex items-start gap-5 p-6 rounded-card
                               border-2 ${v.border} bg-white
                               hover:shadow-card transition-all duration-300 group`}
                    whileHover={{ x: 6 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <div className={`w-12 h-12 rounded-xl ${v.bg} flex items-center
                                    justify-center flex-shrink-0 group-hover:scale-110
                                    transition-transform duration-200`}>
                      <Icon className={`w-6 h-6 ${v.color}`} strokeWidth={2} />
                    </div>
                    <div>
                      <h3 className="text-[18px] font-bold text-gray-900 mb-1.5">{v.titulo}</h3>
                      <p className="text-[15px] text-gray-700 leading-relaxed">{v.descripcion}</p>
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
