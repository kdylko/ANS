import type { PostgrestError } from "@supabase/supabase-js";

/** Postgrest "no rows" — expected when using maybeSingle() with zero matches. */
export function isNoRowsError(error: PostgrestError | null): boolean {
  return error?.code === "PGRST116";
}

export function formatPostgrestError(error: PostgrestError): string {
  const parts = [
    error.message,
    error.code && `code=${error.code}`,
    error.details && `details=${error.details}`,
    error.hint && `hint=${error.hint}`,
  ].filter(Boolean);
  return parts.join(" | ") || "Unknown PostgREST error";
}
