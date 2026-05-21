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
| `NEXT_PUBLIC_SITE_URL` | server (SEO) | Production canonical URL, e.g. `https://your-domain.com`. |

The `service_role` key bypasses RLS and must stay on the server. The dashboard's
subscription writes go through `src/lib/supabase/admin.ts`, which is marked
`server-only` so it cannot be accidentally imported into client code.

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
