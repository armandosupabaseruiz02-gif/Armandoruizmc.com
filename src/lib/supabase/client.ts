import { createBrowserClient } from "@supabase/ssr";
import { requireSupabaseConfig } from "./env";

export function createClient() {
  const { supabaseUrl, supabaseAnonKey } = requireSupabaseConfig();

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
