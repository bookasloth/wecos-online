import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * The tinted right-hand panel shared by every auth page. Only the chrome lives
 * here — the gradient wash and centred column — so each page can drop in its
 * own content: the logo wall on sign-up/sign-in, a recovery explainer on
 * forgot-password, password tips on reset. Hidden below lg.
 */
export function AuthAside({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <aside
      className={cn(
        "relative hidden overflow-hidden bg-muted/50 lg:flex lg:flex-col lg:justify-center lg:px-12",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_70%_20%,color-mix(in_oklch,var(--primary)_14%,transparent),transparent)]"
      />
      <div className="relative mx-auto w-full max-w-md">{children}</div>
    </aside>
  );
}
