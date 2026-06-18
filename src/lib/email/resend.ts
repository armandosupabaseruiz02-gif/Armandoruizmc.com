type SendEmailInput = {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
};

type SendEmailResult = {
  sent: boolean;
  skipped?: boolean;
  error?: string;
};

function getResendApiKey() {
  return process.env.RESEND_API_KEY?.trim();
}

function getFromEmail() {
  return process.env.EMAIL_FROM?.trim() || "Portal Armando Ruiz <noreply@armandoruizmc.com>";
}

export function getAdminNotificationEmail() {
  return process.env.APPOINTMENTS_ADMIN_EMAIL?.trim();
}

export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
  const apiKey = getResendApiKey();

  if (!apiKey) {
    console.warn("RESEND_API_KEY is not configured. Email skipped.");
    return { sent: false, skipped: true };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: getFromEmail(),
      to: input.to,
      subject: input.subject,
      html: input.html,
      text: input.text,
      reply_to: input.replyTo,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("Resend email failed:", error);
    return { sent: false, error };
  }

  return { sent: true };
}
