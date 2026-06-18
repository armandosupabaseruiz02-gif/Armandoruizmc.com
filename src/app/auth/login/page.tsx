"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { getSafeRedirect } from "@/lib/auth/redirect";
import { getSafeEmail } from "@/lib/auth/email";
import { HeartPulse, Eye, EyeOff, ArrowLeft, LogIn, UserPlus } from "lucide-react";

function getRegisterHref(redirectTo: string, email: string) {
  const params = new URLSearchParams({ redirectTo });
  const safeEmail = getSafeEmail(email);

  if (safeEmail) {
    params.set("email", safeEmail);
  }

  return `/auth/registro?${params.toString()}`;
}

function getLoginErrorInfo(message: string | undefined) {
  if (message === "supabase-config") {
    return {
      message: "Falta conectar Supabase en Vercel. Agrega NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY.",
      showRegisterHelp: false,
    };
  }
  if (message === "auth-timeout") {
    return {
      message: "El inicio de sesión tardó demasiado. Revisa tu conexión e intenta de nuevo.",
      showRegisterHelp: false,
    };
  }

  const normalized = message?.toLowerCase() ?? "";

  if (normalized.includes("email not confirmed")) {
    return {
      message: "Tu cuenta ya fue creada, pero falta confirmar tu correo. Revisa tu bandeja de entrada.",
      showRegisterHelp: false,
    };
  }

  if (normalized.includes("rate limit") || normalized.includes("too many")) {
    return {
      message: "Hubo demasiados intentos. Espera un momento y vuelve a intentar.",
      showRegisterHelp: false,
    };
  }

  return {
    message: "No encontramos una cuenta registrada con ese correo. Si ya tienes cuenta, revisa la contraseña; si no, regístrate.",
    showRegisterHelp: true,
  };
}

async function withTimeout<T>(promise: Promise<T>, milliseconds: number): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  const timeout = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error("auth-timeout")), milliseconds);
  });

  try {
    return await Promise.race([promise, timeout]);
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}

function LoginForm() {
  const searchParams = useSearchParams();
  const redirectTo = getSafeRedirect(searchParams.get("redirectTo"));
  const configError = searchParams.get("error") === "supabase-config";
  const initialEmail = getSafeEmail(searchParams.get("email"));

  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showRegisterHelp, setShowRegisterHelp] = useState(false);
  const registerHref = getRegisterHref(redirectTo, email);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setShowRegisterHelp(false);

    let authError: { message?: string } | null = null;

    try {
      const supabase = createClient();
      const result = await withTimeout(
        supabase.auth.signInWithPassword({
          email,
          password,
        }),
        15000
      );
      authError = result.error;
    } catch (error) {
      authError = {
        message: error instanceof Error && error.message === "auth-timeout"
          ? "auth-timeout"
          : "supabase-config",
      };
    }

    if (authError) {
      const errorInfo = getLoginErrorInfo(authError.message);
      setError(errorInfo.message);
      setShowRegisterHelp(errorInfo.showRegisterHelp);
      setLoading(false);
      return;
    }

    window.location.assign(redirectTo);
    setTimeout(() => setLoading(false), 8000);
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

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-naranja-500 flex items-center justify-center">
            <HeartPulse className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-[12px] font-bold text-naranja-600 uppercase tracking-widest">Portal Ciudadano</p>
            <p className="text-[13px] text-gray-500">Armando Ruiz · Diputado Federal</p>
          </div>
        </div>

        <h1 className="text-[32px] font-black text-gray-900 mb-2">Iniciar sesión</h1>
        <p className="text-[15px] text-gray-500 mb-8">
          ¿No tienes cuenta?{" "}
          <Link href={registerHref}
                className="text-naranja-600 font-semibold hover:underline">
            Regístrate aquí
          </Link>
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {configError && (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-[14px] font-medium">
              Falta conectar Supabase en Vercel. La pagina publica puede abrir,
              pero login, citas y admin necesitan las variables de Supabase.
            </div>
          )}

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
            <label htmlFor="password" className="block text-[14px] font-semibold text-gray-700 mb-2">
              Contraseña
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPwd ? "text" : "password"}
                autoComplete="current-password"
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
            <div className="space-y-3 rounded-xl bg-red-50 border border-red-200 p-4 text-[14px]">
              <p className="text-red-700 font-medium">{error}</p>
              {showRegisterHelp && (
                <Link
                  href={registerHref}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-naranja-500 px-4 py-2.5 text-white font-black hover:bg-naranja-600 transition-colors"
                >
                  <UserPlus className="w-4 h-4" aria-hidden="true" />
                  Registrarme con este correo
                </Link>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <LogIn className="w-5 h-5" />
            {loading ? "Iniciando sesión…" : "Iniciar sesión"}
          </button>

          <Link
            href="/auth/recuperar"
            className="block text-center text-[14px] font-semibold text-naranja-600 hover:underline"
          >
            Olvidé mi contraseña
          </Link>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
