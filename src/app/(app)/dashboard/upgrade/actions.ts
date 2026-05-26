"use server";

import { redirect } from "next/navigation";

import { getActiveSubscriptionByEmail, type PlanId } from "@/lib/billing";
import { createClient } from "@/lib/supabase/server";
import { getOrCreateStripeCustomer } from "@/lib/stripe-checkout";
import {
  getPriceIdForPlan,
  getSiteUrl,
  getStripe,
  isStripeConfigured,
} from "@/lib/stripe";

export async function startCheckout(formData: FormData) {
  const planValue = formData.get("plan");
  const plan: PlanId = planValue === "annual" ? "annual" : "monthly";

  if (!isStripeConfigured()) {
    redirect(
      `/dashboard/upgrade?error=${encodeURIComponent("Stripe is not configured")}`,
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    redirect("/login");
  }

  const existing = await getActiveSubscriptionByEmail(user.email);
  if (existing) {
    redirect("/dashboard?status=already-active");
  }

  let checkoutUrl: string;

  try {
    const stripe = getStripe();
    const customerId = await getOrCreateStripeCustomer(user.id, user.email);
    const siteUrl = getSiteUrl();

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      line_items: [{ price: getPriceIdForPlan(plan), quantity: 1 }],
      success_url: `${siteUrl}/dashboard?status=success`,
      cancel_url: `${siteUrl}/dashboard/upgrade?checkout=cancelled&plan=${plan}`,
      metadata: {
        supabase_user_id: user.id,
        plan,
      },
      subscription_data: {
        metadata: {
          supabase_user_id: user.id,
          plan,
        },
      },
    });

    if (!session.url) {
      throw new Error("Stripe did not return a checkout URL");
    }

    checkoutUrl = session.url;
  } catch (err) {
    const message = err instanceof Error ? err.message : "checkout-failed";
    redirect(`/dashboard/upgrade?error=${encodeURIComponent(message)}`);
  }

  redirect(checkoutUrl);
}
