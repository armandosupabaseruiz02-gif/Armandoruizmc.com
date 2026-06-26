"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LogIn, User } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type AccountUser = { name: string; avatarUrl: string | null } | null;

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "T";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function Avatar({ account, size = 28 }: { account: NonNullable<AccountUser>; size?: number }) {
  const dimension = { width: size, height: size };
  if (account.avatarUrl) {
    return (
      // Foto real (p. ej. de Google). <img> simple para no requerir config de dominios.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={account.avatarUrl}
        alt=""
        referrerPolicy="no-referrer"
        style={dimension}
        className="rounded-full border-2 border-naranja-200 object-cover"
      />
    );
  }
  return (
    <span
      aria-hidden="true"
      style={dimension}
      className="flex items-center justify-center rounded-full border-2 border-naranja-300 bg-naranja-100 text-[11px] font-black text-naranja-700"
    >
      {getInitials(account.name)}
    </span>
  );
}

export default function AccountButton({
  variant = "desktop",
  onNavigate,
}: {
  variant?: "desktop" | "mobile";
  onNavigate?: () => void;
}) {
  const [account, setAccount] = useState<AccountUser>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;

    let supabase: ReturnType<typeof createClient>;
    try {
      supabase = createClient();
    } catch {
      // Sin config de Supabase tratamos al usuario como no autenticado.
      queueMicrotask(() => {
        if (active) setReady(true);
      });
      return () => {
        active = false;
      };
    }

    function toAccount(user: { email?: string; user_metadata?: Record<string, unknown> } | null): AccountUser {
      if (!user) return null;
      const meta = user.user_metadata ?? {};
      const name =
        (meta.full_name as string) ||
        (meta.name as string) ||
        user.email?.split("@")[0] ||
        "Mi perfil";
      const avatarUrl = (meta.avatar_url as string) || (meta.picture as string) || null;
      return { name, avatarUrl };
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

  // ─── Móvil ─────────────────────────────────────────────
  if (variant === "mobile") {
    if (!ready) {
      return <div className="h-[58px] w-full animate-pulse rounded-2xl bg-gray-100" aria-hidden="true" />;
    }
    if (account) {
      return (
        <Link
          href="/mi-cuenta"
          onClick={onNavigate}
          className="flex min-h-[58px] w-full items-center gap-3 rounded-2xl border-2 border-naranja-200 bg-naranja-50 px-4 text-left"
          aria-label="Mi perfil: aquí gestionas tu cuenta y tus citas"
        >
          <Avatar account={account} size={40} />
          <span className="min-w-0">
            <span className="block truncate text-[16px] font-black text-gray-900">{account.name}</span>
            <span className="block text-[13px] font-semibold text-naranja-700">Mi perfil · gestiona tus citas</span>
          </span>
        </Link>
      );
    }
    return (
      <Link href="/auth/login" onClick={onNavigate} className="btn-secondary w-full justify-center">
        <LogIn className="h-5 w-5" aria-hidden="true" />
        Iniciar sesión
      </Link>
    );
  }

  // ─── Escritorio ────────────────────────────────────────
  if (!ready) {
    return <div className="hidden h-11 w-28 animate-pulse rounded-full bg-gray-100 sm:block" aria-hidden="true" />;
  }
  if (account) {
    return (
      <Link
        href="/mi-cuenta"
        onClick={onNavigate}
        className="hidden min-h-11 items-center gap-2 rounded-full border border-naranja-200 bg-white py-1 pl-1 pr-4 text-[14px] font-bold text-gray-800 transition-all duration-200 hover:border-naranja-300 hover:bg-naranja-50 sm:inline-flex"
        aria-label="Mi perfil: aquí gestionas tu cuenta y tus citas"
        title="Mi perfil — gestiona tu cuenta y tus citas"
      >
        <Avatar account={account} size={32} />
        <span className="max-w-[120px] truncate">{account.name.split(" ")[0]}</span>
      </Link>
    );
  }
  return (
    <Link
      href="/auth/login"
      onClick={onNavigate}
      className="hidden min-h-11 items-center gap-2 rounded-full border border-gray-200 bg-white px-4 text-[14px] font-semibold text-gray-700 transition-all duration-200 hover:border-naranja-200 hover:bg-naranja-50 hover:text-naranja-700 sm:inline-flex"
    >
      <User className="h-4 w-4" aria-hidden="true" />
      Iniciar sesión
    </Link>
  );
}
