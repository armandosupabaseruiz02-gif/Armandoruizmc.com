"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { getSafeRedirect } from "@/lib/auth/redirect";
import { HeartPulse, Eye, EyeOff, ArrowLeft, UserPlus } from "lucide-react";

function RegistroForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = getSafeRedirect(searchParams.get("redirectTo"));

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmationSent, setConfirmationSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    setLoading(true);
    setError("");

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
      setError(authError.message === "User already registered"
        ? "Este correo ya tiene una cuenta. Inicia sesión."
        : "Ocurrió un error. Intenta de nuevo.");
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

        <h1 className="text-[32px] font-black text-gray-900 mb-2">Crear cuenta</h1>
        <p className="text-[15px] text-gray-500 mb-8">
          ¿Ya tienes cuenta?{" "}
          <Link href={`/auth/login?redirectTo=${encodeURIComponent(redirectTo)}`}
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

          <div>
            <label htmlFor="password" className="block text-[14px] font-semibold text-gray-700 mb-2">
              Contraseña <span className="text-gray-400 font-normal">(mín. 8 caracteres)</span>
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPwd ? "text" : "password"}
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 rounded-xl border-2 border-gray-200 focus:border-naranja-400
                           outline-none text-[16px] text-gray-900 transition-colors bg-white"
                placeholder="••••••••"
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
