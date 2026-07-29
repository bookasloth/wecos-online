/**
 * The entitlement layer — what each tier is allowed to do.
 *
 * Single source of truth for capability gating, deliberately kept in config and
 * NOT in the database (see docs/AUTHORIZATION.md for why: packaging changes ship
 * as a reviewable one-line diff instead of a migration that drifts between envs).
 *
 * Prices and tier metadata live in `config/site.ts`. This file adds only the
 * *entitlements* on top of those tiers, so packaging can change without touching
 * prices and vice-versa.
 *
 * Tiers are cumulative: each includes everything the tier below it unlocks. That
 * is modelled as a rank ladder, not four hand-maintained capability sets — one
 * ordered list is far harder to drift out of sync than four overlapping ones.
 *
 * Feature→tier mapping is taken from docs/FEATURES.md. When that table changes,
 * change the map here; the test in `tiers.test.ts` fails loudly if a capability
 * loses its mapping.
 */

import type { TierId } from "./site";

/** Tier ladder, cheapest first. A tier unlocks a capability iff its rank ≥ the capability's minimum. */
const TIER_ORDER: readonly TierId[] = ["free", "network", "venture", "circle"];

export const tierRank = (tier: TierId) => TIER_ORDER.indexOf(tier);

/**
 * Every named capability. `can(user, 'venture.list')`, never
 * `if (user.tier === 'venture')` scattered through components — tier comparison
 * in a component is exactly how gates drift out of sync with the pricing page.
 */
export type Capability =
  // Profile
  | "profile.edit"
  | "profile.extended"
  | "profile.viewers"
  // Network
  | "connection.send"
  | "message.send"
  | "follow"
  // Feed
  | "post.create"
  | "post.richKinds"
  | "circle.create"
  // Venture
  | "venture.create"
  | "venture.list"
  | "venture.sections"
  | "venture.analytics"
  | "venture.edit"
  // Provider
  | "provider.list"
  | "provider.categories"
  | "lead.view"
  | "lead.unlock"
  // Studios
  | "studio.discount"
  // Events
  | "event.create"
  | "chapter.host"
  | "event.freeEntry"
  // Commerce
  | "ad.buy"
  | "marketplace.sell"
  | "perk.redeem"
  | "founderCall.request"
  // Admin — staff-only, gated by role not tier (see below)
  | "admin.provider.review"
  | "admin.lead.manage"
  | "admin.member.manage";

/** Admin capabilities are gated by staff role, not by tier. `can()` handles these separately. */
export const ADMIN_CAPABILITIES = [
  "admin.provider.review",
  "admin.lead.manage",
  "admin.member.manage",
] as const;

type TierCapability = Exclude<Capability, (typeof ADMIN_CAPABILITIES)[number]>;

/**
 * The minimum tier that unlocks each (non-admin) capability. Mapping is from the
 * feature matrix in docs/FEATURES.md.
 *
 * Note: `venture.create`/`venture.edit` are `free` because a founder may build
 * and edit their own (unlisted) page at any tier — the paid gate is `venture.list`
 * (appearing in the public directory). Ownership is enforced by `context` at the
 * server/RLS layer, not here.
 */
const CAPABILITY_MIN_TIER: Record<TierCapability, TierId> = {
  "profile.edit": "free",
  "profile.extended": "network",
  "profile.viewers": "network",

  "connection.send": "free", // free is capped at 5/mo — a numeric limit, not a capability
  "message.send": "network", // paid feature: free members can't DM paid members (see <MessageButton>)
  "follow": "free",

  "post.create": "free",
  "post.richKinds": "network", // poll/quiz/video/milestone
  "circle.create": "circle",

  "venture.create": "free", // unlisted at free — the hook
  "venture.list": "venture",
  "venture.sections": "venture",
  "venture.analytics": "venture",
  "venture.edit": "free", // own page; ownership checked via context downstream

  "provider.list": "venture",
  "provider.categories": "venture",
  "lead.view": "venture",
  "lead.unlock": "venture",

  "studio.discount": "network",

  "event.create": "circle",
  "chapter.host": "circle",
  "event.freeEntry": "circle",

  "ad.buy": "venture",
  "marketplace.sell": "venture",
  "perk.redeem": "venture",
  "founderCall.request": "venture",
};

/**
 * Numeric limits and rates per tier. These are NOT capabilities — they are
 * numbers read from config and checked against usage/credit counters. Discount
 * percentages already live in `config/site.ts` (`studioDiscountPct`); everything
 * else that is a per-tier number lives here.
 */
export type TierLimits = {
  /** Connection requests a member may send per month. */
  connectionRequestsPerMonth: number;
  /** Lead unlocks included per month (extra unlocks are purchased). */
  leadCredits: number;
  /** Provider categories the member may list a business in. */
  providerCategories: number;
};

export const TIER_FEATURES: Record<TierId, TierLimits> = {
  free: { connectionRequestsPerMonth: 5, leadCredits: 0, providerCategories: 0 },
  network: { connectionRequestsPerMonth: Infinity, leadCredits: 0, providerCategories: 0 },
  venture: { connectionRequestsPerMonth: Infinity, leadCredits: 5, providerCategories: 1 },
  circle: { connectionRequestsPerMonth: Infinity, leadCredits: 15, providerCategories: 3 },
};

/**
 * Pure tier check — no React, no store, no staff/admin handling. `can()` in
 * `lib/authz/can.ts` wraps this with the null-user and staff-role rules. Kept
 * here (dependency-free) so it is unit-testable in isolation.
 *
 * Admin capabilities always return false here; they are role-gated, and `can()`
 * is the only place that knows about staff.
 */
export function tierAllows(tier: TierId, capability: Capability): boolean {
  if ((ADMIN_CAPABILITIES as readonly string[]).includes(capability)) return false;
  return tierRank(tier) >= tierRank(CAPABILITY_MIN_TIER[capability as TierCapability]);
}

/**
 * The tier a blocked user must reach to gain `capability`, or `null` for
 * staff-only (admin) capabilities. Used by `<Upgrade>` to name the tier that
 * unblocks the action.
 */
export function tierForCapability(capability: Capability): TierId | null {
  if ((ADMIN_CAPABILITIES as readonly string[]).includes(capability)) return null;
  return CAPABILITY_MIN_TIER[capability as TierCapability];
}
