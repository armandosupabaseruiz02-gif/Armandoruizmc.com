"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { CreditCard, ChevronDown, ArrowRight } from "lucide-react";
const wordReveal = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};
const wordItem = {
  hidden:  { y: "110%", opacity: 0 },
  visible: { y: "0%", opacity: 1, transition: { duration: 0.7, ease: "easeOut" as const } },
};

function SplitWords({ text, className }: { text: string; className?: string }) {
  return (
    <motion.span
      className={`inline ${className}`}
      variants={wordReveal}
      initial="hidden"
      animate="visible"
    >
      {text.split(" ").map((word, i) => (
        <span key={i} className="inline-block overflow-hidden mr-[0.25em]">
          <motion.span className="inline-block" variants={wordItem}>
            {word}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const y          = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacity    = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const imageY     = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const badgeScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.9]);

  return (
    <section
      ref={ref}
      id="inicio"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden
                 bg-ink-950"
      aria-labelledby="hero-titulo"
    >
      {/* ——— FONDO ANIMADO ——— */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-40" />

        {/* Orb naranja principal */}
        <motion.div
          className="absolute top-[-20%] left-[-10%] w-[700px] h-[700px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(249,115,22,0.18) 0%, transparent 70%)",
          }}
          animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Orb naranja secundario */}
        <motion.div
          className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(249,115,22,0.12) 0%, transparent 70%)",
          }}
          animate={{ x: [0, -30, 0], y: [0, -40, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />

        {/* Faint gradient top */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-naranja-500/30 to-transparent" />
        <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-naranja-500/10 to-transparent" />
      </div>

      {/* ——— CONTENIDO ——— */}
      <motion.div
        className="relative max-w-7xl mx-auto px-5 sm:px-8 pt-28 pb-20"
        style={{ y, opacity }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] xl:grid-cols-[1fr_480px] gap-16 items-center">

          {/* Columna izquierda */}
          <div className="flex flex-col gap-7">
            {/* Badge */}
            <motion.div
              style={{ scale: badgeScale }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
            >
              <span className="section-badge-dark text-[12px]">
                <span className="w-2 h-2 rounded-full bg-naranja-400 animate-pulse" />
                Movimiento Naranja · Diputado CDMX
              </span>
            </motion.div>

            {/* Título */}
            <h1
              id="hero-titulo"
              className="text-[52px] sm:text-[68px] lg:text-[76px] xl:text-[88px]
                         font-black text-white leading-[0.95] tracking-tight"
            >
              <div className="overflow-hidden">
                <SplitWords text="Juntos por" />
              </div>
              <div className="overflow-hidden mt-1">
                <SplitWords
                  text="una Ciudad"
                  className="text-gradient"
                />
              </div>
              <div className="overflow-hidden mt-1">
                <SplitWords text="Incluyente" />
              </div>
            </h1>

            {/* Descripción */}
            <motion.p
              className="text-[17px] sm:text-[19px] text-white/60 leading-relaxed max-w-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.7 }}
            >
              Soy <strong className="text-white font-semibold">Armando Ruiz</strong>, Diputado
              de la Ciudad de México. Trabajo para que las personas con discapacidad y sus familias
              tengan acceso a todos los apoyos y servicios que merecen.
            </motion.p>

            {/* CTAs */}
            <motion.div
              className="flex flex-col sm:flex-row gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85, duration: 0.6 }}
            >
              <Link href="#tarjeta-incluyente" className="btn-primary group">
                <CreditCard className="w-5 h-5" aria-hidden="true" />
                Tramitar Tarjeta Incluyente
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link href="#servicios" className="btn-secondary">
                Ver todos los apoyos
              </Link>
            </motion.div>

          </div>

          {/* Columna derecha — card flotante */}
          <motion.div
            className="relative hidden lg:flex items-center justify-center"
            style={{ y: imageY }}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            aria-hidden="true"
          >
            {/* Glow detrás */}
            <div className="absolute inset-0 rounded-[32px] bg-naranja-500/20 blur-3xl scale-90" />

            {/* Card principal */}
            <div className="relative w-full aspect-[3/4] max-w-[380px] rounded-[32px]
                            bg-gradient-to-b from-ink-800 to-ink-900
                            border border-white/8 overflow-hidden shadow-dark-card">
              {/* Foto placeholder */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-5">
                <div className="w-28 h-28 rounded-full bg-naranja-500/20 border border-naranja-500/30
                                flex items-center justify-center">
                  <span className="text-naranja-400 font-black text-4xl">AR</span>
                </div>
                <div className="text-center">
                  <p className="text-white font-bold text-[18px]">Armando Ruiz</p>
                  <p className="text-naranja-400 text-[13px] font-medium mt-1">Diputado CDMX</p>
                  <p className="text-white/25 text-[11px] mt-3">Reemplazar con foto oficial</p>
                </div>
              </div>

              {/* Shimmer overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/4 via-transparent to-transparent pointer-events-none" />

              {/* Badge superior */}
              <motion.div
                className="absolute top-5 left-5 glass-card px-4 py-2.5 flex items-center gap-2.5"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="w-8 h-8 rounded-full bg-naranja-500 flex items-center justify-center">
                  <span className="text-white text-[11px] font-black">MN</span>
                </div>
                <div>
                  <p className="text-white text-[12px] font-bold leading-tight">Movimiento</p>
                  <p className="text-naranja-400 text-[12px] font-bold leading-tight">Naranja</p>
                </div>
              </motion.div>

              {/* Badge inferior */}
              <motion.div
                className="absolute bottom-5 right-5 glass-card px-4 py-2.5 flex items-center gap-2"
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              >
                <span className="text-2xl">♿</span>
                <div>
                  <p className="text-white text-[12px] font-bold">Inclusión</p>
                  <p className="text-white/50 text-[11px]">en CDMX</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        aria-hidden="true"
      >
        <span className="text-white/30 text-[11px] tracking-[0.15em] uppercase font-medium">
          Descubrir
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-5 h-5 text-naranja-500" />
        </motion.div>
      </motion.div>

      {/* Transición al blanco */}
      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-white to-transparent pointer-events-none" />
    </section>
  );
}
