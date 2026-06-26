"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

/* ───────────────────────────────────────────────────────────────
   SOMBRERO + AGUILITA  (emblema vivo de la marca)
   Idea del diputado: un sombrero que, al picarlo, "suelta" la aguilita
   de Movimiento Ciudadano con una musiquita corta.
   - El sonido es un acorde alegre generado con Web Audio (sin archivo,
     sin musica con copyright). El jingle real se puede sustituir luego.
   - Solo suena AL PICAR (nunca autoplay) -> respeta accesibilidad.
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
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playChime = useCallback(() => {
    try {
      const Ctx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctx) return;
      const ctx = audioCtxRef.current ?? new Ctx();
      audioCtxRef.current = ctx;
      if (ctx.state === "suspended") void ctx.resume();

      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // do-mi-sol-do, alegre
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.value = freq;
        const start = now + i * 0.1;
        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.16, start + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0008, start + 0.45);
        osc.connect(gain).connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.5);
      });
    } catch {
      // Sin audio disponible: la animacion sigue funcionando igual.
    }
  }, []);

  const handleClick = useCallback(() => {
    setOpen((prev) => {
      const next = !prev;
      if (next) playChime();
      return next;
    });
  }, [playChime]);

  return (
    <div className={`relative inline-flex ${className}`}>
      {/* Aguilita que sale del sombrero */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-[78%]"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 14, scale: 0.4 }}
            animate={
              reduceMotion
                ? { opacity: 1 }
                : { opacity: 1, y: [14, -10, 0], scale: 1, rotate: [0, -6, 4, 0] }
            }
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.5 }}
            transition={
              reduceMotion
                ? { duration: 0.2 }
                : { type: "spring", stiffness: 220, damping: 14, mass: 0.7 }
            }
          >
            <Aguila className="h-9 w-12 drop-shadow-md sm:h-11 sm:w-14" />
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
        whileTap={reduceMotion ? undefined : { scale: 0.9, rotate: -6 }}
        animate={
          reduceMotion || open
            ? undefined
            : { y: [0, -3, 0], transition: { duration: 2.4, repeat: Infinity, ease: "easeInOut" } }
        }
      >
        <Image
          src="/images/sombrero.png"
          alt="Sombrero naranja del Diputado Armando Ruiz"
          width={68}
          height={68}
          className="h-14 w-14 select-none object-contain sm:h-[68px] sm:w-[68px]"
          priority
        />
      </motion.button>
    </div>
  );
}
