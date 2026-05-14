"use client";

import Link from "next/link";
import { StaggerContainer, StaggerItem } from "@/components/ui/FadeIn";
import FadeIn from "@/components/ui/FadeIn";
import {
  CreditCard, HeartPulse, ScrollText,
  Briefcase, Building2, Handshake, ArrowRight,
} from "lucide-react";

const servicioDestacado = {
  id: "tarjeta-accesible",
  icon: CreditCard,
  titulo: "Tarjeta Accesible",
  descripcion:
    "Tramita tu Tarjeta de Discapacidad CDMX paso a paso. Accede a beneficios en transporte, salud, descuentos y más servicios de la ciudad.",
  cta: "Tramitar mi tarjeta",
  href: "/tarjeta-accesible",
};

const servicios = [
  {
    id: "salud",
    icon: HeartPulse,
    titulo: "Gestiones de Salud",
    descripcion:
      "Medicamentos, aparatos ortopédicos, terapias y más apoyos médicos para personas con discapacidad.",
    cta: "Ver gestiones",
    href: "/salud",
  },
  {
    id: "programas-sociales",
    icon: ScrollText,
    titulo: "Programas Sociales",
    descripcion:
      "Catálogo completo de programas gubernamentales de la CDMX para personas con discapacidad y sus familias.",
    cta: "Explorar programas",
    href: "/programas-sociales",
  },
  {
    id: "bolsa-trabajo",
    icon: Briefcase,
    titulo: "Bolsa de Trabajo",
    descripcion:
      "Empleos dignos y adaptados para personas con discapacidad. Empresas comprometidas con la inclusión.",
    cta: "Buscar empleo",
    href: "/bolsa-trabajo",
  },
  {
    id: "secretarias",
    icon: Building2,
    titulo: "Secretarías del Estado",
    descripcion:
      "Directorio de secretarías de gobierno CDMX especializadas en discapacidad y salud, con links directos.",
    cta: "Ver directorio",
    href: "/secretarias",
  },
  {
    id: "aliados",
    icon: Handshake,
    titulo: "Aliados",
    descripcion:
      "Red de organizaciones, fundaciones y empresas que trabajan junto a Armando Ruiz por la inclusión.",
    cta: "Conocer aliados",
    href: "/aliados",
  },
];

export default function Servicios() {
  const FeaturedIcon = servicioDestacado.icon;

  return (
    <section
      id="servicios"
      className="py-28 bg-white relative overflow-hidden"
      aria-labelledby="servicios-titulo"
    >
      <div className="absolute inset-0 bg-dot-pattern opacity-60 pointer-events-none" aria-hidden="true" />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8">
        {/* Encabezado */}
        <FadeIn className="text-center mb-16">
          <span className="section-badge-light mb-4">Apoyos y Servicios</span>
          <h2
            id="servicios-titulo"
            className="text-[40px] sm:text-[52px] font-black text-ink-900
                       leading-tight tracking-tight mt-4 mb-5"
          >
            ¿En qué te podemos ayudar?
          </h2>
          <p className="text-[18px] text-ink-600 max-w-2xl mx-auto leading-relaxed">
            Todos los apoyos, trámites y recursos para personas con discapacidad
            y sus familias en un solo lugar.
          </p>
        </FadeIn>

        {/* Card destacada — Tarjeta Accesible */}
        <FadeIn className="mb-5">
          <Link
            href={servicioDestacado.href}
            className="group flex flex-col sm:flex-row items-start gap-6
                       p-8 sm:p-10 rounded-card
                       bg-naranja-50 border-2 border-naranja-200
                       hover:border-naranja-400 hover:shadow-card-hover hover:-translate-y-1
                       transition-all duration-300 focus-visible:outline-4
                       focus-visible:outline-naranja-500 focus-visible:outline-offset-2"
            aria-label={`${servicioDestacado.titulo}: ${servicioDestacado.descripcion}`}
          >
            <FeaturedIcon
              className="w-8 h-8 text-naranja-600 flex-shrink-0 mt-0.5"
              aria-hidden="true"
              strokeWidth={1.75}
            />
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <h3 className="text-[22px] font-bold text-naranja-700 leading-tight">
                  {servicioDestacado.titulo}
                </h3>
                <span
                  className="bg-naranja-500 text-white text-[11px] font-black
                               px-3 py-1 rounded-full tracking-wide uppercase"
                  aria-label="Servicio más solicitado"
                >
                  ✦ Más solicitado
                </span>
              </div>
              <p className="text-[16px] text-ink-600 leading-relaxed max-w-2xl">
                {servicioDestacado.descripcion}
              </p>
              <div
                className="flex items-center gap-2 mt-5 text-naranja-600 font-semibold
                             text-[16px] group-hover:gap-3 transition-all duration-200"
                aria-hidden="true"
              >
                {servicioDestacado.cta}
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </Link>
        </FadeIn>

        {/* Grid de servicios secundarios */}
        <StaggerContainer
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          stagger={0.08}
        >
          {servicios.map((s) => {
            const Icon = s.icon;
            return (
              <StaggerItem key={s.id}>
                <Link
                  href={s.href}
                  className="service-card border border-gray-100 bg-white
                             focus-visible:outline-4 focus-visible:outline-naranja-500
                             focus-visible:outline-offset-2"
                  aria-label={`${s.titulo}: ${s.descripcion}`}
                >
                  <div className="flex items-center gap-2.5 mb-3">
                    <Icon
                      className="w-5 h-5 text-naranja-500 flex-shrink-0"
                      strokeWidth={1.75}
                      aria-hidden="true"
                    />
                    <h3 className="text-[19px] font-bold text-ink-900 leading-tight">
                      {s.titulo}
                    </h3>
                  </div>
                  <p className="text-[15px] text-ink-600 leading-relaxed flex-1">
                    {s.descripcion}
                  </p>
                  <div
                    className="flex items-center gap-2 mt-5 text-naranja-600
                                 font-semibold text-[15px] group-hover:gap-3 transition-all"
                    aria-hidden="true"
                  >
                    {s.cta}
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
