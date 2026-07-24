# Routing

The URL scheme and the rules that keep it from breaking.

**Status:** ✅ Current · **Last updated:** 2026-07-24

---

## Scheme

| Surface | URL |
|---|---|
| Founder profile | `/username` |
| Venture (company) | `/venture/slug` |
| Studio | `/studios/slug` |
| Coffee Club city | `/coffee-clubs/city` |
| Blog post | `/resources/blog/slug` |
| Feed post | `/feed/id` |

Founder URLs follow Medium/YouTube (root-level vanity). Ventures follow LinkedIn
(`/company/name` → `/venture/name`).

## Route groups

```
src/app/(marketing)/   public — no path segment added
src/app/(auth)/        sign-in, sign-up, forgot-password
src/app/(app)/         signed-in shell — dashboard, feed
```

## The root-handle rule

`/username` is `src/app/(marketing)/[handle]/`, which sits at the root of the URL
space and therefore shares a namespace with every top-level route. Two things
keep that safe:

1. **Next.js resolves static segments before dynamic ones.** `/about`,
   `/studios`, `/founders`, `/dashboard` always win. `[handle]` never sees them.
2. **`reservedHandles` in `src/config/site.ts`** stops anyone claiming those
   words as a username.

> ⚠️ **Add the word to `reservedHandles` before adding any top-level route.**
> Shipping `/pricing` after someone has taken the handle `pricing` silently
> breaks their profile URL, permanently, with no error anywhere.

The reserved set covers current routes, likely future ones (`pricing`, `blog`,
`marketplace`, `settings`, `search`…) and impersonation risks (`admin`,
`support`, `official`, `wecos`).

Handle generation also guards this: `toHandle()` in the store suffixes anything
reserved or malformed, so `admin@company.com` cannot mint the unroutable handle
`admin`.

## Why the folder is `[handle]` and not `@[handle]`

A folder name starting with `@` is **Next.js parallel-route syntax** — it
declares a named slot, not a URL segment. `app/@username/` would not produce a
route at all.

An earlier draft used `/@username` with the `@` in the URL *value* (folder still
`[handle]`), which works and removes the namespace collision entirely. It was
dropped in favour of the cleaner `/username`. If reserved-word management ever
becomes painful, reintroducing the `@` prefix is the escape hatch.

## Canonicalisation

Handles are case-insensitive. `/ElonMusk` **301s** to `/elonmusk` in the layout,
so one profile never has two URLs.

## Redirects

In `next.config.ts`, permanent:

| From | To |
|---|---|
| `/u/:handle` | `/:handle` |
| `/startup/:slug` | `/venture/:slug` |

Studio slugs were renamed in WeCos 2.0 and redirect in the page itself via
`legacySlugs`:

| From | To |
|---|---|
| `/studios/accounting` | `/studios/finance` |
| `/studios/human-resource` | `/studios/hr` |

## Handle and slug rules

- 2–39 characters, `a-z0-9_-`, must start alphanumeric (`handlePattern`)
- Lowercase canonical
- Must not be in `reservedHandles`
- **Uniqueness is not enforced today** — there is no server. The real
  implementation needs a unique index and a claim flow.

## Open questions

1. **Are handles and slugs mutable?** Both are public URL keys derived from
   user-supplied text. Either freeze after creation or keep a redirect table.
   Decide before launch — renaming currently breaks every inbound link.
2. **`/startups` vs `/ventures`.** Detail pages are `/venture/…` but the
   directory is still `/startups`. If "venture" is the standard word, the
   directory should follow, with a redirect.
3. **Soft 404s** on unknown handles — see [KNOWN_ISSUES.md](KNOWN_ISSUES.md).
