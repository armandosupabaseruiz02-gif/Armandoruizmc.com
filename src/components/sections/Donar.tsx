"use client";

import { motion } from "framer-motion";
import FadeIn from "@/components/ui/FadeIn";
import { Heart, Shield, Users, ArrowRight } from "lucide-react";

export default function Donar() {
  return (
    <section
      id="donar"
      className="py-28 bg-white relative overflow-hidden"
      aria-labelledby="donar-titulo"
    >
      <div className="absolute inset-0 bg-dot-pattern opacity-60 pointer-events-none" aria-hidden="true" />

      <div className="relative max-w-4xl mx-auto px-5 sm:px-8">
        <FadeIn>
          {/* Contenedor con fondo oscuro directo (sin -z-10) */}
          <div
            className="relative rounded-[32px] overflow-hidden p-12 sm:p-16 text-center"
            style={{ background: "linear-gradient(135deg, #0f0f0f 0%, #1a0a00 40%, #0f0f0f 100%)" }}
          >
            {/* Orbs animados DENTRO del contenedor */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
              <motion.div
                className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full"
                style={{ background: "radial-gradient(circle, rgba(249,115,22,0.25) 0%, transparent 70%)" }}
                animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] rounded-full"
                style={{ background: "radial-gradient(circle, rgba(249,115,22,0.15) 0%, transparent 70%)" }}
                animate={{ x: [0, -20, 0], y: [0, -30, 0] }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              />
              {/* Top line */}
              <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-naranja-500/60 to-transparent" />
              {/* Bottom line */}
              <div className="absolute bottom-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-naranja-500/30 to-transparent" />
            </div>

            {/* Contenido relativo para que quede por encima de los orbs */}
            <div className="relative">
              {/* Ícono */}
              <motion.div
                className="w-20 h-20 mx-auto mb-8 rounded-full flex items-center justify-center"
                style={{ background: "rgba(249,115,22,0.2)", border: "1px solid rgba(249,115,22,0.3)" }}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                aria-hidden="true"
              >
                <Heart className="w-9 h-9 text-naranja-400" fill="rgba(249,115,22,0.4)" />
              </motion.div>

              <span className="section-badge-dark mb-5">Donar</span>

              <h2
                id="donar-titulo"
                className="text-[40px] sm:text-[56px] font-black text-white
                           leading-tight tracking-tight mt-4 mb-5"
              >
                Apoya nuestra{" "}
                <span className="text-gradient">causa</span>
              </h2>

              <p className="text-[17px] sm:text-[19px] leading-relaxed max-w-xl mx-auto mb-10"
                 style={{ color: "rgba(255,255,255,0.55)" }}>
                Cada aportación nos ayuda a llegar a más personas con discapacidad en
                la Ciudad de México, crear recursos y ampliar nuestros programas.
              </p>

              {/* Trust badges */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
                {[
                  { icon: Shield, text: "Donación segura y transparente" },
                  { icon: Users,  text: "Impacto directo en la comunidad" },
                  { icon: Heart,  text: "Deducible de impuestos" },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.text}
                         className="flex items-center gap-2 text-[14px] font-medium"
                         style={{ color: "rgba(255,255,255,0.55)" }}>
                      <Icon className="w-4 h-4 text-naranja-400 flex-shrink-0" />
                      {item.text}
                    </div>
                  );
                })}
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.a
                  href="#donar-form"
                  className="inline-flex items-center justify-center gap-2
                             min-h-[60px] px-10 rounded-[14px]
                             font-black text-[20px] text-white
                             transition-all duration-300 group"
                  style={{ background: "#f97316" }}
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  aria-label="Hacer una donación"
                >
                  <Heart className="w-6 h-6" fill="white" />
                  Donar ahora
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </motion.a>

                <motion.a
                  href="#quienes-somos"
                  className="inline-flex items-center justify-center gap-2
                             min-h-[60px] px-10 rounded-[14px]
                             font-semibold text-[18px] text-white
                             transition-all duration-300"
                  style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.2)" }}
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Conocer más
                </motion.a>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
