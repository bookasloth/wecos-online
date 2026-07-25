# Common Patterns

The idioms this codebase uses. Copy these rather than inventing.

**Last updated:** 2026-07-24

---

## Server page + client island

The preferred shape. `/studios/[slug]` is the reference: a server component owns
metadata, static params and content; a small `"use client"` component owns the
interactive bit.

```tsx
// page.tsx — server
export function generateStaticParams() { … }
export async function generateMetadata({ params }) { … }
export default async function Page({ params }) {
  const { slug } = await params
  return <><Content /><StudioEnquiry studioName={…} /></>
}
```

⚠️ `params` is a **Promise** in Next 16. Always `await`.

## Metadata for a client page

A client component cannot export `metadata`. Put it in a sibling `layout.tsx`
that returns `children` untouched — see `(marketing)/startups/layout.tsx`.

Better: make the page a server component with a client island (above).

## Config-driven content

Structured content lives in `src/config/site.ts` and is mapped in components:

```tsx
{studios.map((s) => <Card key={s.slug} {...s} />)}
```

Nav, footer and directory all read the same arrays. Never re-declare a list.

## Dialogs

```tsx
{open && (
  <Modal title="Send Enquiry" onClose={close}
    titleAction={<button aria-label="Close" onClick={close}>×</button>}>
    …
  </Modal>
)}
```

Never hand-roll `fixed inset-0`.

## Store access with selectors

```tsx
const profile = useAppStore((s) => s.profile)     // ✅ subscribes to one slice
const { profile } = useAppStore()                 // ❌ re-renders on any change
```

## Guarding hydration

Persisted state is empty on the server. Screens that read auth state must wait:

```tsx
const hydrated = useAppHydrated()
if (!hydrated) return <Loader2 className="size-6 animate-spin" />
```

## Timers that outlive the component

```tsx
const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
useEffect(() => () => { if (timer.current) clearTimeout(timer.current) }, [])
```

## Derived values inside the memo

```tsx
const filtered = useMemo(() => {
  const topics = STUDIO_TOPICS[slug] ?? []   // ✅ inside
  return items.filter(…)
}, [slug])
```

A `?? []` expression outside the memo is a fresh array on every render and
invalidates it every time.

## Validating a request body

```ts
const parsed = schema.safeParse(await req.json().catch(() => null))
if (!parsed.success) {
  return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 })
}
```

Never derive a URL or a recipient from the body — derive it server-side from an
enum. See `api/company-enquiry`.

## Escaping interpolated output

Anything user-supplied reaching HTML goes through `esc()`. No exceptions.

## Formatting money

`formatInr(15000)` → `₹15,000`. Indian digit grouping. Never `toFixed`.

## Card grids with hairline dividers

```tsx
<ul className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
  <li className="bg-card">…</li>
</ul>
```

Cleaner than per-item conditional borders.
