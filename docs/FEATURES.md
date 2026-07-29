# Features

Every feature, the tier that unlocks it, and whether it exists yet.

**Status:** ✅ Current · **Last updated:** 2026-07-24

Legend: ✅ built · 🟡 partial · ❌ not built · — not available at this tier

---

## The tiers

| | **Free** | **Network** | **Venture** | **Circle** |
|---|---|---|---|---|
| Price | ₹0 | **₹499/yr** | **₹1,299/yr** | **₹1,999/yr** |
| Promise | Be here | Be known | Be found | Be the reason people come |
| Gate moment | — | "I want to reach that person" | "I want customers for my company" | "I want to build my reputation" |

All prices are **annual**. This supersedes the WeCos 2.0 deck's single ₹3,650/year
membership — see [ASSUMPTIONS.md](ASSUMPTIONS.md) for the revenue impact.

Tier names are provisional. `Circle` risks confusion with the Capital Circle
studio; alternatives considered: Inner Circle, Chapter, Catalyst.

---

## Identity

| Feature | Free | Network | Venture | Circle | Built |
|---|:--:|:--:|:--:|:--:|:--:|
| Vanity URL `/yourname` | ✓ | ✓ | ✓ | ✓ | ✅ |
| Basic profile (name, headline, bio, photo, location) | ✓ | ✓ | ✓ | ✓ | ✅ |
| Extended profile (skills, links, work history, open-to) | — | ✓ | ✓ | ✓ | ❌ types exist, no form |
| Tier badge on profile and posts | — | ✓ | ✓ | ✓ | ❌ |
| Founding Member badge + seat number | — | — | first 500 | first 500 | ❌ |
| Directory placement | Standard | Standard | Priority | Featured | ❌ |

## Network

| Feature | Free | Network | Venture | Circle | Built |
|---|:--:|:--:|:--:|:--:|:--:|
| Follow founders | ✓ | ✓ | ✓ | ✓ | ❌ |
| Accept connection requests | ✓ | ✓ | ✓ | ✓ | ❌ |
| **Send** connection requests | 5/month | Unlimited | Unlimited | Unlimited | ❌ |
| Direct messages | — | ✓ | ✓ | ✓ | 🟡 gated (`message.send`) — free can't DM paid members |
| Who viewed your profile | — | ✓ | ✓ | ✓ | ❌ |

The free allowance of 5/month is deliberate: if free users cannot initiate, the
graph never grows and paying members have nobody to connect with.

## Feed & community

| Feature | Free | Network | Venture | Circle | Built |
|---|:--:|:--:|:--:|:--:|:--:|
| Read, comment, vote | ✓ | ✓ | ✓ | ✓ | ✅ |
| Post — text, question, win | ✓ | ✓ | ✓ | ✓ | ✅ |
| Post — poll, quiz, video, milestone | — | ✓ | ✓ | ✓ | ✅ gated (`post.richKinds`) |
| Join circles / city chapters | ✓ | ✓ | ✓ | ✓ | ❌ |
| Create a circle | — | — | — | ✓ | ❌ |
| Notifications | ✓ | ✓ | ✓ | ✓ | ❌ |

The feed's misleading "Following" tab was removed (it showed *everyone except
me* — there is no follow concept yet). It returns when the follow-graph lands
under "Connections and follows". Feed now shows "For you" and "Bookmarks".

## Ventures (business profile)

| Feature | Free | Network | Venture | Circle | Built |
|---|:--:|:--:|:--:|:--:|:--:|
| Create a venture page | Unlisted | Unlisted | ✓ Listed | ✓ Listed | 🟡 8 fields only |
| Appears in `/ventures` directory | — | — | ✓ | Featured | 🟡 sample data |
| Rich sections (products, team, traction, funding) | — | — | ✓ | ✓ | 🟡 render-only |
| Lead capture + lead inbox | — | — | ✓ | ✓ | ❌ |
| Page analytics | — | — | ✓ | ✓ + visitor detail | ❌ |
| Propose business to Capital Circle | — | — | ✓ | ✓ priority | ❌ |

**Unlisted is the free-tier hook.** A founder builds the page, then hits the wall
exactly when they want to be found. Blocking creation entirely converts worse.

⚠️ Today a founder's own venture page maps only ~10 of 25 `CompanyPageData`
fields, so it renders as a husk next to the seeded demo pages. Biggest single
disappointment in the product. See [KNOWN_ISSUES.md](KNOWN_ISSUES.md).

## Studios

WeCos runs **both** its own studios and member-provider listings on the same
surface, clearly labelled. See [prd/CRM_PRD.md](prd/CRM_PRD.md).

| Feature | Free | Network | Venture | Circle | Built |
|---|:--:|:--:|:--:|:--:|:--:|
| Browse and enquire | ✓ | ✓ | ✓ | ✓ | ✅ |
| Discount on WeCos studio packages | — | 5% | 15% | 25% | ✅ tiered 5/15/25 |
| Priority scheduling | — | — | — | ✓ | ❌ |
| **List your business as a provider** | — | — | 1 category | 3 categories | ❌ |
| Provider lead inbox | — | — | ✓ | ✓ | 🟡 gated mock (`lead.view`) |
| Lead unlocks included | — | — | 5/month | 15/month | ❌ |
| Extra lead unlock | — | — | ₹250 | ₹150 | ❌ |
| Placement in category | — | — | Standard | Featured | ❌ |
| Verified provider badge | — | — | On review | ✓ | ❌ |

Provider listings require **manual approval**, not just payment. One bad member
agency taking a lead from the same page as WeCos's own studio damages both.

## Resources

| Feature | Free | Network | Venture | Circle | Built |
|---|:--:|:--:|:--:|:--:|:--:|
| Blog | ✓ | ✓ | ✓ | ✓ | ✅ |
| Starter templates | — | ✓ | ✓ | ✓ | ❌ |
| Full toolkit library + bootcamp recordings | — | — | ✓ | ✓ | ❌ |
| Live masterclasses | Paid | Paid | 2 free/yr | Unlimited | ❌ |

## Events & Coffee Clubs

| Feature | Free | Network | Venture | Circle | Built |
|---|:--:|:--:|:--:|:--:|:--:|
| Attend Coffee Clubs | Paid ticket | Member price | Member price | Free | ❌ |
| Create events | — | — | — | ✓ | ❌ |
| Host a Coffee Club chapter | — | — | — | ✓ (approval) | ❌ |
| Speak at WeCos events | — | — | — | ✓ eligible | ❌ |

## Commerce & access

| Feature | Free | Network | Venture | Circle | Built |
|---|:--:|:--:|:--:|:--:|:--:|
| Buy ad space | — | — | ✓ eligible | ✓ + credit | ❌ |
| Sell in Marketplace | — | — | ✓ (15% fee) | ✓ (10% fee) | ❌ |
| Partner brand perks | — | — | Limited | ✓ Full | ❌ |
| Call with WeCos founder | — | — | 1× in first 90 days | 1× + quarterly | ❌ |

The founder call is windowed to the first 90 days by design. At 500 members an
open-ended offer is two calls every working day, forever.

---

## Downgrade and expiry

Losing a subscription should feel like **losing reach, not losing work**.

| On downgrade or expiry | Behaviour |
|---|---|
| Venture page | Goes unlisted. Never deleted. |
| Rich venture sections | Hidden from public view, retained in the database. |
| Leads | New leads locked. Already-unlocked leads — **policy open**, see below. |
| Connections and messages | Kept. |
| Posts | Kept and still visible. |
| Hosted Coffee Club chapter | Transfers to a co-host or back to WeCos. |
| Founding Member badge | Kept if the seat was ever held. |

**Open policy:** whether previously-unlocked leads stay readable after downgrade.
Revoking is the stronger retention lever; keeping avoids chargebacks and the
perception of a bait-and-switch. Must be stated in the terms up front either way.
Tracked in [DECISIONS.md](DECISIONS.md).
