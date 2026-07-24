"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { signUpSchema, type SignUpValues } from "@/features/auth/schema";
import { useAppStore } from "@/lib/store/app-store";
import { Field } from "@/components/form/field";
import { Input } from "@/components/ui/input";
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

  const onSubmit = (values: SignUpValues) => {
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
        <Input
          id="password"
          type="password"
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
