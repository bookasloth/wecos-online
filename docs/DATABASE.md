# Database

Overview of the data model. Column-level detail is in
[database/schema.md](database/schema.md).

**Status:** ✅ Designed, not implemented · **Last updated:** 2026-07-24

---

## Today

**There is no database.** State lives in `localStorage` via
`src/lib/store/app-store.ts`, and directory content comes from
`src/lib/sample/sample-data.ts`.

Target: **Postgres via Supabase**, with row-level security as the enforcement
boundary.

## The roots

**`user`** and **`venture`**. Everything else hangs off one of them.

```
user ──1:1── profile
  │              └── handle  → the /username URL
  ├──1:1── subscription      → tier, the source of all entitlements
  ├──n:m── venture           via venture_member (founder | cofounder | team)
  ├──1:n── post, comment, vote
  ├──n:m── user              via connection, follow
  └──1:n── lead_unlock, event_rsvp, circle_member

venture
  ├──1:n── venture_section   → products, milestones, traction, funding
  ├──1:n── provider_listing  → one per studio category
  └──1:n── lead
```

## Four decisions worth knowing

**1. `venture_member` is a join table.** A founder can have several ventures; a
venture has co-founders. The mock store has one nullable `startup` field per
user, which hard-codes a 1:1 that reality breaks immediately.

**2. Posts reference the author.** `post.author_id`, not an embedded copy. In the
mock, `authorFromProfile()` denormalises name and avatar into every post, so
renaming yourself leaves stale names on old posts. `post.venture_id` is optional
and is what makes company pages feel alive.

**3. Tiers are not a table.** They live in config as `TIER_FEATURES`; only
per-user overrides are stored. Rationale in
[adr/0004-payment-architecture.md](adr/0004-payment-architecture.md).

**4. WeCos owns every lead.** `lead` rows carry buyer contact details that must
be stripped server-side unless a matching `lead_unlock` exists. This is the
provider business model, not a privacy nicety. See
[prd/CRM_PRD.md](prd/CRM_PRD.md).

## Conventions

- `uuid` primary keys, `gen_random_uuid()`
- `citext` for anything compared case-insensitively (email, handle, slug)
- `timestamptz` always; store UTC, format in the client
- Money in **paise** as `integer`. Never floats
- `created_at` on everything; `updated_at` where mutable
- Enums as Postgres enums where the set is stable, `text` + check where not
- Soft delete only where a user would notice — otherwise delete

## Enforcement

RLS is the real boundary. Application checks are a convenience; assume the server
has a bug. Policies go in [database/rls-policies.md](database/rls-policies.md),
written **before** the tables are created.

## Open questions

1. **Are `profile.handle` and `venture.slug` mutable?** Both are public URL keys
   derived from user input. Freeze after creation, or keep a redirect table.
2. **ORM or the Supabase client directly?** Undecided. See
   [TECH_STACK.md](TECH_STACK.md).
3. **Marketplace tables** are unmodelled — the deck sizes it at ₹1.5L, which does
   not justify schema until the rest is live.
