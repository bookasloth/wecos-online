"use client";

import { Logo } from "@/components/brand/logo";
import { OnboardingFlow } from "@/features/onboarding/onboarding-flow";

/**
 * Onboarding shell. Deliberately outside the dashboard chrome — no sidebar, no
 * nav, nothing to click away to. Three steps, then straight into the feed.
 */
export default function OnboardingPage() {
  return (
    <div className="min-h-dvh bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex h-16 max-w-5xl items-center px-4 sm:px-6">
          <Logo />
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
        <OnboardingFlow />
      </main>
    </div>
  );
}
