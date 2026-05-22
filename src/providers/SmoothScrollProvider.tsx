"use client";

import { useEffect } from "react";
import Lenis from "lenis";

// Referencia global para que cualquier componente pueda llamar scrollTo
// sin necesitar Context de React
let _lenis: Lenis | null = null;

const NAVBAR_H = 80; // 72px navbar + 8px de aire

export function lenisScrollTo(target: string) {
  const el = document.querySelector(target) as HTMLElement | null;
  if (!el) return;

  // Calculamos la posición exacta en píxeles para evitar
  // ambigüedades con el offset string-based de Lenis
  const targetY = Math.max(0, el.getBoundingClientRect().top + window.scrollY - NAVBAR_H);

  if (_lenis) {
    _lenis.scrollTo(targetY);
  } else {
    window.scrollTo({ top: targetY, behavior: "smooth" });
  }
}

export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      smoothWheel: true,
    });

    _lenis = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    const rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      _lenis = null;
    };
  }, []);

  return <>{children}</>;
}
