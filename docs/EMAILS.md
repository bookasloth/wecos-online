# Email register

Living list of every email WeCos sends — to **members**, **admin**, or the
**support** team. Maintained as flows are added, whether or not it's called out
in the request.

**Status:** `live` = actually sends · `mock` = UI fires it but no real send yet
(toast placeholder) · `planned` = agreed, not built.

> Most of the app is localStorage-only, but the enquiry endpoint
> (`/api/company-enquiry`, nodemailer/Gmail) **does send real email today** —
> both an admin notification and a confirmation to the enquirer. Auth emails are
> still mock/planned until Supabase Auth lands.

## Members

| # | Topic | Trigger | Status |
|---|-------|---------|--------|
| 1 | Enquiry confirmation | Sends a studio/startup enquiry (`/api/company-enquiry`) | live |
| 2 | Document delivery (with download link) | Requests a gated document | live |
| 3 | Password reset link | Submits the forgot-password form | mock |
| 4 | Password changed confirmation | Completes reset-password (security notice) | planned |
| 5 | Welcome / account created | Signs up | planned |

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

- Members: 5 (2 live, 1 mock, 2 planned)
- Admin: 3 (2 live, 1 planned)
- Support: 0
