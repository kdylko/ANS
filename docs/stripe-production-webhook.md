# Stripe webhook on production (Vercel)

## Prerequisites

- Site deployed and reachable at `https://YOUR_DOMAIN`
- `supabase/migrations/001_stripe_tables.sql` applied
- Route `POST /api/stripe/webhook` deployed (included in this repo)

## 1. Create webhook in Stripe

1. Open [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks).
2. Use **Test mode** while testing with `sk_test_` on Vercel. Use **Live mode** only when accepting real payments with `sk_live_`.
3. Click **Add endpoint**.
4. **Endpoint URL:**

   ```
   https://YOUR_DOMAIN/api/stripe/webhook
   ```

5. **Select events:**

   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.paid`
   - `invoice.payment_failed`

6. Save. Copy the **Signing secret** (`whsec_...`).

## 2. Configure Vercel

Project → **Settings** → **Environment Variables** (Production):

| Variable | Value |
|----------|--------|
| `STRIPE_WEBHOOK_SECRET` | `whsec_` from step 1 (Dashboard, not CLI) |
| `STRIPE_SECRET_KEY` | `sk_test_...` or `sk_live_...` matching Dashboard mode |
| `STRIPE_PRICE_MONTHLY` | `price_...` from the same mode |
| `STRIPE_PRICE_ANNUAL` | `price_...` from the same mode |
| `NEXT_PUBLIC_SITE_URL` | `https://YOUR_DOMAIN` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service_role |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |

**Redeploy** after saving env vars.

## 3. Verify

1. Stripe → your endpoint → **Send test webhook** → `checkout.session.completed` → status **200**.
2. On the site: complete a test Checkout with card `4242 4242 4242 4242`.
3. Check **Vercel** → Deployments → **Functions** / Runtime logs for `[stripe/webhook]`.
4. Check Supabase **Table Editor**: `stripe_webhook_events`, `stripe_subscriptions`, `subscriptions`.

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| 400 Invalid signature | Wrong `STRIPE_WEBHOOK_SECRET` on Vercel (CLI secret ≠ Dashboard secret). Redeploy after fix. |
| 404 | Wrong URL path or deployment missing `/api/stripe/webhook`. |
| 500 Webhook not configured | `STRIPE_WEBHOOK_SECRET` missing on Vercel Production. |
| Payment OK, no license key | Webhook failed — check Vercel logs and `stripe_webhook_events` table. |
| Works locally, not on Vercel | Production uses Dashboard `whsec_`, not `stripe listen`. |
