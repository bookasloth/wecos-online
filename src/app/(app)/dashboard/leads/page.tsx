"use client";

import { Lock, Mail, MapPin } from "lucide-react";
import { DashboardHeader } from "@/components/app/dashboard-header";
import { Upgrade } from "@/components/authz/upgrade";
import { useCan } from "@/lib/authz/use-can";

/**
 * Provider lead inbox. Gated by `lead.view` (Venture+): free/network see the
 * upgrade wall, paid tiers see the masked lead list. Revealing a lead's contact
 * details is a separate capability (`lead.unlock`) wired later — until then the
 * Unlock button is a placeholder.
 *
 * ⚠️ MOCK: sample leads. Real leads come from the enquiry pipeline + a leads
 * table in the backend phase (see docs/prd/CRM_PRD.md). Contact fields are
 * masked here for display only; the real masking must happen in the query/
 * serializer server-side, never in the component.
 */
const SAMPLE_LEADS = [
  { id: "l1", name: "Ananya M.", need: "Performance marketing for a D2C skincare launch", city: "Mumbai", when: "2 days ago" },
  { id: "l2", name: "Rohit S.", need: "Monthly bookkeeping + GST filing for a seed-stage SaaS", city: "Pune", when: "4 days ago" },
  { id: "l3", name: "Priya K.", need: "Pvt Ltd incorporation and founder agreement", city: "Bangalore", when: "1 week ago" },
];

export default function LeadsPage() {
  const canView = useCan("lead.view");

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
      />
      <ul className="space-y-3">
        {SAMPLE_LEADS.map((lead) => (
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
                  •••••@•••••
                </span>
                <span>{lead.when}</span>
              </div>
            </div>
            <button
              type="button"
              disabled
              title="Unlocking leads arrives with lead.unlock"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-[var(--radius-control)] border border-border px-3 py-1.5 text-sm font-medium text-muted-foreground"
            >
              <Lock className="size-3.5" />
              Unlock
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
