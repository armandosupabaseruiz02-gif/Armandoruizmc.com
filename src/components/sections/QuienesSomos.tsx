"use client";

import { motion } from "framer-motion";
import FadeIn, { StaggerContainer, StaggerItem } from "@/components/ui/FadeIn";
import { Target, Eye, Shield } from "lucide-react";

const valores = [
  {
    icon: Target,
    titulo: "Nuestra Misión",
    descripcion: "Garantizar que cada persona con discapacidad en la Ciudad de México tenga acceso efectivo a sus derechos, programas y servicios gubernamentales.",
  },
  {
    icon: Eye,
    titulo: "Nuestra Visión",
    descripcion: "Una Ciudad de México plenamente incluyente, donde la discapacidad no sea un obstáculo para el desarrollo personal, laboral y social.",
  },
  {
    icon: Shield,
    titulo: "Nuestro Compromiso",
    descripcion: "Transparencia, honestidad y dedicación. Cada gestión y cada trámite que facilitamos es un paso hacia una ciudad más justa.",
  },
];

export default function QuienesSomos() {
  return (
    <section
      id="quienes-somos"
      className="py-28 bg-ink-950 relative overflow-hidden"
      aria-labelledby="quienes-somos-titulo"
    >
      {/* Orbs de fondo */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                        w-[800px] h-[800px] rounded-full
                        bg-naranja-500/5 blur-[120px]" />
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

          {/* Texto */}
          <div>
            <FadeIn>
              <span className="section-badge-dark mb-5">Quiénes Somos</span>
              <h2
                id="quienes-somos-titulo"
                className="text-[40px] sm:text-[52px] font-black text-white
                           leading-tight tracking-tight mt-4 mb-7"
              >
                Un equipo comprometido con la{" "}
                <span className="text-gradient">inclusión</span>
              </h2>
              <div className="space-y-5 text-[17px] text-white/55 leading-relaxed">
                <p>
                  Somos el equipo del Diputado{" "}
                  <strong className="text-white font-semibold">Armando Ruiz</strong>,
                  representante de la Ciudad de México ante la Cámara de Diputados
                  por el Movimiento Naranja.
                </p>
                <p>
                  Nuestro trabajo se centra en legislar, gestionar y facilitar el acceso
                  a todos los programas y servicios para{" "}
                  <strong className="text-white/80 font-medium">
                    personas con discapacidad y sus familias
                  </strong>.
                </p>
                <p>
                  Entendemos de primera mano los desafíos de la comunidad, porque
                  nuestro diputado vive con discapacidad y conoce la realidad de quienes
                  representa.
                </p>
              </div>
            </FadeIn>
          </div>

          {/* Cards */}
          <StaggerContainer className="flex flex-col gap-4" stagger={0.12}>
            {valores.map((v) => {
              const Icon = v.icon;
              return (
                <StaggerItem key={v.titulo} direction="left">
                  <motion.div
                    className="flex items-start gap-5 p-6 rounded-card
                               border border-white/8 bg-white/4
                               hover:border-white/16 hover:bg-white/6
                               transition-all duration-300 group"
                    whileHover={{ x: 4 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <div className="w-12 h-12 rounded-xl bg-naranja-500/10 flex items-center
                                    justify-center flex-shrink-0 group-hover:scale-110
                                    transition-transform duration-300">
                      <Icon className="w-6 h-6 text-naranja-400" strokeWidth={1.75} />
                    </div>
                    <div>
                      <h3 className="text-[18px] font-bold text-white mb-1.5">{v.titulo}</h3>
                      <p className="text-[15px] text-white/50 leading-relaxed">{v.descripcion}</p>
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
