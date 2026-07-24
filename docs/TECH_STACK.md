# Tech Stack

The locked technology decisions. Adding anything not on this list needs a reason
recorded in [DECISIONS.md](DECISIONS.md).

**Status:** ✅ Decided · **Last updated:** 2026-07-24

---

## Fixed

Chosen by the project owner, not up for re-litigation.

| | Purpose |
|---|---|
| **Next.js 16** (App Router) | Framework. ⚠️ Breaking changes vs. earlier versions — read `node_modules/next/dist/docs/` |
| **Supabase** | Postgres, Auth, Storage, Realtime |
| **Resend** | Transactional email |
| **AiSensy** | WhatsApp Business messaging (**not** authentication) |

## Core

| | Version | Notes |
|---|---|---|
| React | 19.2.4 | |
| TypeScript | 5, strict | No `any` anywhere in `src`. Keep it that way |
| Tailwind | v4 | CSS-first config; tokens in `globals.css` |
| npm | | Package manager. No pnpm/bun switch |

## Data & backend

| | For | Status |
|---|---|---|
| `@supabase/supabase-js` + `@supabase/ssr` | Client and server access, cookie sessions | Installed, unused |
| Supabase CLI | Migrations, local stack, `gen types typescript` | To add |
| `@tanstack/react-query` | Server state on the client | Installed, unused |
| `zod` | Validation at every trust boundary | ✅ In use |

**No ORM.** Not Prisma, not Drizzle. RLS is the enforcement boundary, and an ORM
means maintaining a second schema definition that has to stay in sync with the
policies. The Supabase client plus generated types is enough, and it keeps RLS
where it belongs.

## Auth

**Supabase Auth, email only.** Email + password, plus magic link. Email is the
sole identity — there is no phone auth, no SMS OTP, no WhatsApp OTP.

That keeps `user.email` as the unique key exactly as
[database/schema.md](database/schema.md) already models it. `user.phone` stays
optional and is contact data, not credentials.

**Consequence worth naming:** with email as the only way in, **email delivery is
on the critical path for sign-up**. A deliverability problem is not a degraded
experience — it is nobody being able to create an account. That raises the
priority of the Resend sending-domain setup below, and makes bounce and
complaint monitoring a launch requirement rather than a nice-to-have.

## Messaging — WhatsApp

**AiSensy** (WhatsApp Business API). Accounts and message templates are already
approved.

**Not used for authentication.** Purpose to be defined — likely candidates are
notifications, event and Coffee Club reminders, and lead alerts to providers.
Scope will be specified before anything is built against it.

Two things carry over regardless of the eventual use:

- **Every send costs money** under WhatsApp's per-message pricing. Anything that
  can trigger a send needs a rate limit and a cost ceiling.
- **Template messages only** outside the 24-hour customer service window. Any new
  message type needs its own approved template, so the message copy is a
  lead-time item, not a last-minute detail.

## Email

**Resend** + **React Email** (`react-email`, `@react-email/components`) — same
company, so templates are typed React components instead of the raw HTML strings
currently sitting in `api/company-enquiry/route.ts`.

Replaces `nodemailer` + Gmail SMTP. That also removes the Gmail app password from
the deployment and gives real deliverability: SPF, DKIM, verified sending domain.

Sending domain is **wecos.in** — the same origin as the website. Verify it in
Resend (SPF, DKIM, DMARC) before anything else, because with email-only auth an
unverified domain means nobody can sign up.

## Payments

**Razorpay.** Indian market, UPI, cards, netbanking, recurring mandates. See
[adr/0004-payment-architecture.md](adr/0004-payment-architecture.md).

Subscription state comes from **webhooks**, never from the client callback.

## Storage & media

**Supabase Storage** for avatars, venture logos and media.

`next/image` with `images.remotePatterns` pointed at the storage bucket. Supabase
image transformations are a **paid-plan feature** — on the free plan, resize on
upload instead.

## Infrastructure

| | For |
|---|---|
| **Vercel** | Hosting, preview deploys, cron |
| **Supabase** | Database, auth, storage, realtime |
| **Hostinger** | Domain and DNS |
| **Upstash Redis** + `@upstash/ratelimit` | Distributed rate limiting |

The current rate limiter is an in-process `Map` — it resets on deploy and does
not coordinate across instances. Fine as a stopgap for the enquiry form,
insufficient for anything that costs money or protects an account: sign-in
attempts, password reset, lead unlocks, and any WhatsApp send.

## Background work

| | For |
|---|---|
| **Vercel Cron** | Scheduled route handlers: credit resets, renewal reminders, digests |
| **Supabase `pg_cron`** | Database-level jobs |

**No queue system.** Not Inngest, not pgmq, not BullMQ. Nothing in the current
plan needs one. Add it when there is a job that genuinely cannot run inline, and
record why.

## Observability

| | For |
|---|---|
| **Sentry** | Error monitoring, source-mapped stack traces |
| **PostHog** | Product analytics, funnels, session replay, feature flags |

PostHog over Plausible/GA because the deck's **1% conversion assumption is
load-bearing** ([ASSUMPTIONS.md](ASSUMPTIONS.md)) and needs measuring as a real
funnel, not a pageview count. Feature flags in the same tool means one fewer
service.

## Search

**Postgres full-text search.** No Algolia, no Typesense. The directory is
hundreds of rows, not millions. Revisit only when FTS demonstrably hurts.

## Realtime

**Supabase Realtime** for notifications and live feed updates. The deck notes its
scaling ceiling; at ~100k users it is comfortably sufficient.

## Scheduling

**Cal.com** embed for founder calls. Building a scheduler is a trap — timezones,
availability, reschedules and calendar sync are a product on their own.

## UI

| | For |
|---|---|
| `@base-ui/react` | Headless primitives under the shadcn-style components |
| `class-variance-authority` | Component variants |
| `clsx` + `tailwind-merge` | The `cn()` helper |
| `lucide-react` | Icons |
| `react-icons` | Brand glyphs only (LinkedIn, X, WhatsApp) that lucide does not ship |
| `next-themes` | Light/dark |
| `sonner` | Toasts. One `<Toaster>`, in `AppProviders` |
| `tw-animate-css` | Animation utilities |
| `motion` | Complex animation only; CSS keyframes cover most |
| `@fontsource/open-sauce-sans` | Self-hosted brand typeface |

Components are vendored into `src/components/ui/` — we own them and can edit
them. No MUI, no Chakra, no upgrade treadmill.

## Forms & state

| | For |
|---|---|
| `react-hook-form` + `@hookform/resolvers` | Forms |
| `zustand` + `persist` | Client-only UI state. Currently also the entire mock data layer |
| `date-fns` | Dates |

Once Supabase lands, most of the zustand store disappears — server data belongs
in server components and React Query.

## Content

**Blog: MDX in-repo.** Currently a hardcoded TypeScript array. Low volume,
SEO-critical, and it benefits from being versioned alongside the code. **No CMS**
until someone non-technical needs to publish.

**No rich-text editor.** `@tiptap/*` was installed, unused, and removed. Founder
posts stay plain text or markdown. Re-add only when formatting is a demonstrated
need.

## Testing & quality

| | For | Status |
|---|---|---|
| **Vitest** + `@testing-library/react` | Unit and component | To add |
| **Playwright** | E2E: auth, checkout, lead unlock | To add |
| ESLint 9 + `eslint-config-next` | Linting | ✅ 0 errors |
| **Prettier** | Formatting | To add — formatting is currently inconsistent |
| **GitHub Actions** | CI: `tsc`, `eslint`, `build`, tests | To add |
| **`@t3-oss/env-nextjs`** | Typed, validated env vars | **Re-add** |

On the last one: `@t3-oss/env-nextjs` was removed during the audit because
nothing imported it. That was correct then — two env vars. With Supabase,
Razorpay, Resend, AiSensy, PostHog, Sentry and Upstash it is roughly fourteen,
several of which fail silently when missing. Reversing that call.

## Deliberately not using

| | Instead | Why |
|---|---|---|
| Prisma / Drizzle | Supabase client + generated types | Duplicate schema; fights RLS |
| Redux | zustand | Less ceremony |
| Algolia / Typesense | Postgres FTS | Hundreds of rows, not millions |
| Inngest / BullMQ | Vercel Cron + pg_cron | Nothing needs a queue yet |
| A CMS | MDX in-repo | Nobody non-technical publishes yet |
| Twilio | AiSensy | Superseded |
| nodemailer + Gmail | Resend | Deliverability, no app password in prod |
| MUI / Chakra | Vendored shadcn-style components | Ownership over convenience |
| Aeonik / fakt-web | Open Sauce Sans | Commercial licences — [UI_UX_GUIDE.md](UI_UX_GUIDE.md) |

## Environment variables

Full table with descriptions in
[ENVIRONMENT_VARIABLES.md](ENVIRONMENT_VARIABLES.md).

```
NEXT_PUBLIC_SUPABASE_URL           NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
RESEND_API_KEY                     RESEND_FROM_EMAIL
AISENSY_API_KEY                    AISENSY_CAMPAIGN_NAME
RAZORPAY_KEY_ID                    RAZORPAY_KEY_SECRET
RAZORPAY_WEBHOOK_SECRET
UPSTASH_REDIS_REST_URL             UPSTASH_REDIS_REST_TOKEN
NEXT_PUBLIC_POSTHOG_KEY            NEXT_PUBLIC_POSTHOG_HOST
SENTRY_DSN                         SENTRY_AUTH_TOKEN
```

⚠️ `SUPABASE_SERVICE_ROLE_KEY` **bypasses RLS**. Server-only, never
`NEXT_PUBLIC_`.

## Wiring order

Roughly the order these get connected, because each unblocks the next:

1. **Resend + verify wecos.in** — email-only auth means nothing works without it
2. **Supabase** — project, schema, RLS, generated types
3. **Auth** — email + password, magic link
4. **Upstash** — before anything metered or credential-facing goes live
5. **Razorpay** — once tiers and entitlements exist
6. **Sentry + PostHog** — before any real traffic
7. **AiSensy** — when the WhatsApp use case is defined
8. **Vitest + Playwright + CI** — alongside, not at the end

## Open decisions this creates

1. **Supabase plan** — image transformations and some features are paid.
2. **What WhatsApp is actually for.** Scope pending.
