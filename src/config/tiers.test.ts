/**
 * Tier matrix guard. The cheapest possible defence against a packaging change
 * silently opening a paid feature to free users, or dropping a capability's
 * mapping entirely.
 *
 * Framework-free on purpose (no vitest/jest in this repo). Node ≥ 23.6 strips
 * TypeScript types natively, so run with:
 *
 *   node --test src/config/tiers.test.ts
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import type { TierId } from "./site.ts";
import {
  tierAllows,
  tierForCapability,
  ADMIN_CAPABILITIES,
  TIER_FEATURES,
  type Capability,
} from "./tiers.ts";

const TIERS: TierId[] = ["free", "network", "venture", "circle"];

const ALL_CAPABILITIES: Capability[] = [
  "profile.edit", "profile.extended", "profile.viewers",
  "connection.send", "message.send", "follow",
  "post.create", "post.richKinds", "circle.create",
  "venture.create", "venture.list", "venture.sections", "venture.analytics", "venture.edit",
  "provider.list", "provider.categories", "lead.view", "lead.unlock",
  "studio.discount",
  "event.create", "chapter.host", "event.freeEntry",
  "ad.buy", "marketplace.sell", "perk.redeem", "founderCall.request",
  "admin.provider.review", "admin.lead.manage", "admin.member.manage",
];

test("every capability resolves to a boolean for every tier", () => {
  for (const tier of TIERS) {
    for (const cap of ALL_CAPABILITIES) {
      assert.equal(typeof tierAllows(tier, cap), "boolean", `${tier}/${cap}`);
    }
  }
});

test("entitlements are cumulative — a higher tier never loses a capability", () => {
  for (let i = 1; i < TIERS.length; i++) {
    const lower = TIERS[i - 1];
    const higher = TIERS[i];
    for (const cap of ALL_CAPABILITIES) {
      if (tierAllows(lower, cap)) {
        assert.ok(tierAllows(higher, cap), `${higher} regressed on ${cap} vs ${lower}`);
      }
    }
  }
});

test("admin capabilities are never tier-granted (staff-only)", () => {
  for (const cap of ADMIN_CAPABILITIES) {
    for (const tier of TIERS) {
      assert.equal(tierAllows(tier, cap), false, `${cap} leaked to ${tier}`);
    }
    assert.equal(tierForCapability(cap), null, `${cap} should have no unlocking tier`);
  }
});

test("paid features are closed to free — the money gates", () => {
  const paidOnly: Capability[] = [
    "venture.list", "lead.view", "lead.unlock", "provider.list",
    "studio.discount", "event.create", "founderCall.request",
  ];
  for (const cap of paidOnly) {
    assert.equal(tierAllows("free", cap), false, `${cap} is open to free!`);
  }
});

test("free-tier basics stay open", () => {
  for (const cap of ["profile.edit", "post.create", "follow", "venture.create"] as Capability[]) {
    assert.equal(tierAllows("free", cap), true, `${cap} should be free`);
  }
});

test("numeric limits climb with tier", () => {
  assert.equal(TIER_FEATURES.free.connectionRequestsPerMonth, 5);
  assert.equal(TIER_FEATURES.network.connectionRequestsPerMonth, Infinity);
  assert.equal(TIER_FEATURES.free.leadCredits, 0);
  assert.equal(TIER_FEATURES.venture.leadCredits, 5);
  assert.equal(TIER_FEATURES.circle.leadCredits, 15);
  assert.ok(TIER_FEATURES.circle.providerCategories > TIER_FEATURES.venture.providerCategories);
});
