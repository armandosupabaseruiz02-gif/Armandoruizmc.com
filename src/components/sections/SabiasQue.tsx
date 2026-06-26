"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FadeIn from "@/components/ui/FadeIn";
import { ChevronLeft, ChevronRight, Lightbulb } from "lucide-react";

const datos = [
  {
    emoji: "🇲🇽",
    dato: "En México, 6.1 millones de personas viven con alguna discapacidad.",
    fuente: "INEGI, Censo 2020.",
  },
  {
    emoji: "👁️",
    dato: "La dificultad para ver y caminar está entre las más frecuentes.",
    fuente: "INEGI, muestra censal 2020.",
  },
  {
    emoji: "💼",
    dato: "La accesibilidad laboral sigue siendo una de las brechas más grandes.",
    fuente: "INEGI, ENIGH 2020.",
  },
  {
    emoji: "🎓",
    dato: "La educación accesible cambia trayectorias de vida.",
    fuente: "CONADIS, diagnóstico 2021.",
  },
  {
    emoji: "🏠",
    dato: "La pobreza afecta con más fuerza a personas con discapacidad.",
    fuente: "CONEVAL, informe 2022.",
  },
  {
    emoji: "👩‍⚕️",
    dato: "El acceso a salud pública debe ser claro, cercano y oportuno.",
    fuente: "INEGI, Censo 2020.",
  },
  {
    emoji: "🏙️",
    dato: "La CDMX necesita servicios urbanos realmente accesibles.",
    fuente: "INEGI, CDMX 2020.",
  },
  {
    emoji: "❤️",
    dato: "El cuidado de personas con discapacidad recae mayormente en mujeres.",
    fuente: "Inmujeres, 2022.",
  },
  {
    emoji: "♿",
    dato: "La movilidad accesible todavía es una deuda diaria.",
    fuente: "Metro CDMX, 2022.",
  },
  {
    emoji: "📋",
    dato: "Muchas personas no conocen los apoyos a los que pueden acceder.",
    fuente: "ENADIS, 2022.",
  },
  {
    emoji: "👴",
    dato: "La edad aumenta la necesidad de apoyos y accesibilidad.",
    fuente: "INAPAM, 2022.",
  },
  {
    emoji: "💪",
    dato: "La accesibilidad laboral abre autonomía e ingresos propios.",
    fuente: "STPS, 2023.",
  },
];

export default function SabiasQue() {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c === 0 ? datos.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === datos.length - 1 ? 0 : c + 1));

  return (
    <section id="sabias-que" className="landing-sheet bg-naranja-500" aria-labelledby="sabias-que-titulo">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="absolute top-0 inset-x-0 h-1 bg-white/20" />
        <div className="absolute bottom-0 inset-x-0 h-1 bg-white/20" />
        <motion.div
          className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-white/10 blur-3xl"
          animate={{ x: [0, -20, 0], y: [0, 20, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative max-w-4xl mx-auto px-5 sm:px-8 text-center">
        <FadeIn>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full
                          bg-white/20 border border-white/40 text-white
                          text-[13px] font-bold tracking-widest uppercase mb-6">
            <Lightbulb className="w-4 h-4" />
            ¿Sabías que?
          </div>

          <h2 id="sabias-que-titulo" className="text-[36px] sm:text-[48px] font-black text-white leading-tight tracking-tight mb-4">
            Datos que todos debemos conocer
          </h2>
          <p className="text-white/80 text-[17px] mb-10 max-w-xl mx-auto">
            Datos cortitos para entender por qué la accesibilidad nos importa a todos.
          </p>
        </FadeIn>

        {/* Card de dato */}
        <div className="relative flex items-center justify-center mb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.97 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="w-full bg-white rounded-card p-7 sm:p-8 shadow-xl border-2 border-naranja-100 text-left"
            >
              {/* Emoji + dato */}
              <div className="flex items-start gap-5 mb-6">
                <span className="text-5xl flex-shrink-0 mt-1" aria-hidden="true">
                  {datos[current].emoji}
                </span>
                <p className="text-[19px] sm:text-[21px] font-black text-gray-900 leading-snug">
                  {datos[current].dato}
                </p>
              </div>

              {/* Separador */}
              <div className="h-px bg-naranja-100 mb-5" />

              {/* Cita APA */}
              <div className="flex items-start gap-3">
                <span className="text-[11px] font-black text-naranja-500 tracking-widest uppercase
                                 bg-naranja-50 border border-naranja-200 rounded-full px-2.5 py-1
                                 flex-shrink-0 mt-0.5">
                  Fuente
                </span>
                <p className="text-[12px] text-gray-600 leading-relaxed font-mono italic">
                  {datos[current].fuente}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Controles */}
        <div className="flex items-center justify-center gap-6">
          <button
            onClick={prev}
            className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 border border-white/40
                       flex items-center justify-center text-white transition-all duration-200
                       hover:-translate-x-0.5 focus-visible:ring-2 focus-visible:ring-white"
            aria-label="Dato anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Indicadores */}
          <div className="flex gap-2" role="tablist" aria-label="Indicadores de dato">
            {datos.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`rounded-full transition-all duration-200 focus-visible:ring-2 focus-visible:ring-white
                            ${i === current ? "w-6 h-3 bg-white" : "w-3 h-3 bg-white/40 hover:bg-white/60"}`}
                aria-label={`Dato ${i + 1}`}
                aria-selected={i === current}
                role="tab"
              />
            ))}
          </div>

          <button
            onClick={next}
            className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 border border-white/40
                       flex items-center justify-center text-white transition-all duration-200
                       hover:translate-x-0.5 focus-visible:ring-2 focus-visible:ring-white"
            aria-label="Siguiente dato"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <p className="text-white/60 text-[13px] mt-6 font-medium">
          {current + 1} de {datos.length} datos
        </p>
      </div>
    </section>
  );
}
