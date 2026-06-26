import type { Metadata } from "next";
import Link from "next/link";
import PageWrapper from "@/components/layout/PageWrapper";
import FadeIn, { StaggerContainer, StaggerItem } from "@/components/ui/FadeIn";
import OrientationBot from "@/components/sections/OrientationBot";
import { ScrollText, ArrowLeft, Users, CheckCircle2, ExternalLink, MapPin, Info } from "lucide-react";

export const metadata: Metadata = {
  title: "Programas Sociales",
  description: "Programas y apoyos públicos para personas con discapacidad en México: federales, del Estado de México y de la Ciudad de México. Te informamos y te llevamos al sitio oficial donde se tramita.",
};

// Cada programa redirige al SITIO OFICIAL de la dependencia que lo otorga.
// El portal del diputado solo informa y orienta; no entrega estos apoyos.
// Datos y enlaces verificados contra fuentes oficiales (gob.mx, edomex.gob.mx, cdmx.gob.mx).
const programas = [
  {
    nombre: "Pensión para el Bienestar de las Personas con Discapacidad",
    dependencia: "Secretaría de Bienestar · Gobierno de México",
    alcance: "Nacional",
    monto: "$3,300 bimestrales",
    beneficio: "Apoyo económico directo y sin intermediarios para personas con discapacidad permanente, depositado en la tarjeta del Banco del Bienestar.",
    requisitos: ["Identificación oficial vigente", "CURP y acta de nacimiento", "Comprobante de domicilio", "Certificado o constancia médica de discapacidad permanente de una institución pública"],
    url: "https://programasparaelbienestar.gob.mx/pension-bienestar-personas-con-discapacidad/",
    color: "border-naranja-200 bg-naranja-50",
    tag: "bg-naranja-500",
  },
  {
    nombre: "Beca para el Bienestar Benito Juárez",
    dependencia: "Coordinación Nacional de Becas para el Bienestar Benito Juárez · SEP",
    alcance: "Nacional",
    monto: "Según nivel y convocatoria",
    beneficio: "Apoyo económico para estudiantes de escuelas públicas; da prioridad a estudiantes con discapacidad para iniciar o continuar sus estudios.",
    requisitos: ["Estar inscrito en una escuela pública", "CURP y comprobante de estudios", "Cumplir la convocatoria vigente"],
    url: "https://www.gob.mx/becasbenitojuarez",
    color: "border-amber-200 bg-amber-50",
    tag: "bg-amber-600",
  },
  {
    nombre: "Abriendo Espacios · Empleo para personas con discapacidad",
    dependencia: "Servicio Nacional de Empleo · STPS",
    alcance: "Nacional",
    monto: "Vinculación laboral gratuita",
    beneficio: "Atención personalizada para encontrar empleo formal y un portal de empleo accesible compatible con lectores de pantalla. Línea gratuita 800 841 2020.",
    requisitos: ["Ser persona con discapacidad en búsqueda de empleo", "Registrarte en el portal o llamar al Servicio Nacional de Empleo"],
    url: "https://www.gob.mx/stps/articulos/abriendo-espacios-miles-de-ofertas-laborales-para-personas-con-discapacidad-y-adultos-mayores",
    color: "border-emerald-200 bg-emerald-50",
    tag: "bg-emerald-600",
  },
  {
    nombre: "DIF Estado de México · Ayudas funcionales y rehabilitación",
    dependencia: "DIF Estado de México (DIFEM)",
    alcance: "Estado de México",
    monto: "Apoyos en especie",
    beneficio: "Aparatos funcionales (sillas de ruedas, andaderas, auxiliares auditivos), rehabilitación e inclusión social para residentes del Estado de México.",
    requisitos: ["Residir en el Estado de México", "Acreditar la discapacidad o necesidad", "Acudir al DIF municipal o CREE más cercano"],
    url: "https://difem.edomex.gob.mx/personasdis_apoyos",
    color: "border-teal-200 bg-teal-50",
    tag: "bg-teal-600",
  },
  {
    nombre: "INDISCAPACIDAD CDMX · Apoyos, empleo y servicios",
    dependencia: "Instituto de las Personas con Discapacidad de la CDMX",
    alcance: "Ciudad de México",
    monto: "Varios apoyos",
    beneficio: "Apoyo económico, empleo (Empodera-T), transporte gratuito y servicios de salud para personas con discapacidad en la Ciudad de México.",
    requisitos: ["Vivir en la Ciudad de México", "Acreditar la discapacidad", "Realizar el trámite en la Ventanilla Única de Discapacidad"],
    url: "https://www.indiscapacidad.cdmx.gob.mx/tramites-y-servicios",
    color: "border-rose-200 bg-rose-50",
    tag: "bg-rose-500",
  },
];

export default function ProgramasSocialesPage() {
  return (
    <PageWrapper>
      {/* Hero */}
      <section className="relative bg-gray-900 pt-20 pb-28 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute inset-0 bg-grid-pattern opacity-30" />
          <div className="absolute bottom-0 left-1/2 w-[600px] h-[400px] rounded-full
                          bg-naranja-500/10 blur-[100px] -translate-x-1/2" />
        </div>
        <div className="relative max-w-4xl mx-auto px-5 sm:px-8">
          <FadeIn>
            <Link href="/" className="inline-flex items-center gap-2 text-gray-300 hover:text-naranja-400
                                       text-[14px] font-medium transition-colors mb-8 group">
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Regresar al inicio
            </Link>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-naranja-500 flex items-center justify-center">
                <ScrollText className="w-8 h-8 text-white" />
              </div>
              <span className="section-badge-dark">Programas Sociales</span>
            </div>

            <h1 className="text-[44px] sm:text-[60px] font-black text-white leading-tight tracking-tight mb-5">
              Programas del{" "}
              <span className="bg-gradient-to-r from-naranja-600 via-naranja-500 to-naranja-400 bg-clip-text text-transparent">Gobierno</span>
            </h1>
            <p className="text-[18px] sm:text-[20px] text-gray-200 leading-relaxed max-w-2xl">
              Apoyos públicos para personas con discapacidad y sus familias: federales,
              del Estado de México y de la Ciudad de México. Aquí te informamos y te
              llevamos al sitio oficial donde se realiza el trámite.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Programas */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <FadeIn className="mb-14 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-[36px] sm:text-[44px] font-black text-gray-900 leading-tight">
              Programas disponibles
            </h2>
            <div className="flex items-center gap-2 text-[14px] text-gray-900 bg-naranja-50
                            border border-naranja-200 rounded-pill px-4 py-2">
              <Users className="w-4 h-4 text-naranja-500" />
              {programas.length} programas activos
            </div>
          </FadeIn>

          {/* Aviso clave: el portal informa, la autoridad otorga */}
          <FadeIn className="mb-10">
            <div className="flex items-start gap-4 rounded-card border-2 border-naranja-300 bg-naranja-50 p-5">
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border-2 border-naranja-300 bg-white">
                <Info className="h-5 w-5 text-naranja-600" aria-hidden="true" />
              </div>
              <p className="text-[15px] sm:text-[16px] leading-relaxed text-gray-800">
                <strong className="font-black">Estos apoyos los otorgan las autoridades, no nosotros.</strong>{" "}
                Este portal te informa, te explica los requisitos y te lleva al{" "}
                <strong className="font-bold">sitio oficial</strong> de cada dependencia, donde se
                realiza el trámite. Si te atoras, puedes pedirnos orientación.
              </p>
            </div>
          </FadeIn>

          <StaggerContainer className="flex flex-col gap-6" stagger={0.08}>
            {programas.map((p) => (
              <StaggerItem key={p.nombre}>
                <div className={`p-8 rounded-card border-2 ${p.color}`}>
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-300 bg-white px-3 py-1 text-[12px] font-bold text-gray-700">
                      <MapPin className="h-3.5 w-3.5 text-naranja-500" aria-hidden="true" />
                      {p.alcance}
                    </span>
                    <span className={`${p.tag} text-white text-[12px] font-black px-3 py-1 rounded-full whitespace-nowrap`}>
                      {p.monto}
                    </span>
                  </div>

                  <h3 className="text-[22px] font-bold text-gray-900 leading-snug mb-2">{p.nombre}</h3>
                  <p className="text-[13px] text-gray-900 font-semibold uppercase tracking-wide mb-3">
                    {p.dependencia}
                  </p>
                  <p className="text-[16px] text-gray-900 leading-relaxed mb-5">{p.beneficio}</p>

                  <div className="mb-6">
                    <p className="text-[13px] font-black text-gray-900 uppercase tracking-wide mb-3">Requisitos:</p>
                    <ul className="space-y-1.5">
                      {p.requisitos.map((r) => (
                        <li key={r} className="flex items-start gap-2 text-[15px] text-gray-900">
                          <CheckCircle2 className="w-4 h-4 text-naranja-400 flex-shrink-0 mt-1" />
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary inline-flex w-full justify-center sm:w-auto"
                  >
                    Ir al sitio oficial para tramitar
                    <ExternalLink className="w-4 h-4" aria-hidden="true" />
                  </a>
                  <p className="mt-2 text-[13px] text-gray-600">
                    Se abre el sitio oficial de {p.dependencia.split(" · ")[0]}.
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <FadeIn className="mt-14">
            <p className="text-center text-gray-700 text-[16px] mb-5 max-w-2xl mx-auto">
              ¿Necesitas ayuda para aplicar a alguno de estos programas? Preguntale al bot y,
              si tu caso requiere revisar documentos, agenda una cita personal con el equipo.
            </p>
            <OrientationBot />
          </FadeIn>

          <FadeIn className="mt-8 text-center">
            <Link href="/" className="btn-outline inline-flex">
              <ArrowLeft className="w-5 h-5" />
              Regresar al inicio
            </Link>
          </FadeIn>
        </div>
      </section>
    </PageWrapper>
  );
}
