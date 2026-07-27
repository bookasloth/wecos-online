-- WeCos foundation schema.
-- Every table has RLS enabled (default-deny) + explicit policies, so users
-- cannot read each other's private data. Passwords are handled by Supabase Auth
-- (bcrypt in auth.users) — we never store raw passwords. Trusted server writes
-- (payment webhooks, credit grants) run with the service_role key, which
-- bypasses RLS by design; client access is always gated by the policies below.

-- ============================================================
-- 0 · Extensions + shared helpers
-- ============================================================
-- Skip function-body validation during this migration: is_staff() references
-- public.profiles before that table is created a few lines down. (plpgsql
-- bodies defer anyway; this covers the language-sql helpers.)
set check_function_bodies = off;

create extension if not exists "pgcrypto";
create extension if not exists "citext";

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

-- SECURITY DEFINER so it reads profiles without recursing through RLS.
create or replace function public.is_staff()
returns boolean language sql security definer stable
set search_path = public as $$
  select coalesce((select role = 'staff' from public.profiles where id = auth.uid()), false);
$$;

-- ============================================================
-- 1 · Enums
-- ============================================================
create type app_role        as enum ('member','staff');
create type tier_id         as enum ('free','solo','venture','studio');
create type sub_status      as enum ('active','trialing','past_due','canceled','paused');
create type studio_category as enum ('marketing','hr','finance','legal','capital-circle','technology');
create type pkg_cadence     as enum ('one-time','per month','per hire','on success');
create type lead_status     as enum ('new','routed','unlocked','closed','spam');
create type lead_budget     as enum ('under_25k','25k_50k','50k_1l','1l_plus','not_sure');
create type lead_timeline   as enum ('now','within_month','exploring');
create type pay_purpose     as enum ('subscription','credits','lead_unlock');
create type pay_status      as enum ('created','paid','failed','refunded');

-- ============================================================
-- 2 · Profiles (1:1 with auth.users) + auto-create on signup
-- ============================================================
create table public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  handle      citext unique not null,
  full_name   text not null default '',
  headline    text,
  bio         text,
  avatar_url  text,
  city_slug   text,
  location    text,
  stage       text,
  needs       text[] not null default '{}',
  links       jsonb  not null default '[]',
  role        app_role not null default 'member',
  verified    boolean  not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create trigger trg_profiles_touch before update on public.profiles
  for each row execute function public.touch_updated_at();

alter table public.profiles enable row level security;
create policy "profiles readable by all" on public.profiles for select using (true);
create policy "profiles insert own"      on public.profiles for insert with check (id = auth.uid());
create policy "profiles update own/staff" on public.profiles for update
  using (id = auth.uid() or public.is_staff());

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, handle, full_name)
  values (
    new.id,
    lower(regexp_replace(split_part(new.email,'@',1),'[^a-z0-9_-]','','g')) || '-' || substr(new.id::text,1,4),
    coalesce(new.raw_user_meta_data->>'full_name','')
  );
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- 3 · Startups (one per user) + packages + team + reviews
-- ============================================================
create table public.startups (
  id               uuid primary key default gen_random_uuid(),
  owner_id         uuid unique references public.profiles(id) on delete cascade,
  name             text not null,
  slug             citext unique not null,
  tagline          text,
  about            text,
  logo_url         text,
  cover_url        text,
  website          text,
  city             text,
  founded_year     int,
  team_size        text,
  topics           text[] not null default '{}',
  is_wecos         boolean not null default false,
  verified         boolean not null default false,
  offers_services  boolean not null default false,
  service_category studio_category,
  likes_count      int not null default 0,
  rich             jsonb not null default '{}',
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
create index on public.startups (service_category) where offers_services;
create index on public.startups using gin (topics);
create trigger trg_startups_touch before update on public.startups
  for each row execute function public.touch_updated_at();

alter table public.startups enable row level security;
create policy "startups readable by all" on public.startups for select using (true);
create policy "startups insert own"      on public.startups for insert with check (owner_id = auth.uid());
create policy "startups update own/staff" on public.startups for update
  using (owner_id = auth.uid() or public.is_staff());
create policy "startups delete own/staff" on public.startups for delete
  using (owner_id = auth.uid() or public.is_staff());

create or replace function public.owns_startup(sid uuid)
returns boolean language sql security definer stable set search_path = public as $$
  select exists(select 1 from public.startups where id = sid and owner_id = auth.uid());
$$;

create table public.startup_packages (
  id         uuid primary key default gen_random_uuid(),
  startup_id uuid not null references public.startups(id) on delete cascade,
  name       text not null,
  price_inr  int,
  price_note text,
  cadence    pkg_cadence not null default 'one-time',
  summary    text,
  includes   text[] not null default '{}',
  featured   boolean not null default false,
  sort       int not null default 0
);
create index on public.startup_packages (startup_id);
alter table public.startup_packages enable row level security;
create policy "packages readable by all" on public.startup_packages for select using (true);
create policy "packages write owner/staff" on public.startup_packages for all
  using (public.owns_startup(startup_id) or public.is_staff())
  with check (public.owns_startup(startup_id) or public.is_staff());

create table public.startup_team (
  id         uuid primary key default gen_random_uuid(),
  startup_id uuid not null references public.startups(id) on delete cascade,
  name       text not null,
  role       text,
  avatar_url text,
  handle     citext,
  sort       int not null default 0
);
create index on public.startup_team (startup_id);
alter table public.startup_team enable row level security;
create policy "team readable by all" on public.startup_team for select using (true);
create policy "team write owner/staff" on public.startup_team for all
  using (public.owns_startup(startup_id) or public.is_staff())
  with check (public.owns_startup(startup_id) or public.is_staff());

create table public.startup_reviews (
  id         uuid primary key default gen_random_uuid(),
  startup_id uuid not null references public.startups(id) on delete cascade,
  client     text not null,
  company    text,
  rating     int not null check (rating between 1 and 5),
  review     text,
  video_url  text,
  approved   boolean not null default false,
  created_at timestamptz not null default now()
);
create index on public.startup_reviews (startup_id);
alter table public.startup_reviews enable row level security;
create policy "reviews read approved/owner/staff" on public.startup_reviews for select
  using (approved or public.owns_startup(startup_id) or public.is_staff());
create policy "reviews write owner/staff" on public.startup_reviews for all
  using (public.owns_startup(startup_id) or public.is_staff())
  with check (public.owns_startup(startup_id) or public.is_staff());

-- ============================================================
-- 4 · Page likes (Facebook-style, for records)
-- ============================================================
create table public.page_likes (
  startup_id uuid not null references public.startups(id) on delete cascade,
  user_id    uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (startup_id, user_id)
);
alter table public.page_likes enable row level security;
create policy "likes readable by all" on public.page_likes for select using (true);
create policy "likes insert self"     on public.page_likes for insert with check (user_id = auth.uid());
create policy "likes delete self"     on public.page_likes for delete using (user_id = auth.uid());

create or replace function public.sync_like_count()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  update public.startups set likes_count = (
    select count(*) from public.page_likes where startup_id = coalesce(new.startup_id, old.startup_id)
  ) where id = coalesce(new.startup_id, old.startup_id);
  return null;
end $$;
create trigger trg_like_count after insert or delete on public.page_likes
  for each row execute function public.sync_like_count();

-- ============================================================
-- 5 · Memberships (subscriptions) — tier written by webhook (service role)
-- ============================================================
create table public.memberships (
  user_id                  uuid primary key references public.profiles(id) on delete cascade,
  tier                     tier_id not null default 'free',
  status                   sub_status not null default 'active',
  current_period_start     timestamptz,
  current_period_end       timestamptz,
  cancel_at_period_end     boolean not null default false,
  razorpay_customer_id     text,
  razorpay_subscription_id text,
  created_at               timestamptz not null default now(),
  updated_at               timestamptz not null default now()
);
create trigger trg_memberships_touch before update on public.memberships
  for each row execute function public.touch_updated_at();
alter table public.memberships enable row level security;
-- Users can read their own tier; only staff/service-role may change it.
create policy "membership select own/staff" on public.memberships for select
  using (user_id = auth.uid() or public.is_staff());
create policy "membership write staff" on public.memberships for all
  using (public.is_staff()) with check (public.is_staff());

-- ============================================================
-- 6 · Credits ledger (lead-unlock economy)
-- ============================================================
create table public.credit_ledger (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles(id) on delete cascade,
  delta      int not null,
  reason     text not null,          -- 'monthly_grant' | 'lead_unlock' | 'purchase' | 'refund'
  ref        uuid,
  created_at timestamptz not null default now()
);
create index on public.credit_ledger (user_id);
alter table public.credit_ledger enable row level security;
-- Read-only to the owner; writes happen through SECURITY DEFINER functions / staff.
create policy "credits select own/staff" on public.credit_ledger for select
  using (user_id = auth.uid() or public.is_staff());
create policy "credits write staff" on public.credit_ledger for all
  using (public.is_staff()) with check (public.is_staff());

-- ============================================================
-- 7 · Leads (WeCos owns every lead) + unlocks + masked preview
-- ============================================================
create table public.leads (
  id                uuid primary key default gen_random_uuid(),
  target_startup_id uuid references public.startups(id) on delete set null,
  target_package    text,
  category          studio_category,
  city              text,
  -- SENSITIVE — never exposed to providers until they unlock:
  buyer_name        text,
  buyer_email       text not null,
  buyer_phone       text,
  message           text,
  budget            lead_budget,
  timeline          lead_timeline,
  status            lead_status not null default 'new',
  source            text not null default 'enquiry',
  created_at        timestamptz not null default now()
);
create index on public.leads (category);
create index on public.leads (created_at);
alter table public.leads enable row level security;
-- Anyone can submit an enquiry (buyer). No general read.
create policy "leads insert public" on public.leads for insert to anon, authenticated with check (true);

create table public.lead_unlocks (
  id                  uuid primary key default gen_random_uuid(),
  lead_id             uuid not null references public.leads(id) on delete cascade,
  provider_startup_id uuid not null references public.startups(id) on delete cascade,
  unlocked_by         uuid references public.profiles(id),
  credits_spent       int not null default 1,
  created_at          timestamptz not null default now(),
  unique (lead_id, provider_startup_id)
);
alter table public.lead_unlocks enable row level security;
create policy "unlocks select own/staff" on public.lead_unlocks for select using (
  public.is_staff()
  or exists (select 1 from public.startups s
             where s.id = provider_startup_id and s.owner_id = auth.uid())
);
-- No direct insert policy: unlocks happen only via unlock_lead() below.

-- Full lead row is readable by staff, or by a provider who has unlocked it.
create policy "leads select staff/unlocked" on public.leads for select using (
  public.is_staff()
  or exists (
    select 1 from public.lead_unlocks u
    where u.lead_id = leads.id
      and u.provider_startup_id in (select id from public.startups where owner_id = auth.uid())
  )
);
create policy "leads update staff" on public.leads for update using (public.is_staff());

-- Masked preview: providers see category-matching leads with NO contact fields.
create view public.lead_previews with (security_invoker = off) as
  select
    l.id, l.category, l.city, l.budget, l.timeline, l.target_package,
    l.created_at,
    exists (
      select 1 from public.lead_unlocks u
      where u.lead_id = l.id
        and u.provider_startup_id in (select id from public.startups where owner_id = auth.uid())
    ) as unlocked_by_me
  from public.leads l
  where l.status <> 'spam'
    and l.category in (
      select service_category from public.startups
      where owner_id = auth.uid() and offers_services and service_category is not null
    );
grant select on public.lead_previews to authenticated;

-- Spend a credit to unlock a lead's contact. Idempotent; never double-charges.
create or replace function public.unlock_lead(p_lead uuid)
returns public.leads language plpgsql security definer set search_path = public as $$
declare
  v_provider uuid;
  v_category studio_category;
  v_lead public.leads;
  v_balance int;
begin
  select id, service_category into v_provider, v_category
    from public.startups
   where owner_id = auth.uid() and offers_services and service_category is not null
   limit 1;
  if v_provider is null then raise exception 'not a provider'; end if;

  select * into v_lead from public.leads where id = p_lead;
  if v_lead.id is null then raise exception 'lead not found'; end if;
  if v_lead.category is distinct from v_category then raise exception 'lead not in your category'; end if;

  -- already unlocked: return contact without charging again
  if exists (select 1 from public.lead_unlocks
             where lead_id = p_lead and provider_startup_id = v_provider) then
    return v_lead;
  end if;

  select coalesce(sum(delta),0) into v_balance from public.credit_ledger where user_id = auth.uid();
  if v_balance < 1 then raise exception 'insufficient credits'; end if;

  insert into public.lead_unlocks (lead_id, provider_startup_id, unlocked_by, credits_spent)
    values (p_lead, v_provider, auth.uid(), 1);
  insert into public.credit_ledger (user_id, delta, reason, ref)
    values (auth.uid(), -1, 'lead_unlock', p_lead);
  update public.leads set status = 'unlocked' where id = p_lead and status <> 'closed';

  return v_lead;
end $$;
grant execute on function public.unlock_lead(uuid) to authenticated;

-- ============================================================
-- 8 · Razorpay (payments) — written by the webhook (service role) after
--     HMAC signature verification in an edge function.
-- ============================================================
create table public.payment_orders (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references public.profiles(id) on delete cascade,
  purpose          pay_purpose not null,
  amount_paise     int not null,
  currency         text not null default 'INR',
  razorpay_order_id text unique,
  status           pay_status not null default 'created',
  notes            jsonb not null default '{}',
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
create trigger trg_orders_touch before update on public.payment_orders
  for each row execute function public.touch_updated_at();
alter table public.payment_orders enable row level security;
create policy "orders select own/staff" on public.payment_orders for select
  using (user_id = auth.uid() or public.is_staff());
create policy "orders insert own" on public.payment_orders for insert
  with check (user_id = auth.uid());
-- status transitions are written by the webhook (service role) only.

create table public.payments (
  id                 uuid primary key default gen_random_uuid(),
  order_id           uuid references public.payment_orders(id) on delete set null,
  user_id            uuid references public.profiles(id) on delete set null,
  razorpay_payment_id text unique,
  razorpay_order_id  text,
  amount_paise       int,
  status             pay_status not null default 'created',
  method             text,
  captured           boolean not null default false,
  signature_verified boolean not null default false,
  created_at         timestamptz not null default now()
);
alter table public.payments enable row level security;
create policy "payments select own/staff" on public.payments for select
  using (user_id = auth.uid() or public.is_staff());
-- inserts/updates by webhook (service role) only.

-- Webhook idempotency log (service role only).
create table public.razorpay_events (
  id           text primary key,     -- Razorpay event id
  event        text,
  payload      jsonb,
  processed_at timestamptz not null default now()
);
alter table public.razorpay_events enable row level security;
create policy "events staff read" on public.razorpay_events for select using (public.is_staff());
