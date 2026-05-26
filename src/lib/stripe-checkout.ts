import "server-only";

import { getStripe } from "@/lib/stripe";
import {
  getStripeCustomerByUserId,
  saveStripeCustomer,
} from "@/lib/stripe-db";

export async function getOrCreateStripeCustomer(
  userId: string,
  email: string,
): Promise<string> {
  const existing = await getStripeCustomerByUserId(userId);
  if (existing) {
    return existing.stripe_customer_id;
  }

  const stripe = getStripe();
  const customer = await stripe.customers.create({
    email,
    metadata: { supabase_user_id: userId },
  });

  await saveStripeCustomer({
    userId,
    stripeCustomerId: customer.id,
    email,
  });

  return customer.id;
}
