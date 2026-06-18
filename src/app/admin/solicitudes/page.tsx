import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Inbox, Mail, Phone, UserRound } from "lucide-react";
import PageWrapper from "@/components/layout/PageWrapper";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Admin · Solicitudes | Armando Ruiz Diputado",
};

type ContactRequest = {
  id: string;
  request_type: string;
  full_name: string;
  phone: string | null;
  email: string | null;
  organization: string | null;
  subject: string;
  message: string;
  status: string;
  created_at: string;
  metadata: Record<string, string | number | boolean | null>;
};

const TYPE_LABELS: Record<string, string> = {
  job_application: "Postulación",
  vacancy_registration: "Registro de vacante",
  ally: "Aliado",
  donation: "Donación",
  accessibility: "Accesibilidad",
  general: "General",
};

const STATUS_LABELS: Record<string, string> = {
  new: "Nueva",
  in_review: "En revisión",
  contacted: "Contactada",
  closed: "Cerrada",
};

function formatDate(value: string) {
  return new Date(value).toLocaleString("es-MX", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default async function AdminSolicitudesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login?redirectTo=/admin/solicitudes");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") redirect("/mi-cuenta");

  const { data: requests, error } = await supabase
    .from("contact_requests")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <PageWrapper>
      <section className="relative bg-gray-900 pt-20 pb-14 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" aria-hidden="true" />
        <div className="relative max-w-6xl mx-auto px-5 sm:px-8">
          <Link
            href="/mi-cuenta"
            className="inline-flex items-center gap-2 text-gray-300 hover:text-naranja-400 text-[14px] font-medium transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Volver a Mi cuenta
          </Link>
          <p className="text-[12px] font-bold text-naranja-400 uppercase tracking-widest mb-3">
            Panel de Administración
          </p>
          <h1 className="text-[38px] sm:text-[48px] font-black text-white leading-tight">
            Solicitudes del portal
          </h1>
          <p className="text-gray-300 mt-2 text-[16px]">
            Postulaciones, vacantes, aliados, donaciones y reportes internos.
          </p>
        </div>
      </section>

      <section className="py-10 bg-warm-50 min-h-[60vh]">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          {error ? (
            <div className="rounded-card border-2 border-red-200 bg-red-50 p-7">
              <p className="font-black text-red-800 text-[18px] mb-2">
                Falta activar la tabla de solicitudes
              </p>
              <p className="text-red-700 text-[14px] leading-relaxed">
                Aplica la migración `20260617_contact_requests.sql` en Supabase para ver esta bandeja.
              </p>
            </div>
          ) : (requests ?? []).length === 0 ? (
            <div className="rounded-card border-2 border-dashed border-gray-200 bg-white p-12 text-center">
              <Inbox className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-[20px] font-black text-gray-900">Todavía no hay solicitudes</p>
              <p className="text-gray-500 text-[14px] mt-2">
                Cuando alguien use los formularios internos, aparecerá aquí.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5">
              {(requests as ContactRequest[]).map((request) => (
                <article key={request.id} className="rounded-card bg-white border border-gray-100 shadow-card p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="rounded-full bg-naranja-100 text-naranja-700 border border-naranja-200 px-3 py-1 text-[12px] font-black">
                          {TYPE_LABELS[request.request_type] ?? request.request_type}
                        </span>
                        <span className="rounded-full bg-gray-100 text-gray-700 border border-gray-200 px-3 py-1 text-[12px] font-bold">
                          {STATUS_LABELS[request.status] ?? request.status}
                        </span>
                      </div>
                      <h2 className="text-[22px] font-black text-gray-900 leading-tight">
                        {request.subject}
                      </h2>
                      <p className="text-[13px] text-gray-500 mt-1">{formatDate(request.created_at)}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
                    <p className="flex items-center gap-2 text-[14px] text-gray-700">
                      <UserRound className="w-4 h-4 text-naranja-500" />
                      {request.full_name}
                    </p>
                    {request.phone && (
                      <a href={`tel:${request.phone}`} className="flex items-center gap-2 text-[14px] text-naranja-700 font-semibold">
                        <Phone className="w-4 h-4" />
                        {request.phone}
                      </a>
                    )}
                    {request.email && (
                      <p className="flex items-center gap-2 text-[14px] text-gray-700">
                        <Mail className="w-4 h-4 text-naranja-500" />
                        {request.email}
                      </p>
                    )}
                  </div>

                  {request.organization && (
                    <p className="text-[13px] font-bold text-gray-500 uppercase tracking-wide mb-2">
                      {request.organization}
                    </p>
                  )}

                  <p className="text-[15px] text-gray-800 leading-relaxed whitespace-pre-wrap">
                    {request.message}
                  </p>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </PageWrapper>
  );
}
