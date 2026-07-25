# Architecture

How the system is put together.

**Last updated:** 2026-07-24

---

## Shape today

A Next.js App Router application with **no backend**. Everything a "server" would
normally do is faked in the browser.

```
Browser
  ├─ Server Components ──── static content, sample data, metadata, SEO
  ├─ Client Components ──── interactivity
  │     └─ zustand store (localStorage)   ⚠️ the entire data layer
  └─ Route Handler ──────── /api/company-enquiry → nodemailer → Gmail
```

The one real server surface is the enquiry endpoint. Everything else is
localStorage.

## Layers

| Layer | Location | Rule |
|---|---|---|
| **Routes** | `src/app/**` | Thin. Compose features, own metadata. No business logic |
| **Features** | `src/features/*` | A vertical slice: schema, forms, views, logic |
| **UI primitives** | `src/components/ui` | Generic, reusable, no domain knowledge |
| **Layout** | `src/components/layout` | Container, header, footer, section heading |
| **Config** | `src/config/site.ts` | Single source of truth for structured content |
| **State** | `src/lib/store` | ⚠️ Mock. Replaced by Supabase + React Query |
| **Sample data** | `src/lib/sample` | ⚠️ Mock. Replaced by the database |

Feature slices are `auth`, `feed`, `profiles`, `startups`, `studios`, `account`.
A slice may import from `components/`, `config/`, `lib/`. **Slices should not
import each other** — where they need to, that shared thing belongs in `lib/` or
`components/`.

## Route groups

```
(marketing)   public site + the root [handle] profile route
(auth)        sign-in, sign-up, forgot-password
(app)         signed-in shell — dashboard, feed
```

Groups add no path segment. See [ROUTING.md](ROUTING.md).

## Server vs client

Default to **server components**. Reach for `"use client"` only for
interactivity, and push the boundary as deep as possible.

Today 41 of ~60 files are client components — more than necessary. Six marketing
pages are client-rendered only because they own filter state, which also cost
them their `metadata` export (patched with sibling layouts). The pattern to
follow instead: **server page + small client island**, as
`/studios/[slug]` now does.

## Where enforcement will live

Once the backend exists, three layers, and skipping any is a hole:

| Layer | Role |
|---|---|
| UI | Hides what you cannot use. **Not security** |
| Server | `can()` before any write. The real check |
| Database RLS | Last line. Assume the server has a bug |

See [AUTHORIZATION.md](AUTHORIZATION.md).

## Target shape

```
Browser
  ├─ Server Components ──── Supabase server client (RLS-scoped reads)
  ├─ Client Components ──── React Query for server state
  │                         zustand for genuinely client-only UI state
  ├─ Server Actions ─────── writes, guarded by can()
  └─ Route Handlers ─────── webhooks (Razorpay), email, integrations
        └─ Supabase ─────── Postgres + RLS + auth + storage
```

The migration is intended to be swap-the-body, not rewrite-the-screens: store
actions were written with the same signatures the real ones will have.

## Principles

1. **Config over code duplication.** Nav, cities, studios, pricing and reserved
   handles live in `src/config/site.ts`, once.
2. **Tokens over hardcoded values.** No hex, no `purple-700`, no raw `rgba()`.
3. **Entitlements are named capabilities**, never `tier === 'venture'` in a
   component.
4. **Mock code is labelled.** Every mock carries a `⚠️ MOCK` comment saying what
   replaces it.
5. **Deletion over addition.** The audit removed ~1,000 lines and the product got
   better.
