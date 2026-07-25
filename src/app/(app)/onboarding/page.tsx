"use client";

import { Logo } from "@/components/brand/logo";
import { OnboardingFlow } from "@/features/onboarding/onboarding-flow";

/**
 * Onboarding shell. Deliberately outside the dashboard chrome — no sidebar, no
 * nav, nothing to click away to. A slim brand header, then a full-width
 * two-part flow: the active step on the left, a live profile preview on the
 * right. Five steps, then straight into the feed.
 */
export default function OnboardingPage() {
  return (
    <div className="min-h-dvh bg-background">
      <header className="border-b border-border">
        <div className="flex h-16 items-center px-4 sm:px-8 lg:px-12">
          <Logo />
        </div>
      </header>

      <OnboardingFlow />
    </div>
  );
}
