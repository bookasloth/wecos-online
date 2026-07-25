# PRD — Payments & Subscriptions

**Status:** ✅ Designed, not implemented · **Last updated:** 2026-07-24

Feature-by-tier detail is in [FEATURES.md](../FEATURES.md). Enforcement is
[AUTHORIZATION.md](../AUTHORIZATION.md). This is checkout, billing and lifecycle.

---

## What we sell

| Product | Price | Billing |
|---|---|---|
| Network | ₹499 | Annual |
| Venture | ₹1,299 | Annual |
| Circle | ₹1,999 | Annual |
| Lead unlock credit | ₹250 (Venture) / ₹150 (Circle) | One-off |
| Ad slot | Varies | One-off |
| Event ticket | ₹0–999 | One-off |
| Studio package | ₹8,000–1,50,000 | One-off or monthly, invoiced outside the app initially |

Free requires registration but no payment.

## Gateway

**Razorpay.** Indian market, UPI, cards, netbanking; already named as a partner
in the deck.

**Subscription state comes from webhooks, never from the client callback.** The
browser redirect is a UX signal only — a user who closes the tab mid-redirect
must still end up subscribed.

## Checkout

```
/membership (public)
  → compare tiers
  → choose
  → sign in or register        ← account first, always
  → Razorpay checkout
  → webhook confirms payment
  → subscription row created, tier active
  → land on /dashboard with the new capability visible
```

The last step matters: after paying for Venture, the founder should land
somewhere that immediately shows what they just bought — "list your venture" —
not on a generic dashboard.

⚠️ `/membership` is currently a "coming soon" placeholder **and** it is the CTA
target of every Studios page. Highest-priority gap.

## Lifecycle

| Event | Behaviour |
|---|---|
| Upgrade mid-term | Prorate the remainder against the new tier. New capabilities immediately |
| Downgrade mid-term | Takes effect at renewal, not immediately. They paid for the term |
| Renewal succeeds | `renews_at` +1 year |
| Renewal fails | `past_due`. **7-day grace at full entitlement**, then downgrade to free |
| Cancellation | Access continues to `renews_at`, then free |
| Re-subscribe | Everything returns — venture relists, leads reappear |

**On the grace period:** payment failures on Indian recurring mandates are common
enough that instantly unlisting someone's venture page costs more in support load
and goodwill than it protects in revenue. Length not finally confirmed.

## Downgrade

**Losing a subscription costs reach, never work.** Nothing is deleted — a venture
page unlists, rich sections stop rendering publicly, new leads stop being
visible. Full table in [FEATURES.md](../FEATURES.md).

⚠️ **Open:** whether previously-unlocked leads stay readable. Revoking retains
harder; keeping avoids chargebacks and the bait-and-switch perception. Whichever
we pick must be in the terms **before** purchase, not discovered at renewal.

## Founding members

First **500** subscribers at **Venture or above**:

- Permanent *Founding Member* badge
- Public seat number — *Seat 37 of 500*
- **Price lock** — their rate never increases, honoured on every renewal

Not a discount. Discounting distorts tier choice and permanently lowers the
revenue base; a badge costs nothing now, and the lock only costs us when we raise
prices — which is exactly when we most need our earliest members to stay.

Restricted to Venture+ so the seats are not burnt on ₹499 subscriptions.

## Credits

Lead unlock credits reset monthly and **do not roll over**. Purchased credits are
consumed after included ones. Every unlock shows the cost and requires
confirmation; unlocking is irreversible and non-refundable.

## Invoicing and tax

- GST-compliant invoices, emailed on payment, downloadable from settings
- Prices displayed **inclusive** of GST — Indian consumers expect the final number
- Refund policy must be published before launch, including the position on
  unused lead credits

## Metrics

Conversion by tier · free → paid rate · upgrade rate · renewal rate · involuntary
churn (failed payments) · **ARPU**, which the four-tier structure makes the
number that actually matters.

## Risks

**Revenue against plan.** These tiers yield roughly ₹5L against the deck's
₹18.25L. See [ASSUMPTIONS.md](../ASSUMPTIONS.md).

**Involuntary churn.** Annual mandates fail silently. Dunning emails and the
grace period are not optional extras.

**Refund exposure on lead credits.** An unlocked lead cannot be un-seen. The
policy needs to exist before the first complaint, not after.
