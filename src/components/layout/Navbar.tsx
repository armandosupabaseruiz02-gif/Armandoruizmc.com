"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X, Heart } from "lucide-react";

const navLinks = [
  { href: "#quienes-somos", label: "Quiénes Somos" },
  { href: "#que-hacemos",   label: "Qué Hacemos" },
  { href: "#armando-ruiz",  label: "Armando Ruiz" },
  { href: "#servicios",     label: "Servicios" },
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

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-50"
        animate={{ y: hidden && !open ? -100 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className={`transition-all duration-400 ${
          scrolled
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
                <p className="font-black text-[16px] text-gray-900 leading-tight">Armando Ruiz</p>
                <p className="text-naranja-600 text-[12px] font-bold tracking-widest uppercase leading-tight">
                  Diputado Federal · CDMX
                </p>
              </div>
            </Link>

            {/* Links desktop */}
            <ul className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="px-4 py-2 text-[14px] font-semibold text-gray-700 rounded-xl
                               hover:text-naranja-600 hover:bg-naranja-50 transition-all duration-150"
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
                className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5
                           bg-naranja-500 hover:bg-naranja-600
                           text-white font-bold text-[14px]
                           rounded-full shadow-md hover:shadow-btn-glow
                           transition-all duration-200 hover:-translate-y-0.5"
              >
                <Heart className="w-4 h-4" fill="white" />
                Donar
              </Link>

              <button
                className="lg:hidden w-11 h-11 flex items-center justify-center rounded-xl
                           text-gray-700 hover:bg-naranja-50 transition-colors"
                onClick={() => setOpen(!open)}
                aria-expanded={open}
                aria-label={open ? "Cerrar menú" : "Abrir menú"}
              >
                {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </nav>
        </div>
      </motion.header>

      {/* Menú móvil */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 bg-white flex flex-col pt-24 px-6 pb-10"
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {/* Fondo decorativo */}
            <div className="absolute top-0 right-0 w-80 h-80 rounded-full
                            bg-naranja-100 opacity-60 -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />

            <ul className="flex flex-col gap-1 mb-8">
              {navLinks.map((link, i) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i + 0.1 }}
                >
                  <Link
                    href={link.href}
                    className="flex items-center min-h-[60px] text-[24px] font-black
                               text-gray-900 hover:text-naranja-600 transition-colors py-2"
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
              transition={{ delay: 0.35 }}
            >
              <Link
                href="#donar"
                className="btn-primary w-full justify-center text-[18px]"
                onClick={() => setOpen(false)}
              >
                <Heart className="w-5 h-5" fill="white" />
                Donar ahora
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
