import type { Metadata } from "next";
import Link from "next/link";
import PageWrapper from "@/components/layout/PageWrapper";
import InternalRequestButton from "@/components/ui/InternalRequestButton";
import {
  ArrowLeft, Accessibility, Check, Keyboard, Eye,
  Type, MousePointer2, Video,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Accesibilidad",
  description:
    "Declaración de Accesibilidad del portal del Diputado Armando Ruiz. Nuestro compromiso con un sitio usable para todas las personas.",
};

/* Logros de accesibilidad ya implementados en el sitio */
const logros = [
  { icon: Type, texto: "Tipografía Atkinson Hyperlegible, diseñada para máxima legibilidad y baja visión." },
  { icon: Eye, texto: "Alto contraste de texto y modo de movimiento reducido (respeta «prefers-reduced-motion»)." },
  { icon: Keyboard, texto: "Navegación completa por teclado, enlace «Ir al contenido» y foco siempre visible." },
  { icon: MousePointer2, texto: "Botones y áreas de toque grandes (mínimo 44–56 px), pensados para todas las manos." },
  { icon: Video, texto: "Citas de asesoría en línea, para que nadie tenga que desplazarse si no puede." },
  { icon: Accessibility, texto: "Textos alternativos y etiquetas para lectores de pantalla en elementos interactivos." },
];

/* En desarrollo — coincide con el roadmap de PENDIENTES.md */
const enProgreso = [
  "Certificación formal WCAG 2.1 nivel AA.",
  "Barra de accesibilidad (aumentar texto, alto contraste, modo lectura).",
  "Versiones en lectura fácil y videos en Lengua de Señas Mexicana (LSM).",
];

export default function AccesibilidadPage() {
  return (
    <PageWrapper>
      {/* Hero */}
      <section className="relative bg-gray-900 pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" aria-hidden="true" />
        <div className="relative max-w-3xl mx-auto px-5 sm:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-300 hover:text-naranja-400
                       text-[14px] font-medium transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Regresar al inicio
          </Link>

          <div className="flex items-center gap-4 mb-5">
            <div className="w-14 h-14 rounded-2xl bg-naranja-500 flex items-center justify-center flex-shrink-0">
              <Accessibility className="w-7 h-7 text-white" aria-hidden="true" />
            </div>
            <span className="section-badge-dark">Accesibilidad</span>
          </div>

          <h1 className="text-[36px] sm:text-[48px] font-black text-white leading-tight">
            Declaración de Accesibilidad
          </h1>
          <p className="text-[17px] text-gray-200 mt-4 max-w-2xl leading-relaxed">
            La accesibilidad no es un extra: es el centro de este proyecto. Trabajamos para que
            cualquier persona, con o sin discapacidad, pueda usar este portal con dignidad y autonomía.
          </p>
        </div>
      </section>

      {/* Contenido */}
      <section className="py-14 bg-warm-50">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 space-y-14">

          {/* Compromiso */}
          <div>
            <h2 className="text-[26px] sm:text-[30px] font-black text-gray-900 mb-4 leading-tight">
              Nuestro compromiso
            </h2>
            <p className="text-[16px] text-gray-800 leading-relaxed">
              Nos esforzamos por cumplir las <strong>Pautas de Accesibilidad para el Contenido Web
              (WCAG) 2.1, nivel AA</strong>. Es un trabajo continuo: mejoramos el sitio de forma
              constante y escuchamos a quienes lo usan.
            </p>
          </div>

          {/* Lo que ya hacemos */}
          <div>
            <h2 className="text-[26px] sm:text-[30px] font-black text-gray-900 mb-6 leading-tight">
              Lo que ya hacemos
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {logros.map((l) => {
                const Icon = l.icon;
                return (
                  <li
                    key={l.texto}
                    className="flex items-start gap-4 p-5 rounded-card border-2 border-naranja-100 bg-white shadow-card"
                  >
                    <span className="w-11 h-11 rounded-xl bg-naranja-100 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-naranja-600" aria-hidden="true" />
                    </span>
                    <span className="text-[15px] text-gray-800 leading-relaxed">{l.texto}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* En lo que trabajamos */}
          <div>
            <h2 className="text-[26px] sm:text-[30px] font-black text-gray-900 mb-6 leading-tight">
              En lo que estamos trabajando
            </h2>
            <ul className="space-y-3">
              {enProgreso.map((t) => (
                <li key={t} className="flex items-start gap-3 text-[16px] text-gray-800 leading-relaxed">
                  <Check className="w-5 h-5 text-naranja-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  {t}
                </li>
              ))}
            </ul>
          </div>

          {/* Reportar un problema */}
          <div className="rounded-card border-2 border-naranja-200 bg-white shadow-card p-7 sm:p-8">
            <h2 className="text-[22px] sm:text-[26px] font-black text-gray-900 mb-3 leading-tight">
              ¿Encontraste una barrera?
            </h2>
            <p className="text-[16px] text-gray-800 leading-relaxed mb-5">
              Tu experiencia nos ayuda a mejorar. Si algo te resultó difícil de usar, por favor
              cuéntanos qué pasó y con qué dispositivo, y lo resolveremos lo antes posible.
            </p>
            <InternalRequestButton
              requestType="accessibility"
              subject="Reporte de accesibilidad"
              triggerLabel="Reportar un problema"
              title="Reportar una barrera de accesibilidad"
              description="Cuéntanos dentro del portal qué falló para que el equipo pueda revisarlo."
              messageLabel="¿Qué problema encontraste?"
              messagePlaceholder="Página, botón, dispositivo, lector de pantalla o navegador usado."
              className="btn-primary inline-flex"
            >
              <Accessibility className="w-5 h-5" aria-hidden="true" />
              Reportar un problema
            </InternalRequestButton>
          </div>

          <div>
            <Link href="/" className="btn-secondary inline-flex">
              <ArrowLeft className="w-5 h-5" />
              Regresar al inicio
            </Link>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}
