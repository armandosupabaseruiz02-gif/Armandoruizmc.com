import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseConfig } from "./env";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });
  const protectedPaths = ["/mi-cuenta", "/admin", "/salud/agendar"];
  const isProtected = protectedPaths.some((p) =>
    request.nextUrl.pathname.startsWith(p)
  );

  const supabaseConfig = getSupabaseConfig();

  if (!supabaseConfig.isConfigured) {
    console.error(
      "Missing Supabase environment variables in Vercel: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY"
    );

    if (isProtected) {
      const url = request.nextUrl.clone();
      url.pathname = "/auth/login";
      url.searchParams.set("error", "supabase-config");
      url.searchParams.set("redirectTo", request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }

    return supabaseResponse;
  }

  const supabase = createServerClient(
    supabaseConfig.supabaseUrl!,
    supabaseConfig.supabaseAnonKey!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  if (isProtected && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    url.searchParams.set("redirectTo", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  const adminPaths = ["/admin"];
  const isAdmin = adminPaths.some((p) =>
    request.nextUrl.pathname.startsWith(p)
  );

  if (isAdmin && user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      return NextResponse.redirect(new URL("/mi-cuenta", request.url));
    }
  }

  return supabaseResponse;
}
