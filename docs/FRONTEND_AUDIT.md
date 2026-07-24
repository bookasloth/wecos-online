# WeCos Frontend Audit & Cleanup Report

Audit date: 2026-07-24 · Branch `main` @ `bd2fce3` · Next 16.2.9 / React 19.2.4 / Tailwind v4

> **Status update (same day):** the audit was originally read-only. Phases 1 and 2
> have since been applied — see [§14 Remediation log](#14-remediation-log) for what
> changed, what was verified, and what is still open. Findings above are kept as
> written so the before/after is traceable; each fixed item is marked ✅ there.
>
> **One finding was wrong and is retracted:** the "6 pages with no `<h1>`" item in
> §7/§8. The grep counted `<h1>` per page file, but those pages render their
> heading through shared components (`DashboardHeader`, `PagePlaceholder`,
> `FeedView`), all of which emit a proper `<h1>`. Only `/feed/[id]` genuinely
> lacked one.

Baseline facts gathered:
- 11,590 LOC across 60 `src` files, 28 routes, 1 API route.
- `npx tsc --noEmit` → **clean, zero errors**.
- `npx eslint src` → **4 errors, 45 warnings**.
- 41 of ~60 files carry `"use client"`.

---

## 1. Executive Summary

| Dimension | Score | Basis |
|---|---|---|
| **Overall health** | **62 / 100** | Types clean, tokens well-designed, but heavy dead weight and one 1,428-line file |
| Technical debt | 55 | 10 unused deps, dead route, dead components, duplicated Toaster |
| Maintainability | 58 | `company-page.tsx` is 12% of all app code; inconsistent indentation/style inside it |
| Performance | 60 | 29 raw `<img>` (zero optimization), 41 client components, unused deps ship in `node_modules` only but tiptap/tanstack risk creeping in |
| Accessibility | 65 | Good: reduced-motion block, focus ring token, alt text present everywhere. Bad: 45 raw `<button>` vs 12 `<Button>`, modals lack `role="dialog"`/focus trap |
| Consistency | 70 | Token system is genuinely good; violated by arbitrary `rounded-[26px]`, `text-[11px]`, and hardcoded rgba shadows |

**Design system quality is the strong point** — `globals.css` is a proper semantic token layer with light/dark parity and an explicit "never hardcode colors" rule. The debt is concentrated in three places: `company-page.tsx`, `package.json`, and the marketing pages' image handling.

---

## 2. Critical Issues

### C1. 🔴 Duplicate `<Toaster />` mounted twice
- [src/app/layout.tsx:41](src/app/layout.tsx:41) renders `<Toaster richColors position="top-center" />`
- [src/providers/app-providers.tsx:19](src/providers/app-providers.tsx:19) renders **the identical** `<Toaster richColors position="top-center" />`

Two sonner containers are live simultaneously. Every `toast()` renders twice, stacked. **This is user-visible today.**
Fix: delete the one in `layout.tsx` (keep it in the providers composition root, which is what its own docblock says it's for). Confidence: **high**. Risk: 🟢.

### C2. 🔴 API route: unescaped user input interpolated into outbound email HTML
[src/app/api/company-enquiry/route.ts](src/app/api/company-enquiry/route.ts) — `body.companyName`, `body.userEmail`, `body.documentName`, `body.documentLink` are interpolated raw into two HTML emails with **zero validation and zero escaping**.

Three distinct problems:
1. **HTML/link injection** into the admin's inbox (`${body.companyName}` can close the table and inject anything).
2. **Arbitrary-recipient send.** `to: body.userEmail` is attacker-controlled and the body's CTA href is `${body.documentLink}` — also attacker-controlled. Anyone can `POST` and make **your** authenticated SMTP account send a WeCos-branded email with a WeCos logo to any address, with any link. That is a ready-made phishing relay signed by your domain.
3. **No rate limit** — the same endpoint is an unbounded outbound mail pump against a Gmail account.

Fix: `zod` is already a dependency. Parse the body with a schema (`z.email()` for `userEmail`, `z.enum([...])` for `documentName`), derive `documentLink` **server-side** from the enum (don't accept it from the client at all), HTML-escape every interpolation, and add a simple IP/rate guard. Confidence: **high**. Risk: 🟡 (route contract stays the same; only malformed payloads change behavior).

### C3. 🟠 The enquiry emails link to files that don't exist
[src/features/startups/company-page.tsx:1331](src/features/startups/company-page.tsx:1331) builds links to `/documents/company-profile.pdf`, `/documents/brochure.pdf`, `/documents/pitch-deck.pdf`, `/documents/catalogue.pdf`, `/documents/rate-card.pdf`.

`public/` contains **no `documents/` directory**. Every document-request email currently sends the user to a 404. The form still shows "Document link has been sent to your email." Confidence: **high** (verified against `git ls-files public/`).

### C4. 🟠 Two competing `useEffect`s fight over the same state
[src/features/startups/company-page.tsx:192](src/features/startups/company-page.tsx:192) and [:198](src/features/startups/company-page.tsx:198) both compute `setShowReadMore` from `aboutRef`, with **different logic** (`clientHeight` vs `lineHeight * 8`) and the **same dep array** `[data.about]`. The second runs inside `requestAnimationFrame`, so it wins by timing, not by intent — making the first one dead code that still causes a render. Keep the rAF one, delete the other. Confidence: **high**. Risk: 🟡.

### C5. 🟠 Publicly routable duplicate homepage
`src/app/home-2/page.tsx` (438 LOC) is a second, unlinked homepage served at **`/home-2`**. It duplicates `SiteHeader`/`SiteFooter`/pricing/cities from the real homepage, has no `metadata`, and is indexable (no `robots.ts` exists). It's an abandoned design experiment shipping to production. Confidence: **high** (zero inbound links; `grep -r "home-2" src/` → only the file itself).

### C6. 🟠 ESLint fails the build gate — 4 errors
- `src/app/(marketing)/startups/page.tsx:378` — unescaped `'`
- `src/app/home-2/page.tsx:406,407` — unescaped `'`
- `src/lib/store/app-store.ts:232` — `react-hooks/set-state-in-effect`: `setHydrated(useAppStore.persist.hasHydrated())` synchronously in an effect body causes a cascading render on **every authenticated screen**.

The `useAppHydrated` hook should read the hydration flag via `useSyncExternalStore` against `useAppStore.persist` instead of `useState` + effect. Confidence: **high**. Risk: 🟡.

---

## 3. Dead Code Report

### 3.1 Unused dependencies (verified: 0 import sites in `src/`)

| Package | Evidence | Delete? |
|---|---|---|
| `@supabase/ssr` | 0 refs | ✅ high — no backend wired yet |
| `@supabase/supabase-js` | 0 refs | ✅ high |
| `@t3-oss/env-nextjs` | 0 refs; env read via raw `process.env` in the API route | ✅ high |
| `@tanstack/react-query` | 0 refs (mentioned only in a code comment) | ✅ high |
| `@tanstack/react-table` | 0 refs | ✅ high |
| `@tanstack/react-virtual` | 0 refs | ✅ high |
| `@tiptap/pm` | 0 refs | ✅ high |
| `@tiptap/react` | 0 refs | ✅ high |
| `@tiptap/starter-kit` | 0 refs | ✅ high |
| `date-fns-tz` | 0 refs (`date-fns` itself is used in 2 files) | ✅ high |
| `shadcn` | imported **once**, as a CSS import in `globals.css` (`@import "shadcn/tailwind.css"`) — it's the CLI, being used as a runtime dep | ⚠️ medium — verify that CSS import before removing; normally `shadcn` belongs in `devDependencies` |

These are declared-but-unimported, so tree-shaking already keeps them out of the client bundle. The cost is install time, lockfile surface, audit noise, and future confusion — not shipped KB. `@tiptap/*` alone is ~5 packages of transitive weight in `node_modules`.

**Caveat:** if a backend wiring branch is in flight, `@supabase/*` and `@tanstack/react-query` are intentional pre-installs. Check with the team before removing those three. Everything else has no such story.

### 3.2 Unused components (0 import sites)

| File | Why unused | Delete? |
|---|---|---|
| `src/components/ui/accordion.tsx` | never imported | ⚠️ medium — shadcn primitives are often pre-installed on purpose |
| `src/components/ui/alert.tsx` | never imported | ⚠️ medium |
| `src/components/ui/navigation-menu.tsx` (168 LOC) | never imported — `site-header.tsx` hand-rolls its own dropdown | ⚠️ medium |
| `src/components/ui/separator.tsx` | never imported | ⚠️ medium |
| `src/components/ui/sheet.tsx` (138 LOC) | never imported — `site-header.tsx` hand-rolls its own mobile drawer | ⚠️ medium |
| `src/components/ui/skeleton.tsx` | never imported — no skeleton loading states exist anywhere | ⚠️ medium |

Recommendation: **keep these** (they are the shadcn baseline and cost nothing at runtime), but note the smell — `navigation-menu` and `sheet` exist *and* were reimplemented by hand in `site-header.tsx`. Pick one. That's the real finding here.

### 3.3 Unused in-file symbols (ESLint-verified, all 🟢 safe)

In `src/features/startups/company-page.tsx`:
- Unused lucide imports: `MessageCircle`, `Building`, `Mail`, `Phone`, `RefreshCw`, `Satellite`, `Plane`, `Cpu`, `Wrench` (9 icons)
- Unused import: `Badge`
- Unused local components: `OverviewRow` (:130), `Metric` (:139), `PersonAvatar` (:148) — three defined-and-abandoned helpers
- Unused param `index` (:413)
- **Duplicate React import**: `import {useState}` at line 2 **and** `import { useEffect, useRef, }` at line 43 — two separate `react` import statements in one file, with a stray trailing comma

Elsewhere:
- `src/app/(marketing)/resources/blog/[slug]/page.tsx:3` — unused `ArrowLeft`, `ChevronUp`
- `src/app/(marketing)/resources/blog/page.tsx:14` — unused `categories` array
- `src/app/(marketing)/startups/page.tsx:23` — `SORTS` assigned but only used as a type
- `src/app/(marketing)/startups/page.tsx:455` — swallowed `err` in a catch

### 3.4 Unused assets (0 references in `src/`) — 🟢 safe

`public/file.svg`, `public/globe.svg`, `public/next.svg`, `public/vercel.svg`, `public/window.svg` — create-next-app boilerplate. Confidence: **high**.

Also: `README.md` is still the unedited create-next-app template. For a project a maintainer inherits in five years, this is the single highest-value-per-minute fix in the whole report.

### 3.5 Dead routes

`src/app/home-2/page.tsx` — see **C5**.

### 3.6 Environment variables

Only two are read anywhere: `SMTP_EMAIL`, `SMTP_APP_PASSWORD` (both in the API route). There is **no `.env.example`** and no env validation, despite `@t3-oss/env-nextjs` being installed for exactly that purpose. A new maintainer cannot start this project without reading the API route source. 🟢 Add `.env.example`.

---

## 4. Refactoring Opportunities

Ordered by impact ÷ effort.

### R1. Split `company-page.tsx` (1,428 LOC — 12% of the codebase) 🟠
One file holds: 12 exported types, 4 layout helpers, 11 `useState` hooks, 3 `useEffect`s, a tab system, a video lightbox, an enquiry modal, a document-request form with its own fetch + validation, a favorite/heart animation, and ~15 content sections. Indentation is inconsistent (lines 160–214 are un-indented at module depth inside the component body), which makes the file hard to read even before it's hard to change.

Suggested split — mechanical, no behavior change:
```
features/startups/company/
  types.ts              # the 12 exported types (lines 45-117)
  company-page.tsx      # composition + section visibility flags only
  enquiry-modal.tsx     # email state, validation, fetch (lines ~1300-1400)
  video-lightbox.tsx    # activeVideo + esc handler (lines ~174-190, 1390+)
  about-section.tsx     # aboutRef + read-more logic
  review-card.tsx       # ReviewCard (line 235)
```
Impact: **high** (this is the file every future change touches). Risk: 🟡 — pure extraction, verify visually per section.

### R2. Extract the repeated modal shell 🟡
`className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"` appears **4×**, paired 3× with `"w-full max-w-md rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-2xl"`. `src/components/ui/dialog.tsx` already exists and is imported by only 2 files. Route the hand-rolled modals through it — this also fixes the missing focus trap and `aria-modal` (see §7).

### R3. Extract the repeated input field 🟡
`"mt-5 w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"` appears **4×** verbatim, alongside `"mt-2 text-sm font-medium text-destructive"` (4×) for its error message. `src/components/ui/input.tsx` and `src/components/form/field.tsx` both already exist. Note `outline-none` without a replacement focus ring is also an a11y regression (§7).

### R4. Consolidate button usage 🟡
45 raw `<button>` vs 12 `<Button>` vs 19 files importing `buttonVariants`. Three parallel ways to make a button. Each raw `<button>` re-derives padding, radius, hover, and focus by hand — this is the root of the radius and focus-state inconsistency in §5.

### R5. Extract the repeated card shell 🟡
`"group relative min-h-[210px] overflow-hidden rounded-[26px] border border-border bg-card px-6 py-5 shadow-[0_14px_45px_rgba(88,28,135,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_20px_60px_rgba(88,28,135,0.11)]"` — **4× verbatim**, 250+ characters each. Also the only place raw `rgba()` survives the "never hardcode colors" rule.

### R6. Extract the eyebrow/label typography 🟢
- `"text-sm font-semibold tracking-wide text-primary uppercase"` × 5
- `"text-sm font-bold uppercase tracking-wide text-primary"` × 3 — **the same visual intent, two different class strings** (`font-semibold` vs `font-bold`, different order). This is a real inconsistency, not just duplication.
- `"mt-5 leading-relaxed text-muted-foreground"` × 9
- `"text-[11px] font-bold uppercase tracking-wide text-muted-foreground"` × 3

### R7. `useAppHydrated` → `useSyncExternalStore` 🟡
Fixes the ESLint error in **C6** and removes a guaranteed double-render on every gated screen. React 19 has the primitive; zustand's `persist` exposes `onFinishHydration` as the subscribe function. ~6 lines, net negative.

---

## 5. UI Consistency Report

The token layer in `globals.css` is well-built. These are the places components bypass it.

| Area | Finding | Standardization |
|---|---|---|
| **Border radius** | 8 distinct scales in use: `full`(86), `xl`(54), `2xl`(49), `lg`(35), `md`(13), `3xl`(2), plus arbitrary `[26px]`(4), `[28px]`(3), `[24px]`(2) | `--radius-*` tokens already exist (`sm`…`4xl`). `rounded-[26px]` ≈ `rounded-2xl` (calc → 27px). Map the arbitrary values onto the scale. |
| **Shadows** | Hardcoded `shadow-[0_14px_45px_rgba(88,28,135,0.06)]` and `[0_20px_60px_rgba(88,28,135,0.11)]` — raw rgba, violating the file's own stated rule; also **not dark-mode aware** (a purple-tinted shadow on `#0e1011`) | Add `--shadow-card` / `--shadow-card-hover` tokens with dark overrides |
| **Font size** | `text-[11px]` × 18 and `text-[10px]` × 6 — arbitrary micro-type below Tailwind's `text-xs` | Define `--text-2xs: 0.6875rem` in `@theme` |
| **Widths** | `[760px]`×4, `[740px]`×2, `[380px]`, `[360px]` — near-identical magic numbers | Reconcile 740/760 to one container width |
| **Heights** | `min-h-[210px]`×4, `[180px]`×5 | Fine if intentional; tokenize if they represent card sizes |
| **Eyebrow text** | Two variants of the same label style (see R6) | Pick one |
| **Loading state** | `"size-6 animate-spin text-muted-foreground"` (Loader2) × 3. `skeleton.tsx` exists but **is never used** — the app has spinner loading only, no skeletons | Decide on one loading language |
| **Empty state** | `"rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground"` × 3 | Extract `<EmptyState>` |
| **Error state** | `"mt-2 text-sm font-medium text-destructive"` × 4, all hand-rolled next to inputs | Route through `components/form/field.tsx` |

---

## 6. Performance Report

### Quick wins
1. **29 raw `<img>` across 15 files; `next/image` is used in exactly one file** (`components/brand/logo.tsx`). This is the single largest performance finding. No lazy loading, no responsive `srcset`, no AVIF/WebP conversion, no CLS reservation. `public/hero-img.png`, `belong.png`, `build.png`, `validate.png` are unoptimized PNGs on the homepage LCP path. Impact: **high** on LCP and bandwidth. Risk: 🟡 — `<Image>` requires explicit `width`/`height` or `fill`, so layout needs a per-site check.
2. **Delete `/home-2`** — 438 LOC of duplicate route compiled and served for nothing.
3. **Remove the 10 unused deps** — install time and lockfile only, no bundle change.
4. **`useAppHydrated`** double-render (R7/C6).

### Medium
5. **Client-boundary audit.** 41 files are `"use client"`, including 6 marketing pages. `src/app/(marketing)/studios/page.tsx` and `startups/page.tsx` are client-rendered directory pages reading from a static `sample-data.ts` — they could be server components with a small client filter island. This also costs SEO (§8).
6. **Two `useMemo`s with unstable deps** — `studios/page.tsx:27` (`activeTopics`) and `studios/[slug]/page.tsx:25` (`topics`): a logical expression recreated on every render defeats the memo entirely. ESLint flags both.
7. **`sample-data.ts` (735 LOC) is imported by 6 client pages** — it is serialized into the client bundle six times over. Moving those pages server-side (5) removes it from the bundle entirely.

### Long-term
8. `next.config.ts` is **empty** (`/* config options here */`). No `images` config, no compression tuning, no `poweredByHeader: false`. Once `next/image` lands, this needs a `remotePatterns` entry for any external avatar/logo URLs.
9. No `loading.tsx` or `error.tsx` at any route segment — no streaming boundaries, no error isolation.

---

## 7. Accessibility Report

**Good:** every `<img>` audited has an `alt`; `prefers-reduced-motion` is handled globally; `--ring` focus token defined; `outline-ring/50` applied to `*` in base layer; `button:not(:disabled) { cursor: pointer }`; no `onClick` on bare `<div>`s.

**Issues:**

| Severity | Finding |
|---|---|
| 🟠 | **Modals are not dialogs.** The 4 hand-rolled `fixed inset-0` overlays have no `role="dialog"`, no `aria-modal="true"`, no focus trap, and no restore-focus-on-close. The video lightbox at `company-page.tsx:1390` does the most work (`tabIndex={-1}` + `.focus()` + Escape handler) but still lacks the roles and the trap. Keyboard users can tab behind the overlay. |
| 🟠 | **`outline-none` on inputs.** The repeated input class (R3) sets `outline-none` and replaces it with `focus:border-primary` only — a 1px border color change is a much weaker focus indicator than the ring the design system defines, and it fails WCAG 2.4.11 focus-appearance in low-contrast conditions. |
| 🟡 | **Heading hierarchy.** `dashboard/profile`, `dashboard/startup`, `dashboard/*/edit`, `feed`, and `feed/[id]` render **no `<h1>`** (verified by grep). Screen-reader users landing on the feed get no page title in the heading tree. |
| 🟡 | **45 raw `<button>`s** carry no consistent `:focus-visible` treatment and several icon-only ones (the `size-9` circular social/action buttons, 4× occurrence) have no `aria-label` — only 22 files use any `aria-*` attribute at all. |
| 🟡 | **Contrast:** `--muted-foreground: #5a6161` on `--background: #fbfaf8` ≈ 5.5:1 (passes AA for body). But it's applied to `text-[11px]` and `text-[10px]` micro-type in 24 places, where AA requires the same 4.5:1 — it passes, but it's the tightest combination in the system and worth not darkening the background further. |

---

## 8. SEO Report

*(Reporting only, per instructions — no strategy changes proposed.)*

| Item | Status |
|---|---|
| Root metadata + title template | ✅ Good — `metadataBase`, default + `%s · WeCos` template |
| Per-page metadata | ⚠️ **13 of 28 pages** export `metadata`/`generateMetadata`. Missing on: `/startups`, `/founders`, `/studios`, `/studios/[slug]`, `/startup/[slug]`, `/u/[handle]`, `/home-2`, and all `(app)` routes. The six marketing ones matter — **they're missing precisely because those files are `"use client"`**, and client components cannot export `metadata`. Ties directly to perf finding #5. |
| Open Graph / Twitter cards | ❌ None anywhere. No `opengraph-image`. |
| `sitemap.ts` | ❌ Absent |
| `robots.ts` | ❌ Absent — and `/home-2` is therefore crawlable |
| Structured data (JSON-LD) | ❌ None. `Organization` on the homepage and `Article` on blog posts are the obvious gaps. |
| Canonical URLs | ❌ No `alternates.canonical` on any page |
| **Domain mismatch** | ⚠️ `siteConfig.url` and `metadataBase` say `https://wecos.in`; the API route's emails hardcode `https://wecos.in` (logo `src` and CTA href) — and the repo is named `wecos-online-main`. One of these is wrong; emails may be loading a logo from a domain that isn't the canonical one. |
| Heading structure | ⚠️ 6 pages with no `<h1>` (see §7) |
| Internal linking | ✅ Good — `config/site.ts` is a genuinely well-designed single source for nav/footer/directory links |

---

## 9. TypeScript Audit

Notably clean. `tsc --noEmit` passes with **zero errors**, and there is **not a single `any`, `as any`, or `@ts-ignore` in `src/`** (verified by grep). That's unusual and worth preserving.

Minor findings:
- `src/features/startups/company-page.tsx:66,77` — type members with stray spacing (`tag?: string ;  image?: string;`), cosmetic only.
- `src/app/(marketing)/startups/page.tsx:23` — `SORTS` declared as a value but used only as a type; should be `as const` + `typeof`.
- The 12 `Company*` types live inside a 1,428-line component file rather than a `types.ts` (see R1).
- `catch (err)` at `startups/page.tsx:455` binds and discards the error.

---

## 10. Dependency Report

**Remove (high confidence, 0 import sites):** `@supabase/ssr`, `@supabase/supabase-js`, `@t3-oss/env-nextjs`, `@tanstack/react-query`, `@tanstack/react-table`, `@tanstack/react-virtual`, `@tiptap/pm`, `@tiptap/react`, `@tiptap/starter-kit`, `date-fns-tz` — **10 packages**.

Estimated bundle savings: **~0 KB shipped** (unimported code never enters the bundle). The real saving is `node_modules` size, `npm install` time, lockfile churn, and `npm audit` surface. Do not oversell this as a bundle win — it isn't one.

**Reclassify:** `shadcn` is a CLI and belongs in `devDependencies`. It's currently a runtime dep because `globals.css` does `@import "shadcn/tailwind.css"` — verify that import is still needed under Tailwind v4 before moving it.

**Thin usage, worth a look:**
- `date-fns` — 2 files. Check what's actually called; `Intl.DateTimeFormat` covers most formatting natively at zero cost.
- `react-icons` — 1 file, while `lucide-react` is used in **35**. Pulling a second icon library for one file is the definition of avoidable. Replace with the lucide equivalent and drop it.
- `motion` — 2 files. Legitimate if the animations are non-trivial; the CSS keyframes in `globals.css` suggest some animation is already hand-rolled, so there are two animation systems in play.
- `@base-ui/react` — 11 files. Fine, it's the shadcn primitive layer.

**Do not remove:** everything else is actively imported.

---

## 11. Code Smells

- `console.log(error)` at `api/company-enquiry/route.ts:211` — swallows a server error into stdout, returns a bare `{success:false}` with no logging context.
- `console.error(err)` at `company-page.tsx:1375`.
- Zero `TODO`/`FIXME` markers — good.
- The `documentEmails` and `documentLinks` maps (API route + `company-page.tsx`) are **two hardcoded copies of the same document list**, in different files, that must stay in sync manually. They are already out of sync with reality (the PDFs don't exist — C3).
- `setTimeout(..., 2000)` at `company-page.tsx:1366` closes the modal on a magic delay with no cleanup — if the component unmounts first, it sets state on an unmounted tree.
- Inconsistent indentation inside `company-page.tsx` (lines 160–214 sit at column 0 inside a function body).
- `README.md` is the untouched create-next-app boilerplate.
- Root `layout.tsx` loads **`Geist_Mono`** from Google Fonts as `--font-mono` alongside self-hosted Open Sauce Sans — check whether any component actually uses `font-mono`; if not, that's a needless external font fetch.

---

## 12. Security Review

| Severity | Finding |
|---|---|
| 🔴 | **Arbitrary-recipient mail relay + HTML injection** in `api/company-enquiry/route.ts` — see **C2**. Highest-priority item in this report. |
| 🟠 | **No rate limiting** on the only API route, which sends 2 emails per request through an authenticated Gmail account. Trivially abusable to get that account throttled or flagged. |
| 🟡 | **`localStorage` holds the fake session.** `app-store.ts` persists `session`, `profile`, and `startup` to `wecos-app-v1` in localStorage, and `RequireAuth` gates purely client-side. Both files document this clearly as mock-only, which is the right call — but it means every `(app)` route is fully readable by editing localStorage. Fine for a UI-first phase, **must not ship as-is** once real user data exists. |
| ✅ | No `dangerouslySetInnerHTML` anywhere in `src/`. |
| ✅ | No secrets committed; `.env*` is gitignored. Only `SMTP_EMAIL` / `SMTP_APP_PASSWORD` are read, both server-side, neither `NEXT_PUBLIC_`. |
| 🟢 | No `.env.example`, so the required env vars are undiscoverable without reading source. |

---

## 13. Cleanup Roadmap

### Phase 1 — Zero-risk cleanup 🟢
No behavioral change. Do all of this in one PR.
1. Remove the duplicate `<Toaster />` from `layout.tsx` (**C1** — this one *does* change behavior, for the better; verify a toast fires once).
2. Delete the 5 boilerplate SVGs in `public/`.
3. Delete the 9 unused lucide imports, `Badge`, `OverviewRow`, `Metric`, `PersonAvatar`, and merge the two `react` imports in `company-page.tsx`.
4. Delete unused `ArrowLeft`/`ChevronUp`, `categories`, and fix the unused `err`/`index` bindings.
5. Fix the 3 unescaped-apostrophe ESLint errors.
6. Remove the 10 unused dependencies (hold `@supabase/*` + `react-query` if backend work is in flight).
7. Add `.env.example` documenting `SMTP_EMAIL` and `SMTP_APP_PASSWORD`.
8. Replace the create-next-app `README.md` with real setup instructions.
9. Decide on `/home-2`: delete, or move behind a `robots.ts` disallow. Deleting is cleaner.

### Phase 2 — Refactoring 🟡
10. **Harden the API route** (C2): zod validation, server-derived document links, HTML escaping. *Do this first in the phase — it's the security item.*
11. Fix or remove the broken `/documents/*.pdf` links (C3).
12. Delete the duplicate `showReadMore` effect (C4).
13. `useAppHydrated` → `useSyncExternalStore` (C6/R7).
14. Fix the two unstable `useMemo` dep chains in `studios/`.
15. Extract `<Modal>`, `<FormInput>`, `<EmptyState>`, `<Eyebrow>`, `<StatCard>` (R2, R3, R5, R6). Unify on `Button`/`buttonVariants` (R4).
16. Split `company-page.tsx` (R1).

### Phase 3 — Performance 🟠
17. Migrate the 29 raw `<img>` to `next/image`, starting with the homepage LCP images. Configure `next.config.ts` `images` alongside.
18. Move the 6 client-rendered marketing pages to server components with client filter islands — this simultaneously fixes their missing `metadata` (SEO §8) and drops `sample-data.ts` from the client bundle.
19. Add `loading.tsx` / `error.tsx` boundaries per route group.
20. Audit whether `Geist_Mono` is used; drop the fetch if not.

### Phase 4 — Architecture 🟠
21. Give the modals real dialog semantics + focus traps (route through `ui/dialog.tsx`).
22. Add the missing `<h1>`s on the 6 pages lacking them.
23. Resolve `wecos.in` vs `wecos.in` — one canonical domain in `siteConfig`, referenced everywhere including the email templates.
24. Single source of truth for the document list (currently duplicated across the API route and `company-page.tsx`).
25. Tokenize shadows, `--text-2xs`, and map arbitrary radii onto `--radius-*`.
26. Delete either `ui/sheet.tsx` + `ui/navigation-menu.tsx` or the hand-rolled equivalents in `site-header.tsx` — not both.

### Phase 5 — Future
27. `sitemap.ts`, `robots.ts`, Open Graph images, JSON-LD, canonicals.
28. Replace the localStorage mock auth with real sessions + middleware gating before any real user data lands.
29. Rate limiting on API routes.
30. There is no test setup of any kind. At minimum, the enquiry endpoint's validation deserves one.

---

## 14. Remediation log

Applied after the audit. Verified with `npx tsc --noEmit` (clean), `npx eslint src`
(**0 errors**, down from 4), `npm run build` (passes, 38 routes), and a live dev-server
pass through the studios, company, sign-in and feed screens.

### Fixed

| # | Item | What changed |
|---|---|---|
| ✅ C1 | Duplicate `<Toaster />` | Removed from `layout.tsx`; the one in `app-providers.tsx` is now the only mount. **Verified live:** signing in produces `1` toaster container and `1` toast (was 2 and 2). |
| ✅ C2 | API mail relay / HTML injection | `route.ts` rewritten: zod `discriminatedUnion` validates the body, `documentName` is an enum, an `esc()` helper escapes every interpolation, and `documentLink` is **no longer accepted from the client** — the URL is derived server-side from `enquiryDocuments`. Added a per-IP fixed-window rate limit (5/min, in-memory). Both callers updated to the new payload shape. |
| ✅ C3 | Document links duplicated + broken | The document list is now one array in `config/site.ts` (label + path + email copy), consumed by both the route and the client. **The `/documents/*.pdf` files still do not exist** — see Still open. |
| ✅ C4 | Competing `showReadMore` effects | Deleted the `clientHeight` effect that always lost the rAF race; kept the `lineHeight * 8` one, with a comment recording why. |
| ✅ C5 | `/home-2` dead route | Deleted (438 LOC). Confirmed absent from the build route list. |
| ✅ C6 | 4 ESLint errors | 3 unescaped apostrophes fixed; `useAppHydrated` rewritten on `useSyncExternalStore`, removing the cascading render. **Verified live:** the auth gate still redirects an unauthenticated `/feed` visit to `/sign-in`, and sign-in still lands on `/onboarding`. |
| ✅ | Unused dependencies | Removed `@tiptap/pm`, `@tiptap/react`, `@tiptap/starter-kit`, `@tanstack/react-table`, `@tanstack/react-virtual`, `date-fns-tz`, `@t3-oss/env-nextjs`. Moved `shadcn` to `devDependencies`. |
| ✅ | Unused symbols | Dropped 9 unused lucide icons, `Badge`, `OverviewRow`, `Metric`, `PersonAvatar`, `ArrowLeft`, `ChevronUp`, `categories`, an unused `index` param; merged the two `react` import statements; logged the swallowed `err`. |
| ✅ | Boilerplate assets | Deleted the 5 create-next-app SVGs. |
| ✅ | `setTimeout` leak | The modal auto-close timer is held in a ref and cleared on unmount. |
| ✅ | Unstable `useMemo` deps | `topics` / `activeTopics` moved inside their memo callbacks in both studios pages. |
| ✅ | Modal a11y (R2) | New `components/ui/modal.tsx` — same class names, so no visual change — adds `role="dialog"`, `aria-modal`, `aria-labelledby`, focus trap, initial focus, focus restoration, Escape, and background scroll lock. All 4 hand-rolled modals routed through it; the video lightbox got the dialog roles inline. **Verified live:** opening focuses the close button, Escape closes, scroll unlocks, focus returns to the triggering button. |
| ✅ | Input focus indicator | `outline-none … focus:border-primary` → `focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/50` across all 4 sites. |
| ✅ | Missing metadata (SEO) | Added `layout.tsx` metadata for `/startups`, `/founders`, `/studios`, and `generateMetadata` for `/studios/[slug]`, `/startup/[slug]`, `/u/[handle]` — the client-component pages that could not export it themselves. **Verified live:** `/studios` → "Studios · WeCos", `/startup/spacex` → "SpaceX · WeCos". |
| ✅ | `robots.ts` / `sitemap.ts` | Both added; the build emits `/robots.txt` and `/sitemap.xml`. Sitemap is generated from `config/site.ts` + the data layer, so it follows the real directory once sample data is replaced. |
| ✅ | Design tokens | Added `--text-2xs`, `--text-3xs`, `--shadow-card`, `--shadow-card-hover` (dark mode drops the purple tint for neutral black). Replaced 27 occurrences of `text-[11px]`, `text-[10px]`, and the two hardcoded rgba card shadows. |
| ✅ | Hardcoded color | `hover:border-purple-700` → `hover:border-primary` in `studios/page.tsx`, matching its own `[slug]` sibling. |
| ✅ | Missing `<h1>` | Added an `sr-only` `<h1>` to `/feed/[id]` — the only page that genuinely lacked one. |
| ✅ | Docs | `.env.example` added; `README.md` replaced with real setup, layout, and current-state notes. |

### Deliberately kept

- **`@supabase/ssr`, `@supabase/supabase-js`, `@tanstack/react-query`** — unimported, but `docs/ARCHITECTURE_ROADMAP.md` commits to Supabase as the backend. These are intentional pre-installs, not debt.
- **`react-icons`** — used in one file, but for the six brand glyphs (LinkedIn, X, WhatsApp…) that lucide deliberately does not ship. Not replaceable.
- **The 6 unused shadcn primitives** — zero runtime cost. The finding worth acting on is that `sheet` and `navigation-menu` exist *and* were reimplemented by hand in `site-header.tsx`; that duplication is still open.
- **`SORTS`** — ESLint calls it unused, but `type Sort = typeof SORTS[number]` needs the value. False positive.

### Still open

| Priority | Item |
|---|---|
| 🟠 | **The `/documents/*.pdf` files still don't exist.** The email now links to a correct, server-derived URL — pointing at a 404. Either add the five PDFs to `public/documents/`, or remove the document picker from the enquiry modal. Needs a content decision, not a code one. |
| 🟠 | **22 raw `<img>` → `next/image`.** Not attempted: `<Image>` needs explicit `width`/`height` or `fill` per site, and most sources are remote (requiring `images.remotePatterns` in `next.config.ts`). Doing it blind risks exactly the layout shifts the audit was told not to introduce. Largest remaining perf win — worth its own PR with visual review. |
| 🟠 | **Split `company-page.tsx`** (R1). Now 1,378 LOC after cleanup; still 12% of the codebase. |
| 🟡 | **Client-boundary audit** (perf #5). Six marketing pages are still `"use client"`; the metadata gap is patched via layouts, but `sample-data.ts` is still in their client bundles. |
| ✅ | **Domain mismatch — resolved 2026-07-24.** `wecos.in` is now the single canonical domain for website, app and email. `siteConfig.appUrl` was collapsed into `siteConfig.url`, and `metadataBase` reads from it rather than a hard-coded string. |
| 🟡 | Remaining component extraction: `<FormInput>`, `<EmptyState>`, `<Eyebrow>`, card shell (R3, R5, R6); unify the 45 raw `<button>`s on `Button`/`buttonVariants` (R4). |
| 🟡 | Seven one-off hardcoded rgba shadows remain in `about/page.tsx` and `(marketing)/page.tsx` — each a distinct value, so tokenizing needs a decision about how many elevation levels the system should have. |
| 🟢 | Open Graph images, JSON-LD, `loading.tsx`/`error.tsx` boundaries, arbitrary radius/width values, `Geist_Mono` usage check. |
| 🔴 | Replace the localStorage mock auth with real sessions + middleware gating before any real user data lands. Unchanged by this pass, by design. |

---

## Appendix — Verification commands

```bash
npx tsc --noEmit && npx eslint src && npm run build
```
