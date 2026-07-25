import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { TwoToneHeading } from "@/components/patterns/two-tone-heading";
import { SignUpForm } from "@/features/auth/sign-up-form";

export const metadata: Metadata = { title: "Create account" };

/**
 * Two-part signup: the form on the left, a social-proof panel on the right.
 * Full-bleed — it lives in its own route group so it escapes the centred-card
 * (auth) layout that sign-in and forgot-password still use.
 *
 * The right panel is skeleton social proof: placeholder tiles standing in for
 * partner / featured-startup logos until real assets exist.
 */

const trustLogos = [
  "Zerodha",
  "Razorpay",
  "CRED",
  "Groww",
  "Meesho",
  "Zepto",
  "PhonePe",
  "Postman",
  "Swiggy",
  "Urban Company",
  "upGrad",
  "BrowserStack",
];

export default function SignUpPage() {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      {/* Left — form */}
      <div className="flex flex-col px-6 py-8 sm:px-10 lg:px-16 lg:py-12">
        <header>
          <Logo />
        </header>

        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-10">
          <div className="space-y-2">
            <TwoToneHeading lead="Welcome to" strong="WeCos." />
            <p className="text-sm leading-relaxed text-muted-foreground">
              Turn your idea into a validated startup — powered by AI systems,
              guided by human mentors. Free to join, no card.
            </p>
          </div>

          <div className="mt-8">
            <SignUpForm />
          </div>

          <p className="mt-6 text-center text-xs leading-relaxed text-muted-foreground">
            By signing up, you agree to our{" "}
            <Link href="/terms" className="underline underline-offset-2 hover:text-foreground">
              terms
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline underline-offset-2 hover:text-foreground">
              privacy policy
            </Link>
            .
          </p>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/sign-in" className="font-medium text-primary hover:underline">
              Log in here →
            </Link>
          </p>
        </div>
      </div>

      {/* Right — social proof */}
      <aside className="relative hidden overflow-hidden bg-muted/50 lg:flex lg:flex-col lg:justify-center lg:px-12">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_70%_20%,color-mix(in_oklch,var(--primary)_14%,transparent),transparent)]"
        />

        <div className="relative mx-auto w-full max-w-md">
          <p className="mb-6 text-center text-sm font-medium text-muted-foreground">
            The founders building India&apos;s next startups are here
          </p>

          <div className="grid grid-cols-3 overflow-hidden rounded-xl border border-border bg-card/60">
            {trustLogos.map((name, i) => (
              <div
                key={name}
                className={cellClass(i, trustLogos.length)}
              >
                <span className="text-sm font-semibold tracking-tight text-foreground/70">
                  {name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}

/** Grid cell with hairline borders that don't double up on the outer edges. */
function cellClass(i: number, total: number) {
  const cols = 3;
  const lastRowStart = Math.floor((total - 1) / cols) * cols;
  const notLastCol = (i + 1) % cols !== 0;
  const notLastRow = i < lastRowStart;
  return [
    "grid h-20 place-items-center px-2 text-center",
    notLastCol && "border-r border-border",
    notLastRow && "border-b border-border",
  ]
    .filter(Boolean)
    .join(" ");
}
