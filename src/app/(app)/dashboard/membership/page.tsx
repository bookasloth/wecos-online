"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Check, Sparkles } from "lucide-react";
import { cn, formatInr } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { DashboardHeader } from "@/components/app/dashboard-header";
import { Modal } from "@/components/ui/modal";
import {
  pricing,
  studioDiscountPct,
  tiers,
  tierById,
  type TierId,
  type Tier,
} from "@/config/site";
import { useAppStore } from "@/lib/store/app-store";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

/** Load Razorpay Checkout once, lazily. Resolves false if the script fails. */
let razorpayScript: Promise<boolean> | null = null;
function loadRazorpay(): Promise<boolean> {
  if (typeof window === "undefined") return Promise.resolve(false);
  if (window.Razorpay) return Promise.resolve(true);
  if (!razorpayScript) {
    razorpayScript = new Promise((resolve) => {
      const s = document.createElement("script");
      s.src = "https://checkout.razorpay.com/v1/checkout.js";
      s.onload = () => resolve(true);
      s.onerror = () => {
        razorpayScript = null;
        resolve(false);
      };
      document.body.appendChild(s);
    });
  }
  return razorpayScript;
}

/**
 * What each paid tier adds *over the one below it*. Listing the delta rather
 * than repeating everything is what makes a four-tier table readable — Auth0's
 * pricing cards carry 12+ bullets each and are unscannable as a result.
 */
const tierAdds: Record<TierId, string[]> = {
  free: [
    "Your profile at wecos.in/yourname",
    "The founder feed and city circles",
    "5 connection requests a month",
  ],
  network: [
    "Unlimited connections and messages",
    "See who viewed your profile",
    "Full profile — skills, links, work history",
    `${studioDiscountPct.network}% off studio packages`,
  ],
  venture: [
    "List your startup in the directory",
    "Collect leads, with a lead inbox",
    "List your business as a studio provider",
    `${studioDiscountPct.venture}% off studio packages`,
    "One call with the WeCos founder",
  ],
  circle: [
    "Create events and host a Coffee Club",
    "Free entry to every masterclass",
    `${studioDiscountPct.circle}% off studio packages`,
    "Partner brand perks",
    "Featured placement",
  ],
};

const paidTiers = tiers.filter((t) => t.priceInr > 0);

export default function MembershipPage() {
  const membership = useAppStore((s) => s.membership);
  const profile = useAppStore((s) => s.profile);
  const activateMembership = useAppStore((s) => s.activateMembership);
  const cancelMembership = useAppStore((s) => s.cancelMembership);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [paying, setPaying] = useState<TierId | null>(null);

  const current = membership ? tierById(membership.tier) : tierById("free");

  /** Razorpay Checkout for a tier: order → pay → server-verify → activate. */
  const pay = async (tier: Tier) => {
    setPaying(tier.id);
    try {
      const loaded = await loadRazorpay();
      if (!loaded || !window.Razorpay) {
        toast.error("Couldn't load checkout. Check your connection and retry.");
        return;
      }

      const orderRes = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier: tier.id }),
      });
      if (!orderRes.ok) {
        toast.error("Couldn't start payment. Try again.");
        return;
      }
      const order = (await orderRes.json()) as {
        orderId: string;
        amount: number;
        currency: string;
        keyId: string;
      };

      const rzp = new window.Razorpay({
        key: order.keyId,
        order_id: order.orderId,
        amount: order.amount,
        currency: order.currency,
        name: "WeCos",
        description: `${tier.name} membership · 1 year`,
        prefill: profile?.email
          ? { email: profile.email, name: profile.fullName }
          : undefined,
        handler: async (resp: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          try {
            const verifyRes = await fetch("/api/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(resp),
            });
            const data = (await verifyRes.json()) as { ok?: boolean };
            if (!verifyRes.ok || !data.ok) throw new Error("verify failed");
          } catch {
            toast.error(
              "Payment couldn't be verified. If you were charged, contact support.",
            );
            return;
          }
          activateMembership(tier.id);
          toast.success(`You're on ${tier.name}.`);
        },
      });
      rzp.open();
    } finally {
      setPaying(null);
    }
  };

  return (
    <div className="space-y-8">
      <DashboardHeader
        title="Membership"
        description="What you're on, and what the next tier adds."
      />

      {/* Current state */}
      <section
        className={cn(
          "rounded-xl border bg-card",
          membership ? "border-primary/40" : "border-border",
        )}
      >
        <div className="flex flex-wrap items-end justify-between gap-4 p-6">
          <div>
            <div
              className={cn(
                "flex items-center gap-2 text-sm font-medium",
                membership ? "text-primary" : "text-muted-foreground",
              )}
            >
              <Sparkles className="size-4" />
              {membership ? `${current.name} member` : "Free tier"}
            </div>
            <p className="mt-3 text-3xl font-normal tracking-tight">
              {membership ? formatInr(membership.pricePaidInr) : formatInr(0)}
              <span className="text-base text-muted-foreground"> / year</span>
            </p>
            {membership?.foundingSeat ? (
              <p className="mt-2 text-sm">
                <span className="rounded-[var(--radius-control)] bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground">
                  Founding member · Seat {membership.foundingSeat} of{" "}
                  {pricing.foundingSeats}
                </span>
              </p>
            ) : null}
          </div>

          {membership ? (
            <dl className="text-sm">
              <div className="flex gap-2">
                <dt className="text-muted-foreground">Started</dt>
                <dd>{new Date(membership.startedAt).toLocaleDateString("en-IN")}</dd>
              </div>
              <div className="mt-1 flex gap-2">
                <dt className="text-muted-foreground">Renews</dt>
                <dd>{new Date(membership.renewsAt).toLocaleDateString("en-IN")}</dd>
              </div>
            </dl>
          ) : null}
        </div>

        {membership ? (
          <div className="flex flex-wrap gap-3 border-t border-border p-6">
            <Link href="/studios" className={cn(buttonVariants({ size: "sm" }))}>
              Use your {studioDiscountPct[membership.tier]}% discount
            </Link>
            <button
              type="button"
              onClick={() => setConfirmCancel(true)}
              className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
            >
              Cancel membership
            </button>
          </div>
        ) : null}
      </section>

      {/* Tiers */}
      <section>
        <h2 className="text-xl font-medium">
          {membership ? "Change your tier" : "Choose a tier"}
        </h2>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Annual. Each tier includes everything below it.
        </p>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {paidTiers.map((tier) => {
            const isCurrent = membership?.tier === tier.id;
            const featured = "featured" in tier && tier.featured;

            return (
              <div
                key={tier.id}
                className={cn(
                  "flex flex-col rounded-xl border bg-card p-6",
                  isCurrent
                    ? "border-primary"
                    : featured
                      ? "border-primary/40"
                      : "border-border",
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-medium">{tier.name}</h3>
                  {isCurrent ? (
                    <span className="rounded-[var(--radius-control)] bg-primary/10 px-2 py-0.5 text-2xs font-medium tracking-wide text-primary uppercase">
                      Current
                    </span>
                  ) : featured ? (
                    <span className="rounded-[var(--radius-control)] bg-accent px-2 py-0.5 text-2xs font-medium tracking-wide text-accent-foreground uppercase">
                      Most picked
                    </span>
                  ) : null}
                </div>

                <p className="mt-1 text-sm text-muted-foreground">{tier.promise}</p>

                <p className="mt-5 text-3xl font-normal tracking-tight">
                  {formatInr(tier.priceInr)}
                  <span className="text-sm text-muted-foreground"> / year</span>
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  About {formatInr(Math.round(tier.priceInr / 12))} a month
                </p>

                <ul className="mt-6 space-y-2.5 border-t border-border pt-6">
                  {tierAdds[tier.id].map((item) => (
                    <li key={item} className="flex gap-2.5 text-sm text-muted-foreground">
                      <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                      {item}
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  disabled={isCurrent || paying !== null}
                  onClick={() => pay(tier)}
                  className={cn(
                    buttonVariants({
                      variant: featured && !isCurrent ? "default" : "outline",
                    }),
                    "mt-6 w-full",
                  )}
                >
                  {isCurrent
                    ? "Current tier"
                    : paying === tier.id
                      ? "Opening checkout…"
                      : `Choose ${tier.name}`}
                </button>
              </div>
            );
          })}
        </div>

        <p className="mt-4 text-sm text-muted-foreground">
          Razorpay checkout runs in test mode — use a test card, no real money is
          charged. Founding seats are granted at Venture and above.
        </p>
      </section>

      {confirmCancel && (
        <Modal
          title="Cancel membership?"
          onClose={() => setConfirmCancel(false)}
          titleAction={
            <button
              type="button"
              aria-label="Close"
              onClick={() => setConfirmCancel(false)}
              className="text-2xl text-muted-foreground hover:text-foreground"
            >
              ×
            </button>
          }
        >
          <p className="mt-2 text-sm text-muted-foreground">
            You&apos;ll drop to the free tier at the end of your term. Your startup
            page goes unlisted and new leads stop arriving — nothing is deleted,
            and everything returns if you resubscribe.
          </p>
          <div className="mt-5 flex gap-3">
            <button
              type="button"
              onClick={() => setConfirmCancel(false)}
              className={cn(buttonVariants({ variant: "outline" }), "flex-1")}
            >
              Keep membership
            </button>
            <button
              type="button"
              onClick={() => {
                cancelMembership();
                setConfirmCancel(false);
                toast("Membership cancelled.");
              }}
              className={cn(buttonVariants({ variant: "destructive" }), "flex-1")}
            >
              Cancel it
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
