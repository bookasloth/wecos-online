-- Studios listing is now an application → admin-approval flow (not instant).
--
-- studio_status tracks the application; `offers_services` stays the operative
-- "live in the directory" gate (the lead_previews view + RLS already key off it),
-- so only an approved provider lists and receives leads:
--   null       — never applied
--   'pending'  — applied for service_category, awaiting admin (offers_services=false)
--   'approved' — admin approved         (offers_services=true)
--   'rejected' — admin declined         (offers_services=false)

alter table public.startups
  add column if not exists studio_status text
  check (studio_status in ('pending', 'approved', 'rejected'));

comment on column public.startups.studio_status is
  'Studios listing application state. approved flips offers_services=true (admin only).';
