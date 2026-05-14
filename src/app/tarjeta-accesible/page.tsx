import type { Metadata } from "next";
import Link from "next/link";
import PageWrapper from "@/components/layout/PageWrapper";
import FadeIn, { StaggerContainer, StaggerItem } from "@/components/ui/FadeIn";
import {
  CreditCard, CheckCircle2, ArrowLeft, MapPin,
  FileText, AlertCircle, ChevronRight, Bus, Hospital, ShoppingCart, Landmark,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Tarjeta Accesible CDMX | Armando Ruiz Diputado",
  description: "Conoce cómo tramitar la Tarjeta de Discapacidad CDMX paso a paso, sus beneficios y dónde obtenerla.",
};

const beneficios = [
  { icon: Bus,          titulo: "Transporte gratuito",     desc: "Metro, Metrobús, Tren Ligero, Trolebús y RTP sin costo." },
  { icon: Hospital,     titulo: "Atención médica",         desc: "Descuentos y acceso preferencial en servicios de salud del gobierno CDMX." },
  { icon: ShoppingCart, titulo: "Descuentos comerciales",  desc: "Establecimientos afiliados ofrecen descuentos con la tarjeta." },
  { icon: Landmark,     titulo: "Trámites prioritarios",   desc: "Atención preferencial en módulos y ventanillas de gobierno." },
];

const requisitos = [
  "Identificación oficial vigente (INE / Pasaporte)",
  "CURP (Clave Única de Registro de Población)",
  "Comprobante de domicilio reciente (máx. 3 meses)",
  "Constancia médica o dictamen de discapacidad",
  "2 fotografías tamaño infantil, fondo blanco",
];

const pasos = [
  {
    num: "01",
    titulo: "Reúne tus documentos",
    desc: "Junta todos los requisitos en originales y copias. Verifica que la identificación esté vigente.",
  },
  {
    num: "02",
    titulo: "Acude al módulo DIF",
    desc: "Dirígete al módulo del DIF o IFDP más cercano a tu domicilio. Puedes ir acompañado de un familiar.",
  },
  {
    num: "03",
    titulo: "Entrega tu documentación",
    desc: "El personal te orientará sobre el llenado de solicitud y revisará tus documentos.",
  },
  {
    num: "04",
    titulo: "Espera la emisión",
    desc: "El tiempo de emisión es de aproximadamente 10 a 15 días hábiles.",
  },
  {
    num: "05",
    titulo: "Recibe tu tarjeta",
    desc: "Te notificarán cuando esté lista. Recógela en el mismo módulo donde hiciste el trámite.",
  },
];

const modulos = [
  { nombre: "DIF CDMX – Sede Central",        direccion: "Prolongación Xochicalco 947, Col. Santa Cruz Atoyac, Benito Juárez", tel: "55 5605-0049" },
  { nombre: "IFDP – Instituto de Discapacidad", direccion: "Periferico Sur 3325, Col. San Jerónimo Lídice, Magdalena Contreras", tel: "55 5652-7940" },
  { nombre: "Módulo Iztapalapa",               direccion: "Av. Telecomunicaciones s/n, Iztapalapa",                            tel: "55 5686-1111" },
  { nombre: "Módulo Gustavo A. Madero",        direccion: "Av. Instituto Politécnico Nacional s/n, Gustavo A. Madero",        tel: "55 5750-2070" },
];

export default function TarjetaAccesiblePage() {
  return (
    <PageWrapper>
      {/* Hero */}
      <section className="relative bg-ink-950 pt-20 pb-28 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute inset-0 bg-grid-pattern opacity-30" />
          <div className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full
                          bg-naranja-500/10 blur-[100px] -translate-x-1/2 -translate-y-1/2" />
        </div>

        <div className="relative max-w-4xl mx-auto px-5 sm:px-8">
          <FadeIn>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-white/40 hover:text-naranja-400
                         text-[14px] font-medium transition-colors mb-8 group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Regresar al inicio
            </Link>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-naranja-500 flex items-center justify-center shadow-glow">
                <CreditCard className="w-8 h-8 text-white" />
              </div>
              <span className="section-badge-dark">Tarjeta Accesible</span>
            </div>

            <h1 className="text-[44px] sm:text-[60px] font-black text-white leading-tight tracking-tight mb-5">
              Tarjeta de{" "}
              <span className="text-gradient">Discapacidad CDMX</span>
            </h1>
            <p className="text-[18px] sm:text-[20px] text-white/55 leading-relaxed max-w-2xl">
              La Tarjeta Accesible te da acceso a transporte gratuito, atención médica
              preferencial y descuentos en la Ciudad de México. Aquí te explicamos cómo obtenerla.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Beneficios */}
      <section className="py-20 bg-white" aria-labelledby="beneficios-titulo">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <FadeIn className="mb-14">
            <span className="section-badge-light mb-3">¿Qué puedes hacer con ella?</span>
            <h2 id="beneficios-titulo" className="text-[36px] sm:text-[44px] font-black text-ink-900 leading-tight mt-4">
              Beneficios de la tarjeta
            </h2>
          </FadeIn>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 gap-5" stagger={0.1}>
            {beneficios.map((b) => {
              const Icon = b.icon;
              return (
                <StaggerItem key={b.titulo}>
                  <div className="flex gap-5 p-6 rounded-card border-2 border-naranja-100 bg-naranja-50
                                  hover:border-naranja-300 hover:shadow-card transition-all duration-300">
                    <div className="w-12 h-12 rounded-xl bg-naranja-500 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-[18px] font-bold text-ink-900 mb-1">{b.titulo}</h3>
                      <p className="text-[15px] text-ink-500 leading-relaxed">{b.desc}</p>
                    </div>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* Requisitos */}
      <section className="py-20 bg-ink-950" aria-labelledby="requisitos-titulo">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <FadeIn>
              <span className="section-badge-dark mb-3">Documentos necesarios</span>
              <h2 id="requisitos-titulo" className="text-[36px] sm:text-[44px] font-black text-white leading-tight mt-4 mb-8">
                Requisitos para tramitarla
              </h2>

              <ul className="space-y-4" role="list">
                {requisitos.map((req) => (
                  <li key={req} className="flex items-start gap-3" role="listitem">
                    <CheckCircle2 className="w-6 h-6 text-naranja-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                    <span className="text-[17px] text-white/70 leading-snug">{req}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 p-5 rounded-2xl bg-naranja-500/10 border border-naranja-500/20 flex gap-3">
                <AlertCircle className="w-5 h-5 text-naranja-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <p className="text-[14px] text-white/60 leading-relaxed">
                  Lleva originales y copias de todos los documentos. El trámite es completamente
                  gratuito. No pagues a gestores externos.
                </p>
              </div>
            </FadeIn>

            {/* Pasos */}
            <FadeIn direction="left">
              <span className="section-badge-dark mb-3">Proceso</span>
              <h2 className="text-[36px] sm:text-[44px] font-black text-white leading-tight mt-4 mb-8">
                Cómo tramitarla paso a paso
              </h2>

              <ol className="space-y-5" role="list">
                {pasos.map((p) => (
                  <li key={p.num}
                    className="flex gap-4 p-5 rounded-2xl bg-white/4 border border-white/8
                               hover:border-white/16 hover:bg-white/6 transition-all duration-300"
                    role="listitem"
                  >
                    <span className="text-[28px] font-black text-naranja-500 leading-none flex-shrink-0 mt-1">
                      {p.num}
                    </span>
                    <div>
                      <h3 className="text-[16px] font-bold text-white mb-1">{p.titulo}</h3>
                      <p className="text-[14px] text-white/50 leading-relaxed">{p.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Módulos */}
      <section className="py-20 bg-white" aria-labelledby="modulos-titulo">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <FadeIn className="mb-12">
            <span className="section-badge-light mb-3">Dónde tramitarla</span>
            <h2 id="modulos-titulo" className="text-[36px] sm:text-[44px] font-black text-ink-900 leading-tight mt-4">
              Módulos de atención
            </h2>
          </FadeIn>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 gap-5" stagger={0.1}>
            {modulos.map((m) => (
              <StaggerItem key={m.nombre}>
                <div className="p-6 rounded-card border border-gray-100 hover:border-naranja-200
                                hover:shadow-card transition-all duration-300">
                  <div className="flex items-start gap-3 mb-3">
                    <MapPin className="w-5 h-5 text-naranja-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                    <h3 className="text-[17px] font-bold text-ink-900 leading-snug">{m.nombre}</h3>
                  </div>
                  <p className="text-[14px] text-ink-500 mb-3 pl-8 leading-relaxed">{m.direccion}</p>
                  <a
                    href={`tel:${m.tel.replace(/\s/g, "")}`}
                    className="inline-flex items-center gap-1.5 pl-8 text-naranja-600
                               font-semibold text-[14px] hover:text-naranja-700 transition-colors"
                    aria-label={`Llamar al ${m.tel}`}
                  >
                    📞 {m.tel}
                  </a>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          {/* CTA volver */}
          <FadeIn className="mt-14 text-center">
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
