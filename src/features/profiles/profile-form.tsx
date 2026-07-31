"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { profileSchema, type ProfileValues } from "@/features/profiles/schema";
import { useAppStore } from "@/lib/store/app-store";
import { persistProfile } from "@/features/onboarding/persist";
import { Field } from "@/components/form/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export function ProfileForm({
  defaultValues,
  submitLabel = "Save changes",
  onSaved,
}: {
  defaultValues?: Partial<ProfileValues>;
  submitLabel?: string;
  onSaved?: () => void;
}) {
  const saveProfile = useAppStore((s) => s.saveProfile);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: "",
      headline: "",
      location: "",
      bio: "",
      avatarUrl: "",
      ...defaultValues,
    },
  });

  const onSubmit = async (values: ProfileValues) => {
    saveProfile(values); // instant local update + offline fallback
    try {
      await persistProfile({
        full_name: values.fullName,
        headline: values.headline,
        location: values.location,
        bio: values.bio,
        avatar_url: values.avatarUrl,
      });
    } catch (err) {
      toast.error(
        err instanceof Error ? `Couldn’t sync: ${err.message}` : "Couldn’t sync to server",
      );
      return;
    }
    toast.success("Profile saved");
    onSaved?.();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Field label="Full name" htmlFor="fullName" required error={errors.fullName?.message}>
        <Input id="fullName" autoComplete="name" placeholder="Aman Mehta" {...register("fullName")} />
      </Field>
      <Field
        label="Headline"
        htmlFor="headline"
        hint="One line on what you're building"
        error={errors.headline?.message}
      >
        <Input id="headline" placeholder="Founder, building in fintech" {...register("headline")} />
      </Field>
      <Field label="Location" htmlFor="location" error={errors.location?.message}>
        <Input id="location" placeholder="Mumbai, India" {...register("location")} />
      </Field>
      <Field label="Bio" htmlFor="bio" error={errors.bio?.message}>
        <Textarea id="bio" rows={4} placeholder="Tell other founders about yourself…" {...register("bio")} />
      </Field>
      <Field
        label="Avatar URL"
        htmlFor="avatarUrl"
        hint="Image upload arrives with the backend phase"
        error={errors.avatarUrl?.message}
      >
        <Input id="avatarUrl" placeholder="https://…" {...register("avatarUrl")} />
      </Field>

      <Button type="submit" disabled={isSubmitting} className="h-10">
        {submitLabel}
      </Button>
    </form>
  );
}
