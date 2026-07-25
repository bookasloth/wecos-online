# ADR 0001 — Project Setup

**Status:** Accepted · **Date:** 2026-06 · **Supersedes:** —

## Context

Greenfield build for WeCos: a marketing site, a public directory, and a
signed-in product, all needing strong SEO and fast iteration by a small team.

## Decision

Next.js 16 (App Router) · React 19 · TypeScript strict · Tailwind v4 ·
shadcn-style components on `@base-ui/react`, vendored into the repo.

## Reasoning

- **SEO is load-bearing.** The deck plans 25k organic visitors as the largest
  traffic channel. Server rendering is not optional.
- One framework serves marketing pages, directory pages and the app.
- Tailwind v4's CSS-first config lets the whole design system be semantic tokens
  in one file.
- Vendored components over a component library: we own them, we can edit them,
  and there is no upgrade treadmill.

## Consequences

**Good.** `tsc --noEmit` is clean with no `any` in `src`. The token layer has
light/dark parity from day one. Static generation across 45 routes.

**Bad.** Next 16 differs enough from training data and older tutorials that
`node_modules/next/dist/docs/` must be read before writing code — this is
enforced in `AGENTS.md`.

**Watch.** 41 of ~60 files are client components, more than needed. See
[ARCHITECTURE.md](../ARCHITECTURE.md).
