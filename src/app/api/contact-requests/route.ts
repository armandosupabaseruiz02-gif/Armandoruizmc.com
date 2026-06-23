import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const REQUEST_TYPES = [
  "job_application",
  "vacancy_registration",
  "ally",
  "donation",
  "accessibility",
  "general",
] as const;

type RequestType = (typeof REQUEST_TYPES)[number];
type MetadataValue = string | number | boolean | null;

const rateLimitStore = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;

function isRequestType(value: unknown): value is RequestType {
  return REQUEST_TYPES.includes(value as RequestType);
}

function cleanText(value: unknown, maxLength: number) {
  if (typeof value !== "string") return "";
  return value.replace(/[\u0000-\u001F\u007F]/g, " ").replace(/\s+/g, " ").trim().slice(0, maxLength);
}

function cleanLongText(value: unknown, maxLength: number) {
  if (typeof value !== "string") return "";
  return value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, " ").trim().slice(0, maxLength);
}

function cleanEmail(value: unknown) {
  const email = cleanText(value, 254).toLowerCase();
  if (!email) return null;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : null;
}

function cleanMetadata(value: unknown): Record<string, MetadataValue> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};

  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>)
      .slice(0, 12)
      .flatMap(([key, entry]) => {
        const cleanKey = cleanText(key, 48);
        if (!cleanKey) return [];

        if (
          typeof entry === "string" ||
          typeof entry === "number" ||
          typeof entry === "boolean" ||
          entry === null
        ) {
          return [[cleanKey, typeof entry === "string" ? cleanText(entry, 180) : entry]];
        }

        return [];
      })
  );
}

function getClientKey(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const realIp = request.headers.get("x-real-ip")?.trim();
  const userAgent = request.headers.get("user-agent")?.slice(0, 80) ?? "unknown";

  return `${forwardedFor || realIp || "unknown"}:${userAgent}`;
}

function isRateLimited(key: string) {
  const now = Date.now();
  const current = rateLimitStore.get(key);

  if (!current || current.resetAt <= now) {
    rateLimitStore.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  current.count += 1;
  return current.count > RATE_LIMIT_MAX;
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;

  if (!body || !isRequestType(body.requestType)) {
    return NextResponse.json({ error: "Solicitud inválida." }, { status: 400 });
  }

  const openedAt = typeof body.openedAt === "number" ? body.openedAt : 0;
  const website = cleanText(body.website, 180);

  if (website || !openedAt || Date.now() - openedAt < 1500) {
    return NextResponse.json({ ok: true, skipped: true });
  }

  if (body.consent !== true) {
    return NextResponse.json({ error: "Falta autorización para dar seguimiento." }, { status: 400 });
  }

  const key = getClientKey(request);
  if (isRateLimited(key)) {
    return NextResponse.json({ error: "Demasiadas solicitudes. Intenta más tarde." }, { status: 429 });
  }

  const fullName = cleanText(body.fullName, 120);
  const subject = cleanText(body.subject, 160);
  const message = cleanLongText(body.message, 3000);
  const phone = cleanText(body.phone, 30) || null;
  const email = cleanEmail(body.email);
  const organization = cleanText(body.organization, 160) || null;
  const metadata = cleanMetadata(body.metadata);

  if (fullName.length < 2 || subject.length < 2 || message.length < 5) {
    return NextResponse.json({ error: "Completa los campos requeridos." }, { status: 400 });
  }

  const supabase = await createClient();
  const { error } = await supabase.from("contact_requests").insert({
    request_type: body.requestType,
    full_name: fullName,
    phone,
    email,
    organization,
    subject,
    message,
    metadata,
  });

  if (error) {
    return NextResponse.json({ error: "No se pudo guardar la solicitud." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
