# Email register

Living list of every email WeCos sends — to **members**, **admin**, or the
**support** team. Maintained as flows are added, whether or not it's called out
in the request.

**Status:** `live` = actually sends · `mock` = UI fires it but no real send yet
(toast placeholder; real send arrives with the backend/Supabase phase) ·
`planned` = agreed, not built.

> There is no email backend yet — every "sent" email today is a mock toast.
> This register is the spec the backend phase implements against.

## Members

| # | Topic | Trigger | Status |
|---|-------|---------|--------|
| 1 | Password reset link | Submits the forgot-password form | mock |
| 2 | Password changed confirmation | Completes reset-password (security notice) | planned |
| 3 | Welcome / account created | Signs up | planned |

## Admin

| # | Topic | Trigger | Status |
|---|-------|---------|--------|
| 1 | New member registration | A user signs up | planned |

## Support

| # | Topic | Trigger | Status |
|---|-------|---------|--------|
| — | _none yet_ | | |

## Totals

- Members: 3 (1 mock, 2 planned)
- Admin: 1 (1 planned)
- Support: 0
