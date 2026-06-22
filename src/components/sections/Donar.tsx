"use client";

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
   ESTRUCTURA DE DATOS DE LAS CAUSAS
   Pensada para cargarse después desde Supabase / panel admin.
   // Requiere consentimiento firmado del beneficiario/tutor (nombre + foto)
─────────────────────────────────────────────────────────────── */
type EstadoCausa = "buscando" | "completada";

interface Causa {
  id: string;
  nombre: string;            // nombre completo del beneficiario
  edad: number;
  iniciales: string;         // placeholder de foto (mientras no haya foto real)
  fotoUrl?: string;          // foto real con consentimiento (futuro)
  historia: string;          // tono DIGNO y empoderador (1-2 líneas)
  necesidad: string;         // necesidad específica
  costo: number;             // costo aproximado en MXN
  estado: EstadoCausa;
}

const causas: Causa[] = [
  {
    id: "silla-luis",
    nombre: "Luis Hernández",
    edad: 16,
    iniciales: "LH",
    historia:
      "Luis quiere moverse con autonomía para seguir estudiando.",
    necesidad: "Silla de ruedas para seguir estudiando",
    costo: 4500,
    estado: "buscando",
  },
  {
    id: "uniforme-mariana",
    nombre: "Mariana Soto",
    edad: 9,
    iniciales: "MS",
    historia:
      "Mariana necesita su uniforme para iniciar el ciclo escolar.",
    necesidad: "Uniforme escolar completo",
    costo: 2000,
    estado: "buscando",
  },
  {
    id: "lentes-don-jose",
    nombre: "José Ramírez",
    edad: 64,
    iniciales: "JR",
    historia:
      "Don José necesita lentes para seguir trabajando con precisión.",
    necesidad: "Lentes graduados",
    costo: 1800,
    estado: "buscando",
  },
  {
    id: "aparato-valeria",
    nombre: "Valeria Cruz",
    edad: 12,
    iniciales: "VC",
    historia:
      "Valeria necesita apoyo ortopédico para caminar mejor.",
    necesidad: "Aparato ortopédico",
    costo: 3200,
    estado: "completada",
  },
];

const pesos = (n: number) =>
  n.toLocaleString("es-MX", { style: "currency", currency: "MXN", minimumFractionDigits: 0 });

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

        {/* ───── TABLÓN DE CAUSAS ───── */}
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8" stagger={0.12}>
          {causas.map((causa) => {
            const completada = causa.estado === "completada";
            return (
              <StaggerItem key={causa.id}>
                <article
                  className="service-card cursor-default !p-5 h-full"
                  aria-label={`Causa: ${causa.necesidad} para ${causa.nombre}, ${causa.edad} años. Costo aproximado ${pesos(
                    causa.costo
                  )}. Estado: ${completada ? "apoyo completado" : "buscando apoyo"}.`}
                >
                  <div className="flex items-start gap-5">
                    {/* Avatar / foto del beneficiario (placeholder con iniciales) */}
                    <div
                      className="w-14 h-14 rounded-full bg-naranja-100 border-4 border-naranja-300 flex items-center justify-center flex-shrink-0"
                      aria-hidden="true"
                    >
                      {/* TODO: cuando exista fotoUrl con consentimiento, renderizar <Image> en lugar de iniciales */}
                      <span className="text-naranja-600 font-black text-xl">{causa.iniciales}</span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="text-[18px] font-black text-gray-900 leading-tight">
                        {causa.nombre}
                        <span className="text-gray-700 font-bold">, {causa.edad} años</span>
                      </h3>

                      {/* Estado de la causa — no depende solo del color (texto + icono) */}
                      <span
                        className={
                          "inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full text-[12px] font-bold border " +
                          (completada
                            ? "bg-green-100 text-green-800 border-green-300"
                            : "bg-naranja-100 text-naranja-700 border-naranja-300")
                        }
                      >
                        {completada ? (
                          <>
                            <HeartHandshake className="w-4 h-4" aria-hidden="true" />
                            Apoyo completado
                          </>
                        ) : (
                          <>
                            <span className="w-2 h-2 rounded-full bg-naranja-500" aria-hidden="true" />
                            Buscando apoyo
                          </>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Necesidad + costo destacado */}
                  <div className="mt-4 rounded-2xl bg-warm-50 border-2 border-naranja-100 p-3">
                    <p className="text-[13px] font-bold uppercase tracking-wide text-gray-700">
                      Necesita
                    </p>
                    <p className="text-[16px] font-black text-gray-900 leading-snug mt-0.5">
                      {causa.necesidad}
                    </p>
                    <p className="text-[21px] font-black text-naranja-600 mt-1">{pesos(causa.costo)}</p>
                  </div>

                  {/* CTA grande (≥56px) — mailto prellenado con la causa, o estado cerrado */}
                  <div className="mt-4">
                    {completada ? (
                      <div
                        className="inline-flex items-center justify-center gap-2 w-full min-h-[52px] px-5 rounded-2xl border-2 border-green-300 bg-green-50 text-green-800 font-bold text-[15px]"
                        aria-label={`La causa de ${causa.nombre} ya fue completada. ¡Gracias!`}
                      >
                        <HeartHandshake className="w-5 h-5" aria-hidden="true" />
                        ¡Gracias! Esta causa ya se cumplió
                      </div>
                    ) : (
                      <InternalRequestButton
                        requestType="donation"
                        subject={`Quiero ayudar: ${causa.necesidad}`}
                        triggerLabel="Quiero ayudar"
                        title={`Ayudar a ${causa.nombre}`}
                        description="Deja tus datos dentro del portal para que el equipo coordine la ayuda directa."
                        messageLabel="¿Cómo quieres ayudar?"
                        messagePlaceholder="Ej. Puedo apoyar con el monto completo, con una parte, con el producto o con transporte."
                        metadata={{
                          causa_id: causa.id,
                          beneficiario: causa.nombre,
                          edad: causa.edad,
                          necesidad: causa.necesidad,
                          costo: causa.costo,
                        }}
                        className="btn-primary shadow-btn-glow w-full !min-h-[52px] !px-4 !text-[15px]"
                      >
                        <HeartHandshake className="w-5 h-5" aria-hidden="true" />
                        Quiero ayudar
                        <ArrowRight className="w-5 h-5" aria-hidden="true" />
                      </InternalRequestButton>
                    )}
                  </div>
                </article>
              </StaggerItem>
            );
          })}
        </StaggerContainer>

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
