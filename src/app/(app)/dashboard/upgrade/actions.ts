"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import {
  createSubscription,
  getActiveSubscriptionByEmail,
} from "@/lib/billing";

export async function confirmUpgrade(formData: FormData) {
  const planValue = formData.get("plan");
  const plan: "monthly" | "annual" = planValue === "annual" ? "annual" : "monthly";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.email) {
    redirect("/login");
  }

  const existing = await getActiveSubscriptionByEmail(user.email);
  if (existing) {
    redirect("/dashboard?status=already-active");
  }

  try {
    await createSubscription({ email: user.email, plan });
  } catch (err) {
    const message = err instanceof Error ? err.message : "subscription-failed";
    redirect(`/dashboard/upgrade?error=${encodeURIComponent(message)}`);
  }

  revalidatePath("/dashboard");
  redirect("/dashboard?status=subscribed");
}
