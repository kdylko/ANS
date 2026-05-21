import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cached: SupabaseClient | null = null;

/**
 * Returns a Supabase client authenticated with the service_role key.
 *
 * IMPORTANT: This client bypasses Row Level Security. It must NEVER be imported
 * into a client component or any code path that ships to the browser. The
 * `server-only` import above causes a build error if that ever happens.
 *
 * Use sparingly — prefer the regular server client (anon key + RLS) for
 * anything that can be expressed through a row-level policy.
 */
export function createAdminClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "Missing Supabase admin env vars: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required",
    );
  }

  if (!cached) {
    cached = createClient(url, serviceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  return cached;
}
