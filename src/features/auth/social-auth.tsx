"use client";

import { FcGoogle } from "react-icons/fc";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { OrDivider } from "@/components/patterns/or-divider";

/**
 * Social sign-in.
 *
 * ⚠️ OFF until there is a backend. Google OAuth is a real conversion win — it
 * removes the password step entirely, which matters most on mobile — but it
 * needs a Supabase provider configured, and a button that looks real and does
 * nothing is worse than no button.
 *
 * Flip `SOCIAL_AUTH_ENABLED` once Supabase Auth is wired and the Google provider
 * is configured. Layout and spacing are already accounted for above.
 *
 * NOTE: adding Google means Google becomes an identity source alongside
 * email + password, so account linking (same email, two methods) needs a
 * decision first. See docs/DECISIONS.md.
 */
export const SOCIAL_AUTH_ENABLED = false;

export function SocialAuth({ label = "Continue" }: { label?: string }) {
  if (!SOCIAL_AUTH_ENABLED) return null;

  return (
    <div className="space-y-4">
      <OrDivider />
      <button
        type="button"
        className={cn(
          buttonVariants({ variant: "outline" }),
          "h-11 w-full gap-2.5 text-sm font-medium",
        )}
      >
        <FcGoogle className="size-4" />
        {label} with Google
      </button>
    </div>
  );
}
