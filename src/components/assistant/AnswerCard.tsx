import type { OrientationAnswer } from "@/lib/orientation/knowledge";

/**
 * Render de una respuesta de orientacion: titulo + parrafos + links internos.
 * Compartido por el bot embebido (OrientationBot) y el asistente flotante.
 */
export default function AnswerCard({ answer }: { answer: OrientationAnswer }) {
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
