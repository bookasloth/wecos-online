import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { TwoToneHeading } from "@/components/patterns/two-tone-heading";
import { ForgotPasswordForm } from "@/features/auth/forgot-password-form";

export const metadata: Metadata = { title: "Reset password" };

export default function ForgotPasswordPage() {
  return (
    <div className="space-y-7">
      <div className="space-y-2">
        <TwoToneHeading lead="Reset your" strong="password." />
        <p className="text-sm leading-relaxed text-muted-foreground">
          Enter the email you signed up with and we&apos;ll send a reset link.
        </p>
      </div>

      <ForgotPasswordForm />

      <p className="text-center text-sm">
        <Link
          href="/sign-in"
          className="inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
