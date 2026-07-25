# AI Context

The short brief. Read this before touching anything in this repository.

**Status:** Current · **Last updated:** 2026-07-24

---

## What this is

**WeCos** — a members' club for Indian founders that also owns the agencies those
founders buy from. Not a SaaS platform. Read
[BUSINESS_MODEL.md](BUSINESS_MODEL.md) for how money actually flows; it explains
most product decisions.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind v4 · zustand ·
zod · react-hook-form · shadcn-style primitives on `@base-ui/react`.

**Read the Next.js docs in `node_modules/next/dist/docs/` before writing code.**
This version has breaking changes from what you probably know.

## The single most important fact

**There is no backend.** State lives in `localStorage` via
`src/lib/store/app-store.ts`. Auth is fake — no password check, no session token,
no server. `RequireAuth` gates client-side only.

Everything is marked with `⚠️ MOCK` comments. Do not treat any of it as secure,
and do not build on it as though it were.

## Before you build UI

Read [UI_UX_GUIDE.md](UI_UX_GUIDE.md). It is the standing design brief and ends
with a pre-ship checklist. The short version: weight 400 on display type, 4px
radius on controls, borders not shadows, generous line-height, tokens never hex.

## Before you build a gated feature

Read [AUTHORIZATION.md](AUTHORIZATION.md). Four membership tiers gate almost
everything. The entitlement layer is meant to exist before the features that
check it.

## Where things are

```
src/app/(marketing)/   public site
src/app/(auth)/        sign in / up / recovery
src/app/(app)/         signed-in shell: dashboard, feed
src/app/api/           route handlers
src/components/ui/     primitives — reuse, don't reinvent
src/features/          feature slices: auth, feed, profiles, startups, studios, account
src/config/site.ts     nav, cities, studios, pricing, reserved handles — edit here
src/lib/store/         the mock store
```

## Rules that bite if ignored

1. **`src/config/site.ts` is the single source of truth** for nav, cities,
   studios, pricing and reserved handles. Do not hard-code these anywhere else.
2. **Handles are root-level URLs** (`/username`). Adding a top-level route
   without adding the word to `reservedHandles` breaks whoever owns that handle.
   See [ROUTING.md](ROUTING.md).
3. **Never hardcode a colour.** Semantic tokens in `src/app/globals.css`.
4. **Use `src/components/ui/modal.tsx`** for dialogs. Do not hand-roll another
   `fixed inset-0` overlay; the shared one has the focus trap and scroll lock.
5. **Lead contact data is masked server-side**, never client-side.
   See [prd/CRM_PRD.md](prd/CRM_PRD.md).

## Verify before claiming done

```bash
npx tsc --noEmit && npx eslint src && npm run build
```

ESLint currently has **0 errors** and ~21 warnings (all `<img>` and one false
positive). Keep errors at zero.

## Current state and next task

[PROJECT_STATUS.md](PROJECT_STATUS.md) · [NEXT_TASK.md](NEXT_TASK.md)
