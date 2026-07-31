"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Lock, Loader2, Mail, MapPin, Phone, Inbox } from "lucide-react";
import { DashboardHeader } from "@/components/app/dashboard-header";
import { Upgrade } from "@/components/authz/upgrade";
import { useCan } from "@/lib/authz/use-can";
import { createClient } from "@/lib/supabase/client";

/**
 * Provider lead inbox — REAL. Gated by `lead.view` (Venture+): free/network see
 * the upgrade wall, paid tiers see the masked list.
 *
 * Masking is enforced server-side, not here: `lead_previews` is a view that
 * exposes only non-contact fields for leads in the provider's category. A lead's
 * contact does not exist in any payload until `unlock_lead()` spends a credit and
 * records the unlock (idempotent, never double-charges). Credits come from the
 * verified-payment grant (see the Razorpay verify route).
 */

type Preview = {
  id: string;
  category: string | null;
  city: string | null;
  budget: string | null;
  timeline: string | null;
  target_package: string | null;
  created_at: string;
  unlocked_by_me: boolean;
};
type Contact = {
  id: string;
  buyer_name: string | null;
  buyer_email: string | null;
  buyer_phone: string | null;
  message: string | null;
};

const BUDGET: Record<string, string> = {
  under_25k: "Under ₹25k",
  "25k_50k": "₹25k–50k",
  "50k_1l": "₹50k–1L",
  "1l_plus": "₹1L+",
  not_sure: "Budget not sure",
};
const TIMELINE: Record<string, string> = {
  now: "Starting now",
  within_month: "Within a month",
  exploring: "Exploring",
};
const cap = (s: string | null) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : "");

export default function LeadsPage() {
  const canView = useCan("lead.view");
  const willFetch = canView && !!process.env.NEXT_PUBLIC_SUPABASE_URL;
  // Start "loading" only when we'll actually fetch — avoids a synchronous
  // setState in the effect for the free/unconfigured path.
  const [loading, setLoading] = useState(willFetch);
  const [previews, setPreviews] = useState<Preview[]>([]);
  const [contacts, setContacts] = useState<Record<string, Contact>>({});
  const [balance, setBalance] = useState(0);
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    if (!willFetch) return;
    let active = true;
    (async () => {
      const supabase = createClient();
      // lead_previews: masked, RLS-scoped to my category. leads: RLS returns only
      // the rows I've already unlocked (full contact). credit_ledger: my balance.
      const [{ data: rows }, { data: full }, { data: ledger }] = await Promise.all([
        supabase.from("lead_previews").select("*").order("created_at", { ascending: false }),
        supabase.from("leads").select("id,buyer_name,buyer_email,buyer_phone,message"),
        supabase.from("credit_ledger").select("delta"),
      ]);
      if (!active) return;
      setPreviews((rows as Preview[]) ?? []);
      setContacts(
        Object.fromEntries(((full as Contact[]) ?? []).map((r) => [r.id, r])),
      );
      setBalance(((ledger as { delta: number }[]) ?? []).reduce((s, r) => s + (r.delta ?? 0), 0));
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [willFetch]);

  const unlock = async (id: string) => {
    if (busy || balance <= 0) return;
    setBusy(id);
    const supabase = createClient();
    const { data, error } = await supabase.rpc("unlock_lead", { p_lead: id });
    setBusy(null);
    if (error) {
      const msg = error.message || "";
      toast.error(
        msg.includes("insufficient")
          ? "No lead credits left this month."
          : msg.includes("not a provider")
            ? "List your business as a provider to unlock leads."
            : "Couldn't unlock this lead. Try again.",
      );
      return;
    }
    const lead = (Array.isArray(data) ? data[0] : data) as Contact;
    setContacts((c) => ({ ...c, [id]: lead }));
    setPreviews((p) => p.map((x) => (x.id === id ? { ...x, unlocked_by_me: true } : x)));
    setBalance((b) => Math.max(0, b - 1));
    toast.success("Lead unlocked.");
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
            {balance} credit{balance === 1 ? "" : "s"} left
          </span>
        }
      />

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      ) : previews.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 px-6 py-16 text-center">
          <span className="grid size-12 place-items-center rounded-xl bg-accent text-accent-foreground">
            <Inbox className="size-6" />
          </span>
          <h2 className="mt-4 text-lg font-semibold">No leads yet</h2>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Enquiries matching your service category will appear here. Make sure
            your startup is listed as a provider.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {previews.map((lead) => {
            const contact = contacts[lead.id];
            const isUnlocked = lead.unlocked_by_me;
            const noCredits = balance <= 0;
            return (
              <li
                key={lead.id}
                className="flex flex-wrap items-start justify-between gap-4 rounded-xl border border-border bg-card p-4"
              >
                <div className="min-w-0">
                  <p className="font-medium">
                    {cap(lead.category)}
                    {lead.target_package ? ` · ${lead.target_package}` : ""}
                  </p>
                  {isUnlocked && contact ? (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {contact.buyer_name ? `${contact.buyer_name} — ` : ""}
                      {contact.message}
                    </p>
                  ) : (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {[BUDGET[lead.budget ?? ""], TIMELINE[lead.timeline ?? ""]]
                        .filter(Boolean)
                        .join(" · ") || "New enquiry"}
                    </p>
                  )}
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    {lead.city ? (
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="size-3.5" />
                        {lead.city}
                      </span>
                    ) : null}
                    {isUnlocked && contact ? (
                      <>
                        <span className="inline-flex items-center gap-1">
                          <Mail className="size-3.5" />
                          {contact.buyer_email}
                        </span>
                        {contact.buyer_phone ? (
                          <span className="inline-flex items-center gap-1">
                            <Phone className="size-3.5" />
                            {contact.buyer_phone}
                          </span>
                        ) : null}
                      </>
                    ) : (
                      <span className="inline-flex items-center gap-1">
                        <Mail className="size-3.5" />
                        •••••@•••••
                      </span>
                    )}
                    <span>{new Date(lead.created_at).toLocaleDateString()}</span>
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
                    disabled={noCredits || busy === lead.id}
                    title={noCredits ? "No lead credits left this month" : undefined}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-[var(--radius-control)] border border-border px-3 py-1.5 text-sm font-medium transition-colors enabled:hover:border-primary enabled:hover:text-primary disabled:text-muted-foreground"
                  >
                    {busy === lead.id ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : (
                      <Lock className="size-3.5" />
                    )}
                    Unlock
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {!loading && previews.length > 0 && balance <= 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">
          You&apos;ve used all your lead credits for this month. More arrive with
          your next renewal.
        </p>
      ) : null}
    </div>
  );
}
