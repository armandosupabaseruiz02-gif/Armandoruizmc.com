"use client";

import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { HelpCircle } from "lucide-react";
import "./InfoHint.css";

type InfoHintProps = {
  /** Nombre del área (encabezado del globito). */
  title: string;
  /** Explicación corta de para qué sirve. */
  text: string;
  /** Clases para posicionar el botón "?" dentro de su contenedor. */
  className?: string;
};

type PopPos = { top: number; left: number; placement: "top" | "bottom" };

export default function InfoHint({ title, text, className = "" }: InfoHintProps) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<PopPos | null>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const popRef = useRef<HTMLDivElement>(null);
  const popId = useId();

  const computePos = (): PopPos | null => {
    const b = btnRef.current?.getBoundingClientRect();
    if (!b) return null;
    const width = Math.min(280, window.innerWidth - 24);
    const placement: "top" | "bottom" = b.top > 240 ? "top" : "bottom";
    let left = b.right - width;
    left = Math.max(12, Math.min(left, window.innerWidth - width - 12));
    const top = placement === "top" ? b.top - 10 : b.bottom + 10;
    return { top, left, placement };
  };

  const toggle = () => {
    setOpen((prev) => {
      const next = !prev;
      if (next) setPos(computePos());
      return next;
    });
  };

  // Cerrar al tocar fuera, con Escape, o al hacer scroll / cambiar el tamaño.
  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!popRef.current?.contains(t) && !btnRef.current?.contains(t)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [open]);

  const popStyle: CSSProperties = pos
    ? {
        position: "fixed",
        top: pos.top,
        left: pos.left,
        transform: pos.placement === "top" ? "translateY(-100%)" : "none",
      }
    : { display: "none" };

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        className={`info-hint-btn ${open ? "info-hint-btn--open" : ""} ${className}`}
        aria-label={`Qué es ${title}`}
        aria-expanded={open}
        aria-controls={popId}
        onClick={toggle}
      >
        <HelpCircle className="info-hint-icon" aria-hidden="true" />
      </button>
      {open
        ? createPortal(
            <div
              ref={popRef}
              id={popId}
              role="dialog"
              aria-label={title}
              className="info-hint-pop"
              style={popStyle}
            >
              <p className="info-hint-pop__title">{title}</p>
              <p className="info-hint-pop__text">{text}</p>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
