import { NextResponse } from "next/server";
import type { Provider } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/server";

const ALLOWED_PROVIDERS = new Set<Provider>(["google"]);

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const providerParam = searchParams.get("provider");

  if (!providerParam || !ALLOWED_PROVIDERS.has(providerParam as Provider)) {
    return NextResponse.redirect(
      `${origin}/login?error=unsupported-provider`,
    );
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: providerParam as Provider,
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  });

  if (error || !data.url) {
    const message = error?.message ?? "oauth-init-failed";
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(message)}`,
    );
  }

  return NextResponse.redirect(data.url);
}
