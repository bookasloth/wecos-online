# Known Issues

Problems we know about. Something being here means it is a decision, not an
oversight.

**Last updated:** 2026-07-24

Severity: 🔴 fix before launch · 🟠 fix soon · 🟡 fix when convenient

---

## 🔴 Mock auth is not security

`src/lib/store/app-store.ts` persists session, profile and startup to
`localStorage`. `RequireAuth` gates client-side only. No password is checked.
Anyone can edit localStorage and become anyone.

Fine for a UI-first prototype. **Must not ship with real user data.** Replaced by
Supabase auth + middleware + RLS.

## 🔴 Document PDFs do not exist

The enquiry flow emails links to `/documents/company-profile.pdf` and four
siblings. `public/documents/` does not exist, so every document-request email
sends the recipient to a 404 while the UI says "Document link has been sent."

Either add the five PDFs or remove the document picker. Needs a content decision.

## 🟠 A founder's own venture page is a husk

`CompanyPageData` has ~25 fields — products, funding, traction, updates, jobs,
people, reviews. `startupToCompanyData()` maps **10**. Worse, the `Startup` type
carries `foundedYear`, `teamSize`, `funding`, `tags`, `links`, `milestones` and
`lookingFor`, none of which are in `startupSchema` — so no founder can ever fill
them. Same on the profile side for `skills`, `links`, `openTo`.

A founder browses SpaceX with its funding rounds and video testimonials, creates
their own page, and gets a name and a tagline. Biggest disappointment in the
product.

## 🟠 The feed's "Following" tab does not follow anyone

`src/features/feed/feed-view.tsx` filters `author.handle !== myHandle` — that is
"everyone except me". There is no follow concept anywhere in the codebase.

Either build following or rename the tab to "All". It is the tab a returning user
hits first.

## 🟠 No notifications

Someone answers a founder's question and the founder never finds out. Community
products retain on *someone responded to you*, not on content quality. Every
event needed already exists in the store.

## 🟠 22 raw `<img>` tags, `next/image` used once

No lazy loading, no responsive `srcset`, no format conversion, no CLS
reservation. `hero-img.png`, `belong.png`, `build.png`, `validate.png` are
unoptimised PNGs on the homepage LCP path.

Not fixed because `<Image>` needs explicit dimensions per site and
`images.remotePatterns` for remote sources; doing it blind risks layout shifts.
Wants its own PR with visual review.

## 🟠 `company-page.tsx` is 1,378 lines

12% of all application code in one file: 12 exported types, 11 `useState` hooks,
a tab system, a video lightbox, an enquiry modal, and ~15 content sections.
Split plan in [FRONTEND_AUDIT.md](FRONTEND_AUDIT.md) R1.

## 🟡 Typo'd handles return HTTP 200, not 404

`/some-typo` renders a "Founder not found" body with a 200 status — a soft 404.
Profiles resolve client-side from the mock store, so the server cannot know
whether the visitor's own local profile uses that handle.

With handles at the URL root, crawlers will hit many of these, and Google
penalises soft 404s. Fix once profiles come from the database: look the handle up
in the layout and call `notFound()`. The exact spot is commented.

## 🟡 Six unused shadcn primitives

`accordion`, `alert`, `navigation-menu`, `separator`, `sheet`, `skeleton` are
never imported. Zero runtime cost, so they stay. The real smell: `sheet` and
`navigation-menu` exist **and** were reimplemented by hand in `site-header.tsx`.
Pick one.

## 🟡 No tests

No test setup of any kind. The enquiry endpoint's validation and the coming
entitlement layer both deserve one.

## 🟡 Directory shows borrowed logos

`/startups` seeds SpaceX, Tesla, Blue Origin as "startups on WeCos". For a
500-founder Indian club this reads as thin rather than impressive, and the first
real founder to join sees their page next to SpaceX's.
