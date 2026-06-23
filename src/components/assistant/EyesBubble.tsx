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
 * pupilas siguen el mouse y un sombrero ranchero "puesto" encima. Al picarla
 * rebota y el sombrero brinca. Respeta prefers-reduced-motion.
 */
export default function EyesBubble({ onClick, label, isOpen }: EyesBubbleProps) {
  const reduceMotion = useReducedMotion();
  const bubbleRef = useRef<HTMLButtonElement>(null);
  const [pupil, setPupil] = useState({ x: 0, y: 0 });
  const frame = useRef<number | null>(null);
  const hatControls = useAnimationControls();
  const bubbleControls = useAnimationControls();

  // Balanceo "idle" del sombrero (un solo control imperativo).
  const startHatIdle = useCallback(() => {
    if (reduceMotion) {
      hatControls.set({ rotate: -8, y: 0 });
      return;
    }
    hatControls.start({
      rotate: [-8, -4, -8],
      transition: { duration: 4, repeat: Infinity, ease: "easeInOut" },
    });
  }, [reduceMotion, hatControls]);

  useEffect(() => {
    startHatIdle();
  }, [startHatIdle]);

  // Seguimiento del mouse (desactivado si el usuario pide menos movimiento;
  // las pupilas se quedan en su posicion inicial centrada).
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

  const handleClick = useCallback(async () => {
    onClick();
    if (reduceMotion) return;
    // La burbuja rebota y el sombrero brinca; luego retoma el balanceo idle.
    bubbleControls.start({
      scale: [1, 0.9, 1.06, 1],
      transition: { duration: 0.45, ease: "easeOut" },
    });
    await hatControls.start({
      rotate: [-8, 8, -8],
      y: [0, -10, 0],
      transition: { duration: 0.5, ease: "easeOut" },
    });
    startHatIdle();
  }, [reduceMotion, onClick, bubbleControls, hatControls, startHatIdle]);

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
      {/* Sombrero puesto encima de los ojos.
          Wrapper CSS para centrar; motion interno solo anima rotate/y. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 -top-6 -translate-x-1/2"
      >
        <motion.span
          animate={hatControls}
          initial={{ rotate: -8 }}
          style={{ originX: 0.5, originY: 1, display: "block" }}
        >
          <Image
            src="/images/sombrero.png"
            alt=""
            width={75}
            height={60}
            className="h-[60px] w-[75px] drop-shadow-md"
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
