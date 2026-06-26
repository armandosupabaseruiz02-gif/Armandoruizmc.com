import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PageWrapper from "@/components/layout/PageWrapper";
import UserDashboard from "./UserDashboard";

export const metadata: Metadata = {
  title: "Mi perfil",
  description: "Aquí gestionas tu cuenta y tus citas de salud con el equipo del Diputado Armando Ruiz.",
};

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "T";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export default async function MiCuentaPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login?redirectTo=/mi-cuenta");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .single();

  const metaName =
    (user.user_metadata?.full_name as string | undefined) ||
    (user.user_metadata?.name as string | undefined);
  const displayName = profile?.full_name || metaName || "ciudadano";
  const avatarUrl =
    (user.user_metadata?.avatar_url as string | undefined) ||
    (user.user_metadata?.picture as string | undefined) ||
    null;

  const { data: appointments } = await supabase
    .from("appointments")
    .select("id, appointment_date, slot_time, full_name, phone, motive, status, modality, meeting_link, cancelled_reason, created_at")
    .eq("citizen_id", user.id)
    .order("appointment_date", { ascending: true })
    .order("slot_time", { ascending: true });

  return (
    <PageWrapper>
      <section className="relative bg-gray-900 pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" aria-hidden="true" />
        <div className="relative max-w-4xl mx-auto px-5 sm:px-8">
          <p className="text-[12px] font-bold text-naranja-400 uppercase tracking-widest mb-4">
            Mi perfil
          </p>
          <div className="flex items-center gap-4">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarUrl}
                alt=""
                referrerPolicy="no-referrer"
                width={64}
                height={64}
                className="h-16 w-16 rounded-full border-2 border-naranja-300 object-cover"
              />
            ) : (
              <span
                aria-hidden="true"
                className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-naranja-300 bg-naranja-500/20 text-[22px] font-black text-naranja-200"
              >
                {getInitials(displayName)}
              </span>
            )}
            <div className="min-w-0">
              <h1 className="text-[32px] sm:text-[44px] font-black text-white leading-tight truncate">
                Hola, {displayName.split(" ")[0]}
              </h1>
              <p className="text-[15px] text-gray-300 mt-1 truncate">
                {user.email} · {profile?.role === "admin" ? "Administrador" : "Ciudadano"}
              </p>
            </div>
          </div>
          <p className="text-[16px] text-gray-200 mt-5 max-w-xl leading-relaxed">
            Aquí gestionas tu cuenta: revisa, agenda o cancela tus citas y mantén tus datos al día.
          </p>
        </div>
      </section>

      <section className="py-12 bg-warm-50 min-h-[60vh]">
        <div className="max-w-4xl mx-auto px-5 sm:px-8">
          <UserDashboard
            appointments={appointments ?? []}
            isAdmin={profile?.role === "admin"}
          />
        </div>
      </section>
    </PageWrapper>
  );
}
