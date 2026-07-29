"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { MailCheck } from "lucide-react";
import { signUpSchema, type SignUpValues } from "@/features/auth/schema";
import { useAppStore } from "@/lib/store/app-store";
import { createClient } from "@/lib/supabase/client";
import { Field } from "@/components/form/field";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/form/password-input";
import { Button } from "@/components/ui/button";
import { SocialAuth } from "@/features/auth/social-auth";

export function SignUpForm() {
  const router = useRouter();
  const signUp = useAppStore((s) => s.signUp);
  // Set once sign-up succeeds but no session came back (email confirmation on).
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);
  const [resending, setResending] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { fullName: "", email: "", password: "" },
  });

  const onSubmit = async (values: SignUpValues) => {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: { data: { full_name: values.fullName } },
    });
    if (error) {
      toast.error(error.message);
      return;
    }
    // Mirror into the store so the current UI works; the DB profile row is
    // created by the handle_new_user trigger.
    signUp({ fullName: values.fullName, email: values.email });
    if (data.session) {
      toast.success("Account created");
      router.push("/onboarding");
    } else {
      // Email-confirmation is on — no session yet. Show the pending screen
      // instead of a fire-and-forget toast that leaves the user stranded.
      setPendingEmail(values.email);
    }
  };

  const resend = async () => {
    if (!pendingEmail) return;
    setResending(true);
    const { error } = await createClient().auth.resend({
      type: "signup",
      email: pendingEmail,
    });
    setResending(false);
    toast[error ? "error" : "success"](
      error ? error.message : "Confirmation email sent again.",
    );
  };

  if (pendingEmail) {
    return (
      <div className="rounded-xl border border-border bg-card p-6 text-center">
        <span className="mx-auto grid size-12 place-items-center rounded-full bg-accent text-accent-foreground">
          <MailCheck className="size-6" />
        </span>
        <h2 className="mt-4 text-lg font-medium">Confirm your email</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          We sent a confirmation link to{" "}
          <span className="font-medium text-foreground">{pendingEmail}</span>.
          Click it, then sign in.
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <Link href="/sign-in" className="w-full">
            <Button size="lg" className="w-full">
              Go to sign in
            </Button>
          </Link>
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="w-full"
            disabled={resending}
            onClick={resend}
          >
            {resending ? "Resending…" : "Resend email"}
          </Button>
          <button
            type="button"
            onClick={() => setPendingEmail(null)}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Wrong email? Start over
          </button>
        </div>
        <p className="mt-5 text-xs text-muted-foreground">
          Didn&apos;t get it? Check spam, or resend. Delivery depends on the
          project&apos;s email setup.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Field label="Full name" htmlFor="fullName" error={errors.fullName?.message}>
        <Input id="fullName" autoComplete="name" placeholder="Aman Mehta" {...register("fullName")} />
      </Field>
      <Field label="Email" htmlFor="email" error={errors.email?.message}>
        <Input id="email" type="email" autoComplete="email" placeholder="you@example.com" {...register("email")} />
      </Field>
      <Field
        label="Password"
        htmlFor="password"
        hint="At least 8 characters"
        error={errors.password?.message}
      >
        <PasswordInput
          id="password"
          autoComplete="new-password"
          placeholder="••••••••"
          {...register("password")}
        />
      </Field>
      <Button type="submit" disabled={isSubmitting} size="lg" className="w-full">
        {isSubmitting ? "Creating account…" : "Create free account"}
      </Button>

      {/* Terms live in the auth layout so every screen carries them once. */}
      <SocialAuth label="Sign up" />
    </form>
  );
}
