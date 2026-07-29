"use client";

/**
 * Component-facing entitlement hooks. Thin wrappers over `can()` that read the
 * active tier from the mock store (`membership.tier`, null = free). When the
 * backend lands, only this file changes — components keep calling `useCan(...)`.
 */

import { useAppStore } from "@/lib/store/app-store";
import { can, type AuthzUser } from "./can";
import type { Capability } from "@/config/tiers";

/** The current viewer as the authz layer sees them. */
export function useAuthzUser(): AuthzUser {
  const membership = useAppStore((s) => s.membership);
  // ⚠️ MOCK: no staff concept in the store yet, so `admin.*` is always denied.
  return { tier: membership?.tier ?? "free" };
}

export function useCan(
  capability: Capability,
  context?: Record<string, unknown>,
): boolean {
  const user = useAuthzUser();
  return can(user, capability, context);
}
