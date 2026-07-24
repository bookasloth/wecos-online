# WeCos UI/UX Guide

**Read this before designing or building any screen.** It is the standing design
brief for this project. When it conflicts with a one-off request, the request wins —
but say so out loud, so the guide gets updated instead of quietly ignored.

Reference direction: **auth0.com**, with **bookasloth.com** as the editorial
reference. Every number in §2–§5 was measured from the live Auth0 site on
2026-07-24 (computed styles, not eyeballed), then translated into decisions that
fit WeCos's existing token system. Full-page captures of the Auth0 home and
pricing pages and a Book A Sloth article were reviewed visually on the same date.

> **Structure lives in [COMPONENTS.md](COMPONENTS.md)** — the five-layer
> architecture, the section library, and which template each route uses. Read
> that before building; read this before designing.

---

## 0. TL;DR for a new session

1. **Dark-first, flat, bordered.** Deep surfaces, `1px` borders instead of shadows.
2. **Big display type at weight 400–500.** Never `font-bold` on a hero.
3. **Radius `4px` for controls, `8–16px` for cards.** No `rounded-2xl` on buttons.
4. **Line-height is generous** — body `18px/32px`, small text `14px/28px`.
5. **Eyebrow + heading + one paragraph** is the section header pattern. Uppercase, `1px` tracking, muted.
6. **Content width `1136px`; prose column `747px` (~68ch).** Never full-bleed text.
7. **Spacing is a 4px scale, section rhythm is 64px / 96px / 128px.**
8. **Borders separate; color emphasizes.** Purple is for one thing per screen.

---

## 1. Can we build this? — honest answer

**Yes, and the gap is smaller than it looks.** WeCos already has the hard part: a
proper semantic token layer in [`src/app/globals.css`](../src/app/globals.css) with
light/dark parity, a brand purple, and a self-hosted geometric sans. What Auth0 has
that WeCos doesn't is *restraint* — fewer weights, fewer radii, almost no shadows,
and much more whitespace.

Four things you should know before committing:

### 1.1 The fonts are not free
Auth0 uses **Aeonik** (marketing pages) and **fakt-web** (blog + platform pages).
Aeonik is commercial — [CoType Foundry](https://cotypefoundry.com/our-fonts/aeonik-pro/),
web licence sold separately, [from ~$63 for the variable cut](https://cotypefoundry.com/licensing).
Fakt (OurType) is likewise commercial. **We cannot copy the typeface.**

Recommendation: **keep Open Sauce Sans.** It is already self-hosted, already the
WeCos brand face, and sits in the same geometric-grotesque family as Aeonik. The
Auth0 *feel* comes from weight, size and line-height discipline — not from the
specific typeface. If you ever want a closer match, the free options are
**General Sans** or **Switzer** (Fontshare), or **Schibsted Grotesk** (Google Fonts).

### 1.2 Auth0 is actually two design systems
| | Marketing (`/pricing`, `/customers`) | Editorial (`/blog`, `/platform/*`) |
|---|---|---|
| Background | `#120021` deep purple | `#111111` neutral near-black |
| Display font | Aeonik | fakt-web + Aeonik headings |
| Card radius | `0px` (flat, border-separated) | `16px` |
| Feel | Brand-forward, saturated | Neutral, content-forward |

Copying both means maintaining both. **Pick one.** For WeCos the neutral-editorial
system (`#111`-family) scales better across marketing + app + feed, and the brand
purple stays as an accent rather than a wash. That is the direction this guide takes.

### 1.3 `community.auth0.com` is stock Discourse
It is not a designed surface — it is an off-the-shelf forum in its default dark
theme (Inter, `#1E212A`, `#908BFF` accent, 56px table rows, Topic/Replies/Views/Activity
columns). It is a **row-dense Q&A table**, not a social feed.

WeCos's feed is a card-based social feed with votes, comments, polls and quizzes.
Those are different products. Take the *density and scannability* from Discourse;
do **not** replace the existing feed model with a forum table without an explicit
product decision.

### 1.4 Book A Sloth is the editorial reference — and it disagrees on weight

Your own product, and structurally stronger than Auth0 for long-form. Worth
taking: the **split hero** (solid colour panel + visual, 50/50, edge to edge),
the **meta row** (`PUBLISHED / AUTHOR / READ` as uppercase labels above values),
**callout boxes**, **pull-quotes** with a left accent border, and **FAQ as native
`<details>` rows**.

But it sets display type **bold**, where Auth0 sets it **400**. Opposite answers,
both correct in context. WeCos cannot be both — see §3.1 and
[COMPONENTS.md](COMPONENTS.md) for the recommendation and the decision.

Worth fixing if we borrow from it: the light nav on a dark body creates a hard
seam at the top of every page.

### 1.5 WeCos is currently light-first
Today's default is cream `#FBFAF8`. Auth0 is dark-only. Going dark-first is the
single biggest visual change in this whole direction, and it touches every screen.
Decide it deliberately — see §9.

---

## 2. Color

### 2.1 What Auth0 actually uses (measured)

| Role | Marketing | Editorial |
|---|---|---|
| Page background | `#120021` | `#111111` |
| Elevated surface | `#120024` / `#20003A` | `#1E1E1E` |
| Alternating band | — | `#171717` (96% alpha) |
| Deepest well | `#08001A` | `#000000 / 33%` |
| Primary text | `#FFFEFA` (warm white, **not** pure) | `#FFFFFF` |
| Body text | — | `#E5E5E5` |
| Muted text | `#ABABAB` | `#ABABAB` |
| Brand accent | `#D4A1FF` lavender | `#B49BFC` |
| Secondary accent | `#EBD3FF` pale lavender | — |
| Link | `#0A84AE` teal | `#99A7F1` periwinkle |
| Border | `#B49BFC`, `rgba(247,240,255,.2)` | `rgba(255,255,255,.1)` |

Two observations worth stealing:

- **The white is warm** — `#FFFEFA`, not `#FFFFFF`. It stops dark screens feeling
  clinical. WeCos already does this (`--foreground: #F4F2EE` in dark). Keep it.
- **Purple is never a large fill.** It appears as a *text* color, a *border*, and a
  10%-alpha wash. The big buttons are **white on dark**, not purple.

### 2.2 WeCos tokens — what to change

Keep every existing token name. These are the value/usage changes:

```css
/* globals.css — .dark, the new default */
--background:      #111113;  /* was #0E1011 — slightly warmer neutral */
--card:            #1A1A1D;  /* elevated surface */
--muted:           #202024;  /* alternating band */
--foreground:      #FFFEFA;  /* warm white, matches Auth0's trick */
--muted-foreground:#ABABAB;  /* raise from #9BA1A1 — more contrast */
--border:          rgba(255, 255, 255, 0.10);
--primary:         #9333FF;  /* unchanged — WeCos purple stays WeCos purple */
--accent-foreground:#D4A1FF; /* lavender for accent *text* */
```

**Usage rules (these matter more than the values):**

- 🟣 **One purple moment per screen.** A single primary CTA, or an accent border on
  the one card that matters. If two things are purple, neither reads as important.
- ⬜ **Primary CTA is white-on-dark**, purple is the *secondary* emphasis. This is
  Auth0's actual hierarchy and it is why their pages feel calm.
- 🚫 **Never a purple-tinted shadow.** Already fixed in `--card-shadow`; keep it.
- 🎨 **Category colors are allowed and encouraged** — Auth0's blog gives each topic
  its own hue (`#E991B0` announcements, `#B49BFC` identity, `#62C0EB` AI) on a
  shared `rgba(0,0,0,.33)` chip. Do the same for WeCos studios/topics. Colors carry
  meaning; they are not decoration.

---

## 3. Typography

### 3.1 The single most important rule

**Auth0 sets every heading at weight 400.** `h1` 96px/96px/400. `h2` 40px/48px/400.
`h3` 32px/44px/400. Only small utility labels go to 700.

WeCos currently uses `font-bold` on essentially every heading. **Stop.** Large text
at regular weight reads as confident; large text at bold reads as shouting. This one
change does more for the "Auth0 feel" than the color palette does.

### 3.2 Scale

Measured from Auth0, mapped to Tailwind:

| Token | Size / line-height | Weight | Use |
|---|---|---|---|
| `display-xl` | `96px / 96px` (1.0) | 400 | Page-owning hero — `/customers` style. One per site section. |
| `display-lg` | `64px / 72px` (1.13) | 400 | Feature landing hero |
| `display` | `48px / 56px` (1.17) | 500 | Article title |
| `h1` | `44px / 56px` (1.27) | 400 | Standard page title |
| `h2` | `40px / 48px` (1.2) | 400 | Section title |
| `h3` | `32px / 44px` (1.38) | 400 | Sub-section |
| `h4` | `20px / 32px` (1.6) | 500 | Card title |
| `body-lg` | `18px / 32px` (1.78) | 400 | **Article prose** |
| `body` | `16px / 26px` (1.63) | 400 | UI default |
| `body-sm` | `14px / 28px` (2.0) | 400 | Dense UI, metadata |
| `eyebrow` | `14px / 20px`, `ls 1px`, uppercase | 500 | Section kicker |
| `caption` | `12px / 16px` | 500 | Timestamps, counts |

Add to `@theme` in `globals.css`:

```css
--text-display-xl: 6rem;   --text-display-xl--line-height: 1;
--text-display-lg: 4rem;   --text-display-lg--line-height: 1.125;
--text-display:    3rem;   --text-display--line-height: 1.1667;
```

Mobile: clamp display sizes down hard. `display-xl` → `48px`, `display-lg` → `36px`,
`h1` → `32px`. Use `clamp()` rather than breakpoint jumps.

### 3.3 Line-height is the secret

Auth0's most-used style is `14px / 28px` — a **2.0 ratio** on small text. Their
article body is `18px / 32px` (1.78). WeCos currently uses Tailwind defaults
(~1.5). Loosening body line-height is free and instantly reads as more premium.

**Never go below 1.5 on running text. Never above 1.3 on display type.**

### 3.4 Weight ladder

Only four weights. Open Sauce Sans is loaded at 400/500/600/700 — that is already
one too many.

| Weight | Use |
|---|---|
| 400 | All display + all body. The default for almost everything. |
| 500 | Buttons, nav links, eyebrows, card titles, emphasis |
| 700 | Tiny uppercase labels only (`14px` and below) |
| 600 | **Don't.** Delete it from the font imports if nothing uses it. |

---

## 4. Space, radius, elevation

### 4.1 Radius — much tighter than WeCos uses today

Measured frequency on `/pricing`: `4px` × 41, `12px` × 20, `8px` × 18, `24px` × 4.
On `/customers`, cards are `0px`.

| Element | Radius |
|---|---|
| Button, input, select, chip | **`4px`** |
| Small badge / category pill | `6px` |
| Card, panel, modal | `8px` or `12px` |
| Blog / media card | `16px` |
| Avatar | `100%` |
| Big feature panel | `24px` max |

WeCos currently uses `rounded-xl` (14px) and `rounded-2xl` (18px) on buttons and
inputs. **That is the second-biggest visual difference after font weight.** Tighten
controls to `4px`; keep cards soft.

```css
--radius: 0.25rem;  /* 4px base — controls */
/* cards use explicit rounded-lg / rounded-xl, not the control default */
```

### 4.2 Elevation — borders, not shadows

The entire `/pricing` page uses **one** box-shadow. One. Everything else is
separated by a `1px` border or a background-value step.

**Rule: default to `border border-border`. Reach for a shadow only when something
genuinely floats above the page — a modal, a dropdown, a toast.** The
`--shadow-card` / `--shadow-card-hover` tokens exist for the marketing cards that
already use them; do not add new shadow variants.

Hover state for a card is a **border color change** (`hover:border-primary/40`),
optionally with a `-translate-y-0.5`. Not a bigger shadow.

### 4.3 Spacing scale

4px base. Use only: `4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128`.

| Context | Value |
|---|---|
| Inside a chip | `2px 6px` |
| Inside a button | `12px 32px` (measured on Auth0's primary CTA) |
| Inside a card | `24px` or `32px` |
| Between cards in a grid | `24px` (3-col) / `32px` (2-col) |
| Heading → its paragraph | `16px` |
| Paragraph → next heading | `64px` (article), `48px` (marketing) |
| Between page sections | `96px` desktop / `64px` mobile |
| Hero top/bottom | `128px` desktop / `80px` mobile |

Article headings measured on Auth0: `margin-top: 64px; margin-bottom: 24px`. That
asymmetry — big space above, small space below — is what makes long-form scannable.
Copy it exactly.

### 4.4 Layout widths

| Container | Width |
|---|---|
| Max content | `1136px` |
| Wide/feature section | `1265px` |
| **Prose column** | **`747px`** (~68 characters) |
| Sidebar (directory filters) | `300px` |
| Modal | `448px` (`max-w-md`) |

Grid: 12 columns, `32px` gutter. Card grids are 3-up at `~357px` or 2-up at
`~552px`. Gutters `24px` (3-up) / `32px` (2-up).

**Never let running text exceed ~70ch.** The blog article measured exactly `747px`
inside a `1265px` viewport — they deliberately waste half the screen. Do the same.

---

## 5. Components

### 5.1 Button

```
Primary    bg-foreground text-background   4px radius  12px 32px  18px/28px  w500
Secondary  border border-border, transparent bg, same metrics
Ghost      no border, text only, hover:text-foreground
```

Note: **primary is white-on-dark, not purple.** Purple is reserved (§2.2).
Letter-spacing on the CTA measured `0.12px` — a hair of tracking on 18px text.

Sizes: `sm` 14px/`8px 16px` · `md` 16px/`10px 24px` · `lg` 18px/`12px 32px`.

### 5.2 Card

```
bg-card  border border-border  rounded-lg  p-6 (24px) or p-8 (32px)
hover: border-primary/40  transition-colors duration-200
no shadow
```

Structure top-to-bottom: media (16:9) → eyebrow/category chip → title (`h4`, 20/32,
w500) → 2-line description (`body-sm`, muted, `line-clamp-2`) → meta row (`caption`,
muted) → optional action pinned to the bottom with `mt-auto`.

### 5.3 Category chip

```
bg-black/33  rounded-[6px]  px-1.5 py-0.5  text-2xs  tracking-[0.15px]
color: per-category hue
```

Each topic gets a stable hue. Define them once in `config/site.ts` next to the
studios list, so the chip color is data, not a class scattered across pages.

### 5.4 Section header

The pattern, everywhere:

```tsx
<p className="text-2xs font-medium uppercase tracking-[1px] text-muted-foreground">
  Eyebrow
</p>
<h2 className="mt-3 text-[40px]/[48px] font-normal">Section title</h2>
<p className="mt-4 max-w-[560px] text-body text-muted-foreground">
  One sentence. Not three.
</p>
```

### 5.5 Input

```
bg-transparent  border border-border  rounded-[4px]  px-4 py-3  text-body
focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/50
```

Never `outline-none` without a replacement ring — already fixed project-wide, keep
it that way.

### 5.6 Modal

Use [`src/components/ui/modal.tsx`](../src/components/ui/modal.tsx). It already has
`role="dialog"`, `aria-modal`, focus trap, Escape, scroll lock and focus
restoration. **Do not hand-roll another `fixed inset-0` overlay.**

### 5.7 Table / list row (feed, directories)

From Discourse: `56px` row height, `16px` vertical padding, `1px` bottom border,
title `18px/22px` **weight 400**, `24px` circular avatar, right-aligned numeric
columns in muted `caption`.

---

## 6. Page archetypes

### 6.1 Feature landing — model: [`/platform/login-security`](https://auth0.com/platform/login-security)

```
Hero            eyebrow · h1 64/72 w400 · 1 paragraph · 2 CTAs (white primary, ghost secondary)
Value trio      3-col grid, 64px gap, icon + h3 + 2 lines
Deep sections   alternating bg (#111 / #171717), each: eyebrow · h2 · copy · visual
                Auth0 stacks 11 of these on one page — one feature each, no fear of length
Proof           logo wall or metric row
CTA             full-width band, centered, single button
```
Applies to: `/membership`, `/validate`, `/studios/[slug]`.

### 6.2 Customer/showcase index — model: [`/customers`](https://auth0.com/customers)

```
Hero            h1 at display-xl (96/96) — just a phrase. "You're in great company."
Logo wall       4-col grid, monochrome logos, generous padding
Story grid      3-col, flat cards, 32px padding, border-separated (gap 0 + dividers)
CTA band
```
Applies to: `/startups`, `/founders`, `/studios`.

### 6.3 Blog index — model: [`/blog`](https://auth0.com/blog/)

```
Featured post   full-width card, 16px radius, large image, category chip
Post grid       2-col, 32px gap, borderless cards: image → chip → h3 → excerpt → author + date
Filters         category chips, horizontally scrollable on mobile
```

### 6.4 Article — model: [`/blog/aspnet-web-api-authorization`](https://auth0.com/blog/aspnet-web-api-authorization)

```
Title           48/56 w500, mt-4 mb-4
Byline          avatar + name + date + read time, caption size, muted
Cover image     full prose width, 16px radius
Prose           747px column, 18px/32px, #E5E5E5
  h2            40/48 w400, mt-64 mb-24
  h3            32/44 w400, mt-64 mb-24
  p             mb-14
  a             #99A7F1, underlined, weight 400
  code inline   4px radius, 4px padding, monospace
  pre           bordered block, 8px radius, 16px/32px mono, horizontal scroll
Related posts   3-col grid below the fold
```

### 6.5 Pricing — model: [`/pricing`](https://auth0.com/pricing)

```
Hero            h1 44/56 · one paragraph
Toggles         segmented control — audience (B2C/B2B) AND billing (Monthly/Annual)
                14px, w500, 4px radius, white-on-dark active pill
Plan cards      3–4 col, one highlighted with a purple border (not a purple fill)
                name · price (display size) · unit · CTA · feature list with 1px dividers
Comparison      full feature table, sticky header row
Add-ons         3-col cards below
FAQ             accordion, 1px dividers, no card chrome
```

### 6.6 Feed — **not** modeled on Auth0

Keep the existing card-based social feed. Borrow only: row density, `18px/22px`
weight-400 titles, `24px` avatars, muted metadata, `1px` dividers. Do not convert
it into a forum table (§1.3).

---

## 7. Motion

Auth0 is restrained: `200–300ms`, `ease-out`, transform + opacity only.

| Interaction | Spec |
|---|---|
| Hover (card, button, link) | `150ms` color/border |
| Card lift | `200ms`, `translateY(-2px)` |
| Modal in | `200ms` fade + `scale(0.98 → 1)` |
| Accordion | `250ms` height |
| Scroll reveal | `400ms` fade + `translateY(12px)`, once, staggered `60ms` |

Never animate `width`, `height`, `top`, `left` — transform and opacity only.
`prefers-reduced-motion` is already handled globally in `globals.css`; don't bypass it.

---

## 8. Accessibility — non-negotiable

- Contrast **4.5:1** body, **3:1** large text. Verify muted-on-surface every time
  you change a surface value.
- Visible `focus-visible` ring on every interactive element. Never bare `outline-none`.
- One `<h1>` per page; no skipped levels.
- Icon-only buttons need `aria-label`.
- Modals: use the shared `Modal` (§5.6).
- Any `onClick` belongs on a `<button>` or `<a>`, never a `<div>`.
- Images need real `alt`; decorative images need `alt=""`.
- Test one full keyboard pass before calling a screen done.

---

## 9. Open decisions — resolve before the redesign starts

These are product/brand calls, not engineering ones. Nothing in this guide should be
built at scale until they are answered.

1. **Dark-first or keep light-first?** Auth0 is dark-only. WeCos defaults to cream.
   Going dark-first touches every screen. → *Recommendation: dark-first with a
   working light theme, since the token layer already supports both.*
2. **Which Auth0 system — purple-marketing or neutral-editorial?** → *Recommendation:
   neutral, purple as accent (§1.2).*
3. **Typeface** — keep Open Sauce Sans, or licence something closer? → *Recommendation:
   keep it; the feel comes from weight and rhythm, not the face (§1.1).*
4. **Does the feed stay a social feed?** (§1.3, §6.6)
5. **Domain**: `wecos.in` vs `wecos.in` — still unresolved from the audit.

---

## 10. Pre-ship checklist

Run this before calling any screen done.

- [ ] No `font-bold` on anything above `20px`
- [ ] Buttons and inputs are `4px` radius
- [ ] Zero new `box-shadow` — separation is borders and background steps
- [ ] Running text ≤ 70ch
- [ ] Body line-height ≥ 1.5
- [ ] Exactly one purple element in the primary viewport
- [ ] Section rhythm is 64/96/128, not arbitrary
- [ ] Every spacing value is on the 4px scale
- [ ] Colors come from tokens — **no hex, no `purple-700`, no raw `rgba()`**
- [ ] `focus-visible` ring on every control
- [ ] One `<h1>`, no skipped heading levels
- [ ] Checked at 375 / 768 / 1280 / 1536
- [ ] Checked in both themes
- [ ] Full keyboard pass, including modals
- [ ] `npx tsc --noEmit && npx eslint src && npm run build`

---

## Appendix — how to re-measure

Every number here came from running computed-style extraction against the live site
in the browser pane. To re-check or extend:

```js
// paste into javascript_tool against any page
(() => {
  const f = {};
  document.querySelectorAll('*').forEach(e => {
    if (!e.offsetWidth || !e.textContent.trim()) return;
    const c = getComputedStyle(e);
    const k = `${c.fontSize}/${c.lineHeight}/${c.fontWeight}`;
    f[k] = (f[k] || 0) + 1;
  });
  return Object.entries(f).sort((a, b) => b[1] - a[1]).slice(0, 16);
})()
```

Swap `fontSize` for `borderRadius`, `backgroundColor`, `boxShadow` or `padding` to
extract the other scales. Frequency ranking is what reveals the real system — the
top 3–4 values *are* the design tokens; the long tail is drift.

---

**Sources measured:** [auth0.com/pricing](https://auth0.com/pricing) ·
[auth0.com/customers](https://auth0.com/customers) ·
[auth0.com/blog](https://auth0.com/blog/) ·
[auth0.com/blog/aspnet-web-api-authorization](https://auth0.com/blog/aspnet-web-api-authorization) ·
[auth0.com/platform/login-security](https://auth0.com/platform/login-security) ·
[community.auth0.com](https://community.auth0.com/)
