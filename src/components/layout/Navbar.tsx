"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Home } from "lucide-react";
import GradientText from "@/components/effects/GradientText";
import PillNav, { type PillNavItem } from "@/components/ui/PillNav";
import StaggeredMenu, { type StaggeredMenuItem } from "@/components/ui/StaggeredMenu";
import AccountButton from "@/components/layout/AccountButton";
import { lenisScrollTo } from "@/providers/SmoothScrollProvider";

const navLinks = [
  { href: "#como-funciona", label: "Cómo funciona" },
  { href: "#ayuda-hoy", label: "Trámites" },
  { href: "#armando-ruiz", label: "Armando" },
  { href: "/iniciativas", label: "Iniciativas" },
  { href: "/auth/login", label: "Inicio de sesión" },
  { href: "#donar", label: "Ayudar" },
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
  const pillNavItems = useMemo<PillNavItem[]>(
    () =>
      navLinks.map((link) => ({
        ...link,
        href: getAnchorHref(link.href, isHome),
        scrollHref: link.href,
      })),
    [isHome],
  );
  const mobileMenuItems = useMemo<StaggeredMenuItem[]>(
    () =>
      navLinks.map((link) => ({
        label: link.label,
        href: getAnchorHref(link.href, isHome),
        ariaLabel: link.label,
        onClick: (event) => handleAnchorClick(event, link.href, isHome),
      })),
    [isHome],
  );

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 24);
    setHidden(latest > lastScroll.current && latest > 140);
    lastScroll.current = latest;
  });

  if (isAuthRoute) return null;

  return (
    <>
      <motion.header
        className={`fixed left-0 right-0 top-0 ${open ? "z-[70]" : "z-50"}`}
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
          <div
            className="relative mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-3 px-5 sm:px-8"
          >
            {/* Marca del partido (solo pantallas muy anchas: con 6 pestañas
                en el menu, antes de 2xl chocaria con la navegacion) */}
            <span className="hidden 2xl:flex items-center text-[16px] font-black uppercase tracking-[0.14em] select-none">
              <GradientText
                colors={["#7c2d12", "#ea580c", "#ffb163", "#ea580c", "#7c2d12"]}
                animationSpeed={2.5}
              >
                Movimiento Ciudadano
              </GradientText>
            </span>

            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-naranja-200 bg-naranja-50 px-4 text-[14px] font-bold text-naranja-700 transition-all duration-200 hover:border-naranja-300 hover:bg-naranja-100 focus-visible:outline-2 focus-visible:outline-naranja-500 xl:hidden"
              aria-label="Ir al inicio"
            >
              <Home className="h-4 w-4" aria-hidden="true" />
              Inicio
            </Link>

            <div className="hidden xl:block xl:absolute xl:left-1/2 xl:top-1/2 xl:-translate-x-1/2 xl:-translate-y-1/2">
              <PillNav
                logo="/icon.png"
                logoAlt="Inicio"
                items={pillNavItems}
                activeHref={pathname}
                baseColor="#f97316"
                pillColor="#fff7ed"
                pillTextColor="#9a3412"
                hoveredPillTextColor="#ffffff"
                ease="power3.out"
                initialLoadAnimation
                onItemClick={(event, item) => {
                  handleAnchorClick(event, item.scrollHref ?? item.href, isHome);
                }}
              />
            </div>

            <div className="ml-auto flex items-center gap-2">
              <AccountButton variant="desktop" onNavigate={() => setOpen(false)} />
              <div className="xl:hidden">
                <StaggeredMenu
                  items={mobileMenuItems}
                  accentColor="#ea580c"
                  colors={["#fb923c", "#ea580c"]}
                  onMenuOpen={() => setOpen(true)}
                  onMenuClose={() => setOpen(false)}
                  footer={<AccountButton variant="mobile" onNavigate={() => setOpen(false)} />}
                />
              </div>
            </div>
          </div>

          <motion.div
            className="absolute bottom-0 left-0 h-[3px] origin-left bg-gradient-to-r from-naranja-600 via-naranja-400 to-naranja-500"
            style={{ scaleX: scrollYProgress }}
            aria-hidden="true"
          />
        </div>
      </motion.header>
    </>
  );
}
