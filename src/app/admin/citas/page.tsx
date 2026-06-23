import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PageWrapper from "@/components/layout/PageWrapper";
import AdminPanel from "./AdminPanel";
import { getMexicoTodayDateString } from "@/lib/date/mexico";

export const metadata: Metadata = {
  title: "Admin · Citas",
};

export default async function AdminCitasPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login?redirectTo=/admin/citas");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") redirect("/mi-cuenta");

  const today = getMexicoTodayDateString();
  const appointmentColumns = `
    id,
    appointment_date,
    slot_time,
    full_name,
    phone,
    motive,
    status,
    modality,
    meeting_link,
    cancelled_reason
  `;

  const { data: appointments } = await supabase
    .from("appointments")
    .select(appointmentColumns)
    .gte("appointment_date", today)
    .order("appointment_date", { ascending: true })
    .order("slot_time", { ascending: true });

  const { data: pastAppointments } = await supabase
    .from("appointments")
    .select(appointmentColumns)
    .lt("appointment_date", today)
    .order("appointment_date", { ascending: false })
    .limit(50);

  const { data: blockedDays } = await supabase
    .from("blocked_days")
    .select("id, blocked_date, reason")
    .order("blocked_date", { ascending: true });

  return (
    <PageWrapper>
      <section className="relative bg-gray-900 pt-20 pb-14 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" aria-hidden="true" />
        <div className="relative max-w-6xl mx-auto px-5 sm:px-8">
          <p className="text-[12px] font-bold text-naranja-400 uppercase tracking-widest mb-3">
            Panel de Administración
          </p>
          <h1 className="text-[38px] sm:text-[48px] font-black text-white leading-tight">
            Gestión de Citas
          </h1>
          <p className="text-gray-300 mt-2 text-[16px]">
            Hola, {profile?.full_name?.split(" ")[0]} · Panel de control
          </p>
        </div>
      </section>

      <section className="py-10 bg-warm-50 min-h-[60vh]">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <AdminPanel
            appointments={appointments ?? []}
            pastAppointments={pastAppointments ?? []}
            blockedDays={blockedDays ?? []}
          />
        </div>
      </section>
    </PageWrapper>
  );
}
