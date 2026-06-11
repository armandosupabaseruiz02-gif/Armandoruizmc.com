"use client";

import { motion, Variants } from "framer-motion";
import { ReactNode } from "react";

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  distance?: number;
  className?: string;
  once?: boolean;
}

export default function FadeIn({
  children,
  delay = 0,
  duration = 0.7,
  direction = "up",
  distance = 40,
  className,
  once = true,
}: FadeInProps) {
  const directionMap = {
    up:    { y: distance },
    down:  { y: -distance },
    left:  { x: distance },
    right: { x: -distance },
    none:  {},
  };

  const variants: Variants = {
    hidden: { opacity: 0, ...directionMap[direction] },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration,
        delay,
        // Curva premium: arranque decidido, frenado muy suave
        ease: [0.21, 0.65, 0.32, 1],
      },
    },
  };

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-80px" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* Stagger container */
export function StaggerContainer({
  children,
  stagger = 0.1,
  delay = 0,
  className,
}: {
  children: ReactNode;
  stagger?: number;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: stagger, delayChildren: delay },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
  direction = "up",
  distance = 30,
}: {
  children: ReactNode;
  className?: string;
  direction?: "up" | "left" | "right" | "none";
  distance?: number;
}) {
  const dirMap = {
    up:    { y: distance },
    left:  { x: distance },
    right: { x: -distance },
    none:  {},
  };

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, scale: 0.97, ...dirMap[direction] },
        visible: {
          opacity: 1,
          scale: 1,
          x: 0,
          y: 0,
          // Resorte físico: las cards "aterrizan" con vida propia
          // (solo transform → barato incluso en celulares de gama baja)
          transition: { type: "spring", stiffness: 120, damping: 17, mass: 0.9 },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
