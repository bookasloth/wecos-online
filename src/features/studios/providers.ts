import { createClient } from "@/lib/supabase/client";
import type { Listing } from "./catalog";

/**
 * Real service providers from Supabase — startups that opted into the Studios
 * directory (offers_services + a service_category, set via the startup edit
 * form). Mapped into the shared `Listing` shape so the existing ListingCard and
 * category helpers render them unchanged.
 *
 * No-ops to [] without Supabase, so the static catalog still stands alone.
 */
export async function fetchProviderListings(category?: string): Promise<Listing[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return [];
  let q = createClient()
    .from("startups")
    .select("slug,name,tagline,about,city,topics,verified,service_category")
    .eq("offers_services", true)
    .not("service_category", "is", null);
  if (category) q = q.eq("service_category", category);

  const { data, error } = await q.order("created_at", { ascending: false });
  if (error || !data) return [];

  return data.map((s) => ({
    slug: s.slug as string,
    name: s.name as string,
    category: s.service_category as string,
    tagline: (s.tagline as string | null) ?? "",
    pitch: (s.about as string | null) ?? (s.tagline as string | null) ?? "",
    deliverables: (s.topics as string[] | null) ?? [],
    packages: [],
    kind: "provider" as const,
    verified: !!s.verified,
    city: (s.city as string | null) ?? undefined,
  }));
}
