"use client";

import type { CSSProperties } from "react";
import CircularText from "./CircularText";

// Sello decorativo sobre las fotos del diputado: solo el texto
// "DIPUTADO FEDERAL" girando en blanco, sin fondo, en una esquina de la foto.
// aria-hidden: es ornamental; el cargo ya se nombra en el copy de cada sección.
// El posicionamiento (esquina + z-index) llega por `className`.
const sealVars = {
  "--ct-size": "92px",
  "--ct-font": "12px",
  "--ct-color": "#fff",
} as CSSProperties;

export default function DiputadoFederalSeal({ className = "" }: { className?: string }) {
  return (
    <div className={className} style={sealVars} aria-hidden="true">
      <CircularText text="DIPUTADO FEDERAL · " spinDuration={18} onHover="speedUp" />
    </div>
  );
}
