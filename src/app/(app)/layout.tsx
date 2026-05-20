import Link from "next/link";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { siteConfig } from "@/lib/seo";

export const metadata = {
  robots: { index: false, follow: false },
};

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <div className="flex min-h-screen flex-col bg-stone-50">
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="font-serif text-base font-semibold tracking-tight">
              {siteConfig.name}
            </div>
            <span className="hidden text-xs uppercase tracking-[0.15em] text-muted-foreground sm:inline">
              Member dashboard
            </span>
          </Link>

          <div className="flex items-center gap-4 text-sm">
            <Link
              href="/insights"
              className="hidden text-foreground/80 hover:text-foreground sm:inline-flex"
            >
              Insights
            </Link>
            <span className="hidden text-xs text-muted-foreground sm:inline">
              {user.email}
            </span>
            <form action="/auth/signout" method="post">
              <button
                type="submit"
                className="rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-stone-100"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>
    </div>
  );
}
