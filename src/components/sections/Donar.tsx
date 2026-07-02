"use client";

import Link from "next/link";
import FadeIn, { StaggerContainer, StaggerItem } from "@/components/ui/FadeIn";
import InternalRequestButton from "@/components/ui/InternalRequestButton";
import { ShieldCheck, MousePointerClick, MessagesSquare, HeartHandshake, ArrowRight } from "lucide-react";

/* ───────────────────────────────────────────────────────────────
   MODELO DE DONACIÓN: CONEXIÓN DIRECTA (estilo "apadrinar")
   El diputado NUNCA maneja dinero. Se publican necesidades concretas
   de personas reales y se conecta al donante con el beneficiario a
   través del EQUIPO, que verifica y comprueba la ayuda.

─────────────────────────────────────────────────────────────── */

/* ───────────────────────────────────────────────────────────────
   CASOS REALES
   Las causas se publicaran desde Supabase / panel admin cuando haya
   un beneficiario verificado y CONSENTIMIENTO FIRMADO (nombre + foto).
   Mientras tanto NO se muestran personas inventadas: solo el modelo
   de ayuda y los formularios para ofrecer o pedir apoyo.
─────────────────────────────────────────────────────────────── */

const pasos = [
  {
    icon: MousePointerClick,
    titulo: "Elige una causa",
    texto: "Escoge a quién ayudar.",
  },
  {
    icon: MessagesSquare,
    titulo: "Dejas tus datos",
    texto: "El equipo revisa tu solicitud.",
  },
  {
    icon: HeartHandshake,
    titulo: "Compruebas tu ayuda",
    texto: "Ves a dónde llegó tu apoyo.",
  },
];

export default function Donar() {
  return (
    <section
      id="donar"
      className="relative overflow-hidden bg-warm-100 py-20 sm:py-24 lg:py-28"
      aria-labelledby="donar-titulo"
    >
      <div className="absolute inset-0 bg-dot-pattern opacity-60 pointer-events-none" aria-hidden="true" />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8">
        {/* ───── ENCABEZADO + MENSAJE DE TRANSPARENCIA ───── */}
        <FadeIn>
          <div className="text-center max-w-3xl mx-auto mb-8">
            <span className="section-badge-dark">Donar</span>

            <h2
              id="donar-titulo"
              className="text-[36px] sm:text-[48px] font-black text-gray-900 leading-tight tracking-tight mt-4 mb-5"
            >
              Ayuda directa, <span className="text-highlight">sin intermediarios</span>
            </h2>

            {/* Mensaje de transparencia — núcleo de la confianza */}
            <div
              className="rounded-card border-2 border-naranja-200 bg-white shadow-card p-5 text-left flex gap-4 items-start"
              role="note"
            >
              <div
                className="w-12 h-12 rounded-full bg-naranja-100 border-2 border-naranja-300 flex items-center justify-center flex-shrink-0"
                aria-hidden="true"
              >
                <ShieldCheck className="w-6 h-6 text-naranja-600" strokeWidth={2.2} />
              </div>
              <p className="text-[16px] sm:text-[17px] text-gray-800 leading-relaxed font-semibold">
                Aquí <span className="text-naranja-700 font-black">no manejamos tu dinero</span>. Te
                conectamos con personas reales y tú compruebas a dónde llegó tu ayuda.
              </p>
            </div>
          </div>
        </FadeIn>

        {/* ───── ACCIÓN: OFRECER O PEDIR AYUDA ─────
            No mostramos personas inventadas. Cuando haya un caso real
            verificado y con consentimiento firmado, se publicará aquí. */}
        <FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {/* Ofrecer ayuda */}
            <div className="rounded-card border-2 border-naranja-200 bg-white shadow-card p-6 flex flex-col">
              <div
                className="w-12 h-12 rounded-full bg-naranja-100 border-2 border-naranja-300 flex items-center justify-center mb-4"
                aria-hidden="true"
              >
                <HeartHandshake className="w-6 h-6 text-naranja-600" strokeWidth={2.2} />
              </div>
              <h3 className="text-[20px] font-black text-gray-900 leading-tight mb-2">
                Quiero ofrecer ayuda
              </h3>
              <p className="text-[15px] text-gray-700 leading-relaxed mb-5 flex-1">
                Déjanos tus datos y cómo puedes apoyar. El equipo te contacta y te
                conecta directo con una persona o familia que lo necesita.
              </p>
              <InternalRequestButton
                requestType="donation"
                subject="Quiero ofrecer ayuda"
                triggerLabel="Quiero ofrecer ayuda"
                title="Ofrecer ayuda directa"
                description="Deja tus datos dentro del portal para que el equipo coordine la ayuda directa."
                messageLabel="¿Cómo puedes ayudar?"
                messagePlaceholder="Ej. Puedo apoyar con dinero, con un producto (silla, lentes, despensa), con un servicio o con transporte."
                className="btn-primary shadow-btn-glow w-full !min-h-[52px] !px-4 !text-[15px]"
              >
                <HeartHandshake className="w-5 h-5" aria-hidden="true" />
                Quiero ofrecer ayuda
                <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </InternalRequestButton>
            </div>

            {/* Pedir ayuda */}
            <div className="rounded-card border-2 border-naranja-100 bg-warm-50 shadow-card p-6 flex flex-col">
              <div
                className="w-12 h-12 rounded-full bg-white border-2 border-naranja-300 flex items-center justify-center mb-4"
                aria-hidden="true"
              >
                <MessagesSquare className="w-6 h-6 text-naranja-600" strokeWidth={2.2} />
              </div>
              <h3 className="text-[20px] font-black text-gray-900 leading-tight mb-2">
                Necesito ayuda
              </h3>
              <p className="text-[15px] text-gray-700 leading-relaxed mb-5 flex-1">
                Cuéntanos qué necesitas tú o tu familia. Inicia sesión y agenda tu
                cita: te atiende un asesor y damos seguimiento personal.
              </p>
              <Link
                href="/salud/agendar"
                className="btn-secondary w-full !min-h-[52px] !px-4 !text-[15px] inline-flex items-center justify-center gap-2"
              >
                <MessagesSquare className="w-5 h-5" aria-hidden="true" />
                Pedir ayuda
                <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </FadeIn>

        {/* ───── CÓMO FUNCIONA (3 PASOS) ───── */}
        <FadeIn>
          <div className="text-center mb-5">
            <span className="section-badge-light">Cómo funciona</span>
            <h3 className="text-[26px] sm:text-[32px] font-black text-gray-900 leading-tight mt-3">
              Ayudar es <span className="text-highlight">muy sencillo</span>
            </h3>
          </div>
        </FadeIn>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-4" stagger={0.12}>
          {pasos.map((paso, i) => {
            const Icon = paso.icon;
            return (
              <StaggerItem key={paso.titulo}>
                <div className="rounded-card border-2 border-naranja-100 bg-white shadow-card p-5 h-full text-center">
                  <div className="relative w-12 h-12 mx-auto mb-4">
                    <div className="w-12 h-12 rounded-full bg-naranja-100 border-2 border-naranja-300 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-naranja-600" strokeWidth={2} aria-hidden="true" />
                    </div>
                    <span
                      className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-naranja-500 text-white text-[14px] font-black flex items-center justify-center border-2 border-white"
                      aria-hidden="true"
                    >
                      {i + 1}
                    </span>
                  </div>
                  <h4 className="text-[18px] font-black text-gray-900 mb-1">{paso.titulo}</h4>
                  <p className="text-[14px] text-gray-700 leading-relaxed">{paso.texto}</p>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
