"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

/* ───────────────────────────────────────────────────────────────
   SOMBRERO + AGUILITA  (emblema vivo de la marca)
   Idea del diputado: un sombrero que, al picarlo, "suelta" la aguilita
   de Movimiento Ciudadano.
   - SIN sonido: la interaccion es 100% visual (mejor accesibilidad y
     nada de audio inesperado).
   - El sombrero es el sello de la pagina: grande y con una animacion
     viva (flota y se mece suavemente, como saludando).
   - Respeta prefers-reduced-motion (sin brincos, solo aparece).
─────────────────────────────────────────────────────────────── */

function Aguila({ className }: { className?: string }) {
  // Aguilita estilizada (silueta propia, no el logotipo registrado).
  return (
    <svg viewBox="0 0 64 48" className={className} aria-hidden="true" role="img">
      <path
        fill="#ea580c"
        d="M32 6c1.7 0 3 1.6 3 3.4 0 .7-.2 1.3-.5 1.9 3.4.7 6.4 2.7 8.7 5.6 2.6-2.2 6-3.5 9.3-3.9 1.2-.1 1.9 1.3 1.1 2.2-1.7 1.9-3.9 3.2-6.2 3.9 3.6 1 6.9 3.1 9.4 6 .8.9 0 2.3-1.2 2.1-3.1-.5-6-.2-8.7 1 2 2.6 3.2 5.8 3.4 9.2.1 1.2-1.4 1.8-2.2.9-2-2.3-4.5-4-7.3-5 .2 3 -.5 6-2 8.6-.6 1-2.1.8-2.4-.4-.7-2.8-2-5.3-3.8-7.4-1.8 2.1-3.1 4.6-3.8 7.4-.3 1.2-1.8 1.4-2.4.4-1.5-2.6-2.2-5.6-2-8.6-2.8 1-5.3 2.7-7.3 5-.8.9-2.3.3-2.2-.9.2-3.4 1.4-6.6 3.4-9.2-2.7-1.2-5.6-1.5-8.7-1-1.2.2-2-1.2-1.2-2.1 2.5-2.9 5.8-5 9.4-6-2.3-.7-4.5-2-6.2-3.9-.8-.9-.1-2.3 1.1-2.2 3.3.4 6.7 1.7 9.3 3.9 2.3-2.9 5.3-4.9 8.7-5.6-.3-.6-.5-1.2-.5-1.9C29 7.6 30.3 6 32 6z"
      />
    </svg>
  );
}

export default function SombreroAguila({ className = "" }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  const handleClick = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  return (
    <div className={`relative inline-flex ${className}`}>
      {/* Aguilita que sale del sombrero */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-[82%]"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 40, scale: 0.4 }}
            animate={
              reduceMotion
                ? { opacity: 1 }
                : { opacity: 1, y: [40, -28, 0], scale: 1, rotate: [0, -6, 4, 0] }
            }
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 36, scale: 0.5 }}
            transition={
              reduceMotion
                ? { duration: 0.2 }
                : { type: "spring", stiffness: 220, damping: 14, mass: 0.7 }
            }
          >
            <Aguila className="h-12 w-16 drop-shadow-lg sm:h-14 sm:w-20" />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={handleClick}
        aria-pressed={open}
        aria-label={open ? "Guardar la aguilita en el sombrero" : "Pica el sombrero para soltar la aguilita"}
        title="¡Pícame!"
        className="relative rounded-full p-1 outline-none transition-transform focus-visible:ring-2 focus-visible:ring-naranja-500"
        whileTap={reduceMotion ? undefined : { scale: 0.92, rotate: -6 }}
        animate={
          reduceMotion || open
            ? undefined
            : {
                y: [0, -14, 0],
                rotate: [-3, 3, -3],
                transition: { duration: 3.2, repeat: Infinity, ease: "easeInOut" },
              }
        }
        style={{ transformOrigin: "bottom center" }}
      >
        <Image
          src="/images/sombrero.png"
          alt="Sombrero naranja del Diputado Armando Ruiz"
          width={168}
          height={168}
          className="h-[140px] w-[140px] select-none object-contain drop-shadow-xl sm:h-[168px] sm:w-[168px]"
          priority
        />
      </motion.button>
    </div>
  );
}
