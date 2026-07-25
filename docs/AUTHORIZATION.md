# Authorization

What a signed-in user is allowed to do. This is the layer every feature checks
against, so it should exist before the features do.

**Status:** ✅ Designed, not implemented · **Last updated:** 2026-07-24

Authentication (*who you are*) is [AUTHENTICATION.md](AUTHENTICATION.md). This
document is *what you may do*.

---

## The model

Three inputs decide every question:

1. **Tier** — free · network · venture · circle, from the active subscription
2. **Ownership** — is this your profile, your venture, your lead?
3. **Role** — venture role (founder/cofounder/team), circle moderator, WeCos staff

Everything resolves to a single call:

```
can(user, "venture.list")
can(user, "lead.unlock", { leadId })
can(user, "venture.edit", { ventureId })
```

## Tiers live in config, not the database

```ts
// src/config/tiers.ts  (proposed)
export const TIER_FEATURES = {
  free:    { connectionRequestsPerMonth: 5,  leadCredits: 0,  studioDiscount: 0,  … },
  network: { connectionRequestsPerMonth: Infinity, leadCredits: 0,  studioDiscount: 5,  … },
  venture: { connectionRequestsPerMonth: Infinity, leadCredits: 5,  studioDiscount: 15, … },
  circle:  { connectionRequestsPerMonth: Infinity, leadCredits: 15, studioDiscount: 25, … },
}
```

**Why config and not a `plan_features` table:** pricing and packaging will change
many times before the product settles. In config, repackaging is a one-line diff
that ships with a normal deploy and is reviewable in a PR. In the database, every
change is a migration, and the values silently drift between environments.

The only thing stored per-user is an **override** (`entitlement_override`) for
comps, staff accounts and manual grants. If you find yourself wanting a second
override row type, that's the signal the config model has actually stopped
fitting.

## Capabilities

Named, not inferred. `can(user, 'venture.list')` — never
`if (user.tier === 'venture')` scattered through components. Tier comparison in a
component is how gates drift out of sync with the pricing page.

| Domain | Capabilities |
|---|---|
| Profile | `profile.edit` · `profile.extended` · `profile.viewers` |
| Network | `connection.send` · `message.send` · `follow` |
| Feed | `post.create` · `post.richKinds` · `circle.create` |
| Venture | `venture.create` · `venture.list` · `venture.sections` · `venture.analytics` · `venture.edit` |
| Provider | `provider.list` · `provider.categories` · `lead.view` · `lead.unlock` |
| Studios | `studio.discount` |
| Events | `event.create` · `chapter.host` · `event.freeEntry` |
| Commerce | `ad.buy` · `marketplace.sell` · `perk.redeem` · `founderCall.request` |
| Admin | `admin.provider.review` · `admin.lead.manage` · `admin.member.manage` |

Quantitative limits (`connectionRequestsPerMonth`, `leadCredits`,
`providerCategories`) are **not** capabilities — they're numbers read from the
tier config and checked against `usage_counter` / `credit_balance`.

## Enforcement happens three times

Skipping any of these is a hole.

| Layer | What it does | What it is not |
|---|---|---|
| **UI** | Hides or disables what you can't use; shows the upgrade prompt | Not security. Assume it is bypassed. |
| **Server** | Route handlers and server actions call `can()` before doing anything | The real check for writes |
| **Database (RLS)** | Row-level security policies | The last line. Assume the server has a bug. |

For **masked lead data specifically, all three matter and the middle one is not
optional**: contact fields must be stripped in the query or the serializer, not
hidden in the component. A masked lead whose email is present in the JSON payload
is not masked — and that single mistake gives away the provider business model.
See [prd/CRM_PRD.md](prd/CRM_PRD.md).

## Where the tier comes from

```
subscription WHERE user_id = ? AND status = 'active'
  → none found            → free
  → status = 'past_due'   → grace period, keep the tier (see below)
  → renews_at in the past → expired, drop to free
```

**Grace period:** a failed renewal should not instantly unlist someone's venture
page. Proposed 7 days at full entitlement, then downgrade. Payment failures in
India are common enough that a hard cutoff will generate support load and
ill-will out of proportion to the revenue protected.

## Downgrade is a state change, not a deletion

The rule: **losing a subscription costs you reach, never work.**

Full table in [FEATURES.md](FEATURES.md). The implementation consequence is that
almost nothing is deleted on downgrade — `venture.listed` flips to false, rich
sections stop rendering publicly, new leads stop being visible. Everything stays
in the database and returns intact on re-subscribe.

## Open questions

1. **Unlocked leads after downgrade** — readable or revoked? Revoking retains
   harder; keeping avoids chargebacks and the bait-and-switch perception.
   Whichever is chosen must be in the terms *before* purchase.
2. **Grace period length** — 7 days proposed, not confirmed.
3. **Staff roles** — a single `is_staff` flag or a proper role table? A flag is
   enough until there is someone whose job is only provider vetting.

## Build order

This layer comes first. Concretely:

1. `src/config/tiers.ts` — the `TIER_FEATURES` map
2. `can()` plus a `useCan()` hook for components
3. `usage_counter` and `credit_balance` helpers
4. An `<Upgrade>` component — every blocked action should name the tier that
   unblocks it and link to checkout, never just disappear
5. RLS policies, written alongside the first tables

Only then do the gated features get built.
