-- Email waitlist for the not-yet-launched community feed. Anyone can subscribe
-- (public insert); nobody reads it from the client — exports happen server-side
-- / in the dashboard. Email is the primary key so re-subscribing is a no-op.

create table if not exists public.feed_waitlist (
  email      citext primary key,
  source     text not null default 'feed',
  created_at timestamptz not null default now()
);

alter table public.feed_waitlist enable row level security;

-- Public can subscribe. No select policy → the list is not readable by clients.
drop policy if exists "feed_waitlist insert public" on public.feed_waitlist;
create policy "feed_waitlist insert public"
  on public.feed_waitlist for insert to anon, authenticated
  with check (true);
