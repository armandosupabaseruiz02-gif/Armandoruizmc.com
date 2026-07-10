"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { STATUS_LABEL } from "@/app/iniciativas/IniciativasList";
import {
  Eye,
  EyeOff,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";

export type IniciativaAdmin = {
  id: string;
  title: string;
  summary: string;
  description: string | null;
  status: "presentada" | "en_comisiones" | "aprobada" | "publicada";
  topic: string | null;
  presented_at: string | null;
  document_url: string | null;
  published: boolean;
  created_at: string;
};

type FormState = {
  title: string;
  summary: string;
  description: string;
  status: IniciativaAdmin["status"];
  topic: string;
  presented_at: string;
  document_url: string;
  published: boolean;
};

const EMPTY_FORM: FormState = {
  title: "",
  summary: "",
  description: "",
  status: "presentada",
  topic: "",
  presented_at: "",
  document_url: "",
  published: false,
};

const inputClass =
  "w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-[15px] text-gray-900 placeholder:text-gray-400 focus:border-naranja-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-naranja-300";

function toForm(ini: IniciativaAdmin): FormState {
  return {
    title: ini.title,
    summary: ini.summary,
    description: ini.description ?? "",
    status: ini.status,
    topic: ini.topic ?? "",
    presented_at: ini.presented_at ?? "",
    document_url: ini.document_url ?? "",
    published: ini.published,
  };
}

export default function AdminIniciativas({ iniciativas }: { iniciativas: IniciativaAdmin[] }) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | "new" | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const openNew = () => {
    setForm(EMPTY_FORM);
    setEditingId("new");
    setError(null);
  };

  const openEdit = (ini: IniciativaAdmin) => {
    setForm(toForm(ini));
    setEditingId(ini.id);
    setError(null);
  };

  const close = () => {
    setEditingId(null);
    setError(null);
  };

  const save = async () => {
    if (!form.title.trim() || !form.summary.trim()) {
      setError("El título y el resumen son obligatorios.");
      return;
    }

    setBusy(true);
    setError(null);

    const payload = {
      title: form.title.trim(),
      summary: form.summary.trim(),
      description: form.description.trim() || null,
      status: form.status,
      topic: form.topic.trim() || null,
      presented_at: form.presented_at || null,
      document_url: form.document_url.trim() || null,
      published: form.published,
    };

    try {
      const supabase = createClient();
      const query =
        editingId === "new"
          ? supabase.from("initiatives").insert(payload)
          : supabase.from("initiatives").update(payload).eq("id", editingId);
      const { error: dbError } = await query;
      if (dbError) throw dbError;
      close();
      router.refresh();
    } catch {
      setError("No se pudo guardar. Revisa tu conexión e inténtalo otra vez.");
    } finally {
      setBusy(false);
    }
  };

  const togglePublished = async (ini: IniciativaAdmin) => {
    setBusy(true);
    try {
      const supabase = createClient();
      const { error: dbError } = await supabase
        .from("initiatives")
        .update({ published: !ini.published })
        .eq("id", ini.id);
      if (dbError) throw dbError;
      router.refresh();
    } catch {
      setError("No se pudo cambiar la publicación.");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id: string) => {
    setBusy(true);
    try {
      const supabase = createClient();
      const { error: dbError } = await supabase.from("initiatives").delete().eq("id", id);
      if (dbError) throw dbError;
      setConfirmDeleteId(null);
      router.refresh();
    } catch {
      setError("No se pudo borrar la iniciativa.");
    } finally {
      setBusy(false);
    }
  };

  const formVisible = editingId !== null;

  return (
    <div className="space-y-6">
      {error && (
        <p role="alert" className="rounded-xl border-2 border-red-200 bg-red-50 px-4 py-3 text-[14px] font-bold text-red-700">
          {error}
        </p>
      )}

      {!formVisible && (
        <button
          type="button"
          onClick={openNew}
          className="btn-primary inline-flex items-center gap-2"
        >
          <Plus className="h-5 w-5" aria-hidden="true" />
          Nueva iniciativa
        </button>
      )}

      {formVisible && (
        <div className="rounded-[24px] border-2 border-naranja-200 bg-white p-6 sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-[22px] font-black text-gray-900">
              {editingId === "new" ? "Nueva iniciativa" : "Editar iniciativa"}
            </h2>
            <button
              type="button"
              onClick={close}
              aria-label="Cerrar formulario"
              className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-gray-200 text-gray-500 transition-colors hover:border-naranja-300 hover:text-naranja-600 focus-visible:outline-2 focus-visible:outline-naranja-500"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="ini-title" className="mb-1.5 block text-[14px] font-bold text-gray-800">
                Título *
              </label>
              <input
                id="ini-title"
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Ej. Reforma para garantizar accesibilidad en el transporte público"
                className={inputClass}
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="ini-summary" className="mb-1.5 block text-[14px] font-bold text-gray-800">
                Resumen corto (lo que verá la gente) *
              </label>
              <textarea
                id="ini-summary"
                value={form.summary}
                onChange={(e) => setForm({ ...form, summary: e.target.value })}
                rows={2}
                placeholder="En una o dos frases: ¿qué propone y a quién ayuda?"
                className={inputClass}
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="ini-description" className="mb-1.5 block text-[14px] font-bold text-gray-800">
                Detalle (se muestra al picar &ldquo;Leer más&rdquo;)
              </label>
              <textarea
                id="ini-description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={5}
                placeholder="Explica la propuesta con calma y sin tecnicismos."
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="ini-status" className="mb-1.5 block text-[14px] font-bold text-gray-800">
                Estado
              </label>
              <select
                id="ini-status"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as FormState["status"] })}
                className={inputClass}
              >
                {(Object.keys(STATUS_LABEL) as Array<keyof typeof STATUS_LABEL>).map((key) => (
                  <option key={key} value={key}>
                    {STATUS_LABEL[key]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="ini-topic" className="mb-1.5 block text-[14px] font-bold text-gray-800">
                Tema (opcional)
              </label>
              <input
                id="ini-topic"
                type="text"
                value={form.topic}
                onChange={(e) => setForm({ ...form, topic: e.target.value })}
                placeholder="Ej. Accesibilidad, Salud, Trabajo"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="ini-date" className="mb-1.5 block text-[14px] font-bold text-gray-800">
                Fecha de presentación
              </label>
              <input
                id="ini-date"
                type="date"
                value={form.presented_at}
                onChange={(e) => setForm({ ...form, presented_at: e.target.value })}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="ini-doc" className="mb-1.5 block text-[14px] font-bold text-gray-800">
                Enlace al documento oficial (opcional)
              </label>
              <input
                id="ini-doc"
                type="url"
                value={form.document_url}
                onChange={(e) => setForm({ ...form, document_url: e.target.value })}
                placeholder="https://gaceta.diputados.gob.mx/..."
                className={inputClass}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="flex min-h-11 cursor-pointer items-center gap-3 text-[15px] font-bold text-gray-800">
                <input
                  type="checkbox"
                  checked={form.published}
                  onChange={(e) => setForm({ ...form, published: e.target.checked })}
                  className="h-5 w-5 rounded border-2 border-gray-300 accent-naranja-500"
                />
                Publicar en la página (visible para todos)
              </label>
            </div>
          </div>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={save}
              disabled={busy}
              className="btn-primary inline-flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {busy && <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />}
              Guardar
            </button>
            <button
              type="button"
              onClick={close}
              className="inline-flex min-h-[52px] items-center justify-center rounded-full border-2 border-gray-200 bg-white px-6 text-[15px] font-bold text-gray-700 transition-colors hover:border-naranja-200 hover:bg-naranja-50 focus-visible:outline-2 focus-visible:outline-naranja-500"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Lista */}
      {iniciativas.length === 0 && !formVisible ? (
        <p className="rounded-[24px] border-2 border-dashed border-gray-300 bg-white p-8 text-center text-[16px] text-gray-500">
          Todavía no hay iniciativas. Crea la primera con el botón de arriba.
        </p>
      ) : (
        <ul className="space-y-4">
          {iniciativas.map((ini) => (
            <li key={ini.id} className="rounded-[24px] border-2 border-gray-100 bg-white p-5 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.1em] ${
                        ini.published ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {ini.published ? "Publicada en el sitio" : "Borrador (oculta)"}
                    </span>
                    <span className="text-[12px] font-bold uppercase tracking-[0.1em] text-naranja-600">
                      {STATUS_LABEL[ini.status]}
                    </span>
                  </div>
                  <h3 className="mt-2 text-[19px] font-black leading-snug text-gray-900">{ini.title}</h3>
                  <p className="mt-1 text-[14px] leading-relaxed text-gray-600">{ini.summary}</p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => togglePublished(ini)}
                    disabled={busy}
                    className="inline-flex min-h-11 items-center gap-2 rounded-full border-2 border-gray-200 bg-white px-4 text-[13px] font-bold text-gray-700 transition-colors hover:border-naranja-300 hover:text-naranja-700 focus-visible:outline-2 focus-visible:outline-naranja-500 disabled:opacity-60"
                  >
                    {ini.published ? (
                      <>
                        <EyeOff className="h-4 w-4" aria-hidden="true" /> Ocultar
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4" aria-hidden="true" /> Publicar
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => openEdit(ini)}
                    className="inline-flex min-h-11 items-center gap-2 rounded-full border-2 border-gray-200 bg-white px-4 text-[13px] font-bold text-gray-700 transition-colors hover:border-naranja-300 hover:text-naranja-700 focus-visible:outline-2 focus-visible:outline-naranja-500"
                  >
                    <Pencil className="h-4 w-4" aria-hidden="true" /> Editar
                  </button>
                  {confirmDeleteId === ini.id ? (
                    <span className="inline-flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => remove(ini.id)}
                        disabled={busy}
                        className="inline-flex min-h-11 items-center rounded-full bg-red-600 px-4 text-[13px] font-bold text-white transition-colors hover:bg-red-700 focus-visible:outline-2 focus-visible:outline-red-600 disabled:opacity-60"
                      >
                        Sí, borrar
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(null)}
                        className="inline-flex min-h-11 items-center rounded-full border-2 border-gray-200 px-4 text-[13px] font-bold text-gray-700 hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-naranja-500"
                      >
                        Cancelar
                      </button>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteId(ini.id)}
                      className="inline-flex min-h-11 items-center gap-2 rounded-full border-2 border-red-100 bg-white px-4 text-[13px] font-bold text-red-600 transition-colors hover:border-red-300 hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-red-500"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" /> Borrar
                    </button>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
