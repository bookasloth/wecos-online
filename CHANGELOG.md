# Changelog

Notable changes, newest first. Not yet versioned — the project is pre-release.

## Unreleased

### Added
- Auth screens rebuilt — centred card shell, two-tone headings, social-auth slot
  (flagged off until Supabase)
- Onboarding rebuilt — 3 steps (profile + handle claim, focus, venture) on a
  step rail, ending in the feed. Captures city (Coffee Club matching) and needs
  (Studios lead signal)
- `components/patterns/` — `TwoToneHeading`, `StepRail`, `OrDivider`
- Membership tiers in config: ₹0 / ₹499 / ₹1,299 / ₹1,999 annual, with a
  5/15/25% studio discount ladder
- Tier-aware membership page with founding seats at Venture and above
- Documentation set: architecture, database schema, authorization, routing,
  tiers, ADRs 0001–0005, PRDs. Index at [docs/README.md](docs/README.md)
- Membership tier model — four annual tiers, entitlement design, lead
  masking/unlock model
- WeCos Studios as a service business: six studios with packages, pricing,
  member discount and lead capture
- Membership state and dashboard page (mock activation, no payment)
- `robots.ts`, `sitemap.ts`, per-page metadata for client-rendered routes
- Shared accessible `Modal` — dialog roles, focus trap, Escape, scroll lock
- Design tokens: `--text-2xs`, `--text-3xs`, `--shadow-card`, dark-mode neutral shadows
- `.env.example`, real `README.md`

### Changed
- **Button redesigned**: real size scale (28/32/40/48/56 heights, generous side
  padding), 6px control radius, hover darkens instead of fading, and a glare
  that sweeps out and back once per hover
- **Pricing corrected everywhere.** The homepage carried a hardcoded
  Studio/Network/Package table at ₹499/₹1,299/**₹1,499 per month** against
  annual tiers — now driven by config, annual, and correct
- **URL scheme**: `/u/:handle` → `/:handle`, `/startup/:slug` → `/venture/:slug`,
  both with permanent redirects. Reserved-handle list added
- Studio slugs: `accounting` → `finance`, `human-resource` → `hr`, plus
  `capital-circle`; old slugs redirect
- `/studios` and `/studios/[slug]` are now server components (SSG, real metadata)
- `useAppHydrated` uses `useSyncExternalStore`, removing a cascading render

### Fixed
- **Security**: `/api/company-enquiry` accepted an arbitrary recipient and link —
  a usable phishing relay. Now zod-validated, server-derived links, escaped HTML,
  rate limited
- Duplicate `<Toaster>` mounted twice, so every toast rendered twice
- Two competing effects fighting over the same state in `company-page.tsx`
- Unstable `useMemo` dependencies on both studios pages
- `setTimeout` setting state after unmount
- Focus indicators on inputs (`outline-none` with no replacement ring)
- Four ESLint errors → zero

### Removed
- `/home-2` — an unlinked, publicly routable duplicate homepage (438 lines)
- Seven unused dependencies; `shadcn` moved to devDependencies
- Founder Flow phase ladder from the dashboard — internal funnel, not for
  founders. Model retained in [docs/BUSINESS_MODEL.md](docs/BUSINESS_MODEL.md)
- Unused imports, symbols and boilerplate assets
