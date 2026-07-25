# ADR 0003 — Database Design

**Status:** Accepted, not implemented · **Date:** 2026-07

## Context

The mock store hard-codes one profile and at most one startup per user, embeds a
copy of the author into every post, and keeps membership at the store root
attached to nothing. All three break on contact with reality.

## Decision

A relational Postgres model. Full detail in
[database/schema.md](../database/schema.md). The four decisions that matter:

**1. `user` and `venture` are the roots.** `profile` is 1:1 with `user`;
everything else hangs off one of the two.

**2. `venture_member` is a join table.** A founder can have several ventures; a
venture has co-founders. The mock's single nullable `startup` field encodes a 1:1
that reality breaks immediately.

**3. Posts reference the author, they do not embed them.** `post.author_id`, not
a denormalised copy. In the mock, renaming yourself leaves stale names on every
old post. `post.venture_id` is optional and is what makes company pages feel
alive.

**4. Tiers live in config, not the database.** Only `entitlement_override` rows
are stored. See [ADR 0004](0004-payment-architecture.md).

## Reasoning

The data is relational: members, ventures, leads, events, subscriptions. Postgres
plus RLS gives both the model and the enforcement boundary. The deck's scale
target — ~100k users — is comfortably Postgres-native.

## Consequences

**Good.** Co-founders, multiple ventures, and honest author attribution all
become possible. RLS gives a real security boundary.

**Bad.** The mock-to-real migration is not purely mechanical: the 1:1 assumptions
are baked into component props in places.

**Unresolved.** `profile.handle` and `venture.slug` are public URL keys derived
from mutable user input. Either freeze them after creation or keep a redirect
table — renaming currently breaks every inbound link. Must be decided before
launch.
