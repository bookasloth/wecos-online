# Environment Variables

Every variable, what reads it, and whether it is required.

**Last updated:** 2026-07-24

Copy [`.env.example`](../.env.example) to `.env.local`. **Never commit a filled
version** — `.env*` is gitignored.

Once `@t3-oss/env-nextjs` is re-added (see [TECH_STACK.md](TECH_STACK.md)), these
are validated at build time and a missing one fails the build instead of failing
silently in production.

---

## Supabase

| Variable | Required | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Project URL. Public by design |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Publishable key. Safe **only because RLS is enforced** |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only | ⚠️ **Bypasses RLS entirely.** Never `NEXT_PUBLIC_`. Never import into a client component |

## Email — Resend

| Variable | Required | Notes |
|---|---|---|
| `RESEND_API_KEY` | Yes | Server only |
| `RESEND_FROM_EMAIL` | Yes | Must be on a **verified sending domain**. Blocked on the `wecos.in` vs `wecos.in` decision |

⚠️ Auth is **email only**, so these two are on the critical path for sign-up. If
Resend is misconfigured, nobody can create an account.

## WhatsApp — AiSensy

**Not used for authentication.** Purpose to be defined; see
[TECH_STACK.md](TECH_STACK.md).

| Variable | Required | Notes |
|---|---|---|
| `AISENSY_API_KEY` | When used | Server only |
| `AISENSY_CAMPAIGN_NAME` | When used | API Campaign wrapping an approved template |

⚠️ Every WhatsApp send costs money. Anything that can trigger one needs a rate
limit and a cost ceiling before it ships.

## Payments — Razorpay

| Variable | Required | Notes |
|---|---|---|
| `RAZORPAY_KEY_ID` | Yes | |
| `RAZORPAY_KEY_SECRET` | Yes | Server only |
| `RAZORPAY_WEBHOOK_SECRET` | Yes | Signature verification. **Subscription state comes from webhooks, never the client callback** |

## Rate limiting — Upstash

| Variable | Required | Notes |
|---|---|---|
| `UPSTASH_REDIS_REST_URL` | Yes | |
| `UPSTASH_REDIS_REST_TOKEN` | Yes | Server only |

## Observability

| Variable | Required | Notes |
|---|---|---|
| `NEXT_PUBLIC_POSTHOG_KEY` | No | Analytics, funnels, feature flags |
| `NEXT_PUBLIC_POSTHOG_HOST` | No | Region host |
| `SENTRY_DSN` | No | Error monitoring |
| `SENTRY_AUTH_TOKEN` | Build only | Source-map upload. CI secret, not runtime |

## App

No app-level variables. The canonical origin is hard-coded as `siteConfig.url`
(`https://wecos.in`) — one domain for website, app and email, so there is nothing
to configure per environment.

## Legacy — being replaced

| Variable | Status |
|---|---|
| `SMTP_EMAIL` | ⚠️ Gmail account for `nodemailer`. Removed once Resend lands |
| `SMTP_APP_PASSWORD` | ⚠️ Gmail App Password. Removed once Resend lands |

## Rules

1. **`NEXT_PUBLIC_` ships to the browser.** Public forever. Never a secret.
2. **Add new variables to `.env.example` and this table in the same commit.** A
   variable that only exists on one machine is a broken deploy waiting.
3. **Server-only variables are read only in server components, route handlers or
   server actions.** Importing one into a client component leaks it into the bundle.
4. **Rotate anything that reaches a log, a screenshot or a shared terminal.**
   Treat exposure as compromise.
