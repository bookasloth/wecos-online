import type { ReactNode } from "react";
import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { siteConfig } from "@/config/site";

/**
 * Auth shell — a single centred card on a quiet surface.
 *
 * Deliberately the least decorated screen in the product. Someone here is trying
 * to get in, not be sold to; the only job is to make the form obvious. The
 * background carries one soft brand wash so the page isn't sterile, and nothing
 * else competes with the card.
 */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-dvh flex-col bg-muted/40">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(70%_50%_at_50%_-10%,color-mix(in_oklch,var(--primary)_10%,transparent),transparent)]"
      />

      <header className="px-6 py-6">
        <Logo />
      </header>

      <main className="flex flex-1 items-start justify-center px-4 pb-16 sm:items-center sm:pb-24">
        <div className="w-full max-w-[26rem]">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card sm:p-8">
            {children}
          </div>

          <p className="mt-6 text-center text-xs leading-relaxed text-muted-foreground">
            By continuing you agree to the{" "}
            <Link href="/terms" className="underline underline-offset-2 hover:text-foreground">
              terms
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline underline-offset-2 hover:text-foreground">
              privacy policy
            </Link>
            .
          </p>
        </div>
      </main>

      <footer className="px-6 pb-6 text-center text-xs text-muted-foreground">
        {siteConfig.name} — {siteConfig.tagline}
      </footer>
    </div>
  );
}
