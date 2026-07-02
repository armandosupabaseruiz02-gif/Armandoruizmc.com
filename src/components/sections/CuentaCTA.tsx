"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import FadeIn from "@/components/ui/FadeIn";
import { createClient } from "@/lib/supabase/client";
import {
  Megaphone,
  CalendarHeart,
  ClipboardList,
  HeartPulse,
  UserPlus,
  LogIn,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

const beneficios = [
  { icon: CalendarHeart, text: "Agenda tus citas, en línea o en persona" },
  { icon: ClipboardList, text: "Dale seguimiento a tus trámites y solicitudes" },
  { icon: HeartPulse, text: "Recibe apoyo en salud y discapacidad" },
];

const pasos = [
  "Pon tu nombre y tu correo",
  "Crea tu contraseña",
  "Confirma tu correo y ¡ya quedó!",
];

type Account = { name: string } | null;

export default function CuentaCTA() {
  const [account, setAccount] = useState<Account>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;

    let supabase: ReturnType<typeof createClient>;
    try {
      supabase = createClient();
    } catch {
      queueMicrotask(() => {
        if (active) setReady(true);
      });
      return () => {
        active = false;
      };
    }

    function toAccount(
      user: { email?: string; user_metadata?: Record<string, unknown> } | null,
    ): Account {
      if (!user) return null;
      const meta = user.user_metadata ?? {};
      const name =
        (meta.full_name as string) ||
        (meta.name as string) ||
        user.email?.split("@")[0] ||
        "amigo";
      return { name };
    }

    supabase.auth
      .getUser()
      .then(({ data }) => {
        if (!active) return;
        setAccount(toAccount(data.user));
        setReady(true);
      })
      .catch(() => {
        if (active) setReady(true);
      });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      setAccount(toAccount(session?.user ?? null));
      setReady(true);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const loggedIn = ready && account !== null;

  return (
    <section
      id="crear-cuenta"
      className="relative overflow-hidden bg-naranja-500 py-20 sm:py-24 lg:py-28"
      aria-labelledby="cuenta-titulo"
    >
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" aria-hidden="true" />
      <div className="absolute top-0 inset-x-0 h-1 bg-white/20 pointer-events-none" aria-hidden="true" />
      <div className="absolute -top-1/3 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-white/10 blur-[120px] pointer-events-none" aria-hidden="true" />

      <div className="relative mx-auto max-w-5xl px-5 sm:px-8">
        {/* Mensaje de megáfono — para todos */}
        <FadeIn className="text-center max-w-3xl mx-auto mb-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/20 px-4 py-2 text-[12px] font-black uppercase tracking-[0.16em] text-white">
            <Megaphone className="h-4 w-4" aria-hidden="true" />
            Tu voz, mil veces más fuerte
          </span>
          <h2
            id="cuenta-titulo"
            className="mt-5 text-[32px] sm:text-[46px] font-black leading-tight tracking-tight text-white"
          >
            El equipo de Armando es{" "}
            <span className="underline decoration-white/70 decoration-4 underline-offset-4">tu megáfono</span>.
          </h2>
          <p className="mt-4 text-[18px] leading-relaxed text-white/90">
            Aquí tu voz se potencia mil veces y, esta vez, sí va a ser escuchada. Crea tu cuenta
            y empieza a mover lo tuyo con nosotros de tu lado.
          </p>
        </FadeIn>

        {/* Tarjeta dinámica: cambia si ya iniciaste sesión */}
        <FadeIn>
          {loggedIn ? (
            <div className="rounded-[28px] border-2 border-naranja-100 bg-white p-7 sm:p-9 text-center shadow-xl">
              <p className="text-[13px] font-black uppercase tracking-[0.16em] text-naranja-600">
                Ya tienes tu cuenta
              </p>
              <h3 className="mt-3 text-[26px] sm:text-[32px] font-black text-gray-900 leading-tight">
                ¡Qué bueno tenerte, {account?.name.split(" ")[0]}!
              </h3>
              <p className="mx-auto mt-3 max-w-xl text-[16px] leading-relaxed text-gray-700">
                Desde aquí agendas tus citas y le das seguimiento a tus trámites. Tu voz ya está
                con nosotros — sigamos avanzando.
              </p>
              <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/salud/agendar" className="btn-primary inline-flex w-full sm:w-auto justify-center shadow-btn-glow">
                  <CalendarHeart className="h-5 w-5" aria-hidden="true" />
                  Agendar una cita
                </Link>
                <Link
                  href="/mi-cuenta"
                  className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full border-2 border-gray-200 bg-white px-6 min-h-[52px] text-[15px] font-bold text-gray-700 transition-colors hover:border-naranja-200 hover:bg-naranja-50 hover:text-naranja-700"
                >
                  Ir a mi perfil
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-6 items-stretch">
              {/* Qué consigues + cómo */}
              <div className="rounded-[28px] border-2 border-naranja-100 bg-white p-7 sm:p-8 shadow-xl">
                <h3 className="text-[24px] sm:text-[28px] font-black text-gray-900 leading-tight">
                  Crea tu cuenta y haz que te escuchen
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-gray-600">
                  Es gratis y rápido. Con tu cuenta:
                </p>
                <ul className="mt-5 space-y-3">
                  {beneficios.map((b) => {
                    const Icon = b.icon;
                    return (
                      <li key={b.text} className="flex items-center gap-3 text-[16px] text-gray-800">
                        <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-naranja-100 text-naranja-700">
                          <Icon className="h-5 w-5" aria-hidden="true" />
                        </span>
                        {b.text}
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Cómo se hace + CTAs */}
              <div className="flex flex-col rounded-[28px] border-2 border-naranja-100 bg-white p-7 sm:p-8 shadow-xl">
                <p className="text-[13px] font-black uppercase tracking-[0.16em] text-naranja-600">
                  ¿Cómo la creo?
                </p>
                <ol className="mt-4 space-y-3">
                  {pasos.map((paso, i) => (
                    <li key={paso} className="flex items-start gap-3 text-[15px] text-gray-800">
                      <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-naranja-500 text-[13px] font-black text-white">
                        {i + 1}
                      </span>
                      <span className="leading-snug pt-0.5">{paso}</span>
                    </li>
                  ))}
                </ol>

                <p className="mt-4 flex items-center gap-2 text-[13px] text-gray-500">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" aria-hidden="true" />
                  Tus datos solo los usamos para ayudarte.
                </p>

                <div className="mt-6 flex flex-col gap-3">
                  <Link href="/auth/registro" className="btn-primary inline-flex w-full justify-center shadow-btn-glow">
                    <UserPlus className="h-5 w-5" aria-hidden="true" />
                    Crear mi cuenta
                  </Link>
                  <Link
                    href="/auth/login"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-gray-200 bg-white px-6 min-h-[52px] text-[15px] font-bold text-gray-700 transition-colors hover:border-naranja-200 hover:bg-naranja-50 hover:text-naranja-700"
                  >
                    <LogIn className="h-5 w-5" aria-hidden="true" />
                    Ya tengo cuenta
                  </Link>
                </div>
              </div>
            </div>
          )}
        </FadeIn>
      </div>
    </section>
  );
}
