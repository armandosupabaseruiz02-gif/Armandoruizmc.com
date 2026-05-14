"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import FadeIn, { StaggerContainer, StaggerItem } from "@/components/ui/FadeIn";
import { Award, Heart, Users } from "lucide-react";

const logros = [
  { icon: Award,  titulo: "Legislador comprometido", desc: "Años de trabajo en la Cámara con iniciativas por la inclusión." },
  { icon: Heart,  titulo: "Experiencia de vida",     desc: "Como persona con discapacidad, conoce de primera mano la realidad." },
  { icon: Users,  titulo: "Representación real",     desc: "Voz directa de miles de personas con discapacidad en el Estado de México." },
];

export default function QuienEsArmando() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imageParallax = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <section
      ref={ref}
      id="armando-ruiz"
      className="py-28 bg-white relative overflow-hidden"
      aria-labelledby="armando-titulo"
    >
      {/* Fondo split */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-ink-950" />
      </div>

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 items-stretch min-h-[600px]">

          {/* Izquierda – blanca */}
          <div className="bg-white py-16 pr-16 flex flex-col justify-center">
            <FadeIn>
              <span className="section-badge-light mb-5">Quién es Armando Ruiz</span>
              <h2
                id="armando-titulo"
                className="text-[40px] sm:text-[52px] font-black text-ink-900
                           leading-tight tracking-tight mt-4 mb-7"
              >
                Un legislador que{" "}
                <span className="text-gradient">vive la inclusión</span>
              </h2>
              <div className="space-y-4 text-[17px] text-ink-500 leading-relaxed">
                <p>
                  Armando Ruiz es Diputado Federal por el Estado de México por el{" "}
                  <strong className="text-ink-900 font-semibold">Movimiento Naranja</strong>.
                  Como persona que vive con discapacidad, entiende profundamente los retos
                  que enfrenta esta comunidad.
                </p>
                <p>
                  Su trabajo legislativo garantiza que los derechos de las personas con
                  discapacidad sean realidades accesibles para todos, no solo palabras en papel.
                </p>
              </div>
            </FadeIn>

            {/* Logros */}
            <StaggerContainer className="grid grid-cols-1 gap-3 mt-10" stagger={0.1}>
              {logros.map((l) => {
                const Icon = l.icon;
                return (
                  <StaggerItem key={l.titulo}>
                    <div className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100
                                    hover:border-naranja-200 hover:bg-naranja-50/40
                                    transition-all duration-300 group">
                      <div className="w-10 h-10 rounded-xl bg-naranja-50 flex items-center
                                      justify-center flex-shrink-0 group-hover:bg-naranja-100
                                      transition-colors">
                        <Icon className="w-5 h-5 text-naranja-500" />
                      </div>
                      <div>
                        <p className="text-[15px] font-bold text-ink-900 leading-tight">{l.titulo}</p>
                        <p className="text-[13px] text-ink-500 leading-snug mt-0.5">{l.desc}</p>
                      </div>
                    </div>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          </div>

          {/* Derecha – oscura con foto */}
          <div className="bg-ink-950 py-16 pl-16 flex items-center justify-start relative overflow-hidden">
            {/* Glow */}
            <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                              w-96 h-96 rounded-full bg-naranja-500/10 blur-3xl" />
            </div>

            <FadeIn direction="left" className="relative w-full max-w-[340px]">
              <motion.div
                style={{ y: imageParallax }}
                className="relative"
                aria-hidden="true"
              >
                {/* Card foto */}
                <div className="relative w-full aspect-[3/4] rounded-[28px]
                                bg-gradient-to-b from-ink-800 to-ink-900
                                border border-white/8 overflow-hidden shadow-dark-card">
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                    <div className="w-24 h-24 rounded-full bg-naranja-500/20 border border-naranja-500/30
                                    flex items-center justify-center">
                      <span className="text-naranja-400 font-black text-3xl">AR</span>
                    </div>
                    <div className="text-center">
                      <p className="text-white font-bold text-[17px]">Armando Ruiz</p>
                      <p className="text-naranja-400 text-[13px] mt-1">Diputado Federal</p>
                      <p className="text-white/20 text-[11px] mt-3">Foto oficial pendiente</p>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/4 via-transparent to-transparent" />
                </div>

                {/* Badge flotante */}
                <motion.div
                  className="absolute -bottom-5 -right-5 glass-card px-5 py-3"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <p className="text-white text-[13px] font-bold">Movimiento</p>
                  <p className="text-naranja-400 text-[13px] font-bold">Naranja ✦</p>
                </motion.div>
              </motion.div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}
