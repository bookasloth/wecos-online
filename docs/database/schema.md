# Database — Schema

**Status:** ✅ Proposed, not yet implemented · **Last updated:** 2026-07-24

Target: Postgres via Supabase. Nothing here exists yet — the app currently runs
on a localStorage mock store (`src/lib/store/app-store.ts`).

Notation: `pk` primary key, `fk→` foreign key, `?` nullable, `[]` array,
`uq` unique. Every table gets `created_at timestamptz default now()` and, where
mutable, `updated_at`.

---

## Identity & access

```
user
  id            uuid pk
  email         citext uq not null
  phone         text?
  status        enum(active, suspended, deleted)
  created_at

profile                          -- 1:1 with user
  user_id       uuid pk fk→user
  handle        citext uq not null      -- the /username URL. See ROUTING.md
  name          text not null
  headline      text?
  bio           text?
  avatar_url    text?
  location      text?
  city_id       fk→city ?               -- drives Coffee Club matching
  skills        text[]
  links         jsonb                   -- [{label, href}]
  open_to       text[]
  visibility    enum(public, members, private) default public

subscription
  id            uuid pk
  user_id       fk→user
  tier          enum(free, network, venture, circle)
  status        enum(active, past_due, cancelled, expired)
  started_at    timestamptz
  renews_at     timestamptz
  cancelled_at  timestamptz?
  price_paid    integer                 -- paise, what they actually paid
  uq(user_id) where status = 'active'

founding_member
  user_id       uuid pk fk→user
  seat_no       integer uq              -- 1..500
  granted_at
  price_locked  integer                 -- their rate, honoured on renewal

entitlement_override                    -- comps, staff, manual grants
  user_id       fk→user
  capability    text
  granted_by    fk→user
  expires_at    timestamptz?
  uq(user_id, capability)

payment
  id            uuid pk
  user_id       fk→user
  purpose       enum(subscription, lead_unlock, ad, event, studio)
  ref_id        uuid?                   -- polymorphic target
  gateway       text                    -- 'razorpay'
  gateway_ref   text uq
  amount        integer                 -- paise
  status        enum(created, paid, failed, refunded)
```

**Tiers themselves are not a table.** They live in config as a `TIER_FEATURES`
map. Only *overrides* are stored. See [AUTHORIZATION.md](../AUTHORIZATION.md) for
why.

## Network

```
connection
  requester_id  fk→user
  addressee_id  fk→user
  status        enum(pending, accepted, blocked)
  created_at
  pk(requester_id, addressee_id)
  -- enforce a canonical ordering or a uq on the sorted pair to stop duplicates

follow
  follower_id   fk→user
  followee_id   fk→user
  pk(follower_id, followee_id)

message_thread
  id            uuid pk
  kind          enum(direct, lead)
  lead_id       fk→lead ?

thread_participant
  thread_id     fk→message_thread
  user_id       fk→user
  pk(thread_id, user_id)

message
  id            uuid pk
  thread_id     fk→message_thread
  sender_id     fk→user
  body          text
  read_at       timestamptz?

profile_view
  viewer_id     fk→user
  profile_id    fk→user
  viewed_at
  -- powers "who viewed your profile" (Network+)

usage_counter                           -- enforces free-tier quotas
  user_id       fk→user
  metric        text                    -- 'connection_request'
  period        date                    -- month bucket
  count         integer
  pk(user_id, metric, period)
```

## Content

```
post
  id            uuid pk
  author_id     fk→user                 -- a reference, NOT an embedded copy
  venture_id    fk→venture ?            -- attributes the post to a company
  circle_id     fk→circle ?
  kind          enum(text, question, win, poll, quiz, photo, video, quote)
  content       jsonb
  topic         text?
  score         integer default 0
  created_at

comment
  id            uuid pk
  post_id       fk→post
  parent_id     fk→comment ?
  author_id     fk→user
  body          text
  score         integer default 0

vote
  user_id       fk→user
  target_type   enum(post, comment)
  target_id     uuid
  value         smallint                -- -1 | 1
  pk(user_id, target_type, target_id)

bookmark
  user_id       fk→user
  post_id       fk→post
  pk(user_id, post_id)

notification
  id            uuid pk
  user_id       fk→user                 -- recipient
  kind          text
  actor_id      fk→user ?
  target_type   text
  target_id     uuid
  read_at       timestamptz?
```

The mock store denormalises the author into every post
(`authorFromProfile()`), so renaming yourself leaves stale names on old posts.
The schema fixes this with `author_id`.

## Ventures

```
venture
  id            uuid pk
  slug          citext uq
  name          text not null
  tagline       text?
  description   text?
  logo_url      text?
  industry      text?
  stage         text?
  website       text?
  location      text?
  listed        boolean default false   -- the ₹1,299 gate
  listed_at     timestamptz?
  owner_id      fk→user

venture_member
  venture_id    fk→venture
  user_id       fk→user
  role          enum(founder, cofounder, team)
  pk(venture_id, user_id)

venture_section
  id            uuid pk
  venture_id    fk→venture
  kind          enum(product, milestone, traction, funding, team, link)
  position      integer
  data          jsonb

venture_view
  venture_id    fk→venture
  day           date
  count         integer
  pk(venture_id, day)
```

`venture_member` is the join that makes co-founders possible. The mock store has
one nullable `startup` field per user, which hard-codes a 1:1 that reality breaks
immediately.

## Studios, providers & leads

See [prd/CRM_PRD.md](../prd/CRM_PRD.md) for the business logic. WeCos's own
studios and their packages stay in config; only member listings are rows.

```
provider_listing
  id                uuid pk
  venture_id        fk→venture
  studio_slug       text                -- marketing | hr | finance | legal | …
  pitch             text
  packages          jsonb
  status            enum(draft, pending, approved, rejected, suspended)
  featured          boolean default false
  approved_at       timestamptz?
  reviewed_by       fk→user ?
  uq(venture_id, studio_slug)

lead
  id                uuid pk
  source            enum(wecos_studio, provider, venture)
  studio_slug       text?
  provider_listing_id fk→provider_listing ?
  venture_id        fk→venture ?
  buyer_user_id     fk→user ?
  buyer_name        text                -- ⚠ never leaves the server unmasked
  buyer_email       citext              -- ⚠
  buyer_phone       text?               -- ⚠
  need              text
  budget_band       text
  city              text?
  company_type      text?
  status            enum(new, unlocked, in_progress, won, lost)
  created_at

lead_unlock
  lead_id           fk→lead
  provider_listing_id fk→provider_listing
  user_id           fk→user
  unlocked_at
  cost_inr          integer
  source            enum(included_credit, paid)
  pk(lead_id, provider_listing_id)

credit_balance
  user_id           fk→user
  period            date                -- month bucket
  included          integer
  used              integer
  purchased         integer
  pk(user_id, period)
```

**The critical rule:** `buyer_name`, `buyer_email`, `buyer_phone` must be
stripped **server-side** unless a matching `lead_unlock` exists. A masked lead
whose email is present in the JSON payload is not masked, and that single mistake
gives away the entire provider business model.

## Community & events

```
city
  id            uuid pk
  slug          citext uq
  name          text
  active        boolean

circle
  id            uuid pk
  slug          citext uq
  name          text
  kind          enum(topic, city)
  city_id       fk→city ?
  created_by    fk→user

circle_member
  circle_id     fk→circle
  user_id       fk→user
  role          enum(member, moderator)
  pk(circle_id, user_id)

chapter                                 -- a Coffee Club chapter
  id            uuid pk
  city_id       fk→city
  host_user_id  fk→user ?
  status        enum(proposed, active, paused)

event
  id            uuid pk
  host_id       fk→user
  chapter_id    fk→chapter ?
  title         text
  starts_at     timestamptz
  venue         text?
  capacity      integer?
  price_inr     integer
  free_for      text[]                  -- tiers with free entry
  status        enum(draft, published, cancelled, done)

event_rsvp
  event_id      fk→event
  user_id       fk→user
  status        enum(going, waitlist, cancelled)
  paid          boolean
  ticket_ref    text?
  pk(event_id, user_id)
```

## Commerce & access

```
ad_slot
  id            uuid pk
  placement     text
  starts_on     date
  ends_on       date
  price_inr     integer
  status        enum(available, booked)

ad_purchase
  id            uuid pk
  slot_id       fk→ad_slot
  venture_id    fk→venture
  creative      jsonb
  status        enum(pending, live, ended, rejected)

partner_perk
  id            uuid pk
  brand         text
  description   text
  min_tier      text
  redemption    enum(code, link, manual)

perk_redemption
  perk_id       fk→partner_perk
  user_id       fk→user
  code          text?
  redeemed_at
  pk(perk_id, user_id)

founder_call
  id            uuid pk
  user_id       fk→user
  requested_at
  scheduled_at  timestamptz?
  status        enum(requested, scheduled, done, expired)
  -- eligibility: subscription.started_at + 90 days, tier >= venture

resource
  id            uuid pk
  kind          enum(blog, template, recording, masterclass)
  slug          citext uq
  min_tier      text
```

---

## Open questions

1. **Handle and slug immutability.** Both are public URL keys derived from
   mutable input. Either freeze them after creation or keep a redirect table.
   Decide before launch — see [ROUTING.md](../ROUTING.md).
2. **Unlocked leads after downgrade** — readable or revoked? See
   [FEATURES.md](../FEATURES.md).
3. **Marketplace tables** are not modelled yet; the deck sizes it at ₹1.5L,
   which does not justify schema until the rest is live.

## Next steps

- Row-level security is the real enforcement boundary, not application code.
  Draft in [rls-policies.md](rls-policies.md) before any table is created.
- Index plan in [indexes.md](indexes.md).
- Migration conventions in [migrations.md](migrations.md).
