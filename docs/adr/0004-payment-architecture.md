# ADR 0004 — Payment Architecture

**Status:** Accepted, not implemented · **Date:** 2026-07

## Context

Four membership tiers (₹0 / ₹499 / ₹1,299 / ₹1,999 annual) gate roughly forty
features. Separately, member service providers are listed on `/studios` alongside
WeCos's own studios, and that side needs to earn.

## Decision

**1. Razorpay** for checkout and subscriptions. Indian market, UPI, the deck
already names it as a partner.

**2. Tier definitions live in config**, not a `plan_features` table. Only
per-user overrides are stored.

**3. Providers pay to unlock a lead. There is no percentage commission.**

## Reasoning — tiers in config

Pricing and packaging will change many times before the product settles. In
config, repackaging is a one-line diff that ships with a normal deploy and is
reviewable in a PR. In the database it is a migration every time, and values
silently drift between environments.

## Reasoning — unlock, not commission

Commission on member-provider deals is unenforceable. Give a provider the buyer's
phone number and they close on WhatsApp and report nothing; we would be charging
15% of whatever they felt like admitting, and auditing 100+ small agencies is not
a business we want.

So WeCos owns every lead. Providers see a preview — category, need, budget band,
city — and pay a credit to reveal contact details.

| | Venture | Circle |
|---|:--:|:--:|
| Included unlocks | 5/month | 15/month |
| Extra unlock | ₹250 | ₹150 |

We get paid whether or not the deal closes, there is nothing to audit, and
revenue is legible: leads × unlock rate × price. Full model in
[prd/CRM_PRD.md](../prd/CRM_PRD.md).

## Consequences

**Good.** Enforceable revenue with no trust required. Packaging changes are cheap.

**Bad.** Masking must be implemented **server-side**. A lead whose email sits in
the JSON payload is not masked, and that single mistake gives away the entire
model. This is the most likely way the design fails.

**Conflict of interest.** WeCos runs its own studios *and* sees every lead first.
The mitigation is a published routing rule — **the buyer chooses the recipient** —
which must be visible on the page, not merely true in the code.

**Revenue.** These tiers yield ~₹5L against the deck's ₹18.25L. See
[ASSUMPTIONS.md](../ASSUMPTIONS.md).

## Also decided

- **Grace period** of 7 days on failed renewal before downgrade. Payment failures
  in India are common enough that a hard cutoff costs more in support load and
  goodwill than it protects in revenue. *(Length not confirmed.)*
- **Founding members**: first 500 at Venture or above get a permanent badge, a
  public seat number, and a price lock. Not a discount — discounting distorts
  tier choice and permanently lowers the revenue base, while status costs nothing
  and the lock only costs us when we raise prices, which is exactly when we most
  need those members to stay.
