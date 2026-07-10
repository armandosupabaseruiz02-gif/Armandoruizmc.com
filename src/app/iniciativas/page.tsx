import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, CalendarHeart } from "lucide-react";
import PageWrapper from "@/components/layout/PageWrapper";
import FadeIn from "@/components/ui/FadeIn";
import { createClient } from "@/lib/supabase/server";
import IniciativasList, { type Iniciativa } from "./IniciativasList";

export const metadata: Metadata = {
  title: "Iniciativas legislativas",
  description:
    "Conoce las iniciativas de ley que impulsa el Diputado Armando Ruiz: qué proponen, en qué van y cómo nace una ley en la Cámara de Diputados.",
};

/* Pagina editorial premium: mucho aire, tipografia grande y contenido
   informativo, con la misma vibra amigable del resto del portal. */

const pasosLey = [
  {
    num: "01",
    titulo: "La idea",
    desc: "Todo empieza con un problema real de la gente. Se estudia y se convierte en una propuesta concreta para cambiar o crear una ley.",
  },
  {
    num: "02",
    titulo: "Se presenta",
    desc: "El diputado la presenta ante la Cámara de Diputados. Desde ese momento es una iniciativa formal y queda registrada.",
  },
  {
    num: "03",
    titulo: "Comisiones",
    desc: "Un grupo de diputados especialistas la revisa a fondo, la discute y puede mejorarla. Aquí se decide si avanza.",
  },
  {
    num: "04",
    titulo: "Votación",
    desc: "El pleno de la Cámara la vota. Si la mayoría dice que sí, pasa al Senado para su revisión.",
  },
  {
    num: "05",
    titulo: "Ya es ley",
    desc: "Cuando ambas cámaras la aprueban, se publica en el Diario Oficial y empieza a proteger tus derechos.",
  },
];

export default async function IniciativasPage() {
  let iniciativas: Iniciativa[] = [];
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("initiatives")
      .select("id, title, summary, description, status, topic, presented_at, document_url")
      .eq("published", true)
      .order("presented_at", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false });
    iniciativas = (data as Iniciativa[]) ?? [];
  } catch {
    // Sin conexion a Supabase la pagina sigue viva con el contenido informativo.
  }

  return (
    <PageWrapper>
      {/* ——— Hero editorial ——— */}
      <section className="relative overflow-hidden bg-white pt-24 pb-16 sm:pt-32 sm:pb-24" aria-labelledby="iniciativas-titulo">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <FadeIn>
            <Link
              href="/"
              className="inline-flex min-h-11 items-center gap-2 text-[14px] font-bold text-gray-500 transition-colors hover:text-naranja-600 focus-visible:outline-2 focus-visible:outline-naranja-500"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Volver al inicio
            </Link>

            <p className="mt-10 text-[12px] font-black uppercase tracking-[0.2em] text-naranja-600">
              Trabajo legislativo · Cámara de Diputados
            </p>

            <h1
              id="iniciativas-titulo"
              className="mt-4 text-[56px] font-black leading-[0.95] tracking-tight text-gray-950 sm:text-[96px] lg:text-[120px]"
            >
              Iniciativas<span className="text-naranja-500">.</span>
            </h1>
          </FadeIn>

          {/* Rejilla editorial de 3 columnas, como una revista */}
          <FadeIn className="mt-14 sm:mt-20">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-[180px_260px_1fr] lg:gap-14">
              <p className="text-[14px] leading-relaxed text-gray-400">
                LXVI Legislatura,
                <br />
                por el Estado de México
              </p>

              <div>
                <p className="text-[14px] leading-relaxed text-gray-500">
                  Una iniciativa es el primer paso para cambiar una ley — o crear
                  una nueva — en beneficio de la gente.
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <span className="relative block h-11 w-11 overflow-hidden rounded-full border border-naranja-200">
                    <Image
                      src="/images/armando-ruiz-movimiento-naranja.jpg"
                      alt=""
                      fill
                      sizes="44px"
                      className="object-cover object-top"
                    />
                  </span>
                  <span>
                    <span className="block text-[14px] font-bold text-gray-900">Armando Ruiz</span>
                    <span className="block text-[13px] text-gray-500">Diputado Federal</span>
                  </span>
                </div>
              </div>

              <div>
                <p className="text-[22px] font-bold leading-snug tracking-tight text-gray-950 sm:text-[28px]">
                  Aquí te contamos, sin lenguaje rebuscado, qué leyes estamos
                  empujando, por qué importan y en qué paso del camino van. Porque
                  las leyes se hacen para ti, y tienes derecho a entenderlas.
                </p>
                <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-gray-500">
                  Nos preguntamos siempre: ¿a quién ayuda?, ¿qué problema resuelve?,
                  ¿cómo la hacemos realidad? Empezamos por las personas, no por el papeleo.
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ——— Como nace una ley ——— */}
      <section className="bg-warm-50 py-16 sm:py-24" aria-labelledby="como-nace-titulo">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <FadeIn>
            <p className="text-[12px] font-black uppercase tracking-[0.2em] text-naranja-600">
              Para entenderle
            </p>
            <h2
              id="como-nace-titulo"
              className="mt-3 text-[34px] font-black leading-tight tracking-tight text-gray-950 sm:text-[46px]"
            >
              ¿Cómo nace una ley?
            </h2>
            <p className="mt-3 max-w-2xl text-[17px] leading-relaxed text-gray-600">
              El camino que recorre cada iniciativa antes de convertirse en ley,
              pasito a pasito.
            </p>
          </FadeIn>

          <FadeIn className="mt-12">
            <ol className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-5">
              {pasosLey.map((paso) => (
                <li key={paso.num} className="border-t-2 border-naranja-500/80 pt-5">
                  <p className="text-[15px] font-black text-naranja-500" aria-hidden="true">
                    {paso.num}
                  </p>
                  <h3 className="mt-2 text-[19px] font-black text-gray-950">{paso.titulo}</h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-gray-600">{paso.desc}</p>
                </li>
              ))}
            </ol>
          </FadeIn>
        </div>
      </section>

      {/* ——— Lista de iniciativas ——— */}
      <section className="bg-white py-16 sm:py-24" aria-labelledby="propuestas-titulo">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <FadeIn>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-[12px] font-black uppercase tracking-[0.2em] text-naranja-600">
                  Las propuestas
                </p>
                <h2
                  id="propuestas-titulo"
                  className="mt-3 text-[34px] font-black leading-tight tracking-tight text-gray-950 sm:text-[46px]"
                >
                  Lo que estamos impulsando
                </h2>
              </div>
              {iniciativas.length > 0 && (
                <p className="text-[14px] font-bold text-gray-400">
                  {iniciativas.length} {iniciativas.length === 1 ? "iniciativa" : "iniciativas"}
                </p>
              )}
            </div>
          </FadeIn>

          <FadeIn className="mt-10">
            <IniciativasList iniciativas={iniciativas} />
          </FadeIn>
        </div>
      </section>

      {/* ——— CTA ——— */}
      <section className="relative overflow-hidden bg-naranja-500 py-16 sm:py-20" aria-labelledby="cta-iniciativas-titulo">
        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" aria-hidden="true" />
        <div className="relative mx-auto max-w-4xl px-5 text-center sm:px-8">
          <h2
            id="cta-iniciativas-titulo"
            className="text-[30px] font-black leading-tight tracking-tight text-white sm:text-[42px]"
          >
            ¿Vives algo que una ley debería arreglar?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-[17px] leading-relaxed text-white/90">
            Cuéntanoslo. Las mejores iniciativas nacen de historias reales, y la
            tuya puede ser la siguiente.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/salud/agendar"
              className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full bg-white px-7 text-[15px] font-bold text-naranja-700 shadow-lg transition-colors hover:bg-naranja-50 focus-visible:outline-2 focus-visible:outline-white"
            >
              <CalendarHeart className="h-5 w-5" aria-hidden="true" />
              Agendar una cita
            </Link>
            <Link
              href="/#como-funciona"
              className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full border-2 border-white/40 px-7 text-[15px] font-bold text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-white"
            >
              Cómo te ayudamos
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}
