# Project Rules

Non-negotiable. Everything else is a preference.

**Last updated:** 2026-07-24

---

## 1. `src/config/site.ts` is the single source of truth

Nav, cities, studios, pricing, enquiry documents, reserved handles. Edit there,
it updates everywhere. Never hard-code these values in a component.

## 2. Never hardcode a colour

Semantic tokens only. No hex, no `purple-700`, no raw `rgba()`. Missing value?
Add a token to `globals.css`.

## 3. Adding a top-level route means adding a reserved handle

Handles are root-level URLs. Shipping `/pricing` after someone owns the handle
`pricing` silently breaks their profile, permanently, with no error anywhere.
Same commit, every time. See [ROUTING.md](ROUTING.md).

## 4. Use the shared `Modal`

`src/components/ui/modal.tsx` has the dialog roles, focus trap, focus
restoration, Escape and scroll lock. Hand-rolling another `fixed inset-0` overlay
reintroduces every accessibility bug we already fixed.

## 5. Entitlements are named capabilities

`can(user, 'venture.list')`. **Never** `tier === 'venture'` in a component — that
is how gates drift out of sync with the pricing page.

## 6. Lead contact data is masked server-side

Stripped in the query or serializer, never hidden in the component. A lead whose
email is in the JSON payload is not masked, and that single mistake gives away
the provider business model.

## 7. Mocks are labelled

Anything temporary carries a `⚠️ MOCK` comment naming what replaces it. Silent
mocks become permanent.

## 8. Validate every request body with zod

At the trust boundary, before use. No exceptions.

## 9. Docs change in the same commit as the code

A doc that lies is worse than no doc. Decisions go in
[DECISIONS.md](DECISIONS.md) or an ADR.

## 10. Verify before claiming done

```bash
npx tsc --noEmit && npx eslint src && npm run build
```

ESLint errors stay at **zero**. And run it in a browser — compiling is not
working.

## 11. Founders never see internal machinery

No funnel stages, no lifecycle labels, no "you are in phase 2 of 5". The
monetisation is legitimate; it should not be visible as machinery. The Founder
Flow model is internal — see [BUSINESS_MODEL.md](BUSINESS_MODEL.md).

## 12. Deletion beats addition

The smallest change that works is the right one. The audit removed ~1,000 lines
and the product got better.
