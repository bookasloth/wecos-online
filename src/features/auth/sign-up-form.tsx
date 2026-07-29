"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
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
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { fullName: "", email: "", password: "" },
  });

  const onSubmit = async (values: SignUpValues) => {
    // Create the account server-side (admin API, email pre-confirmed) so no
    // confirmation email is sent — avoids Supabase's email rate limit that was
    // blocking sign-up. See /api/auth/sign-up.
    const res = await fetch("/api/auth/sign-up", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (!res.ok) {
      const { error } = (await res.json().catch(() => ({}))) as { error?: string };
      toast.error(
        res.status === 409
          ? "That email is already registered — try signing in."
          : error || "Couldn't create account. Try again.",
      );
      return;
    }

    // Sign in to establish the session (sets auth cookies).
    const { error: signInError } = await createClient().auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });
    if (signInError) {
      toast.error(signInError.message);
      return;
    }

    // Mirror into the local store so the current UI works; the DB profile row
    // is created by the handle_new_user trigger.
    signUp({ fullName: values.fullName, email: values.email });
    toast.success("Account created");
    router.push("/onboarding");
  };

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
