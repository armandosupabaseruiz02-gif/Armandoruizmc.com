type AppointmentEmailData = {
  fullName: string;
  phone?: string | null;
  date: string;
  time: string;
  motive: string;
  modality?: string | null;
  meetingLink?: string | null;
  reason?: string | null;
};

type EmailContent = {
  subject: string;
  html: string;
  text: string;
};

function formatDate(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("es-MX", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatTime(time: string) {
  return `${time.slice(0, 5)} hrs`;
}

function modalityLabel(modality?: string | null) {
  return modality === "en_linea" ? "En línea por videollamada" : "Presencial";
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function layout(title: string, intro: string, details: string, footer?: string) {
  return `
    <div style="margin:0;padding:0;background:#f7f4ef;font-family:Arial,sans-serif;color:#1f2937;">
      <div style="max-width:620px;margin:0 auto;padding:32px 16px;">
        <div style="background:#ffffff;border-radius:24px;padding:32px;border:1px solid #eadfd2;">
          <p style="margin:0 0 10px;color:#ea580c;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;">
            Portal Armando Ruiz
          </p>
          <h1 style="margin:0 0 16px;font-size:28px;line-height:1.15;color:#111827;">
            ${title}
          </h1>
          <p style="margin:0 0 24px;font-size:16px;line-height:1.6;color:#4b5563;">
            ${intro}
          </p>
          <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:18px;padding:20px;margin-bottom:24px;">
            ${details}
          </div>
          <p style="margin:0;font-size:14px;line-height:1.6;color:#6b7280;">
            ${footer || "Puedes revisar tus citas desde Mi Cuenta en armandoruizmc.com."}
          </p>
        </div>
      </div>
    </div>
  `;
}

function appointmentDetails(data: AppointmentEmailData) {
  const meetingLink = data.meetingLink
    ? `<p style="margin:10px 0 0;"><strong>Enlace:</strong> <a href="${escapeHtml(data.meetingLink)}">${escapeHtml(data.meetingLink)}</a></p>`
    : "";
  const reason = data.reason
    ? `<p style="margin:10px 0 0;"><strong>Motivo del cambio:</strong> ${escapeHtml(data.reason)}</p>`
    : "";

  return `
    <p style="margin:0 0 10px;"><strong>Nombre:</strong> ${escapeHtml(data.fullName)}</p>
    <p style="margin:0 0 10px;"><strong>Fecha:</strong> ${formatDate(data.date)}</p>
    <p style="margin:0 0 10px;"><strong>Hora:</strong> ${formatTime(data.time)}</p>
    <p style="margin:0 0 10px;"><strong>Modalidad:</strong> ${modalityLabel(data.modality)}</p>
    <p style="margin:0;"><strong>Motivo:</strong> ${escapeHtml(data.motive)}</p>
    ${meetingLink}
    ${reason}
  `;
}

function textDetails(data: AppointmentEmailData) {
  return [
    `Nombre: ${data.fullName}`,
    `Fecha: ${formatDate(data.date)}`,
    `Hora: ${formatTime(data.time)}`,
    `Modalidad: ${modalityLabel(data.modality)}`,
    `Motivo: ${data.motive}`,
    data.meetingLink ? `Enlace: ${data.meetingLink}` : "",
    data.reason ? `Motivo del cambio: ${data.reason}` : "",
  ].filter(Boolean).join("\n");
}

export function citizenAppointmentCreatedEmail(data: AppointmentEmailData): EmailContent {
  return {
    subject: "Solicitud de cita recibida",
    html: layout(
      "Solicitud enviada",
      "Recibimos tu solicitud de cita. El equipo la revisará y te avisará cuando sea confirmada o si necesita algún ajuste.",
      appointmentDetails(data)
    ),
    text: `Solicitud enviada\n\nRecibimos tu solicitud de cita.\n\n${textDetails(data)}`,
  };
}

export function adminAppointmentCreatedEmail(data: AppointmentEmailData): EmailContent {
  return {
    subject: "Nueva solicitud de cita",
    html: layout(
      "Nueva solicitud de cita",
      "Entró una nueva solicitud. Revísala desde el panel de administración para aceptarla o rechazarla.",
      appointmentDetails(data),
      "Entra al panel de administración para dar seguimiento."
    ),
    text: `Nueva solicitud de cita\n\n${textDetails(data)}`,
  };
}

export function citizenAppointmentConfirmedEmail(data: AppointmentEmailData): EmailContent {
  return {
    subject: "Tu cita fue confirmada",
    html: layout(
      "Cita confirmada",
      "Tu cita fue aceptada por el equipo. Guarda esta información y revisa Mi Cuenta si necesitas ver detalles.",
      appointmentDetails(data)
    ),
    text: `Tu cita fue confirmada.\n\n${textDetails(data)}`,
  };
}

export function citizenAppointmentRejectedEmail(data: AppointmentEmailData): EmailContent {
  return {
    subject: "Tu solicitud de cita no fue aceptada",
    html: layout(
      "Solicitud no aceptada",
      "Tu solicitud no fue aceptada. Si todavía necesitas apoyo, puedes crear una nueva solicitud con más información.",
      appointmentDetails(data)
    ),
    text: `Tu solicitud de cita no fue aceptada.\n\n${textDetails(data)}`,
  };
}

export function citizenAppointmentCancelledEmail(data: AppointmentEmailData): EmailContent {
  return {
    subject: "Tu cita fue cancelada",
    html: layout(
      "Cita cancelada",
      "Tu cita fue cancelada. Si necesitas apoyo, puedes volver a agendar desde la página.",
      appointmentDetails(data)
    ),
    text: `Tu cita fue cancelada.\n\n${textDetails(data)}`,
  };
}
