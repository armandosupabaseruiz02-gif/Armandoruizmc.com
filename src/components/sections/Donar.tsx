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
      "Luis quiere ser ingeniero. Va a la escuela todos los días y no piensa rendirse: solo necesita poder moverse con autonomía.",
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
      "Mariana es de las mejores de su salón. Con su uniforme nuevo entrará al ciclo escolar lista para seguir destacando.",
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
      "Don José trabaja en su taller desde hace 40 años. Unos lentes le permitirán seguir haciendo lo que ama con precisión.",
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
      "Valeria sueña con bailar. Con su aparato ortopédico recuperará fuerza para dar sus próximos pasos con confianza.",
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
    texto: "Mira las necesidades reales y escoge a quién quieres ayudar.",
  },
  {
    icon: MessagesSquare,
    titulo: "Dejas tus datos",
    texto: "Llenas el formulario dentro del portal. Nuestro equipo revisa tu solicitud.",
  },
  {
    icon: HeartHandshake,
    titulo: "Compruebas tu ayuda",
    texto: "Te conectamos directo con la persona y ves a dónde llegó tu apoyo.",
  },
];

export default function Donar() {
  return (
    <section id="donar" className="py-28 bg-warm-100 relative overflow-hidden" aria-labelledby="donar-titulo">
      <div className="absolute inset-0 bg-dot-pattern opacity-60 pointer-events-none" aria-hidden="true" />

      <div className="relative max-w-6xl mx-auto px-5 sm:px-8">
        {/* ───── ENCABEZADO + MENSAJE DE TRANSPARENCIA ───── */}
        <FadeIn>
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="section-badge-dark">Donar</span>

            <h2
              id="donar-titulo"
              className="text-[40px] sm:text-[56px] font-black text-gray-900 leading-tight tracking-tight mt-5 mb-6"
            >
              Tu ayuda llega <span className="text-highlight">directo</span> a quien la necesita
            </h2>

            {/* Mensaje de transparencia — núcleo de la confianza */}
            <div
              className="rounded-card border-2 border-naranja-200 bg-white shadow-card p-7 sm:p-8 text-left flex gap-5 items-start"
              role="note"
            >
              <div
                className="w-14 h-14 rounded-full bg-naranja-100 border-2 border-naranja-300 flex items-center justify-center flex-shrink-0"
                aria-hidden="true"
              >
                <ShieldCheck className="w-7 h-7 text-naranja-600" strokeWidth={2.2} />
              </div>
              <p className="text-[18px] sm:text-[20px] text-gray-800 leading-relaxed font-semibold">
                Aquí <span className="text-naranja-700 font-black">no manejamos tu dinero</span>. Te
                conectamos directamente con personas reales que necesitan tu apoyo, y tú compruebas a
                dónde llegó tu ayuda.
              </p>
            </div>
          </div>
        </FadeIn>

        {/* ───── TABLÓN DE CAUSAS ───── */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20" stagger={0.12}>
          {causas.map((causa) => {
            const completada = causa.estado === "completada";
            return (
              <StaggerItem key={causa.id}>
                <article
                  className="service-card cursor-default !p-7 h-full"
                  aria-label={`Causa: ${causa.necesidad} para ${causa.nombre}, ${causa.edad} años. Costo aproximado ${pesos(
                    causa.costo
                  )}. Estado: ${completada ? "apoyo completado" : "buscando apoyo"}.`}
                >
                  <div className="flex items-start gap-5">
                    {/* Avatar / foto del beneficiario (placeholder con iniciales) */}
                    <div
                      className="w-20 h-20 rounded-full bg-naranja-100 border-4 border-naranja-300 flex items-center justify-center flex-shrink-0"
                      aria-hidden="true"
                    >
                      {/* TODO: cuando exista fotoUrl con consentimiento, renderizar <Image> en lugar de iniciales */}
                      <span className="text-naranja-600 font-black text-2xl">{causa.iniciales}</span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="text-[22px] font-black text-gray-900 leading-tight">
                        {causa.nombre}
                        <span className="text-gray-700 font-bold">, {causa.edad} años</span>
                      </h3>

                      {/* Estado de la causa — no depende solo del color (texto + icono) */}
                      <span
                        className={
                          "inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full text-[13px] font-bold border " +
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

                  {/* Historia — tono digno y empoderador */}
                  <p className="text-[16px] text-gray-800 leading-relaxed mt-5">{causa.historia}</p>

                  {/* Necesidad + costo destacado */}
                  <div className="mt-5 rounded-2xl bg-warm-50 border-2 border-naranja-100 p-4">
                    <p className="text-[13px] font-bold uppercase tracking-wide text-gray-700">
                      Necesita
                    </p>
                    <p className="text-[18px] font-black text-gray-900 leading-snug mt-0.5">
                      {causa.necesidad}
                    </p>
                    <p className="text-[24px] font-black text-naranja-600 mt-1">{pesos(causa.costo)}</p>
                  </div>

                  {/* CTA grande (≥56px) — mailto prellenado con la causa, o estado cerrado */}
                  <div className="mt-6">
                    {completada ? (
                      <div
                        className="inline-flex items-center justify-center gap-2 w-full min-h-[56px] px-6 rounded-2xl border-2 border-green-300 bg-green-50 text-green-800 font-bold text-[17px]"
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
                        className="btn-primary shadow-btn-glow w-full"
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
          <div className="text-center mb-10">
            <span className="section-badge-light">Cómo funciona</span>
            <h3 className="text-[28px] sm:text-[36px] font-black text-gray-900 leading-tight mt-4">
              Ayudar es <span className="text-highlight">muy sencillo</span>
            </h3>
          </div>
        </FadeIn>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6" stagger={0.12}>
          {pasos.map((paso, i) => {
            const Icon = paso.icon;
            return (
              <StaggerItem key={paso.titulo}>
                <div className="rounded-card border-2 border-naranja-100 bg-white shadow-card p-7 h-full text-center">
                  <div className="relative w-16 h-16 mx-auto mb-5">
                    <div className="w-16 h-16 rounded-full bg-naranja-100 border-2 border-naranja-300 flex items-center justify-center">
                      <Icon className="w-8 h-8 text-naranja-600" strokeWidth={2} aria-hidden="true" />
                    </div>
                    <span
                      className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-naranja-500 text-white text-[14px] font-black flex items-center justify-center border-2 border-white"
                      aria-hidden="true"
                    >
                      {i + 1}
                    </span>
                  </div>
                  <h4 className="text-[20px] font-black text-gray-900 mb-2">{paso.titulo}</h4>
                  <p className="text-[16px] text-gray-700 leading-relaxed">{paso.texto}</p>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
