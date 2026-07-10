"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { getSafeRedirect } from "@/lib/auth/redirect";
import { getSafeEmail } from "@/lib/auth/email";
import { ArrowLeft, Eye, EyeOff, KeyRound, Loader2, LockKeyhole, LogIn, Mail, UserPlus } from "lucide-react";
import Silk from "@/components/effects/Silk";

function getRegisterHref(redirectTo: string, email: string) {
  const params = new URLSearchParams({ redirectTo });
  const safeEmail = getSafeEmail(email);

  if (safeEmail) {
    params.set("email", safeEmail);
  }

  return `/auth/registro?${params.toString()}`;
}

function getRecoveryHref(email: string) {
  const safeEmail = getSafeEmail(email);
  return safeEmail ? `/auth/recuperar?email=${encodeURIComponent(safeEmail)}` : "/auth/recuperar";
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

  if (normalized.includes("invalid login credentials") || normalized.includes("invalid credentials")) {
    return {
      message: "No pudimos iniciar sesión con ese correo y contraseña. Si la cuenta ya existe, restablece la contraseña; si todavía no la has creado, regístrate.",
      showRegisterHelp: true,
    };
  }

  if (normalized.includes("rate limit") || normalized.includes("too many")) {
    return {
      message: "Hubo demasiados intentos. Espera un momento y vuelve a intentar.",
      showRegisterHelp: false,
    };
  }

  return {
    message: "No pudimos iniciar sesión. Revisa el correo y la contraseña, o restablece tu contraseña si ya tenías cuenta.",
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

function BrandLogo() {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="inline-flex items-center justify-center gap-1.5 pb-1">
        <Image
          src="/icon.png"
          alt="Sombrero de Armando Ruiz"
          width={72}
          height={72}
          priority
          className="h-12 w-12 shrink-0 -rotate-12 object-contain drop-shadow-[0_8px_18px_rgba(234,88,12,0.25)] sm:h-14 sm:w-14"
        />
        <span className="text-[24px] font-[900] leading-none tracking-[-0.055em] text-gray-950 sm:text-[28px]">
          Armando Ruiz
        </span>
        <span className="text-[26px] font-black leading-none text-naranja-600 sm:text-[30px]">.</span>
      </div>
      <span className="mt-1 text-[11px] font-bold uppercase tracking-[0.2em] text-naranja-600 sm:text-[12px] sm:tracking-[0.22em]">
        Portal ciudadano
      </span>
    </div>
  );
}

function GoogleMark() {
  return (
    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-[13px] font-black text-naranja-600">
      G
    </span>
  );
}

function BackButton({ className }: { className: string }) {
  return (
    <Link href="/" aria-label="Volver al inicio" className={className}>
      <ArrowLeft className="h-4 w-4" aria-hidden="true" />
      Atrás
    </Link>
  );
}

function LoginAnimationPanel() {
  return (
    <aside className="relative hidden h-full min-h-0 overflow-hidden bg-naranja-500 text-white lg:block">
      <div className="pointer-events-none absolute inset-x-0 -top-24 -bottom-24">
        <Silk speed={4.8} scale={1.18} color="#FF8A1D" noiseIntensity={1.05} rotation={0.2} />
      </div>
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_18%,rgba(255,255,255,0.38),transparent_30%),linear-gradient(180deg,rgba(154,52,18,0.04),rgba(67,20,7,0.16))]"
        aria-hidden="true"
      />

      <BackButton
        className="pointer-events-auto absolute left-9 top-9 z-30 inline-flex cursor-pointer items-center gap-2 rounded-full px-3 py-2 text-[14px] font-bold text-white/90 transition-colors hover:bg-white/15 hover:text-white"
      />

      <div className="relative z-10 flex h-full flex-col justify-end p-10 xl:p-14">
        <div className="max-w-2xl pb-[clamp(3rem,8vh,6rem)]">
          <h2 className="max-w-xl text-[48px] font-[900] leading-[0.94] tracking-[-0.07em] text-white drop-shadow-[0_14px_35px_rgba(67,20,7,0.42)] xl:text-[66px]">
            Entra a tu cuenta ciudadana.
          </h2>
          <p className="mt-6 max-w-md text-[18px] font-semibold leading-8 text-white/88 drop-shadow-[0_10px_24px_rgba(67,20,7,0.32)]">
            Consulta tus citas, guarda tus datos y retoma tus trámites sin empezar de cero.
          </p>
        </div>
      </div>
    </aside>
  );
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
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [showRegisterHelp, setShowRegisterHelp] = useState(false);
  const registerHref = getRegisterHref(redirectTo, email);
  const recoveryHref = getRecoveryHref(email);

  async function handleGoogleLogin() {
    setGoogleLoading(true);
    setError("");
    setShowRegisterHelp(false);

    try {
      const supabase = createClient();
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`,
        },
      });
      if (oauthError) throw oauthError;
      // Si no hubo error, el navegador esta por irse a Google; el spinner
      // se queda mientras tanto.
    } catch {
      setError("No se pudo abrir el inicio de sesión con Google. Inténtalo de nuevo.");
      setGoogleLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setShowRegisterHelp(false);

    let authError: { message?: string } | null = null;

    try {
      const supabase = createClient();
      const normalizedEmail = email.trim().toLowerCase();
      const result = await withTimeout(
        supabase.auth.signInWithPassword({
          email: normalizedEmail,
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
    <main
      className="min-h-[100svh] overflow-y-auto bg-[#fff7ed] px-0 py-0 antialiased sm:px-5 sm:py-5 lg:p-8"
      style={{
        fontFamily:
          "var(--font-sans), ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <section className="mx-auto grid min-h-[100svh] w-full max-w-7xl overflow-hidden bg-white shadow-[0_28px_90px_rgba(124,45,18,0.10)] sm:min-h-[calc(100svh-2.5rem)] sm:rounded-[28px] sm:border sm:border-naranja-200/80 lg:min-h-[calc(100svh-4rem)] lg:grid-cols-[1.08fr_0.92fr]">
        <LoginAnimationPanel />

        <div className="relative flex min-h-0 min-w-0 items-center justify-center overflow-y-auto bg-white px-5 py-8 sm:px-8 sm:py-10 lg:min-h-0">
          <BackButton
            className="pointer-events-auto absolute left-4 top-3 z-30 inline-flex cursor-pointer items-center gap-2 rounded-full px-3 py-2 text-[14px] font-bold text-gray-500 transition-colors hover:bg-naranja-50 hover:text-naranja-700 sm:left-5 sm:top-5 lg:hidden"
          />

          <div className="w-[min(430px,calc(100vw-2.5rem))] min-w-0 max-w-[430px] sm:w-full">
            <BrandLogo />

            <div className="mt-5 text-center sm:mt-6">
              <h1 className="text-[27px] font-[900] leading-tight tracking-[-0.06em] text-gray-950 sm:text-[36px]">
                ¡Qué gusto verte de nuevo!
              </h1>
              <p className="mx-auto mt-2 max-w-sm text-[13px] leading-5 text-gray-500 sm:mt-3 sm:text-[15px] sm:leading-6">
                Entra a tu cuenta para seguir con tus citas y tus trámites. Aquí seguimos contigo.
              </p>
            </div>

            <div className="mt-5 grid gap-3 sm:mt-6">
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={googleLoading}
                className="flex min-h-[46px] w-full min-w-0 items-center justify-center gap-2 rounded-xl border-2 border-naranja-200 bg-white px-3 text-[13px] font-black text-naranja-700 transition-colors hover:border-naranja-300 hover:bg-naranja-50 focus-visible:outline-2 focus-visible:outline-naranja-500 disabled:cursor-wait disabled:opacity-70 sm:min-h-[54px] sm:gap-3 sm:px-4 sm:text-[15px]"
              >
                {googleLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                ) : (
                  <GoogleMark />
                )}
                <span className="min-w-0 truncate">
                  {googleLoading ? "Abriendo Google…" : "Iniciar sesión con Google"}
                </span>
              </button>
            </div>

            <div className="my-4 flex items-center gap-4 text-[13px] font-semibold text-gray-500 sm:my-5">
              <span className="h-px flex-1 bg-gray-200" aria-hidden="true" />
              o
              <span className="h-px flex-1 bg-gray-200" aria-hidden="true" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              {configError && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-[14px] font-medium text-amber-800">
                  Falta conectar Supabase en Vercel. La página pública puede abrir,
                  pero login, citas y admin necesitan las variables de Supabase.
                </div>
              )}

              <div>
                <label htmlFor="email" className="mb-1.5 block text-[14px] font-bold text-gray-700">
                  Correo electrónico *
                </label>
                <div className="relative">
                  <Mail
                    className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
                    aria-hidden="true"
                  />
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-[#fbfaf9] px-12 py-3 text-[16px] text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-naranja-400 focus:bg-white sm:py-3.5"
                    placeholder="Introduce tu correo electrónico"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="mb-1.5 block text-[14px] font-bold text-gray-700">
                  Contraseña *
                </label>
                <div className="relative">
                  <LockKeyhole
                    className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
                    aria-hidden="true"
                  />
                  <input
                    id="password"
                    type={showPwd ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-[#fbfaf9] px-12 py-3 text-[16px] text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-naranja-400 focus:bg-white sm:py-3.5"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((v) => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-naranja-600"
                    aria-label={showPwd ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showPwd ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="space-y-3 rounded-xl border border-red-200 bg-red-50 p-4 text-[14px]">
                  <p className="font-medium text-red-700">{error}</p>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Link
                      href={recoveryHref}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 font-black text-red-700 transition-colors hover:bg-red-100"
                    >
                      <KeyRound className="h-4 w-4" aria-hidden="true" />
                      Restablecer contraseña
                    </Link>
                    {showRegisterHelp && (
                    <Link
                      href={registerHref}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-naranja-500 px-4 py-2.5 font-black text-white transition-colors hover:bg-naranja-600"
                    >
                      <UserPlus className="h-4 w-4" aria-hidden="true" />
                      Registrarme con este correo
                    </Link>
                    )}
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex min-h-[50px] w-full items-center justify-center gap-2 rounded-xl bg-naranja-500 px-6 text-[16px] font-black text-white shadow-[0_18px_36px_rgba(249,115,22,0.22)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-naranja-600 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 sm:min-h-[56px]"
              >
                <LogIn className="h-5 w-5" aria-hidden="true" />
                {loading ? "Iniciando sesión..." : "Iniciar sesión"}
              </button>

              <div className="grid gap-2 pt-1 text-center text-[13px] font-semibold text-gray-500 sm:grid-cols-2 sm:text-[14px]">
                <Link href={registerHref} className="transition-colors hover:text-naranja-700 hover:underline">
                  ¿No tienes cuenta? Regístrate
                </Link>
                <Link href="/auth/recuperar" className="transition-colors hover:text-naranja-700 hover:underline">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
            </form>

            <p className="sr-only">Desarrollado para Armando Ruiz</p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
