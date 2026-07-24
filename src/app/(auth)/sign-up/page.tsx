import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import { TwoToneHeading } from "@/components/patterns/two-tone-heading";
import { SignUpForm } from "@/features/auth/sign-up-form";

export const metadata: Metadata = { title: "Create account" };

/**
 * Registration is free and always will be — say so here rather than leaving the
 * visitor to wonder whether a price appears at the end. The three lines below
 * are what the free tier actually gives; see docs/FEATURES.md.
 */
const included = [
  "Your founder profile at wecos.in/yourname",
  "The founder feed and city circles",
  "Browse ventures, founders and studios",
];

export default function SignUpPage() {
  return (
    <div className="space-y-7">
      <div className="space-y-2">
        <TwoToneHeading lead="Create your" strong="WeCos account." />
        <p className="text-sm leading-relaxed text-muted-foreground">
          Free to join. No card, no trial clock.
        </p>
      </div>

      <ul className="space-y-2 rounded-xl border border-border bg-muted/40 p-4">
        {included.map((item) => (
          <li key={item} className="flex gap-2.5 text-sm text-muted-foreground">
            <Check className="mt-0.5 size-4 shrink-0 text-primary" />
            {item}
          </li>
        ))}
      </ul>

      <SignUpForm />

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/sign-in" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
