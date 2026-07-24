"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export type Step = { id: string; label: string; hint?: string };

/**
 * Onboarding step rail — the persistent left column showing where you are.
 *
 * Structure borrowed from Razorpay's merchant onboarding: a continuous progress
 * edge down the left, then a list of steps that read as done / current / ahead.
 * The value is that the list never moves — the founder can see the whole shape
 * of what's being asked before they start, which is what stops a multi-step
 * form feeling endless.
 *
 * Collapses to a slim progress bar plus "Step n of m" on mobile; a vertical rail
 * on a phone costs more height than it earns.
 */
export function StepRail({
  steps,
  current,
  className,
}: {
  steps: Step[];
  /** Index of the active step. Anything before it renders as complete. */
  current: number;
  className?: string;
}) {
  const pct = Math.round((current / steps.length) * 100);

  return (
    <>
      {/* Mobile */}
      <div className={cn("lg:hidden", className)}>
        <div className="flex items-baseline justify-between">
          <p className="text-sm font-medium">{steps[current]?.label}</p>
          <p className="text-xs text-muted-foreground tabular-nums">
            Step {current + 1} of {steps.length}
          </p>
        </div>
        <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full bg-primary transition-[width] duration-500"
            style={{ width: `${Math.max(pct, 8)}%` }}
          />
        </div>
      </div>

      {/* Desktop */}
      <nav aria-label="Onboarding progress" className={cn("hidden lg:block", className)}>
        <ol className="relative space-y-1 pl-6">
          {/* Continuous track + filled progress edge */}
          <span aria-hidden className="absolute inset-y-1 left-0 w-0.5 rounded-full bg-border" />
          <span
            aria-hidden
            className="absolute top-1 left-0 w-0.5 rounded-full bg-primary transition-[height] duration-500"
            style={{ height: `calc(${Math.max(pct, 6)}% )` }}
          />

          {steps.map((step, i) => {
            const done = i < current;
            const active = i === current;

            return (
              <li key={step.id}>
                <div
                  aria-current={active ? "step" : undefined}
                  className={cn(
                    "flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors",
                    active && "bg-accent/50",
                  )}
                >
                  <span
                    className={cn(
                      "mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border text-[10px] font-semibold tabular-nums",
                      done && "border-primary bg-primary text-primary-foreground",
                      active && "border-primary text-primary",
                      !done && !active && "border-border text-muted-foreground",
                    )}
                  >
                    {done ? <Check className="size-3" /> : i + 1}
                  </span>

                  <span className="min-w-0">
                    <span
                      className={cn(
                        "block text-sm font-medium",
                        active ? "text-foreground" : done ? "text-foreground/80" : "text-muted-foreground",
                      )}
                    >
                      {step.label}
                    </span>
                    {step.hint && active ? (
                      <span className="mt-0.5 block text-xs text-muted-foreground">
                        {step.hint}
                      </span>
                    ) : null}
                  </span>
                </div>
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
