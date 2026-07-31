"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Upload } from "lucide-react";
import { startupSchema, type StartupValues } from "@/features/startups/schema";
import { industries, stages } from "@/features/startups/constants";
import { useAppStore } from "@/lib/store/app-store";
import { persistStartup, uploadStartupImage } from "@/features/onboarding/persist";
import { Field } from "@/components/form/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const selectClass =
  "h-9 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50";

/** Native <select> registers "" for the empty option; convert it to undefined. */
const emptyToUndefined = (v: string) => (v === "" ? undefined : v);

export function StartupForm({
  defaultValues,
  submitLabel = "Save changes",
  onSaved,
}: {
  defaultValues?: Partial<StartupValues>;
  submitLabel?: string;
  onSaved?: () => void;
}) {
  const saveStartup = useAppStore((s) => s.saveStartup);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<StartupValues>({
    resolver: zodResolver(startupSchema),
    defaultValues: {
      name: "",
      tagline: "",
      website: "",
      location: "",
      description: "",
      logoUrl: "",
      ...defaultValues,
    },
  });

  const logoUrl = watch("logoUrl");
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const onSubmit = async (values: StartupValues) => {
    saveStartup(values); // instant local update + offline fallback
    try {
      await persistStartup({
        name: values.name,
        tagline: values.tagline,
        about: values.description,
        website: values.website,
        location: values.location,
        logoUrl: values.logoUrl,
        industry: values.industry,
      });
    } catch (err) {
      toast.error(
        err instanceof Error ? `Couldn’t sync: ${err.message}` : "Couldn’t sync to server",
      );
      return;
    }
    toast.success("Startup page saved");
    onSaved?.();
  };

  const onPickLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-picking the same file
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Choose an image file");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Logo must be under 2 MB");
      return;
    }
    setUploading(true);
    try {
      const url = await uploadStartupImage(file, "logo");
      setValue("logoUrl", url, { shouldValidate: true, shouldDirty: true });
      toast.success("Logo uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Field label="Startup name" htmlFor="name" required error={errors.name?.message}>
        <Input id="name" placeholder="Terracotta & Co." {...register("name")} />
      </Field>
      <Field
        label="Tagline"
        htmlFor="tagline"
        hint="A short, punchy description"
        error={errors.tagline?.message}
      >
        <Input id="tagline" placeholder="Sustainable homeware, reimagined" {...register("tagline")} />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Industry" htmlFor="industry" error={errors.industry?.message}>
          <select
            id="industry"
            className={selectClass}
            {...register("industry", { setValueAs: emptyToUndefined })}
          >
            <option value="">Select industry</option>
            {industries.map((i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Stage" htmlFor="stage" error={errors.stage?.message}>
          <select
            id="stage"
            className={selectClass}
            {...register("stage", { setValueAs: emptyToUndefined })}
          >
            <option value="">Select stage</option>
            {stages.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Website" htmlFor="website" error={errors.website?.message}>
          <Input id="website" placeholder="https://…" {...register("website")} />
        </Field>
        <Field label="Location" htmlFor="location" error={errors.location?.message}>
          <Input id="location" placeholder="Pune, India" {...register("location")} />
        </Field>
      </div>

      <Field label="About the startup" htmlFor="description" error={errors.description?.message}>
        <Textarea
          id="description"
          rows={5}
          placeholder="What are you building, for whom, and why now?"
          {...register("description")}
        />
      </Field>
      <Field
        label="Logo"
        htmlFor="logoUrl"
        hint="Upload a square image (PNG/JPG, under 2 MB), or paste a URL below"
        error={errors.logoUrl?.message}
      >
        <div className="flex items-center gap-4">
          <span className="grid size-16 shrink-0 place-items-center overflow-hidden rounded-xl border border-border bg-muted text-xs text-muted-foreground">
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoUrl} alt="Logo preview" className="size-full object-cover" />
            ) : (
              "No logo"
            )}
          </span>
          <div className="flex flex-col gap-2">
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onPickLogo}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={uploading}
              onClick={() => fileRef.current?.click()}
            >
              {uploading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Upload className="size-4" />
              )}
              {uploading ? "Uploading…" : "Upload logo"}
            </Button>
            {logoUrl ? (
              <button
                type="button"
                onClick={() => setValue("logoUrl", "", { shouldDirty: true })}
                className="text-left text-xs text-muted-foreground underline-offset-2 hover:underline"
              >
                Remove
              </button>
            ) : null}
          </div>
        </div>
        <Input
          id="logoUrl"
          placeholder="https://… (optional)"
          className="mt-3"
          {...register("logoUrl")}
        />
      </Field>

      <Button type="submit" disabled={isSubmitting} className="h-10">
        {submitLabel}
      </Button>
    </form>
  );
}
