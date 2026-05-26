"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { getStripeCustomerByUserId } from "@/lib/stripe-db";
import { getSiteUrl, getStripe, isStripeConfigured } from "@/lib/stripe";

export async function openBillingPortal() {
  if (!isStripeConfigured()) {
    redirect("/dashboard?error=stripe-not-configured");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const customer = await getStripeCustomerByUserId(user.id);
  if (!customer) {
    redirect("/dashboard/upgrade");
  }

  const stripe = getStripe();
  const session = await stripe.billingPortal.sessions.create({
    customer: customer.stripe_customer_id,
    return_url: `${getSiteUrl()}/dashboard`,
  });

  if (!session.url) {
    redirect("/dashboard?error=portal-failed");
  }

  redirect(session.url);
}
