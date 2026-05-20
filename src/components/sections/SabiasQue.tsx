"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FadeIn from "@/components/ui/FadeIn";
import { ChevronLeft, ChevronRight, Lightbulb } from "lucide-react";

const datos = [
  { emoji: "🌍", dato: "1 de cada 6 personas en el mundo vive con algún tipo de discapacidad.", fuente: "Organización Mundial de la Salud, 2023" },
  { emoji: "🇲🇽", dato: "En México, más de 20 millones de personas tienen alguna discapacidad — el 16% de la población.", fuente: "INEGI, Censo 2020" },
  { emoji: "💼", dato: "Solo el 39% de las personas con discapacidad en México tiene empleo formal.", fuente: "CONADIS, 2022" },
  { emoji: "🎓", dato: "Las personas con discapacidad tienen 3 veces menos probabilidad de terminar la educación secundaria.", fuente: "UNESCO, 2022" },
  { emoji: "🚌", dato: "El 70% del transporte público en México no es accesible para personas en silla de ruedas.", fuente: "SEDESOL, 2021" },
  { emoji: "💊", dato: "El 60% de las personas con discapacidad en México no tiene acceso a los medicamentos que necesita.", fuente: "Secretaría de Salud, 2022" },
  { emoji: "🏠", dato: "8 de cada 10 personas con discapacidad viven en hogares con algún grado de pobreza en México.", fuente: "CONEVAL, 2022" },
  { emoji: "👴", dato: "Con el envejecimiento, el 46% de los mayores de 60 años en México desarrolla alguna discapacidad.", fuente: "IMSS, 2023" },
  { emoji: "♿", dato: "Solo el 15% de los edificios públicos en México cumple normas de accesibilidad universal.", fuente: "CONADIS, 2021" },
  { emoji: "❤️", dato: "El 80% de los cuidadores de personas con discapacidad son mujeres que no reciben pago por esa labor.", fuente: "ONU Mujeres, 2022" },
  { emoji: "📱", dato: "El 65% de las personas con discapacidad nunca ha accedido a un servicio de gobierno por internet.", fuente: "INEGI, 2021" },
  { emoji: "💪", dato: "Las personas con discapacidad que reciben apoyos gubernamentales mejoran su calidad de vida en un 73%.", fuente: "DIF Nacional, 2022" },
];

export default function SabiasQue() {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c === 0 ? datos.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === datos.length - 1 ? 0 : c + 1));

  return (
    <section id="sabias-que" className="py-28 bg-naranja-500 relative overflow-hidden" aria-labelledby="sabias-que-titulo">
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
          <p className="text-white/80 text-[17px] mb-14 max-w-xl mx-auto">
            La información transforma realidades. Conoce los datos sobre discapacidad en México.
          </p>
        </FadeIn>

        {/* Card de dato */}
        <div className="relative min-h-[240px] flex items-center justify-center mb-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.97 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="w-full bg-white rounded-3xl p-10 shadow-xl border-2 border-white/50"
            >
              <div className="text-6xl mb-5" aria-hidden="true">{datos[current].emoji}</div>
              <p className="text-[20px] sm:text-[24px] font-black text-gray-900 leading-snug mb-4">
                {datos[current].dato}
              </p>
              <p className="text-[13px] text-gray-400 font-semibold tracking-wide">
                Fuente: {datos[current].fuente}
              </p>
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
