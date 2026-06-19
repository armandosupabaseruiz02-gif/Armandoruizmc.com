import type { Metadata } from "next";
import Link from "next/link";
import PageWrapper from "@/components/layout/PageWrapper";
import FadeIn from "@/components/ui/FadeIn";
import InternalRequestButton from "@/components/ui/InternalRequestButton";
import { Handshake, ArrowLeft, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Aliados",
  description: "Red de aliados del Diputado Armando Ruiz: organizaciones, fundaciones y empresas comprometidas con la inclusión.",
};

export default function AliadosPage() {
  return (
    <PageWrapper>
      {/* Hero */}
      <section className="relative bg-gray-900 pt-20 pb-28 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute inset-0 bg-grid-pattern opacity-30" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                          w-[600px] h-[400px] rounded-full bg-teal-500/10 blur-[100px]" />
        </div>

        <div className="relative max-w-4xl mx-auto px-5 sm:px-8">
          <FadeIn>
            <Link href="/" className="inline-flex items-center gap-2 text-gray-300 hover:text-naranja-400
                                       text-[14px] font-medium transition-colors mb-8 group">
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Regresar al inicio
            </Link>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-teal-600 flex items-center justify-center">
                <Handshake className="w-8 h-8 text-white" />
              </div>
              <span className="section-badge-dark">Aliados</span>
            </div>

            <h1 className="text-[44px] sm:text-[60px] font-black text-white leading-tight tracking-tight mb-5">
              Red de{" "}
              <span className="bg-gradient-to-r from-naranja-600 via-naranja-500 to-naranja-400 bg-clip-text text-transparent">Aliados</span>
            </h1>
            <p className="text-[18px] sm:text-[20px] text-gray-200 leading-relaxed max-w-2xl">
              Construimos una red de organizaciones, fundaciones y empresas comprometidas
              con la inclusión y los derechos de las personas con discapacidad en la Ciudad de México.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Contenido */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">

          {/* Próximamente */}
          <FadeIn className="text-center py-20">
            <div className="w-24 h-24 rounded-full bg-teal-50 border-2 border-teal-200
                            flex items-center justify-center mx-auto mb-8">
              <Handshake className="w-10 h-10 text-teal-600" />
            </div>
            <h2 className="text-[32px] font-black text-gray-900 mb-4">
              Próximamente
            </h2>
            <p className="text-[18px] text-gray-900 max-w-xl mx-auto leading-relaxed mb-10">
              Estamos construyendo nuestra red de aliados. Si tu organización, fundación
              o empresa quiere unirse al movimiento por la inclusión, contáctanos.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <InternalRequestButton
                requestType="ally"
                subject="Solicitud para ser aliado"
                triggerLabel="Quiero ser aliado"
                title="Quiero ser aliado"
                description="Deja los datos de tu organización dentro del portal para que el equipo revise la alianza."
                messageLabel="Cuéntanos cómo quieres colaborar"
                messagePlaceholder="Describe tu organización, a quién atienden y qué tipo de colaboración proponen."
                organizationLabel="Organización, fundación o empresa"
                requireOrganization
                className="btn-primary inline-flex"
              >
                <Handshake className="w-5 h-5" />
                Quiero ser aliado
              </InternalRequestButton>
              <Link href="/" className="btn-outline inline-flex">
                <ArrowLeft className="w-5 h-5" />
                Regresar al inicio
              </Link>
            </div>
          </FadeIn>

          {/* Tipos de aliados que buscamos */}
          <FadeIn>
            <div className="p-10 rounded-card bg-gray-900 border border-white/8">
              <h3 className="text-[26px] font-black text-white mb-8 text-center">
                ¿Qué tipo de aliados buscamos?
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                  { tipo: "Organizaciones de la Sociedad Civil", desc: "OSC y fundaciones que trabajen en favor de personas con discapacidad.", icon: "🤝" },
                  { tipo: "Empresas Accesibles", desc: "Empresas que contraten personas con discapacidad y promuevan la diversidad.", icon: "🏢" },
                  { tipo: "Instituciones Académicas", desc: "Universidades y centros de investigación interesados en políticas de inclusión.", icon: "🎓" },
                ].map((a) => (
                  <div key={a.tipo} className="p-6 rounded-2xl bg-white/4 border border-white/8 text-center">
                    <div className="text-4xl mb-4">{a.icon}</div>
                    <h4 className="text-[16px] font-bold text-white mb-2">{a.tipo}</h4>
                    <p className="text-[13px] text-gray-300 leading-relaxed">{a.desc}</p>
                  </div>
                ))}
              </div>
              <div className="text-center mt-8">
                <InternalRequestButton
                  requestType="ally"
                  subject="Más información sobre aliados"
                  triggerLabel="Escríbenos para más información"
                  title="Información para aliados"
                  description="Pregunta dentro del portal y el equipo revisará tu solicitud."
                  messageLabel="¿Qué información necesitas?"
                  messagePlaceholder="Ej. Queremos conocer requisitos para sumar nuestra organización..."
                  organizationLabel="Organización, fundación o empresa"
                  className="inline-flex items-center gap-2 text-naranja-400 hover:text-naranja-300
                             font-semibold text-[16px] transition-colors group"
                >
                  Escríbenos para más información
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </InternalRequestButton>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </PageWrapper>
  );
}
