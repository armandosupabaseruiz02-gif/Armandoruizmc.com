import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  adminAppointmentCreatedEmail,
  citizenAppointmentCancelledEmail,
  citizenAppointmentConfirmedEmail,
  citizenAppointmentCreatedEmail,
  citizenAppointmentMeetingLinkEmail,
  citizenAppointmentRejectedEmail,
} from "@/lib/email/appointments";
import { getAdminNotificationEmail, sendEmail } from "@/lib/email/resend";

type AppointmentRecord = {
  id: string;
  citizen_id: string;
  citizen_email?: string | null;
  appointment_date: string;
  slot_time: string;
  full_name: string;
  phone?: string | null;
  motive: string;
  status: string;
  modality?: string | null;
  meeting_link?: string | null;
  cancelled_reason?: string | null;
};

const APPOINTMENT_SELECT_WITH_EMAIL = [
  "id",
  "citizen_id",
  "citizen_email",
  "appointment_date",
  "slot_time",
  "full_name",
  "phone",
  "motive",
  "status",
  "modality",
  "meeting_link",
  "cancelled_reason",
].join(",");

const APPOINTMENT_SELECT_WITHOUT_EMAIL = APPOINTMENT_SELECT_WITH_EMAIL
  .replace("citizen_email,", "");

function isNotificationType(
  value: unknown
): value is "created" | "confirmed" | "rejected" | "cancelled_by_admin" | "cancelled_by_citizen" | "meeting_link_updated" {
  return [
    "created",
    "confirmed",
    "rejected",
    "cancelled_by_admin",
    "cancelled_by_citizen",
    "meeting_link_updated",
  ].includes(String(value));
}

async function getProfileRole(supabase: Awaited<ReturnType<typeof createClient>>, userId: string) {
  const { data } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();

  return data?.role;
}

function getAppointmentEmailData(appointment: AppointmentRecord, reason?: string | null) {
  return {
    fullName: appointment.full_name,
    phone: appointment.phone,
    date: appointment.appointment_date,
    time: appointment.slot_time,
    motive: appointment.motive,
    modality: appointment.modality,
    meetingLink: appointment.meeting_link,
    reason,
  };
}

async function fetchAppointment(
  supabase: Awaited<ReturnType<typeof createClient>>,
  appointmentId: string
): Promise<{ data: AppointmentRecord | null; error: { message: string } | null }> {
  const first = await supabase
    .from("appointments")
    .select(APPOINTMENT_SELECT_WITH_EMAIL)
    .eq("id", appointmentId)
    .maybeSingle();

  if (!first.error) {
    return { data: first.data as AppointmentRecord | null, error: null };
  }

  if (!first.error.message.toLowerCase().includes("citizen_email")) {
    return { data: null, error: first.error };
  }

  const retry = await supabase
    .from("appointments")
    .select(APPOINTMENT_SELECT_WITHOUT_EMAIL)
    .eq("id", appointmentId)
    .maybeSingle();

  return {
    data: retry.data as AppointmentRecord | null,
    error: retry.error,
  };
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null) as Record<string, unknown> | null;

  if (!body || !isNotificationType(body.type) || typeof body.appointmentId !== "string") {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { data: appointment, error } = await fetchAppointment(supabase, body.appointmentId);

  if (error || !appointment) {
    return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
  }

  if (body.type === "created") {
    if (appointment.citizen_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // El usuario autenticado ES el ciudadano (verificado arriba). Usamos su email
    // de sesion como fuente de verdad, no el citizen_email que viaja desde el
    // cliente, para evitar que se dispare un correo a una direccion arbitraria.
    const citizenEmail = user.email
      ?? ("citizen_email" in appointment && typeof appointment.citizen_email === "string"
        ? appointment.citizen_email
        : null);

    if (!citizenEmail) {
      return NextResponse.json({ sent: false, skipped: true });
    }

    const emailData = getAppointmentEmailData(appointment);
    const citizenEmailContent = citizenAppointmentCreatedEmail(emailData);

    const adminEmail = getAdminNotificationEmail();
    const tasks = [
      sendEmail({
        to: citizenEmail,
        subject: citizenEmailContent.subject,
        html: citizenEmailContent.html,
        text: citizenEmailContent.text,
      }),
    ];

    if (adminEmail) {
      const adminEmailContent = adminAppointmentCreatedEmail(emailData);

      tasks.push(sendEmail({
        to: adminEmail,
        subject: adminEmailContent.subject,
        html: adminEmailContent.html,
        text: adminEmailContent.text,
      }));
    }

    const results = await Promise.allSettled(tasks);
    return NextResponse.json({ sent: results.some((result) => result.status === "fulfilled" && result.value.sent) });
  }

  const role = await getProfileRole(supabase, user.id);
  const isCitizenCancellation = body.type === "cancelled_by_citizen";

  if (!isCitizenCancellation && role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (isCitizenCancellation && appointment.citizen_id !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const citizenEmail = "citizen_email" in appointment && typeof appointment.citizen_email === "string"
    ? appointment.citizen_email
    : isCitizenCancellation
      ? user.email
      : null;

  if (!citizenEmail) {
    return NextResponse.json({ sent: false, skipped: true, reason: "Missing citizen email" });
  }

  if (body.type === "meeting_link_updated" && !appointment.meeting_link) {
    return NextResponse.json({ sent: false, skipped: true, reason: "Missing meeting link" });
  }

  const reason = typeof body.reason === "string" ? body.reason : appointment.cancelled_reason;
  const emailData = getAppointmentEmailData(appointment, reason);

  const content = body.type === "confirmed"
    ? citizenAppointmentConfirmedEmail(emailData)
    : body.type === "rejected"
      ? citizenAppointmentRejectedEmail(emailData)
      : body.type === "meeting_link_updated"
        ? citizenAppointmentMeetingLinkEmail(emailData)
        : citizenAppointmentCancelledEmail(emailData);

  const result = await sendEmail({
    to: citizenEmail,
    subject: content.subject,
    html: content.html,
    text: content.text,
  });

  return NextResponse.json(result);
}
