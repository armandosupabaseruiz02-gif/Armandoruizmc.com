"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X, Heart, User } from "lucide-react";
import { lenisScrollTo } from "@/providers/SmoothScrollProvider";

// El orden del menú coincide EXACTAMENTE con el orden visual de la home
// (tras el Hero): Servicios → Quiénes Somos → Qué Hacemos → Armando Ruiz → ¿Sabías que?
const navLinks = [
  { href: "#servicios",     label: "Servicios" },
  { href: "#quienes-somos", label: "Quiénes Somos" },
  { href: "#que-hacemos",   label: "Qué Hacemos" },
  { href: "#armando-ruiz",  label: "Armando Ruiz" },
  { href: "#sabias-que",    label: "¿Sabías que?" },
];

function handleAnchorClick(
  e: React.MouseEvent<HTMLAnchorElement>,
  href: string,
  closeMobile?: () => void,
) {
  if (!href.startsWith("#")) return;
  e.preventDefault();
  closeMobile?.();
  lenisScrollTo(href);
}

export default function Navbar() {
  const [open, setOpen]         = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden]     = useState(false);
  // Tema adaptable: "dark" cuando el navbar está sobre una sección oscura
  // (heros bg-gray-900, sección naranja "¿Sabías que?"), "light" sobre fondos claros.
  const [theme, setTheme]       = useState<"light" | "dark">("light");
  const darkSections = useRef<HTMLElement[]>([]);
  const { scrollY, scrollYProgress } = useScroll();

  // Detecta qué hay debajo del navbar (franja a la mitad de su altura: y = 36px)
  const probeTheme = useCallback(() => {
    const y = 36;
    const overDark = darkSections.current.some((el) => {
      const r = el.getBoundingClientRect();
      return r.top <= y && r.bottom >= y;
    });
    setTheme(overDark ? "dark" : "light");
  }, []);

  useEffect(() => {
    // Secciones oscuras: por clase de fondo o marcadas explícitamente
    darkSections.current = Array.from(
      document.querySelectorAll<HTMLElement>(
        'section[class*="bg-gray-900"], section[class*="bg-naranja-500"], [data-navbar-theme="dark"]'
      )
    );
    probeTheme();
    window.addEventListener("resize", probeTheme);
    return () => window.removeEventListener("resize", probeTheme);
  }, [probeTheme]);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(latest > 40);
    setHidden(latest > prev && latest > 120);
    probeTheme();
  });

  const dark = theme === "dark";

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-50"
        animate={{ y: hidden && !open ? -100 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className={`relative transition-colors duration-500 ${
          dark
            ? scrolled
              ? "bg-gray-900/90 backdrop-blur-xl shadow-md border-b border-white/10"
              : "bg-gray-900/70 backdrop-blur-md"
            : scrolled
              ? "bg-white/95 backdrop-blur-xl shadow-md border-b border-naranja-100"
              : "bg-white/90 backdrop-blur-md"
        }`}>
          <nav
            className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between h-[72px]"
            aria-label="Navegación principal"
          >
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group" aria-label="Armando Ruiz – Inicio">
              <div className="w-11 h-11 rounded-full bg-naranja-500 flex items-center justify-center
                              shadow-btn-glow group-hover:scale-105 transition-transform duration-200">
                <span className="text-white font-black text-[15px] tracking-tight">AR</span>
              </div>
              <div className="hidden sm:block">
                <p className={`font-black text-[16px] leading-tight transition-colors duration-500 ${
                  dark ? "text-white" : "text-gray-900"
                }`}>Armando Ruiz</p>
                <p className={`text-[12px] font-bold tracking-widest uppercase leading-tight transition-colors duration-500 ${
                  dark ? "text-naranja-400" : "text-naranja-600"
                }`}>
                  Diputado Federal · Movimiento Naranja
                </p>
              </div>
            </Link>

            {/* Links desktop */}
            <ul className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => handleAnchorClick(e, link.href)}
                    className={`px-4 py-2 text-[14px] font-semibold rounded-xl
                                transition-all duration-300 cursor-pointer
                                focus-visible:outline-2 focus-visible:outline-naranja-500 ${
                      dark
                        ? "text-gray-200 hover:text-naranja-300 hover:bg-white/10"
                        : "text-gray-700 hover:text-naranja-600 hover:bg-naranja-50"
                    }`}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            {/* CTA + hamburger */}
            <div className="flex items-center gap-3">
              <Link
                href="/mi-cuenta"
                className={`hidden sm:inline-flex items-center gap-2 px-4 py-2.5
                            font-semibold text-[14px] rounded-full border
                            transition-all duration-300 ${
                  dark
                    ? "text-gray-200 border-white/25 hover:text-white hover:bg-white/10 hover:border-white/50"
                    : "text-gray-700 border-gray-200 hover:text-naranja-600 hover:bg-naranja-50 hover:border-naranja-200"
                }`}
              >
                <User className="w-4 h-4" aria-hidden="true" />
                Mi cuenta
              </Link>
              <a
                href="#donar"
                onClick={(e) => handleAnchorClick(e, "#donar")}
                className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5
                           bg-naranja-500 hover:bg-naranja-600
                           text-white font-bold text-[14px]
                           rounded-full shadow-md hover:shadow-btn-glow
                           transition-all duration-200 hover:-translate-y-0.5
                           focus-visible:outline-2 focus-visible:outline-naranja-300 cursor-pointer"
              >
                <Heart className="w-4 h-4" fill="white" aria-hidden="true" />
                Donar
              </a>

              <button
                className={`lg:hidden w-11 h-11 flex items-center justify-center rounded-xl
                            transition-colors duration-300
                            focus-visible:outline-2 focus-visible:outline-naranja-500 ${
                  dark ? "text-gray-200 hover:bg-white/10" : "text-gray-700 hover:bg-naranja-50"
                }`}
                onClick={() => setOpen(!open)}
                aria-expanded={open}
                aria-controls="mobile-menu"
                aria-label={open ? "Cerrar menú" : "Abrir menú"}
              >
                {open ? <X className="w-6 h-6" aria-hidden="true" /> : <Menu className="w-6 h-6" aria-hidden="true" />}
              </button>
            </div>
          </nav>

          {/* Barra de progreso de lectura (naranja, al pie del navbar) */}
          <motion.div
            className="absolute bottom-0 inset-x-0 h-[3px] origin-left
                       bg-gradient-to-r from-naranja-600 via-naranja-400 to-naranja-500"
            style={{ scaleX: scrollYProgress }}
            aria-hidden="true"
          />
        </div>
      </motion.header>

      {/* Menú móvil */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-40 bg-white flex flex-col pt-24 px-6 pb-10 overflow-y-auto"
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <div
              className="absolute top-0 right-0 w-80 h-80 rounded-full
                          bg-naranja-100 opacity-60 -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none"
              aria-hidden="true"
            />

            <ul className="flex flex-col gap-1 mb-8">
              {navLinks.map((link, i) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i + 0.1 }}
                >
                  <a
                    href={link.href}
                    className="flex items-center min-h-[60px] text-[24px] font-black
                               text-gray-900 hover:text-naranja-600 transition-colors py-2
                               focus-visible:outline-2 focus-visible:outline-naranja-500"
                    onClick={(e) => handleAnchorClick(e, link.href, () => setOpen(false))}
                  >
                    {link.label}
                  </a>
                </motion.li>
              ))}
            </ul>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="flex flex-col gap-3"
            >
              <Link
                href="/mi-cuenta"
                onClick={() => setOpen(false)}
                className="btn-secondary w-full justify-center text-[18px]"
              >
                <User className="w-5 h-5" aria-hidden="true" />
                Mi cuenta
              </Link>
              <a
                href="#donar"
                className="btn-primary w-full justify-center text-[18px]"
                onClick={(e) => handleAnchorClick(e, "#donar", () => setOpen(false))}
              >
                <Heart className="w-5 h-5" fill="white" aria-hidden="true" />
                Donar ahora
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
