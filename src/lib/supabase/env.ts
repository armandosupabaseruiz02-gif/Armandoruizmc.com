const SUPABASE_URL_KEY = "NEXT_PUBLIC_SUPABASE_URL";
const SUPABASE_ANON_KEY = "NEXT_PUBLIC_SUPABASE_ANON_KEY";

export function getSupabaseConfig() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return {
    supabaseUrl,
    supabaseAnonKey,
    isConfigured: Boolean(supabaseUrl && supabaseAnonKey),
  };
}

export function requireSupabaseConfig() {
  const config = getSupabaseConfig();

  if (!config.supabaseUrl || !config.supabaseAnonKey) {
    throw new Error(
      `Missing Supabase environment variables: ${SUPABASE_URL_KEY} and ${SUPABASE_ANON_KEY}`
    );
  }

  return {
    supabaseUrl: config.supabaseUrl,
    supabaseAnonKey: config.supabaseAnonKey,
  };
}
