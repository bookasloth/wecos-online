# WeCos 2.0 — Business Model (internal)

Source: `WeCos 2.0 – India's Ultimate Startup Engine` deck, 19 slides.

> ⚠️ **Pricing here is the deck's, and is superseded.** The product now sells four
> annual tiers — ₹0 / ₹499 / ₹1,299 / ₹1,999 — not a single ₹3,650 membership.
> See [FEATURES.md](FEATURES.md) for what ships and [ASSUMPTIONS.md](ASSUMPTIONS.md)
> for the revenue impact. The strategy below still holds; only the price does not.

**Internal reference for planning. None of this is shown to founders in the product.**
Founders see value — services, community, a directory, a feed. They do not see the
funnel they're in, the stage we've assigned them, or what they're worth to us.

---

## What the company is

WeCos is not a SaaS platform. It's a **startup engine**: a members' club for Indian
founders that also owns the agencies those founders buy from.

Positioning from the deck: *"We're not here to raise funds. We're here to raise
founders."* Target is 500 paying founders in year one, cash-flow positive from
month one — explicitly **not** a burn-and-raise story.

The differentiator table (slide 18) is the clearest statement of intent:

| Category | Others | WeCos |
|---|---|---|
| Accelerators | Focused on funding | Focused on foundation |
| Agencies | Expensive, siloed | Integrated, affordable |
| Communities | Chat-driven | Action-driven |
| Platforms | Tool overload | Calm, structured, purposeful |
| Ecosystems | Transactional | Transformational |

---

## The dual economy

This is the core mechanic, and it's why the business works.

**Engine Economy** — the founder-facing platform. Validation, community, directory,
feed, Coffee Clubs, Marketplace. Monetized by subscriptions, event tickets and
marketplace commission. This layer is cheap to run and its job is **attracting and
holding founders**, not producing profit.

**Partner Economy** — the in-house service arms (Studios). Marketing, HR, Finance,
Legal, Capital. Monetized by retainers, project fees and equity. This is where the
margin lives.

The Engine acquires; the Partner Economy monetizes. Membership is deliberately
cheap (₹3,650/year ≈ ₹10/day) because it isn't the product — it's the qualifier.
A member is a pre-warmed, pre-trusted lead for a ₹25,000/month retainer.

Slide 6 says it plainly: each studio *"not only earns — it reduces founder churn by
integrating WeCos deeper into their business."* The services are both revenue **and**
retention. A founder who has outsourced their payroll to you does not casually leave.

---

## Where the money comes from

Six channels, Year 1 (slide 5):

| Stream | Mechanics | Year-1 revenue |
|---|---|---|
| Memberships | 500 × ₹3,650/yr | ₹18.25L |
| Events & bootcamps | ~20 events, ₹499 avg | ₹15L |
| **Studios (services)** | retainers + projects | **₹25L** |
| Marketplace commission | 15% of ~₹10L GMV | ₹1.5L |
| Brand partnerships | SaaS credits, sponsors | ₹5L |
| Equity & advisory | ~2% in 5 startups | long-term asset |

**Total ~₹64.75L revenue · ~₹40L costs · ~₹24.75L EBITDA (≈38%).**
Year 2–5 projection: ₹1.4Cr revenue, ~50% margin.

Two things stand out:

1. **Studios are the biggest line (~39%)** and the highest-margin one. Membership,
   the thing the marketing shouts about, is only 28% — and its real job is feeding
   Studios.
2. **Marketplace is ₹1.5L.** It is not a revenue business at this scale. It's a
   retention and status mechanic — founders selling to founders, which makes leaving
   costly. Don't over-invest in it expecting money.

### Studio economics (slide 6)

| Studio | Avg deal | Target clients | Implied |
|---|---|---|---|
| Marketing | ₹25,000 | 40 | largest volume |
| Finance | ₹20,000 | 15 | |
| HR | ₹15,000 | 20 | |
| Legal | ₹10,000 | 15 | cheapest entry |
| Capital Circle | % success fee | 10 | uncapped upside |

⚠️ **Technology Studio is not in the deck.** It exists in the codebase with
placeholder economics (₹50,000 / 20 clients). Confirm or remove before it appears
in any financial material.

Legal is the smart wedge: at ₹10,000 it's the cheapest way to convert a member into
a services client, and incorporation is the one thing every founder needs first.
Capital Circle is the opposite — no fixed price, pure upside, and it's the studio
that generates the equity line.

---

## How a founder actually moves through it

The deck's conversion funnel (slide 12) and founder flow (slide 7):

```
Free quiz → email → free bootcamp
  → validation report (₹0) → membership (₹3,650)
    → Coffee Club engagement
      → Studios / paid events        ← the money
        → Marketplace selling → reinvests
```

The deck calls it *"a compounding relationship loop"* rather than a funnel, and
that's accurate: the exit of the loop feeds the entrance.

The year-one arc, internally, runs in five stages — validate, launch, join the
community, gain visibility, monetize and mentor — each with something tangible
attached (validation report, growth toolkit, Coffee Club, founder page, marketplace
access). **This staging is an internal planning model.** It shapes what we build and
when we prompt, but a founder should never be shown "you are in stage 2 of 5."

Traffic plan: ~50k visitors over 10 months (25k SEO, 10k social, 5k Coffee Clubs,
10k partnerships) converting at ~1% to 500 paying founders.

---

## The offline layer

Coffee Clubs — 15 city chapters by year end, monthly meetups. Revenue is thin
(₹299–999 tickets plus local sponsorships), but that's not the point. The deck's
own framing: *physical engagement → digital retention → business monetization.*

Coffee Clubs are a **lead pipeline for Studios** and the hardest part of the moat to
copy. Anyone can build the platform; nobody can trivially replicate fifteen rooms of
founders who show up every month.

---

## Structure

One brand, five verticals: Core (platform, community, content), Studios (profit
centers), Coffee Clubs (local ops), Marketplace (commerce), Capital (advisory).

Key partnerships: cafés and coworking spaces (venues), SaaS platforms (member perks
— Framer, Zoho, Canva, Freshworks), incubators, Razorpay/Notion/Zapier, and media
(YourStory, TheBetterIndia).

---

## Reading it as a product person

**The bet:** a founder who pays ₹3,650 and shows up to a Coffee Club will eventually
spend ₹25,000/month with an agency they already trust. Membership is customer
acquisition cost, recovered many times over.

**What that means for what we build:**

- Membership must be *easy* and feel like a bargain. It's the qualifier, not the
  product.
- Studios need real conversion surfaces — pricing, packages, lead capture. This is
  the revenue.
- Community and Marketplace are retention, not revenue. Build them well enough that
  people stay; don't optimize them for money that isn't there.
- The founder-facing product should feel calm and useful, never like a funnel. The
  monetization is real and fine — it just shouldn't be *visible* as machinery.

**Risks worth naming:**

- Studios and platform are different businesses with different failure modes. Studio
  work is people-heavy and doesn't scale like software; 100+ service clients means
  real headcount, and the ₹40L cost line has to cover it.
- ~1% conversion on 50k traffic is the plan's load-bearing assumption. If it lands at
  0.5%, membership halves and the Studios pipeline halves with it.
- Coffee Clubs in 15 cities is an operations problem, not a product one.
- Equity stakes are the long-term upside but contribute nothing to year-one cash.

---

## Current build status

| Deck concept | In the product |
|---|---|
| Studios | ✅ Six studios, packages, pricing, member discount, lead capture |
| Membership | ✅ Dashboard state + activation (mock — no payment) |
| Startup directory | ✅ `/startups` |
| Founder profiles | ✅ `/u/[handle]`, dashboard |
| Feed / community | ✅ Card-based social feed |
| Coffee Clubs | ⚠️ Placeholder pages only |
| Marketing membership page | ❌ `/membership` is still "coming soon" — and it's the CTA target for every Studios page |
| Validation Engine | ❌ `/validate` is a placeholder |
| Marketplace | ❌ Not built |
| Bootcamps / events | ❌ Not built |
| Payments | ❌ No Razorpay |
