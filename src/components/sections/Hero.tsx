"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  Briefcase,
  CalendarHeart,
  ChevronDown,
  CreditCard,
  ScrollText,
} from "lucide-react";
import CardSwap, { Card } from "@/components/CardSwap";
import Ballpit from "@/components/effects/Ballpit";
import SplitText from "@/components/effects/SplitText";
import { lenisScrollTo } from "@/providers/SmoothScrollProvider";

const heroRoutes = [
  {
    title: "Tarjeta Accesible",
    description: "Revisa requisitos, beneficios y la ruta para iniciar el trámite.",
    badge: "Trámite",
    href: "/tarjeta-accesible",
    icon: CreditCard,
    gradient: "from-naranja-500 to-amber-500",
  },
  {
    title: "Cita de salud",
    description: "Agenda una orientación para explicar tu caso con más detalle.",
    badge: "Cita",
    href: "/salud/agendar",
    icon: CalendarHeart,
    gradient: "from-red-500 to-naranja-500",
  },
  {
    title: "Programas sociales",
    description: "Encuentra apoyos públicos y qué necesita preparar la persona.",
    badge: "Apoyos",
    href: "/programas-sociales",
    icon: ScrollText,
    gradient: "from-gray-950 to-naranja-800",
  },
  {
    title: "Bolsa de trabajo",
    description: "Conecta vacantes incluyentes con personas que buscan empleo.",
    badge: "Trabajo",
    href: "/bolsa-trabajo",
    icon: Briefcase,
    gradient: "from-amber-600 to-orange-800",
  },
];

const heroBallpitColors = [0xffb347, 0xff9828, 0xff7a12, 0xf97316, 0xea580c];

export default function Hero() {
  const { scrollY } = useScroll();
  const y       = useTransform(scrollY, [0, 700], [0, 100]);
  const opacity = useTransform(scrollY, [0, 420], [1, 0]);

  return (
    <section
      id="inicio"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-warm-50"
      aria-labelledby="hero-titulo"
    >
      {/* Fondo decorativo vivo */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 bg-warm-50" />
        <div className="absolute inset-0 opacity-[0.70] sm:opacity-[0.80] motion-reduce:hidden">
          <Ballpit
            count={101}
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
        className="relative mx-auto w-full max-w-7xl px-5 pt-28 pb-20 sm:px-8"
        style={{ y, opacity }}
      >
        <div className="grid min-w-0 grid-cols-1 gap-16 items-center lg:grid-cols-[1fr_420px]">

          {/* Izquierda */}
          <div className="flex min-w-0 w-[min(20.75rem,calc(100vw-2.5rem))] flex-col gap-7 sm:w-full sm:max-w-none">
            {/* Badge partido */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full
                               bg-naranja-100 border border-naranja-300
                               text-naranja-700 text-[12px] sm:text-[13px] font-bold tracking-widest uppercase">
                <span className="w-2 h-2 rounded-full bg-naranja-500 animate-pulse" />
                <span className="hidden sm:inline">Movimiento Naranja · Diputado Federal</span>
                <span className="sm:hidden">Movimiento Naranja</span>
              </span>
            </motion.div>

            {/* Título con SplitText */}
            <SplitText
              tag="h1"
              id="hero-titulo"
              text="Por un México más Accesible e Incluyente"
              className="notranslate text-[48px] sm:text-[64px] lg:text-[72px] font-black
                         text-naranja-600 leading-[1.0] tracking-tight break-words"
              delay={70}
              duration={0.55}
              ease="power3.out"
              splitType="words"
              from={{ opacity: 1, y: 24 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.05}
              rootMargin="0px"
              textAlign="left"
              translate="no"
              style={{ overflow: "visible" }}
              animateOnScroll={false}
            />

            {/* Descripción */}
            <motion.p
              className="max-w-full text-[18px] leading-relaxed text-gray-700 sm:max-w-xl sm:text-[20px]"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              Soy{" "}
              <strong className="text-gray-900 font-bold">Armando Ruiz</strong>,{" "}
              <strong className="text-naranja-700 font-bold">Diputado Federal por la Ciudad de México</strong>.
              Aquí encontrarás rutas claras para apoyos, trámites y seguimiento ciudadano.
            </motion.p>

            {/* CTAs */}
            <motion.div
              className="flex w-full max-w-full min-w-0 flex-col gap-3 sm:w-auto sm:max-w-none sm:flex-row"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85, duration: 0.5 }}
            >
              <Link href="/tarjeta-accesible" className="btn-primary group min-w-0 max-w-full w-full !px-3 text-center shadow-btn-glow sm:w-auto sm:!px-8">
                <CreditCard className="w-5 h-5" />
                Tramitar Tarjeta Accesible
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <button
                onClick={() => lenisScrollTo("#quienes-somos")}
                className="btn-secondary min-w-0 max-w-full w-full !px-4 sm:w-auto sm:!px-8"
              >
                Ver cómo te ayudamos
              </button>
            </motion.div>

          </div>

          {/* CardSwap React Bits */}
          <motion.div
            className="hidden lg:flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
          >
            <div className="relative h-[500px] w-full max-w-[430px] lg:-translate-x-10 xl:-translate-x-12" aria-label="Rutas destacadas">
              <div className="absolute inset-8 rounded-[40px] bg-naranja-300/30 blur-3xl" aria-hidden="true" />
              <div className="absolute bottom-10 right-5 h-44 w-44 rounded-full bg-amber-200/60 blur-2xl" aria-hidden="true" />

              <CardSwap
                width={360}
                height={270}
                cardDistance={38}
                verticalDistance={54}
                delay={3600}
                pauseOnHover
                skewAmount={5}
                easing="elastic"
              >
                {heroRoutes.map((route) => {
                  const Icon = route.icon;

                  return (
                    <Card key={route.title} customClass={`bg-gradient-to-br ${route.gradient} text-white`}>
                      <Link
                        href={route.href}
                        className="relative z-10 flex h-full flex-col justify-between p-7 text-white focus-visible:outline-2 focus-visible:outline-white"
                      >
                        <span className="inline-flex w-fit items-center rounded-full border border-white/30 bg-white/15 px-3 py-1 text-[11px] font-black uppercase tracking-widest">
                          {route.badge}
                        </span>
                        <span>
                          <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/18">
                            <Icon className="h-6 w-6" aria-hidden="true" />
                          </span>
                          <span className="block text-[28px] font-black leading-tight">
                            {route.title}
                          </span>
                          <span className="mt-3 block text-[15px] leading-relaxed text-white/82">
                            {route.description}
                          </span>
                        </span>
                        <span className="inline-flex items-center gap-2 text-[15px] font-bold">
                          Abrir ruta
                          <ArrowRight className="h-4 w-4" aria-hidden="true" />
                        </span>
                      </Link>
                    </Card>
                  );
                })}
              </CardSwap>
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
