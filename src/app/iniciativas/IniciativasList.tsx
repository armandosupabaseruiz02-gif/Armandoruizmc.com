"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown, ExternalLink, FileText } from "lucide-react";

export type Iniciativa = {
  id: string;
  title: string;
  summary: string;
  description: string | null;
  status: "presentada" | "en_comisiones" | "aprobada" | "publicada";
  topic: string | null;
  presented_at: string | null;
  document_url: string | null;
};

export const STATUS_LABEL: Record<Iniciativa["status"], string> = {
  presentada: "Presentada",
  en_comisiones: "En comisiones",
  aprobada: "Aprobada",
  publicada: "Publicada",
};

const STATUS_STYLE: Record<Iniciativa["status"], string> = {
  presentada: "border-naranja-200 bg-naranja-50 text-naranja-700",
  en_comisiones: "border-amber-300 bg-amber-50 text-amber-800",
  aprobada: "border-emerald-300 bg-emerald-50 text-emerald-800",
  publicada: "border-emerald-600 bg-emerald-600 text-white",
};

function formatDate(dateStr: string | null) {
  if (!dateStr) return null;
  const date = new Date(`${dateStr}T12:00:00`);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("es-MX", { day: "numeric", month: "long", year: "numeric" }).format(date);
}

export default function IniciativasList({ iniciativas }: { iniciativas: Iniciativa[] }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();

  if (iniciativas.length === 0) {
    return (
      <div className="rounded-[28px] border-2 border-dashed border-naranja-200 bg-warm-50 p-10 text-center">
        <FileText className="mx-auto h-10 w-10 text-naranja-400" aria-hidden="true" />
        <h3 className="mt-4 text-[22px] font-black text-gray-900">
          Estamos preparando esta lista
        </h3>
        <p className="mx-auto mt-2 max-w-md text-[16px] leading-relaxed text-gray-600">
          Muy pronto vas a poder leer aquí, con peras y manzanas, cada iniciativa
          que el diputado presenta en la Cámara.
        </p>
      </div>
    );
  }

  return (
    <ol className="divide-y divide-gray-200 border-t border-gray-200">
      {iniciativas.map((ini, index) => {
        const open = openId === ini.id;
        const fecha = formatDate(ini.presented_at);
        const hasDetail = Boolean(ini.description || ini.document_url);

        return (
          <li key={ini.id}>
            <article aria-labelledby={`ini-titulo-${ini.id}`} className="py-8 sm:py-10">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-[150px_1fr] sm:gap-10">
                {/* Columna editorial: numero + fecha */}
                <div className="flex items-baseline gap-4 sm:block">
                  <p className="text-[15px] font-black tracking-tight text-naranja-500" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  {fecha && (
                    <p className="mt-0 text-[13px] leading-snug text-gray-500 sm:mt-2">{fecha}</p>
                  )}
                  {ini.topic && (
                    <p className="mt-0 hidden text-[12px] font-bold uppercase tracking-[0.12em] text-gray-400 sm:mt-3 sm:block">
                      {ini.topic}
                    </p>
                  )}
                </div>

                {/* Contenido */}
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-[0.12em] ${STATUS_STYLE[ini.status]}`}
                    >
                      {STATUS_LABEL[ini.status]}
                    </span>
                    {ini.topic && (
                      <span className="text-[12px] font-bold uppercase tracking-[0.12em] text-gray-400 sm:hidden">
                        {ini.topic}
                      </span>
                    )}
                  </div>

                  <h3
                    id={`ini-titulo-${ini.id}`}
                    className="mt-3 text-[24px] font-black leading-snug tracking-tight text-gray-950 sm:text-[30px]"
                  >
                    {ini.title}
                  </h3>

                  <p className="mt-3 max-w-3xl text-[16px] leading-relaxed text-gray-600 sm:text-[17px]">
                    {ini.summary}
                  </p>

                  {hasDetail && (
                    <>
                      <button
                        type="button"
                        onClick={() => setOpenId(open ? null : ini.id)}
                        aria-expanded={open}
                        aria-controls={`ini-detalle-${ini.id}`}
                        className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full border-2 border-gray-200 bg-white px-5 text-[14px] font-bold text-gray-800 transition-colors hover:border-naranja-300 hover:bg-naranja-50 hover:text-naranja-700 focus-visible:outline-2 focus-visible:outline-naranja-500"
                      >
                        {open ? "Cerrar detalle" : "Leer más"}
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
                          aria-hidden="true"
                        />
                      </button>

                      <AnimatePresence initial={false}>
                        {open && (
                          <motion.div
                            id={`ini-detalle-${ini.id}`}
                            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
                            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, height: "auto" }}
                            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="overflow-hidden"
                          >
                            <div className="mt-5 max-w-3xl rounded-2xl border border-naranja-100 bg-warm-50 p-6">
                              {ini.description && (
                                <p className="whitespace-pre-line text-[15px] leading-relaxed text-gray-700">
                                  {ini.description}
                                </p>
                              )}
                              {ini.document_url && (
                                <a
                                  href={ini.document_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="mt-4 inline-flex min-h-11 items-center gap-2 text-[14px] font-bold text-naranja-700 underline decoration-naranja-300 underline-offset-4 transition-colors hover:text-naranja-800 focus-visible:outline-2 focus-visible:outline-naranja-500"
                                >
                                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                                  Leer el documento oficial
                                </a>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  )}
                </div>
              </div>
            </article>
          </li>
        );
      })}
    </ol>
  );
}
