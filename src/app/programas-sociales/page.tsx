import type { Metadata } from "next";
import Link from "next/link";
import PageWrapper from "@/components/layout/PageWrapper";
import FadeIn, { StaggerContainer, StaggerItem } from "@/components/ui/FadeIn";
import { ScrollText, ArrowLeft, Users, ExternalLink, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Programas Sociales | Armando Ruiz Diputado",
  description: "Catálogo de programas sociales gubernamentales para personas con discapacidad en CDMX.",
};

const programas = [
  {
    nombre: "Pensión para Personas con Discapacidad",
    dependencia: "Gobierno CDMX / SIBISO",
    monto: "$1,900 mensuales",
    beneficio: "Apoyo económico mensual directo para personas con discapacidad permanente.",
    requisitos: ["Ser residente de CDMX", "Tener discapacidad permanente documentada", "No recibir otra pensión gubernamental", "CURP e identificación oficial"],
    color: "border-naranja-200 bg-naranja-50",
    tag: "bg-naranja-500",
  },
  {
    nombre: "Beca para Estudiantes con Discapacidad",
    dependencia: "SEP / Bienestar",
    monto: "$1,600 bimestrales",
    beneficio: "Apoyo económico para continuar o reincorporarse a estudios de básica, media y superior.",
    requisitos: ["Estar inscrito en escuela pública", "Tener discapacidad certificada", "CURP y comprobante de estudios"],
    color: "border-blue-200 bg-blue-50",
    tag: "bg-blue-600",
  },
  {
    nombre: "Programa Inclúyeme – Empleo con Apoyo",
    dependencia: "STyFE CDMX",
    monto: "Salario completo + capacitación",
    beneficio: "Apoyo para inserción laboral formal con tutores que acompañan el proceso de integración.",
    requisitos: ["Persona con discapacidad en búsqueda de empleo", "Deseo de integrarse a vida laboral", "CURP e identificación"],
    color: "border-emerald-200 bg-emerald-50",
    tag: "bg-emerald-600",
  },
  {
    nombre: "Apoyo Económico a Cuidadores",
    dependencia: "SIBISO CDMX",
    monto: "$1,900 mensuales",
    beneficio: "Para familiares que cuidan de tiempo completo a personas con discapacidad severa.",
    requisitos: ["Ser cuidador primario de persona con discapacidad severa", "No recibir otro apoyo del mismo programa", "Comprobante domicilio CDMX"],
    color: "border-violet-200 bg-violet-50",
    tag: "bg-violet-600",
  },
  {
    nombre: "Apoyo para Adaptación de Vivienda",
    dependencia: "INVI CDMX",
    monto: "Hasta $60,000",
    beneficio: "Recursos para adaptar el hogar: rampas, barandales, baños accesibles, puertas anchas.",
    requisitos: ["Persona con discapacidad motriz o adulto mayor", "Ser propietario o arrendatario con contrato", "Vivienda en CDMX con escrituras o contrato"],
    color: "border-teal-200 bg-teal-50",
    tag: "bg-teal-600",
  },
  {
    nombre: "Seguro de Desempleo para Personas con Discapacidad",
    dependencia: "STyFE CDMX",
    monto: "$1,500 durante 6 meses",
    beneficio: "Apoyo temporal para personas con discapacidad que perdieron su empleo formal.",
    requisitos: ["Haber cotizado al IMSS", "Comprobante de baja laboral", "Residencia CDMX", "Tener discapacidad certificada"],
    color: "border-red-200 bg-red-50",
    tag: "bg-red-600",
  },
];

export default function ProgramasSocialesPage() {
  return (
    <PageWrapper>
      {/* Hero */}
      <section className="relative bg-ink-950 pt-20 pb-28 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute inset-0 bg-grid-pattern opacity-30" />
          <div className="absolute bottom-0 left-1/2 w-[600px] h-[400px] rounded-full
                          bg-blue-500/10 blur-[100px] -translate-x-1/2" />
        </div>
        <div className="relative max-w-4xl mx-auto px-5 sm:px-8">
          <FadeIn>
            <Link href="/" className="inline-flex items-center gap-2 text-white/40 hover:text-naranja-400
                                       text-[14px] font-medium transition-colors mb-8 group">
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Regresar al inicio
            </Link>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center">
                <ScrollText className="w-8 h-8 text-white" />
              </div>
              <span className="section-badge-dark">Programas Sociales</span>
            </div>

            <h1 className="text-[44px] sm:text-[60px] font-black text-white leading-tight tracking-tight mb-5">
              Programas del{" "}
              <span className="text-gradient">Gobierno CDMX</span>
            </h1>
            <p className="text-[18px] sm:text-[20px] text-white/55 leading-relaxed max-w-2xl">
              Catálogo de programas sociales disponibles para personas con discapacidad
              y sus familias en la Ciudad de México. Conoce a cuáles tienes derecho.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Programas */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <FadeIn className="mb-14 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-[36px] sm:text-[44px] font-black text-ink-900 leading-tight">
              Programas disponibles
            </h2>
            <div className="flex items-center gap-2 text-[14px] text-ink-500 bg-naranja-50
                            border border-naranja-200 rounded-pill px-4 py-2">
              <Users className="w-4 h-4 text-naranja-500" />
              {programas.length} programas activos
            </div>
          </FadeIn>

          <StaggerContainer className="flex flex-col gap-6" stagger={0.08}>
            {programas.map((p) => (
              <StaggerItem key={p.nombre}>
                <div className={`p-8 rounded-card border-2 ${p.color}`}>
                  <div className="flex flex-wrap items-start gap-3 mb-5">
                    <h3 className="text-[22px] font-bold text-ink-900 flex-1 leading-snug">{p.nombre}</h3>
                    <span className={`${p.tag} text-white text-[11px] font-black px-3 py-1 rounded-full whitespace-nowrap`}>
                      {p.monto}
                    </span>
                  </div>

                  <p className="text-[13px] text-ink-400 font-semibold uppercase tracking-wide mb-2">
                    {p.dependencia}
                  </p>
                  <p className="text-[16px] text-ink-600 leading-relaxed mb-5">{p.beneficio}</p>

                  <div>
                    <p className="text-[13px] font-black text-ink-400 uppercase tracking-wide mb-3">Requisitos:</p>
                    <ul className="space-y-1.5">
                      {p.requisitos.map((r) => (
                        <li key={r} className="flex items-center gap-2 text-[15px] text-ink-600">
                          <CheckCircle2 className="w-4 h-4 text-naranja-400 flex-shrink-0" />
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <FadeIn className="mt-14 p-6 rounded-card bg-ink-950 border border-white/8 text-center">
            <p className="text-white/60 text-[15px] mb-4">
              ¿Necesitas ayuda para aplicar a alguno de estos programas? El equipo del
              Diputado Armando Ruiz puede orientarte gratuitamente.
            </p>
            <a href="mailto:contacto@armandoruiz.mx"
               className="btn-primary inline-flex">
              Solicitar orientación
              <ExternalLink className="w-4 h-4" />
            </a>
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
