# Project Status

**Last updated:** 2026-07-24

---

## In one line

A well-built UI-first prototype with no backend, a clear business model, and
four membership tiers designed but not implemented.

## Health

| | |
|---|---|
| TypeScript | ✅ `tsc --noEmit` clean |
| Lint | ✅ 0 errors, ~21 warnings (all `<img>`, one false positive) |
| Build | ✅ passes, 45 static routes |
| Tests | ❌ none exist |
| Backend | ❌ none — localStorage mock |
| Payments | ❌ none |

## What works

- **Marketing site** — home, about, membership, validate, resources, blog,
  Coffee Club city pages
- **Studios** — six studio landing pages with packages, pricing, member
  discount, lead-capture enquiry. Server-rendered, SSG, real metadata.
- **Directories** — `/startups`, `/founders` with filtering
- **Public pages** — `/username` (founder), `/venture/slug` (company)
- **Feed** — posts, comments, votes, polls, quizzes, bookmarks; 9 post types
- **Dashboard** — profile, startup, membership (mock activation)
- **Auth flow** — redesigned sign-in/up/reset, 3-step onboarding with handle claim
- **Design system** — semantic tokens, light/dark parity, shared accessible modal
- **SEO** — sitemap, robots, per-page metadata, canonicals

## What is designed but not built

- The **four tiers** and the entitlement layer that gates them
- **Provider listings** and the lead masking/unlock model — the ₹1,299 gate
- **Connections, follows, DMs, notifications**
- **Events, Coffee Club hosting, circles**
- Real **auth, database, payments**

## Recent work

| Date | |
|---|---|
| 2026-07-24 | Auth + onboarding redesigned; button system rebuilt; tier pricing (₹499/₹1,299/₹1,999) wired through config |
| 2026-07-24 | Docs tree scaffolded; tiers, entitlements, lead model and schema designed |
| 2026-07-24 | URL scheme: `/u/x` → `/x`, `/startup/x` → `/venture/x`, reserved handles |
| 2026-07-24 | Studios rebuilt as a service business (was a directory filter) |
| 2026-07-24 | Membership state and dashboard |
| 2026-07-24 | Full frontend audit + Phase 1–2 remediation — see [FRONTEND_AUDIT.md](FRONTEND_AUDIT.md) §14 |

## The three things that most need attention

1. **`/membership` is a "coming soon" placeholder** — and it is the CTA target of
   every Studios page. The single biggest revenue surface is a dead end.
2. **A founder's own venture page is a husk** next to the seeded demo pages —
   ~10 of 25 fields map. Worst experience in the product.
3. **No notifications**, so nothing a founder does in the feed comes back to
   them. Community cannot compound.

## Known risks

- The mock auth must not ship with real user data. It is not security.
- The four tiers produce roughly **₹5L** membership revenue against the deck's
  ₹18.25L. See [ASSUMPTIONS.md](ASSUMPTIONS.md).
- `wecos.in` vs `wecos.in` is still unresolved.
