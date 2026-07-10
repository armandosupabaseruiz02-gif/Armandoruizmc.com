import { createClient } from "@/lib/supabase/server";
import { getSafeRedirect } from "@/lib/auth/redirect";
import { sendEmail } from "@/lib/email/resend";
import { welcomeEmail } from "@/lib/email/welcome";
import { NextResponse } from "next/server";

/* Bienvenida de una sola vez: el UPDATE condicional (welcomed_at is null)
   "aparta" el envio de forma atomica; si dos callbacks llegaran a la vez,
   solo uno recibe la fila y manda el correo. Si Resend fallara, preferimos
   perder la bienvenida a arriesgar duplicados, y el login nunca se bloquea. */
async function sendWelcomeIfFirstLogin(supabase: Awaited<ReturnType<typeof createClient>>) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) return;

    const { data: claimed } = await supabase
      .from("profiles")
      .update({ welcomed_at: new Date().toISOString() })
      .eq("id", user.id)
      .is("welcomed_at", null)
      .select("full_name");

    if (!claimed || claimed.length === 0) return;

    const fullName =
      claimed[0].full_name ||
      (user.user_metadata?.full_name as string | undefined) ||
      (user.user_metadata?.name as string | undefined) ||
      "";

    const content = welcomeEmail(fullName);
    await sendEmail({
      to: user.email,
      subject: content.subject,
      html: content.html,
      text: content.text,
    });
  } catch (error) {
    console.error("Welcome email failed:", error);
  }
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = getSafeRedirect(searchParams.get("next"));

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      await sendWelcomeIfFirstLogin(supabase);
      return NextResponse.redirect(new URL(next, origin));
    }
  }

  return NextResponse.redirect(`${origin}/auth/login?error=auth`);
}
