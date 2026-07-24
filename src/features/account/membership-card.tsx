"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { cn, formatInr } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { pricing, memberDiscountPct, entryTier, tierById } from "@/config/site";
import { useAppStore } from "@/lib/store/app-store";

/** Compact membership status for the dashboard overview. */
export function MembershipCard() {
  const membership = useAppStore((s) => s.membership);

  if (membership) {
    return (
      <div className="rounded-xl border border-primary/40 bg-card p-6">
        <div className="flex items-center gap-2 text-sm font-medium text-primary">
          <Sparkles className="size-4" />
          Member
        </div>
        <p className="mt-3 text-2xl font-normal tracking-tight">
          {tierById(membership.tier).name}
        </p>
        {membership.foundingSeat ? (
          <p className="mt-1 text-sm text-muted-foreground tabular-nums">
            Founding seat {membership.foundingSeat} of {pricing.foundingSeats}
          </p>
        ) : null}
        <p className="mt-1 text-sm text-muted-foreground">
          Renews{" "}
          {new Date(membership.renewsAt).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </p>
        <Link
          href="/dashboard/membership"
          className={cn(buttonVariants({ variant: "outline", size: "sm" }), "mt-5")}
        >
          Manage membership
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <Sparkles className="size-4" />
        Membership
      </div>
      <p className="mt-3 text-lg font-medium">You&apos;re on the free tier.</p>
      <p className="mt-1 text-sm text-muted-foreground">
        From {formatInr(entryTier.priceInr)}/year — up to {memberDiscountPct}% off
        every studio, plus Coffee Clubs and the Marketplace.
      </p>
      <Link
        href="/dashboard/membership"
        className={cn(buttonVariants({ variant: "default", size: "sm" }), "mt-5")}
      >
        Become a member
      </Link>
    </div>
  );
}
