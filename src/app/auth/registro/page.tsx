"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { getSafeRedirect } from "@/lib/auth/redirect";
import { getSafeEmail } from "@/lib/auth/email";
import { HeartPulse, Eye, EyeOff, ArrowLeft, UserPlus, CheckCircle2, Circle } from "lucide-react";

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

function getSignUpErrorMessage(message: string) {
  const normalized = message.toLowerCase();

  if (normalized.includes("already registered") || normalized.includes("already exists")) {
    return "Este correo ya tiene una cuenta. Inicia sesión.";
  }
  if (normalized.includes("rate limit") || normalized.includes("too many")) {
    return "Hubo demasiados intentos. Espera un momento y vuelve a intentar.";
  }
  if (normalized.includes("signup") && normalized.includes("disabled")) {
    return "El registro está desactivado en este momento. Revisa la configuración de Supabase Auth.";
  }
  if (normalized.includes("password")) {
    return "Supabase rechazó la contraseña. Usa mínimo 8 caracteres y combina letras con números.";
  }
  if (normalized.includes("email")) {
    return "Supabase rechazó el correo. Revisa que esté bien escrito.";
  }

  return `No se pudo crear la cuenta. Detalle: ${message}`;
}

function RegistroForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = getSafeRedirect(searchParams.get("redirectTo"));
  const initialEmail = getSafeEmail(searchParams.get("email"));

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState(initialEmail);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmationSent, setConfirmationSent] = useState(false);
  const passwordScore = getPasswordScore(password);
  const strength = getStrengthInfo(passwordScore);
  const passwordsMatch = password.length > 0 && password === confirmPassword;
  const confirmStarted = confirmPassword.length > 0;
  const passwordReady = passwordScore >= 3;
  const submitHint = !passwordReady
    ? "Completa una contraseña aceptable para crear tu cuenta."
    : !confirmStarted
      ? "Repite tu contraseña para confirmar que está bien escrita."
      : !passwordsMatch
        ? "Las dos contraseñas deben ser iguales."
        : "";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!passwordReady) {
      setError("Usa una contraseña más segura: mínimo 8 caracteres y combina letras con números.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const supabase = createClient();
      const emailRedirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`;
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName.trim(), phone: phone.trim() || null },
          emailRedirectTo,
        },
      });

      if (authError) {
        setError(getSignUpErrorMessage(authError.message));
        setLoading(false);
        return;
      }

      if (!data.session) {
        setConfirmationSent(true);
        setLoading(false);
        return;
      }

      await supabase
        .from("profiles")
        .update({ full_name: fullName.trim(), phone: phone.trim() || null })
        .eq("id", data.session.user.id);

      router.replace(redirectTo);
      router.refresh();
    } catch {
      setError("No se pudo crear la cuenta en este momento. Revisa tu conexión e intenta de nuevo.");
      setLoading(false);
    }
  }

  if (confirmationSent) {
    return (
      <div className="min-h-screen bg-warm-50 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md bg-white border-2 border-naranja-100 rounded-3xl p-8 text-center shadow-sm">
          <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 flex items-center justify-center mb-5">
            <UserPlus className="w-7 h-7 text-emerald-700" aria-hidden="true" />
          </div>
          <h1 className="text-[28px] font-black text-gray-900 mb-3">Revisa tu correo</h1>
          <p className="text-[15px] text-gray-600 leading-relaxed mb-7">
            Enviamos un enlace de confirmación a <strong>{email}</strong>. Abre el enlace para activar tu cuenta.
          </p>
          <Link href="/auth/login" className="btn-primary inline-flex min-h-[48px]">
            Ir a iniciar sesión
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-50 flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-naranja-600
                     text-[14px] font-medium transition-colors mb-10 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Volver al inicio
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-naranja-500 flex items-center justify-center">
            <HeartPulse className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-[12px] font-bold text-naranja-600 uppercase tracking-widest">Portal Ciudadano</p>
            <p className="text-[13px] text-gray-500">Armando Ruiz · Diputado Federal</p>
          </div>
        </div>

        <h1 className="text-[32px] font-black text-gray-900 mb-2">Crea tu cuenta, es gratis</h1>
        <p className="text-[15px] text-gray-700 mb-3 leading-relaxed">
          Con tu cuenta agendas citas (en línea o en persona) y le das seguimiento a tus trámites
          y solicitudes de salud. Tu voz, con todo el respaldo del equipo de Armando.
        </p>
        <p className="text-[15px] text-gray-500 mb-8">
          ¿Ya tienes cuenta?{" "}
          <Link href={`/auth/login?redirectTo=${encodeURIComponent(redirectTo)}${email ? `&email=${encodeURIComponent(email)}` : ""}`}
                className="text-naranja-600 font-semibold hover:underline">
            Inicia sesión
          </Link>
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="fullName" className="block text-[14px] font-semibold text-gray-700 mb-2">
              Nombre completo
            </label>
            <input
              id="fullName"
              type="text"
              autoComplete="name"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-naranja-400
                         outline-none text-[16px] text-gray-900 transition-colors bg-white"
              placeholder="Tu nombre completo"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-[14px] font-semibold text-gray-700 mb-2">
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-naranja-400
                         outline-none text-[16px] text-gray-900 transition-colors bg-white"
              placeholder="tu@correo.com"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-[14px] font-semibold text-gray-700 mb-2">
              Teléfono <span className="text-gray-400 font-normal">(opcional)</span>
            </label>
            <input
              id="phone"
              type="tel"
              autoComplete="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-naranja-400
                         outline-none text-[16px] text-gray-900 transition-colors bg-white"
              placeholder="55 1234 5678"
            />
          </div>

          <div className="rounded-3xl border-2 border-naranja-100 bg-white p-4 sm:p-5 shadow-sm">
            <div className="mb-4">
              <label htmlFor="password" className="block text-[14px] font-semibold text-gray-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPwd ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 rounded-xl border-2 border-gray-200 focus:border-naranja-400
                             outline-none text-[16px] text-gray-900 transition-colors bg-white"
                  placeholder="Crea una contraseña segura"
                  aria-describedby="password-strength password-rules"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-naranja-600"
                  aria-label={showPwd ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPwd ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
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
              <label htmlFor="confirmPassword" className="block text-[14px] font-semibold text-gray-700 mb-2">
                Confirmar contraseña
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPwd ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full px-4 py-3 pr-12 rounded-xl border-2 outline-none text-[16px] text-gray-900 transition-colors bg-white ${
                    confirmStarted && !passwordsMatch
                      ? "border-red-300 focus:border-red-400"
                      : confirmStarted && passwordsMatch
                        ? "border-emerald-300 focus:border-emerald-400"
                        : "border-gray-200 focus:border-naranja-400"
                  }`}
                  placeholder="Repite tu contraseña"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPwd((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-naranja-600"
                  aria-label={showConfirmPwd ? "Ocultar confirmación de contraseña" : "Mostrar confirmación de contraseña"}
                >
                  {showConfirmPwd ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {confirmStarted && (
                <p className={`mt-2 text-[13px] font-semibold ${passwordsMatch ? "text-emerald-700" : "text-red-700"}`}>
                  {passwordsMatch ? "Las contraseñas coinciden." : "Las contraseñas no coinciden."}
                </p>
              )}
            </div>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-[14px] font-medium">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <UserPlus className="w-5 h-5" />
            {loading ? "Creando cuenta…" : "Crear cuenta"}
          </button>

          {submitHint && (
            <p className="text-[13px] text-amber-700 text-center font-semibold -mt-2">
              {submitHint}
            </p>
          )}

          <p className="text-[12px] text-gray-400 text-center leading-relaxed">
            Al registrarte aceptas el uso de tus datos exclusivamente para gestionar tus citas
            con el equipo del Diputado Armando Ruiz.
          </p>
        </form>
      </div>
    </div>
  );
}

export default function RegistroPage() {
  return (
    <Suspense>
      <RegistroForm />
    </Suspense>
  );
}
