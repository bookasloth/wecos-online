-- Ensure the `details` JSONB column exists for rich startup page content
-- (products / people / funding, merged over the base columns on the public
-- page). The public /startup/[slug] page and the founder content editor both
-- read/write this column; the original init migration shipped it as `rich`.
--
-- Idempotent: does nothing if `details` already exists. If your project still
-- has the old `rich` column with data, migrate it once with:
--   update public.startups set details = rich where details = '{}'::jsonb;
-- then optionally: alter table public.startups drop column rich;

alter table public.startups
  add column if not exists details jsonb not null default '{}';
