# Roadmap

Build order. Sequenced by what unblocks what, not by what is most exciting.

**Last updated:** 2026-07-24

---

## Now — foundation

| | Why now |
|---|---|
| **Entitlement layer** | Forty features gate on it. Written per-feature, the rules drift out of sync with the pricing page within weeks. See [NEXT_TASK.md](NEXT_TASK.md) |
| **`/membership` marketing page** | Currently "coming soon", and it is the CTA target of every Studios page. The biggest revenue surface is a dead end |
| **Fix or rename the feed's "Following" tab** | Ten minutes; stops shipping a broken promise |

## Next — the founder experience

| | Why |
|---|---|
| **Editable venture page** | In-place editing so a founder's page can be filled in. Fixes the biggest disappointment in the product |
| **Notifications** | Highest retention-per-line-of-code available. Community cannot compound without it |
| **Onboarding: city + "what do you need help with"** | One screen. Unlocks Coffee Club matching and captures the Studios lead signal at peak intent |
| **Connections and follows** | The Network tier has nothing to sell without them |

## Then — the backend

Everything above still runs on the mock store. This is where that ends.

| | |
|---|---|
| **Supabase auth** | Real sessions, middleware gating, password reset |
| **Core schema + RLS** | [database/schema.md](database/schema.md). RLS is the real boundary, not application code |
| **Migrate the mock store** | Swap action bodies for Supabase calls; screens should not change |
| **Razorpay** | Subscriptions, renewals, credit purchases |

## Then — the provider business

| | |
|---|---|
| **Provider listings + vetting queue** | The ₹1,299 gate |
| **Lead masking, unlock, credits** | [prd/CRM_PRD.md](prd/CRM_PRD.md) |
| **Provider lead inbox and in-platform threads** | |
| **Admin tools** | Lead ops, member management |

## Later

Circles and city spaces · events and Coffee Club hosting · marketplace · ad
inventory · partner perks · Validation Engine · bootcamps · analytics.

## Cross-cutting debt

Carried alongside, not deferred forever. Full list in
[KNOWN_ISSUES.md](KNOWN_ISSUES.md) and [FRONTEND_AUDIT.md](FRONTEND_AUDIT.md) §14.

- `next/image` migration (22 raw `<img>`) — own PR, needs visual review
- Split `company-page.tsx` (1,378 lines)
- Move six client-rendered marketing pages to server components
- First tests: entitlement matrix and the enquiry endpoint
- Resolve `wecos.in` vs `wecos.in`
- Add the five document PDFs, or remove the document picker
