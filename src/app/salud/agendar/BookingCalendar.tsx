"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { getMexicoTodayDateString, getWeekdayFromDateString } from "@/lib/date/mexico";
import {
  ChevronLeft, ChevronRight, CheckCircle2, Clock, Calendar,
  Building2, Video, HeartPulse, Accessibility,
} from "lucide-react";

// Horario de atención: lunes a viernes, 9:00 a 17:00 (última cita 16:30)
const SLOT_TIMES = [
  "09:00","09:30","10:00","10:30","11:00","11:30",
  "12:00","12:30","13:00","13:30","14:00","14:30",
  "15:00","15:30","16:00","16:30",
];

// Temas de cita. La tabla `appointments` NO tiene columna de tema
// (verificado 2026-06-11); para no requerir migración, el tema se guarda
// de forma no destructiva como prefijo del motivo: "[Salud] …".
const TOPIC_LABELS = {
  salud: "Salud",
  discapacidad: "Apoyo a discapacidad",
} as const;
type Topic = keyof typeof TOPIC_LABELS;

const MONTH_NAMES = [
  "Enero","Febrero","Marzo","Abril","Mayo","Junio",
  "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre",
];
const DAY_NAMES = ["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"];
const CURP_PATTERN = /^[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z0-9]\d$/;

function toDateStr(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

interface Props {
  userId: string;
  userEmail: string;
  defaultName: string;
  defaultPhone: string;
  defaultCurp: string;
  bookedSlots: { date: string; time: string }[];
  blockedDays: string[];
}

type Step = "calendar" | "slots" | "form" | "confirm";

export default function BookingCalendar({
  userId, userEmail, defaultName, defaultPhone, defaultCurp,
  bookedSlots, blockedDays,
}: Props) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const today = getMexicoTodayDateString();
  const [todayYear, todayMonth] = today.split("-").map(Number);

  const [viewYear, setViewYear] = useState(todayYear);
  const [viewMonth, setViewMonth] = useState(todayMonth - 1);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [step, setStep] = useState<Step>("calendar");

  const [fullName, setFullName] = useState(defaultName);
  const [phone, setPhone] = useState(defaultPhone);
  const [curp, setCurp] = useState(defaultCurp);
  const [motive, setMotive] = useState("");
  const [topic, setTopic] = useState<Topic>("salud");
  const [modality, setModality] = useState<"presencial" | "en_linea">("presencial");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (step === "calendar") return;

    const id = requestAnimationFrame(() => {
      const targetY = Math.max(
        0,
        (containerRef.current?.getBoundingClientRect().top ?? 0) + window.scrollY - 96
      );

      window.scrollTo({ top: targetY, behavior: "smooth" });
    });

    return () => cancelAnimationFrame(id);
  }, [step]);

  // Calendar helpers
  const firstDay = getWeekdayFromDateString(toDateStr(viewYear, viewMonth, 1));
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  }

  function isDaySelectable(d: number) {
    const dateStr = toDateStr(viewYear, viewMonth, d);
    const dow = getWeekdayFromDateString(dateStr);
    if (dow === 0 || dow === 6) return false; // weekend
    if (dateStr < today) return false;        // past in Mexico City
    if (blockedDays.includes(dateStr)) return false;
    return true;
  }

  function getBookedTimesForDate(dateStr: string) {
    return bookedSlots.filter((s) => s.date === dateStr).map((s) => s.time);
  }

  async function handleConfirm() {
    if (!selectedDate || !selectedTime) return;
    setLoading(true);
    setError("");

    const normalizedCurp = curp.trim().toUpperCase();
    const phoneDigits = phone.replace(/\D/g, "");

    if (phoneDigits.length < 10) {
      setError("Escribe un teléfono válido de al menos 10 dígitos.");
      setLoading(false);
      return;
    }

    if (normalizedCurp && !CURP_PATTERN.test(normalizedCurp)) {
      setError("Revisa la CURP: debe tener 18 caracteres con el formato oficial.");
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const appointmentRecord = {
      citizen_id: userId,
      citizen_email: userEmail,
      appointment_date: selectedDate,
      slot_time: selectedTime + ":00",
      full_name: fullName.trim(),
      phone: phone.trim(),
      curp: normalizedCurp || null,
      topic,
      motive: motive.trim(),
      modality,
      status: "pending",
    };

    let { data: createdAppointment, error: insertError } = await supabase
      .from("appointments")
      .insert(appointmentRecord)
      .select("id")
      .single();

    if (insertError && insertError.message.toLowerCase().includes("citizen_email")) {
      const { citizen_email: _citizenEmail, ...recordWithoutEmail } = appointmentRecord;
      const retry = await supabase
        .from("appointments")
        .insert(recordWithoutEmail)
        .select("id")
        .single();

      createdAppointment = retry.data;
      insertError = retry.error;
    }

    if (insertError && insertError.message.toLowerCase().includes("topic")) {
      const { citizen_email: _citizenEmail, topic: _topic, ...recordWithoutNewColumns } = appointmentRecord;
      const retry = await supabase
        .from("appointments")
        .insert({
          ...recordWithoutNewColumns,
          motive: `[${TOPIC_LABELS[topic]}] ${motive.trim()}`,
        })
        .select("id")
        .single();

      createdAppointment = retry.data;
      insertError = retry.error;
    }

    if (insertError) {
      if (insertError.code === "23505") {
        setError("Ese horario acaba de ser reservado. Por favor elige otro.");
      } else {
        setError("Ocurrió un error al guardar tu cita. Intenta de nuevo.");
      }
      setLoading(false);
      return;
    }

    await fetch("/api/appointments/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "created",
        appointmentId: createdAppointment?.id,
      }),
    }).catch(() => null);

    setStep("confirm");
    setLoading(false);
  }

  if (step === "confirm") {
    return (
      <div
        ref={containerRef}
        className="flex justify-center py-8 sm:py-12"
      >
        <div className="w-full max-w-[560px] min-h-[min(92vw,560px)] rounded-[2rem] border-2 border-emerald-100 bg-white shadow-sm px-5 py-8 sm:p-10 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="text-[30px] sm:text-[36px] font-black text-gray-900 mb-3">Solicitud enviada</h2>
          <p className="text-[16px] sm:text-[17px] text-gray-600 mb-2">
            Solicitaste una cita para el{" "}
            <strong className="text-gray-900">
              {selectedDate?.split("-").reverse().join("/")}
            </strong>{" "}
            a las <strong className="text-gray-900">{selectedTime} hrs</strong>.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 mb-5">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-naranja-100 border border-naranja-200">
              {topic === "discapacidad"
                ? <Accessibility className="w-4 h-4 text-naranja-600" aria-hidden="true" />
                : <HeartPulse className="w-4 h-4 text-naranja-600" aria-hidden="true" />}
              <span className="text-[14px] font-bold text-naranja-700">
                Tema: {TOPIC_LABELS[topic]}
              </span>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-naranja-100 border border-naranja-200">
              {modality === "en_linea"
                ? <Video className="w-4 h-4 text-naranja-600" aria-hidden="true" />
                : <Building2 className="w-4 h-4 text-naranja-600" aria-hidden="true" />}
              <span className="text-[14px] font-bold text-naranja-700">
                {modality === "en_linea" ? "Cita en línea (videollamada)" : "Cita presencial"}
              </span>
            </div>
          </div>
          <p className="text-[15px] text-gray-600 mb-8 sm:mb-10 max-w-sm leading-relaxed">
            El equipo revisará la solicitud antes de confirmarla. Puedes consultar su estado y
            cancelarla desde Mi Cuenta. Si es en línea, el enlace aparecerá después de que sea aceptada.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button
              onClick={() => router.push("/mi-cuenta")}
              className="btn-primary w-full sm:w-auto"
            >
              Ver mis citas
            </button>
            <button
              onClick={() => router.push("/salud")}
              className="btn-secondary w-full sm:w-auto"
            >
              Volver a Salud
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-8">
      {/* Calendar */}
      <div className="bg-white rounded-3xl border-2 border-gray-100 p-6 shadow-sm h-fit">
        {/* Month nav */}
        <div className="flex items-center justify-between mb-5">
          <button
            onClick={prevMonth}
            className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
            aria-label="Mes anterior"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <span className="text-[16px] font-bold text-gray-900">
            {MONTH_NAMES[viewMonth]} {viewYear}
          </span>
          <button
            onClick={nextMonth}
            className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
            aria-label="Mes siguiente"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 mb-2">
          {DAY_NAMES.map((d) => (
            <div key={d} className="text-center text-[12px] font-bold text-gray-500 py-1">{d}</div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-y-1">
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => {
            const dateStr = toDateStr(viewYear, viewMonth, d);
            const selectable = isDaySelectable(d);
            const isSelected = selectedDate === dateStr;
            const isBlocked = blockedDays.includes(dateStr);
            const dow = getWeekdayFromDateString(dateStr);
            const isWeekend = dow === 0 || dow === 6;
            const isPast = dateStr < today;

            return (
              <button
                key={d}
                disabled={!selectable}
                onClick={() => {
                  setSelectedDate(dateStr);
                  setSelectedTime(null);
                  setStep("slots");
                }}
                className={`
                  h-11 w-11 mx-auto rounded-full text-[15px] font-semibold transition-all
                  ${isSelected
                    ? "bg-naranja-500 text-white shadow-md"
                    : selectable
                    ? "hover:bg-naranja-100 text-gray-900 cursor-pointer"
                    : isBlocked
                    ? "text-red-400 line-through cursor-not-allowed opacity-60"
                    : (isWeekend || isPast)
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-300 cursor-not-allowed"
                  }
                `}
                aria-label={`${d} de ${MONTH_NAMES[viewMonth]}`}
                aria-pressed={isSelected}
              >
                {d}
              </button>
            );
          })}
        </div>

        <div className="mt-5 pt-4 border-t border-gray-100 flex flex-col gap-2 text-[12px] text-gray-500">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-naranja-500 inline-block" /> Día seleccionado
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-gray-200 inline-block" /> No disponible / fin de semana
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-300 inline-block" /> Día suspendido
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div>
        {/* Time slots */}
        {(step === "slots" || step === "form") && selectedDate && (
          <div className="bg-white rounded-3xl border-2 border-gray-100 p-6 shadow-sm mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-naranja-500" />
              <span className="text-[16px] font-bold text-gray-900">
                Horarios — {selectedDate.split("-").reverse().join("/")}
              </span>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
              {SLOT_TIMES.map((t) => {
                const booked = getBookedTimesForDate(selectedDate).includes(t);
                const isSelected = selectedTime === t;
                return (
                  <button
                    key={t}
                    disabled={booked}
                    onClick={() => {
                      setSelectedTime(t);
                      setStep("form");
                    }}
                    className={`
                      min-h-[48px] py-3 rounded-xl text-[15px] font-semibold transition-all
                      ${booked
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed line-through"
                        : isSelected
                        ? "bg-naranja-500 text-white shadow-md"
                        : "bg-naranja-50 text-naranja-700 hover:bg-naranja-100 border border-naranja-200"
                      }
                    `}
                    aria-label={`${t} ${booked ? "(ocupado)" : ""}`}
                    aria-pressed={isSelected}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Booking form */}
        {step === "form" && selectedDate && selectedTime && (
          <div className="bg-white rounded-3xl border-2 border-gray-100 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <Calendar className="w-5 h-5 text-naranja-500" />
              <span className="text-[16px] font-bold text-gray-900">Datos de la cita</span>
            </div>

            <div className="flex items-center gap-3 mb-6 p-3 rounded-xl bg-naranja-50 border border-naranja-200">
              <span className="text-naranja-600 font-black text-[14px]">
                {selectedDate.split("-").reverse().join("/")} — {selectedTime} hrs
              </span>
            </div>

            {/* Tema de la cita */}
            <fieldset className="mb-6">
              <legend className="block text-[13px] font-semibold text-gray-700 mb-2">
                ¿Sobre qué tema es tu cita? *
              </legend>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {([
                  { value: "salud",        icon: HeartPulse,    label: TOPIC_LABELS.salud,        desc: "Medicamentos, terapias y gestiones médicas" },
                  { value: "discapacidad", icon: Accessibility, label: TOPIC_LABELS.discapacidad, desc: "Trámites, tarjeta y apoyos de accesibilidad" },
                ] as const).map((opt) => {
                  const Icon = opt.icon;
                  const active = topic === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setTopic(opt.value)}
                      aria-pressed={active}
                      className={`flex items-start gap-3 text-left p-4 rounded-2xl border-2 transition-all min-h-[64px]
                        ${active
                          ? "border-naranja-500 bg-naranja-50 shadow-sm"
                          : "border-gray-200 bg-white hover:border-naranja-300"}`}
                    >
                      <span className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
                        ${active ? "bg-naranja-500 text-white" : "bg-naranja-100 text-naranja-600"}`}>
                        <Icon className="w-5 h-5" aria-hidden="true" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[15px] font-bold text-gray-900">{opt.label}</span>
                        <span className="block text-[13px] text-gray-600 leading-snug">{opt.desc}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </fieldset>

            {/* Modalidad de la cita */}
            <fieldset className="mb-6">
              <legend className="block text-[13px] font-semibold text-gray-700 mb-2">
                ¿Cómo quieres tu cita? *
              </legend>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {([
                  { value: "presencial", icon: Building2, label: "Presencial", desc: "En las oficinas del Diputado" },
                  { value: "en_linea",   icon: Video,     label: "En línea",   desc: "Por videollamada, desde casa" },
                ] as const).map((opt) => {
                  const Icon = opt.icon;
                  const active = modality === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setModality(opt.value)}
                      aria-pressed={active}
                      className={`flex items-start gap-3 text-left p-4 rounded-2xl border-2 transition-all min-h-[64px]
                        ${active
                          ? "border-naranja-500 bg-naranja-50 shadow-sm"
                          : "border-gray-200 bg-white hover:border-naranja-300"}`}
                    >
                      <span className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
                        ${active ? "bg-naranja-500 text-white" : "bg-naranja-100 text-naranja-600"}`}>
                        <Icon className="w-5 h-5" aria-hidden="true" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[15px] font-bold text-gray-900">{opt.label}</span>
                        <span className="block text-[13px] text-gray-600 leading-snug">{opt.desc}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
              {modality === "en_linea" && (
                <p className="text-[13px] text-gray-600 mt-2 leading-relaxed">
                  Un asesor te enviará el enlace de la videollamada antes de tu cita. Lo verás también en tu cuenta.
                </p>
              )}
            </fieldset>

            <div className="space-y-4">
              <div>
                <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">
                  Nombre completo *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-naranja-400
                             outline-none text-[15px] text-gray-900 transition-colors"
                />
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">
                  Teléfono *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-naranja-400
                             outline-none text-[15px] text-gray-900 transition-colors"
                  placeholder="55 1234 5678"
                />
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">
                  CURP <span className="text-gray-400 font-normal">(opcional)</span>
                </label>
                <input
                  type="text"
                  value={curp}
                  onChange={(e) => setCurp(e.target.value.toUpperCase())}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-naranja-400
                             outline-none text-[15px] text-gray-900 transition-colors uppercase"
                  placeholder="AAAA000000AAAAAA00"
                  maxLength={18}
                />
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">
                  Motivo de la cita *
                </label>
                <textarea
                  required
                  value={motive}
                  onChange={(e) => setMotive(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-naranja-400
                             outline-none text-[15px] text-gray-900 transition-colors resize-none"
                  placeholder="Describe brevemente el motivo de tu consulta…"
                />
              </div>
            </div>

            {error && (
              <div className="mt-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-[14px]">
                {error}
              </div>
            )}

            <button
              onClick={handleConfirm}
              disabled={loading || !fullName.trim() || !phone.trim() || !motive.trim()}
              className="btn-primary w-full mt-6 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <CheckCircle2 className="w-5 h-5" />
              {loading ? "Guardando…" : "Confirmar cita"}
            </button>
          </div>
        )}

        {step === "calendar" && (
          <div className="flex flex-col items-center justify-center h-48 text-center text-gray-400">
            <Calendar className="w-12 h-12 mb-3 opacity-30" />
            <p className="text-[15px]">Selecciona un día disponible en el calendario</p>
          </div>
        )}
      </div>
    </div>
  );
}
