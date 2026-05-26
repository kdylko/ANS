-- Stripe billing mirror tables (RLS on, no policies — service_role only).
-- Run in Supabase SQL Editor if you are not using the Supabase CLI migrator.

create table if not exists public.stripe_customers (
    id                  uuid primary key default gen_random_uuid(),
    user_id             uuid not null unique,
    stripe_customer_id  text not null unique,
    email               text,
    created_at          timestamptz not null default now(),
    updated_at          timestamptz not null default now()
);

create table if not exists public.stripe_subscriptions (
    id                      uuid primary key default gen_random_uuid(),
    stripe_subscription_id  text not null unique,
    stripe_customer_id      text not null,
    user_id                 uuid not null,
    status                  text not null,
    price_id                text,
    current_period_end      timestamptz,
    cancel_at_period_end    boolean not null default false,
    created_at              timestamptz not null default now(),
    updated_at              timestamptz not null default now()
);

create index if not exists stripe_subscriptions_user_id_idx
    on public.stripe_subscriptions (user_id);

create index if not exists stripe_subscriptions_status_idx
    on public.stripe_subscriptions (status);

create table if not exists public.stripe_webhook_events (
    stripe_event_id   text primary key,
    type              text not null,
    processed_at      timestamptz not null default now()
);

drop trigger if exists stripe_customers_set_updated_at on public.stripe_customers;
create trigger stripe_customers_set_updated_at
before update on public.stripe_customers
for each row execute function public.set_updated_at();

drop trigger if exists stripe_subscriptions_set_updated_at on public.stripe_subscriptions;
create trigger stripe_subscriptions_set_updated_at
before update on public.stripe_subscriptions
for each row execute function public.set_updated_at();

alter table public.stripe_customers enable row level security;
alter table public.stripe_subscriptions enable row level security;
alter table public.stripe_webhook_events enable row level security;

comment on table public.stripe_customers is 'Maps Supabase auth user to Stripe customer id.';
comment on table public.stripe_subscriptions is 'Mirror of Stripe subscription state.';
comment on table public.stripe_webhook_events is 'Processed Stripe webhook event ids for idempotency.';
