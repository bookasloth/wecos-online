"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  resetPasswordSchema,
  type ResetPasswordValues,
} from "@/features/auth/schema";
import { Field } from "@/components/form/field";
import { PasswordInput } from "@/components/form/password-input";
import { Button } from "@/components/ui/button";

export function ResetPasswordForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirm: "" },
  });

  const onSubmit = () => {
    // Mock — the real update runs against Supabase Auth in the backend phase.
    toast.success("Password updated. You can sign in now.");
    router.push("/sign-in");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Field
        label="New password"
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
      <Field label="Confirm password" htmlFor="confirm" error={errors.confirm?.message}>
        <PasswordInput
          id="confirm"
          autoComplete="new-password"
          placeholder="••••••••"
          {...register("confirm")}
        />
      </Field>
      <Button type="submit" disabled={isSubmitting} size="lg" className="w-full">
        {isSubmitting ? "Updating…" : "Update password"}
      </Button>
    </form>
  );
}
