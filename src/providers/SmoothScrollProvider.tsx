"use client";

import { useEffect } from "react";
import Lenis from "lenis";

// Referencia global para que cualquier componente pueda llamar scrollTo
// sin necesitar Context de React
let _lenis: Lenis | null = null;

export function lenisScrollTo(target: string, offset = -88) {
  if (_lenis) {
    _lenis.scrollTo(target, { offset });
  } else {
    // Fallback nativo si Lenis aún no está listo
    const el = document.querySelector(target);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
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
