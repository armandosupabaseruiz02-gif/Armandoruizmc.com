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

function getSafeHttpUrl(value?: string | null) {
  if (!value) return "";

  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : "";
  } catch {
    return "";
  }
}

const SITE = "https://www.armandoruizmc.com";

type Cta = { label: string; url: string };

/* Mismo diseño que el correo de bienvenida: cabecera naranja con el
   sombrero, tarjeta de detalles en crema, CTA de pastilla y pie con el
   slogan. Estilos inline porque los clientes de correo no cargan CSS. */
function layout(title: string, intro: string, details: string, footer?: string, cta?: Cta) {
  const ctaHtml = cta
    ? `
      <table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px auto 4px;">
        <tr>
          <td style="border-radius:999px;background:#ea580c;">
            <a href="${cta.url}"
               style="display:inline-block;padding:14px 32px;border-radius:999px;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;">
              ${cta.label}
            </a>
          </td>
        </tr>
      </table>`
    : "";

  return `
    <div style="margin:0;padding:0;background:#f7f4ef;font-family:Arial,Helvetica,sans-serif;color:#1f2937;">
      <div style="max-width:620px;margin:0 auto;padding:32px 16px;">
        <div style="background:#ffffff;border-radius:24px;overflow:hidden;border:1px solid #eadfd2;">

          <div style="background:#f97316;padding:30px 32px 26px;text-align:center;">
            <img src="${SITE}/images/sombrero.png" width="76" height="76" alt="Sombrero naranja, emblema del Diputado Armando Ruiz" style="display:block;margin:0 auto 12px;width:76px;height:76px;" />
            <p style="margin:0 0 6px;color:#ffffff;opacity:.85;font-size:12px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;">
              Portal Armando Ruiz
            </p>
            <h1 style="margin:0;font-size:26px;line-height:1.2;color:#ffffff;">
              ${title}
            </h1>
          </div>

          <div style="padding:28px 32px 30px;">
            <p style="margin:0 0 22px;font-size:16px;line-height:1.65;color:#4b5563;">
              ${intro}
            </p>
            <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:18px;padding:20px;">
              ${details}
            </div>
            ${ctaHtml}
            <p style="margin:20px 0 0;font-size:13px;line-height:1.6;color:#9ca3af;text-align:center;">
              ${footer || "Puedes revisar tus citas cuando quieras desde Mi Cuenta en armandoruizmc.com."}
            </p>
          </div>

          <div style="border-top:1px solid #f3e8db;background:#fffbf5;padding:18px 32px;text-align:center;">
            <p style="margin:0 0 4px;font-size:14px;font-weight:700;color:#7c2d12;">
              Discapacidad con dignidad.
            </p>
            <p style="margin:0;font-size:12px;color:#9ca3af;">
              Armando Ruiz · Diputado Federal · Movimiento Ciudadano
            </p>
          </div>

        </div>
      </div>
    </div>
  `;
}

function appointmentDetails(data: AppointmentEmailData) {
  const safeMeetingLink = getSafeHttpUrl(data.meetingLink);
  const meetingLink = safeMeetingLink
    ? `<p style="margin:10px 0 0;"><strong>Enlace:</strong> <a href="${escapeHtml(safeMeetingLink)}">${escapeHtml(safeMeetingLink)}</a></p>`
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
    getSafeHttpUrl(data.meetingLink) ? `Enlace: ${getSafeHttpUrl(data.meetingLink)}` : "",
    data.reason ? `Motivo del cambio: ${data.reason}` : "",
  ].filter(Boolean).join("\n");
}

export function citizenAppointmentCreatedEmail(data: AppointmentEmailData): EmailContent {
  return {
    subject: "Solicitud de cita recibida",
    html: layout(
      "Solicitud enviada",
      "Recibimos tu solicitud de cita. El equipo la revisará y te avisará cuando sea confirmada o si necesita algún ajuste.",
      appointmentDetails(data),
      undefined,
      { label: "Ver mis citas", url: `${SITE}/mi-cuenta` }
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
      "Este aviso es para el equipo del portal.",
      { label: "Abrir panel de citas", url: `${SITE}/admin/citas` }
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
      appointmentDetails(data),
      undefined,
      { label: "Ver mi cita", url: `${SITE}/mi-cuenta` }
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
      appointmentDetails(data),
      undefined,
      { label: "Agendar una nueva cita", url: `${SITE}/salud/agendar` }
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
      appointmentDetails(data),
      undefined,
      { label: "Volver a agendar", url: `${SITE}/salud/agendar` }
    ),
    text: `Tu cita fue cancelada.\n\n${textDetails(data)}`,
  };
}

export function citizenAppointmentMeetingLinkEmail(data: AppointmentEmailData): EmailContent {
  return {
    subject: "Enlace de videollamada de tu cita",
    html: layout(
      "Enlace de videollamada listo",
      "El equipo agregó el enlace para tu cita en línea. Guárdalo y entra unos minutos antes de la hora programada.",
      appointmentDetails(data),
      undefined,
      { label: "Ver mi cita", url: `${SITE}/mi-cuenta` }
    ),
    text: `Enlace de videollamada listo.\n\n${textDetails(data)}`,
  };
}
