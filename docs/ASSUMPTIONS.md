# Assumptions

What we are taking on faith, and what breaks if it turns out false.

**Last updated:** 2026-07-24

---

## A1. Membership revenue will not match the deck

**The deck plans ₹18.25L** from 500 founders at ₹3,650/year. The four tiers
(₹499 / ₹1,299 / ₹1,999, annual) yield roughly:

| Mix | Revenue |
|---|---|
| 250 Network + 200 Venture + 50 Circle | **~₹4.84L** |
| All 500 at the top tier | ₹10L |

A **~₹13L gap** against plan. Not fatal, but it has to be filled deliberately:
roughly 1,900 paying members at this blend, or provider commission, or ads and
events carrying more, or the ₹65L target moves.

**If false** (i.e. conversion is far higher than 1%): the model works at lower
prices and the wider funnel was the right call.

## A2. A ₹1,299 member will become a ₹25,000/month studio client

This is the entire dual-economy bet. Membership is customer acquisition cost;
Studios is the margin.

**If false:** membership alone is ~₹5L against ~₹40L of costs. The business does
not work. This is the assumption to test first and hardest.

## A3. ~1% of traffic converts to paying

The deck plans 50k visitors → 500 paying founders.

**If false at 0.5%:** membership halves *and* the Studios pipeline halves with
it. The two failures are correlated, not independent — that is what makes this
assumption load-bearing.

## A4. Providers will pay to unlock leads

₹250 for a contact on a ₹15k–25k engagement is 1–3% of deal value. Cheap enough
that we believe providers unlock readily.

**If false:** the provider side earns only its subscription revenue. Survivable,
but it removes the scaling story for `/studios`.

## A5. Members will accept lead masking

Standard in marketplaces (Bark, Thumbtack, Upwork). We assume providers see it as
fair rather than as a hostage situation.

**If false:** listings churn and providers route buyers off-platform through
their own marketing. Mitigation is that the buyer chooses the recipient, so
masking never feels like brokering.

## A6. Coffee Clubs are the moat

Fifteen city chapters of founders who show up monthly is the hardest thing here
to copy. Revenue is thin; retention and lead flow are the point.

**If false:** WeCos is a directory plus an agency, both of which are commodity.

## A7. Manual provider vetting scales to 500 members

At a few listings a week, manual review is cheap and it is what makes the badge
mean anything.

**If false:** either the badge becomes meaningless or vetting becomes a job.

## A8. Studio economics from the deck hold

Marketing ₹25k × 40 clients, Finance ₹20k × 15, HR ₹15k × 20, Legal ₹10k × 15.

⚠️ **Technology Studio is not in the deck at all** — its ₹50,000 / 20 clients in
`src/config/site.ts` are placeholders and must not appear in financial material
until confirmed.

**If false:** ₹25L is the largest single line in the plan. Service work is
people-heavy and does not scale like software; 100+ clients means real headcount
against a ₹40L cost line.

## A9. The mock layer maps cleanly onto Supabase

Store actions were written so bodies can be swapped for Supabase calls without
changing screens.

**If false:** the UI-first phase bought less than it appears to have.
