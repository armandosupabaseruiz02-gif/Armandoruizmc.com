/* Correo de bienvenida: se envia UNA vez, en el primer inicio de sesion
   (Google o confirmacion de correo). Diseño en clave de la pagina:
   cabecera naranja con el sombrero, tono amigable y CTAs de pastilla.
   Todo con estilos inline (los clientes de correo no cargan CSS externo). */

const SITE = "https://www.armandoruizmc.com";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function welcomeEmail(fullName: string | null | undefined) {
  const firstName = escapeHtml((fullName ?? "").trim().split(/\s+/)[0] || "");
  const saludo = firstName ? `¡Qué gusto tenerte, ${firstName}!` : "¡Qué gusto tenerte!";

  const beneficios = [
    {
      emoji: "🗓️",
      titulo: "Agenda tu asesoría",
      desc: "De salud o discapacidad, en persona o por videollamada. Tú eliges.",
    },
    {
      emoji: "📋",
      titulo: "Sigue tus trámites",
      desc: "Tus citas y solicitudes quedan guardadas en tu cuenta, sin perder nada.",
    },
    {
      emoji: "📣",
      titulo: "Haz que te escuchen",
      desc: "Tu voz se potencia con el equipo del diputado de tu lado.",
    },
  ];

  const beneficiosHtml = beneficios
    .map(
      (b) => `
        <tr>
          <td style="padding:0 0 12px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#fff7ed;border:1px solid #fed7aa;border-radius:16px;">
              <tr>
                <td style="width:52px;padding:16px 0 16px 18px;font-size:26px;line-height:1;" aria-hidden="true">${b.emoji}</td>
                <td style="padding:14px 18px 14px 8px;">
                  <p style="margin:0;font-size:15px;font-weight:700;color:#7c2d12;">${b.titulo}</p>
                  <p style="margin:2px 0 0;font-size:13px;line-height:1.5;color:#57534e;">${b.desc}</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>`,
    )
    .join("");

  const html = `
    <div style="margin:0;padding:0;background:#f7f4ef;font-family:Arial,Helvetica,sans-serif;color:#1f2937;">
      <div style="max-width:620px;margin:0 auto;padding:32px 16px;">
        <div style="background:#ffffff;border-radius:24px;overflow:hidden;border:1px solid #eadfd2;">

          <!-- Cabecera naranja con el sombrero -->
          <div style="background:#f97316;padding:36px 32px 30px;text-align:center;">
            <img src="${SITE}/images/sombrero.png" width="96" height="96" alt="Sombrero naranja, emblema del Diputado Armando Ruiz" style="display:block;margin:0 auto 14px;width:96px;height:96px;" />
            <p style="margin:0 0 6px;color:#ffffff;opacity:.85;font-size:12px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;">
              Portal Armando Ruiz
            </p>
            <h1 style="margin:0;font-size:30px;line-height:1.15;color:#ffffff;">
              ${saludo}
            </h1>
          </div>

          <!-- Cuerpo -->
          <div style="padding:30px 32px 32px;">
            <p style="margin:0 0 22px;font-size:16px;line-height:1.65;color:#4b5563;">
              Tu cuenta ciudadana ya está lista. Aquí nadie te va a marear con
              papeleo ni con mil vueltas: tú cuéntanos qué necesitas y entre
              todos le buscamos — de la mano y paso a pasito.
            </p>

            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              ${beneficiosHtml}
            </table>

            <!-- CTA -->
            <table role="presentation" cellpadding="0" cellspacing="0" style="margin:26px auto 8px;">
              <tr>
                <td style="border-radius:999px;background:#ea580c;">
                  <a href="${SITE}/mi-cuenta"
                     style="display:inline-block;padding:15px 34px;border-radius:999px;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;">
                    Ir a mi cuenta
                  </a>
                </td>
              </tr>
            </table>
            <p style="margin:0;text-align:center;">
              <a href="${SITE}/salud/agendar" style="font-size:13px;font-weight:700;color:#ea580c;text-decoration:underline;">
                o agenda tu primera asesoría aquí
              </a>
            </p>
          </div>

          <!-- Pie -->
          <div style="border-top:1px solid #f3e8db;background:#fffbf5;padding:20px 32px;text-align:center;">
            <p style="margin:0 0 4px;font-size:14px;font-weight:700;color:#7c2d12;">
              Discapacidad con dignidad.
            </p>
            <p style="margin:0;font-size:12px;line-height:1.6;color:#9ca3af;">
              Armando Ruiz · Diputado Federal · Movimiento Ciudadano<br />
              Recibiste este correo porque creaste tu cuenta en
              <a href="${SITE}" style="color:#ea580c;text-decoration:none;">armandoruizmc.com</a>.
            </p>
          </div>

        </div>
      </div>
    </div>
  `;

  const text = [
    saludo,
    "",
    "Tu cuenta ciudadana del Portal Armando Ruiz ya está lista.",
    "Aquí nadie te va a marear con papeleo: tú cuéntanos qué necesitas y entre todos le buscamos.",
    "",
    "Con tu cuenta puedes:",
    "- Agendar tu asesoría de salud o discapacidad (en persona o en línea).",
    "- Darle seguimiento a tus citas y trámites.",
    "- Hacer que tu voz se escuche con el equipo del diputado de tu lado.",
    "",
    `Entra a tu cuenta: ${SITE}/mi-cuenta`,
    `Agenda tu primera asesoría: ${SITE}/salud/agendar`,
    "",
    "Discapacidad con dignidad.",
    "Armando Ruiz · Diputado Federal · Movimiento Ciudadano",
  ].join("\n");

  return {
    subject: "¡Qué gusto tenerte! Tu cuenta ya está lista",
    html,
    text,
  };
}
