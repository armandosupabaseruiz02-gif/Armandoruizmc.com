"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import "./GradientText.css";

/* ───────────────────────────────────────────────────────────────
   GRADIENT TEXT (React Bits) adaptado a la marca:
   - framer-motion existente (no se instala `motion`).
   - Paleta naranja por defecto (nada de morados/azules frios).
   - Con prefers-reduced-motion el degradado queda fijo, sin animar.
─────────────────────────────────────────────────────────────── */

type GradientDirection = "horizontal" | "vertical" | "diagonal";

interface GradientTextProps {
  children: ReactNode;
  className?: string;
  colors?: string[];
  animationSpeed?: number;
  showBorder?: boolean;
  direction?: GradientDirection;
  pauseOnHover?: boolean;
  yoyo?: boolean;
}

const BRAND_COLORS = ["#9a3412", "#ea580c", "#ff6b00", "#ea580c", "#9a3412"];

export default function GradientText({
  children,
  className = "",
  colors = BRAND_COLORS,
  animationSpeed = 8,
  showBorder = false,
  direction = "horizontal",
  pauseOnHover = false,
  yoyo = true,
}: GradientTextProps) {
  const [isPaused, setIsPaused] = useState(false);
  const reduceMotion = useReducedMotion();
  const progress = useMotionValue(0);
  const elapsedRef = useRef(0);
  const lastTimeRef = useRef<number | null>(null);

  const animationDuration = animationSpeed * 1000;

  useAnimationFrame((time) => {
    if (isPaused || reduceMotion) {
      lastTimeRef.current = null;
      return;
    }

    if (lastTimeRef.current === null) {
      lastTimeRef.current = time;
      return;
    }

    const deltaTime = time - lastTimeRef.current;
    lastTimeRef.current = time;
    elapsedRef.current += deltaTime;

    if (yoyo) {
      const fullCycle = animationDuration * 2;
      const cycleTime = elapsedRef.current % fullCycle;

      if (cycleTime < animationDuration) {
        progress.set((cycleTime / animationDuration) * 100);
      } else {
        progress.set(100 - ((cycleTime - animationDuration) / animationDuration) * 100);
      }
    } else {
      // Avanza sin regresar para que el loop no tenga brinco.
      progress.set((elapsedRef.current / animationDuration) * 100);
    }
  });

  useEffect(() => {
    elapsedRef.current = 0;
    progress.set(0);
  }, [animationSpeed, progress, yoyo]);

  const backgroundPosition = useTransform(progress, (p) => {
    if (direction === "vertical") {
      return `50% ${p}%`;
    }
    // horizontal y diagonal se mueven solo en X para evitar interferencias.
    return `${p}% 50%`;
  });

  const handleMouseEnter = useCallback(() => {
    if (pauseOnHover) setIsPaused(true);
  }, [pauseOnHover]);

  const handleMouseLeave = useCallback(() => {
    if (pauseOnHover) setIsPaused(false);
  }, [pauseOnHover]);

  const gradientAngle =
    direction === "horizontal" ? "to right" : direction === "vertical" ? "to bottom" : "to bottom right";
  // El primer color se repite al final para que el ciclo no corte.
  const gradientColors = [...colors, colors[0]].join(", ");

  const gradientStyle = {
    backgroundImage: `linear-gradient(${gradientAngle}, ${gradientColors})`,
    backgroundSize:
      direction === "horizontal" ? "300% 100%" : direction === "vertical" ? "100% 300%" : "300% 300%",
    backgroundRepeat: "repeat",
  };

  return (
    <motion.div
      className={`animated-gradient-text ${showBorder ? "with-border" : ""} ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {showBorder && (
        <motion.div className="gradient-overlay" style={{ ...gradientStyle, backgroundPosition }} />
      )}
      <motion.div className="text-content" style={{ ...gradientStyle, backgroundPosition }}>
        {children}
      </motion.div>
    </motion.div>
  );
}
