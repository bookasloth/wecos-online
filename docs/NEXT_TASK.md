# Next Task

**Last updated:** 2026-07-24

---

## Do this next: the entitlement layer

Everything else checks against it, so it should exist before the features that
need it. Nothing user-visible ships from this task, and that is fine.

### Why first

Four tiers gate roughly forty features. If gating is written per-feature, the
rules drift out of sync with the pricing page within weeks, and every packaging
change becomes a hunt through components for `tier === 'venture'`.

### Scope

1. **`src/config/tiers.ts`** — the `TIER_FEATURES` map: capabilities and
   numeric limits per tier. Shape is in [AUTHORIZATION.md](AUTHORIZATION.md).
2. **`can(user, capability, context?)`** — pure function, unit-testable, no React.
3. **`useCan()`** — thin hook for components.
4. **`<Upgrade capability={...} />`** — the component every blocked action
   renders. Must name the tier that unblocks it and link to checkout. A blocked
   action that simply disappears teaches the user nothing.
5. **Extend the mock store** with `subscription.tier` so tiers are switchable
   locally without a backend.
6. **One test file** covering the tier matrix — the cheapest possible guard
   against a packaging change silently opening a paid feature.

### Out of scope

Real auth, payments, database, RLS. This is the interface those will plug into.

### Done when

- Every capability in [AUTHORIZATION.md](AUTHORIZATION.md) resolves for all four
  tiers
- Switching tier in the mock store visibly changes what the dashboard offers
- `npx tsc --noEmit && npx eslint src && npm run build` all pass

---

## Then, in order

1. **`/membership` marketing page** — the four tiers, comparison, checkout entry.
   Currently a placeholder that every Studios CTA points at.
2. **Editable venture page** — in-place editing, so a founder's page can actually
   be filled in. Fixes the biggest disappointment in the product.
3. **Notifications** — the highest retention-per-line-of-code work available.
4. **Fix or rename the feed's "Following" tab** — ten minutes, stops shipping a
   broken promise.

Full ordering in [ROADMAP.md](ROADMAP.md).
