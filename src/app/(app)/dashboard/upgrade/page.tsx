import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

import { createClient } from "@/lib/supabase/server";
import {
  getActiveSubscriptionByEmail,
  PRICING,
} from "@/lib/billing";
import { startCheckout } from "./actions";

export const metadata: Metadata = {
  title: "Confirm upgrade",
  robots: { index: false, follow: false },
};

type UpgradePageProps = {
  searchParams: Promise<{ error?: string; plan?: string; checkout?: string }>;
};

const featuresIncluded = [
  "Daily morning macro briefing",
  "Two long-form deep dives per week",
  "Weekly live analyst call with replay",
  "Members' chat with allocators and PMs",
  "Full archive of past research",
  "Cancel anytime",
];

export default async function UpgradePage({ searchParams }: UpgradePageProps) {
  const { error, plan: planParam, checkout } = await searchParams;
  const plan = planParam === "annual" ? "annual" : "monthly";
  const planConfig = PRICING[plan];

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !user.email) redirect("/login");

  const existing = await getActiveSubscriptionByEmail(user.email);
  if (existing) {
    redirect("/dashboard?status=already-active");
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <Link
        href="/dashboard"
        className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground"
      >
        ← Dashboard
      </Link>

      <h1 className="mt-6 font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
        Confirm your membership
      </h1>
      <p className="mt-3 text-muted">
        You&apos;re about to start an Alpha Network State Pro membership.
        Please confirm the details below.
      </p>

      <div className="mt-8 overflow-hidden rounded-lg border border-border bg-background shadow-sm">
        <div className="border-b border-border bg-card px-6 py-5">
          <div className="flex items-baseline justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                {planConfig.label} plan
              </p>
              <p className="mt-1 font-serif text-2xl font-semibold tracking-tight">
                Pro Membership
              </p>
            </div>
            <div className="text-right">
              <p className="font-serif text-4xl font-semibold tabular-nums">
                ${planConfig.amount}
              </p>
              <p className="text-xs text-muted-foreground">
                per {planConfig.interval}
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 py-5">
          <dl className="grid grid-cols-[max-content_1fr] gap-x-6 gap-y-3 text-sm">
            <dt className="text-muted-foreground">Account</dt>
            <dd className="font-medium text-foreground">{user.email}</dd>
            <dt className="text-muted-foreground">Plan</dt>
            <dd className="font-medium text-foreground">
              {planConfig.label} · ${planConfig.amount} {planConfig.currency}
            </dd>
            <dt className="text-muted-foreground">Period</dt>
            <dd className="font-medium text-foreground">
              {planConfig.periodDays} days
            </dd>
          </dl>

          <ul className="mt-6 space-y-2 border-t border-border pt-6">
            {featuresIncluded.map((feature) => (
              <li
                key={feature}
                className="flex items-start gap-2 text-sm text-foreground"
              >
                <CheckIcon />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t border-border bg-stone-50 px-6 py-4 text-xs text-muted">
          You will be redirected to Stripe to enter payment details securely.
          Your license key appears on the dashboard after payment is confirmed.
        </div>
      </div>

      {checkout === "cancelled" && (
        <p className="mt-6 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Checkout was cancelled. You can try again when ready.
        </p>
      )}

      {error && (
        <p className="mt-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          Something went wrong: {error}
        </p>
      )}

      <form action={startCheckout} className="mt-8 flex flex-wrap gap-3">
        <input type="hidden" name="plan" value={plan} />
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-md bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90"
        >
          Continue to Stripe — ${planConfig.amount}/{planConfig.interval}
        </button>
        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center rounded-md border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-stone-100"
        >
          Cancel
        </Link>
      </form>

      <p className="mt-6 text-xs text-muted-foreground">
        By continuing you agree to our terms of service. You can cancel anytime
        from your dashboard via Manage billing.
      </p>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mt-0.5 shrink-0 text-accent"
      aria-hidden
    >
      <path
        d="M5 10.5L8.5 14L15 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
