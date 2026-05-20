import Link from "next/link";

import { createClient } from "@/lib/supabase/server";
import { navConfig, siteConfig } from "@/lib/seo";

export async function SiteNav() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-3">
          <Logo />
          <div className="flex flex-col leading-none">
            <span className="font-serif text-base font-semibold tracking-tight">
              {siteConfig.name}
            </span>
            <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Research &amp; Strategy
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navConfig.main.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <Link
              href="/dashboard"
              className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden text-sm font-medium text-foreground/80 transition-colors hover:text-foreground sm:inline-flex"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90"
              >
                Subscribe
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

function Logo() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <rect width="32" height="32" rx="4" fill="#0f3d2e" />
      <path
        d="M8 22V12L12 22M12 22V12M12 22L16 12L20 22M20 22V12M20 22L24 12"
        stroke="#b08940"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
