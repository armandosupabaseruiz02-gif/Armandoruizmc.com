import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import BookingCalendar from "./BookingCalendar";
import PageWrapper from "@/components/layout/PageWrapper";
import Link from "next/link";
import { ArrowLeft, HeartPulse } from "lucide-react";
import { addDaysToDateString, getMexicoTodayDateString } from "@/lib/date/mexico";

export const metadata: Metadata = {
  title: "Agendar Cita de Salud",
  description: "Agenda tu cita de asesoría de salud con el equipo del Diputado Armando Ruiz.",
};

export default async function AgendarPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?redirectTo=/salud/agendar");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, phone, curp")
    .eq("id", user.id)
    .single();

  const today = getMexicoTodayDateString();
  const until = addDaysToDateString(today, 60);

  const { data: bookedSlots } = await supabase
    .from("appointments")
    .select("appointment_date, slot_time")
    .in("status", ["pending", "confirmed"])
    .gte("appointment_date", today)
    .lte("appointment_date", until);

  const { data: blockedDays } = await supabase
    .from("blocked_days")
    .select("blocked_date")
    .gte("blocked_date", today)
    .lte("blocked_date", until);

  return (
    <PageWrapper>
      <section className="relative bg-gray-900 pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none bg-grid-pattern opacity-20" aria-hidden="true" />
        <div className="relative max-w-4xl mx-auto px-5 sm:px-8">
          <Link
            href="/salud"
            className="inline-flex items-center gap-2 text-gray-300 hover:text-naranja-400
                       text-[14px] font-medium transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Regresar a Salud
          </Link>

          <div className="flex items-center gap-4 mb-5">
            <div className="w-14 h-14 rounded-2xl bg-naranja-500 flex items-center justify-center">
              <HeartPulse className="w-7 h-7 text-white" />
            </div>
            <span className="section-badge-dark">Cita de Salud</span>
          </div>

          <h1 className="text-[38px] sm:text-[52px] font-black text-white leading-tight mb-4">
            Agenda tu cita
          </h1>
          <p className="text-[17px] text-gray-200 max-w-xl">
            Selecciona el día y horario que mejor te convenga. Un asesor del Diputado te atenderá,
            de forma presencial o en línea. Horario de atención: lunes a viernes de 9:00 a 17:00.
          </p>
        </div>
      </section>

      <section className="py-14 bg-warm-50 min-h-[60vh]">
        <div className="max-w-4xl mx-auto px-5 sm:px-8">
          <BookingCalendar
            userId={user.id}
            userEmail={user.email ?? ""}
            defaultName={profile?.full_name ?? ""}
            defaultPhone={profile?.phone ?? ""}
            defaultCurp={profile?.curp ?? ""}
            bookedSlots={(bookedSlots ?? []).map((s) => ({
              date: s.appointment_date,
              time: s.slot_time.slice(0, 5),
            }))}
            blockedDays={(blockedDays ?? []).map((d) => d.blocked_date)}
          />
        </div>
      </section>
    </PageWrapper>
  );
}
