import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PageWrapper from "@/components/layout/PageWrapper";
import UserDashboard from "./UserDashboard";

export const metadata: Metadata = {
  title: "Mis Citas",
  description: "Gestiona tus citas de salud agendadas con el equipo del Diputado Armando Ruiz.",
};

export default async function MiCuentaPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login?redirectTo=/mi-cuenta");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .single();

  const { data: appointments } = await supabase
    .from("appointments")
    .select("*")
    .eq("citizen_id", user.id)
    .order("appointment_date", { ascending: true })
    .order("slot_time", { ascending: true });

  return (
    <PageWrapper>
      <section className="relative bg-gray-900 pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" aria-hidden="true" />
        <div className="relative max-w-4xl mx-auto px-5 sm:px-8">
          <p className="text-[12px] font-bold text-naranja-400 uppercase tracking-widest mb-3">
            Portal Ciudadano
          </p>
          <h1 className="text-[38px] sm:text-[52px] font-black text-white leading-tight">
            Hola, {profile?.full_name?.split(" ")[0] || "ciudadano"}
          </h1>
          <p className="text-[17px] text-gray-300 mt-2">
            {user.email} · {profile?.role === "admin" ? "Administrador" : "Ciudadano"}
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
