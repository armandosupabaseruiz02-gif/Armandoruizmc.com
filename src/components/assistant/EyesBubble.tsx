"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useAnimationControls, useReducedMotion } from "framer-motion";

type EyesBubbleProps = {
  onClick: () => void;
  label: string;
  /** true cuando el panel ya esta abierto. */
  isOpen?: boolean;
};

const MAX_PUPIL_OFFSET = 4; // px que la pupila se desplaza hacia el cursor

/**
 * Burbuja lanzadora del asistente: un circulo naranja con dos ojos cuyas
 * pupilas siguen el mouse y un sombrero ranchero "puesto" encima. El sombrero
 * saluda cada 3s y cada 10s aparece un signo de interrogacion (para dar a
 * entender que es para dudas). Cuando el panel esta abierto NO hay animacion.
 * Respeta prefers-reduced-motion.
 */
export default function EyesBubble({ onClick, label, isOpen }: EyesBubbleProps) {
  const reduceMotion = useReducedMotion();
  const bubbleRef = useRef<HTMLButtonElement>(null);
  const [pupil, setPupil] = useState({ x: 0, y: 0 });
  const frame = useRef<number | null>(null);
  const hatControls = useAnimationControls();
  const bubbleControls = useAnimationControls();

  const animationsActive = !reduceMotion && !isOpen;

  // Saludo del sombrero: una venia rapida que se repite cada 3 segundos.
  // Base derecha (rotate 0) para que se vea bien "puesto".
  const startHatIdle = useCallback(() => {
    if (!animationsActive) {
      hatControls.set({ rotate: 0, y: 0 });
      return;
    }
    hatControls.start({
      rotate: [0, 11, -5, 7, 0],
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeInOut",
        repeat: Infinity,
        repeatDelay: 2.2, // 0.8s saludo + 2.2s pausa = 3s por ciclo
      },
    });
  }, [animationsActive, hatControls]);

  useEffect(() => {
    startHatIdle();
  }, [startHatIdle]);

  // Seguimiento del mouse (desactivado si el usuario pide menos movimiento).
  useEffect(() => {
    if (reduceMotion) return;

    function handleMove(event: MouseEvent) {
      if (frame.current !== null) return;
      frame.current = window.requestAnimationFrame(() => {
        frame.current = null;
        const el = bubbleRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const angle = Math.atan2(event.clientY - cy, event.clientX - cx);
        setPupil({
          x: Math.cos(angle) * MAX_PUPIL_OFFSET,
          y: Math.sin(angle) * MAX_PUPIL_OFFSET,
        });
      });
    }

    window.addEventListener("mousemove", handleMove);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      if (frame.current !== null) window.cancelAnimationFrame(frame.current);
    };
  }, [reduceMotion]);

  const handleClick = useCallback(() => {
    onClick();
    if (reduceMotion) return;
    bubbleControls.start({
      scale: [1, 0.9, 1.06, 1],
      transition: { duration: 0.45, ease: "easeOut" },
    });
  }, [reduceMotion, onClick, bubbleControls]);

  return (
    <motion.button
      ref={bubbleRef}
      type="button"
      onClick={handleClick}
      aria-label={label}
      aria-expanded={isOpen}
      animate={bubbleControls}
      whileHover={reduceMotion ? undefined : { scale: 1.05 }}
      whileTap={reduceMotion ? undefined : { scale: 0.92 }}
      className="relative grid h-16 w-16 place-items-center rounded-full bg-naranja-500
                 shadow-btn-glow ring-4 ring-white/70 outline-none
                 focus-visible:ring-naranja-300 focus-visible:ring-offset-2"
    >
      {/* Signo de interrogacion: aparece cada 10s, "como con una duda". */}
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute -right-2 -top-3 grid h-6 w-6 place-items-center
                   rounded-full border-2 border-naranja-400 bg-white text-[14px] font-black
                   text-naranja-600 shadow-md"
        initial={{ opacity: 0, scale: 0.4 }}
        animate={
          animationsActive
            ? {
                opacity: [0, 0, 1, 1, 0],
                scale: [0.4, 0.4, 1, 1, 0.5],
                y: [4, 4, -2, -5, -9],
                rotate: [-8, -8, 0, 6, 0],
              }
            : { opacity: 0, scale: 0.4, y: 0 }
        }
        transition={
          animationsActive
            ? {
                duration: 6,
                times: [0, 0.35, 0.45, 0.7, 0.85],
                repeat: Infinity,
                ease: "easeInOut",
              }
            : { duration: 0.2 }
        }
      >
        ?
      </motion.span>

      {/* Sombrero puesto encima de los ojos (50% mas grande).
          Wrapper CSS para centrar; motion interno solo anima rotate/y. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 -top-[55px] -translate-x-1/2"
      >
        <motion.span
          animate={hatControls}
          initial={{ rotate: 0 }}
          style={{ originX: 0.5, originY: 1, display: "block" }}
        >
          {/* Diseno original (sombrero.png), proporcion 1.25 (mas ancho que alto),
              escalado mas grande y sentado sobre la cabeza. Puede salirse a lo ancho. */}
          <Image
            src="/images/sombrero.png"
            alt=""
            width={120}
            height={96}
            className="h-[96px] w-[120px] drop-shadow-md"
            priority
          />
        </motion.span>
      </span>

      {/* Ojos */}
      <span className="mt-2 flex items-center gap-1.5" aria-hidden="true">
        {[0, 1].map((i) => (
          <span
            key={i}
            className="relative grid h-5 w-4 place-items-center rounded-full bg-white"
          >
            <span
              className="h-2.5 w-2.5 rounded-full bg-gray-900 transition-transform duration-75"
              style={{ transform: `translate(${pupil.x}px, ${pupil.y}px)` }}
            />
          </span>
        ))}
      </span>
    </motion.button>
  );
}
