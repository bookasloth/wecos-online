# Component Architecture

How every screen gets built. This is the structural plan behind
[UI_UX_GUIDE.md](UI_UX_GUIDE.md) (direction) and
[DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) (tokens).

**Status:** ✅ Planned · **Last updated:** 2026-07-24

---

## Judging the references

Three sources, examined page by page.

### Auth0 — what's actually good

**Restraint is the whole trick.** Near-black surfaces, one accent, cards with
hairline dividers instead of shadows, heading weight 400 at 40–96px. Nothing
competes for attention, which is why a page with eleven feature sections still
feels calm.

**Gradient auras are the only decoration.** The hero is a soft purple/magenta
bloom behind flat type — no illustration, no photo, no pattern. It carries all
the visual interest so every other section can be plain. Cheap to reproduce (one
radial gradient) and it scales to any page.

**Stats are the one place they get loud** — `3 billion+` at display size with a
gradient bar beneath. One treatment, used three times, never again.

**Interactive pricing.** B2C/B2B toggle, Monthly/Yearly toggle, *and* a MAU
slider that reprices the whole table. It answers "what will this cost me" without
a sales call.

**The proof grid is a bento**, deliberately: two large image-led cards among four
small quote cards. Mixed cell sizes stop a testimonial wall reading as a wall.

**What I would not copy:**

- **Pricing cards carry 12+ feature bullets each.** Unscannable. The comparison
  table below already does that job.
- **The tabbed "Built for what you're building" section hides three-quarters of
  its content** behind left-rail tabs. Fine for a company with four audiences;
  wrong for us, where the studios *are* the content.
- **Muted text sits at the contrast floor.** `#ABABAB` on `#111` passes AA but
  only just, and they use it for 11px labels.
- **Heavy hero imagery.** The aura is a large raster. Ours should be CSS.

### Book A Sloth — what to take

Your own product, and structurally the stronger of the two for editorial.

- **Split hero** — solid colour panel with title and meta, visual panel beside
  it, 50/50, edge to edge. Cheap, distinctive, works with no artwork budget.
- **The meta row**: `PUBLISHED / AUTHOR / READ` as uppercase labels above their
  values, on a hairline rule. Better than the usual byline mush.
- **Callout box** — icon + uppercase label + body on a raised surface.
- **Pull-quote** with a left accent border and a small caption beneath.
- **FAQ as native disclosure rows** — a hairline-separated `<details>` stack.
- **Narrow measure**, and a real share row at the end.

**What I would fix:** the light nav sitting on a dark body creates a hard seam at
the top of every page. Pick one.

### The conflict you need to resolve

**Auth0 sets display type at weight 400. Book A Sloth sets it bold.**

Opposite answers, and both work in context — Auth0 is enterprise-calm, Sloth is
punchy and editorial. WeCos cannot be both.

My recommendation: **400 for display (40px+), 500 for card titles, 600 for small
labels.** WeCos's positioning is "calm" — it is the deck's own word, and the
differentiator table says *calm, structured, purposeful* against "tool overload".
Regular-weight display type is what calm looks like.

If family resemblance with Book A Sloth matters more, say so and I will set the
scale bold. It is one token change, but it has to be decided **before** sections
get built, not after.

---

## The five layers

Every UI element belongs to exactly one. If you cannot name the layer, it is in
the wrong place.

```
0  Tokens        globals.css                  colour, type, space, radius
1  Primitives    components/ui/               button, input, card, modal…
2  Patterns      components/patterns/    NEW  eyebrow, section-header, stat…
3  Sections      components/sections/    NEW  full-width page blocks
4  Templates     app/**/page.tsx              compose sections
   Features      features/*/                  domain slices, may use any layer
```

**The rule:** a layer may only import from layers below it. A primitive that
knows about ventures is not a primitive. A section that reads the store is a
feature.

Layers 2 and 3 do not exist yet — that is the gap this document closes. Today
marketing pages hand-roll everything, which is why the same 250-character class
string appears four times.

---

## Layer 1 — Primitives

`src/components/ui/`. Dumb, generic, no domain knowledge.

| Exists | Needs work |
|---|---|
| `button` `input` `textarea` `label` `card` `badge` `avatar` `tabs` `dialog` `dropdown-menu` `modal` `skeleton` `separator` `accordion` `alert` `sheet` `navigation-menu` | `button` — retune to 4px radius, `12px 32px` on lg |
| | `input` — 4px radius |
| | `skeleton` — currently unused; loading is spinner-only |

**To add:** `toggle-group` (segmented control — pricing needs two),
`slider`, `tooltip`, `disclosure` (native `<details>` wrapper), `progress`.

⚠️ `sheet` and `navigation-menu` exist **and** were reimplemented by hand in
`site-header.tsx`. Delete one before building anything new on top.

---

## Layer 2 — Patterns

`src/components/patterns/` — **new**. Small composites used across many sections.
This is where today's repetition lives.

| Component | Replaces | From |
|---|---|---|
| `<Eyebrow>` | 8 occurrences of two *different* uppercase-label class strings | Auth0 |
| `<SectionHeader>` | eyebrow + h2 + one paragraph, everywhere | Both |
| `<StatBlock>` | — | Auth0 — display number + gradient bar + label |
| `<MetaRow>` | ad-hoc bylines | Sloth — uppercase labels above values |
| `<Callout>` | — | Sloth — icon + label + body |
| `<PullQuote>` | — | Sloth — left accent border + caption |
| `<FeatureCard>` | the 250-char card class ×4 | Auth0 |
| `<PriceCard>` | studio `PackageCard`, generalised | Auth0 |
| `<PersonCard>` | founder cards, team rows | — |
| `<VentureCard>` | directory cards, 3 variants today | — |
| `<LogoWall>` | homepage logo strip | Auth0 |
| `<FAQ>` | — | Sloth — `<details>` stack |
| `<EmptyState>` | 3 hand-rolled dashed boxes | — |
| `<ShareRow>` | `copy-link-button`, extended | Sloth |
| `<TierBadge>` | — | needed for membership |
| `<UpgradePrompt>` | — | **every gated action** — [AUTHORIZATION.md](AUTHORIZATION.md) |

`<UpgradePrompt>` is load-bearing, not cosmetic. A blocked action that silently
disappears teaches the user nothing; it must name the tier that unblocks it and
link to checkout.

---

## Layer 3 — Sections

`src/components/sections/` — **new**. Full-width page blocks. A marketing page
should be a list of these and almost nothing else.

### Heroes

| | Shape | Used by |
|---|---|---|
| `<AuraHero>` | Centred, radial gradient bloom, eyebrow + h1 + sub + 2 CTAs | Home, membership |
| `<SplitHero>` | 50/50 colour panel + visual, left-aligned, meta row | Article, venture, founder |
| `<StatementHero>` | `display-xl` phrase, nothing else | `/founders`, `/startups` |
| `<CompactHero>` | Eyebrow + h1 + count + action, no decoration | Directories, dashboard |

`<AuraHero>` uses a CSS radial gradient, **not** an image — the same effect as
Auth0's hero at a fraction of the weight.

### Body sections

| | Contents |
|---|---|
| `<ValueTrio>` | 3-col icon + h3 + two lines, 64px gap |
| `<DeepFeature>` | Alternating band: eyebrow, h2, copy, visual. Stack as many as needed |
| `<StatBand>` | 3–4 `<StatBlock>` — the one loud moment per page |
| `<ProofBand>` | Bento grid: 2 large image cards, 4 quote cards |
| `<LogoBand>` | Monochrome logo wall |
| `<CardGrid>` | Generic 2/3/4-col grid of any card pattern |
| `<PricingTable>` | Toggles + tier cards + full comparison table |
| `<FAQSection>` | `<FAQ>` on a hairline-separated stack |
| `<CTABand>` | Full-width, centred, one button. Always last |

### Rules

1. **Sections own their vertical rhythm** (`py-24` desktop / `py-16` mobile).
   Pages never add margin between them.
2. **Sections are full-bleed; `<Container>` lives inside.** That is what makes
   alternating background bands possible.
3. **Sections take data as props.** No store access, no fetching — keeps them
   server-renderable.
4. **Alternate backgrounds** `background` → `muted/30` → `background`. Auth0
   alternates `#111` / `#171717`; same idea through our tokens.

---

## Layer 4 — Page templates

Every WeCos route maps to one of eight.

| Template | Sections | Routes |
|---|---|---|
| **Marketing landing** | AuraHero · ValueTrio · DeepFeature× · ProofBand · CTABand | `/`, `/validate` |
| **Feature landing** | CompactHero · deliverables · PricingTable · related · CTABand | `/studios/[slug]` |
| **Pricing** | AuraHero · PricingTable · FAQSection · CTABand | `/membership` |
| **Directory** | CompactHero · filters · CardGrid · CTABand | `/startups`, `/founders`, `/studios` |
| **Showcase profile** | SplitHero · tabbed sections · related | `/venture/[slug]`, `/[handle]` |
| **Editorial index** | StatementHero · featured card · CardGrid | `/resources/blog` |
| **Article** | SplitHero · prose (747px) · FAQSection · ShareRow · related | `/resources/blog/[slug]` |
| **App shell** | header · sidebar · content | `/dashboard/*`, `/feed` |

Auth pages keep their own centred single-column layout.

---

## What this changes in the codebase

| Now | After |
|---|---|
| 250-char class string repeated 4× | `<FeatureCard>` |
| Two different eyebrow class strings | `<Eyebrow>` |
| 45 raw `<button>` vs 12 `<Button>` | One `Button` |
| 4 hand-rolled modals | ✅ already unified on `<Modal>` |
| 3 dashed empty-state divs | `<EmptyState>` |
| `company-page.tsx` at 1,378 lines | Sections + patterns, ~300 |
| Marketing pages 300–500 lines each | 40–60 lines composing sections |
| Spinner-only loading | `<Skeleton>` per pattern |

The biggest single win is `company-page.tsx`. It is 12% of all application code
and it is entirely layer-2 and layer-3 material trapped in one file.

---

## Build order

**Do not redesign page by page.** Build the layers bottom-up, then swap pages one
at a time. Every step leaves the app shippable.

1. **Tokens** — retune control radius to 4px, add the display scale
   (`display-xl`, `display-lg`), confirm the weight decision above.
2. **Primitives** — retune `button` and `input`; add `toggle-group`, `slider`,
   `disclosure`, `tooltip`.
3. **Patterns** — `Eyebrow`, `SectionHeader`, `FeatureCard`, `EmptyState`,
   `PriceCard`, `UpgradePrompt` first. These unblock the most.
4. **Sections** — `AuraHero`, `CompactHero`, `CardGrid`, `CTABand`,
   `PricingTable`. Enough to build the priority route.
5. **`/membership`** — the first page built entirely from the new system.
6. **Studios, directories, home** — swap in order of traffic.
7. **`company-page.tsx`** — split last, with visual review.

Step 5 matters: build the new system on a page that **does not exist yet**. No
regression risk, and it proves the architecture before anything is migrated.

---

## Open decisions

1. **Display weight — 400 (Auth0) or bold (Book A Sloth)?** Blocks the token
   step. Recommendation: 400, on the argument that "calm" is the stated
   positioning.
2. **Dark-first, or keep light-first?** Still open from
   [UI_UX_GUIDE.md](UI_UX_GUIDE.md) §9. Blocks nothing structurally — the tokens
   support both — but every marketing asset depends on it.
3. **Aura gradient palette.** Auth0 blooms purple→magenta. Ours would be
   `--brand` → `--brand-indigo`, or `--brand` → `--brand-gold` for warmth.
4. **Does the nav match the body or contrast with it?** Sloth contrasts; I would
   match.
