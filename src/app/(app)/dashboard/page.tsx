import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

import { createClient } from "@/lib/supabase/server";
import { articles } from "@/content/articles";
import {
  getActiveSubscriptionByEmail,
  isSubscriptionLive,
  PRICING,
  type SubscriptionRow,
} from "@/lib/billing";
import { getStripeCustomerByUserId } from "@/lib/stripe-db";
import { siteConfig } from "@/lib/seo";
import { openBillingPortal } from "./actions";

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

type DashboardPageProps = {
  searchParams: Promise<{ status?: string; error?: string }>;
};

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const { status: flashStatus, error: flashError } = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const subscription = user.email
    ? await getActiveSubscriptionByEmail(user.email)
    : null;

  const stripeCustomer = await getStripeCustomerByUserId(user.id);
  const isLive = subscription ? isSubscriptionLive(subscription) : false;
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

      <FlashMessage status={flashStatus} error={flashError} />

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        <SubscriptionCard
          subscription={subscription}
          isLive={isLive}
          hasStripeCustomer={Boolean(stripeCustomer)}
        />
        <AccountCard user={user} />
      </div>

      {subscription && isLive && (
        <LicenseCard subscription={subscription} />
      )}

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

function FlashMessage({
  status,
  error,
}: {
  status?: string;
  error?: string;
}) {
  if (status === "subscribed" || status === "success") {
    return (
      <div className="mt-6 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
        <strong>Payment received.</strong> Your subscription is being activated —
        refresh in a moment if your license key is not shown yet. Use it in the
        ANS Telegram bot when ready.
      </div>
    );
  }
  if (status === "checkout-cancelled") {
    return (
      <div className="mt-6 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        Checkout was cancelled. You can try again anytime from Upgrade to Pro.
      </div>
    );
  }
  if (status === "already-active") {
    return (
      <div className="mt-6 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        You already have an active subscription.
      </div>
    );
  }
  if (error) {
    return (
      <div className="mt-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
        <strong>Something went wrong:</strong> {error}
      </div>
    );
  }
  return null;
}

function SubscriptionCard({
  subscription,
  isLive,
  hasStripeCustomer,
}: {
  subscription: SubscriptionRow | null;
  isLive: boolean;
  hasStripeCustomer: boolean;
}) {
  if (!subscription) {
    return (
      <div className="rounded-lg border border-border bg-background p-6 shadow-sm md:col-span-2">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Subscription
            </p>
            <h2 className="mt-2 font-serif text-2xl font-semibold">
              Free account
            </h2>
          </div>
          <span className="inline-flex items-center rounded-full border border-stone-200 bg-stone-100 px-3 py-1 text-xs font-medium text-stone-700">
            Inactive
          </span>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-muted">
          You don&apos;t have an active subscription. Upgrade to Pro for{" "}
          <strong>${PRICING.monthly.amount}/month</strong> to unlock daily
          briefings, deep dives, members&apos; chat, and live analyst calls.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/dashboard/upgrade"
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
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-background p-6 shadow-sm md:col-span-2">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Subscription
          </p>
          <h2 className="mt-2 font-serif text-2xl font-semibold">
            Pro Membership
          </h2>
        </div>
        <span
          className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${
            isLive
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-stone-200 bg-stone-100 text-stone-700"
          }`}
        >
          {isLive ? "Active" : subscription.status}
        </span>
      </div>

      <dl className="mt-6 grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-muted-foreground">Status</dt>
          <dd className="font-medium text-foreground capitalize">
            {subscription.status}
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Valid until</dt>
          <dd className="font-medium text-foreground">
            {subscription.valid_until
              ? formatDate(subscription.valid_until)
              : "—"}
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Activated</dt>
          <dd className="font-medium text-foreground">
            {formatDate(subscription.created_at)}
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Telegram</dt>
          <dd className="font-medium text-foreground">
            {subscription.telegram_id
              ? `@${subscription.tg_username ?? subscription.telegram_id}`
              : "Not linked"}
          </dd>
        </div>
      </dl>

      <div className="mt-6 flex flex-wrap gap-3 border-t border-border pt-6">
        <Link
          href="/insights"
          className="inline-flex items-center justify-center rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90"
        >
          Read latest research
        </Link>
        {hasStripeCustomer ? (
          <form action={openBillingPortal}>
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-md border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-stone-100"
            >
              Manage billing
            </button>
          </form>
        ) : null}
      </div>
    </div>
  );
}

function AccountCard({
  user,
}: {
  user: {
    email?: string;
    id: string;
    created_at: string;
  };
}) {
  return (
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
  );
}

function LicenseCard({ subscription }: { subscription: SubscriptionRow }) {
  return (
    <div className="mt-6 rounded-lg border border-border bg-[#0f1417] p-6 text-stone-200 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-400">
            License key
          </p>
          <p className="mt-3 font-mono text-xl tracking-wider text-white sm:text-2xl">
            {subscription.license_key}
          </p>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-stone-400">
            Send this key to the ANS Telegram bot to bind your Telegram account
            and gain access to the members&apos; chat.
          </p>
        </div>
      </div>
    </div>
  );
}
