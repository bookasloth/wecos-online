# ADR 0005 — State Management

**Status:** Accepted · **Date:** 2026-06

## Context

Four kinds of state: server data, client UI state, form state, and shareable view
state (filters, tabs).

## Decision

| Kind | Where | Tool |
|---|---|---|
| Server data | Server components; React Query once a backend exists | `@tanstack/react-query` (installed, unused) |
| Session / mock data | Client store | `zustand` + `persist` |
| Forms | Local | `react-hook-form` + `zod` |
| Shareable view state | URL | `searchParams` |

`zustand` over Redux: less ceremony, no provider, selector-based subscriptions,
and `persist` gave the entire mock data layer almost for free.

## Reasoning

The store exists mainly because there is no backend. Once Supabase lands, most of
it disappears — server data belongs in server components and React Query, not in
a client store. What should remain in zustand is genuinely client-only state.

## Consequences

**Good.** The whole mock layer is one 300-line file with a documented public API,
which made the register → onboard → profile → startup flow interactive with no
infrastructure.

**Bad.** Every screen reading the store is a client component. That is a large
part of why 41 of ~60 files carry `"use client"`.

**Fixed along the way.** `useAppHydrated` originally called `setState` inside an
effect, causing a cascading render on every gated screen. It now uses
`useSyncExternalStore`.

**Rule going forward.** Filters and tabs belong in the URL, not in a store. A
filtered directory view should be linkable — `/startups?category=Technology`
currently is not.
