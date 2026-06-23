"use client";

import { useEffect, useId, useRef, useState } from "react";
import { X } from "lucide-react";

type RequestType =
  | "job_application"
  | "vacancy_registration"
  | "ally"
  | "donation"
  | "accessibility"
  | "general";

type InternalRequestButtonProps = {
  requestType: RequestType;
  subject: string;
  triggerLabel: string;
  title: string;
  description: string;
  messageLabel?: string;
  messagePlaceholder?: string;
  organizationLabel?: string;
  requireOrganization?: boolean;
  metadata?: Record<string, string | number | boolean | null>;
  className?: string;
  children?: React.ReactNode;
};

type SubmitState = "idle" | "loading" | "success" | "error";

export default function InternalRequestButton({
  requestType,
  subject,
  triggerLabel,
  title,
  description,
  messageLabel = "Cuéntanos qué necesitas",
  messagePlaceholder = "Escribe aquí los detalles importantes...",
  organizationLabel = "Organización o empresa",
  requireOrganization = false,
  metadata = {},
  className = "btn-primary inline-flex",
  children,
}: InternalRequestButtonProps) {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<SubmitState>("idle");
  const [error, setError] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState("");
  const [openedAt, setOpenedAt] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const fullNameRef = useRef<HTMLInputElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  function closeModal() {
    if (state === "loading") return;
    setOpen(false);
    setError("");
  }

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusId = requestAnimationFrame(() => fullNameRef.current?.focus());

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        if (state !== "loading") {
          setOpen(false);
          setError("");
        }
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      ).filter((element) => element.offsetParent !== null);

      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      cancelAnimationFrame(focusId);
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, state]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("loading");
    setError("");

    if (website || (openedAt && Date.now() - openedAt < 1500)) {
      setState("success");
      return;
    }

    if (!consent) {
      setError("Necesitamos tu autorizacion para usar estos datos y dar seguimiento.");
      setState("error");
      return;
    }

    try {
      const response = await fetch("/api/contact-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestType,
          fullName,
          phone,
          email,
          organization,
          website,
          openedAt,
          consent,
          subject,
          message,
          metadata,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null) as { error?: string } | null;
        throw new Error(data?.error || "No se pudo guardar la solicitud.");
      }

      const data = await response.json().catch(() => null) as { skipped?: boolean } | null;

      if (data?.skipped) {
        setState("success");
        return;
      }

      setState("success");
      setFullName("");
      setPhone("");
      setEmail("");
      setOrganization("");
      setMessage("");
      setConsent(false);
      setWebsite("");
    } catch {
      setState("error");
      setError("No se pudo guardar la solicitud. Intenta de nuevo en unos minutos.");
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setOpen(true);
          setOpenedAt(Date.now());
        }}
        className={className}
      >
        {children ?? triggerLabel}
      </button>

      {open && (
        <div
          ref={dialogRef}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-gray-950/70 px-4 py-8"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={descriptionId}
        >
          <div className="w-full max-w-xl rounded-[28px] bg-white shadow-2xl border border-gray-100 overflow-hidden">
            <div className="bg-gray-900 px-6 py-5 text-white flex items-start justify-between gap-4">
              <div>
                <p className="text-[12px] font-black uppercase tracking-[0.16em] text-naranja-300 mb-1">
                  Dentro del portal
                </p>
                <h2 id={titleId} className="text-[24px] font-black leading-tight">
                  {title}
                </h2>
                <p id={descriptionId} className="text-[14px] text-gray-300 mt-2 leading-relaxed">
                  {description}
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/15 flex items-center justify-center"
                aria-label="Cerrar formulario"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {state === "success" ? (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                  <p className="text-[18px] font-black text-emerald-900 mb-2">
                    Solicitud guardada
                  </p>
                  <p className="text-[14px] text-emerald-800 leading-relaxed">
                    Tu solicitud quedo dentro del portal para que el equipo pueda revisarla. Si
                    tu caso es urgente o necesita revision de documentos, tambien puedes agendar
                    una cita personal.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 mt-5">
                    <a href="/salud/agendar" className="btn-primary inline-flex text-[14px] min-h-[44px]">
                      Agendar cita personal
                    </a>
                    <button
                      type="button"
                      onClick={closeModal}
                      className="btn-secondary inline-flex text-[14px] min-h-[44px]"
                    >
                      Cerrar
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="hidden" aria-hidden="true">
                    <label htmlFor={`${titleId}-website`}>Sitio web</label>
                    <input
                      id={`${titleId}-website`}
                      name="website"
                      tabIndex={-1}
                      autoComplete="off"
                      value={website}
                      onChange={(event) => setWebsite(event.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-[13px] font-bold text-gray-700 mb-1">
                        Nombre completo *
                      </label>
                      <input
                        ref={fullNameRef}
                        required
                        value={fullName}
                        onChange={(event) => setFullName(event.target.value)}
                        className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 outline-none focus:border-naranja-400"
                        placeholder="Tu nombre"
                      />
                    </div>

                    <div>
                      <label className="block text-[13px] font-bold text-gray-700 mb-1">
                        Teléfono
                      </label>
                      <input
                        value={phone}
                        onChange={(event) => setPhone(event.target.value)}
                        className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 outline-none focus:border-naranja-400"
                        placeholder="55..."
                      />
                    </div>

                    <div>
                      <label className="block text-[13px] font-bold text-gray-700 mb-1">
                        Correo
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 outline-none focus:border-naranja-400"
                        placeholder="tu@correo.com"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[13px] font-bold text-gray-700 mb-1">
                        {organizationLabel}
                        {requireOrganization ? " *" : ""}
                      </label>
                      <input
                        required={requireOrganization}
                        value={organization}
                        onChange={(event) => setOrganization(event.target.value)}
                        className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 outline-none focus:border-naranja-400"
                        placeholder="Opcional"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[13px] font-bold text-gray-700 mb-1">
                      {messageLabel} *
                    </label>
                    <textarea
                      required
                      value={message}
                      onChange={(event) => setMessage(event.target.value)}
                      rows={5}
                      className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 outline-none focus:border-naranja-400 resize-none"
                      placeholder={messagePlaceholder}
                    />
                  </div>

                  <label className="flex items-start gap-3 rounded-2xl bg-warm-50 border border-gray-100 p-4">
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(event) => setConsent(event.target.checked)}
                      className="mt-1"
                    />
                    <span className="text-[12px] text-gray-600 leading-relaxed">
                      Autorizo que el equipo use estos datos exclusivamente para revisar esta
                      solicitud y contactarme. No sustituye una emergencia ni un tramite oficial.
                    </span>
                  </label>

                  {error && (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-[13px] font-semibold text-red-700">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={state === "loading"}
                    className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {state === "loading" ? "Guardando..." : "Enviar dentro del portal"}
                  </button>
                </>
              )}
            </form>
          </div>
        </div>
      )}
    </>
  );
}
