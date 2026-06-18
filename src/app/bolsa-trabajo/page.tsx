import type { Metadata } from "next";
import Link from "next/link";
import PageWrapper from "@/components/layout/PageWrapper";
import FadeIn, { StaggerContainer, StaggerItem } from "@/components/ui/FadeIn";
import InternalRequestButton from "@/components/ui/InternalRequestButton";
import { Briefcase, ArrowLeft, MapPin, Clock, Building, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Bolsa de Trabajo | Armando Ruiz Diputado",
  description: "Empleos inclusivos para personas con discapacidad en el Estado de México. Empresas comprometidas con la inclusión laboral.",
};

const vacantes = [
  {
    puesto: "Atención al Cliente",
    empresa: "Empresa afiliada (confidencial)",
    ubicacion: "Benito Juárez, CDMX",
    tipo: "Tiempo completo",
    descripcion: "Atención telefónica y por chat. No requiere movilidad. Capacitación incluida.",
    discapacidad: "Motriz / Visual parcial",
    tag: "Disponible",
    tagColor: "bg-emerald-500",
  },
  {
    puesto: "Capturista de Datos",
    empresa: "Gobierno CDMX",
    ubicacion: "Cuauhtémoc, CDMX",
    tipo: "Medio tiempo",
    descripcion: "Registro y actualización de bases de datos. Instalaciones accesibles. Contrato por honorarios.",
    discapacidad: "Motriz",
    tag: "Disponible",
    tagColor: "bg-emerald-500",
  },
  {
    puesto: "Auxiliar de Archivo",
    empresa: "Institución pública",
    ubicacion: "Miguel Hidalgo, CDMX",
    tipo: "Tiempo completo",
    descripcion: "Clasificación y digitalización de documentos. Trabajo en oficina con acceso en silla de ruedas.",
    discapacidad: "Motriz / Auditiva",
    tag: "Disponible",
    tagColor: "bg-emerald-500",
  },
  {
    puesto: "Diseñador Gráfico Junior",
    empresa: "Agencia creativa",
    ubicacion: "Remoto / CDMX",
    tipo: "Tiempo completo",
    descripcion: "Diseño de materiales digitales e impresos. Trabajo 100% remoto disponible.",
    discapacidad: "Motriz / Auditiva / Visual parcial",
    tag: "Disponible",
    tagColor: "bg-emerald-500",
  },
  {
    puesto: "Representante de Ventas Telefónicas",
    empresa: "Empresa de telecomunicaciones",
    ubicacion: "Remoto",
    tipo: "Tiempo completo",
    descripcion: "Ventas y soporte por teléfono. Excelente remuneración con comisiones. Capacitación pagada.",
    discapacidad: "Motriz / Visual parcial",
    tag: "Próximamente",
    tagColor: "bg-naranja-500",
  },
  {
    puesto: "Programador Web",
    empresa: "Startup tecnológica",
    ubicacion: "Remoto",
    tipo: "Freelance / Tiempo completo",
    descripcion: "Desarrollo de páginas web. Conocimiento de HTML, CSS y JavaScript. Trabajo 100% remoto.",
    discapacidad: "Motriz / Auditiva / Visual parcial",
    tag: "Próximamente",
    tagColor: "bg-naranja-500",
  },
];

export default function BolsaTrabajoPage() {
  return (
    <PageWrapper>
      {/* Hero */}
      <section className="relative bg-gray-900 pt-20 pb-28 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute inset-0 bg-grid-pattern opacity-30" />
          <div className="absolute top-1/2 right-0 w-[500px] h-[500px] rounded-full
                          bg-emerald-500/10 blur-[100px] translate-x-1/3 -translate-y-1/2" />
        </div>

        <div className="relative max-w-4xl mx-auto px-5 sm:px-8">
          <FadeIn>
            <Link href="/" className="inline-flex items-center gap-2 text-gray-300 hover:text-naranja-400
                                       text-[14px] font-medium transition-colors mb-8 group">
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Regresar al inicio
            </Link>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-emerald-600 flex items-center justify-center">
                <Briefcase className="w-8 h-8 text-white" />
              </div>
              <span className="section-badge-dark">Bolsa de Trabajo</span>
            </div>

            <h1 className="text-[44px] sm:text-[60px] font-black text-white leading-tight tracking-tight mb-5">
              Empleo{" "}
              <span className="bg-gradient-to-r from-naranja-600 via-naranja-500 to-naranja-400 bg-clip-text text-transparent">Inclusivo</span>
            </h1>
            <p className="text-[18px] sm:text-[20px] text-gray-200 leading-relaxed max-w-2xl">
              Vacantes de empleos dignos para personas con discapacidad en el Estado de México.
              Empresas comprometidas con la inclusión laboral real.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Vacantes */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <FadeIn className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-12">
            <h2 className="text-[36px] sm:text-[44px] font-black text-gray-900 leading-tight">
              Vacantes actuales
            </h2>
            <p className="text-[14px] text-gray-900 bg-gray-50 border border-gray-200 rounded-pill px-4 py-2">
              Actualizado por el equipo del Diputado Armando Ruiz
            </p>
          </FadeIn>

          <StaggerContainer className="flex flex-col gap-5" stagger={0.07}>
            {vacantes.map((v) => (
              <StaggerItem key={v.puesto + v.empresa}>
                <div className="p-7 rounded-card border border-gray-100 hover:border-naranja-200
                                hover:shadow-card bg-white transition-all duration-300 group">
                  <div className="flex flex-wrap items-start gap-3 mb-4">
                    <div className="flex-1">
                      <h3 className="text-[20px] font-bold text-gray-900 mb-1">{v.puesto}</h3>
                      <div className="flex flex-wrap items-center gap-3 text-[14px] text-gray-900">
                        <span className="flex items-center gap-1.5">
                          <Building className="w-3.5 h-3.5 text-naranja-400" />
                          {v.empresa}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-naranja-400" />
                          {v.ubicacion}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-naranja-400" />
                          {v.tipo}
                        </span>
                      </div>
                    </div>
                    <span className={`${v.tagColor} text-white text-[12px] font-black px-3 py-1 rounded-full`}>
                      {v.tag}
                    </span>
                  </div>

                  <p className="text-[15px] text-gray-900 leading-relaxed mb-4">{v.descripcion}</p>

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="text-[12px] bg-emerald-50 text-emerald-700 border border-emerald-200
                                     rounded-full px-3 py-1 font-semibold">
                      ♿ Apta para: {v.discapacidad}
                    </span>
                    <InternalRequestButton
                      requestType="job_application"
                      subject={`Postulación: ${v.puesto}`}
                      triggerLabel="Postularme"
                      title={`Postularme a ${v.puesto}`}
                      description="Deja tus datos dentro del portal para que el equipo revise tu interés en esta vacante."
                      messageLabel="Cuéntanos tu experiencia o habilidades"
                      messagePlaceholder="Ej. Tengo experiencia en atención al cliente, puedo trabajar por teléfono..."
                      organizationLabel="Empresa actual o última experiencia"
                      metadata={{
                        puesto: v.puesto,
                        empresa: v.empresa,
                        ubicacion: v.ubicacion,
                        tipo: v.tipo,
                        discapacidad: v.discapacidad,
                      }}
                      className="inline-flex items-center gap-1.5 text-naranja-600 hover:text-naranja-700
                                 font-semibold text-[14px] transition-colors group-hover:underline"
                    >
                      Postularme
                      <ArrowRight className="w-3.5 h-3.5" />
                    </InternalRequestButton>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          {/* CTA Empresa */}
          <FadeIn className="mt-14 p-8 rounded-card bg-gray-900 text-center border border-white/8">
            <p className="text-white font-bold text-[22px] mb-3">¿Eres empresa y quieres publicar una vacante?</p>
            <p className="text-gray-300 text-[15px] mb-6 max-w-xl mx-auto">
              Únete a nuestro programa de empresas accesibles. El Diputado Armando Ruiz
              conecta tu empresa con talento comprometido.
            </p>
            <InternalRequestButton
              requestType="vacancy_registration"
              subject="Registro de vacante inclusiva"
              triggerLabel="Registrar vacante"
              title="Registrar una vacante"
              description="Carga los datos de tu empresa dentro del portal para que el equipo revise la vacante."
              messageLabel="Describe la vacante"
              messagePlaceholder="Puesto, horario, sueldo aproximado, ubicación, ajustes razonables y contacto interno."
              organizationLabel="Nombre de la empresa"
              requireOrganization
              className="btn-primary inline-flex"
            />
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
