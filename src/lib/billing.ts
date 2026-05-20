export type SubscriptionStatus =
  | "active"
  | "trialing"
  | "past_due"
  | "canceled"
  | "inactive";

export type Subscription = {
  status: SubscriptionStatus;
  plan: "pro" | null;
  currentPeriodEnd: Date | null;
  cancelAtPeriodEnd: boolean;
};

/**
 * Returns the active subscription for a user.
 *
 * This is currently a stub that always reports "inactive" so we can build the
 * dashboard UI. When Stripe is wired up, replace the body with a query against
 * a `subscriptions` table (or a direct Stripe API call) keyed by `userId`.
 */
export async function getSubscription(
  userId: string,
): Promise<Subscription> {
  void userId;
  return {
    status: "inactive",
    plan: null,
    currentPeriodEnd: null,
    cancelAtPeriodEnd: false,
  };
}

export const PRICING = {
  monthly: {
    id: "pro-monthly",
    label: "Monthly",
    amount: 199,
    currency: "USD",
    interval: "month",
  },
  annual: {
    id: "pro-annual",
    label: "Annual",
    amount: 1990,
    currency: "USD",
    interval: "year",
    savingsLabel: "Save 17%",
  },
} as const;
