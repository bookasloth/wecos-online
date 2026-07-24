# PRD — Leads & CRM

Lead capture, masking, unlock, and the provider inbox. This is the provider-side
business model, not just a CRM feature.

**Status:** ✅ Designed, not implemented · **Last updated:** 2026-07-24

---

## The problem this solves

`/studios/marketing` lists **WeCos Marketing Studio** (our own team) alongside
**member providers** (member agencies who pay ₹1,299+ to be listed). A buyer
enquires. If the provider immediately receives the buyer's email and phone, they
close the deal over WhatsApp and report nothing.

Percentage commission on self-reported deals is unenforceable. We would be
charging 15% of whatever a provider felt like admitting, and auditing 100+ small
Indian agencies is not a business we want to be in.

**So we do not sell commission. We sell access to the lead.**

## The model

WeCos owns every lead. Providers see a preview. Contact details cost a credit.

| Step | Provider sees |
|---|---|
| 1. Buyer submits an enquiry | — |
| 2. Lead created, owned by WeCos | — |
| 3. Preview shown to matching providers | Category, need summary, budget band, city, company type, age of lead |
| 4. Provider spends a credit to unlock | Name, email, phone + an in-platform thread opens |
| 5. Conversation happens in-platform | WeCos retains visibility |

**Never in the preview:** name, email, phone, company name, or anything else
that would let a provider find the buyer independently. Buyer identity is the
only thing worth paying for; give it away in the preview and there is no product.

### Credits

| | Venture ₹1,299 | Circle ₹1,999 |
|---|:--:|:--:|
| Included unlocks | 5 / month | 15 / month |
| Extra unlock | ₹250 | ₹150 |

Credits reset monthly and do **not** roll over. Price an unlock at roughly 1–3%
of expected deal value — on a ₹15k–25k engagement, ₹250 is trivial for the
provider and predictable for us.

Why this beats commission:

- **We get paid whether or not they close.** No dependence on honest reporting.
- **Nothing to audit or enforce.**
- **Revenue is legible:** leads generated × unlock rate × price.
- Providers understand it instantly. It is how Bark, Thumbtack and Upwork work.

## Routing: the conflict of interest

WeCos runs its own studios **and** sees every lead first. Nothing technically
stops us cherry-picking the best leads for our own team and releasing the rest.
Members will suspect this whether or not we do it, and the day they believe it,
the provider side dies.

**Rule: the buyer chooses.** The enquiry form asks who they want to hear from —
WeCos Studio, specific member providers, or "any". A lead addressed to a provider
is never diverted. For "any", all matching providers including WeCos see it at
the same moment, with no head start.

This must be visible on the page, not just true in the code.

## Vetting

Provider listings require **manual approval**, not just payment.

```
draft → pending → approved | rejected
                     ↓
                 suspended
```

One bad member agency taking a lead from the same page as WeCos's own studio
damages both brands. At this scale manual review is cheap, and it is what makes
the Verified Provider badge mean anything. Rejection must come with a reason and
a route to re-apply.

## Screens

| Screen | Who | Contents |
|---|---|---|
| Studio category page | Public | WeCos studio first, member providers below, labelled |
| Provider listing | Public | Pitch, packages, parent venture, badge, enquire |
| Enquiry form | Public | Need, budget band, city, company type, contact, recipient choice |
| Lead inbox | Provider | Preview cards, credit balance, unlock action |
| Lead detail | Provider, unlocked | Full contact + message thread |
| Lead ops | WeCos staff | All leads, routing, provider performance |
| Listing review | WeCos staff | Approve / reject / suspend queue |

## Rules

- Contact fields are stripped **server-side**. Not hidden in the component. See
  [AUTHORIZATION.md](../AUTHORIZATION.md).
- A lead can be unlocked by multiple providers — each pays. It is a lead, not an
  exclusive.
- Unlocking is **irreversible and non-refundable**; say so at the point of
  unlock. A confirm step with the cost stated, every time.
- Buyers are told their details are shared only with providers they choose.
  Anything less is a privacy problem, not a product decision.
- Leads must expire from the preview list (proposed 30 days) so providers are not
  paying to unlock stale enquiries.

## Metrics

- Leads created / week, by source and category
- **Unlock rate** — the health metric. Low means previews are too thin, too rich,
  or the leads are bad.
- Revenue per lead
- Provider response time after unlock (feeds the badge)
- Buyer satisfaction after a provider engagement

## Open questions

1. **Unlocked leads after downgrade** — readable or revoked?
2. **Refunds for bad leads.** Spam and tyre-kickers will happen. A no-questions
   credit refund on the first N complaints per provider is cheap goodwill; an
   open policy is abusable. Needs a number.
3. **Does WeCos Studio consume credits too**, in the "any" case? For internal
   accounting honesty it probably should, so the routing rule is verifiable.
4. **Exclusivity as an upsell** — a higher price for a lead nobody else can
   unlock. Attractive revenue, but it undercuts the "buyer chooses" principle.
   Not for v1.

## Revenue expectation

Realistic year one: **₹4–7L** from the provider side (attributable
subscriptions plus unlock fees), against ~₹25L from WeCos's own studios.

The provider side is a **strategic** investment first. It is why a founder pays
₹1,299, it makes `/studios` a real destination, and unlike our own studios it
scales without headcount. Expect the 50/50 split in year three, not year one.
