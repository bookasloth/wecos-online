"use client";

/**
 * The prompt every blocked action renders instead of silently disappearing.
 * A gate that just hides teaches the user nothing; this names the tier that
 * unblocks the action and links to checkout. See docs/AUTHORIZATION.md.
 *
 * Usage:
 *   const canList = useCan("venture.list");
 *   return canList ? <ListButton /> : <Upgrade capability="venture.list" />;
 */

import Link from "next/link";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { tierById } from "@/config/site";
import { tierForCapability, type Capability } from "@/config/tiers";

export function Upgrade({
  capability,
  title,
  children,
  className,
}: {
  capability: Capability;
  /** Optional heading; defaults to naming the tier. */
  title?: string;
  /** Optional explanation of what the feature does. */
  children?: React.ReactNode;
  className?: string;
}) {
  const tierId = tierForCapability(capability);
  const tier = tierId ? tierById(tierId) : null;

  return (
    <div
      className={cn(
        "flex flex-col items-start gap-3 rounded-xl border border-primary/30 bg-card p-5",
        className,
      )}
    >
      <div className="flex items-center gap-2 text-sm font-medium text-primary">
        <Lock className="size-4" />
        {title ?? (tier ? `A ${tier.name} feature` : "Staff only")}
      </div>

      {children ? (
        <p className="text-sm text-muted-foreground">{children}</p>
      ) : null}

      {tier ? (
        <Link
          href="/dashboard/membership"
          className={cn(buttonVariants({ size: "sm" }))}
        >
          Upgrade to {tier.name}
        </Link>
      ) : null}
    </div>
  );
}
