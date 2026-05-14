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
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 bg-dot-pattern opacity-60" />
      </div>

      <div className="relative max-w-4xl mx-auto px-5 sm:px-8">
        <FadeIn>
          <div className="relative rounded-[32px] overflow-hidden p-12 sm:p-16 text-center">
            {/* Animated gradient background */}
            <div
              className="absolute inset-0 -z-10"
              style={{
                background: "linear-gradient(135deg, #0f0f0f 0%, #1a0a00 40%, #0f0f0f 100%)",
              }}
            />

            {/* Orbs */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
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
            </div>

            {/* Top line */}
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-naranja-500/60 to-transparent" />

            {/* Ícono */}
            <motion.div
              className="w-20 h-20 mx-auto mb-8 rounded-full bg-naranja-500/20
                         border border-naranja-500/30 flex items-center justify-center"
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

            <p className="text-[17px] sm:text-[19px] text-white/55 leading-relaxed max-w-xl mx-auto mb-10">
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
                  <div key={item.text} className="flex items-center gap-2 text-white/50 text-[14px]">
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
                           min-h-[60px] px-10
                           bg-naranja-500 hover:bg-naranja-600
                           text-white font-black text-[20px]
                           rounded-pill shadow-glow
                           transition-all duration-300 group"
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
              >
                <Heart className="w-6 h-6" fill="white" />
                Donar ahora
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </motion.a>
              <motion.a
                href="#quienes-somos"
                className="btn-secondary min-h-[60px] px-10 text-[18px]"
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                Conocer más
              </motion.a>
            </div>

            {/* Bottom line */}
            <div className="absolute bottom-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-naranja-500/30 to-transparent" />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
