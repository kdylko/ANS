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

The `service_role` key is **never** used in this project — all data access goes through RLS with the anon key.

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
