import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import {
  formatPostgrestError,
  isNoRowsError,
} from "@/lib/supabase/errors";

export type SubscriptionStatus = "active" | "expired" | "cancelled";

export type SubscriptionRow = {
  id: string;
  license_key: string;
  status: SubscriptionStatus;
  valid_until: string | null;
  email: string | null;
  telegram_id: number | null;
  tg_username: string | null;
  bound_at: string | null;
  last_invite_at: string | null;
  created_at: string;
  updated_at: string;
};

export type PlanId = "monthly" | "annual";

export const PRICING = {
  monthly: {
    id: "pro-monthly",
    label: "Monthly",
    amount: 199,
    currency: "USD",
    interval: "month",
    periodDays: 30,
  },
  annual: {
    id: "pro-annual",
    label: "Annual",
    amount: 1990,
    currency: "USD",
    interval: "year",
    periodDays: 365,
    savingsLabel: "Save 17%",
  },
} as const;

/**
 * Returns the most recent active subscription for the given email, or null
 * if no active subscription exists. Also returns null on database errors —
 * the caller should treat that as "no subscription" and let the user retry.
 */
export async function getActiveSubscriptionByEmail(
  email: string,
): Promise<SubscriptionRow | null> {
  if (!email) return null;

  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("subscriptions")
      .select("*")
      .eq("email", email)
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      if (isNoRowsError(error)) {
        return null;
      }
      console.error(
        "[billing] getActiveSubscriptionByEmail:",
        formatPostgrestError(error),
      );
      return null;
    }

    return (data as SubscriptionRow | null) ?? null;
  } catch (err) {
    console.error("[billing] getActiveSubscriptionByEmail (exception):", err);
    return null;
  }
}

/**
 * Creates a new active subscription record for the given email and returns it.
 * Generates a fresh license_key. Throws if the database write fails.
 */
export async function createSubscription(input: {
  email: string;
  plan?: PlanId;
  validUntil?: Date;
}): Promise<SubscriptionRow> {
  let validUntil = input.validUntil;
  if (!validUntil) {
    const plan = input.plan ?? "monthly";
    const periodDays = PRICING[plan].periodDays;
    validUntil = new Date();
    validUntil.setUTCDate(validUntil.getUTCDate() + periodDays);
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("subscriptions")
    .insert({
      license_key: generateLicenseKey(),
      status: "active",
      valid_until: validUntil.toISOString(),
      email: input.email,
    })
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(
      `Failed to create subscription: ${error?.message ?? "unknown error"}`,
    );
  }

  return data as SubscriptionRow;
}

/**
 * Generates a 16-character license key in groups of 4, prefixed with "ANS".
 * Uses an unambiguous alphabet (no 0/O/1/I) so users can read it back to
 * the Telegram bot without confusion.
 */
function generateLicenseKey(): string {
  const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const segment = () => {
    let out = "";
    for (let i = 0; i < 4; i++) {
      out += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
    }
    return out;
  };
  return `ANS-${segment()}-${segment()}-${segment()}-${segment()}`;
}

/**
 * Convenience helper used by the dashboard to determine whether an active
 * subscription is still within its valid_until window. A row can technically
 * be `status='active'` while `valid_until` has passed if the cron/expiry job
 * hasn't run yet — we treat that as expired for UX purposes.
 */
export function isSubscriptionLive(subscription: SubscriptionRow): boolean {
  if (subscription.status !== "active") return false;
  if (!subscription.valid_until) return false;
  return new Date(subscription.valid_until).getTime() > Date.now();
}
