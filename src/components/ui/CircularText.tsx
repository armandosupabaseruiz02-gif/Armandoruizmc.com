"use client";

import { useEffect } from "react";
import {
  motion,
  useAnimation,
  useMotionValue,
  useReducedMotion,
  type Transition,
} from "framer-motion";
import "./CircularText.css";

type OnHover = "slowDown" | "speedUp" | "pause" | "goBonkers";

type CircularTextProps = {
  text: string;
  spinDuration?: number;
  onHover?: OnHover;
  className?: string;
};

const getRotationTransition = (duration: number, from: number, loop = true): Transition => ({
  from,
  ease: "linear",
  duration,
  type: "tween",
  repeat: loop ? Infinity : 0,
});

const getTransition = (duration: number, from: number): Transition => {
  const transition: Transition = {
    rotate: getRotationTransition(duration, from),
    scale: { type: "spring", damping: 20, stiffness: 300 },
  };
  return transition;
};

export default function CircularText({
  text,
  spinDuration = 20,
  onHover = "speedUp",
  className = "",
}: CircularTextProps) {
  const letters = Array.from(text);
  const controls = useAnimation();
  const rotation = useMotionValue(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    // Sin movimiento: anillo estático, sin giro infinito (accesibilidad).
    if (reduceMotion) {
      controls.set({ rotate: 0, scale: 1 });
      return;
    }
    const start = rotation.get();
    controls.start({
      rotate: start + 360,
      scale: 1,
      transition: getTransition(spinDuration, start),
    });
  }, [spinDuration, text, onHover, controls, rotation, reduceMotion]);

  const handleHoverStart = () => {
    if (reduceMotion || !onHover) return;
    const start = rotation.get();

    let transitionConfig: Transition;
    let scaleVal = 1;

    switch (onHover) {
      case "slowDown":
        transitionConfig = getTransition(spinDuration * 2, start);
        break;
      case "speedUp":
        transitionConfig = getTransition(spinDuration / 4, start);
        break;
      case "pause":
        transitionConfig = {
          rotate: { type: "spring", damping: 20, stiffness: 300 },
          scale: { type: "spring", damping: 20, stiffness: 300 },
        };
        break;
      case "goBonkers":
        transitionConfig = getTransition(spinDuration / 20, start);
        scaleVal = 0.8;
        break;
      default:
        transitionConfig = getTransition(spinDuration, start);
    }

    controls.start({ rotate: start + 360, scale: scaleVal, transition: transitionConfig });
  };

  const handleHoverEnd = () => {
    if (reduceMotion) return;
    const start = rotation.get();
    controls.start({
      rotate: start + 360,
      scale: 1,
      transition: getTransition(spinDuration, start),
    });
  };

  return (
    <motion.div
      className={`circular-text ${className}`}
      style={{ rotate: rotation }}
      initial={{ rotate: 0 }}
      animate={controls}
      onMouseEnter={handleHoverStart}
      onMouseLeave={handleHoverEnd}
      aria-hidden="true"
    >
      {letters.map((letter, i) => {
        const rotationDeg = (360 / letters.length) * i;
        const factor = Math.PI / letters.length;
        const x = factor * i;
        const y = factor * i;
        const transform = `rotateZ(${rotationDeg}deg) translate3d(${x}px, ${y}px, 0)`;

        return (
          <span key={i} style={{ transform, WebkitTransform: transform }}>
            {letter}
          </span>
        );
      })}
    </motion.div>
  );
}
