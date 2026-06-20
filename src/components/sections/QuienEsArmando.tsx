"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import FadeIn, { StaggerContainer, StaggerItem } from "@/components/ui/FadeIn";
import { Award, Heart, Users, Landmark } from "lucide-react";

const logros = [
  { icon: Award, titulo: "Legislador comprometido", desc: "Iniciativas de ley por los derechos de personas con discapacidad en México." },
  { icon: Heart, titulo: "Experiencia de vida",     desc: "Como persona con discapacidad, conoce de primera mano la realidad de la comunidad." },
  { icon: Users, titulo: "Representación real",     desc: "Voz directa de miles de personas con discapacidad en la Ciudad de México." },
];

export default function QuienEsArmando() {
  const { scrollY } = useScroll();
  const imageParallax = useTransform(scrollY, [900, 2400], [30, -30]);

  return (
    <section
      id="armando-ruiz"
      className="py-28 bg-warm-100 relative overflow-hidden"
      aria-labelledby="armando-titulo"
    >
      <div className="absolute inset-0 bg-grid-pattern opacity-60 pointer-events-none" aria-hidden="true" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-naranja-200 opacity-20 blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          <motion.div className="flex justify-center order-2 lg:order-1" style={{ y: imageParallax }} aria-hidden="true">
            <div className="relative w-full max-w-[360px]">
              <div className="absolute inset-6 bg-naranja-300 rounded-[32px] blur-2xl opacity-25" />
              <div className="relative w-full aspect-[3/4] rounded-[32px] bg-white border-2 border-naranja-200 overflow-hidden shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-naranja-50 via-white to-orange-50" />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                  <div className="w-24 h-24 rounded-full bg-naranja-100 border-4 border-naranja-300 flex items-center justify-center">
                    <span className="text-naranja-600 font-black text-3xl">AR</span>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-900 font-black text-[18px]">Armando Ruiz</p>
                    <p className="text-naranja-600 text-[14px] font-bold mt-1">Diputado Federal</p>
                    <p className="text-gray-400 text-[11px] mt-3">Foto oficial pendiente</p>
                  </div>
                </div>
                <motion.div
                  className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-lg px-4 py-3 flex items-center gap-2 border-2 border-naranja-200"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="w-9 h-9 rounded-full bg-naranja-100 flex items-center justify-center flex-shrink-0">
                    <Landmark className="w-[18px] h-[18px] text-naranja-600" strokeWidth={2} aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-gray-900 text-[13px] font-black leading-tight">Cámara de</p>
                    <p className="text-naranja-600 text-[13px] font-black leading-tight">Diputados</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          <div className="order-1 lg:order-2">
            <FadeIn direction="left">
              <span className="section-badge-light">Quién es Armando Ruiz</span>
              <h2 id="armando-titulo" className="text-[40px] sm:text-[52px] font-black text-gray-900 leading-tight tracking-tight mt-5 mb-7">
                Un legislador que <span className="text-highlight">vive la inclusión</span>
              </h2>
              <div className="space-y-4 text-[17px] text-gray-800 leading-relaxed">
                <p>
                  Armando Ruiz es <strong className="text-gray-900 font-bold">Diputado Federal por la Ciudad de México</strong> del Movimiento Naranja. Como persona que vive con discapacidad y se desplaza en silla de ruedas, entiende profundamente los retos de esta comunidad.
                </p>
                <p>
                  Su trabajo garantiza que los derechos de las personas con discapacidad sean <strong className="text-naranja-700 font-bold">realidades accesibles</strong>, no solo palabras en papel.
                </p>
              </div>
            </FadeIn>

            <StaggerContainer className="grid grid-cols-1 gap-3 mt-8" stagger={0.1}>
              {logros.map((l) => {
                const Icon = l.icon;
                return (
                  <StaggerItem key={l.titulo}>
                    <div className="flex items-center gap-4 p-5 rounded-card bg-white border-2 border-gray-100 hover:border-naranja-200 hover:shadow-card transition-all duration-300 group">
                      <div className="w-11 h-11 rounded-xl bg-naranja-100 flex items-center justify-center flex-shrink-0 group-hover:bg-naranja-200 transition-colors">
                        <Icon className="w-5 h-5 text-naranja-600" />
                      </div>
                      <div>
                        <p className="text-[15px] font-bold text-gray-900 leading-tight">{l.titulo}</p>
                        <p className="text-[13px] text-gray-700 leading-snug mt-0.5">{l.desc}</p>
                      </div>
                    </div>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          </div>
        </div>
      </div>
    </section>
  );
}
