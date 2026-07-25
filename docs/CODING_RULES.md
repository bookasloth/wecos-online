# Coding Rules

Conventions for every change, human or agent. The non-negotiables are in
[PROJECT_RULES.md](PROJECT_RULES.md); this is the day-to-day style.

**Last updated:** 2026-07-24

---

## TypeScript

- **No `any`.** There is currently not a single one in `src`. Keep it that way.
- No `as` casts to silence an error — fix the type.
- Derive types rather than restating them: `type Sort = typeof SORTS[number]`.
- `type` for shapes, `interface` only when declaration merging is needed.
- Discriminated unions over optional-field soup. `PostContent` is the model.

## Components

- Server components by default. `"use client"` only for interactivity, and push
  the boundary as deep as it will go.
- One component per file when exported; small local helpers may share a file.
- Props typed inline for small components; a named type when reused.
- No prop drilling past two levels — lift to a store or restructure.

## Naming

- Files `kebab-case.tsx`, components `PascalCase`, functions `camelCase`,
  constants `SCREAMING_SNAKE`.
- Booleans read as assertions: `isValidHandle`, `hasHydrated`, `showReadMore`.
- Handlers are `onThing` as props, `handleThing` as implementations.

## Styling

- Tailwind utilities. `cn()` to merge.
- Tokens only — no hex, no `purple-700`, no raw `rgba()`.
- A class string repeated three times becomes a component.
- Arbitrary values (`text-[11px]`) are a smell; add a token instead.

## Forms

`react-hook-form` + `zod` + `components/form/field`. Schema in
`features/*/schema.ts`, colocated with the feature.

## Errors

- Validate at trust boundaries with zod. Always.
- Never swallow: `catch (err) { console.error('[context]', err) }` at minimum.
- User-facing messages say what to do next, not what went wrong internally.

## Comments

Explain **why**, never what. The best comment records a decision or a trap:

```ts
// topics is derived inside the memo: as a `?? []` expression it was a fresh
// array on every render, which invalidated the memo every time.
```

Mark deliberate shortcuts with `⚠️ MOCK` or `ponytail:` and name the upgrade path.

## Don't

- Reinvent something in `components/ui/`
- Add a dependency for what a few lines can do
- Build an abstraction with one caller
- Leave commented-out code — git remembers
- Use `<div onClick>`; use a `button` or `a`
- Ship a raw `<img>` in new code without a reason

## Before done

```bash
npx tsc --noEmit && npx eslint src && npm run build
```

Then open it in a browser. Compiling is not working.
