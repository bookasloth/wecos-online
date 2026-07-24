# WeCos

Marketing site + product UI for WeCos — "India's Startup Engine".

Next.js 16 (App Router) · React 19 · Tailwind v4 · TypeScript.

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in the SMTP values
npm run dev
```

Open http://localhost:3000.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |
| `npx tsc --noEmit` | Type check |

## Environment

See [.env.example](.env.example). Only the transactional-email variables are
required; the app renders fine without them, but `/api/company-enquiry` will
fail.

## Project layout

```
src/
  app/
    (marketing)/   Public site — home, about, membership, studios, startups, blog
    (auth)/        Sign in / sign up / forgot password
    (app)/         Authenticated shell — dashboard, feed, onboarding
    api/           Route handlers
  components/
    ui/            shadcn primitives + project-owned primitives (modal, …)
    layout/        Container, site header/footer, section heading
    app/           Dashboard chrome
  features/        Feature slices — auth, feed, profiles, startups
  config/site.ts   Nav, cities, studios, pricing, document list — edit here, it
                   updates everywhere
  lib/
    sample/        Mock data for the UI-first phase
    store/         zustand store (also mock — see the warning in the file)
  providers/       Composition root for client providers
```

## Design system

All colors, radii, shadows and micro-type live as semantic tokens in
[src/app/globals.css](src/app/globals.css), with light and dark values side by
side. **Never hardcode a color in a component** — reference the token.

## Current state

The data layer is mock. `src/lib/store/app-store.ts` persists a fake session to
localStorage so the register → onboard → profile → startup flow is clickable
without a backend, and `RequireAuth` gates client-side only. Neither is real
security. See [docs/ARCHITECTURE_ROADMAP.md](docs/ARCHITECTURE_ROADMAP.md) for
the backend plan and [docs/FRONTEND_AUDIT.md](docs/FRONTEND_AUDIT.md) for the
outstanding cleanup items.
