"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";

/*
  Diálogo de confirmación accesible y on-brand.
  Reemplaza a los prompt()/confirm() nativos del navegador.
  - role="dialog" + aria-modal, cierre con Escape y clic en el fondo
  - Botones grandes (≥56px) y foco inicial en la acción segura (Cancelar)
  - Campo de texto opcional (p. ej. motivo de cancelación)
*/

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel: string;
  cancelLabel?: string;
  /** "danger" = acción destructiva (rojo); "primary" = naranja de marca */
  tone?: "danger" | "primary";
  /** Si se define, muestra un textarea y pasa su valor a onConfirm */
  inputLabel?: string;
  inputPlaceholder?: string;
  loading?: boolean;
  onConfirm: (inputValue: string) => void;
  onClose: () => void;
}

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel = "Volver",
  tone = "danger",
  inputLabel,
  inputPlaceholder,
  loading = false,
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  const [inputValue, setInputValue] = useState("");
  const cancelRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Reset del input al abrir — patrón recomendado por React:
  // ajustar estado durante el render (sin efecto) cuando cambia una prop.
  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) setInputValue("");
  }

  // Foco inicial + cierre con Escape
  useEffect(() => {
    if (!open) return;
    cancelRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      if (e.key !== "Tab" || !dialogRef.current) return;

      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
        )
      ).filter((element) => element.offsetParent !== null);

      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const confirmClasses =
    tone === "danger"
      ? "bg-red-600 hover:bg-red-700 focus-visible:ring-red-300"
      : "bg-naranja-500 hover:bg-naranja-600 focus-visible:ring-naranja-300";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          {/* Fondo */}
          <div
            className="absolute inset-0 bg-gray-900/50 backdrop-blur-[2px]"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Diálogo */}
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-dialog-title"
            className="relative w-full max-w-md bg-white rounded-card border-2 border-gray-100 shadow-2xl p-6 sm:p-8"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-10 h-10 rounded-xl flex items-center justify-center
                         text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors
                         focus-visible:outline-2 focus-visible:outline-naranja-500"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>

            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center mb-4
                ${tone === "danger" ? "bg-red-100" : "bg-naranja-100"}`}
              aria-hidden="true"
            >
              <AlertTriangle
                className={`w-6 h-6 ${tone === "danger" ? "text-red-600" : "text-naranja-600"}`}
              />
            </div>

            <h2 id="confirm-dialog-title" className="text-[20px] font-black text-gray-900 mb-2 pr-8">
              {title}
            </h2>
            {description && (
              <p className="text-[15px] text-gray-700 leading-relaxed mb-5">{description}</p>
            )}

            {inputLabel && (
              <div className="mb-5">
                <label
                  htmlFor="confirm-dialog-input"
                  className="block text-[13px] font-semibold text-gray-700 mb-1.5"
                >
                  {inputLabel}
                </label>
                <textarea
                  id="confirm-dialog-input"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={inputPlaceholder}
                  rows={2}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-naranja-400
                             outline-none text-[15px] text-gray-900 transition-colors resize-none"
                />
              </div>
            )}

            <div className="flex flex-col-reverse sm:flex-row gap-3 mt-2">
              <button
                ref={cancelRef}
                onClick={onClose}
                disabled={loading}
                className="flex-1 inline-flex items-center justify-center min-h-[56px] px-6
                           bg-white text-gray-700 font-bold text-[16px]
                           rounded-2xl border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50
                           transition-all duration-200 disabled:opacity-50
                           focus-visible:ring-4 focus-visible:ring-naranja-200"
              >
                {cancelLabel}
              </button>
              <button
                onClick={() => onConfirm(inputValue.trim())}
                disabled={loading}
                className={`flex-1 inline-flex items-center justify-center min-h-[56px] px-6
                            text-white font-bold text-[16px] rounded-2xl shadow-md
                            transition-all duration-200 disabled:opacity-60
                            focus-visible:ring-4 ${confirmClasses}`}
              >
                {loading ? "Procesando…" : confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
