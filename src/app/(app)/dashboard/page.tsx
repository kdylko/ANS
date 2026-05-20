import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

import { createClient } from "@/lib/supabase/server";
import { articles } from "@/content/articles";
import { getSubscription, PRICING } from "@/lib/billing";
import { siteConfig } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const STATUS_LABELS = {
  active: { label: "Active", tone: "emerald" },
  trialing: { label: "Trial", tone: "blue" },
  past_due: { label: "Past due", tone: "amber" },
  canceled: { label: "Canceled", tone: "stone" },
  inactive: { label: "Inactive", tone: "stone" },
} as const;

const TONE_CLASSES = {
  emerald: "bg-emerald-50 text-emerald-800 border-emerald-200",
  blue: "bg-blue-50 text-blue-800 border-blue-200",
  amber: "bg-amber-50 text-amber-800 border-amber-200",
  stone: "bg-stone-100 text-stone-700 border-stone-200",
} as const;

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const subscription = await getSubscription(user.id);
  const statusMeta = STATUS_LABELS[subscription.status];
  const recent = articles.slice(0, 4);

  const displayName =
    (user.user_metadata?.full_name as string | undefined) ??
    (user.user_metadata?.name as string | undefined) ??
    user.email?.split("@")[0] ??
    "there";

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Dashboard
        </p>
        <h1 className="font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
          Welcome back, {displayName}.
        </h1>
        <p className="text-sm text-muted">
          Your private workspace for {siteConfig.name} research.
        </p>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        <div className="rounded-lg border border-border bg-background p-6 shadow-sm md:col-span-2">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Subscription
              </p>
              <h2 className="mt-2 font-serif text-2xl font-semibold">
                {subscription.plan === "pro"
                  ? "Pro Membership"
                  : "Free account"}
              </h2>
            </div>
            <span
              className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${TONE_CLASSES[statusMeta.tone]}`}
            >
              {statusMeta.label}
            </span>
          </div>

          {subscription.status === "inactive" && (
            <>
              <p className="mt-4 text-sm leading-relaxed text-muted">
                You don&apos;t have an active subscription. Upgrade to Pro for{" "}
                <strong>${PRICING.monthly.amount}/month</strong> to unlock daily
                briefings, deep dives, members&apos; chat, and live analyst
                calls.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/pricing"
                  className="inline-flex items-center justify-center rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90"
                >
                  Upgrade to Pro
                </Link>
                <Link
                  href="/insights"
                  className="inline-flex items-center justify-center rounded-md border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-stone-100"
                >
                  Browse free preview
                </Link>
              </div>
            </>
          )}

          {(subscription.status === "active" ||
            subscription.status === "trialing") && (
            <>
              <p className="mt-4 text-sm leading-relaxed text-muted">
                Your subscription is in good standing.
                {subscription.currentPeriodEnd
                  ? ` Renews ${formatDate(subscription.currentPeriodEnd.toISOString())}.`
                  : ""}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/insights"
                  className="inline-flex items-center justify-center rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90"
                >
                  Read latest research
                </Link>
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-md border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-stone-100"
                  disabled
                >
                  Manage billing
                </button>
              </div>
            </>
          )}
        </div>

        <div className="rounded-lg border border-border bg-background p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Account
          </p>
          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="text-muted-foreground">Email</dt>
              <dd className="font-medium text-foreground">{user.email}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Member since</dt>
              <dd className="font-medium text-foreground">
                {formatDate(user.created_at)}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">User ID</dt>
              <dd className="break-all font-mono text-xs text-foreground/70">
                {user.id}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="mt-10">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Research desk
            </p>
            <h2 className="mt-2 font-serif text-2xl font-semibold tracking-tight">
              Latest insights
            </h2>
          </div>
          <Link
            href="/insights"
            className="text-sm font-medium text-accent underline-offset-4 hover:underline"
          >
            All insights →
          </Link>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {recent.map((article) => (
            <Link
              key={article.slug}
              href={`/insights/${article.slug}`}
              className="group block"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-stone-100">
                <Image
                  src={article.heroImage.src}
                  alt={article.heroImage.alt}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <p className="mt-3 text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                {article.category}
              </p>
              <h3 className="mt-2 font-serif text-base font-semibold leading-snug">
                {article.title}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
