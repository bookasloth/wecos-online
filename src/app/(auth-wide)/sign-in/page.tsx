import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { TwoToneHeading } from "@/components/patterns/two-tone-heading";
import { SignInForm } from "@/features/auth/sign-in-form";
import { SocialProofPanel } from "@/features/auth/social-proof-panel";

export const metadata: Metadata = { title: "Sign in" };

/**
 * Two-part sign-in — mirrors the signup layout so the two auth pages read as
 * one system. Form left, shared social-proof panel right.
 */
export default function SignInPage() {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      {/* Left — form */}
      <div className="flex flex-col px-6 py-8 sm:px-10 lg:px-16 lg:py-12">
        <header>
          <Logo />
        </header>

        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-10">
          <div className="space-y-2">
            <TwoToneHeading lead="Welcome" strong="back." />
            <p className="text-sm leading-relaxed text-muted-foreground">
              Sign in to continue to your WeCos workspace.
            </p>
          </div>

          <div className="mt-8">
            <SignInForm />
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            New here?{" "}
            <Link href="/sign-up" className="font-medium text-primary hover:underline">
              Create an account →
            </Link>
          </p>
        </div>
      </div>

      {/* Right — social proof */}
      <SocialProofPanel headline="Join the founders building India's next startups" />
    </div>
  );
}
