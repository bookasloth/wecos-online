"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { signInSchema, type SignInValues } from "@/features/auth/schema";
import { industries } from "@/features/startups/constants";
import type { StartupValues } from "@/features/startups/schema";
import { tierById, type TierId } from "@/config/site";
import { useAppStore } from "@/lib/store/app-store";
import { createClient } from "@/lib/supabase/client";
import { Field } from "@/components/form/field";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/form/password-input";
import { Button } from "@/components/ui/button";
import { SocialAuth } from "@/features/auth/social-auth";

export function SignInForm() {
  const router = useRouter();
  const signIn = useAppStore((s) => s.signIn);
  const hydrateFromRemote = useAppStore((s) => s.hydrateFromRemote);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: SignInValues) => {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });
    if (error) {
      toast.error(error.message);
      return;
    }
    signIn({ email: values.email });
    toast.success("Welcome back");

    // Rehydrate from Supabase so a returning user (fresh browser / expired
    // session) isn't wrongly bounced back through onboarding. If they have a
    // profile row, restore it and go to the dashboard; otherwise onboard.
    const userId = data.user?.id;
    let destination = "/dashboard";
    if (userId) {
      const { data: prof } = await supabase
        .from("profiles")
        .select("id,handle,full_name,headline,bio,avatar_url,location")
        .eq("id", userId)
        .maybeSingle();

      if (prof?.handle) {
        const { data: st } = await supabase
          .from("startups")
          .select("id,slug,name,tagline,about,logo_url,website,city,topics,founded_year,team_size,service_category,details")
          .eq("owner_id", userId)
          .maybeSingle();

        const { data: mem } = await supabase
          .from("memberships")
          .select("tier,status,current_period_start,current_period_end")
          .eq("user_id", userId)
          .maybeSingle();
        const membership =
          mem && mem.status === "active" && mem.tier !== "free"
            ? {
                tier: mem.tier as TierId,
                status: "active" as const,
                startedAt: mem.current_period_start ?? "",
                renewsAt: mem.current_period_end ?? "",
                pricePaidInr: tierById(mem.tier as TierId).priceInr,
              }
            : null;

        hydrateFromRemote({
          profile: {
            id: prof.id,
            email: values.email,
            handle: prof.handle,
            fullName: prof.full_name ?? "",
            headline: prof.headline ?? "",
            location: prof.location ?? "",
            bio: prof.bio ?? "",
            avatarUrl: prof.avatar_url ?? "",
          },
          startup: st
            ? {
                id: st.id,
                slug: st.slug,
                name: st.name,
                tagline: st.tagline ?? "",
                description: st.about ?? "",
                logoUrl: st.logo_url ?? "",
                website: st.website ?? "",
                location: st.city ?? "",
                industry: (industries as readonly string[]).includes(st.topics?.[0] ?? "")
                  ? (st.topics![0] as StartupValues["industry"])
                  : undefined,
                foundedYear: st.founded_year ?? undefined,
                teamSize: st.team_size ?? undefined,
                serviceCategory: (st.service_category ??
                  "") as StartupValues["serviceCategory"],
                details: st.details ?? undefined,
              }
            : null,
          membership,
        });
      } else {
        destination = "/onboarding";
      }
    }

    router.push(destination);
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Field label="Email" htmlFor="email" error={errors.email?.message}>
        <Input id="email" type="email" autoComplete="email" placeholder="you@example.com" {...register("email")} />
      </Field>
      <Field label="Password" htmlFor="password" error={errors.password?.message}>
        <PasswordInput
          id="password"
          autoComplete="current-password"
          placeholder="••••••••"
          {...register("password")}
        />
      </Field>
      <div className="flex justify-end">
        <Link
          href="/forgot-password"
          className="text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          Forgot password?
        </Link>
      </div>
      <Button type="submit" disabled={isSubmitting} size="lg" className="w-full">
        {isSubmitting ? "Signing in…" : "Sign in"}
      </Button>

      <SocialAuth label="Sign in" />
    </form>
  );
}
