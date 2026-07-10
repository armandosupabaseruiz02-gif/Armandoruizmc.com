import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PageWrapper from "@/components/layout/PageWrapper";
import AdminIniciativas, { type IniciativaAdmin } from "./AdminIniciativas";

export const metadata: Metadata = {
  title: "Admin · Iniciativas",
};

export default async function AdminIniciativasPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login?redirectTo=/admin/iniciativas");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") redirect("/mi-cuenta");

  const { data: iniciativas } = await supabase
    .from("initiatives")
    .select("id, title, summary, description, status, topic, presented_at, document_url, published, created_at")
    .order("created_at", { ascending: false });

  return (
    <PageWrapper>
      <section className="relative bg-gray-900 pt-20 pb-14 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" aria-hidden="true" />
        <div className="relative max-w-6xl mx-auto px-5 sm:px-8">
          <p className="text-[12px] font-bold text-naranja-400 uppercase tracking-widest mb-3">
            Panel de Administración
          </p>
          <h1 className="text-[38px] sm:text-[48px] font-black text-white leading-tight">
            Iniciativas legislativas
          </h1>
          <p className="text-gray-300 mt-2 text-[16px]">
            Hola, {profile?.full_name?.split(" ")[0]} · Sube y publica las iniciativas avaladas
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/admin/citas"
              className="inline-flex min-h-11 items-center rounded-full border border-white/25 px-4 text-[14px] font-bold text-white/80 transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-naranja-400"
            >
              Ir a citas
            </Link>
            <Link
              href="/iniciativas"
              className="inline-flex min-h-11 items-center rounded-full border border-white/25 px-4 text-[14px] font-bold text-white/80 transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-naranja-400"
            >
              Ver página pública
            </Link>
          </div>
        </div>
      </section>

      <section className="py-10 bg-warm-50 min-h-[60vh]">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <AdminIniciativas iniciativas={(iniciativas as IniciativaAdmin[]) ?? []} />
        </div>
      </section>
    </PageWrapper>
  );
}
