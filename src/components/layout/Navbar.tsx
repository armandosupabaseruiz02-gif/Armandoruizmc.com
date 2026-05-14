"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X, Heart } from "lucide-react";

const navLinks = [
  { href: "#quienes-somos",    label: "Quiénes Somos" },
  { href: "#que-hacemos",      label: "Qué Hacemos" },
  { href: "#armando-ruiz",     label: "Armando Ruiz" },
  { href: "#servicios",        label: "Servicios" },
];

export default function Navbar() {
  const [open, setOpen]         = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden]     = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(latest > 40);
    setHidden(latest > prev && latest > 120);
  });

  // lock body when mobile menu open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-50"
        animate={{ y: hidden && !open ? -100 : 0 }}
        transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <div
          className={`transition-all duration-500 ${
            scrolled
              ? "bg-white/80 backdrop-blur-2xl border-b border-gray-200/60 shadow-sm"
              : "bg-transparent"
          }`}
        >
          <nav
            className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between h-[72px]"
            aria-label="Navegación principal"
          >
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-3 group"
              aria-label="Armando Ruiz – Inicio"
            >
              <div className="w-10 h-10 rounded-full bg-naranja-500 flex items-center justify-center
                              shadow-glow-sm group-hover:shadow-glow transition-shadow duration-300">
                <span className="text-white font-black text-[15px] tracking-tight">AR</span>
              </div>
              <div className="hidden sm:block">
                <p className={`font-bold text-[16px] leading-tight transition-colors duration-300 ${scrolled ? "text-ink-900" : "text-white"}`}>
                  Armando Ruiz
                </p>
                <p className="text-naranja-500 text-[12px] font-semibold tracking-wide leading-tight">
                  DIPUTADO CDMX
                </p>
              </div>
            </Link>

            {/* Desktop links */}
            <ul className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`px-4 py-2 text-[14px] font-medium rounded-lg
                                transition-all duration-200
                                hover:text-naranja-500 hover:bg-naranja-500/8
                                ${scrolled ? "text-ink-700" : "text-white/85"}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* CTA + hamburger */}
            <div className="flex items-center gap-3">
              <Link
                href="#donar"
                className="hidden sm:inline-flex items-center gap-2
                           px-5 py-2 min-h-[40px]
                           bg-naranja-500 hover:bg-naranja-600
                           text-white font-semibold text-[14px]
                           rounded-pill shadow-glow-sm hover:shadow-glow
                           transition-all duration-300 -translate-y-0 hover:-translate-y-0.5"
              >
                <Heart className="w-4 h-4" aria-hidden="true" />
                Donar
              </Link>

              <button
                className={`lg:hidden w-10 h-10 flex items-center justify-center rounded-lg
                            transition-colors ${scrolled ? "text-ink-800 hover:bg-gray-100" : "text-white hover:bg-white/10"}`}
                onClick={() => setOpen(!open)}
                aria-expanded={open}
                aria-label={open ? "Cerrar menú" : "Abrir menú"}
              >
                {open
                  ? <X className="w-5 h-5" />
                  : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </nav>
        </div>
      </motion.header>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 bg-ink-950/95 backdrop-blur-2xl flex flex-col pt-24 px-6 pb-10"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {/* Orange glow */}
            <div className="absolute top-0 right-0 w-80 h-80 rounded-full
                            bg-naranja-500/10 blur-3xl pointer-events-none" />

            <ul className="flex flex-col gap-2 mb-8">
              {navLinks.map((link, i) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i + 0.1, duration: 0.4 }}
                >
                  <Link
                    href={link.href}
                    className="flex items-center min-h-[60px] text-[22px] font-bold text-white/90
                               hover:text-naranja-400 transition-colors py-2"
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.4 }}
            >
              <Link
                href="#donar"
                className="btn-primary w-full justify-center text-[18px]"
                onClick={() => setOpen(false)}
              >
                <Heart className="w-5 h-5" />
                Donar ahora
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
