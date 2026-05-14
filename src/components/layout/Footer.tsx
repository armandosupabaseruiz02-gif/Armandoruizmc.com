import Link from "next/link";
import FadeIn from "@/components/ui/FadeIn";
import { Instagram, Facebook, Twitter, Phone, Mail, MapPin, ArrowUpRight } from "lucide-react";

const serviciosLinks = [
  { href: "#tarjeta-incluyente", label: "Tarjeta Incluyente" },
  { href: "#salud",              label: "Gestiones de Salud" },
  { href: "#programas-sociales", label: "Programas Sociales" },
  { href: "#bolsa-trabajo",      label: "Bolsa de Trabajo" },
  { href: "#secretarias",        label: "Secretarías del Estado" },
  { href: "#aliados",            label: "Aliados" },
];

export default function Footer() {
  return (
    <footer className="bg-ink-950 border-t border-white/8" role="contentinfo">
      {/* Top glow line */}
      <div className="h-[1px] bg-gradient-to-r from-transparent via-naranja-500/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-20">
        <FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            {/* Identidad */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-11 h-11 rounded-full bg-naranja-500 flex items-center justify-center shadow-glow-sm">
                  <span className="text-white font-black text-[15px]">AR</span>
                </div>
                <div>
                  <p className="font-bold text-white text-[16px] leading-tight">Armando Ruiz</p>
                  <p className="text-naranja-400 text-[12px] font-semibold tracking-wide">DIPUTADO CDMX</p>
                </div>
              </div>
              <p className="text-white/40 text-[14px] leading-relaxed mb-6">
                Trabajando por una Ciudad de México más incluyente y accesible para las personas con discapacidad.
              </p>
              <div className="flex gap-2">
                {[
                  { icon: Instagram, label: "Instagram" },
                  { icon: Facebook,  label: "Facebook" },
                  { icon: Twitter,   label: "Twitter" },
                ].map((s) => (
                  <a
                    key={s.label}
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="w-10 h-10 rounded-xl bg-white/6 hover:bg-naranja-500/20
                               border border-white/8 hover:border-naranja-500/40
                               flex items-center justify-center text-white/50 hover:text-naranja-400
                               transition-all duration-200"
                  >
                    <s.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Servicios */}
            <div>
              <h3 className="text-[13px] font-black text-white/30 tracking-[0.1em] uppercase mb-5">
                Servicios
              </h3>
              <ul className="space-y-2.5">
                {serviciosLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-white/50 hover:text-naranja-400 text-[14px]
                                 transition-colors flex items-center gap-1.5 group"
                    >
                      <span className="w-1 h-1 rounded-full bg-white/20 group-hover:bg-naranja-400 transition-colors" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Info */}
            <div>
              <h3 className="text-[13px] font-black text-white/30 tracking-[0.1em] uppercase mb-5">
                Información
              </h3>
              <ul className="space-y-2.5">
                {[
                  { href: "#quienes-somos", label: "Quiénes Somos" },
                  { href: "#que-hacemos",   label: "Qué Hacemos" },
                  { href: "#armando-ruiz",  label: "Quién es Armando" },
                  { href: "#donar",         label: "Donar" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-white/50 hover:text-naranja-400 text-[14px]
                                 transition-colors flex items-center gap-1.5 group"
                    >
                      <span className="w-1 h-1 rounded-full bg-white/20 group-hover:bg-naranja-400 transition-colors" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contacto */}
            <div>
              <h3 className="text-[13px] font-black text-white/30 tracking-[0.1em] uppercase mb-5">
                Contacto
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-naranja-400 mt-0.5 flex-shrink-0" />
                  <span className="text-white/45 text-[14px] leading-snug">
                    Cámara de Diputados,<br />Ciudad de México
                  </span>
                </li>
                <li>
                  <a href="tel:+525555555555"
                     className="flex items-center gap-3 text-white/45 hover:text-naranja-400 text-[14px] transition-colors group">
                    <Phone className="w-4 h-4 text-naranja-400 flex-shrink-0" />
                    (55) 5555-5555
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
                <li>
                  <a href="mailto:contacto@armandoruiz.mx"
                     className="flex items-center gap-3 text-white/45 hover:text-naranja-400 text-[14px] transition-colors group">
                    <Mail className="w-4 h-4 text-naranja-400 flex-shrink-0" />
                    contacto@armandoruiz.mx
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </FadeIn>

        {/* Bottom */}
        <div className="pt-8 border-t border-white/8 flex flex-col sm:flex-row
                        items-center justify-between gap-4">
          <p className="text-white/25 text-[13px]">
            © {new Date().getFullYear()} Armando Ruiz · Diputado CDMX · Movimiento Naranja
          </p>
          <div className="flex gap-6">
            {[
              { href: "/aviso-privacidad", label: "Aviso de Privacidad" },
              { href: "/accesibilidad",    label: "Accesibilidad" },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-white/25 hover:text-naranja-400 text-[13px] transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
