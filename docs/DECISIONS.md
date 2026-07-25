# Decisions

Index of decisions taken. Full reasoning lives in the ADRs; this is the lookup.

**Last updated:** 2026-07-24

---

| # | Decision | Date | Status | Where |
|---|---|---|---|---|
| 1 | Next.js 16 App Router, TypeScript, Tailwind v4 | 2026-06 | Accepted | [ADR 0001](adr/0001-project-setup.md) |
| 2 | Supabase for auth and database | 2026-06 | Accepted, not implemented | [ADR 0002](adr/0002-auth-strategy.md) |
| 3 | Postgres relational model, tiers in config not DB | 2026-07 | Accepted | [ADR 0003](adr/0003-database-design.md) |
| 4 | Four annual tiers; paid lead unlock, not commission | 2026-07 | Accepted | [ADR 0004](adr/0004-payment-architecture.md) |
| 5 | zustand for client state; server state via server components | 2026-06 | Accepted | [ADR 0005](adr/0005-state-management.md) |

## Smaller decisions

| Decision | Date | Reasoning |
|---|---|---|
| Founder URLs at `/username`, not `/@username` | 2026-07-24 | Cleaner. Cost is a reserved-word list — [ROUTING.md](ROUTING.md) |
| `/startup/x` → `/venture/x` | 2026-07-24 | "Venture" is the product word; LinkedIn-style path |
| Studios rebuilt as a service business | 2026-07-24 | `/studios` was a directory filter wearing the Studios name; the deck's Studios are profit centres |
| WeCos studios **and** member providers, both first-class | 2026-07-24 | Preserves the ₹25L in-house line and adds a scalable second one |
| Founding seats = badge + price lock, not a discount | 2026-07-24 | Discounting distorts tier choice and permanently lowers the revenue base; status costs nothing |
| Founding seats restricted to Venture+ | 2026-07-24 | Otherwise all 500 burn on ₹499 subscriptions and the badge means "was early", not "backed us" |
| Founder call windowed to first 90 days | 2026-07-24 | Open-ended is 2 calls/working day at 500 members |
| Free tier gets 5 connection requests/month | 2026-07-24 | Zero would starve the graph; paying members need people to connect with |
| Free venture pages exist but are unlisted | 2026-07-24 | Build-then-hit-the-wall converts better than a locked door |
| Provider listings need manual approval | 2026-07-24 | One bad agency on the same page as our own studio damages both |
| Design direction from auth0.com | 2026-07-24 | [UI_UX_GUIDE.md](UI_UX_GUIDE.md). Keep Open Sauce Sans — Aeonik is licensed |
| Founder Flow phases are internal only | 2026-07-24 | Founders should not see which stage of the funnel they are in |
| Resend + React Email replaces nodemailer/Gmail | 2026-07-24 | Deliverability, typed templates, no Gmail app password in production |
| **Email is the sole identity. No phone or WhatsApp auth** | 2026-07-24 | Keeps `user.email` as the unique key. Makes email delivery critical-path for sign-up |
| **`wecos.in` is the single canonical domain** | 2026-07-24 | Website, app and email. Replaces the earlier `wecos.co` / `wecos.online` split; `siteConfig.appUrl` collapsed into `url` |
| **Tier prices: ₹0 / ₹499 / ₹1,299 / ₹1,999, annual** | 2026-07-24 | Live in `tiers` in `config/site.ts`. Replaces `pricing.membershipInr = 3650`, which was still rendering on marketing pages |
| **Studio discount is a 5 / 15 / 25% ladder** | 2026-07-24 | `studioDiscountPct`. The gap between tiers is the upgrade argument; a flat rate gave Network nothing to sell |
| Founding seats granted at Venture and above only | 2026-07-24 | Otherwise all 500 burn on the cheapest tier and the badge means "was early", not "backed us" |
| AiSensy retained for WhatsApp messaging, not auth | 2026-07-24 | Accounts and templates approved. Use case to be specified |
| Razorpay for payments | 2026-07-24 | Indian market, UPI, recurring mandates |
| No ORM — Supabase client + generated types | 2026-07-24 | An ORM duplicates the schema and fights RLS |
| Upstash Redis for rate limiting | 2026-07-24 | In-memory limiter resets on deploy; OTP sends cost real money |
| PostHog for analytics and feature flags | 2026-07-24 | The 1% conversion assumption needs funnel measurement, not pageviews |
| Sentry for error monitoring | 2026-07-24 | |
| Postgres FTS, no search service | 2026-07-24 | Hundreds of rows, not millions |
| No queue system | 2026-07-24 | Vercel Cron + pg_cron cover everything planned |
| Cal.com for founder-call scheduling | 2026-07-24 | Timezones, availability and reschedules are a product on their own |
| Blog as MDX in-repo, no CMS | 2026-07-24 | Low volume, SEO-critical, versioned with the code |
| Re-add `@t3-oss/env-nextjs` | 2026-07-24 | **Reverses an audit removal.** Correct at 2 env vars, wrong at ~14 |
| Add Prettier, Vitest, Playwright, GitHub Actions | 2026-07-24 | No tests and inconsistent formatting today |

## Open — needs a decision

| Question | Blocks | Notes |
|---|---|---|
| Unlocked leads after downgrade: readable or revoked? | Lead model terms | Revoking retains harder; keeping avoids chargebacks. Must be in terms before purchase |
| Are handles and slugs mutable after creation? | Schema | Freeze, or keep a redirect table |
| `/startups` → `/ventures`? | Routing consistency | Detail pages already say venture |
| Grace period on failed renewal | Entitlements | 7 days proposed |
| Do the deck's revenue targets change? | Planning | Tiers yield ~₹5L vs ₹18.25L planned — [ASSUMPTIONS.md](ASSUMPTIONS.md) |
| Supabase plan (free vs Pro) | Storage transforms, some features | Image transformations are paid |
| What WhatsApp is for | AiSensy integration scope | Notifications? Event reminders? Provider lead alerts? |
| **Display type weight — 400 or bold?** | Token layer, every section | Auth0 says 400, Book A Sloth says bold. Blocks the redesign — [COMPONENTS.md](COMPONENTS.md) |
| Dark-first or light-first? | Every screen and marketing asset | Tokens support both; the choice is brand, not technical |
| Aura gradient palette | `<AuraHero>` | `--brand` → `--brand-indigo`, or → `--brand-gold` |
