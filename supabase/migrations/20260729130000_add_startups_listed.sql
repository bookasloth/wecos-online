-- Directory listing flag for startups.
--
-- `/startups` (the public directory) shows only startups whose owner has the
-- venture.list entitlement (Venture+). That is expressed as this boolean, set
-- from the dashboard when the owner can list. The existing
-- "startups readable by all" select policy already permits the public read;
-- the directory query filters `listed = true`.

alter table public.startups
  add column if not exists listed boolean not null default false;

comment on column public.startups.listed is
  'Whether the startup appears in the public /startups directory. Driven by the owner''s venture.list entitlement (Venture+).';

create index if not exists startups_listed_idx
  on public.startups (listed) where listed;
