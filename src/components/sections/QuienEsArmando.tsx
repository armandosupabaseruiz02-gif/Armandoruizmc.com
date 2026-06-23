"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import FadeIn, { StaggerContainer, StaggerItem } from "@/components/ui/FadeIn";
import { Award, Heart, Users } from "lucide-react";

const logros = [
  { icon: Award, titulo: "Legislador comprometido", desc: "Impulsa derechos de personas con discapacidad." },
  { icon: Heart, titulo: "Experiencia de vida",     desc: "Conoce de cerca los retos de la comunidad." },
  { icon: Users, titulo: "Representación real",     desc: "Voz directa de personas con discapacidad en CDMX." },
];

export default function QuienEsArmando() {
  const { scrollY } = useScroll();
  const imageParallax = useTransform(scrollY, [900, 2400], [30, -30]);

  return (
    <section
      id="armando-ruiz"
      className="landing-sheet bg-warm-100"
      aria-labelledby="armando-titulo"
    >
      <div className="absolute inset-0 bg-grid-pattern opacity-60 pointer-events-none" aria-hidden="true" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-naranja-200 opacity-20 blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          <motion.div className="flex justify-center order-2 lg:order-1" style={{ y: imageParallax }}>
            <div className="relative w-full max-w-[360px]">
              <div className="absolute inset-6 bg-naranja-300 rounded-[32px] blur-2xl opacity-25" />
              <div className="relative w-full aspect-[3/4] overflow-hidden rounded-[32px] border-2 border-naranja-200 bg-naranja-500 shadow-xl">
                <Image
                  src="/images/armando-ruiz-movimiento-naranja.jpg"
                  alt="Armando Ruiz en silla de ruedas frente al fondo naranja de Movimiento Ciudadano"
                  fill
                  sizes="(min-width: 1024px) 360px, min(360px, calc(100vw - 40px))"
                  className="object-cover object-center"
                />
              </div>
            </div>
          </motion.div>

          <div className="order-1 lg:order-2">
            <FadeIn direction="left">
              <span className="section-badge-light">Quién es Armando Ruiz</span>
              <h2 id="armando-titulo" className="text-[40px] sm:text-[52px] font-black text-gray-900 leading-tight tracking-tight mt-5 mb-6">
                Un legislador que <span className="text-highlight">vive la inclusión</span>
              </h2>
              <div className="space-y-4 text-[17px] text-gray-800 leading-relaxed">
                <p>
                  Armando Ruiz es <strong className="text-gray-900 font-bold">Diputado Federal por el Estado de México</strong> de Movimiento Ciudadano.
                </p>
                <p>
                  Como persona con discapacidad, trabaja para convertir derechos en <strong className="text-naranja-700 font-bold">realidades accesibles</strong>.
                </p>
              </div>
            </FadeIn>

            <StaggerContainer className="grid grid-cols-1 gap-3 mt-6" stagger={0.1}>
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
