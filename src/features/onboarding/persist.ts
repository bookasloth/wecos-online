import { createClient } from "@/lib/supabase/client";

/**
 * Persists onboarding data to Supabase for the signed-in user. The profile row
 * already exists (created by the handle_new_user trigger on sign-up) — we update
 * it. The startup is upserted (one per user). RLS allows a user to write only
 * their own rows.
 *
 * No-ops when Supabase isn't configured or nobody is signed in, so the flow
 * still works locally without a backend.
 */

const enabled = () =>
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!(
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

export async function persistProfile(fields: {
  full_name?: string;
  headline?: string;
  handle?: string;
  city_slug?: string;
  location?: string;
  needs?: string[];
  stage?: string;
}) {
  if (!enabled()) return;
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  // Drop empty values so we never blank out existing fields.
  const patch = Object.fromEntries(
    Object.entries(fields).filter(([, v]) =>
      Array.isArray(v) ? v.length > 0 : v != null && v !== "",
    ),
  );
  if (!Object.keys(patch).length) return;

  const { error } = await supabase.from("profiles").update(patch).eq("id", user.id);
  if (error) throw error;
}

export async function persistStartup(fields: {
  name: string;
  about?: string;
  logoUrl?: string;
  industry?: string;
}) {
  if (!enabled()) return;
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { error } = await supabase.from("startups").upsert(
    {
      owner_id: user.id,
      name: fields.name,
      slug: slugify(fields.name),
      about: fields.about || null,
      logo_url: fields.logoUrl || null,
      topics: fields.industry ? [fields.industry] : [],
    },
    { onConflict: "owner_id" },
  );
  if (error) throw error;
}
