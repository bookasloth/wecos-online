# Change record — onboarding v2 + tiers/auth

**Branch:** `record/onboarding-v2` · **Base:** `bd2fce3` (pre-session `main`)
**Diff:** 191 files changed, **+9,832 / −2,172**

## Commits

| Commit | What |
|---|---|
| `ab23e35` | docs: project documentation set |
| `68ef930` | feat: membership tiers, studios as a service business, auth and onboarding |
| `7fbf51a` | feat: onboarding v2 — full-width 2-part flow, 5 steps, company step |
| `7760f4f` | ci: GitHub Actions workflow (typecheck, lint, build) |

## Onboarding v2 (`7fbf51a`)

Full-width two-part layout — active step left, live profile preview right (updates as you type). Five steps: **Welcome → About you → What you need → Company → Done** (two framing screens bracket the three data steps; no new questions added).

New skippable **Company step**: name, searchable industry (native `<datalist>`, no deps), short bio, optional logo.

Mobile: preview hides, step rail collapses to a progress bar.

Files:
- `src/features/onboarding/onboarding-flow.tsx` — rewritten, 5-step index, inline company step, state lifted for preview
- `src/features/onboarding/live-preview.tsx` — new right-half preview panel
- `src/features/onboarding/steps.ts` — 5-step rail (2 framing + 3 data)
- `src/app/(app)/onboarding/page.tsx` — full-width shell

## CI (`7760f4f`)

`.github/workflows/ci.yml` — Node 20, `npm ci` (cached), runs `tsc --noEmit` → `eslint src` → `next build` on every push to `main` and all PRs.

## Verification

- `npx tsc --noEmit` clean · `npx eslint src` zero new errors · `npm run build` passes
- Onboarding walked end-to-end in-browser: live preview updates per keystroke, datalist search works, `saveStartup` + `onboarded` persist to localStorage, no console errors, no mobile overflow

## Deploy

Frontend-only (localStorage, no backend). One dynamic route (`/venture/[slug]`) needs a Node runtime → deploy via Vercel (zero-config): import `bookasloth/wecos-online` at vercel.com/new.
