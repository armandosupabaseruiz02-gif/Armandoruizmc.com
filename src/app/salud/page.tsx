import type { Metadata } from "next";
import Link from "next/link";
import PageWrapper from "@/components/layout/PageWrapper";
import FadeIn, { StaggerContainer, StaggerItem } from "@/components/ui/FadeIn";
import { HeartPulse, ArrowLeft, Phone, ExternalLink, ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Gestiones de Salud",
  description: "Apoyos de salud para personas con discapacidad en CDMX: medicamentos, terapias, aparatos ortopédicos y más.",
};

const gestiones = [
  {
    titulo: "Medicamentos gratuitos",
    descripcion: "Las personas con discapacidad pueden acceder a medicamentos sin costo a través del IMSS Bienestar y la Secretaría de Salud CDMX.",
    pasos: ["Acude con tu médico de cabecera", "Solicita receta con diagnóstico de discapacidad", "Recoge los medicamentos en la farmacia del módulo asignado"],
    color: "bg-red-500",
    border: "border-red-100",
    bg: "bg-red-50",
    text: "text-red-600",
  },
  {
    titulo: "Aparatos ortopédicos y sillas de ruedas",
    descripcion: "El DIF CDMX y CRIT proporcionan sillas de ruedas, prótesis, muletas y otros aparatos a personas que los necesitan.",
    pasos: ["Solicita valoración médica en el DIF más cercano", "Presenta dictamen médico", "Espera asignación (aprox. 30 días hábiles)"],
    color: "bg-amber-600",
    border: "border-amber-100",
    bg: "bg-amber-50",
    text: "text-amber-700",
  },
  {
    titulo: "Terapias de rehabilitación",
    descripcion: "Fisioterapia, terapia ocupacional, lenguaje y psicología disponibles en Centros de Rehabilitación del gobierno CDMX.",
    pasos: ["Solicita cita en tu centro de salud", "Presenta identificación y CURP", "Asiste puntualmente a tus sesiones programadas"],
    color: "bg-emerald-600",
    border: "border-emerald-100",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
  },
  {
    titulo: "Consultas especializadas",
    descripcion: "Los Hospitales Generales de la CDMX cuentan con clínicas especializadas para personas con diferentes tipos de discapacidad.",
    pasos: ["Acude a tu médico familiar para referencia", "Agenda cita en el Hospital General correspondiente", "Lleva tu historial médico y estudios previos"],
    color: "bg-naranja-600",
    border: "border-naranja-100",
    bg: "bg-naranja-50",
    text: "text-naranja-700",
  },
];

const contactos = [
  { nombre: "DIF CDMX",               tel: "55 5605-0049", url: "https://dif.cdmx.gob.mx" },
  { nombre: "Secretaría de Salud CDMX", tel: "800 290 0024", url: "https://salud.cdmx.gob.mx" },
  { nombre: "CRIT (TELETÓN)",          tel: "55 5754-9000", url: "https://crit.org.mx" },
  { nombre: "IMSS Bienestar",          tel: "800 890 7900", url: "https://imss.gob.mx" },
];

export default function SaludPage() {
  return (
    <PageWrapper>
      {/* Hero */}
      <section className="relative bg-gray-900 pt-20 pb-28 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute inset-0 bg-grid-pattern opacity-30" />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full
                          bg-red-500/10 blur-[100px] translate-x-1/3 -translate-y-1/3" />
        </div>

        <div className="relative max-w-4xl mx-auto px-5 sm:px-8">
          <FadeIn>
            <Link href="/" className="inline-flex items-center gap-2 text-gray-300 hover:text-naranja-400
                                       text-[14px] font-medium transition-colors mb-8 group">
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Regresar al inicio
            </Link>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-red-500 flex items-center justify-center">
                <HeartPulse className="w-8 h-8 text-white" />
              </div>
              <span className="section-badge-dark">Salud</span>
            </div>

            <h1 className="text-[44px] sm:text-[60px] font-black text-white leading-tight tracking-tight mb-5">
              Gestiones de{" "}
              <span className="bg-gradient-to-r from-naranja-600 via-naranja-500 to-naranja-400 bg-clip-text text-transparent">Salud</span>
            </h1>
            <p className="text-[18px] sm:text-[20px] text-gray-200 leading-relaxed max-w-2xl">
              Aquí juntamos los apoyos médicos para personas con discapacidad en la CDMX:
              medicinas, terapias, aparatos y consultas. Te decimos qué hay y cómo conseguirlo.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Gestiones */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <FadeIn className="mb-14">
            <h2 className="text-[36px] sm:text-[44px] font-black text-gray-900 leading-tight">
              Apoyos disponibles
            </h2>
          </FadeIn>

          <StaggerContainer className="flex flex-col gap-6" stagger={0.1}>
            {gestiones.map((g) => (
              <StaggerItem key={g.titulo}>
                <div className={`p-8 rounded-card border-2 ${g.border} ${g.bg}`}>
                  <div className="flex items-start gap-4 mb-5">
                    <div className={`w-3 h-3 rounded-full ${g.color} flex-shrink-0 mt-2`} aria-hidden="true" />
                    <div className="flex-1">
                      <h3 className={`text-[22px] font-bold ${g.text} mb-2`}>{g.titulo}</h3>
                      <p className="text-[16px] text-gray-900 leading-relaxed">{g.descripcion}</p>
                    </div>
                  </div>
                  <div className="pl-7">
                    <p className="text-[13px] font-black text-gray-900 uppercase tracking-wide mb-3">Cómo acceder:</p>
                    <ol className="space-y-2">
                      {g.pasos.map((paso, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-[15px] text-gray-900">
                          <span className={`w-5 h-5 rounded-full ${g.color} text-white text-[11px]
                                           font-black flex items-center justify-center flex-shrink-0 mt-0.5`}>
                            {i + 1}
                          </span>
                          {paso}
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Contactos */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <FadeIn className="mb-12">
            <h2 className="text-[36px] sm:text-[44px] font-black text-white leading-tight">
              Contactos de salud importantes
            </h2>
          </FadeIn>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 gap-4" stagger={0.08}>
            {contactos.map((c) => (
              <StaggerItem key={c.nombre}>
                <div className="p-6 rounded-card bg-white/8 border border-white/15 hover:border-white/20
                                hover:bg-white/6 transition-all duration-300">
                  <h3 className="text-[17px] font-bold text-white mb-3">{c.nombre}</h3>
                  <a href={`tel:${c.tel.replace(/\s/g,"")}`}
                     className="flex items-center gap-2 text-naranja-400 text-[15px] font-medium mb-2">
                    <Phone className="w-4 h-4" />
                    {c.tel}
                  </a>
                  <a href={c.url} target="_blank" rel="noopener noreferrer"
                     className="flex items-center gap-1.5 text-gray-300 hover:text-naranja-400
                                text-[13px] transition-colors">
                    <ExternalLink className="w-3.5 h-3.5" />
                    Sitio oficial
                  </a>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <FadeIn className="mt-14 text-center">
            <Link href="/" className="btn-secondary inline-flex">
              <ArrowLeft className="w-5 h-5" />
              Regresar al inicio
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* CTA Agendar Cita */}
      <section className="py-20 bg-naranja-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" aria-hidden="true" />
        <div className="relative max-w-3xl mx-auto px-5 sm:px-8 text-center">
          <FadeIn>
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-6">
              <HeartPulse className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-[36px] sm:text-[48px] font-black text-white leading-tight mb-4">
              ¿Necesitas orientación personalizada?
            </h2>
            <p className="text-[18px] text-white/90 mb-10 max-w-xl mx-auto">
              Agenda una cita con nuestro equipo especializado. Te ayudamos a acceder a los
              servicios de salud que te corresponden.
            </p>
            <Link href="/salud/agendar" className="inline-flex items-center gap-2
              min-h-[56px] px-10 bg-white text-naranja-700 font-bold text-[17px]
              rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1
              transition-all duration-200 active:scale-[0.97]">
              <ChevronRight className="w-5 h-5" />
              Agendar cita ahora
            </Link>
            <p className="text-white/70 text-[14px] mt-4">
              Lunes a viernes · 9:00 – 17:00 · Presencial o en línea · Gratuito
            </p>
          </FadeIn>
        </div>
      </section>
    </PageWrapper>
  );
}
