"use client";

import { useEffect, useRef } from "react";

/* ───────────────────────────────────────────────────────────────
   CLICK SPARK — chispitas naranjas al hacer clic (React Bits,
   adaptado a la marca):
   - Canvas fijo que no captura eventos (pointer-events: none).
   - Respeta prefers-reduced-motion: si esta activo, no dibuja nada.
   - Solo corre el rAF mientras hay chispas vivas (cero costo en reposo).
─────────────────────────────────────────────────────────────── */

const SPARK_COLOR = "#f97316";
const SPARK_COUNT = 9;
const SPARK_SIZE = 11;
const SPARK_RADIUS = 22;
const DURATION_MS = 450;

type Spark = { x: number; y: number; angle: number; start: number };

export default function ClickSpark() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sparksRef = useRef<Spark[]>([]);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const easeOut = (t: number) => t * (2 - t);

    const draw = (now: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      sparksRef.current = sparksRef.current.filter((spark) => {
        const elapsed = now - spark.start;
        if (elapsed >= DURATION_MS) return false;

        const progress = easeOut(elapsed / DURATION_MS);
        const distance = progress * SPARK_RADIUS;
        const length = SPARK_SIZE * (1 - progress);

        const x1 = spark.x + distance * Math.cos(spark.angle);
        const y1 = spark.y + distance * Math.sin(spark.angle);
        const x2 = spark.x + (distance + length) * Math.cos(spark.angle);
        const y2 = spark.y + (distance + length) * Math.sin(spark.angle);

        ctx.strokeStyle = SPARK_COLOR;
        ctx.globalAlpha = 1 - progress * 0.6;
        ctx.lineWidth = 2.4;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        return true;
      });

      ctx.globalAlpha = 1;

      if (sparksRef.current.length > 0) {
        frameRef.current = requestAnimationFrame(draw);
      } else {
        frameRef.current = null;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    const handleClick = (event: MouseEvent) => {
      if (reduceMotion.matches) return;

      const now = performance.now();
      for (let i = 0; i < SPARK_COUNT; i++) {
        sparksRef.current.push({
          x: event.clientX,
          y: event.clientY,
          angle: (2 * Math.PI * i) / SPARK_COUNT,
          start: now,
        });
      }

      if (frameRef.current === null) {
        frameRef.current = requestAnimationFrame(draw);
      }
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
      window.removeEventListener("resize", resize);
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[95]"
    />
  );
}
