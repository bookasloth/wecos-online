import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { TwoToneHeading } from "@/components/patterns/two-tone-heading";
import { SignUpForm } from "@/features/auth/sign-up-form";
import { SocialProofPanel } from "@/features/auth/social-proof-panel";

export const metadata: Metadata = { title: "Create account" };

/**
 * Two-part signup: the form on the left, a social-proof panel on the right.
 * Full-bleed — it lives in its own route group so it escapes the centred-card
 * (auth) layout that forgot-password still uses.
 */
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
      <SocialProofPanel headline="The founders building India's next startups are here" />
    </div>
  );
}
