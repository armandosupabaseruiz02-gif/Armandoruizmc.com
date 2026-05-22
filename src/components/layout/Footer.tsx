import Link from "next/link";
import { Instagram, Facebook, Twitter, Phone, Mail, MapPin } from "lucide-react";
import { lenisScrollTo } from "@/providers/SmoothScrollProvider";

const serviciosLinks = [
  { href: "/tarjeta-accesible",  label: "Tarjeta Accesible" },
  { href: "/salud",              label: "Gestiones de Salud" },
  { href: "/programas-sociales", label: "Programas Sociales" },
  { href: "/bolsa-trabajo",      label: "Bolsa de Trabajo" },
  { href: "/secretarias",        label: "Secretarías del Estado" },
  { href: "/aliados",            label: "Aliados" },
];

const infoLinks = [
  { href: "#quienes-somos", label: "Quiénes Somos" },
  { href: "#que-hacemos",   label: "Qué Hacemos" },
  { href: "#armando-ruiz",  label: "Quién es Armando" },
  { href: "#sabias-que",    label: "¿Sabías que?" },
  { href: "#donar",         label: "Donar" },
];

function handleAnchor(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
  if (!href.startsWith("#")) return;
  e.preventDefault();
  lenisScrollTo(href);
}

export default function Footer() {
  return (
    <footer style={{ backgroundColor: "#18120d" }} role="contentinfo">
      <div className="h-1 bg-gradient-to-r from-naranja-400 via-naranja-500 to-naranja-400" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          {/* Identidad */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-full bg-naranja-500 flex items-center justify-center shadow-md flex-shrink-0">
                <span className="text-white font-black text-[15px]">AR</span>
              </div>
              <div>
                <p className="font-black text-white text-[16px] leading-tight">Armando Ruiz</p>
                <p className="text-naranja-400 text-[11px] font-bold tracking-widest uppercase leading-tight">
                  Diputado CDMX
                </p>
              </div>
            </div>
            <p className="text-white/40 text-[14px] leading-relaxed mb-6">
              Trabajando por una Ciudad de México más incluyente y accesible para las personas con discapacidad.
            </p>
            <div className="flex gap-2">
              {[
                { icon: Instagram, label: "Instagram de Armando Ruiz", href: "https://instagram.com" },
                { icon: Facebook,  label: "Facebook de Armando Ruiz",  href: "https://facebook.com" },
                { icon: Twitter,   label: "Twitter de Armando Ruiz",   href: "https://twitter.com" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-10 h-10 rounded-xl flex items-center justify-center
                             text-white/40 hover:text-white
                             border border-white/10 hover:border-naranja-500 hover:bg-naranja-500/20
                             transition-all duration-200
                             focus-visible:outline-2 focus-visible:outline-naranja-400"
                >
                  <s.icon className="w-4 h-4" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* Servicios */}
          <div>
            <h3 className="text-[12px] font-black text-white/30 tracking-[0.12em] uppercase mb-5">
              Servicios
            </h3>
            <ul className="space-y-2.5">
              {serviciosLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/45 hover:text-naranja-400 text-[14px] transition-colors
                               flex items-center gap-2 group
                               focus-visible:outline-2 focus-visible:outline-naranja-400"
                  >
                    <span className="w-1 h-1 rounded-full bg-white/20 group-hover:bg-naranja-400 transition-colors flex-shrink-0" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Información */}
          <div>
            <h3 className="text-[12px] font-black text-white/30 tracking-[0.12em] uppercase mb-5">
              Información
            </h3>
            <ul className="space-y-2.5">
              {infoLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => handleAnchor(e, link.href)}
                    className="text-white/45 hover:text-naranja-400 text-[14px] transition-colors
                               flex items-center gap-2 group cursor-pointer
                               focus-visible:outline-2 focus-visible:outline-naranja-400"
                  >
                    <span className="w-1 h-1 rounded-full bg-white/20 group-hover:bg-naranja-400 transition-colors flex-shrink-0" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="text-[12px] font-black text-white/30 tracking-[0.12em] uppercase mb-5">
              Contacto
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-naranja-400 mt-0.5 flex-shrink-0" aria-hidden="true" />
                <span className="text-white/45 text-[14px] leading-snug">
                  Cámara de Diputados,<br />Ciudad de México
                </span>
              </li>
              <li>
                <a
                  href="tel:+525555555555"
                  className="flex items-center gap-3 text-white/45 hover:text-naranja-400 text-[14px]
                             transition-colors focus-visible:outline-2 focus-visible:outline-naranja-400"
                  aria-label="Llamar al teléfono de la oficina"
                >
                  <Phone className="w-4 h-4 text-naranja-400 flex-shrink-0" aria-hidden="true" />
                  (55) 5555-5555
                </a>
              </li>
              <li>
                <a
                  href="mailto:contacto@armandoruiz.mx"
                  className="flex items-center gap-3 text-white/45 hover:text-naranja-400 text-[14px]
                             transition-colors focus-visible:outline-2 focus-visible:outline-naranja-400"
                  aria-label="Enviar correo electrónico"
                >
                  <Mail className="w-4 h-4 text-naranja-400 flex-shrink-0" aria-hidden="true" />
                  contacto@armandoruiz.mx
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-4">
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
                className="text-white/25 hover:text-naranja-400 text-[13px] transition-colors
                           focus-visible:outline-2 focus-visible:outline-naranja-400"
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
