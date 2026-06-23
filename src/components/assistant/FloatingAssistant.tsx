"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Maximize2, Minimize2, Send, Sparkles, UserRound, X } from "lucide-react";
import {
  QUICK_ORIENTATION_QUESTIONS,
  type OrientationAnswer,
} from "@/lib/orientation/knowledge";
import { getAssistantReply } from "@/lib/assistant/provider";
import { cn } from "@/lib/utils";
import AnswerCard from "@/components/assistant/AnswerCard";
import EyesBubble from "@/components/assistant/EyesBubble";

type ChatMessage = {
  id: number;
  role: "bot" | "user";
  text?: string;
  answer?: OrientationAnswer;
};

const welcomeAnswer: OrientationAnswer = {
  title: "Hola, soy tu asistente de orientacion",
  body: [
    "Te ayudo a saber por donde empezar: Tarjeta Accesible, salud, apoyos economicos, becas, trabajo, vivienda y uso de esta pagina.",
    "Escribeme como puedas. Por ejemplo: \"necesito una silla de ruedas\" o \"quiero pension\".",
  ],
  links: [
    { label: "Agendar cita personal", href: "/salud/agendar" },
    { label: "Ver accesos directos", href: "/#ayuda-hoy" },
  ],
};

function initialMessages(): ChatMessage[] {
  return [{ id: 1, role: "bot", answer: welcomeAnswer }];
}

export default function FloatingAssistant() {
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const nextId = useRef(2);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll al ultimo mensaje, pero al abrir por primera vez deja visible
  // el saludo arriba (solo baja cuando ya hubo interaccion o esta escribiendo).
  useEffect(() => {
    const el = scrollRef.current;
    if (!open || !el) return;
    if (messages.length > 1 || isTyping) {
      el.scrollTop = el.scrollHeight;
    } else {
      el.scrollTop = 0;
    }
  }, [messages, isTyping, open]);

  // Foco al input al abrir; Esc cierra; clic fuera tambien cierra (sin borrar
  // la conversacion: solo se oculta, el estado se conserva).
  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    function onPointerDown(event: PointerEvent) {
      const target = event.target as Node;
      if (containerRef.current && !containerRef.current.contains(target)) {
        setOpen(false);
      }
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  async function ask(question: string) {
    const trimmed = question.trim();
    if (!trimmed || isTyping) return;

    const userMessage: ChatMessage = {
      id: nextId.current++,
      role: "user",
      text: trimmed,
    };
    setMessages((current) => [...current, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const answer = await getAssistantReply(trimmed);
      setMessages((current) => [
        ...current,
        { id: nextId.current++, role: "bot", answer },
      ]);
    } finally {
      setIsTyping(false);
      inputRef.current?.focus();
    }
  }

  return (
    <div
      ref={containerRef}
      className="fixed bottom-5 right-5 z-50 flex flex-col items-end sm:bottom-6 sm:right-6"
    >
      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="false"
            aria-label="Asistente de orientacion"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.96 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={cn(
              "mb-3 flex flex-col overflow-hidden rounded-[26px] border-2 border-naranja-200 bg-white shadow-card",
              "w-[min(92vw,380px)] h-[min(72vh,560px)]",
              expanded && "sm:w-[440px] sm:h-[min(80vh,640px)]"
            )}
          >
            {/* Encabezado */}
            <div className="flex items-start justify-between gap-3 bg-gray-900 px-4 py-4 text-white">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-2xl bg-naranja-500">
                  <Sparkles className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-[15px] font-black leading-tight">Asistente</p>
                  <p className="text-[12px] text-gray-300">Orientacion gratuita</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setExpanded((v) => !v)}
                  aria-label={expanded ? "Reducir ventana" : "Ampliar ventana"}
                  className="hidden h-9 w-9 place-items-center rounded-full text-white/80 hover:bg-white/10 sm:grid"
                >
                  {expanded ? (
                    <Minimize2 className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <Maximize2 className="h-4 w-4" aria-hidden="true" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Cerrar asistente"
                  className="grid h-9 w-9 place-items-center rounded-full text-white/80 hover:bg-white/10"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Lista de mensajes */}
            <div
              ref={scrollRef}
              aria-live="polite"
              data-lenis-prevent
              className="flex-1 space-y-4 overflow-y-auto overscroll-contain bg-warm-50 p-4"
            >
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-2",
                    message.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  {message.role === "bot" && (
                    <span className="mt-1 grid h-7 w-7 flex-shrink-0 place-items-center rounded-full bg-naranja-500 text-white">
                      <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                  )}
                  <div
                    className={cn(
                      message.role === "user"
                        ? "max-w-[80%] rounded-2xl bg-naranja-500 px-3.5 py-2.5 text-white"
                        : "max-w-[88%] rounded-2xl border border-gray-100 bg-white px-3.5 py-2.5"
                    )}
                  >
                    {message.role === "user" ? (
                      <p className="text-[14px] font-semibold leading-relaxed">
                        {message.text}
                      </p>
                    ) : (
                      message.answer && <AnswerCard answer={message.answer} />
                    )}
                  </div>
                  {message.role === "user" && (
                    <span className="mt-1 grid h-7 w-7 flex-shrink-0 place-items-center rounded-full bg-gray-900 text-white">
                      <UserRound className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-2" aria-hidden="true">
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-naranja-500 text-white">
                    <Sparkles className="h-3.5 w-3.5" />
                  </span>
                  <span className="flex gap-1 rounded-2xl border border-gray-100 bg-white px-3 py-3">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.2s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.1s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" />
                  </span>
                </div>
              )}

              {/* Tarjetas de sugerencia: solo cuando aun no hay preguntas. */}
              {messages.length === 1 && !isTyping && (
                <div className="space-y-2 pt-1">
                  <p className="px-1 text-[11px] font-black uppercase tracking-wide text-gray-500">
                    Preguntas rapidas
                  </p>
                  {QUICK_ORIENTATION_QUESTIONS.slice(0, 4).map((question) => (
                    <button
                      key={question}
                      type="button"
                      onClick={() => ask(question)}
                      className="block w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-left
                                 text-[14px] font-bold text-gray-800 transition-colors
                                 hover:border-naranja-300 hover:text-naranja-700"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Input (solo texto) */}
            <form
              className="flex items-center gap-2 border-t border-gray-100 bg-white p-3"
              onSubmit={(event) => {
                event.preventDefault();
                ask(input);
              }}
            >
              <label className="sr-only" htmlFor="assistant-input">
                Escribe tu mensaje
              </label>
              <input
                id="assistant-input"
                ref={inputRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Escribe tu mensaje..."
                className="min-h-[44px] flex-1 rounded-2xl border-2 border-gray-200 bg-white px-4
                           text-[15px] text-gray-900 outline-none focus:border-naranja-400"
              />
              <button
                type="submit"
                aria-label="Enviar mensaje"
                disabled={!input.trim() || isTyping}
                className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-full bg-naranja-500
                           text-white transition-colors hover:bg-naranja-600 disabled:opacity-40"
              >
                <Send className="h-4 w-4" aria-hidden="true" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Burbuja lanzadora con ojitos + sombrero */}
      <EyesBubble
        onClick={() => setOpen((v) => !v)}
        isOpen={open}
        label={open ? "Cerrar asistente" : "Abrir asistente de orientacion"}
      />
    </div>
  );
}
