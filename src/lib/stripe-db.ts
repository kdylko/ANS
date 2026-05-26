import "server-only";

import type Stripe from "stripe";

import {
  createSubscription,
  getActiveSubscriptionByEmail,
  type SubscriptionStatus,
} from "@/lib/billing";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  formatPostgrestError,
  isNoRowsError,
} from "@/lib/supabase/errors";

export type StripeCustomerRow = {
  id: string;
  user_id: string;
  stripe_customer_id: string;
  email: string | null;
};

export type StripeSubscriptionRow = {
  id: string;
  stripe_subscription_id: string;
  stripe_customer_id: string;
  user_id: string;
  status: string;
  price_id: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
};

export async function getStripeCustomerByUserId(
  userId: string,
): Promise<StripeCustomerRow | null> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("stripe_customers")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    if (!isNoRowsError(error)) {
      console.error(
        "[stripe-db] getStripeCustomerByUserId:",
        formatPostgrestError(error),
      );
    }
    return null;
  }

  return data as StripeCustomerRow | null;
}

export async function saveStripeCustomer(input: {
  userId: string;
  stripeCustomerId: string;
  email: string;
}): Promise<void> {
  const admin = createAdminClient();
  const { error } = await admin.from("stripe_customers").upsert(
    {
      user_id: input.userId,
      stripe_customer_id: input.stripeCustomerId,
      email: input.email,
    },
    { onConflict: "user_id" },
  );

  if (error) {
    throw new Error(
      `Failed to save stripe customer (Supabase): ${formatPostgrestError(error)}`,
    );
  }
}

export async function upsertStripeSubscription(
  subscription: Stripe.Subscription,
  userId: string,
): Promise<void> {
  const admin = createAdminClient();
  const priceId = subscription.items.data[0]?.price?.id ?? null;
  const periodEnd = new Date(subscription.current_period_end * 1000);

  const { error } = await admin.from("stripe_subscriptions").upsert(
    {
      stripe_subscription_id: subscription.id,
      stripe_customer_id:
        typeof subscription.customer === "string"
          ? subscription.customer
          : subscription.customer.id,
      user_id: userId,
      status: subscription.status,
      price_id: priceId,
      current_period_end: periodEnd.toISOString(),
      cancel_at_period_end: subscription.cancel_at_period_end,
    },
    { onConflict: "stripe_subscription_id" },
  );

  if (error) {
    throw new Error(
      `Failed to upsert stripe subscription (Supabase): ${formatPostgrestError(error)}`,
    );
  }
}

export async function isWebhookEventProcessed(
  eventId: string,
): Promise<boolean> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("stripe_webhook_events")
    .select("stripe_event_id")
    .eq("stripe_event_id", eventId)
    .maybeSingle();

  if (error && !isNoRowsError(error)) {
    console.error(
      "[stripe-db] isWebhookEventProcessed:",
      formatPostgrestError(error),
    );
    return false;
  }

  return Boolean(data);
}

export async function markWebhookEventProcessed(
  eventId: string,
  type: string,
): Promise<void> {
  const admin = createAdminClient();
  const { error } = await admin.from("stripe_webhook_events").insert({
    stripe_event_id: eventId,
    type,
  });

  if (error && error.code !== "23505") {
    throw new Error(`Failed to mark webhook processed: ${error.message}`);
  }
}

/**
 * Keeps public.subscriptions in sync for the Telegram bot / dashboard.
 */
export async function syncEntitlementFromStripe(input: {
  email: string;
  validUntil: Date;
  entitlementStatus: SubscriptionStatus;
}): Promise<void> {
  const admin = createAdminClient();
  const validUntilIso = input.validUntil.toISOString();

  if (input.entitlementStatus === "active") {
    const existing = await getActiveSubscriptionByEmail(input.email);

    if (existing) {
      const { error } = await admin
        .from("subscriptions")
        .update({
          status: "active",
          valid_until: validUntilIso,
        })
        .eq("id", existing.id);

      if (error) {
        throw new Error(`Failed to update entitlement: ${error.message}`);
      }
      return;
    }

    await createSubscription({
      email: input.email,
      validUntil: input.validUntil,
    });
    return;
  }

  const { error } = await admin
    .from("subscriptions")
    .update({
      status: input.entitlementStatus,
      valid_until: validUntilIso,
    })
    .eq("email", input.email)
    .eq("status", "active");

  if (error) {
    console.error("[stripe-db] syncEntitlementFromStripe:", error);
  }
}

export function entitlementStatusFromStripe(
  status: Stripe.Subscription.Status,
  cancelAtPeriodEnd: boolean,
): SubscriptionStatus {
  if (
    status === "active" ||
    status === "trialing" ||
    (status === "past_due" && cancelAtPeriodEnd === false)
  ) {
    return "active";
  }
  if (status === "canceled" || status === "unpaid") {
    return "cancelled";
  }
  return "expired";
}
