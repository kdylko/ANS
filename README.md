# ans

Next.js web app with SSR, deployed on Vercel.

## Stack

- **Framework**: Next.js 15 (App Router, Server Components, Server Actions)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Auth + DB**: Supabase (Postgres, Auth, RLS, Storage) via `@supabase/ssr`
- **Hosting**: Vercel

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in Supabase keys
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

| Name | Where | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | client + server | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | client + server | Supabase anon (public) key |
| `SUPABASE_SERVICE_ROLE_KEY` | **server only** | Used to write to the RLS-locked `subscriptions` table. Never expose to the browser. |
| `NEXT_PUBLIC_SITE_URL` | server (SEO, Stripe redirects) | Production canonical URL, e.g. `https://your-domain.com`. |
| `STRIPE_SECRET_KEY` | **server only** | Stripe secret key (`sk_test_` / `sk_live_`). |
| `STRIPE_WEBHOOK_SECRET` | **server only** | Webhook signing secret (`whsec_...`). Local: from `stripe listen`. |
| `STRIPE_PRICE_MONTHLY` | server | Price ID for $199/month plan (`price_...`). |
| `STRIPE_PRICE_ANNUAL` | server | Price ID for annual plan (`price_...`). |

The `service_role` key bypasses RLS and must stay on the server. Subscription and
Stripe mirror tables are written via `src/lib/supabase/admin.ts` (`server-only`).

## Stripe

1. Run `supabase/migrations/001_stripe_tables.sql` in the Supabase SQL editor (after `subscriptions` table exists).
2. Add Stripe env vars to `.env.local` and Vercel.
3. **Local webhooks:** `stripe listen --forward-to localhost:3000/api/stripe/webhook` — put the CLI `whsec_` in `.env.local` (not the Dashboard secret).
4. **Production webhook:** see [Stripe webhook (production)](#stripe-webhook-production) below.

Checkout flow: `/dashboard/upgrade` → Stripe Checkout → webhook provisions `subscriptions` + license key.

### Stripe webhook (production)

Use a **separate** webhook endpoint and signing secret for production. Do not reuse the `whsec_` from `stripe listen`.

1. Deploy the site to Vercel so `https://<your-domain>/api/stripe/webhook` is reachable.
2. In [Stripe Dashboard → Developers → Webhooks](https://dashboard.stripe.com/webhooks):
   - For **test payments on prod URL**: stay in **Test mode** → **Add endpoint**
   - For **real charges**: switch to **Live mode** → create another endpoint (and use `sk_live_` + live Price IDs on Vercel)
3. **Endpoint URL:** `https://<your-domain>/api/stripe/webhook`  
   Example: `https://ans-xxx.vercel.app/api/stripe/webhook` or your custom domain.
4. **Events to send** (select these):
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.paid`
   - `invoice.payment_failed`
5. After creating the endpoint, open it → **Signing secret** → **Reveal** → copy `whsec_...`
6. **Vercel** → Project → Settings → Environment Variables:
   - `STRIPE_WEBHOOK_SECRET` = that `whsec_` (scope: **Production** only, or Production + Preview if you test there)
   - `NEXT_PUBLIC_SITE_URL` = `https://<your-domain>` (no trailing slash)
   - Same for `STRIPE_SECRET_KEY`, `STRIPE_PRICE_MONTHLY`, `STRIPE_PRICE_ANNUAL`, Supabase keys
7. **Redeploy** the Vercel project (env changes are not applied until redeploy).
8. In Stripe → Webhooks → your endpoint → **Send test webhook** → `checkout.session.completed` → expect **200**.
9. **Supabase** → Authentication → URL Configuration: add `https://<your-domain>/auth/callback` to Redirect URLs and set Site URL to your prod domain.

**Local vs production secrets**

| Environment | `STRIPE_WEBHOOK_SECRET` source |
|-------------|-------------------------------|
| Local (`npm run dev`) | Output of `stripe listen` |
| Vercel Production | Signing secret from Dashboard endpoint (step 5) |

## Database schema

The `subscriptions` table is RLS-locked (no anon/authenticated policies), so only
the admin client (service_role) can read or write it. Run the following SQL in
your Supabase SQL editor to provision the table:

```sql
create extension if not exists pgcrypto;

create table if not exists public.subscriptions (
    id              uuid primary key default gen_random_uuid(),
    license_key     text not null unique,
    status          text not null default 'active'
                    check (status in ('active', 'expired', 'cancelled')),
    valid_until     timestamptz,
    email           text,
    telegram_id     bigint unique,
    tg_username     text,
    bound_at        timestamptz,
    last_invite_at  timestamptz,
    created_at      timestamptz not null default now(),
    updated_at      timestamptz not null default now()
);

create index if not exists subscriptions_status_idx
    on public.subscriptions (status);
create index if not exists subscriptions_telegram_id_idx
    on public.subscriptions (telegram_id);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

drop trigger if exists subscriptions_set_updated_at on public.subscriptions;
create trigger subscriptions_set_updated_at
before update on public.subscriptions
for each row execute function public.set_updated_at();

alter table public.subscriptions enable row level security;
```

Stripe tables: see `supabase/migrations/001_stripe_tables.sql`.

## Project structure

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx       # Email + password login
│   │   └── signup/page.tsx      # Email + password signup
│   ├── auth/
│   │   ├── callback/route.ts    # OAuth / email-confirmation callback
│   │   └── signout/route.ts     # Sign-out action
│   ├── account/page.tsx         # Protected: shows signed-in user
│   ├── layout.tsx
│   └── page.tsx                 # Landing
├── lib/
│   └── supabase/
│       ├── client.ts            # Browser Supabase client
│       ├── server.ts            # Server-side Supabase client (RSC, actions, route handlers)
│       └── middleware.ts        # Session refresh helper
└── middleware.ts                # Refresh session on every request
```

## OAuth providers

The login/signup pages support Google sign-in. To enable it:

### Supabase dashboard

1. Open your project → **Authentication → Providers**
2. Toggle **Google**, paste in **Client ID** and **Client Secret** (created below)
3. Copy the callback URL Supabase shows — it looks like
   `https://<your-project-ref>.supabase.co/auth/v1/callback`
4. Open **Authentication → URL Configuration** and ensure:
   - **Site URL** = `http://localhost:3000` for dev (and your Vercel URL for prod)
   - **Redirect URLs** contains `http://localhost:3000/auth/callback` and your prod equivalent

### Google Cloud

1. Go to [Google Cloud Console → APIs & Services → Credentials](https://console.cloud.google.com/apis/credentials)
2. Create an **OAuth client ID** of type **Web application**
3. Under **Authorized redirect URIs** add the Supabase callback URL from above
4. Copy the **Client ID** and **Client Secret** back into Supabase

No env vars or code changes needed on this side — Supabase handles the OAuth dance and our `/auth/callback` route exchanges the code for a session.

## Deployment

Pushes to `main` are auto-deployed to Vercel. Configure the same env vars in the Vercel project settings.
