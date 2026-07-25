# ADR 0002 — Auth Strategy

**Status:** Accepted, not implemented · **Date:** 2026-06

## Context

The product needs accounts, four membership tiers, private data (leads, messages)
and public profiles. The build began UI-first with no backend so screens could be
designed before infrastructure.

## Decision

**Supabase** for authentication and Postgres. Until it is wired, a **clearly
labelled mock** in `src/lib/store/app-store.ts`.

Final shape: Supabase Auth (email + password, magic link later) · session in an
httpOnly cookie via `@supabase/ssr` · route gating in Next middleware · data
access enforced by **row-level security**.

## Reasoning

- Auth, Postgres, storage and realtime in one service suits a small team.
- RLS pushes enforcement into the database, so an application bug is not
  automatically a data breach.
- The deck already commits to Supabase (Realtime for notifications).

## The mock, and its limits

The mock persists session, profile and startup to `localStorage`. It has **no
password check, no server, no session token**. Anyone can edit localStorage and
become anyone. `RequireAuth` is a UX affordance, not a gate.

Every mock carries a `⚠️ MOCK` comment. Store actions were written with the
signatures the real ones will have, so migration should be swap-the-body.

## Consequences

**Good.** The full register → onboard → profile → startup flow was designed and
tested without infrastructure.

**Bad.** Nothing is secure. **This must not ship with real user data.**

**Migration risk.** Handles are currently generated from the email prefix with no
uniqueness check — `shubham@a.com` and `shubham@b.com` collide. Real auth needs a
unique index on `profile.handle` and a claim flow.
