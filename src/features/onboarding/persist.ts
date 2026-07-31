import { createClient } from "@/lib/supabase/client";
import type { StartupDetails } from "@/features/startups/schema";

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
  tagline?: string;
  about?: string;
  website?: string;
  location?: string;
  logoUrl?: string;
  industry?: string;
}) {
  if (!enabled()) return;
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  // Only write the columns the form actually filled, so re-saving the basic
  // form never blanks rich fields set elsewhere (e.g. multi-value topics).
  // Upsert leaves omitted columns untouched on conflict.
  const optional: Record<string, unknown> = {
    tagline: fields.tagline,
    about: fields.about,
    website: fields.website,
    city: fields.location,
    logo_url: fields.logoUrl,
    topics: fields.industry ? [fields.industry] : undefined,
  };
  const patch = Object.fromEntries(
    Object.entries(optional).filter(([, v]) => v != null && v !== ""),
  );

  const { error } = await supabase.from("startups").upsert(
    {
      owner_id: user.id,
      name: fields.name,
      // ponytail: slug follows the name. Renaming a listed startup changes its
      // public URL — freeze the slug once listed when the rename flow lands.
      slug: slugify(fields.name),
      ...patch,
    },
    { onConflict: "owner_id" },
  );
  if (error) throw error;
}

/**
 * Merges rich page content (products/people/funding) into the `details` JSONB.
 * Reads current details first so editing one section never drops another (or
 * keys this form doesn't manage yet, like traction/updates).
 */
export async function persistStartupDetails(patch: StartupDetails) {
  if (!enabled()) return;
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { data } = await supabase
    .from("startups")
    .select("details")
    .eq("owner_id", user.id)
    .maybeSingle();

  const merged = { ...((data?.details as StartupDetails | null) ?? {}), ...patch };
  const { error } = await supabase
    .from("startups")
    .update({ details: merged })
    .eq("owner_id", user.id);
  if (error) throw error;
}

/** Public bucket for startup images (logo, later cover/gallery). */
const STARTUP_BUCKET = "startup-assets";

/**
 * Uploads a startup image to Supabase Storage under the owner's folder and
 * returns its public URL. RLS restricts writes to `{uid}/…` (see the
 * startup-assets bucket migration).
 */
export async function uploadStartupImage(
  file: File,
  kind: "logo" | "cover" = "logo",
): Promise<string> {
  if (!enabled()) throw new Error("Uploads aren’t available yet");
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Sign in to upload");

  const ext = (file.name.split(".").pop() || "png").toLowerCase();
  const path = `${user.id}/${kind}-${Date.now()}.${ext}`;
  const { error } = await supabase.storage
    .from(STARTUP_BUCKET)
    .upload(path, file, { cacheControl: "3600", upsert: true });
  if (error) throw error;

  return supabase.storage.from(STARTUP_BUCKET).getPublicUrl(path).data.publicUrl;
}
