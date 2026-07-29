"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Lock, Mail, MapPin, Phone } from "lucide-react";
import { DashboardHeader } from "@/components/app/dashboard-header";
import { Upgrade } from "@/components/authz/upgrade";
import { useCan, useAuthzUser } from "@/lib/authz/use-can";
import { TIER_FEATURES } from "@/config/tiers";

/**
 * Provider lead inbox. Gated by `lead.view` (Venture+): free/network see the
 * upgrade wall, paid tiers see the masked lead list.
 *
 * Revealing a lead's contact is `lead.unlock` and spends one of the tier's
 * monthly lead credits (TIER_FEATURES.leadCredits — venture 5, circle 15).
 *
 * ⚠️ MOCK: sample leads, and the credit counter is component-local (resets on
 * reload). Real leads + a persisted credit_balance come from the backend phase
 * (see docs/prd/CRM_PRD.md). Contact fields are only masked for display here;
 * real masking must strip them in the query/serializer server-side, never in
 * the component — an unlocked lead's contact must not exist in the payload until
 * a credit is actually spent.
 */
const SAMPLE_LEADS = [
  { id: "l1", name: "Ananya M.", need: "Performance marketing for a D2C skincare launch", city: "Mumbai", when: "2 days ago", email: "ananya.m@example.com", phone: "+91 98200 11223" },
  { id: "l2", name: "Rohit S.", need: "Monthly bookkeeping + GST filing for a seed-stage SaaS", city: "Pune", when: "4 days ago", email: "rohit.s@example.com", phone: "+91 99700 44556" },
  { id: "l3", name: "Priya K.", need: "Pvt Ltd incorporation and founder agreement", city: "Bangalore", when: "1 week ago", email: "priya.k@example.com", phone: "+91 91080 77889" },
];

export default function LeadsPage() {
  const canView = useCan("lead.view");
  const canUnlock = useCan("lead.unlock");
  const { tier } = useAuthzUser();
  const credits = TIER_FEATURES[tier].leadCredits;

  const [unlocked, setUnlocked] = useState<string[]>([]);
  const remaining = credits - unlocked.length;

  const unlock = (id: string) => {
    if (!canUnlock || remaining <= 0 || unlocked.includes(id)) return;
    setUnlocked((prev) => [...prev, id]);
    toast.success(`Lead unlocked. ${remaining - 1} unlock${remaining - 1 === 1 ? "" : "s"} left this month.`);
  };

  if (!canView) {
    return (
      <div>
        <DashboardHeader
          title="Leads"
          description="Enquiries from founders looking to hire providers."
        />
        <Upgrade capability="lead.view" title="Lead inbox is a Venture feature">
          List your business as a provider and collect leads from founders who
          are actively looking to hire. Unlock the inbox by upgrading to Venture.
        </Upgrade>
      </div>
    );
  }

  return (
    <div>
      <DashboardHeader
        title="Leads"
        description="Enquiries from founders looking to hire providers."
        action={
          <span className="rounded-[var(--radius-control)] bg-accent px-3 py-1 text-sm font-medium text-accent-foreground">
            {remaining} of {credits} unlocks left
          </span>
        }
      />

      <ul className="space-y-3">
        {SAMPLE_LEADS.map((lead) => {
          const isUnlocked = unlocked.includes(lead.id);
          const noCredits = remaining <= 0;
          return (
            <li
              key={lead.id}
              className="flex flex-wrap items-start justify-between gap-4 rounded-xl border border-border bg-card p-4"
            >
              <div className="min-w-0">
                <p className="font-medium">{lead.name}</p>
                <p className="mt-1 text-sm text-muted-foreground">{lead.need}</p>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="size-3.5" />
                    {lead.city}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Mail className="size-3.5" />
                    {isUnlocked ? lead.email : "•••••@•••••"}
                  </span>
                  {isUnlocked ? (
                    <span className="inline-flex items-center gap-1">
                      <Phone className="size-3.5" />
                      {lead.phone}
                    </span>
                  ) : null}
                  <span>{lead.when}</span>
                </div>
              </div>

              {isUnlocked ? (
                <span className="inline-flex shrink-0 items-center gap-1.5 rounded-[var(--radius-control)] px-3 py-1.5 text-sm font-medium text-primary">
                  Unlocked
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => unlock(lead.id)}
                  disabled={noCredits}
                  title={noCredits ? "No lead unlocks left this month" : undefined}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-[var(--radius-control)] border border-border px-3 py-1.5 text-sm font-medium transition-colors enabled:hover:border-primary enabled:hover:text-primary disabled:text-muted-foreground"
                >
                  <Lock className="size-3.5" />
                  Unlock
                </button>
              )}
            </li>
          );
        })}
      </ul>

      {remaining <= 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">
          You&apos;ve used all your lead unlocks for this month. Extra unlocks
          will be purchasable — coming with the credits backend.
        </p>
      ) : null}
    </div>
  );
}
