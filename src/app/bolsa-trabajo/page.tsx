import type { Metadata } from "next";
import Link from "next/link";
import PageWrapper from "@/components/layout/PageWrapper";
import FadeIn from "@/components/ui/FadeIn";
import InternalRequestButton from "@/components/ui/InternalRequestButton";
import { Briefcase, ArrowLeft, ExternalLink, Info, BellRing } from "lucide-react";

export const metadata: Metadata = {
  title: "Bolsa de Trabajo",
  description: "Bolsa de trabajo que conecta a personas con discapacidad con vacantes que comparten empresas. El Diputado no contrata: publica y conecta.",
};

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
              Bolsa de{" "}
              <span className="bg-gradient-to-r from-naranja-600 via-naranja-500 to-naranja-400 bg-clip-text text-transparent">Trabajo</span>
            </h1>
            <p className="text-[18px] sm:text-[20px] text-gray-200 leading-relaxed max-w-2xl">
              Aquí conectamos a personas con discapacidad con vacantes que comparten
              empresas e instituciones. <strong className="text-white font-bold">El Diputado no
              contrata ni garantiza el empleo: publica las vacantes y te conecta.</strong>
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Vacantes */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <FadeIn>
            <h2 className="text-[36px] sm:text-[44px] font-black text-gray-900 leading-tight mb-6">
              Vacantes
            </h2>
          </FadeIn>

          {/* Aviso: la información la dan las empresas */}
          <FadeIn className="mb-8">
            <div className="flex items-start gap-4 rounded-card border-2 border-naranja-300 bg-naranja-50 p-5">
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border-2 border-naranja-300 bg-white">
                <Info className="h-5 w-5 text-naranja-600" aria-hidden="true" />
              </div>
              <p className="text-[15px] sm:text-[16px] leading-relaxed text-gray-800">
                La información de cada vacante es <strong className="font-bold">otorgada por la
                empresa o institución que la publica</strong>. El equipo del Diputado Armando Ruiz
                no contrata ni garantiza el empleo; solo publica la vacante y te conecta con quien
                la ofrece.
              </p>
            </div>
          </FadeIn>

          {/* Estado honesto: aún no hay vacantes reales publicadas */}
          <FadeIn>
            <div className="rounded-card border-2 border-dashed border-gray-300 bg-warm-50 p-8 text-center">
              <h3 className="text-[22px] font-black text-gray-900 mb-2">
                Por ahora no hay vacantes publicadas
              </h3>
              <p className="text-[16px] text-gray-700 leading-relaxed max-w-xl mx-auto mb-6">
                En cuanto las empresas compartan vacantes verificadas, las verás aquí. Mientras
                tanto, puedes dejar tu perfil para avisarte, o buscar en la bolsa nacional de empleo
                para personas con discapacidad.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <InternalRequestButton
                  requestType="job_application"
                  subject="Quiero que me avisen de vacantes accesibles"
                  triggerLabel="Dejar mi perfil"
                  title="Dejar mi perfil de empleo"
                  description="Deja tus datos dentro del portal para que el equipo te avise cuando haya una vacante que se ajuste a ti."
                  messageLabel="Cuéntanos tu experiencia o habilidades"
                  messagePlaceholder="Ej. Tengo experiencia en atención al cliente, puedo trabajar por teléfono o de forma remota…"
                  organizationLabel="Empresa actual o última experiencia"
                  className="btn-primary inline-flex"
                >
                  <BellRing className="w-5 h-5" aria-hidden="true" />
                  Dejar mi perfil
                </InternalRequestButton>
                <a
                  href="https://www.gob.mx/stps/articulos/abriendo-espacios-miles-de-ofertas-laborales-para-personas-con-discapacidad-y-adultos-mayores"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary inline-flex"
                >
                  Buscar en Abriendo Espacios (STPS)
                  <ExternalLink className="w-4 h-4" aria-hidden="true" />
                </a>
              </div>
            </div>
          </FadeIn>

          {/* CTA Empresa */}
          <FadeIn className="mt-14 p-8 rounded-card bg-gray-900 text-center border border-white/8">
            <p className="text-white font-bold text-[22px] mb-3">¿Eres empresa y quieres publicar una vacante?</p>
            <p className="text-gray-300 text-[15px] mb-6 max-w-xl mx-auto">
              Comparte tu vacante accesible con nosotros. La publicamos en esta bolsa y la
              conectamos con personas con discapacidad que buscan empleo digno.
            </p>
            <InternalRequestButton
              requestType="vacancy_registration"
              subject="Registro de vacante accesible"
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
