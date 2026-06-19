"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import {
  Calendar, Clock, CheckCircle2, XCircle, AlertCircle,
  HeartPulse, LogOut, Plus, Settings, Building2, Video, Hourglass, Inbox,
} from "lucide-react";

interface Appointment {
  id: string;
  appointment_date: string;
  slot_time: string;
  full_name: string;
  phone: string;
  motive: string;
  status: string;
  modality?: string;
  meeting_link?: string;
  cancelled_reason?: string;
  created_at: string;
}

const STATUS_LABELS: Record<string, { label: string; color: string; icon: typeof CheckCircle2 }> = {
  pending:                { label: "Pendiente de revisión", color: "text-amber-800 bg-amber-100 border-amber-200", icon: Hourglass },
  confirmed:              { label: "Confirmada",         color: "text-emerald-700 bg-emerald-100 border-emerald-200", icon: CheckCircle2 },
  rejected:               { label: "No aceptada",        color: "text-red-700 bg-red-100 border-red-200",             icon: XCircle },
  completed:              { label: "Completada",         color: "text-emerald-700 bg-emerald-100 border-emerald-200", icon: CheckCircle2 },
  cancelled_by_citizen:   { label: "Cancelada por ti",   color: "text-gray-600 bg-gray-100 border-gray-200",          icon: XCircle },
  cancelled_by_admin:     { label: "Cancelada por admin",color: "text-red-700 bg-red-100 border-red-200",             icon: AlertCircle },
};

function formatDate(dateStr: string) {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString("es-MX", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
}

export default function UserDashboard({
  appointments,
  isAdmin,
}: {
  appointments: Appointment[];
  isAdmin: boolean;
}) {
  const router = useRouter();
  const [cancelling, setCancelling] = useState<string | null>(null);
  const [confirmCancelId, setConfirmCancelId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const upcoming = appointments.filter((a) => ["pending", "confirmed"].includes(a.status));
  const past = appointments.filter((a) => !["pending", "confirmed"].includes(a.status));

  async function handleCancel(id: string) {
    setCancelling(id);
    setError("");

    const supabase = createClient();
    const { error: updateError } = await supabase.rpc("cancel_my_appointment", {
      p_appointment_id: id,
    });

    if (updateError) {
      setError("No se pudo cancelar. Intenta de nuevo.");
    } else {
      await fetch("/api/appointments/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "cancelled_by_citizen", appointmentId: id }),
      }).catch(() => null);
      router.refresh();
    }
    setCancelling(null);
    setConfirmCancelId(null);
  }

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <div>
      {/* Top actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <h2 className="text-[24px] font-black text-gray-900">Mis citas</h2>
        <div className="flex items-center gap-3">
          {isAdmin && (
            <>
              <Link href="/admin/citas" className="btn-secondary inline-flex text-[14px] min-h-[44px] px-5">
                <Settings className="w-4 h-4" />
                Citas
              </Link>
              <Link href="/admin/solicitudes" className="btn-secondary inline-flex text-[14px] min-h-[44px] px-5">
                <Inbox className="w-4 h-4" />
                Solicitudes
              </Link>
            </>
          )}
          <Link href="/salud/agendar" className="btn-primary inline-flex text-[14px] min-h-[44px] px-5">
            <Plus className="w-4 h-4" />
            Nueva cita
          </Link>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 min-h-[44px] px-5
                       text-[14px] font-semibold text-gray-600 hover:text-red-600
                       rounded-xl border-2 border-gray-200 hover:border-red-200
                       transition-all duration-200"
          >
            <LogOut className="w-4 h-4" />
            Salir
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-[14px]">
          {error}
        </div>
      )}

      {/* Upcoming */}
      <div className="mb-10">
        <h3 className="text-[14px] font-black text-gray-500 uppercase tracking-widest mb-4">
          Próximas ({upcoming.length})
        </h3>

        {upcoming.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 rounded-3xl
                          border-2 border-dashed border-gray-200 text-center">
            <HeartPulse className="w-12 h-12 text-gray-300 mb-3" />
            <p className="text-[16px] text-gray-400 mb-5">No tienes solicitudes activas</p>
            <Link href="/salud/agendar" className="btn-primary inline-flex text-[15px] min-h-[48px]">
              <Plus className="w-4 h-4" />
              Agendar cita
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {upcoming.map((a) => {
              const statusInfo = STATUS_LABELS[a.status];
              const StatusIcon = statusInfo.icon;
              return (
                <div
                  key={a.id}
                  className={`p-6 rounded-2xl bg-white border-2 shadow-sm ${
                    a.status === "pending" ? "border-amber-200" : "border-naranja-100"
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-3">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full
                                          text-[12px] font-bold border ${statusInfo.color}`}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          {statusInfo.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-900 mb-1">
                        <Calendar className="w-4 h-4 text-naranja-500 flex-shrink-0" />
                        <span className="text-[16px] font-bold capitalize">
                          {formatDate(a.appointment_date)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 mb-3">
                        <Clock className="w-4 h-4 text-naranja-500 flex-shrink-0" />
                        <span className="text-[15px] font-semibold">
                          {a.slot_time.slice(0, 5)} hrs
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        {a.modality === "en_linea"
                          ? <Video className="w-4 h-4 text-naranja-600 flex-shrink-0" />
                          : <Building2 className="w-4 h-4 text-amber-600 flex-shrink-0" />}
                        <span className="text-[14px] font-semibold text-gray-700">
                          {a.modality === "en_linea" ? "Cita en línea (videollamada)" : "Cita presencial"}
                        </span>
                      </div>
                      <p className="text-[14px] text-gray-500 leading-relaxed line-clamp-2 mb-3">
                        <span className="font-semibold text-gray-700">Motivo:</span> {a.motive}
                      </p>
                      {a.status === "pending" && (
                        <p className="text-[13px] text-amber-800 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 inline-block mb-3">
                          El equipo debe aceptar esta solicitud antes de confirmarla.
                        </p>
                      )}
                      {a.status === "confirmed" && a.modality === "en_linea" && (
                        a.meeting_link ? (
                          <a
                            href={a.meeting_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 min-h-[44px] px-5
                                       bg-naranja-600 hover:bg-naranja-700 text-white font-bold text-[14px]
                                       rounded-xl transition-colors"
                          >
                            <Video className="w-4 h-4" />
                            Unirse a la videollamada
                          </a>
                        ) : (
                          <p className="text-[13px] text-naranja-700 bg-naranja-50 border border-naranja-200
                                        rounded-xl px-4 py-2.5 inline-block">
                            Un asesor te enviará el enlace de la videollamada antes de tu cita.
                          </p>
                        )
                      )}
                    </div>
                    <button
                      onClick={() => setConfirmCancelId(a.id)}
                      disabled={cancelling === a.id}
                      className="inline-flex items-center gap-2 text-[13px] font-semibold
                                 text-red-600 hover:text-red-700 px-4 py-2 rounded-xl
                                 border border-red-200 hover:border-red-300 hover:bg-red-50
                                 transition-all duration-200 disabled:opacity-50 flex-shrink-0"
                    >
                      <XCircle className="w-4 h-4" />
                      {cancelling === a.id ? "Cancelando…" : "Cancelar"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Past */}
      {past.length > 0 && (
        <div>
          <h3 className="text-[14px] font-black text-gray-500 uppercase tracking-widest mb-4">
            Historial ({past.length})
          </h3>
          <div className="flex flex-col gap-3">
            {past.map((a) => {
              const statusInfo = STATUS_LABELS[a.status] ?? STATUS_LABELS.completed;
              const StatusIcon = statusInfo.icon;
              return (
                <div
                  key={a.id}
                  className="p-5 rounded-2xl bg-white border border-gray-100 opacity-75"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1.5">
                        <span className="text-[15px] font-bold text-gray-700 capitalize">
                          {formatDate(a.appointment_date)} · {a.slot_time.slice(0, 5)} hrs
                        </span>
                      </div>
                      <p className="text-[13px] text-gray-500 line-clamp-1">{a.motive}</p>
                      {a.cancelled_reason && (
                        <p className="text-[13px] text-red-700 mt-2">
                          <span className="font-semibold">Motivo:</span> {a.cancelled_reason}
                        </p>
                      )}
                    </div>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full
                                      text-[11px] font-bold border ${statusInfo.color} flex-shrink-0`}>
                      <StatusIcon className="w-3 h-3" />
                      {statusInfo.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Confirmación accesible para cancelar cita */}
      <ConfirmDialog
        open={confirmCancelId !== null}
        title="¿Cancelar esta cita?"
        description="Tu lugar quedará libre para otra persona. Si lo necesitas, puedes agendar una nueva cita cuando quieras."
        confirmLabel="Sí, cancelar cita"
        cancelLabel="No, conservarla"
        tone="danger"
        loading={cancelling !== null}
        onConfirm={() => confirmCancelId && handleCancel(confirmCancelId)}
        onClose={() => setConfirmCancelId(null)}
      />
    </div>
  );
}
