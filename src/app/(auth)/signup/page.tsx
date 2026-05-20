import Link from "next/link";
import type { Metadata } from "next";

import { OAuthButtons } from "../_components/oauth-buttons";
import { signup } from "./actions";

export const metadata: Metadata = {
  title: "Create account",
  robots: { index: false, follow: false },
};

type SignupPageProps = {
  searchParams: Promise<{ error?: string; status?: string }>;
};

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const { error, status } = await searchParams;

  if (status === "check-email") {
    return (
      <div className="rounded-lg border border-border bg-background p-8 shadow-sm text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Almost there
        </p>
        <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight">
          Check your email
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-muted">
          We sent a confirmation link to your inbox. Open it to finish creating
          your account and access the member dashboard.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-background p-8 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        New members
      </p>
      <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight">
        Create account
      </h1>
      <p className="mt-2 text-sm text-muted">
        Start with a 7-day free preview. No credit card required.
      </p>

      <form action={signup} className="mt-8 flex flex-col gap-4">
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Email
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Password
          <input
            type="password"
            name="password"
            required
            minLength={6}
            autoComplete="new-password"
            className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
          />
        </label>

        {error && (
          <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="mt-2 inline-flex items-center justify-center rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90"
        >
          Create account
        </button>
      </form>

      <div className="my-6 flex items-center gap-3 text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
        <div className="h-px flex-1 bg-border" />
        or
        <div className="h-px flex-1 bg-border" />
      </div>

      <OAuthButtons />

      <p className="mt-8 text-sm text-muted">
        Already a member?{" "}
        <Link
          href="/login"
          className="font-medium text-accent underline underline-offset-4"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
