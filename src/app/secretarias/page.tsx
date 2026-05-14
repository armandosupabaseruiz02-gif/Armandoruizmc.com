import type { Metadata } from "next";
import Link from "next/link";
import PageWrapper from "@/components/layout/PageWrapper";
import FadeIn, { StaggerContainer, StaggerItem } from "@/components/ui/FadeIn";
import { Building2, ArrowLeft, Phone, Globe, ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Secretarías del Estado | Armando Ruiz Diputado",
  description: "Directorio de secretarías de gobierno CDMX especializadas en discapacidad, salud e inclusión.",
};

const secretarias = [
  {
    nombre: "SIBISO – Secretaría de Inclusión y Bienestar Social",
    descripcion: "Dependencia central para programas sociales, apoyos económicos y servicios de inclusión para personas con discapacidad en CDMX.",
    servicios: ["Pensión para personas con discapacidad", "Apoyo a cuidadores", "Programas de inclusión social"],
    tel: "55 5345-8000",
    url: "https://sibiso.cdmx.gob.mx",
    color: "border-naranja-200",
    iconBg: "bg-naranja-500",
  },
  {
    nombre: "DIF CDMX – Sistema para el Desarrollo Integral de la Familia",
    descripcion: "Otorga atención y apoyo integral a personas con discapacidad: aparatos ortopédicos, sillas de ruedas, terapias y más.",
    servicios: ["Aparatos ortopédicos y prótesis", "Sillas de ruedas", "Centros de rehabilitación", "Orientación jurídica"],
    tel: "55 5605-0049",
    url: "https://dif.cdmx.gob.mx",
    color: "border-blue-200",
    iconBg: "bg-blue-600",
  },
  {
    nombre: "IFDP – Instituto para la Integración al Desarrollo de las Personas con Discapacidad",
    descripcion: "Institución especializada en la promoción de derechos, accesibilidad e inclusión laboral y social de personas con discapacidad en CDMX.",
    servicios: ["Tarjeta de Discapacidad CDMX", "Asesoría legal", "Vinculación laboral", "Accesibilidad urbana"],
    tel: "55 5652-7940",
    url: "https://ifdp.cdmx.gob.mx",
    color: "border-violet-200",
    iconBg: "bg-violet-600",
  },
  {
    nombre: "Secretaría de Salud CDMX",
    descripcion: "Proporciona atención médica, medicamentos, terapias y servicios especializados de salud para personas con discapacidad.",
    servicios: ["Atención médica gratuita", "Medicamentos", "Terapias de rehabilitación", "Consultas especializadas"],
    tel: "800 290 0024",
    url: "https://salud.cdmx.gob.mx",
    color: "border-red-200",
    iconBg: "bg-red-500",
  },
  {
    nombre: "STyFE – Secretaría de Trabajo y Fomento al Empleo",
    descripcion: "Promueve la inserción laboral de personas con discapacidad a través del programa Inclúyeme y apoyos de desempleo.",
    servicios: ["Programa Inclúyeme", "Bolsa de trabajo especializada", "Seguro de desempleo", "Capacitación laboral"],
    tel: "55 5200-9700",
    url: "https://styfe.cdmx.gob.mx",
    color: "border-emerald-200",
    iconBg: "bg-emerald-600",
  },
  {
    nombre: "INVI – Instituto de Vivienda de la Ciudad de México",
    descripcion: "Apoya la adaptación de viviendas para personas con discapacidad y facilita el acceso a créditos de vivienda accesible.",
    servicios: ["Créditos para vivienda accesible", "Apoyo para adaptación de vivienda", "Rampas y baños accesibles"],
    tel: "55 5211-5032",
    url: "https://invi.cdmx.gob.mx",
    color: "border-teal-200",
    iconBg: "bg-teal-600",
  },
  {
    nombre: "SEP CDMX – Secretaría de Educación Pública",
    descripcion: "Garantiza el acceso a la educación incluyente para personas con discapacidad en todos los niveles escolares.",
    servicios: ["Escuelas con educación especial", "Becas para estudiantes con discapacidad", "CAM (Centros de Atención Múltiple)", "Intérpretes LSM"],
    tel: "800 288 6227",
    url: "https://sep.gob.mx",
    color: "border-yellow-200",
    iconBg: "bg-yellow-500",
  },
  {
    nombre: "LOCATEL – Línea de atención ciudadana",
    descripcion: "Línea gratuita de orientación para conocer qué dependencia atiende tu caso y cómo llegar a ella.",
    servicios: ["Orientación y canalización", "Información de servicios de gobierno", "Atención 24/7"],
    tel: "55 5658-1111",
    url: "https://locatel.cdmx.gob.mx",
    color: "border-gray-200",
    iconBg: "bg-gray-700",
  },
];

export default function SecretariasPage() {
  return (
    <PageWrapper>
      {/* Hero */}
      <section className="relative bg-ink-950 pt-20 pb-28 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute inset-0 bg-grid-pattern opacity-30" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full
                          bg-violet-500/10 blur-[100px] translate-x-1/4" />
        </div>

        <div className="relative max-w-4xl mx-auto px-5 sm:px-8">
          <FadeIn>
            <Link href="/" className="inline-flex items-center gap-2 text-white/40 hover:text-naranja-400
                                       text-[14px] font-medium transition-colors mb-8 group">
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Regresar al inicio
            </Link>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-violet-600 flex items-center justify-center">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <span className="section-badge-dark">Secretarías del Estado</span>
            </div>

            <h1 className="text-[44px] sm:text-[60px] font-black text-white leading-tight tracking-tight mb-5">
              Dependencias{" "}
              <span className="text-gradient">Gubernamentales</span>
            </h1>
            <p className="text-[18px] sm:text-[20px] text-white/55 leading-relaxed max-w-2xl">
              Directorio de las secretarías del gobierno de la Ciudad de México
              especializadas en atención a personas con discapacidad y sus familias.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Secretarías */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <StaggerContainer className="flex flex-col gap-6" stagger={0.06}>
            {secretarias.map((s) => (
              <StaggerItem key={s.nombre}>
                <div className={`p-7 rounded-card border-2 ${s.color} bg-white
                                 hover:shadow-card transition-all duration-300`}>
                  <div className="flex items-start gap-5 mb-4">
                    <div className={`w-12 h-12 rounded-xl ${s.iconBg} flex items-center
                                    justify-center flex-shrink-0`}>
                      <Building2 className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-[19px] font-bold text-ink-900 leading-snug mb-2">
                        {s.nombre}
                      </h3>
                      <p className="text-[15px] text-ink-500 leading-relaxed">{s.descripcion}</p>
                    </div>
                  </div>

                  <div className="pl-17 ml-[68px]">
                    <p className="text-[12px] font-black text-ink-400 uppercase tracking-wide mb-2">
                      Servicios principales:
                    </p>
                    <ul className="flex flex-wrap gap-2 mb-4">
                      {s.servicios.map((sv) => (
                        <li key={sv}
                          className="text-[13px] bg-gray-50 border border-gray-200
                                     rounded-full px-3 py-1 text-ink-600">
                          {sv}
                        </li>
                      ))}
                    </ul>

                    <div className="flex flex-wrap items-center gap-4">
                      <a href={`tel:${s.tel.replace(/\s/g,"")}`}
                         className="flex items-center gap-2 text-naranja-600 font-semibold
                                    text-[14px] hover:text-naranja-700 transition-colors">
                        <Phone className="w-4 h-4" />
                        {s.tel}
                      </a>
                      <a href={s.url} target="_blank" rel="noopener noreferrer"
                         className="flex items-center gap-1.5 text-ink-400 hover:text-naranja-500
                                    text-[14px] transition-colors">
                        <Globe className="w-4 h-4" />
                        Sitio web oficial
                        <ChevronRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>

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
