import { createBrowserClient } from "@supabase/ssr";

/**
 * Supabase client for the browser (Client Components). Reads the public env
 * vars; all access is gated by the RLS policies in the migration.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)!,
  );
}
