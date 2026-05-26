import "server-only";

import type Stripe from "stripe";

import { getStripe } from "@/lib/stripe";
import {
  entitlementStatusFromStripe,
  saveStripeCustomer,
  syncEntitlementFromStripe,
  upsertStripeSubscription,
} from "@/lib/stripe-db";
import { createAdminClient } from "@/lib/supabase/admin";

async function resolveUserIdFromCustomer(
  customerId: string,
): Promise<{ userId: string; email: string } | null> {
  const admin = createAdminClient();
  const { data: row } = await admin
    .from("stripe_customers")
    .select("user_id, email")
    .eq("stripe_customer_id", customerId)
    .maybeSingle();

  if (row?.user_id && row.email) {
    return { userId: row.user_id, email: row.email };
  }

  const stripe = getStripe();
  const customer = await stripe.customers.retrieve(customerId);
  if (customer.deleted) return null;

  const userId = customer.metadata?.supabase_user_id;
  const email = customer.email;
  if (!userId || !email) return null;

  await saveStripeCustomer({
    userId,
    stripeCustomerId: customerId,
    email,
  });

  return { userId, email };
}

async function handleSubscription(
  subscription: Stripe.Subscription,
): Promise<void> {
  const userId = subscription.metadata?.supabase_user_id;
  const customerId =
    typeof subscription.customer === "string"
      ? subscription.customer
      : subscription.customer.id;

  let resolvedUserId = userId;
  let email: string | undefined;

  if (!resolvedUserId) {
    const resolved = await resolveUserIdFromCustomer(customerId);
    if (!resolved) return;
    resolvedUserId = resolved.userId;
    email = resolved.email;
  } else {
    const admin = createAdminClient();
    const { data } = await admin
      .from("stripe_customers")
      .select("email")
      .eq("user_id", resolvedUserId)
      .maybeSingle();
    email = data?.email ?? undefined;
  }

  if (!email) {
    const stripe = getStripe();
    const customer = await stripe.customers.retrieve(customerId);
    if (!customer.deleted) email = customer.email ?? undefined;
  }

  if (!email) return;

  await upsertStripeSubscription(subscription, resolvedUserId);

  const validUntil = new Date(subscription.current_period_end * 1000);
  const entitlementStatus = entitlementStatusFromStripe(
    subscription.status,
    subscription.cancel_at_period_end,
  );

  await syncEntitlementFromStripe({
    email,
    validUntil,
    entitlementStatus,
  });
}

export async function handleStripeEvent(event: Stripe.Event): Promise<void> {
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.mode !== "subscription") return;

      const userId = session.metadata?.supabase_user_id;
      const customerId =
        typeof session.customer === "string"
          ? session.customer
          : session.customer?.id;

      if (userId && customerId && session.customer_details?.email) {
        await saveStripeCustomer({
          userId,
          stripeCustomerId: customerId,
          email: session.customer_details.email,
        });
      }

      const subId =
        typeof session.subscription === "string"
          ? session.subscription
          : session.subscription?.id;

      if (subId) {
        const stripe = getStripe();
        const subscription = await stripe.subscriptions.retrieve(subId);
        await handleSubscription(subscription);
      }
      break;
    }

    case "customer.subscription.created":
    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      await handleSubscription(subscription);
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      await handleSubscription(subscription);
      break;
    }

    case "invoice.paid": {
      const invoice = event.data.object as Stripe.Invoice;
      const subId =
        typeof invoice.subscription === "string"
          ? invoice.subscription
          : invoice.subscription?.id;
      if (!subId) return;

      const stripe = getStripe();
      const subscription = await stripe.subscriptions.retrieve(subId);
      await handleSubscription(subscription);
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      const subId =
        typeof invoice.subscription === "string"
          ? invoice.subscription
          : invoice.subscription?.id;
      if (!subId) return;

      const stripe = getStripe();
      const subscription = await stripe.subscriptions.retrieve(subId);
      await handleSubscription(subscription);
      break;
    }

    default:
      break;
  }
}
