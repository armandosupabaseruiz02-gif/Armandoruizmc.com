"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FadeIn from "@/components/ui/FadeIn";
import { ChevronLeft, ChevronRight, Lightbulb } from "lucide-react";

const datos = [
  {
    emoji: "🇲🇽",
    dato: "En México, 6 millones 179 mil 890 personas viven con alguna discapacidad, lo que representa el 4.9% de la población total.",
    fuente: "Instituto Nacional de Estadística y Geografía. (2020). Censo de Población y Vivienda 2020: Principales resultados. INEGI. https://www.inegi.org.mx",
  },
  {
    emoji: "👁️",
    dato: "La dificultad para ver es la discapacidad más frecuente en México, afectando al 1.9% de la población, seguida por la dificultad para caminar o moverse (1.7%).",
    fuente: "Instituto Nacional de Estadística y Geografía. (2020). Censo de Población y Vivienda 2020: Tabulados de la muestra censal. INEGI. https://www.inegi.org.mx",
  },
  {
    emoji: "💼",
    dato: "En México, solo el 39.1% de las personas con discapacidad en edad de trabajar participa en el mercado laboral, frente al 64.7% de la población sin discapacidad.",
    fuente: "Instituto Nacional de Estadística y Geografía. (2021). Encuesta Nacional de Ingresos y Gastos de los Hogares (ENIGH) 2020. INEGI. https://www.inegi.org.mx",
  },
  {
    emoji: "🎓",
    dato: "El 45.3% de las personas con discapacidad en México de 15 años o más no concluyó la educación primaria, en comparación con el 20.1% de la población general.",
    fuente: "Consejo Nacional para el Desarrollo y la Inclusión de las Personas con Discapacidad. (2021). Diagnóstico sobre la situación de las personas con discapacidad en México. CONADIS. https://www.gob.mx/conadis",
  },
  {
    emoji: "🏠",
    dato: "El 51.7% de las personas con discapacidad en México se encuentra en situación de pobreza, y el 12.1% en pobreza extrema.",
    fuente: "Consejo Nacional de Evaluación de la Política de Desarrollo Social. (2022). Informe de pobreza y evaluación 2022. CONEVAL. https://www.coneval.org.mx",
  },
  {
    emoji: "👩‍⚕️",
    dato: "Solo el 37.8% de las personas con discapacidad en México cuenta con acceso a servicios de salud en instituciones del sector público.",
    fuente: "Instituto Nacional de Estadística y Geografía. (2020). Censo de Población y Vivienda 2020: Muestra censal, discapacidad. INEGI. https://www.inegi.org.mx",
  },
  {
    emoji: "🏙️",
    dato: "La Ciudad de México concentra la mayor proporción de personas con discapacidad en zona urbana del país, con 289 mil personas registradas.",
    fuente: "Instituto Nacional de Estadística y Geografía. (2020). Censo de Población y Vivienda 2020: Resultados por entidad federativa, Ciudad de México. INEGI. https://www.inegi.org.mx",
  },
  {
    emoji: "❤️",
    dato: "En México, el 87% del cuidado de personas con discapacidad recae en mujeres —madres, esposas o hijas— que en su mayoría no reciben remuneración económica por esta labor.",
    fuente: "Instituto Nacional de las Mujeres. (2022). Situación de las personas cuidadoras en México. Inmujeres. https://www.gob.mx/inmujeres",
  },
  {
    emoji: "♿",
    dato: "Solo el 25% de las estaciones del Metro de la Ciudad de México cuenta con infraestructura de accesibilidad completa para personas con discapacidad motriz.",
    fuente: "Sistema de Transporte Colectivo Metro. (2022). Informe anual de accesibilidad e inclusión. STC Metro CDMX. https://www.metro.cdmx.gob.mx",
  },
  {
    emoji: "📋",
    dato: "El 68% de las personas con discapacidad en México no conoce los programas gubernamentales a los que tiene derecho por ley.",
    fuente: "Consejo Nacional para el Desarrollo y la Inclusión de las Personas con Discapacidad. (2022). Encuesta Nacional sobre Discriminación (ENADIS 2022). CONADIS-CONAPRED. https://www.gob.mx/conadis",
  },
  {
    emoji: "👴",
    dato: "La discapacidad aumenta con la edad: el 35.7% de las personas mayores de 60 años en México presenta al menos una discapacidad o limitación funcional.",
    fuente: "Instituto Nacional de las Personas Adultas Mayores. (2022). Situación de las personas adultas mayores en México. INAPAM. https://www.gob.mx/inapam",
  },
  {
    emoji: "💪",
    dato: "Los programas de inclusión laboral para personas con discapacidad en México han generado más de 47 mil empleos formales entre 2019 y 2023.",
    fuente: "Secretaría del Trabajo y Previsión Social. (2023). Informe anual de empleo inclusivo 2023. STPS. https://www.gob.mx/stps",
  },
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
        <div className="relative flex items-center justify-center mb-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.97 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="w-full bg-white rounded-3xl p-8 sm:p-10 shadow-xl border-2 border-naranja-100 text-left"
            >
              {/* Emoji + dato */}
              <div className="flex items-start gap-5 mb-6">
                <span className="text-5xl flex-shrink-0 mt-1" aria-hidden="true">
                  {datos[current].emoji}
                </span>
                <p className="text-[19px] sm:text-[22px] font-black text-gray-900 leading-snug">
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
                  APA
                </span>
                <p className="text-[12px] text-gray-500 leading-relaxed font-mono italic">
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
