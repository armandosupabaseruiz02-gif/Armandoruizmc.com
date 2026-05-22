"use client";

import { motion } from "framer-motion";
import FadeIn from "@/components/ui/FadeIn";
import { Heart, Shield, Users, ArrowRight } from "lucide-react";
import { lenisScrollTo } from "@/providers/SmoothScrollProvider";

export default function Donar() {
  return (
    <section id="donar" className="py-28 bg-warm-100 relative overflow-hidden" aria-labelledby="donar-titulo">
      <div className="absolute inset-0 bg-dot-pattern opacity-60 pointer-events-none" aria-hidden="true" />

      <div className="relative max-w-4xl mx-auto px-5 sm:px-8">
        <FadeIn>
          <div
            className="relative rounded-[32px] overflow-hidden p-12 sm:p-16 text-center border-2 border-naranja-200 shadow-xl"
            style={{ background: "linear-gradient(135deg, #fff7ed 0%, #fff4ea 50%, #ffedd5 100%)" }}
          >
            {/* Orbs decorativos */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
              <motion.div
                className="absolute top-[-20%] left-[-10%] w-[400px] h-[400px] rounded-full"
                style={{ background: "radial-gradient(circle, rgba(249,115,22,0.15) 0%, transparent 70%)" }}
                animate={{ x: [0, 20, 0], y: [0, 15, 0] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute bottom-[-20%] right-[-10%] w-[350px] h-[350px] rounded-full"
                style={{ background: "radial-gradient(circle, rgba(251,146,60,0.15) 0%, transparent 70%)" }}
                animate={{ x: [0, -15, 0], y: [0, -20, 0] }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              />
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-naranja-300 via-naranja-500 to-naranja-300" />
            </div>

            <div className="relative">
              <motion.div
                className="w-20 h-20 mx-auto mb-8 rounded-full flex items-center justify-center"
                style={{ background: "rgba(249,115,22,0.15)", border: "2px solid rgba(249,115,22,0.4)" }}
                animate={{ scale: [1, 1.06, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                aria-hidden="true"
              >
                <Heart className="w-9 h-9 text-naranja-500" fill="rgba(249,115,22,0.5)" />
              </motion.div>

              <span className="section-badge-dark mb-5">Donar</span>

              <h2 id="donar-titulo" className="text-[40px] sm:text-[56px] font-black text-gray-900 leading-tight tracking-tight mt-4 mb-5">
                Apoya nuestra <span className="bg-gradient-to-r from-naranja-600 via-naranja-500 to-naranja-400 bg-clip-text text-transparent">causa</span>
              </h2>

              <p className="text-[17px] sm:text-[19px] text-gray-600 leading-relaxed max-w-xl mx-auto mb-10">
                Cada aportación nos ayuda a llegar a más personas con discapacidad en la Ciudad de México, crear recursos y ampliar nuestros programas.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
                {[
                  { icon: Shield, text: "Donación segura y transparente" },
                  { icon: Users,  text: "Impacto directo en la comunidad" },
                  { icon: Heart,  text: "Deducible de impuestos" },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.text} className="flex items-center gap-2 text-gray-600 text-[14px] font-semibold">
                      <Icon className="w-4 h-4 text-naranja-500 flex-shrink-0" />
                      {item.text}
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.a
                  href="#donar-form"
                  className="btn-primary shadow-btn-glow"
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  aria-label="Hacer una donación"
                >
                  <Heart className="w-5 h-5" fill="white" />
                  Donar ahora
                  <ArrowRight className="w-5 h-5" />
                </motion.a>
                <motion.button
                  onClick={() => lenisScrollTo("#quienes-somos")}
                  className="btn-secondary"
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Conocer más
                </motion.button>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
