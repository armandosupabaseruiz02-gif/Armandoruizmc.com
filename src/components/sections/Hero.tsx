"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { CreditCard, ArrowRight, ChevronDown } from "lucide-react";
const wordReveal = { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } };
const wordItem   = {
  hidden:  { y: "110%", opacity: 0 },
  visible: { y: "0%",   opacity: 1, transition: { duration: 0.65, ease: "easeOut" as const } },
};

function SplitWords({ text, className }: { text: string; className?: string }) {
  return (
    <motion.span className={`inline ${className}`} variants={wordReveal} initial="hidden" animate="visible">
      {text.split(" ").map((word, i) => (
        <span key={i} className="inline-block overflow-hidden mr-[0.25em]">
          <motion.span className="inline-block" variants={wordItem}>{word}</motion.span>
        </span>
      ))}
    </motion.span>
  );
}

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y       = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section
      ref={ref}
      id="inicio"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-warm-50"
      aria-labelledby="hero-titulo"
    >
      {/* Fondo decorativo vivo */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 bg-dot-pattern opacity-70" />

        {/* Orb naranja grande */}
        <motion.div
          className="absolute top-[-15%] right-[-10%] w-[700px] h-[700px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(249,115,22,0.18) 0%, transparent 70%)" }}
          animate={{ x: [0, -30, 0], y: [0, 20, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Orb amarillo cálido */}
        <motion.div
          className="absolute bottom-[-10%] left-[10%] w-[500px] h-[500px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(251,191,36,0.14) 0%, transparent 70%)" }}
          animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        />

        {/* Línea superior decorativa */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-naranja-400 via-naranja-500 to-naranja-400" />
      </div>

      <motion.div
        className="relative max-w-7xl mx-auto px-5 sm:px-8 pt-28 pb-20"
        style={{ y, opacity }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-16 items-center">

          {/* Izquierda */}
          <div className="flex flex-col gap-7">
            {/* Badge partido */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full
                               bg-naranja-100 border border-naranja-300
                               text-naranja-700 text-[13px] font-bold tracking-widest uppercase">
                <span className="w-2 h-2 rounded-full bg-naranja-500 animate-pulse" />
                Movimiento Naranja · Diputado CDMX
              </span>
            </motion.div>

            {/* Título con word reveal */}
            <h1
              id="hero-titulo"
              className="text-[48px] sm:text-[64px] lg:text-[72px] font-black
                         text-gray-900 leading-[1.0] tracking-tight"
            >
              <div className="overflow-hidden"><SplitWords text="Por una CDMX" /></div>
              <div className="overflow-hidden mt-1">
                <SplitWords text="más" />
                {" "}
                <SplitWords text="Accesible" className="text-gradient" />
              </div>
              <div className="overflow-hidden mt-1"><SplitWords text="e Incluyente" /></div>
            </h1>

            {/* Descripción */}
            <motion.p
              className="text-[18px] sm:text-[20px] text-gray-600 leading-relaxed max-w-xl"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              Soy{" "}
              <strong className="text-gray-900 font-bold">Armando Ruiz</strong>,{" "}
              <strong className="text-naranja-600 font-bold">Diputado CDMX por la Ciudad de México</strong>.
              Aquí encontrarás todos los apoyos, trámites y servicios que mereces.
            </motion.p>

            {/* CTAs */}
            <motion.div
              className="flex flex-col sm:flex-row gap-3"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85, duration: 0.5 }}
            >
              <Link href="/tarjeta-accesible" className="btn-primary group shadow-btn-glow">
                <CreditCard className="w-5 h-5" />
                Tramitar Tarjeta Accesible
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="#servicios" className="btn-secondary">
                Ver todos los servicios
              </Link>
            </motion.div>

          </div>

          {/* Card foto */}
          <motion.div
            className="hidden lg:flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
            aria-hidden="true"
          >
            <div className="relative w-full max-w-[380px]">
              {/* Sombra de fondo */}
              <div className="absolute inset-4 bg-naranja-300 rounded-[32px] blur-2xl opacity-30 scale-95" />

              {/* Card principal */}
              <div className="relative w-full aspect-[3/4] rounded-[32px]
                              bg-white border-2 border-naranja-200
                              overflow-hidden shadow-xl">
                {/* Gradiente fondo */}
                <div className="absolute inset-0 bg-gradient-to-br from-naranja-50 via-white to-orange-50" />

                {/* Placeholder foto */}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                  <div className="w-28 h-28 rounded-full bg-naranja-100 border-4 border-naranja-300
                                  flex items-center justify-center">
                    <span className="text-naranja-600 font-black text-4xl">AR</span>
                  </div>
                  <div className="text-center px-6">
                    <p className="text-gray-900 font-black text-[20px]">Armando Ruiz</p>
                    <p className="text-naranja-600 text-[14px] font-bold mt-1">Diputado CDMX</p>
                    <p className="text-naranja-400 text-[12px] font-semibold mt-0.5">Ciudad de México</p>
                    <p className="text-gray-400 text-[11px] mt-3">(Foto oficial pendiente)</p>
                  </div>
                </div>

                {/* Badge partido */}
                <motion.div
                  className="absolute top-5 right-5 bg-white rounded-2xl shadow-md px-4 py-2.5
                              flex items-center gap-2 border border-naranja-100"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="w-8 h-8 rounded-full bg-naranja-500 flex items-center justify-center">
                    <span className="text-white text-[10px] font-black">MN</span>
                  </div>
                  <div>
                    <p className="text-gray-900 text-[12px] font-black leading-tight">Movimiento</p>
                    <p className="text-naranja-600 text-[12px] font-black leading-tight">Naranja</p>
                  </div>
                </motion.div>

                {/* Badge accesibilidad */}
                <motion.div
                  className="absolute bottom-5 left-5 bg-white rounded-2xl shadow-md px-4 py-2.5
                              flex items-center gap-2 border border-naranja-100"
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                >
                  <span className="text-2xl">♿</span>
                  <div>
                    <p className="text-gray-900 text-[12px] font-bold">Inclusión</p>
                    <p className="text-naranja-500 text-[11px] font-semibold">para todos</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        aria-hidden="true"
      >
        <span className="text-gray-400 text-[11px] tracking-[0.2em] uppercase font-semibold">
          Descubrir
        </span>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.8, repeat: Infinity }}>
          <ChevronDown className="w-5 h-5 text-naranja-500" />
        </motion.div>
      </motion.div>
    </section>
  );
}
