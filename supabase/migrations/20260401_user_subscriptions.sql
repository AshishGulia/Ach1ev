-- Achiev / Ach1ev User Subscriptions & Verified Razorpay Transactions Schema
create table if not exists public.user_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  user_email text not null,
  plan_id text not null check (plan_id in ('free', 'scholar-pro', 'master-ultimate')),
  billing_cycle text not null default 'monthly' check (billing_cycle in ('monthly', 'annual')),
  status text not null default 'active' check (status in ('active', 'expired', 'cancelled', 'pending')),
  amount_inr integer not null default 0,
  razorpay_payment_id text,
  razorpay_order_id text,
  razorpay_signature text,
  signature_verified boolean not null default false,
  activated_at timestamptz not null default now(),
  expires_at timestamptz,
  updated_at timestamptz not null default now()
);

create unique index if not exists user_subscriptions_email_idx
  on public.user_subscriptions (lower(user_email));

alter table public.user_subscriptions enable row level security;

create policy "Users can view own subscription"
  on public.user_subscriptions
  for select
  using (
    auth.uid() = user_id
    or lower(user_email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );

-- Updates and inserts happen exclusively through verified Edge Functions / service role after HMAC verification.
