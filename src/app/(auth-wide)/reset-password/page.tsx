import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { TwoToneHeading } from "@/components/patterns/two-tone-heading";
import { ResetPasswordForm } from "@/features/auth/reset-password-form";
import { PasswordTipsPanel } from "@/features/auth/auth-info-panels";

export const metadata: Metadata = { title: "Set a new password" };

export default function ResetPasswordPage() {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      {/* Left — form */}
      <div className="flex flex-col px-6 py-8 sm:px-10 lg:px-16 lg:py-12">
        <header>
          <Logo />
        </header>

        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-10">
          <div className="space-y-2">
            <TwoToneHeading lead="Set a" strong="new password." />
            <p className="text-sm leading-relaxed text-muted-foreground">
              Choose a new password for your WeCos account.
            </p>
          </div>

          <div className="mt-8">
            <ResetPasswordForm />
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            <Link
              href="/sign-in"
              className="inline-flex items-center gap-1.5 font-medium text-primary hover:underline"
            >
              <ArrowLeft className="size-4" />
              Back to sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Right — password tips */}
      <PasswordTipsPanel />
    </div>
  );
}
