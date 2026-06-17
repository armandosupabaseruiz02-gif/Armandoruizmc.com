"use client";

import { useMemo, useRef, useState } from "react";
import { Bot, Send, Sparkles, UserRound, X } from "lucide-react";
import {
  getOrientationAnswer,
  QUICK_ORIENTATION_QUESTIONS,
  type OrientationAnswer,
} from "@/lib/orientation/knowledge";

type ChatMessage = {
  id: number;
  role: "bot" | "user";
  text?: string;
  answer?: OrientationAnswer;
};

const welcomeAnswer: OrientationAnswer = {
  title: "Hola, soy tu orientador de tramites",
  body: [
    "Puedo ayudarte a saber por donde empezar: Tarjeta Accesible, salud, apoyos economicos, becas, trabajo, vivienda, cuidadores y uso de esta pagina.",
    "Escribeme como puedas. Ejemplo: \"necesito una silla de ruedas\", \"quiero pension\", \"no tengo todos mis papeles\".",
    "Para casos personales o revision de documentos, te voy a recomendar agendar cita con el equipo.",
  ],
  links: [
    { label: "Agendar cita personal", href: "/salud/agendar" },
    { label: "Ver servicios", href: "/#servicios" },
  ],
};

function AnswerBlock({ answer }: { answer: OrientationAnswer }) {
  return (
    <div>
      <p className="font-black text-gray-900 text-[15px] mb-2">{answer.title}</p>
      <div className="space-y-2">
        {answer.body.map((paragraph) => (
          <p key={paragraph} className="text-[14px] leading-relaxed text-gray-800">
            {paragraph}
          </p>
        ))}
      </div>

      {answer.links && answer.links.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {answer.links.map((link) => (
            <a
              key={link.href + link.label}
              href={link.href}
              className="inline-flex items-center rounded-full bg-naranja-50 border border-naranja-200
                         px-3 py-1.5 text-[12px] font-bold text-naranja-700
                         hover:bg-naranja-100 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export default function OrientationBot() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 1, role: "bot", answer: welcomeAnswer },
  ]);
  const [input, setInput] = useState("");
  const nextId = useRef(2);

  const latestBotAnswer = useMemo(
    () => messages.findLast((message) => message.role === "bot")?.answer,
    [messages]
  );

  function ask(question: string) {
    const trimmed = question.trim();
    if (!trimmed) return;

    const answer = getOrientationAnswer(trimmed);
    const userMessage: ChatMessage = {
      id: nextId.current++,
      role: "user",
      text: trimmed,
    };
    const botMessage: ChatMessage = {
      id: nextId.current++,
      role: "bot",
      answer,
    };

    setMessages((current) => [...current, userMessage, botMessage]);
    setInput("");
  }

  function resetChat() {
    nextId.current = 2;
    setMessages([{ id: 1, role: "bot", answer: welcomeAnswer }]);
    setInput("");
  }

  return (
    <div
      id="orientacion-gratuita"
      className="rounded-[28px] bg-white border-2 border-naranja-200 shadow-card overflow-hidden text-left"
    >
      <div className="bg-gray-900 p-5 sm:p-6 text-white">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-naranja-500 flex items-center justify-center flex-shrink-0">
              <Bot className="w-7 h-7" aria-hidden="true" />
            </div>
            <div>
              <p className="text-[12px] font-black uppercase tracking-[0.16em] text-naranja-300 mb-1">
                Orientacion gratuita
              </p>
              <h3 className="text-[24px] sm:text-[30px] font-black leading-tight">
                Preguntale al bot de tramites
              </h3>
              <p className="text-[14px] text-gray-300 mt-2 leading-relaxed">
                Te dice que tramite buscar, que papeles preparar y en que parte de la pagina seguir.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={resetChat}
            className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-2
                       text-[12px] font-bold text-white hover:bg-white/15 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            Reiniciar
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-6 bg-warm-50">
        <div
          className="h-[390px] overflow-y-auto rounded-3xl bg-white border border-gray-100 p-4 space-y-4"
          aria-live="polite"
        >
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {message.role === "bot" && (
                <div className="w-8 h-8 rounded-full bg-naranja-500 text-white flex items-center justify-center flex-shrink-0 mt-1">
                  <Sparkles className="w-4 h-4" aria-hidden="true" />
                </div>
              )}

              <div
                className={
                  message.role === "user"
                    ? "max-w-[82%] rounded-2xl bg-naranja-500 text-white px-4 py-3"
                    : "max-w-[88%] rounded-2xl bg-gray-50 border border-gray-100 px-4 py-3"
                }
              >
                {message.role === "user" ? (
                  <p className="text-[14px] leading-relaxed font-semibold">{message.text}</p>
                ) : (
                  message.answer && <AnswerBlock answer={message.answer} />
                )}
              </div>

              {message.role === "user" && (
                <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center flex-shrink-0 mt-1">
                  <UserRound className="w-4 h-4" aria-hidden="true" />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-4">
          <p className="text-[12px] font-black uppercase tracking-wide text-gray-500 mb-2">
            Preguntas rapidas
          </p>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {QUICK_ORIENTATION_QUESTIONS.map((question) => (
              <button
                key={question}
                type="button"
                onClick={() => ask(question)}
                className="whitespace-nowrap rounded-full bg-white border border-gray-200 px-3 py-2
                           text-[12px] font-bold text-gray-700 hover:border-naranja-300
                           hover:text-naranja-700 transition-colors"
              >
                {question}
              </button>
            ))}
          </div>
        </div>

        <form
          className="mt-3 flex flex-col sm:flex-row gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            ask(input);
          }}
        >
          <label className="sr-only" htmlFor="orientation-question">
            Escribe tu pregunta sobre tramites
          </label>
          <input
            id="orientation-question"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Ej. No tengo CURP y quiero apoyo..."
            className="flex-1 min-h-[52px] rounded-2xl border-2 border-gray-200 bg-white px-4
                       text-[15px] text-gray-900 outline-none focus:border-naranja-400"
          />
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 min-h-[52px] px-6 rounded-2xl
                       bg-naranja-500 text-white font-black hover:bg-naranja-600 transition-colors"
          >
            Enviar
            <Send className="w-4 h-4" aria-hidden="true" />
          </button>
        </form>

        {latestBotAnswer?.title && (
          <p className="mt-3 text-[12px] text-gray-500 leading-relaxed">
            Este bot da orientacion general. Para revisar documentos, datos personales o casos
            delicados, agenda una cita con el equipo.
          </p>
        )}
      </div>
    </div>
  );
}
