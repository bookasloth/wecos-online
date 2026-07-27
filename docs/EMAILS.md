# Email register

Living list of every email WeCos sends — to **members**, **admin**, or the
**support** team. Maintained as flows are added, whether or not it's called out
in the request.

**Status:** `live` = actually sends · `mock` = UI fires it but no real send yet
(toast placeholder) · `planned` = agreed, not built.

> Transactional email is sent via **Resend** (`src/lib/email.ts`) —
> enquiry/document/welcome. **Auth emails** (confirmation, password reset) are
> sent by **Supabase Auth**; point Supabase's SMTP at Resend in the dashboard to
> unify the sender.

## Members

| # | Topic | Trigger | Status |
|---|-------|---------|--------|
| 1 | Enquiry confirmation | Sends a studio/startup enquiry (`/api/company-enquiry`, Resend) | live |
| 2 | Document delivery (with download link) | Requests a gated document (Resend) | live |
| 3 | Welcome | Completes onboarding (`/api/welcome`, Resend) | live |
| 4 | Password reset link | Submits forgot-password (Supabase Auth) | live |
| 5 | Email confirmation | Signs up (Supabase Auth, if confirm-email on) | live |

## Admin

| # | Topic | Trigger | Status |
|---|-------|---------|--------|
| 1 | New enquiry notification | A visitor submits an enquiry | live |
| 2 | New document request | A visitor requests a document | live |
| 3 | New member registration | A user signs up | planned |

## Support

| # | Topic | Trigger | Status |
|---|-------|---------|--------|
| — | _none yet_ | | |

## Totals

- Members: 5 (5 live)
- Admin: 3 (2 live, 1 planned)
- Support: 0
