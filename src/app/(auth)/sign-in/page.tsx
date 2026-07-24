import type { Metadata } from "next";
import Link from "next/link";
import { TwoToneHeading } from "@/components/patterns/two-tone-heading";
import { SignInForm } from "@/features/auth/sign-in-form";

export const metadata: Metadata = { title: "Sign in" };

export default function SignInPage() {
  return (
    <div className="space-y-7">
      <div className="space-y-2">
        <TwoToneHeading lead="Welcome" strong="back." />
        <p className="text-sm leading-relaxed text-muted-foreground">
          Sign in to continue to your WeCos workspace.
        </p>
      </div>

      <SignInForm />

      <p className="text-center text-sm text-muted-foreground">
        New here?{" "}
        <Link href="/sign-up" className="font-medium text-primary hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}
