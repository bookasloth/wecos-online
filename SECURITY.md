# Security

## Reporting a vulnerability

Email **start@wecos.in** with "Security" in the subject. Please do not open a
public issue. We aim to acknowledge within two working days.

Include: what you found, how to reproduce it, and what an attacker could do with
it. If you need to demonstrate against a live environment, tell us first.

---

## Current posture

**This application is a UI-first prototype and is not production-secure.** The
items below are known and tracked, not discovered.

### 🔴 Authentication is fake

`src/lib/store/app-store.ts` persists session, profile and startup to
`localStorage`. There is **no password check, no server, no session token**.
`RequireAuth` gates client-side only — anyone can edit localStorage and become
anyone.

Acceptable for a prototype with sample data. **Must not ship with real user
data.** Replaced by Supabase Auth + middleware + row-level security.

### 🟠 In-memory rate limiting only

`/api/company-enquiry` throttles 5 requests/minute per IP using an in-process
`Map`. It resets on deploy and does not coordinate across instances. Blunts
casual abuse; not a real rate limiter.

### ✅ Fixed

| | |
|---|---|
| **Mail relay** | The enquiry endpoint accepted `userEmail` **and** `documentLink` from the request body, so anyone could make the WeCos SMTP account send a WeCos-branded email with an arbitrary link to an arbitrary address — a ready-made phishing relay. Body is now zod-validated, `documentName` is an enum, and the download URL is derived **server-side**. |
| **HTML injection** | User input was interpolated raw into outbound email HTML. All interpolations now escaped. |
| **No rate limit** | Added, with the caveat above. |

### Practices

- No `dangerouslySetInnerHTML` anywhere in `src`.
- No secrets committed; `.env*` is gitignored. See
  [docs/ENVIRONMENT_VARIABLES.md](docs/ENVIRONMENT_VARIABLES.md).
- Only server-side env vars are used for credentials. Nothing sensitive is
  `NEXT_PUBLIC_`.
- All request bodies are validated with zod before use.

---

## Rules for future work

1. **Row-level security is the enforcement boundary**, not application code.
   Assume the server has a bug.
2. **Masked lead contact data must be stripped server-side.** A lead whose email
   is present in the JSON payload is not masked, regardless of what the UI shows.
   This single mistake would give away the provider business model. See
   [docs/prd/CRM_PRD.md](docs/prd/CRM_PRD.md).
3. **Never trust the client for entitlements.** UI gating is a convenience;
   the server check is the real one. See
   [docs/AUTHORIZATION.md](docs/AUTHORIZATION.md).
4. **Payment state comes from webhooks**, never from a client callback.
