"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Circle, Eye, EyeOff, KeyRound } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const PASSWORD_RULES = [
  { label: "8 caracteres o más", test: (value: string) => value.length >= 8 },
  { label: "Una mayúscula", test: (value: string) => /[A-ZÁÉÍÓÚÑ]/.test(value) },
  { label: "Una minúscula", test: (value: string) => /[a-záéíóúñ]/.test(value) },
  { label: "Un número", test: (value: string) => /\d/.test(value) },
  { label: "Un símbolo", test: (value: string) => /[^A-Za-zÁÉÍÓÚÑáéíóúñ0-9]/.test(value) },
];

function getPasswordScore(password: string) {
  return PASSWORD_RULES.filter((rule) => rule.test(password)).length;
}

function getStrengthInfo(score: number) {
  if (score <= 1) return { label: "Muy débil", color: "bg-red-500", text: "text-red-700", width: "w-1/5" };
  if (score === 2) return { label: "Débil", color: "bg-orange-500", text: "text-orange-700", width: "w-2/5" };
  if (score === 3) return { label: "Aceptable", color: "bg-amber-500", text: "text-amber-700", width: "w-3/5" };
  if (score === 4) return { label: "Buena", color: "bg-emerald-500", text: "text-emerald-700", width: "w-4/5" };
  return { label: "Muy segura", color: "bg-emerald-600", text: "text-emerald-800", width: "w-full" };
}

export default function RestablecerPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const passwordScore = getPasswordScore(password);
  const strength = getStrengthInfo(passwordScore);
  const passwordReady = passwordScore >= 3;
  const confirmStarted = confirmPassword.length > 0;
  const passwordsMatch = password.length > 0 && password === confirmPassword;
  const submitHint = !passwordReady
    ? "Usa una contraseña aceptable antes de guardar."
    : !confirmStarted
      ? "Repite la contraseña para confirmar que está bien escrita."
      : !passwordsMatch
        ? "Las dos contraseñas deben coincidir."
        : "";

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!passwordReady) {
      setError("Usa una contraseña más segura: mínimo 8 caracteres y combina letras con números.");
      return;
    }
    if (!passwordsMatch) {
      setError("Las contraseñas no coinciden.");
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
          <div className="rounded-3xl border-2 border-naranja-100 bg-white p-4 sm:p-5 shadow-sm">
            <div className="mb-4">
              <label htmlFor="password" className="block text-[14px] font-semibold text-gray-700 mb-2">Nueva contraseña</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full px-4 py-3 pr-12 rounded-xl border-2 border-gray-200 focus:border-naranja-400 outline-none text-[16px] text-gray-900 bg-white"
                  aria-describedby="password-strength password-rules"
                />
                <button type="button" onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-naranja-600"
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}>
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div id="password-strength" className="mb-4" aria-live="polite">
              <div className="flex items-center justify-between gap-3 mb-2">
                <span className="text-[12px] font-black text-gray-500 uppercase tracking-wide">
                  Seguridad
                </span>
                <span className={`text-[13px] font-black ${password ? strength.text : "text-gray-400"}`}>
                  {password ? strength.label : "Sin contraseña"}
                </span>
              </div>
              <div className="h-2.5 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${password ? `${strength.color} ${strength.width}` : "w-0"}`}
                />
              </div>
            </div>

            <ul id="password-rules" className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
              {PASSWORD_RULES.map((rule) => {
                const passed = rule.test(password);
                const Icon = passed ? CheckCircle2 : Circle;
                return (
                  <li
                    key={rule.label}
                    className={`flex items-center gap-2 text-[13px] font-semibold ${
                      passed ? "text-emerald-700" : "text-gray-500"
                    }`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                    {rule.label}
                  </li>
                );
              })}
            </ul>

            <div>
              <label htmlFor="confirmPassword" className="block text-[14px] font-semibold text-gray-700 mb-2">Confirmar contraseña</label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  className={`w-full px-4 py-3 pr-12 rounded-xl border-2 outline-none text-[16px] text-gray-900 bg-white transition-colors ${
                    confirmStarted && !passwordsMatch
                      ? "border-red-300 focus:border-red-400"
                      : confirmStarted && passwordsMatch
                        ? "border-emerald-300 focus:border-emerald-400"
                        : "border-gray-200 focus:border-naranja-400"
                  }`}
                />
                <button type="button" onClick={() => setShowConfirmPassword((value) => !value)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-naranja-600"
                  aria-label={showConfirmPassword ? "Ocultar confirmación de contraseña" : "Mostrar confirmación de contraseña"}>
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {confirmStarted && (
                <p className={`mt-2 text-[13px] font-semibold ${passwordsMatch ? "text-emerald-700" : "text-red-700"}`}>
                  {passwordsMatch ? "Las contraseñas coinciden." : "Las contraseñas no coinciden."}
                </p>
              )}
            </div>
          </div>
          {error && <p className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-[14px]">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
            {loading ? "Guardando…" : "Guardar contraseña"}
          </button>
          {submitHint && (
            <p className="text-[13px] text-amber-700 text-center font-semibold -mt-2">
              {submitHint}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
