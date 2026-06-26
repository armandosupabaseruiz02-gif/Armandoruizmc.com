"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Ballpit from "@/components/effects/Ballpit";
import SombreroAguila from "@/components/effects/SombreroAguila";

const heroBallpitColors = [0xffb347, 0xff9828, 0xff7a12, 0xf97316, 0xea580c];

export default function Hero() {
  const { scrollY } = useScroll();
  const y       = useTransform(scrollY, [0, 700], [0, 100]);
  const opacity = useTransform(scrollY, [0, 420], [1, 0]);

  return (
    <section
      id="inicio"
      className="relative min-h-[100svh] flex flex-col justify-center overflow-hidden bg-warm-50"
      aria-labelledby="hero-titulo"
    >
      {/* Fondo decorativo vivo */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 bg-warm-50" />
        <div className="absolute inset-0 opacity-[0.32] sm:opacity-[0.42] motion-reduce:hidden">
          <Ballpit
            count={42}
            colors={heroBallpitColors}
            ambientColor={0xffffff}
            ambientIntensity={1.6}
            lightIntensity={135}
            gravity={0.25}
            friction={0.992}
            wallBounce={0.88}
            minSize={0.1}
            maxSize={0.34}
            size0={0.58}
            cursorRadius={0.58}
            cursorForce={1.3}
            maxVelocity={0.085}
            materialParams={{
              metalness: 0,
              roughness: 0.3,
              clearcoat: 0.9,
              clearcoatRoughness: 0.12,
              envMapIntensity: 0.38,
              emissiveIntensity: 0.08,
            }}
            showCursorBall={false}
            followCursor
            className="block h-full w-full"
          />
        </div>
        <div className="absolute inset-0 bg-dot-pattern opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-b from-warm-50/72 via-warm-50/30 to-warm-50/88" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_50%,rgba(255,248,237,0.62),rgba(255,248,237,0.25)_36%,rgba(255,248,237,0)_68%)]" />

        {/* Línea superior decorativa */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-naranja-400 via-naranja-500 to-naranja-400" />
      </div>

      <motion.div
        className="relative mx-auto w-full max-w-[100vw] px-5 pt-24 pb-10 sm:max-w-7xl sm:px-8 sm:pt-28 sm:pb-14"
        style={{ y, opacity }}
      >
        <div className="grid min-w-0 grid-cols-1 gap-10 items-center lg:grid-cols-[1fr_420px] lg:gap-16">

          {/* Izquierda */}
          <div className="hero-copy flex min-w-0 flex-col gap-5 sm:gap-7">
            {/* Sombrero emblema: al picarlo sale la aguilita con musiquita */}
            <div className="-mb-2 -mt-1">
              <SombreroAguila />
            </div>

            <h1
              id="hero-titulo"
              className="notranslate max-w-full text-[37px] font-black leading-[1.05]
                         text-naranja-600 tracking-normal sm:text-[64px] lg:text-[72px]"
              translate="no"
            >
              <span className="block">Por un México más</span>
              <span className="block">Accesible</span>
            </h1>

            {/* Slogan oficial */}
            <p className="hero-copy-text -mt-1 text-[19px] font-black leading-tight tracking-tight text-gray-900 sm:text-[26px]">
              Discapacidad con <span className="text-highlight">dignidad</span>.
            </p>

            {/* Descripción */}
            <motion.p
              className="hero-copy-text text-[16px] leading-relaxed text-gray-700 sm:text-[20px]"
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              ¡Qué gusto que llegaste! Soy{" "}
              <strong className="text-gray-900 font-bold">Armando Ruiz</strong>,{" "}
              <strong className="text-naranja-700 font-bold">
                Diputado Federal por el Estado de México
              </strong>
              . Aquí nadie te va a marear con papeleo ni con mil vueltas: tú cuéntanos qué
              necesitas y entre todos le buscamos &mdash; apoyos, trámites y seguimiento, de la
              mano y paso a pasito.
            </motion.p>

          </div>

          {/* Foto del diputado */}
          <motion.div
            className="flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.7, ease: "easeOut" }}
          >
            <div className="relative w-full max-w-[320px] sm:max-w-[400px]">
              <div className="absolute inset-6 rounded-[32px] bg-naranja-300 opacity-25 blur-2xl" aria-hidden="true" />
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[32px] border-2 border-naranja-200 bg-naranja-500 shadow-xl">
                <Image
                  src="/images/armando-ruiz-movimiento-naranja.jpg"
                  alt="El Diputado Armando Ruiz"
                  fill
                  sizes="(min-width: 1024px) 400px, min(320px, calc(100vw - 40px))"
                  className="object-cover object-center"
                  priority
                />
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-3 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 sm:bottom-5"
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
