# Design System

Tokens, scale and component contracts.

**Status:** ✅ Current · **Last updated:** 2026-07-24

> The **direction** — why the system looks the way it does, and the auth0.com
> analysis behind it — lives in [UI_UX_GUIDE.md](UI_UX_GUIDE.md). Read that
> before designing anything. This file is the contract.

---

## Source of truth

`src/app/globals.css`. Semantic tokens with full light/dark parity.

**Never hardcode a colour.** No hex, no `purple-700`, no raw `rgba()` in a
component. If a value is missing, add a token.

## Colour roles

| Token | Role |
|---|---|
| `background` / `foreground` | Page surface and primary text |
| `card` / `card-foreground` | Raised surface |
| `muted` / `muted-foreground` | Secondary surface and secondary text |
| `primary` / `primary-foreground` | Brand purple. **One purple moment per screen** |
| `accent` / `accent-foreground` | Tinted highlight |
| `border` · `input` · `ring` | Edges and focus |
| `destructive` · `success` · `warning` · `info` | Semantic states |
| `brand` · `brand-gold` · `brand-indigo` | Gradients and highlights |
| `chart-1…5` | Data visualisation |

The dark foreground is a **warm** white (`#F4F2EE`), not pure white. Keep it —
pure white on a dark surface reads clinical.

## Type

| Token | Size / line-height | Weight | Use |
|---|---|---|---|
| `text-3xs` | 10px | 500 | Micro-labels |
| `text-2xs` | 11px | 500 | Badges, eyebrows, metadata |
| `text-sm` | 14px / 28px | 400 | Dense UI |
| `text-base` | 16px / 26px | 400 | UI default |
| `text-lg` | 18px / 32px | 400 | Article prose |
| `text-xl` | 20px / 32px | 500 | Card titles |
| `text-3xl` | 32px | 400 | Sub-section |
| `text-4xl` | 40px / 48px | 400 | Section title |
| `text-5xl` | 48px+ | 400 | Page hero |

**Weight 400 on everything large.** Bold display type reads as shouting; regular
weight at size reads as confident. This is the single biggest stylistic rule.

Weights available: 400 body and display · 500 buttons, nav, card titles,
eyebrows · 700 tiny uppercase labels only. 600 is loaded but should not be used.

Never below 1.5 line-height on running text; never above 1.3 on display.

## Radius

| Element | Radius |
|---|---|
| Button, input, select, chip | **4px** |
| Small badge | 6px |
| Card, panel, modal | 8–12px |
| Media card | 16px |
| Avatar | full |

⚠️ Existing code still uses `rounded-xl` (14px) and `rounded-2xl` (18px) on
controls. New work should use 4px; migrate opportunistically.

## Elevation

**Borders, not shadows.** Default to `border border-border`. Reach for a shadow
only when something genuinely floats — modal, dropdown, toast.

`--shadow-card` / `--shadow-card-hover` exist for marketing cards. Dark mode
drops the purple tint for neutral black; a purple-tinted shadow on a dark surface
reads as a smudge.

Card hover is a **border colour change** (`hover:border-primary/40`), optionally
with `-translate-y-0.5`. Not a bigger shadow.

## Spacing

4px base. Use only `4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128`.

| Context | Value |
|---|---|
| Inside a chip | `2px 6px` |
| Inside a button | `12px 32px` |
| Inside a card | `24px` or `32px` |
| Grid gap | `24px` (3-col) / `32px` (2-col) |
| Heading → paragraph | `16px` |
| Paragraph → next heading | `64px` |
| Between sections | `96px` desktop / `64px` mobile |

## Widths

Max content `1136px` · wide `1265px` · **prose `747px` (~68ch)** · sidebar
`300px` · modal `448px`.

Never let running text exceed ~70ch.

## Components

`src/components/ui/` — reuse these, do not reinvent.

| | Notes |
|---|---|
| `button` | `default` · `outline` · `secondary` · `ghost` · `destructive` · `link`. Sizes run small; pages add explicit heights |
| `input` · `textarea` · `label` | Always pair with `components/form/field` |
| `card` · `badge` · `avatar` · `tabs` · `dialog` · `dropdown-menu` | |
| **`modal`** | **Use this for every dialog.** Has `role="dialog"`, `aria-modal`, focus trap, focus restore, Escape, scroll lock. Do not hand-roll another `fixed inset-0` overlay |
| Unused | `accordion`, `alert`, `navigation-menu`, `separator`, `sheet`, `skeleton` |

⚠️ `sheet` and `navigation-menu` exist **and** were reimplemented by hand in
`site-header.tsx`. Pick one.

## Motion

200–300ms, `ease-out`, transform and opacity only. Never animate `width`,
`height`, `top` or `left`. `prefers-reduced-motion` is handled globally — do not
bypass it.

## Before you ship

Full checklist at the end of [UI_UX_GUIDE.md](UI_UX_GUIDE.md).
