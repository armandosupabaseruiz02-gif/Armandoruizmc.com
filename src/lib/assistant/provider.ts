import {
  getOrientationAnswer,
  type OrientationAnswer,
} from "@/lib/orientation/knowledge";

/**
 * Punto unico ("enchufe") por donde el asistente flotante obtiene su respuesta.
 *
 * FASE 1 (hoy): usa el bot de reglas local (getOrientationAnswer). Sin IA, sin
 * costo, funciona offline.
 *
 * FASE 2 (cuando el equipo apruebe la IA y haya ANTHROPIC_API_KEY en Vercel):
 * cambiar el cuerpo de getAssistantReply por una llamada a `/api/assistant`
 * (Claude con streaming), dejando getOrientationAnswer como respaldo si la API
 * falla. La UI (burbuja, ojos, panel) NO cambia: solo este archivo.
 */

export type AssistantTurn = {
  role: "user" | "bot";
  text?: string;
};

/** Indica si la IA esta activa. Hoy false; en Fase 2 se vuelve un flag real. */
export const ASSISTANT_AI_ENABLED = false;

/**
 * Devuelve la respuesta del asistente. Async a proposito para que la UI muestre
 * el indicador "escribiendo..." y para que el cambio a `fetch` en Fase 2 no
 * altere la firma.
 */
export async function getAssistantReply(
  question: string,
  _history: AssistantTurn[] = []
): Promise<OrientationAnswer> {
  // Pequeno retardo para que se sienta natural (indicador de escritura).
  await new Promise((resolve) => setTimeout(resolve, 350));
  return getOrientationAnswer(question);
}
