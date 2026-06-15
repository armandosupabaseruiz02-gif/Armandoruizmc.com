"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, KeyRound, Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function RecuperarPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const redirectTo = `${window.location.origin}/auth/callback?next=/auth/restablecer`;
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });

    if (resetError) {
      setError("No pudimos enviar el enlace. Intenta de nuevo en unos minutos.");
    } else {
      setSent(true);
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-warm-50 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <Link href="/auth/login" className="inline-flex items-center gap-2 text-gray-500 hover:text-naranja-600 text-[14px] font-medium mb-10">
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          Volver a iniciar sesión
        </Link>
        <div className="w-12 h-12 rounded-2xl bg-naranja-500 flex items-center justify-center mb-6">
          <KeyRound className="w-6 h-6 text-white" aria-hidden="true" />
        </div>
        <h1 className="text-[32px] font-black text-gray-900 mb-2">Recuperar contraseña</h1>
        <p className="text-[15px] text-gray-600 mb-8">Te enviaremos un enlace seguro para crear una contraseña nueva.</p>

        {sent ? (
          <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800">
            <p className="font-bold mb-1">Enlace enviado</p>
            <p className="text-[14px]">Revisa tu bandeja de entrada y correo no deseado.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-[14px] font-semibold text-gray-700 mb-2">Correo electrónico</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" aria-hidden="true" />
                <input id="email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-naranja-400 outline-none text-[16px] text-gray-900 bg-white" />
              </div>
            </div>
            {error && <p className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-[14px]">{error}</p>}
            <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
              {loading ? "Enviando…" : "Enviar enlace"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
