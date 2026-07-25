<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Start here

**Read [docs/AI_CONTEXT.md](docs/AI_CONTEXT.md) before doing anything.** It is
the short brief: what this product is, what is real, what is mocked, and the
rules that bite if ignored.

Then, depending on the task:

| Doing | Read first |
|---|---|
| Anything | [docs/PROJECT_RULES.md](docs/PROJECT_RULES.md) — non-negotiables |
| Building UI | [docs/UI_UX_GUIDE.md](docs/UI_UX_GUIDE.md) then [docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md) |
| A gated feature | [docs/AUTHORIZATION.md](docs/AUTHORIZATION.md) and [docs/FEATURES.md](docs/FEATURES.md) |
| Anything with URLs | [docs/ROUTING.md](docs/ROUTING.md) |
| Data work | [docs/DATABASE.md](docs/DATABASE.md), [docs/database/schema.md](docs/database/schema.md) |
| Leads or providers | [docs/prd/CRM_PRD.md](docs/prd/CRM_PRD.md) |
| Picking up work | [docs/NEXT_TASK.md](docs/NEXT_TASK.md) and [docs/ROADMAP.md](docs/ROADMAP.md) |

Full index: [docs/README.md](docs/README.md). Much of that tree is scaffolded
and marked **Stub** — a stub is a promise, not a fact. When a doc and the code
disagree, the code wins; fix the doc.

# The three that catch people out

1. **There is no backend.** State is `localStorage` via
   `src/lib/store/app-store.ts`. Auth is fake. Everything real is marked
   `⚠️ MOCK`.
2. **Handles are root-level URLs** (`/username`). Adding a top-level route
   without adding the word to `reservedHandles` in `src/config/site.ts`
   permanently breaks whoever owns that handle, silently.
3. **`src/config/site.ts` is the single source of truth** for nav, cities,
   studios, pricing and reserved handles. Never hard-code these elsewhere.

# Before claiming done

```bash
npx tsc --noEmit && npx eslint src && npm run build
```

ESLint errors must stay at **zero**. Then check it in a browser — compiling is
not working.

# Standing conventions

Maintain these as you work, without being reminded:

1. **Email register.** Whenever you add a flow that sends an email to a
   **member**, **admin**, or **support**, add a row (topic, trigger, status)
   and update the totals in [docs/EMAILS.md](docs/EMAILS.md). Status vocab:
   `live` / `mock` / `planned`. There is no email backend yet, so today's
   sends are mock toasts — the register is the spec the backend phase builds
   against.
2. **Commit co-authors.** Credit both of these on every commit:
   ```
   Co-Authored-By: thekalamwala <sndatarkar@gmail.com>
   Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>
   ```
   Author stays `bookasloth`.

Known issues and deliberate debt: [docs/KNOWN_ISSUES.md](docs/KNOWN_ISSUES.md)
and [docs/FRONTEND_AUDIT.md](docs/FRONTEND_AUDIT.md) §14.
