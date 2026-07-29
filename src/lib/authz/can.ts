/**
 * `can(user, capability, context?)` — the single authorization question every
 * feature asks. See docs/AUTHORIZATION.md.
 *
 * This is the UI/server-shared check. It is NOT the security boundary on its own:
 * writes must also be checked in the server action, and the last line is RLS in
 * the database. A `true` here means "show/allow at this layer", not "safe".
 */

import type { TierId } from "@/config/site";
import { tierAllows, ADMIN_CAPABILITIES, type Capability } from "@/config/tiers";

export type AuthzUser = {
  tier: TierId;
  /** WeCos staff. Gates the `admin.*` capabilities. Absent = not staff. */
  isStaff?: boolean;
};

/**
 * `context` (ownership / role specifics like `{ ventureId }` or `{ leadId }`) is
 * accepted for forward-compatibility. Tier-level gates ignore it; ownership is
 * enforced server-side and by RLS, where the caller's owned rows are actually
 * known. Kept in the signature now so callers don't change when that lands.
 */
export function can(
  user: AuthzUser | null,
  capability: Capability,
  _context?: Record<string, unknown>,
): boolean {
  if ((ADMIN_CAPABILITIES as readonly string[]).includes(capability)) {
    return Boolean(user?.isStaff);
  }
  return tierAllows(user?.tier ?? "free", capability);
}
