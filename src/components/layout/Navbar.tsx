"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Heart, Home, Menu, User, X } from "lucide-react";
import { lenisScrollTo } from "@/providers/SmoothScrollProvider";

const navLinks = [
  { href: "#quienes-somos", label: "Atención" },
  { href: "#que-hacemos", label: "Cómo te ayudamos" },
  { href: "#armando-ruiz", label: "Armando" },
  { href: "#sabias-que", label: "Datos" },
];

function getAnchorHref(href: string, isHome: boolean) {
  return href.startsWith("#") && !isHome ? `/${href}` : href;
}

function handleAnchorClick(
  event: React.MouseEvent<HTMLAnchorElement>,
  href: string,
  isHome: boolean,
  closeMobile?: () => void,
) {
  if (!href.startsWith("#")) return;
  closeMobile?.();

  if (!isHome) return;

  event.preventDefault();
  lenisScrollTo(href);
}

export default function Navbar() {
  const pathname = usePathname();
  const isAuthRoute = pathname.startsWith("/auth/");
  const isHome = pathname === "/";
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScroll = useRef(0);
  const { scrollY, scrollYProgress } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 24);
    setHidden(latest > lastScroll.current && latest > 140);
    lastScroll.current = latest;
  });

  if (isAuthRoute) return null;

  return (
    <>
      <motion.header
        className="fixed left-0 right-0 top-0 z-50"
        animate={{ y: hidden && !open ? -96 : 0 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
      >
        <div
          className={`relative transition-all duration-300 ${
            scrolled
              ? "border-b border-naranja-100 bg-white/92 shadow-md backdrop-blur-xl"
              : "bg-white/84 backdrop-blur-md"
          }`}
        >
          <nav
            className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-3 px-5 sm:px-8"
            aria-label="Navegación principal"
          >
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-naranja-200 bg-naranja-50 px-4 text-[14px] font-bold text-naranja-700 transition-all duration-200 hover:border-naranja-300 hover:bg-naranja-100 focus-visible:outline-2 focus-visible:outline-naranja-500"
              aria-label="Ir al inicio"
            >
              <Home className="h-4 w-4" aria-hidden="true" />
              Inicio
            </Link>

            <ul className="hidden items-center gap-1 xl:flex">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={getAnchorHref(link.href, isHome)}
                    onClick={(event) => handleAnchorClick(event, link.href, isHome)}
                    className="rounded-full px-3 py-2 text-[14px] font-semibold text-gray-700 transition-all duration-200 hover:bg-naranja-50 hover:text-naranja-700 focus-visible:outline-2 focus-visible:outline-naranja-500"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-2">
              <Link
                href="/mi-cuenta"
                onClick={() => setOpen(false)}
                className="hidden min-h-11 items-center gap-2 rounded-full border border-gray-200 bg-white px-4 text-[14px] font-semibold text-gray-700 transition-all duration-200 hover:border-naranja-200 hover:bg-naranja-50 hover:text-naranja-700 sm:inline-flex"
              >
                <User className="h-4 w-4" aria-hidden="true" />
                Mi cuenta
              </Link>
              <a
                href={getAnchorHref("#donar", isHome)}
                onClick={(event) => handleAnchorClick(event, "#donar", isHome)}
                className="hidden min-h-11 items-center gap-2 rounded-full bg-naranja-500 px-5 text-[14px] font-bold text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-naranja-600 hover:shadow-btn-glow sm:inline-flex"
              >
                <Heart className="h-4 w-4" fill="currentColor" aria-hidden="true" />
                Donar
              </a>
              <button
                type="button"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-800 transition-colors duration-200 hover:bg-naranja-50 xl:hidden"
                onClick={() => setOpen((current) => !current)}
                aria-expanded={open}
                aria-controls="mobile-menu"
                aria-label={open ? "Cerrar menú" : "Abrir menú"}
              >
                {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
              </button>
            </div>
          </nav>

          <motion.div
            className="absolute bottom-0 left-0 h-[3px] origin-left bg-gradient-to-r from-naranja-600 via-naranja-400 to-naranja-500"
            style={{ scaleX: scrollYProgress }}
            aria-hidden="true"
          />
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-40 flex flex-col overflow-y-auto bg-white px-6 pb-10 pt-24"
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <ul className="mb-8 flex flex-col gap-1">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={getAnchorHref(link.href, isHome)}
                    className="flex min-h-[58px] items-center border-b border-gray-100 text-[23px] font-black text-gray-900 transition-colors hover:text-naranja-700"
                    onClick={(event) => handleAnchorClick(event, link.href, isHome, () => setOpen(false))}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            <div className="flex flex-col gap-3">
              <Link
                href="/mi-cuenta"
                onClick={() => setOpen(false)}
                className="btn-secondary w-full justify-center"
              >
                <User className="h-5 w-5" aria-hidden="true" />
                Mi cuenta
              </Link>
              <a
                href={getAnchorHref("#donar", isHome)}
                className="btn-primary w-full justify-center"
                onClick={(event) => handleAnchorClick(event, "#donar", isHome, () => setOpen(false))}
              >
                <Heart className="h-5 w-5" fill="currentColor" aria-hidden="true" />
                Donar ahora
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
