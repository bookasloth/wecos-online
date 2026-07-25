# Contributing

## Before you start

1. Read [docs/AI_CONTEXT.md](docs/AI_CONTEXT.md) — the short brief.
2. Building UI? Read [docs/UI_UX_GUIDE.md](docs/UI_UX_GUIDE.md) first. It ends
   with a pre-ship checklist.
3. Check [docs/KNOWN_ISSUES.md](docs/KNOWN_ISSUES.md) — the thing you found may
   already be a decision.

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Workflow

Branch from `main`. Name it `feat/…`, `fix/…`, `docs/…` or `refactor/…`.

Commits: imperative mood, explain **why** when it is not obvious.

```
Add tier entitlement layer

Forty features gate on membership tier. Written per-feature the rules
drift out of sync with the pricing page, so this centralises them.
```

## Definition of done

```bash
npx tsc --noEmit && npx eslint src && npm run build
```

All three must pass. **ESLint errors must stay at zero** — warnings are
tolerated (currently ~21, all `<img>`).

Also:

- [ ] Verified in the browser, not just compiled
- [ ] Checked at 375 / 768 / 1280
- [ ] Checked in light and dark
- [ ] Keyboard pass, including any dialogs
- [ ] Docs updated **in the same commit** as the code

## House rules

1. **`src/config/site.ts` is the single source of truth** for nav, cities,
   studios, pricing and reserved handles. Never hard-code these elsewhere.
2. **Never hardcode a colour.** Semantic tokens only — no hex, no `purple-700`,
   no raw `rgba()`.
3. **Reuse `src/components/ui/`.** Do not hand-roll a modal; the shared one has
   the focus trap and scroll lock.
4. **Adding a top-level route?** Add the word to `reservedHandles` in the same
   commit, or you break whoever owns that username. See
   [docs/ROUTING.md](docs/ROUTING.md).
5. **Mark mocks.** Anything temporary gets a `⚠️ MOCK` comment saying what
   replaces it.
6. **Deletion beats addition.** The smallest change that works is the right one.

## Documentation

A doc that lies is worse than a missing one. If your change makes a doc wrong,
fix it in the same commit. Decisions go in [docs/DECISIONS.md](docs/DECISIONS.md)
or an ADR, not in a commit message nobody will find.
