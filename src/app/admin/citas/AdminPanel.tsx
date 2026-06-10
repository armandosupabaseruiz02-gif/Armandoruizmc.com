"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  Calendar, Clock, User, Phone, CheckCircle2,
  XCircle, Ban, Trash2,
  ChevronDown, ChevronUp, Building2, Video, Save,
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
  profiles?: { full_name: string; phone: string };
}

interface BlockedDay {
  id: string;
  blocked_date: string;
  reason?: string;
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  confirmed:            { label: "Confirmada",         color: "text-emerald-700 bg-emerald-100 border-emerald-200" },
  completed:            { label: "Completada",         color: "text-blue-700 bg-blue-100 border-blue-200" },
  cancelled_by_citizen: { label: "Cancelada (ciudadano)", color: "text-gray-600 bg-gray-100 border-gray-200" },
  cancelled_by_admin:   { label: "Cancelada (admin)",  color: "text-red-700 bg-red-100 border-red-200" },
};

function formatDate(dateStr: string) {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("es-MX", {
    weekday: "short", day: "numeric", month: "short",
  });
}

export default function AdminPanel({
  appointments,
  pastAppointments,
  blockedDays: initialBlockedDays,
}: {
  appointments: Appointment[];
  pastAppointments: Appointment[];
  blockedDays: BlockedDay[];
}) {
  const router = useRouter();
  const [tab, setTab] = useState<"upcoming" | "past" | "blocked">("upcoming");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState("");

  // Block day form
  const [newBlockDate, setNewBlockDate] = useState("");
  const [newBlockReason, setNewBlockReason] = useState("");
  const [blockLoading, setBlockLoading] = useState(false);

  async function handleComplete(id: string) {
    setLoading(id);
    const supabase = createClient();
    await supabase.from("appointments").update({ status: "completed" }).eq("id", id);
    router.refresh();
    setLoading(null);
  }

  async function handleSaveLink(id: string, link: string) {
    setLoading(id);
    const supabase = createClient();
    await supabase.from("appointments")
      .update({ meeting_link: link.trim() || null })
      .eq("id", id);
    router.refresh();
    setLoading(null);
  }

  async function handleAdminCancel(id: string) {
    const reason = prompt("Motivo de cancelación (opcional):");
    if (reason === null) return; // user pressed cancel
    setLoading(id);
    const supabase = createClient();
    await supabase.from("appointments").update({
      status: "cancelled_by_admin",
      cancelled_reason: reason || null,
    }).eq("id", id);
    router.refresh();
    setLoading(null);
  }

  async function handleBlockDay() {
    if (!newBlockDate) return;
    setBlockLoading(true);
    setError("");
    const supabase = createClient();
    const { error: insertError } = await supabase.from("blocked_days").insert({
      blocked_date: newBlockDate,
      reason: newBlockReason.trim() || null,
    });
    if (insertError) {
      setError(insertError.code === "23505"
        ? "Ese día ya está bloqueado."
        : "Error al bloquear el día.");
    } else {
      setNewBlockDate("");
      setNewBlockReason("");
      router.refresh();
    }
    setBlockLoading(false);
  }

  async function handleUnblockDay(id: string) {
    if (!confirm("¿Desbloquear este día?")) return;
    const supabase = createClient();
    await supabase.from("blocked_days").delete().eq("id", id);
    router.refresh();
  }

  const tabs = [
    { key: "upcoming", label: "Próximas citas", count: appointments.filter((a) => a.status === "confirmed").length },
    { key: "past",     label: "Historial",       count: pastAppointments.length },
    { key: "blocked",  label: "Días bloqueados", count: initialBlockedDays.length },
  ] as const;

  return (
    <div>
      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Próximas",  value: appointments.filter((a) => a.status === "confirmed").length,  color: "text-emerald-600" },
          { label: "Hoy",       value: appointments.filter((a) => a.appointment_date === new Date().toISOString().split("T")[0] && a.status === "confirmed").length, color: "text-naranja-600" },
          { label: "Días bloqueados", value: initialBlockedDays.length, color: "text-red-600" },
          { label: "Completadas (total)", value: pastAppointments.filter((a) => a.status === "completed").length, color: "text-blue-600" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-5 text-center shadow-sm">
            <p className={`text-[32px] font-black ${s.color}`}>{s.value}</p>
            <p className="text-[13px] text-gray-500 font-medium mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-5 py-3 text-[14px] font-bold transition-colors border-b-2 -mb-px
              ${tab === t.key
                ? "border-naranja-500 text-naranja-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
          >
            {t.label}
            {t.count > 0 && (
              <span className={`ml-2 px-2 py-0.5 rounded-full text-[11px]
                ${tab === t.key ? "bg-naranja-100 text-naranja-700" : "bg-gray-100 text-gray-500"}`}>
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-[14px]">
          {error}
        </div>
      )}

      {/* Upcoming */}
      {tab === "upcoming" && (
        <div className="flex flex-col gap-3">
          {appointments.filter((a) => a.status === "confirmed").length === 0 ? (
            <p className="text-gray-400 text-center py-16">No hay citas próximas confirmadas.</p>
          ) : (
            appointments
              .filter((a) => a.status === "confirmed")
              .map((a) => (
                <AppointmentCard
                  key={a.id}
                  appointment={a}
                  expanded={expanded === a.id}
                  onToggle={() => setExpanded(expanded === a.id ? null : a.id)}
                  onComplete={() => handleComplete(a.id)}
                  onCancel={() => handleAdminCancel(a.id)}
                  onSaveLink={handleSaveLink}
                  loading={loading === a.id}
                  showActions
                />
              ))
          )}
        </div>
      )}

      {/* Past */}
      {tab === "past" && (
        <div className="flex flex-col gap-3">
          {pastAppointments.length === 0 ? (
            <p className="text-gray-400 text-center py-16">Sin historial.</p>
          ) : (
            pastAppointments.map((a) => (
              <AppointmentCard
                key={a.id}
                appointment={a}
                expanded={expanded === a.id}
                onToggle={() => setExpanded(expanded === a.id ? null : a.id)}
                onComplete={() => {}}
                onCancel={() => {}}
                loading={false}
                showActions={false}
              />
            ))
          )}
        </div>
      )}

      {/* Blocked days */}
      {tab === "blocked" && (
        <div>
          {/* Add new block */}
          <div className="bg-white rounded-2xl border-2 border-naranja-100 p-6 mb-6">
            <h3 className="text-[16px] font-bold text-gray-900 mb-4">Bloquear un día</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-1">
                <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Fecha *</label>
                <input
                  type="date"
                  value={newBlockDate}
                  onChange={(e) => setNewBlockDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-naranja-400
                             outline-none text-[15px] text-gray-900"
                />
              </div>
              <div className="sm:col-span-1">
                <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Motivo (opcional)</label>
                <input
                  type="text"
                  value={newBlockReason}
                  onChange={(e) => setNewBlockReason(e.target.value)}
                  placeholder="Ej. Día festivo, capacitación…"
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-naranja-400
                             outline-none text-[15px] text-gray-900"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleBlockDay}
                  disabled={!newBlockDate || blockLoading}
                  className="btn-primary w-full min-h-[46px] text-[14px] disabled:opacity-50"
                >
                  <Ban className="w-4 h-4" />
                  {blockLoading ? "Bloqueando…" : "Bloquear día"}
                </button>
              </div>
            </div>
          </div>

          {/* List */}
          {initialBlockedDays.length === 0 ? (
            <p className="text-gray-400 text-center py-12">No hay días bloqueados.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {initialBlockedDays.map((b) => (
                <div key={b.id}
                  className="flex items-center justify-between gap-4 p-4 bg-white rounded-2xl
                             border border-red-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                      <Ban className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <p className="text-[15px] font-bold text-gray-900">{formatDate(b.blocked_date)}</p>
                      {b.reason && <p className="text-[13px] text-gray-500">{b.reason}</p>}
                    </div>
                  </div>
                  <button
                    onClick={() => handleUnblockDay(b.id)}
                    className="inline-flex items-center gap-1.5 text-[13px] text-red-600
                               hover:text-red-700 font-semibold px-3 py-1.5 rounded-lg
                               border border-red-200 hover:bg-red-50 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Desbloquear
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function AppointmentCard({
  appointment: a,
  expanded,
  onToggle,
  onComplete,
  onCancel,
  onSaveLink,
  loading,
  showActions,
}: {
  appointment: Appointment;
  expanded: boolean;
  onToggle: () => void;
  onComplete: () => void;
  onCancel: () => void;
  onSaveLink?: (id: string, link: string) => void | Promise<void>;
  loading: boolean;
  showActions: boolean;
}) {
  const statusInfo = STATUS_LABELS[a.status] ?? STATUS_LABELS.completed;
  const isOnline = a.modality === "en_linea";
  const [link, setLink] = useState(a.meeting_link ?? "");

  return (
    <div className={`bg-white rounded-2xl border-2 transition-all duration-200
      ${a.status === "confirmed" ? "border-gray-100 hover:border-naranja-100" : "border-gray-100 opacity-80"}`}>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 p-5 text-left"
      >
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="flex-shrink-0">
            <div className="flex items-center gap-1 text-naranja-600 font-black text-[14px]">
              <Calendar className="w-4 h-4" />
              {formatDate(a.appointment_date)}
            </div>
            <div className="flex items-center gap-1 text-gray-500 text-[13px] mt-0.5">
              <Clock className="w-3.5 h-3.5" />
              {a.slot_time.slice(0, 5)} hrs
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 text-gray-900 font-bold text-[15px]">
              <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="truncate">{a.full_name}</span>
            </div>
            <p className="text-[13px] text-gray-500 truncate mt-0.5">{a.motive}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className={`hidden sm:inline-flex items-center gap-1 px-3 py-1 rounded-full
                            text-[11px] font-bold border
                            ${isOnline
                              ? "text-violet-700 bg-violet-100 border-violet-200"
                              : "text-amber-700 bg-amber-100 border-amber-200"}`}>
            {isOnline ? <Video className="w-3 h-3" /> : <Building2 className="w-3 h-3" />}
            {isOnline ? "En línea" : "Presencial"}
          </span>
          <span className={`hidden sm:inline-flex items-center px-3 py-1 rounded-full
                            text-[11px] font-bold border ${statusInfo.color}`}>
            {statusInfo.label}
          </span>
          {expanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </div>
      </button>

      {expanded && (
        <div className="px-5 pb-5 border-t border-gray-100 pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-[11px] font-black text-gray-400 uppercase tracking-wide mb-1">Teléfono</p>
              <a href={`tel:${a.phone}`} className="flex items-center gap-1.5 text-naranja-600 font-semibold text-[14px]">
                <Phone className="w-4 h-4" />
                {a.phone}
              </a>
            </div>
            {a.cancelled_reason && (
              <div>
                <p className="text-[11px] font-black text-gray-400 uppercase tracking-wide mb-1">Motivo cancelación</p>
                <p className="text-[14px] text-gray-700">{a.cancelled_reason}</p>
              </div>
            )}
          </div>
          <div className="mb-4">
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-wide mb-1">Motivo de la cita</p>
            <p className="text-[14px] text-gray-700 leading-relaxed">{a.motive}</p>
          </div>

          {/* Enlace de videollamada (solo citas en línea) */}
          {isOnline && (
            <div className="mb-4 p-4 rounded-xl bg-violet-50 border border-violet-200">
              <p className="text-[11px] font-black text-violet-700 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <Video className="w-3.5 h-3.5" />
                Enlace de videollamada
              </p>
              {showActions && a.status === "confirmed" ? (
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="url"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    placeholder="https://meet.google.com/…  o  https://zoom.us/…"
                    className="flex-1 px-4 py-2.5 rounded-xl border-2 border-violet-200 focus:border-violet-400
                               outline-none text-[14px] text-gray-900"
                  />
                  <button
                    onClick={() => onSaveLink?.(a.id, link)}
                    disabled={loading || link.trim() === (a.meeting_link ?? "")}
                    className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5
                               bg-violet-600 hover:bg-violet-700 text-white font-bold text-[14px]
                               rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="w-4 h-4" />
                    Guardar enlace
                  </button>
                </div>
              ) : a.meeting_link ? (
                <a href={a.meeting_link} target="_blank" rel="noopener noreferrer"
                   className="text-[14px] text-violet-700 font-semibold underline break-all">
                  {a.meeting_link}
                </a>
              ) : (
                <p className="text-[13px] text-gray-500 italic">Sin enlace asignado.</p>
              )}
            </div>
          )}

          {showActions && a.status === "confirmed" && (
            <div className="flex gap-3">
              <button
                onClick={onComplete}
                disabled={loading}
                className="inline-flex items-center gap-2 text-[13px] font-semibold
                           text-emerald-700 px-4 py-2 rounded-xl border border-emerald-200
                           hover:bg-emerald-50 transition-all disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                Marcar completada
              </button>
              <button
                onClick={onCancel}
                disabled={loading}
                className="inline-flex items-center gap-2 text-[13px] font-semibold
                           text-red-600 px-4 py-2 rounded-xl border border-red-200
                           hover:bg-red-50 transition-all disabled:opacity-50"
              >
                <XCircle className="w-4 h-4" />
                Cancelar cita
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
