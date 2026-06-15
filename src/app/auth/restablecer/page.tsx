"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, KeyRound } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function RestablecerPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setError("El enlace expiró o no es válido. Solicita uno nuevo.");
      setLoading(false);
      return;
    }

    router.replace("/mi-cuenta");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-warm-50 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="w-12 h-12 rounded-2xl bg-naranja-500 flex items-center justify-center mb-6">
          <KeyRound className="w-6 h-6 text-white" aria-hidden="true" />
        </div>
        <h1 className="text-[32px] font-black text-gray-900 mb-2">Crea una contraseña nueva</h1>
        <p className="text-[15px] text-gray-600 mb-8">Usa al menos 8 caracteres y evita reutilizar contraseñas de otros servicios.</p>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="password" className="block text-[14px] font-semibold text-gray-700 mb-2">Nueva contraseña</label>
            <div className="relative">
              <input id="password" type={showPassword ? "text" : "password"} autoComplete="new-password" required value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full px-4 py-3 pr-12 rounded-xl border-2 border-gray-200 focus:border-naranja-400 outline-none text-[16px] text-gray-900 bg-white" />
              <button type="button" onClick={() => setShowPassword((value) => !value)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-naranja-600"
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}>
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          {error && <p className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-[14px]">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
            {loading ? "Guardando…" : "Guardar contraseña"}
          </button>
        </form>
      </div>
    </div>
  );
}
