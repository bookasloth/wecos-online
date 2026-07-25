# Do Not Touch

Code and config that must not be changed casually. Not "never change" — "know
what you are doing first".

**Last updated:** 2026-07-24

---

## `src/config/site.ts` → `reservedHandles`

**Only ever add.** Removing a word frees it as a username, and if a future
top-level route claims that path, the profile breaks silently, permanently, with
no error. See [ROUTING.md](ROUTING.md).

## `next.config.ts` → `redirects()`

`/u/:handle` → `/:handle` and `/startup/:slug` → `/venture/:slug` are **permanent
(301)**. Browsers and search engines cache these. Removing them breaks every
existing inbound link and cached result. They stay indefinitely.

## `src/app/api/company-enquiry/route.ts`

This endpoint sends authenticated email. It previously accepted an arbitrary
recipient **and** an arbitrary link — a usable phishing relay signed by our
domain.

If you touch it, preserve all four properties:
1. Body validated with zod before use
2. `documentName` is an **enum**; the download URL is derived server-side
3. Every interpolation passes through `esc()`
4. Rate limiting stays

## `src/components/ui/modal.tsx`

Carries the focus trap, focus restoration, Escape handling and scroll lock for
every dialog in the app. Changing the effect ordering or the `FOCUSABLE` selector
silently breaks keyboard accessibility everywhere.

## `src/lib/store/app-store.ts` → `useAppHydrated`

Uses `useSyncExternalStore` deliberately. It previously called `setState` inside
an effect, causing a cascading render on every gated screen. Do not convert it
back to `useState` + `useEffect`.

## `src/app/globals.css` → the `@theme` block

The token contract. Adding is fine; **renaming or removing breaks components
silently** — Tailwind will emit a class that resolves to nothing, with no build
error.

## `src/features/startups/company-page.tsx`

1,378 lines and fragile. Wants splitting
([FRONTEND_AUDIT.md](FRONTEND_AUDIT.md) R1), but do it as a deliberate
extraction with visual review, not as a side effect of another change.

## `public/logo.png`

Referenced by absolute URL inside outbound email templates. Renaming or removing
it breaks the logo in every email already delivered.

## `docs/BUSINESS_MODEL.md`

Internal. Contains revenue targets, margins and funnel design. **Must not be
surfaced in the product or linked from a public page.**
